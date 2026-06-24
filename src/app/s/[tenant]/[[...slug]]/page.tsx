import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage, getTenant, getTenantByDomain } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { PublicRender } from './PublicRender'
import { RawReveal } from './RawReveal'
import { fillTemplate } from '@/cms/blocks/raw/fill'

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
    ?.meta ?? {}) as { title?: string; description?: string; ogImage?: string; favicon?: string }
  const settings = (t.settings ?? {}) as { favicon?: string; ogImage?: string }
  const title = meta.title || t.name
  const description = meta.description
  const ogImage = meta.ogImage || settings.ogImage
  const favicon = meta.favicon || settings.favicon
  return {
    title,
    description,
    openGraph: { title, description, ...(ogImage ? { images: [ogImage] } : {}) },
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
  const html = `${root.fontsHtml || ''}<style>${root.css || ''}</style>${sections}`
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
  if (t.blockSet === 'raw') return <RawPublic data={data as RawData} />
  return <PublicRender blockSet={t.blockSet} data={data} />
}
