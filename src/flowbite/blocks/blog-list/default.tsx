import { Badge, Card } from "flowbite-react";

type BlogListItem = {
  title?: string
  slug?: string
  href?: string
  excerpt?: string
  description?: string
  category?: string
  publishedAt?: string
  date?: string
  author?: { name?: string; avatar?: string }
  coverImage?: { url?: string } | string
}

type DefaultBlogSectionProps = {
  headline?: string
  description?: string
  items?: BlogListItem[]
}

export function DefaultBlogSection(props: DefaultBlogSectionProps = {}) {
  const items = props.items ?? []
  const item0 = items[0] ?? {}
  const item1 = items[1] ?? {}
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl">
            {props.headline ?? 'Our Blog'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.description ?? 'We use an agile approach to test assumptions and connect with the needs of your audience early and often.'}
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between text-gray-500">
              <Badge color="info">
                <svg
                  className="mr-1 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                {item0.category ?? 'Tutorial'}
              </Badge>
              <span className="text-sm">{item0.date ?? '14 days ago'}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <a href={item0.href ?? item0.slug ?? '#'}>{item0.title ?? 'How to quickly deploy a static website'}</a>
            </h2>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              {item0.excerpt ?? item0.description ?? 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers influence both web designers and developers.'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  alt={`${item0.author?.name ?? 'Jese Leos'} avatar`}
                  src={item0.author?.avatar ?? 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png'}
                  className="h-7 w-7 rounded-full"
                />
                <span className="font-medium dark:text-white">{item0.author?.name ?? 'Jese Leos'}</span>
              </div>
              <a
                href={item0.href ?? item0.slug ?? '#'}
                className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Read more
                <svg
                  className="ml-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between text-gray-500">
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
                {item1.category ?? 'Article'}
              </Badge>
              <span className="text-sm">{item1.date ?? '14 days ago'}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <a href={item1.href ?? item1.slug ?? '#'}>{item1.title ?? 'Our first project with React'}</a>
            </h2>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              {item1.excerpt ?? item1.description ?? 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers influence both web designers and developers.'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  alt={`${item1.author?.name ?? 'Bonnie Green'} avatar`}
                  src={item1.author?.avatar ?? 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png'}
                  className="h-7 w-7 rounded-full"
                />
                <span className="font-medium dark:text-white">
                  {item1.author?.name ?? 'Bonnie Green'}
                </span>
              </div>
              <a
                href={item1.href ?? item1.slug ?? '#'}
                className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Read more
                <svg
                  className="ml-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default DefaultBlogSection
