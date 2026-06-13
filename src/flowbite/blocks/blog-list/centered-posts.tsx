import { Badge } from "flowbite-react";

type BlogListItem = {
  title?: string
  slug?: string
  href?: string
  category?: string
  date?: string
  publishedAt?: string
  shares?: string
  author?: { name?: string; avatar?: string }
}

type CenteredPostsBlogSectionProps = {
  headline?: string
  description?: string
  items?: BlogListItem[]
}

const DEMO_ITEMS: BlogListItem[] = [
  {
    href: '#',
    category: 'Tutorial',
    title: 'How to quickly deploy a static website',
    author: { name: 'Jese Leos', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png' },
    date: 'March 26',
    shares: '178 shares',
  },
  {
    href: '#',
    category: 'Article',
    title: 'Short-Form vs. Long-Form Content: Which Is Better for SEO?',
    author: { name: 'Karen Nelson', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png' },
    date: 'March 26',
    shares: '178 shares',
  },
  {
    href: '#',
    category: 'Article',
    title: '5 Powerful Marketing Activities: Lessons From Successful Brands',
    author: { name: 'Thomas Lean', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/thomas-lean.png' },
    date: 'March 26',
    shares: '178 shares',
  },
]

export function CenteredPostsBlogSection(props: CenteredPostsBlogSectionProps = {}) {
  const items = props.items?.length ? props.items : DEMO_ITEMS
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? 'Our Blog'}
          </h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
            {props.description ?? 'We use an agile approach to test assumptions and connect with the needs of your audience early and often.'}
          </p>
        </div>
        <div className="mx-auto max-w-screen-sm divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item, i) => (
            <article
              key={i}
              className={i === 0 ? 'pb-6 text-center' : i === items.length - 1 ? 'pt-6 text-center' : 'py-6 text-center'}
            >
              <Badge color="info" className="inline-flex">
                <svg
                  className="mr-1 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                    clipRule="evenodd"
                  />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
                {item.category ?? 'Article'}
              </Badge>
              <h2 className="my-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                <a href={item.href ?? item.slug ?? '#'}>{item.title ?? ''}</a>
              </h2>
              <div className="flex items-center justify-center space-x-6 text-gray-500">
                <div className="flex items-center space-x-3">
                  <img
                    alt={`${item.author?.name ?? ''} portrait`}
                    src={item.author?.avatar ?? ''}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {item.author?.name ?? ''}
                  </span>
                </div>
                <span>{item.date ?? item.publishedAt ?? ''}</span>
                {item.shares && <span>{item.shares}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CenteredPostsBlogSection
