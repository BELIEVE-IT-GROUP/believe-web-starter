import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog — Believe Agency',
  description: 'Artículos, insights y recursos sobre marketing digital.',
}

const demoPosts = [
  {
    id: '1',
    title: 'Cómo construir un CMS multi-tenant con Payload',
    slug: 'cms-multitenant-payload',
    excerpt: 'Aprendé a estructurar un CMS que sirva a múltiples clientes desde una única instancia, con aislamiento total de datos.',
    publishedAt: '2026-05-20T10:00:00.000Z',
    coverImage: null,
    category: { name: 'Desarrollo' },
  },
  {
    id: '2',
    title: 'Next.js 14 vs 15: qué cambió realmente',
    slug: 'nextjs-14-vs-15',
    excerpt: 'Un análisis práctico de las nuevas features de Next.js 15 y si vale la pena migrar tu proyecto actual.',
    publishedAt: '2026-05-15T08:00:00.000Z',
    coverImage: null,
    category: { name: 'Frontend' },
  },
  {
    id: '3',
    title: 'Flowbite Blocks Pro: review honesto',
    slug: 'flowbite-blocks-pro-review',
    excerpt: 'Analizamos si vale la pena pagar por los componentes premium de Flowbite en proyectos reales.',
    publishedAt: '2026-05-10T14:00:00.000Z',
    coverImage: null,
    category: { name: 'Diseño' },
  },
]

export default async function BlogPage() {
  const posts = await getAllPosts()
  const displayPosts = posts.length > 0 ? posts : demoPosts

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl">Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Artículos, insights y recursos sobre marketing digital, desarrollo y diseño.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post) => (
              <article key={post.id} className="group flex flex-col">
                {post.coverImage?.url ? (
                  <Link href={`/blog/${post.slug}`}>
                    <Image
                      src={post.coverImage.url}
                      width={400}
                      height={250}
                      alt={post.title}
                      className="mb-4 rounded-lg object-cover transition group-hover:opacity-90"
                    />
                  </Link>
                ) : (
                  <Link href={`/blog/${post.slug}`}>
                    <div className="mb-4 flex h-[250px] items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                      Sin imagen
                    </div>
                  </Link>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {post.category && <span className="font-medium text-primary-600">{post.category.name || post.category}</span>}
                  {post.publishedAt && (
                    <span>{new Date(post.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  )}
                </div>
                <h2 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-primary-600">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                {post.excerpt && <p className="mt-2 flex-1 text-gray-500">{post.excerpt}</p>}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center font-medium text-primary-600 hover:text-primary-700"
                >
                  Leer más →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
