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
  readTime?: string
  author?: { name?: string; avatar?: string }
  coverImage?: { url?: string } | string
}

type CardWithImageBlogSectionProps = {
  headline?: string
  description?: string
  items?: BlogListItem[]
}

const DEMO_ITEMS: BlogListItem[] = [
  {
    href: '#',
    coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/office-laptops.png',
    category: 'Article',
    title: 'Our first office',
    excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.',
    author: { name: 'Jese Leos', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png' },
    date: 'Aug 15, 2021 · 16 min read',
  },
  {
    href: '#',
    coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/google-hq.png',
    category: 'Article',
    title: 'We partnered up with Google',
    excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.',
    author: { name: 'Roberta Casas', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png' },
    date: 'Aug 15, 2021 · 16 min read',
  },
  {
    href: '#',
    coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/office-laptops-2.png',
    category: 'Article',
    title: 'Our first project with React',
    excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.',
    author: { name: 'Sofia McGuire', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png' },
    date: 'Aug 15, 2021 · 16 min read',
  },
]

function getImageSrc(coverImage: BlogListItem['coverImage']): string | undefined {
  if (!coverImage) return undefined
  if (typeof coverImage === 'string') return coverImage
  return coverImage.url
}

export function CardWithImageBlogSection(props: CardWithImageBlogSectionProps = {}) {
  const items = props.items?.length ? props.items : DEMO_ITEMS
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? 'Our Blog'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.description ?? 'We use an agile approach to test assumptions and connect with the needs of your audience early and often.'}
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Card key={i} className="[&>div]:p-5">
              <a href={item.href ?? item.slug ?? '#'}>
                <img
                  className="rounded-lg"
                  src={getImageSrc(item.coverImage) ?? ''}
                  alt={item.title ?? ''}
                />
              </a>
              <span>
                <Badge color="purple" className="inline">
                  {item.category ?? 'Article'}
                </Badge>
              </span>
              <h2 className="-my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <a href={item.href ?? item.slug ?? '#'}>{item.title ?? ''}</a>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {item.excerpt ?? item.description ?? ''}
              </p>
              <div className="flex items-center space-x-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={item.author?.avatar ?? ''}
                  alt={`${item.author?.name ?? ''} avatar`}
                />
                <div className="font-medium dark:text-white">
                  <div>{item.author?.name ?? ''}</div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {item.date ?? item.publishedAt ?? ''}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CardWithImageBlogSection
