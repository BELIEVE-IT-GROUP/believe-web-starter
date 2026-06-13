type BlogListItem = {
  title?: string
  slug?: string
  href?: string
  excerpt?: string
  description?: string
  coverImage?: { url?: string } | string
}

type FeaturedPostBlogSectionProps = {
  headline?: string
  description?: string
  /** First item is the featured (large) post; items[1..3] go in left column; items[4..6] go in right column */
  items?: BlogListItem[]
}

const DEMO_ITEMS: BlogListItem[] = [
  {
    href: '#',
    coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/google-hq.png',
    title: 'SEO Basics: Beginner\'s Guide to SEO Success',
    excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.',
  },
  { href: '#', title: 'How to quickly deploy a static website', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.' },
  { href: '#', title: 'What is SEO? Search Engine Optimization Explained', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.' },
  { href: '#', title: 'Spotify\'s Car Thing available to all premium users', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.' },
  { href: '#', title: 'How to Rank Higher on Google (6 Easy Steps)', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.' },
  { href: '#', title: '12 SEO Best Practices That Everyone Should Follow', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.' },
  { href: '#', title: 'How to schedule your Tweets to send later', excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.' },
]

function getImageSrc(coverImage: BlogListItem['coverImage']): string | undefined {
  if (!coverImage) return undefined
  if (typeof coverImage === 'string') return coverImage
  return coverImage.url
}

export function FeaturedPostBlogSection(props: FeaturedPostBlogSectionProps = {}) {
  const items = props.items?.length ? props.items : DEMO_ITEMS
  const featured = items[0] ?? DEMO_ITEMS[0]
  const leftCol = items.slice(1, 4).length ? items.slice(1, 4) : DEMO_ITEMS.slice(1, 4)
  const rightCol = items.slice(4, 7).length ? items.slice(4, 7) : DEMO_ITEMS.slice(4, 7)

  const readMoreArrow = (
    <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl">
            {props.headline ?? 'Our Blog'}
          </h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
            {props.description ?? 'We use an agile approach to test assumptions and connect with the needs of your audience early and often.'}
          </p>
        </div>
        <div className="mb-16 grid gap-8 lg:grid-cols-3 lg:divide-x lg:divide-gray-200 dark:lg:divide-gray-700">
          <article>
            {getImageSrc(featured.coverImage) && (
              <a href={featured.href ?? featured.slug ?? '#'}>
                <img
                  alt=""
                  src={getImageSrc(featured.coverImage)}
                  className="mb-5 rounded-lg"
                />
              </a>
            )}
            <h2 className="my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <a href={featured.href ?? featured.slug ?? '#'}>{featured.title ?? ''}</a>
            </h2>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              {featured.excerpt ?? featured.description ?? ''}
            </p>
            <a
              href={featured.href ?? featured.slug ?? '#'}
              className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Read more{readMoreArrow}
            </a>
          </article>
          <div className="space-y-8 lg:pl-8">
            {leftCol.map((item, i) => (
              <article key={i}>
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href={item.href ?? item.slug ?? '#'}>{item.title ?? ''}</a>
                </h2>
                <p className="mb-4 text-gray-500 dark:text-gray-400">
                  {item.excerpt ?? item.description ?? ''}
                </p>
                <a
                  href={item.href ?? item.slug ?? '#'}
                  className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Read more{readMoreArrow}
                </a>
              </article>
            ))}
          </div>
          <div className="space-y-8 lg:pl-8">
            {rightCol.map((item, i) => (
              <article key={i}>
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href={item.href ?? item.slug ?? '#'}>{item.title ?? ''}</a>
                </h2>
                <p className="mb-4 text-gray-500 dark:text-gray-400">
                  {item.excerpt ?? item.description ?? ''}
                </p>
                <a
                  href={item.href ?? item.slug ?? '#'}
                  className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Read more{readMoreArrow}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedPostBlogSection
