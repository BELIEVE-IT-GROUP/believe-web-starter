type BlogListItem = {
  title?: string
  slug?: string
  href?: string
  coverImage?: { url?: string } | string
}

type GridLayoutCardsRelatedArticlesProps = {
  headline?: string
  items?: BlogListItem[]
}

const DEMO_ITEMS: BlogListItem[] = [
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/wordpress/image-1.jpg', title: 'Flowbite enables IT to automate Apple device configuration' },
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/wordpress/image-2.jpg', title: 'How AI is transforming your smartphone' },
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/wordpress/image-3.jpg', title: 'Android, ChromeOS, and the future of app discovery' },
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/wordpress/image-4.jpg', title: 'What Google collaboration app offers remote teams' },
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/wordpress/image-5.jpg', title: 'Collaboration app spending grows in the face of crisis' },
  { href: '#', coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/articles/wordpress/image-6.jpg', title: "For developers, too many meetings, too little 'focus' time" },
]

function getImageSrc(coverImage: BlogListItem['coverImage']): string | undefined {
  if (!coverImage) return undefined
  if (typeof coverImage === 'string') return coverImage
  return coverImage.url
}

export default function GridLayoutCardsRelatedArticles(props: GridLayoutCardsRelatedArticlesProps = {}) {
  const items = props.items?.length ? props.items : DEMO_ITEMS
  return (
    <aside
      aria-label="Related articles"
      className="bg-white py-8 antialiased dark:bg-gray-900 lg:py-16"
    >
      <div className="mx-auto max-w-screen-xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          {props.headline ?? 'Read Next'}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <article key={i}>
              <a href={item.href ?? item.slug ?? '#'}>
                <img
                  src={getImageSrc(item.coverImage) ?? ''}
                  className="mb-5 w-full max-w-full rounded-lg"
                  alt=""
                />
              </a>
              <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
                <a href={item.href ?? item.slug ?? '#'}>{item.title ?? ''}</a>
              </h2>
              <a
                href={item.href ?? item.slug ?? '#'}
                className="inline-flex items-center font-medium text-primary-600 underline underline-offset-4 hover:no-underline dark:text-primary-500"
              >
                Read more
              </a>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
