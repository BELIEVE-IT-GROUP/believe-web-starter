import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage, getTenant, getTenantByDomain } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { PublicRender } from './PublicRender'
import { RawReveal } from './RawReveal'
import { fillTemplate } from '@/cms/blocks/raw/fill'
import { SITE_URL, canonicalFor, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Params = { tenant: string; slug?: string[] }

/** Carga tenant + Puck Data (página guardada o seed del block set). */
async function loadPage(params: Params) {
  const id = params.tenant
  const slug = params.slug?.join('/') || 'home'
  // `id` puede ser el slug del tenant o un dominio custom (host con puntos,
  // reescrito por middleware.ts). Resolver por slug y, si no, por domain.
  let t = await getTenant(id)
  if (!t && id.includes('.')) t = await getTenantByDomain(id)
  if (!t) return null
  // Las páginas se guardan por slug REAL del tenant, no por host.
  const data = (await getPage(t.slug, slug)) ?? getSeed(t.blockSet)
  return { t, slug, data }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const loaded = await loadPage(params)
  if (!loaded) return {}
  const { t, data } = loaded
  // SEO vive en root.props.meta (editable en Puck). favicon/ogImage también pueden
  // venir de tenant.settings (config del sitio). Optional chaining: robusto aunque falten.
  const meta = ((data as { root?: { props?: { meta?: Record<string, string> } } } | null)?.root?.props
    ?.meta ?? {}) as {
    title?: string
    description?: string
    ogImage?: string
    favicon?: string
    canonical?: string
    robots?: 'index' | 'noindex'
  }
  const settings = (t.settings ?? {}) as { favicon?: string; ogImage?: string }
  const title = meta.title || t.name
  const description = meta.description
  const ogImage = meta.ogImage || settings.ogImage
  const favicon = meta.favicon || settings.favicon
  const canonical = meta.canonical?.trim() || canonicalFor(t, loaded.slug)
  const noindex = meta.robots === 'noindex'
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: canonical,
      siteName: title,
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, ...(ogImage ? { images: [ogImage] } : {}) },
    ...(favicon ? { icons: { icon: favicon } } : {}),
  }
}

type RawProps = { template?: string; texts?: { value?: string }[]; images?: { src?: string }[] }
type RawData = {
  root?: { props?: { fontsHtml?: string; css?: string } }
  content?: { props?: RawProps }[]
}

/**
 * Render público server-side del blockSet 'raw'. Puck <Render> es client-only y deja
 * los marcadores {{tN}} crudos en el SSR (malo para SEO). Acá reconstruimos el HTML
 * final en el servidor: cero marcadores, contenido indexable, mismo resultado que el
 * preview del editor (comparten fillTemplate). El editor sigue usando Puck con campos.
 */
function RawPublic({ data }: { data: RawData }) {
  const root = data.root?.props ?? {}
  const sections = (data.content ?? []).map((c) => fillTemplate(c.props ?? {})).join('\n')
  // Agent-operability: las secciones .reveal arrancan en opacity:0 (animación de scroll)
  // → un agente que inspecciona el DOM sin scrollear ve todo oculto y "choca contra muros"
  // (N2 DOM = 0). Forzamos visibilidad en el DOM: el contenido y los forms quedan siempre
  // ejecutables para agentes, crawlers y el Operator. Va DESPUÉS del css de la landing.
  const revealFix = '<style>.reveal{opacity:1 !important;transform:none !important}</style>'
  const html = `${root.fontsHtml || ''}<style>${root.css || ''}</style>${revealFix}${sections}`
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <RawReveal />
    </>
  )
}

export default async function SitePage({ params }: { params: Params }) {
  const loaded = await loadPage(params)
  if (!loaded) notFound()
  const { t, data } = loaded
  if (!data) notFound()
  const jsonLd = buildJsonLd(t, data as Parameters<typeof buildJsonLd>[1])
  // Widget FAB del Maasy Operator (site key a nivel dominio). El Operator opera la
  // landing en vivo: llena forms, navega, verifica. Se apaga sin setear la env.
  const operatorKey = process.env.NEXT_PUBLIC_OPERATOR_SITE_KEY || 'opk_783a183b6f249ff9d450aedb9693ef68'
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {operatorKey ? <script src="https://operator.maasy.ai/operator/v1/operator.js" data-site-key={operatorKey} async /> : null}
      {t.blockSet === 'raw' ? (
        <RawPublic data={data as RawData} />
      ) : (
        <PublicRender blockSet={t.blockSet} data={data} />
      )}
    </>
  )
}
