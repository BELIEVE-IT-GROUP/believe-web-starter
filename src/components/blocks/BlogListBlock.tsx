import Image from 'next/image'
import Link from 'next/link'

import { getAllPosts, getMediaUrl } from '@/lib/payload'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

type BlogPost = {
  id?: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: { url?: string }
  publishedAt?: string
  category?: string | { name?: string }
}

function categoryName(category?: BlogPost['category']) {
  return typeof category === 'string' ? category : category?.name
}

export async function BlogListBlock(props: {
  headline?: string
  layout?: string
  count?: number
  cta?: { text?: string; url?: string }
  posts?: BlogPost[]
  appearance?: BlockAppearance
}) {
  const { headline, layout = 'grid', count = 3, cta, appearance } = props
  const posts = props.posts?.length ? props.posts : await getAllPosts(count)
  const isList = layout === 'list'

  return (
    <section {...getSectionProps(appearance, { background: 'bg-white' })}>
      <div className={getContainerClassName(appearance)}>
        {(headline || cta?.text) && (
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            {headline && (
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {cta?.text && (
              <Link href={cta.url || '/blog'} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                {cta.text}
              </Link>
            )}
          </div>
        )}
        <div className={`grid gap-8 ${isList ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {posts?.map((post, i) => (
            <article key={post.id || i} className={`group ${isList ? 'grid gap-6 md:grid-cols-[240px_1fr]' : ''}`}>
              {getMediaUrl(post.coverImage) && (
                <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={getMediaUrl(post.coverImage)}
                    width={400}
                    height={250}
                    alt={post.title}
                    className="aspect-[16/10] w-full object-cover transition group-hover:opacity-90"
                  />
                </Link>
              )}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {categoryName(post.category) && <span className="text-primary-600">{categoryName(post.category)}</span>}
                  {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
                </div>
                <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-primary-600">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.excerpt && <p className="mt-2 text-gray-500">{post.excerpt}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
