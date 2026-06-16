import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getPageBySlug, getAllPages } from '@/lib/payload'

export const revalidate = 60

export async function generateStaticParams() {
  // Static generation disabled for dynamic route — uses SSR with ISR for now
  // To enable: return pages from CMS and ensure no conflicts with static routes
  return []
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug) as any
  return {
    title: page?.seo?.title || page?.title || 'Página',
    description: page?.seo?.description || '',
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page: any = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  const blocks = page.blocks || []

  return <BlockRenderer blocks={blocks} />
}
