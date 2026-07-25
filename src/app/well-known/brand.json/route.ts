import { headers } from 'next/headers'
import { getTenantByDomain, listTenants } from '@/cms/store'
import { loadBrandJson } from '@/lib/aos-store'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/**
 * /.well-known/brand.json — Agent-Readable Brand Profile en el root del dominio.
 * - Dominio custom del cliente → brand.json de esa marca.
 * - Host compartido (puck): no se puede fusionar 4 marcas en un archivo → índice
 *   que apunta al brand.json de cada landing.
 */
export async function GET() {
  const host = (headers().get('host') || '').toLowerCase().split(':')[0]
  const t = await getTenantByDomain(host)
  if (t) {
    const brand = await loadBrandJson(t.slug)
    return brand ? Response.json(brand) : new Response('No brand profile', { status: 404 })
  }
  const tenants = await listTenants()
  return Response.json({
    note: 'Host compartido: brand.json es por marca. Usar el dominio custom de cada landing o los enlaces de abajo.',
    brands: tenants.map((x) => ({ name: x.name, brand_json: `${SITE_URL}/s/${x.slug}/brand.json` })),
  })
}
