import { getTenant, getTenantByDomain, getPage } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { buildLlmsTxt } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/** llms.txt por tenant: /s/<slug>/llms.txt */
export async function GET(_req: Request, { params }: { params: { tenant: string } }) {
  let t = await getTenant(params.tenant)
  if (!t && params.tenant.includes('.')) t = await getTenantByDomain(params.tenant)
  if (!t) return new Response('Not found', { status: 404 })
  const data = (await getPage(t.slug, 'home')) ?? getSeed(t.blockSet)
  return new Response(buildLlmsTxt(t, data as Parameters<typeof buildLlmsTxt>[1]), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
