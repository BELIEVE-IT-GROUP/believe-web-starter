import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage, getTenant } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { PublicRender } from './PublicRender'

export const dynamic = 'force-dynamic'

type Params = { tenant: string; slug?: string[] }

/** Carga tenant + Puck Data (página guardada o seed del block set). */
async function loadPage(params: Params) {
  const tenant = params.tenant
  const slug = params.slug?.join('/') || 'home'
  const t = await getTenant(tenant)
  if (!t) return null
  const data = (await getPage(tenant, slug)) ?? getSeed(t.blockSet)
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

export default async function SitePage({ params }: { params: Params }) {
  const loaded = await loadPage(params)
  if (!loaded) notFound()
  const { t, data } = loaded
  if (!data) notFound()
  return <PublicRender blockSet={t.blockSet} data={data} />
}
