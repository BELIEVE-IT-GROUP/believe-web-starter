import { headers } from 'next/headers'
import { getTenantByDomain, listTenants, getPage } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { llmsFullFor, aosOf, SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/**
 * /llms-full.txt en la raíz del dominio (versión extendida del llms.txt).
 * - Dominio custom (CNAME del cliente) → llms-full del tenant.
 * - Host del sistema (puck) → índice extendido con las acciones MCP de cada landing.
 */
export async function GET() {
  const host = (headers().get('host') || '').toLowerCase().split(':')[0]
  const plain = { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  const t = await getTenantByDomain(host)
  if (t) {
    const data = (await getPage(t.slug, 'home')) ?? getSeed(t.blockSet)
    return new Response(llmsFullFor(t, data as Parameters<typeof llmsFullFor>[1]), plain)
  }
  const tenants = await listTenants()
  const L: string[] = ['# Grupo ORVIA — Ecosistema logístico y tecnológico (extendido)', '']
  L.push('> Declara las acciones que un agente puede ejecutar en cada landing sin simular DOM, y cómo conectarse.')
  for (const x of tenants) {
    const data = (await getPage(x.slug, 'home')) ?? getSeed(x.blockSet)
    const aos = aosOf(data as Parameters<typeof aosOf>[0])
    L.push('', `## ${x.name}`, `URL: ${SITE_URL}/s/${x.slug}`, `Discovery: ${SITE_URL}/s/${x.slug}/agent.json · ${SITE_URL}/s/${x.slug}/brand.json`)
    if (aos.mcpEndpoint && (aos.actions?.length ?? 0) > 0) {
      L.push(`Endpoint MCP: ${aos.mcpEndpoint}`)
      for (const a of aos.actions!) L.push(`  - \`${a.name}\` — ${a.description}`)
    }
  }
  L.push('', '## Cómo conectar un agente', '1. Leer /.well-known/agent.json para el manifiesto estructurado.', '2. En el endpoint MCP: initialize + tools/list, luego tools/call para ejecutar la acción real.')
  return new Response(L.join('\n') + '\n', plain)
}
