/**
 * Cliente del AOS de Maasy (Agent Operability) para el CMS.
 *
 * Al auditar una landing:
 *  1. aos-audit-url  → score + forms detectados
 *  2. aos-generate   → JSON-LD (potentialAction) + tool MCP + endpoint MCP por form ejecutable
 *  3. arma un llms.txt agent-readable con las acciones + endpoint MCP + score
 *
 * Modo standalone (sin project_id): auth por contact_email (rate limit 5/día/email).
 * Las edge functions se llaman con la publishable key de Maasy como apikey.
 */
const FN = (process.env.MAASY_FUNCTIONS_URL || 'https://esptwxlgdbblvnmdpoao.supabase.co/functions/v1').replace(/\/$/, '')
const KEY = process.env.MAASY_PUBLISHABLE_KEY || ''

async function callFn(name: string, body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(`${FN}/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  })
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) throw new Error(`${name} ${res.status}: ${JSON.stringify(json).slice(0, 180)}`)
  return json
}

type AosForm = { hasSubmitButton?: boolean; hasCaptcha?: boolean; fieldCount?: number }
export type AosAction = { name: string; description: string }
export type AosResult = {
  auditId: string
  score: number
  band: string
  jsonLd: Record<string, unknown>[]
  llmsTxt: string
  llmsFull: string
  agentJson: Record<string, unknown>
  mcpEndpoint?: string
  actions: AosAction[]
  formsExecutable: number
}

/**
 * agent.json — discovery file estructurado (/.well-known/agent.json).
 * El primo JSON del llms.txt: declara endpoint MCP + acciones para agentes que
 * parsean manifiestos en vez de heurística de texto. Se arma local desde el audit.
 */
export function buildAgentJson(url: string, name: string, mcpEndpoint: string | undefined, actions: AosAction[]): Record<string, unknown> {
  return {
    schema_version: 'v1',
    name_for_agent: name,
    description_for_agent: `${name} (${url}). Acciones operables por agentes vía el endpoint MCP declarado.`,
    ...(mcpEndpoint
      ? { mcp: { endpoint: mcpEndpoint, protocol: 'json-rpc-2.0', methods: ['initialize', 'tools/list', 'tools/call'] } }
      : {}),
    actions: actions.map((a) => ({ name: a.name, description: a.description })),
    generated_by: 'Believe AOS — believe-global.com/aos',
  }
}

/** Audita la URL, genera artefactos por form ejecutable, arma el llms.txt del AOS. */
export async function runAos(url: string, contactEmail: string, name = 'Grupo ORVIA'): Promise<AosResult> {
  const audit = await callFn('aos-audit-url', { url, contact_email: contactEmail, company_name: name })
  const auditId = String(audit.audit_id || '')
  const forms = (Array.isArray(audit.forms) ? audit.forms : []) as AosForm[]
  const jsonLd: Record<string, unknown>[] = []
  const actions: AosAction[] = []
  let mcpEndpoint: string | undefined
  let formsExecutable = 0

  for (let i = 0; i < forms.length; i++) {
    const f = forms[i]
    if (f.hasSubmitButton && !f.hasCaptcha && (f.fieldCount ?? 0) > 0) {
      formsExecutable++
      try {
        const g = await callFn('aos-generate', { audit_id: auditId, form_index: i })
        if (g.json_ld) jsonLd.push(g.json_ld as Record<string, unknown>)
        const tool = g.mcp_tool as { name?: string; description?: string } | undefined
        if (tool?.name) actions.push({ name: tool.name, description: tool.description || '' })
        if (g.mcp_endpoint) mcpEndpoint = String(g.mcp_endpoint)
      } catch {
        /* un form que no se pudo generar no rompe el resto */
      }
    }
  }

  const score = Number(audit.score) || 0
  const band = String(audit.band || '')
  const llmsTxt = buildAosLlms(url, name, score, band, actions, mcpEndpoint, false)
  const llmsFull = buildAosLlms(url, name, score, band, actions, mcpEndpoint, true)
  const agentJson = buildAgentJson(url, name, mcpEndpoint, actions)
  return { auditId, score, band, jsonLd, llmsTxt, llmsFull, agentJson, mcpEndpoint, actions, formsExecutable }
}

function buildAosLlms(url: string, name: string, score: number, band: string, actions: AosAction[], mcp: string | undefined, full: boolean): string {
  const L: string[] = []
  L.push(`# ${name}`)
  L.push(`\n> Sitio auditado para operabilidad agéntica (AOS). Declara las acciones que un agente de IA puede ejecutar en este sitio sin simular DOM.`)
  L.push(`\nURL: ${url}`)
  L.push(`\n## Agent Actions (MCP)`)
  if (mcp && actions.length) {
    L.push(`- [Endpoint MCP](${mcp}): ${actions.length} acción(es) ejecutable(s) vía JSON-RPC (tools/list, tools/call)`)
    for (const a of actions) L.push(`  - \`${a.name}\` — ${a.description}`)
  } else {
    L.push(`- (sin acciones ejecutables detectadas todavía)`)
  }
  if (full) {
    // Versión extendida: cómo conectarse + discovery estructurado.
    L.push(`\n## Cómo conectar un agente`)
    if (mcp) {
      L.push(`1. Llamar \`initialize\` y \`tools/list\` en el endpoint MCP de arriba (JSON-RPC 2.0).`)
      L.push(`2. Ejecutar la acción con \`tools/call\` — el endpoint corre el submit real del formulario, sin simular DOM.`)
    }
    L.push(`- Discovery estructurado: \`/.well-known/agent.json\` (mismo contenido en JSON).`)
    L.push(`- Perfil de marca (identidad, claims aprobados, qué NO afirmar): \`/.well-known/brand.json\`.`)
  }
  L.push(`\n## Score AOS`)
  L.push(`${score}/100${band ? ` (${band})` : ''}`)
  return L.join('\n') + '\n'
}
