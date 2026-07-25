import { headers } from 'next/headers'
import { getTenantByDomain, listTenants, getPage } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { agentJsonFor, aosOf, baseForTenant, SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/**
 * /.well-known/agent.json — discovery estructurado en el root del dominio.
 * - Dominio custom del cliente → agent.json de ese tenant.
 * - Host compartido (puck) → manifiesto agregado con las acciones de cada landing.
 */
export async function GET() {
  const host = (headers().get('host') || '').toLowerCase().split(':')[0]
  const t = await getTenantByDomain(host)
  if (t) {
    const data = (await getPage(t.slug, 'home')) ?? getSeed(t.blockSet)
    return Response.json(agentJsonFor(t, data as Parameters<typeof agentJsonFor>[1]))
  }
  const tenants = await listTenants()
  const sites = await Promise.all(
    tenants.map(async (x) => {
      const data = (await getPage(x.slug, 'home')) ?? getSeed(x.blockSet)
      const aos = aosOf(data as Parameters<typeof aosOf>[0])
      return {
        name: x.name,
        url: baseForTenant(x),
        ...(aos.mcpEndpoint ? { mcp: { endpoint: aos.mcpEndpoint, protocol: 'json-rpc-2.0', methods: ['initialize', 'tools/list', 'tools/call'] } } : {}),
        actions: aos.actions ?? [],
        agent_json: `${SITE_URL}/s/${x.slug}/agent.json`,
      }
    }),
  )
  return Response.json({
    schema_version: 'v1',
    name_for_agent: 'Grupo ORVIA',
    description_for_agent: 'Ecosistema logístico Grupo ORVIA. Cada landing declara sus acciones operables vía endpoint MCP.',
    sites,
    generated_by: 'Believe AOS — believe-global.com/aos',
  })
}
