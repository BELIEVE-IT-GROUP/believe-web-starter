import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/payload'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post: any) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  return {
    title: post?.seo?.title || post?.title || 'Post no encontrado',
    description: post?.seo?.description || post?.excerpt || '',
  }
}

const demoPosts: Record<string, any> = {
  'cms-multitenant-payload': {
    title: 'Cómo construir un CMS multi-tenant con Payload',
    publishedAt: '2026-05-20T10:00:00.000Z',
    category: { name: 'Desarrollo' },
    coverImage: null,
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Construir un CMS multi-tenant no tiene que ser complicado. Con Payload CMS 3 y el plugin oficial de multi-tenancy, podés aislar completamente los datos de cada cliente mientras compartís la misma instalación.' },
            ],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: '¿Por qué multi-tenant?' }],
          },
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'La arquitectura multi-tenant permite reducir costos de infraestructura, simplificar updates y mantener un único codebase para todos tus clientes. Cada tenant ve solo sus datos, pero detrás todo corre en el mismo servidor.' },
            ],
          },
        ],
      },
    },
  },
  'nextjs-14-vs-15': {
    title: 'Next.js 14 vs 15: qué cambió realmente',
    publishedAt: '2026-05-15T08:00:00.000Z',
    category: { name: 'Frontend' },
    coverImage: null,
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Next.js 15 trae mejoras significativas en el renderizado parcial, caching automático más inteligente y mejoras en el desarrollo local. Pero no todo es más rápido: algunos patrones de App Router cambiaron y requieren atención.' },
            ],
          },
        ],
      },
    },
  },
  'flowbite-blocks-pro-review': {
    title: 'Flowbite Blocks Pro: review honesto',
    publishedAt: '2026-05-10T14:00:00.000Z',
    category: { name: 'Diseño' },
    coverImage: null,
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Después de usar Flowbite Blocks Pro en 3 proyectos reales, puedo decir que vale la pena si necesitás velocidad. Los componentes son sólidos, responsive por defecto y con buena accesibilidad. La contra: algunos bloques pueden sentirse genéricos.' },
            ],
          },
        ],
      },
    },
  },
}

function ContentRenderer({ content }: { content: any }) {
  if (!content?.root?.children) return null

  return (
    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600">
      {content.root.children.map((node: any, i: number) => {
        if (node.type === 'paragraph') {
          return (
            <p key={i}>
              {node.children?.map((child: any, j: number) =>
                child.type === 'text' ? <span key={j}>{child.text}</span> : null
              )}
            </p>
          )
        }
        if (node.type === 'heading') {
          const Tag = node.tag || 'h2'
          return (
            <Tag key={i} className="mb-4 mt-8 text-2xl font-bold text-gray-900">
              {node.children?.map((child: any, j: number) =>
                child.type === 'text' ? <span key={j}>{child.text}</span> : null
              )}
            </Tag>
          )
        }
        return null
      })}
    </div>
  )
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const displayPost = post || demoPosts[params.slug]

  if (!displayPost) {
    notFound()
  }

  const categoryName = typeof displayPost.category === 'string'
    ? displayPost.category
    : displayPost.category?.name

  return (
    <article className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-screen-md px-4">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {categoryName && (
              <span className="font-medium text-primary-600">
                {categoryName}
              </span>
            )}
            {displayPost.publishedAt && (
              <span>{new Date(displayPost.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
            {displayPost.title}
          </h1>
        </div>
      </section>

      {displayPost.coverImage?.url && (
        <div className="mx-auto max-w-screen-lg px-4">
          <Image
            src={displayPost.coverImage.url}
            width={1200}
            height={600}
            alt={displayPost.title}
            className="w-full rounded-lg object-cover"
          />
        </div>
      )}

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-screen-md px-4">
          <ContentRenderer content={displayPost.content} />
        </div>
      </section>

      <section className="border-t border-gray-200 py-12">
        <div className="mx-auto max-w-screen-md px-4">
          <Link href="/blog" className="font-medium text-primary-600 hover:text-primary-700">
            ← Volver al blog
          </Link>
        </div>
      </section>
    </article>
  )
}
