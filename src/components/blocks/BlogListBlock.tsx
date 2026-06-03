import Image from 'next/image'
import Link from 'next/link'

export function BlogListBlock(props: {
  headline?: string
  layout?: string
  posts?: {
    title: string
    slug: string
    excerpt?: string
    coverImage?: { url: string }
    publishedAt?: string
    category?: string
  }[]
}) {
  const { headline, posts, layout = 'grid' } = props

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        {headline && (
          <h2 className="mb-12 text-3xl font-bold text-gray-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className={`grid gap-8 ${layout === 'list' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {posts?.map((post, i) => (
            <article key={i} className="group">
              {post.coverImage?.url && (
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.coverImage.url}
                    width={400}
                    height={250}
                    alt={post.title}
                    className="mb-4 rounded-lg object-cover transition group-hover:opacity-90"
                  />
                </Link>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {post.category && <span className="text-primary-600">{post.category}</span>}
                {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
              </div>
              <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-primary-600">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              {post.excerpt && <p className="mt-2 text-gray-500">{post.excerpt}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
