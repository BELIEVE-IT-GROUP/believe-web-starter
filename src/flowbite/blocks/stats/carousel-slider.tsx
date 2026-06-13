'use client'

import { Carousel } from "flowbite-react";

type StatsCarouselItem = { value: string; label: string }
type StatsCarouselImage = { src: string; alt?: string }

type StatsCarouselSliderProps = {
  headline?: string
  primaryCta?: { label: string; href: string }
  images?: StatsCarouselImage[]
  items?: StatsCarouselItem[]
}

const DEFAULT_IMAGES: StatsCarouselImage[] = [
  { src: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/carousel-slider/office-work.png', alt: 'office work' },
  { src: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/carousel-slider/office.png', alt: 'office' },
  { src: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/carousel-slider/conference.png', alt: 'conference' },
  { src: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/carousel-slider/girl-with-phone.png', alt: 'girl with phone' },
  { src: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/carousel-slider/man-at-office.png', alt: 'man at office' },
  { src: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/carousel-slider/meeting.png', alt: 'meeting' },
  { src: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/carousel-slider/work-from-home.png', alt: 'work from home' },
  { src: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/carousel-slider/workspace.png', alt: 'workspace' },
]

const DEFAULT_STATS: StatsCarouselItem[] = [
  { value: '73M+', label: 'Developers' },
  { value: '100M+', label: 'Public repositories' },
  { value: '1000s', label: 'Open source projects' },
  { value: '1B+', label: 'Contributors' },
  { value: '90+', label: 'Top Forbes companies' },
  { value: '4M+', label: 'Organizations' },
]

export function CarouselSliderSocialProof(props: StatsCarouselSliderProps = {}) {
  const headline = props.headline ?? 'Unwavering in our commitment to trust'
  const primaryCta = props.primaryCta ?? { label: 'Learn more about us', href: '#' }
  const images = props.images ?? DEFAULT_IMAGES
  const items = props.items ?? DEFAULT_STATS

  // Build pairs for the desktop carousel (2 images per slide)
  const imagePairs: StatsCarouselImage[][] = []
  for (let i = 0; i < images.length; i += 2) {
    imagePairs.push(images.slice(i, i + 2))
  }

  return (
    <section className="bg-white py-8 dark:bg-gray-900 lg:py-16">
      <div className="mx-auto mb-8 max-w-screen-md px-4 text-center md:mb-16 lg:px-0">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          {headline}
        </h2>
        <div>
          <a
            href={primaryCta.href}
            className="inline-flex items-center justify-center text-base font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700"
          >
            {primaryCta.label}
            <svg
              aria-hidden
              className="ml-1 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="mx-auto h-56 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel
          indicators={false}
          className="lg:hidden [&_img]:rounded-lg"
          theme={{
            control: {
              base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/30 group-hover:bg-gray-800/60 group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-800/70 dark:bg-white/30 dark:group-hover:bg-white/50 dark:group-focus:ring-white sm:h-10 sm:w-10",
              icon: "h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6",
            },
            scrollContainer: {
              base: "ml-[17.5%] mr-[17.5%] flex h-full w-[65%] snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg",
            },
          }}
        >
          {images.map((img, i) => (
            <img key={i} src={img.src} alt={img.alt ?? '...'} />
          ))}
        </Carousel>
        <Carousel
          indicators={false}
          className="hidden lg:block [&_img]:rounded-lg"
          theme={{
            control: {
              base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/30 group-hover:bg-gray-800/60 group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-800/70 dark:bg-white/30 dark:group-hover:bg-white/50 dark:group-focus:ring-white sm:h-10 sm:w-10",
              icon: "h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6",
            },
            scrollContainer: {
              base: "ml-[7.5%] mr-[7.5%] flex h-full w-[85%] snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg",
            },
          }}
        >
          {imagePairs.map((pair, i) => (
            <div key={i} className="grid gap-6 lg:grid-cols-2">
              {pair.map((img, j) => (
                <img key={j} src={img.src} alt={img.alt ?? '...'} />
              ))}
            </div>
          ))}
        </Carousel>
      </div>
      <dl className="mx-auto mt-8 grid max-w-screen-xl grid-cols-2 gap-8 text-gray-900 dark:text-white sm:grid-cols-3 lg:mt-14 xl:grid-cols-6">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold md:text-4xl">{item.value}</dt>
            <dd className="text-gray-500 dark:text-gray-400">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default CarouselSliderSocialProof
