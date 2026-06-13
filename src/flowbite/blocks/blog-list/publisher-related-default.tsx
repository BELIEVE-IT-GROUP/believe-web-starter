type BlogListItem = {
  title?: string
  slug?: string
  href?: string
  excerpt?: string
  description?: string
  readTime?: string
  coverImage?: { url?: string } | string
}

type DefaultRelatedArticleProps = {
  headline?: string
  items?: BlogListItem[]
}

const DEMO_ITEMS: BlogListItem[] = [
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png', title: 'Our first office', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation.', readTime: 'Read in 2 minutes' },
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-2.png', title: 'Enterprise design tips', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation.', readTime: 'Read in 12 minutes' },
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-3.png', title: 'We partnered with Google', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation.', readTime: 'Read in 8 minutes' },
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-4.png', title: 'Our first project with React', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation.', readTime: 'Read in 4 minutes' },
]

function getImageSrc(coverImage: BlogListItem['coverImage']): string | undefined {
  if (!coverImage) return undefined
  if (typeof coverImage === 'string') return coverImage
  return coverImage.url
}

export default function DefaultRelatedArticle(props: DefaultRelatedArticleProps = {}) {
  const items = props.items?.length ? props.items : DEMO_ITEMS
  return (
    <aside
      aria-label="Related articles"
      className="bg-white py-8 antialiased dark:bg-gray-900 lg:py-24"
    >
      <div className="mx-auto max-w-screen-xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          {props.headline ?? 'Related articles'}
        </h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <article key={i} className="max-w-xs">
              <a href={item.href ?? item.slug ?? '#'}>
                <img
                  src={getImageSrc(item.coverImage) ?? ''}
                  className="mb-5 rounded-lg"
                  alt=""
                />
              </a>
              <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
                <a href={item.href ?? item.slug ?? '#'}>{item.title ?? ''}</a>
              </h2>
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                {item.excerpt ?? item.description ?? ''}
              </p>
              <a
                href={item.href ?? item.slug ?? '#'}
                className="inline-flex items-center font-medium text-primary-600 underline underline-offset-4 hover:no-underline dark:text-primary-500"
              >
                {item.readTime ?? 'Read more'}
              </a>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
