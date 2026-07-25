import { headers } from 'next/headers'
import { getTenantByDomain, listTenants, getPage } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { buildLlmsTxt, aosOf, SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/**
 * /llms.txt en la raíz del dominio.
 * - Dominio custom (CNAME del cliente) → llms.txt del tenant.
 * - Host del sistema (puck) → índice del ecosistema, apunta a cada landing.
 */
export async function GET() {
  const host = (headers().get('host') || '').toLowerCase().split(':')[0]
  const t = await getTenantByDomain(host)
  const plain = { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  if (t) {
    const data = (await getPage(t.slug, 'home')) ?? getSeed(t.blockSet)
    return new Response(buildLlmsTxt(t, data as Parameters<typeof buildLlmsTxt>[1]), plain)
  }
  const tenants = await listTenants()
  const L: string[] = ['# Grupo ORVIA — Ecosistema logístico y tecnológico', '', '## Landings']
  const mcp: string[] = []
  for (const x of tenants) {
    L.push(`- ${x.name}: ${SITE_URL}/s/${x.slug} (llms: ${SITE_URL}/s/${x.slug}/llms.txt)`)
    const data = (await getPage(x.slug, 'home')) ?? getSeed(x.blockSet)
    const aos = aosOf(data as Parameters<typeof aosOf>[0])
    if (aos.mcpEndpoint && (aos.actions?.length ?? 0) > 0) {
      mcp.push(`- ${x.name} — [Endpoint MCP](${aos.mcpEndpoint}): ${aos.actions!.length} acción(es) ejecutable(s) vía JSON-RPC`)
      for (const a of aos.actions!) mcp.push(`  - \`${a.name}\` — ${a.description}`)
    }
  }
  if (mcp.length) {
    L.push('', '## Agent Actions (MCP)', ...mcp)
  }
  L.push('', '## Discovery', `- Manifiesto estructurado: ${SITE_URL}/.well-known/agent.json`)
  return new Response(L.join('\n') + '\n', plain)
}
