import { getTenant, getTenantByDomain, getPage } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { agentJsonFor } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/** agent.json por tenant: /s/<slug>/agent.json (queda en el root del dominio custom). */
export async function GET(_req: Request, { params }: { params: { tenant: string } }) {
  let t = await getTenant(params.tenant)
  if (!t && params.tenant.includes('.')) t = await getTenantByDomain(params.tenant)
  if (!t) return new Response('Not found', { status: 404 })
  const data = (await getPage(t.slug, 'home')) ?? getSeed(t.blockSet)
  return Response.json(agentJsonFor(t, data as Parameters<typeof agentJsonFor>[1]))
}
