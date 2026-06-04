import fs from 'node:fs'
import path from 'node:path'

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const content = fs.readFileSync(filePath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue

    const [key, ...valueParts] = trimmed.split('=')
    if (process.env[key]) continue

    process.env[key] = valueParts.join('=').replace(/^["']|["']$/g, '')
  }
}

loadEnvFile(path.join(process.cwd(), '.env'))
loadEnvFile(path.join(process.cwd(), '.env.local'))

const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '')
const payloadUrl = (process.env.NEXT_PUBLIC_PAYLOAD_URL || '').replace(/\/$/, '')
const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || ''
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || ''
const revalidateSecret = process.env.REVALIDATE_SECRET || ''
const previewSecret = process.env.PREVIEW_SECRET || revalidateSecret

function required(name, value) {
  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }
}

function settingsUrl() {
  const search = new URLSearchParams()

  if (tenantSlug) {
    search.set('where[tenant][slug][equals]', tenantSlug)
  } else if (tenantId) {
    search.set('where[tenant][equals]', tenantId)
  } else {
    throw new Error('Missing NEXT_PUBLIC_TENANT_SLUG or NEXT_PUBLIC_TENANT_ID')
  }

  search.set('depth', '2')
  search.set('limit', '1')
  return `${payloadUrl}/api/settings?${search.toString()}`
}

async function request(label, url, init, validate) {
  console.log(`[smoke] ${label}: ${url}`)

  if (dryRun) return

  const response = await fetch(url, {
    redirect: 'manual',
    ...init,
    headers: {
      ...(init?.headers || {}),
    },
  })

  await validate(response)
}

async function expectStatus(response, validStatuses) {
  if (!validStatuses.includes(response.status)) {
    const body = await response.text()
    throw new Error(`Expected ${validStatuses.join('/')} but got ${response.status}: ${body.slice(0, 300)}`)
  }
}

if (!dryRun) {
  required('NEXT_PUBLIC_PAYLOAD_URL', payloadUrl)
  required('NEXT_PUBLIC_TENANT_SLUG or NEXT_PUBLIC_TENANT_ID', tenantSlug || tenantId)
  required('REVALIDATE_SECRET', revalidateSecret)
}

console.log('[smoke] Starting production smoke test')
if (dryRun) console.log('[smoke] Dry run: no network requests will be sent')

await request('frontend home', frontendUrl, undefined, async (response) => {
  await expectStatus(response, [200])
})

if (payloadUrl && (tenantSlug || tenantId)) {
  await request('CMS settings', settingsUrl(), undefined, async (response) => {
    await expectStatus(response, [200])
    const data = await response.json()
    if (!Array.isArray(data.docs) || data.docs.length < 1) {
      throw new Error('CMS settings returned no docs for this tenant')
    }
  })
} else {
  console.log('[smoke] CMS settings: skipped, missing NEXT_PUBLIC_PAYLOAD_URL or tenant env')
}

if (revalidateSecret) {
  await request(
    'ISR revalidate',
    `${frontendUrl}/api/revalidate`,
    {
      method: 'POST',
      body: JSON.stringify({
        secret: revalidateSecret,
        collection: 'settings',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    async (response) => {
      await expectStatus(response, [200, 207])
      const data = await response.json()
      if (!data.revalidated) {
        throw new Error(`Revalidation did not fully succeed: ${JSON.stringify(data)}`)
      }
    },
  )
} else {
  console.log('[smoke] ISR revalidate: skipped, missing REVALIDATE_SECRET')
}

if (previewSecret) {
  await request(
    'preview redirect',
    `${frontendUrl}/api/preview?secret=${encodeURIComponent(previewSecret)}&collection=pages&slug=home`,
    undefined,
    async (response) => {
      await expectStatus(response, [307, 308])
    },
  )
}

console.log('[smoke] OK')
