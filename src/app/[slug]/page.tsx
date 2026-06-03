import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getPageBySlug, getAllPages } from '@/lib/payload'

export const revalidate = 60

export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages
    .filter((p: any) => p.slug && p.slug !== 'home')
    .map((p: any) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)
  return {
    title: page?.meta?.title || page?.title || 'Página',
    description: page?.meta?.description || '',
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  const blocks = page.layout || []

  return <BlockRenderer blocks={blocks} />
}
