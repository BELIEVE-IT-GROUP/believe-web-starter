import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichTextRenderer } from '@/components/richtext/RichTextRenderer'
import { getPostBySlug, getAllPosts, getMediaUrl } from '@/lib/payload'

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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const categoryName = typeof post.category === 'string'
    ? post.category
    : post.category?.name

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
            {post.publishedAt && (
              <span>{new Date(post.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
        </div>
      </section>

      {getMediaUrl(post.coverImage) && (
        <div className="mx-auto max-w-screen-lg px-4">
          <Image
            src={getMediaUrl(post.coverImage)}
            width={1200}
            height={600}
            alt={post.title}
            className="w-full rounded-lg object-cover"
          />
        </div>
      )}

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-screen-md px-4">
          <RichTextRenderer data={post.content} />
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
