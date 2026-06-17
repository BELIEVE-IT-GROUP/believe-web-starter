/**
 * Store del CMS Believe Puck. Multi-tenant, self-hosted.
 *
 * ponytail: persistencia en archivos JSON bajo /data. Cero DB para el MVP.
 * Upgrade path: cambiar estas 6 funciones por queries Postgres cuando escale.
 */
import { promises as fs } from 'fs'
import path from 'path'
import type { Data } from '@measured/puck'

const DATA = path.join(process.cwd(), 'data')

export interface Tenant {
  slug: string
  name: string
  /** Qué set de bloques usa este tenant (p.ej. 'birdman'). */
  blockSet: string
  /** Overrides de tokens CSS (:root vars) por tenant. Opcional. */
  tokens?: Record<string, string>
  /** Dominios custom apuntados a este tenant (CNAME → puck). p.ej. ['www.cliente.com','cliente.com']. */
  domains?: string[]
  settings?: Record<string, unknown>
}

const tenantFile = (slug: string) => path.join(DATA, 'tenants', `${slug}.json`)
const pageFile = (tenant: string, slug: string) => path.join(DATA, 'pages', tenant, `${slug}.json`)

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as T
  } catch {
    return null
  }
}

export async function listTenants(): Promise<Tenant[]> {
  const dir = path.join(DATA, 'tenants')
  const files = await fs.readdir(dir).catch(() => [] as string[])
  const out: Tenant[] = []
  for (const f of files) {
    if (!f.endsWith('.json')) continue
    const t = await readJson<Tenant>(path.join(dir, f))
    if (t) out.push(t)
  }
  return out
}

export const getTenant = (slug: string) => readJson<Tenant>(tenantFile(slug))

/**
 * Resuelve un tenant por dominio custom (Host header). Normaliza a lowercase sin puerto.
 * ponytail: O(n) sobre todos los tenants — ok para decenas. Si escala a cientos,
 * mantener un índice domain→slug.
 */
export async function getTenantByDomain(host: string): Promise<Tenant | null> {
  const h = host.toLowerCase().split(':')[0]
  const tenants = await listTenants()
  return tenants.find((t) => (t.domains ?? []).some((d) => d.toLowerCase() === h)) ?? null
}

export const getPage = (tenant: string, slug: string) => readJson<Data>(pageFile(tenant, slug))

export async function savePage(tenant: string, slug: string, data: Data): Promise<void> {
  const file = pageFile(tenant, slug)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify(data, null, 2))
}

export async function listPages(tenant: string): Promise<string[]> {
  const dir = path.join(DATA, 'pages', tenant)
  const files = await fs.readdir(dir).catch(() => [] as string[])
  return files.filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
}
