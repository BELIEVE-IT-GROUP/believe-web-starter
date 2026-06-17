import { notFound } from 'next/navigation'
import { getPage, getTenant } from '@/cms/store'
import { buildBirdmanSeed } from '@/cms/seed'
import { PublicRender } from './PublicRender'

export const dynamic = 'force-dynamic'

export default async function SitePage({ params }: { params: { tenant: string; slug?: string[] } }) {
  const tenant = params.tenant
  const slug = params.slug?.join('/') || 'home'
  const t = await getTenant(tenant)
  if (!t) notFound()
  const data = (await getPage(tenant, slug)) ?? (tenant === 'birdman' ? buildBirdmanSeed() : null)
  if (!data) notFound()
  return <PublicRender data={data} />
}
