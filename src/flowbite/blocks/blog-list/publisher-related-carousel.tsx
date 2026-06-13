'use client'

"use client";

import { Avatar, Carousel } from "flowbite-react";

type BlogListItem = {
  title?: string
  slug?: string
  href?: string
  excerpt?: string
  description?: string
  date?: string
  publishedAt?: string
  readTime?: string
  author?: { name?: string; avatar?: string }
  coverImage?: { url?: string } | string
}

type CarouselSliderCardsRelatedArticlesProps = {
  headline?: string
  /** Items are split into slides of 3 cards each. If fewer than 3, demo fills the rest. */
  items?: BlogListItem[]
}

const DEMO_SLIDE: BlogListItem[] = [
  {
    href: '#',
    coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/office-laptops.png',
    author: { name: 'Jese Leos', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png' },
    date: 'Aug 15, 2021 · 16 min read',
    title: 'Our first office',
    excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.',
  },
  {
    href: '#',
    coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/google-hq.png',
    author: { name: 'Roberta Casas', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png' },
    date: 'Aug 15, 2021 · 16 min read',
    title: 'We partnered up with Google',
    excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.',
  },
  {
    href: '#',
    coverImage: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/blog/office-laptops-2.png',
    author: { name: 'Sofia McGuire', avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png' },
    date: 'Aug 15, 2021 · 16 min read',
    title: 'Our first project with React',
    excerpt: 'Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.',
  },
]

function getImageSrc(coverImage: BlogListItem['coverImage']): string | undefined {
  if (!coverImage) return undefined
  if (typeof coverImage === 'string') return coverImage
  return coverImage.url
}

/** Split items into pages of size `pageSize`, padding last page with demo items if needed */
function paginate(items: BlogListItem[], pageSize: number): BlogListItem[][] {
  if (!items.length) return [DEMO_SLIDE, DEMO_SLIDE, DEMO_SLIDE]
  const pages: BlogListItem[][] = []
  for (let i = 0; i < items.length; i += pageSize) {
    const page = items.slice(i, i + pageSize)
    while (page.length < pageSize) page.push(DEMO_SLIDE[page.length % DEMO_SLIDE.length])
    pages.push(page)
  }
  // Keep at least 3 slides to match the original demo look
  while (pages.length < 3) pages.push(DEMO_SLIDE)
  return pages
}

export default function CarouselSliderCardsRelatedArticles(props: CarouselSliderCardsRelatedArticlesProps = {}) {
  const slides = paginate(props.items ?? [], 3)
  return (
    <aside
      aria-label="Related articles"
      className="bg-white py-8 antialiased dark:bg-gray-900 lg:py-16"
    >
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          {props.headline ?? 'Trending on Flowbite'}
        </h2>
        <div className="h-[32rem]">
          <Carousel
            indicators={false}
            leftControl={
              <span className="group mr-4 flex h-full cursor-pointer items-center justify-center focus:outline-none">
                <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 5H1m0 0 4 4M1 5l4-4"
                    />
                  </svg>
                  <span className="hidden">Previous</span>
                </span>
              </span>
            }
            rightControl={
              <span className="group flex h-full cursor-pointer items-center justify-center focus:outline-none">
                <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                  <span className="hidden">Next</span>
                </span>
              </span>
            }
            theme={{
              root: {
                leftControl: "mx-auto inline",
                rightControl: "mx-auto inline",
              },
            }}
            className="text-center first:[&>div]:text-left"
          >
            {slides.map((slide, si) => (
              <div key={si} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {slide.map((item, ci) => (
                  <article
                    key={ci}
                    className={`mx-auto max-w-sm rounded-lg bg-white p-4 shadow-md dark:border-gray-800 dark:bg-gray-800${ci === 1 ? ' hidden sm:block' : ci === 2 ? ' hidden xl:block' : ''}`}
                  >
                    <a href={item.href ?? item.slug ?? '#'}>
                      <img
                        className="mb-5 rounded-lg"
                        src={getImageSrc(item.coverImage) ?? ''}
                        alt={item.title ?? ''}
                      />
                    </a>
                    <Avatar
                      img={item.author?.avatar ?? ''}
                      rounded
                      size="sm"
                      className="mb-3 justify-start"
                    >
                      <div className="font-medium dark:text-white">
                        <div>{item.author?.name ?? ''}</div>
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          {item.date ?? item.publishedAt ?? ''}
                        </div>
                      </div>
                    </Avatar>
                    <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-2xl">
                      <a href={item.href ?? item.slug ?? '#'}>{item.title ?? ''}</a>
                    </h3>
                    <p className="mb-3 text-gray-500 dark:text-gray-400">
                      {item.excerpt ?? item.description ?? ''}
                    </p>
                    <a
                      href={item.href ?? item.slug ?? '#'}
                      className="inline-flex items-center font-medium text-primary-600 hover:text-primary-800 hover:no-underline dark:text-primary-500"
                    >
                      Read more{" "}
                      <svg
                        className="ml-1 mt-px h-3 w-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </article>
                ))}
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </aside>
  );
}
