import { notFound } from 'next/navigation'
import { getPage, getTenant } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { PublicRender } from './PublicRender'

export const dynamic = 'force-dynamic'

export default async function SitePage({ params }: { params: { tenant: string; slug?: string[] } }) {
  const tenant = params.tenant
  const slug = params.slug?.join('/') || 'home'
  const t = await getTenant(tenant)
  if (!t) notFound()
  const data = (await getPage(tenant, slug)) ?? getSeed(t.blockSet)
  if (!data) notFound()
  return <PublicRender blockSet={t.blockSet} data={data} />
}
