import { Badge } from "flowbite-react";

type BlogListItem = {
  title?: string
  slug?: string
  href?: string
  excerpt?: string
  description?: string
  category?: string
  date?: string
  publishedAt?: string
  author?: { name?: string; avatar?: string }
}

type ListWithHeadingBlogSectionProps = {
  headline?: string
  description?: string
  items?: BlogListItem[]
}

const DEMO_ITEMS: BlogListItem[] = [
  {
    href: '#',
    category: 'Tutorial',
    date: '12 days ago',
    title: 'How to quickly deploy a static website',
    excerpt: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers influence both web designers and developers.',
    author: { name: 'Michael Gouch', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png' },
  },
  {
    href: '#',
    category: 'Article',
    date: '24 days ago',
    title: 'Our first project with React',
    excerpt: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers influence both web designers and developers.',
    author: { name: 'Neil Sims', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png' },
  },
  {
    href: '#',
    category: 'Article',
    date: '2 months ago',
    title: 'Those HTML attributes you never use',
    excerpt: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers influence both web designers and developers.',
    author: { name: 'Roberta Casas', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png' },
  },
]

export function ListWithHeadingBlogSection(props: ListWithHeadingBlogSectionProps = {}) {
  const items = props.items?.length ? props.items : DEMO_ITEMS
  const readMoreArrow = (
    <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-16 lg:px-6 lg:py-16 ">
        <div>
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? 'Our Blog'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.description ?? 'We use an agile approach to test assumptions and connect with the needs of your audience early and often.'}
          </p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item, i) => (
            <article
              key={i}
              className={i === 0 ? 'pb-6' : i === items.length - 1 ? 'pt-6' : 'py-6'}
            >
              <div className="mb-5 flex items-center justify-between text-gray-500">
                <Badge color="info">
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
                <span className="text-sm">{item.date ?? item.publishedAt ?? ''}</span>
              </div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <a href={item.href ?? item.slug ?? '#'}>{item.title ?? ''}</a>
              </h2>
              <p className="mb-5 text-gray-500 dark:text-gray-400">
                {item.excerpt ?? item.description ?? ''}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    alt={`${item.author?.name ?? ''} portrait`}
                    src={item.author?.avatar ?? ''}
                    className="h-7 w-7 rounded-full"
                  />
                  <span className="font-medium dark:text-white">
                    {item.author?.name ?? ''}
                  </span>
                </div>
                <a
                  href={item.href ?? item.slug ?? '#'}
                  className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Read more{readMoreArrow}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ListWithHeadingBlogSection
