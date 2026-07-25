import { NextResponse } from 'next/server'
import { getTenant, getPage, savePage } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { canonicalFor, baseJsonLd } from '@/lib/seo'
import { runAos } from '@/lib/aos'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/cms/<tenant>/<slug>/aos
 * Corre el AOS de Maasy sobre la landing en vivo y hornea los artefactos
 * (JSON-LD potentialAction + llms.txt + score) en el meta de la página.
 * Protegido por Authelia (como el resto de /api/cms).
 */
export async function POST(_req: Request, { params }: { params: { tenant: string; slug: string } }) {
  const t = await getTenant(params.tenant)
  if (!t) return NextResponse.json({ ok: false, error: 'tenant no existe' }, { status: 404 })

  const data = ((await getPage(t.slug, params.slug)) ?? getSeed(t.blockSet)) as {
    root?: { props?: { meta?: Record<string, unknown> } }
  } | null
  if (!data) return NextResponse.json({ ok: false, error: 'página no existe' }, { status: 404 })

  const url = canonicalFor(t, params.slug)
  const email = process.env.LEADS_NOTIFY_EMAIL || 'jorge@believe-global.com'

  let aos
  try {
    aos = await runAos(url, email, t.name)
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 })
  }

  // Merge: Organization + WebSite (base) + acciones del AOS → override editable meta.jsonLd
  const merged = [...baseJsonLd(t, data as Parameters<typeof baseJsonLd>[1]), ...aos.jsonLd]
  const root = (data.root ??= {})
  const props = (root.props ??= {})
  props.meta = {
    ...(props.meta ?? {}),
    jsonLd: JSON.stringify(merged, null, 2),
    llmsTxt: aos.llmsTxt,
    llmsFull: aos.llmsFull,
    agentJson: JSON.stringify(aos.agentJson, null, 2),
    aos: {
      score: aos.score,
      band: aos.band,
      auditId: aos.auditId,
      mcpEndpoint: aos.mcpEndpoint,
      actions: aos.actions,
    },
  }

  await savePage(t.slug, params.slug, data as Parameters<typeof savePage>[2])

  return NextResponse.json({
    ok: true,
    score: aos.score,
    band: aos.band,
    formsExecutable: aos.formsExecutable,
    actions: aos.actions.length,
    mcpEndpoint: aos.mcpEndpoint,
  })
}
