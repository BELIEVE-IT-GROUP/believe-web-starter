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
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        {(headline || cta?.text) && (
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            {headline && (
              <h2 className="font-display text-3xl font-medium text-ink-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {cta?.text && (
              <Link
                href={cta.url || '/blog'}
                className="text-sm font-medium text-believe-700 hover:text-believe-900 transition-colors"
              >
                {cta.text}
              </Link>
            )}
          </div>
        )}
        <div className={`grid gap-8 ${isList ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {posts?.map((post, i) => (
            <article key={post.id || i} className={`group ${isList ? 'grid gap-6 md:grid-cols-[240px_1fr]' : ''}`}>
              {getMediaUrl(post.coverImage) && (
                <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-xl border border-ink-900/10">
                  <Image
                    src={getMediaUrl(post.coverImage)}
                    width={400}
                    height={250}
                    alt={post.title}
                    className="aspect-[16/10] w-full object-cover transition group-hover:opacity-90"
                  />
                </Link>
              )}
              <div className="pt-4">
                <div className="flex items-center gap-2">
                  {categoryName(post.category) && (
                    <span className="eyebrow text-believe-700">{categoryName(post.category)}</span>
                  )}
                  {post.publishedAt && categoryName(post.category) && (
                    <span className="inline-block h-1 w-1 rounded-full bg-signal-400" aria-hidden="true" />
                  )}
                  {post.publishedAt && (
                    <span className="eyebrow">
                      {new Date(post.publishedAt).toLocaleDateString('es', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <h3 className="font-display mt-2 text-xl font-medium text-ink-900 group-hover:text-believe-700 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-ink-500 leading-relaxed">{post.excerpt}</p>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-believe-700 hover:text-believe-900 transition-colors"
                >
                  Leer más →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
