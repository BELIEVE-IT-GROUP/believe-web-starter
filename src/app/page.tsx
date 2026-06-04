import { Metadata } from 'next'
import Link from 'next/link'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getPageBySlug } from '@/lib/payload'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home')
  return {
    title: page?.seo?.title || page?.title || 'Believe Agency',
    description: page?.seo?.description || 'Web construida con believe-web-starter',
  }
}

export default async function HomePage() {
  const page = await getPageBySlug('home')
  const blocks = page?.blocks || []

  if (!blocks.length) {
    return (
      <section className="min-h-[70vh] bg-white py-20">
        <div className="mx-auto max-w-screen-md px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Sitio pendiente de contenido
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Publica una página con slug home en Payload CMS para renderizar este tenant.
          </p>
          <Link href="/flowbite-pro-showcase" className="mt-8 inline-flex rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white hover:bg-primary-700">
            Ver showcase de bloques
          </Link>
        </div>
      </section>
    )
  }

  return <BlockRenderer blocks={blocks} />
}
