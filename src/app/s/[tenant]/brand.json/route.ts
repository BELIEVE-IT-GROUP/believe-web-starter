import { getTenant, getTenantByDomain } from '@/cms/store'
import { loadBrandJson } from '@/lib/aos-store'

export const dynamic = 'force-dynamic'

/** brand.json por tenant: /s/<slug>/brand.json (Agent-Readable Brand Profile). */
export async function GET(_req: Request, { params }: { params: { tenant: string } }) {
  let t = await getTenant(params.tenant)
  if (!t && params.tenant.includes('.')) t = await getTenantByDomain(params.tenant)
  if (!t) return new Response('Not found', { status: 404 })
  const brand = await loadBrandJson(t.slug)
  if (!brand) return new Response('No brand profile', { status: 404 })
  return Response.json(brand)
}
