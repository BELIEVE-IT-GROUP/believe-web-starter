import type { MetadataRoute } from 'next'
import { listTenants } from '@/cms/store'
import { baseForTenant } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenants = await listTenants()
  return tenants.map((t) => ({
    url: baseForTenant(t),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
}
