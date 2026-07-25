import type { MetadataRoute } from 'next'
import { SITE_URL, AI_CRAWLERS } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
      // Permiso explícito a crawlers de IA (GEO / motores generativos)
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
