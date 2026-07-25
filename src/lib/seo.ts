/**
 * Helpers SEO/GEO para las landings del CMS (raw + custom).
 *
 * - canonical/base por tenant (dominio custom si existe, si no puck/s/<slug>)
 * - JSON-LD (Organization + WebSite) para buscadores y motores generativos
 * - llms.txt (agent-readable) para que agentes entiendan el sitio
 *
 * Todo se deriva de los datos que ya edita la gente en Puck (root.props.meta +
 * secciones). Sin dependencias externas.
 */
import type { Tenant } from '@/cms/store'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://puck.believe-global.com').replace(/\/$/, '')

// Mapa slug → logo (los SVG viven en /public/logos). Override posible en tenant.settings.logo.
const LOGO: Record<string, string> = {
  'envia-ya': '/logos/enviaya.svg',
  'trust-logistics': '/logos/trust.svg',
  orvia: '/logos/orvia.svg',
  birdman: '/logos/birdman.svg',
}

export function logoFor(t: Tenant): string | undefined {
  const s = (t.settings ?? {}) as { logo?: string }
  const rel = s.logo || LOGO[t.slug]
  if (!rel) return undefined
  return rel.startsWith('http') ? rel : `${SITE_URL}${rel}`
}

/** Base absoluta del sitio del tenant: dominio custom si tiene, si no el staging. */
export function baseForTenant(t: Tenant): string {
  const d = t.domains?.[0]
  return d ? `https://${d}` : `${SITE_URL}/s/${t.slug}`
}

/** URL canónica de una página del tenant. */
export function canonicalFor(t: Tenant, slug: string): string {
  const base = baseForTenant(t)
  return !slug || slug === 'home' ? base : `${base}/${slug}`
}

type AosMeta = { score?: number; band?: string; auditId?: string; mcpEndpoint?: string; actions?: Array<{ name: string; description: string }> }
type RawMeta = {
  title?: string
  description?: string
  ogImage?: string
  canonical?: string
  robots?: 'index' | 'noindex'
  jsonLd?: string
  llmsTxt?: string
  llmsFull?: string
  agentJson?: string
  aos?: AosMeta
}
type LoadedData = {
  root?: { props?: { meta?: RawMeta } }
  content?: Array<{ type?: string; props?: { label?: string; texts?: Array<{ value?: string }> } }>
} | null

export function metaOf(data: LoadedData): RawMeta {
  return (data?.root?.props?.meta ?? {}) as RawMeta
}

/** JSON-LD para el <head>. Usa el override editable (meta.jsonLd) si existe; si no, auto. */
export function buildJsonLd(t: Tenant, data: LoadedData): Record<string, unknown>[] {
  const meta = metaOf(data)
  if (meta.jsonLd && meta.jsonLd.trim()) {
    try {
      const parsed = JSON.parse(meta.jsonLd)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      /* override inválido → cae al auto */
    }
  }
  return baseJsonLd(t, data)
}

/** JSON-LD base auto (Organization + WebSite), sin considerar el override. */
export function baseJsonLd(t: Tenant, data: LoadedData): Record<string, unknown>[] {
  const meta = metaOf(data)
  const url = baseForTenant(t)
  const name = meta.title?.split('·')[0]?.trim() || t.name
  const description = meta.description || undefined
  const logo = logoFor(t)
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(description ? { description } : {}),
    ...(logo ? { logo } : {}),
    parentOrganization: { '@type': 'Organization', name: 'Grupo ORVIA', url: `${SITE_URL}/s/orvia` },
  }
  const website: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(description ? { description } : {}),
    inLanguage: 'es',
  }
  return [org, website]
}

/** Contenido de llms.txt (markdown) — resumen agent-readable del sitio del tenant. */
export function buildLlmsTxt(t: Tenant, data: LoadedData): string {
  const meta = metaOf(data)
  if (meta.llmsTxt && meta.llmsTxt.trim()) return meta.llmsTxt.trim() + '\n'
  const url = baseForTenant(t)
  const name = meta.title?.split('·')[0]?.trim() || t.name
  const lines: string[] = []
  lines.push(`# ${name}`)
  if (meta.description) lines.push(`\n> ${meta.description}`)
  lines.push(`\nURL: ${url}`)

  // Secciones (labels + primer texto como resumen) — solo para blockSet raw.
  const secs = (data?.content ?? [])
    .map((c) => {
      const label = c.props?.label
      const first = c.props?.texts?.find((x) => x.value && x.value.trim().length > 3)?.value
      return label ? `- **${label}**${first ? `: ${first.trim().slice(0, 140)}` : ''}` : null
    })
    .filter(Boolean)
  if (secs.length) {
    lines.push(`\n## Secciones`)
    lines.push(...(secs as string[]))
  }

  lines.push(`\n## Ecosistema Grupo ORVIA`)
  lines.push(`- EnviaYa! (automatización de envíos): ${SITE_URL}/s/envia-ya`)
  lines.push(`- Trust Logistics (fulfillment y distribución): ${SITE_URL}/s/trust-logistics`)
  lines.push(`- Birdman Logistics (optimización In-Plant): ${SITE_URL}/s/birdman`)
  lines.push(`- Grupo ORVIA (holding): ${SITE_URL}/s/orvia`)
  return lines.join('\n') + '\n'
}

/** agent.json del tenant: usa el generado por el AOS (meta.agentJson) si existe; si no, uno mínimo. */
export function agentJsonFor(t: Tenant, data: LoadedData): Record<string, unknown> {
  const meta = metaOf(data)
  if (meta.agentJson && meta.agentJson.trim()) {
    try {
      return JSON.parse(meta.agentJson)
    } catch {
      /* override inválido → cae al mínimo */
    }
  }
  const url = baseForTenant(t)
  const aos = aosOf(data)
  return {
    schema_version: 'v1',
    name_for_agent: meta.title?.split('·')[0]?.trim() || t.name,
    description_for_agent: `${t.name} (${url}).`,
    ...(aos.mcpEndpoint ? { mcp: { endpoint: aos.mcpEndpoint, protocol: 'json-rpc-2.0', methods: ['initialize', 'tools/list', 'tools/call'] } } : {}),
    actions: aos.actions ?? [],
    generated_by: 'Believe AOS — believe-global.com/aos',
  }
}

/** llms-full.txt del tenant: versión extendida (meta.llmsFull) o cae al llms.txt normal. */
export function llmsFullFor(t: Tenant, data: LoadedData): string {
  const meta = metaOf(data)
  if (meta.llmsFull && meta.llmsFull.trim()) return meta.llmsFull.trim() + '\n'
  return buildLlmsTxt(t, data)
}

/** Acción MCP declarada por el tenant (para el índice agregado del dominio compartido). */
export function aosOf(data: LoadedData): AosMeta {
  const aos = metaOf(data).aos ?? {}
  // Compat: auditorías viejas guardaban `actions` como conteo (número). Normaliza a array.
  return { ...aos, actions: Array.isArray(aos.actions) ? aos.actions : [] }
}

/** Directivas robots que permiten explícitamente a crawlers de IA (GEO). */
export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
]
