const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://cms.believe-global.com'
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || 'believe'

export async function fetchPayload<T = any>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const url = new URL(`${PAYLOAD_URL}/api/${path}`)
    url.searchParams.set('depth', '2')
    // Only add tenant filter if querying collections that have tenant
    if (!path.includes('?')) {
      url.searchParams.set('where[tenant][slug][equals]', TENANT_SLUG)
    } else {
      // Append tenant filter to existing query
      url.searchParams.set('where[tenant][slug][equals]', TENANT_SLUG)
    }

    const res = await fetch(url.toString(), {
      ...options,
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error(`Payload fetch error: ${res.status} ${url}`)
      return null
    }

    return res.json()
  } catch (err) {
    console.error('Payload fetch exception:', err)
    return null
  }
}

export async function getPageBySlug(slug: string) {
  const data = await fetchPayload<{ docs: any[] }>(`pages?where[slug][equals]=${encodeURIComponent(slug)}`)
  return data?.docs?.[0] || null
}

export async function getAllPages() {
  const data = await fetchPayload<{ docs: any[] }>('pages?limit=100')
  return data?.docs || []
}

export async function getPostBySlug(slug: string) {
  const data = await fetchPayload<{ docs: any[] }>(`posts?where[slug][equals]=${encodeURIComponent(slug)}`)
  return data?.docs?.[0] || null
}

export async function getAllPosts(limit = 100) {
  const data = await fetchPayload<{ docs: any[] }>(`posts?limit=${limit}&sort=-publishedAt`)
  return data?.docs || []
}

export async function getTenant() {
  const data = await fetchPayload<{ docs: any[] }>('tenants')
  return data?.docs?.find((t: any) => t.slug === TENANT_SLUG) || null
}
