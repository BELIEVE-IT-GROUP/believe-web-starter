import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, getMediaUrl } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog — Believe Agency',
  description: 'Artículos, insights y recursos sobre marketing digital.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

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
          {posts.length ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
              <article key={post.id} className="group flex flex-col">
                {getMediaUrl(post.coverImage) ? (
                  <Link href={`/blog/${post.slug}`}>
                    <Image
                      src={getMediaUrl(post.coverImage)}
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
                  {post.category && <span className="font-medium text-primary-600">{typeof post.category === 'string' ? post.category : post.category.name}</span>}
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
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900">No hay artículos publicados</h2>
              <p className="mt-2 text-gray-500">
                Publica posts desde Payload CMS para alimentar esta sección.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
