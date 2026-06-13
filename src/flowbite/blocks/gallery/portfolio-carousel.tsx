'use client'

import { Button, Carousel, Tooltip } from "flowbite-react";

type CarouselPortfolioItem = {
  clientLogo?: string
  title?: string
  livePreviewHref?: string
  description?: string
  technologies?: { name: string; logo: string }[]
  cta?: { label?: string; href?: string }
}

type PortfolioCarouselProps = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  primaryCta?: { label?: string; href?: string }
  secondaryCta?: { label?: string; href?: string }
  slides?: CarouselPortfolioItem[][]
}

const DEMO_SLIDE_1: CarouselPortfolioItem[] = [
  {
    clientLogo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/ford.svg',
    title: 'Official website',
    livePreviewHref: '#',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.',
    technologies: [
      { name: 'Flowbite', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/flowbite.svg' },
      { name: 'Tailwind CSS', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/tailwind-css.svg' },
      { name: 'HTML5', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/html5.svg' },
      { name: 'CSS3', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/css-3.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
  {
    clientLogo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/fedex.svg',
    title: 'Management system',
    livePreviewHref: '#',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.',
    technologies: [
      { name: 'TypeScript', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/typescript.svg' },
      { name: 'Java', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/java.svg' },
      { name: 'Tailwind CSS', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/tailwind-css.svg' },
      { name: 'React', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/react.svg' },
      { name: 'HTML5', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/html5.svg' },
      { name: 'Amazon Web Services', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/amazon-web-services.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
  {
    clientLogo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/intel.svg',
    title: 'Logo design',
    livePreviewHref: '#',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.',
    technologies: [
      { name: 'Figma', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/figma.svg' },
      { name: 'Adobe Illustrator', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/illustrator.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
]

const DEMO_SLIDE_2: CarouselPortfolioItem[] = [
  {
    clientLogo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/spotify.svg',
    title: 'Official website',
    livePreviewHref: '#',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.',
    technologies: [
      { name: 'Flowbite', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/flowbite.svg' },
      { name: 'Tailwind CSS', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/tailwind-css.svg' },
      { name: 'HTML5', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/html5.svg' },
      { name: 'CSS3', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/css-3.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
  {
    clientLogo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/netflix.svg',
    title: 'Management system',
    livePreviewHref: '#',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.',
    technologies: [
      { name: 'TypeScript', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/typescript.svg' },
      { name: 'Java', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/java.svg' },
      { name: 'Tailwind CSS', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/tailwind-css.svg' },
      { name: 'React', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/react.svg' },
      { name: 'HTML5', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/html5.svg' },
      { name: 'Amazon Web Services', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/amazon-web-services.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
  {
    clientLogo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/microsoft.svg',
    title: 'Logo design',
    livePreviewHref: '#',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.',
    technologies: [
      { name: 'Figma', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/figma.svg' },
      { name: 'Adobe Illustrator', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/illustrator.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
]

const DEMO_SLIDES = [DEMO_SLIDE_1, DEMO_SLIDE_2, DEMO_SLIDE_1, DEMO_SLIDE_2]

const SecondaryBtnTheme = {
  color: { gray: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:text-primary-600 focus:text-primary-700 focus:ring-2 focus:ring-primary-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white' },
  inner: { base: 'flex items-stretch transition-none' },
}

const ExternalLinkIcon = () => (
  <svg aria-hidden="true" className="ml-2.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg aria-hidden="true" className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

export function ProjectPortfolioCarousel(props: PortfolioCarouselProps = {}) {
  const slides = (props.slides && props.slides.length > 0) ? props.slides : DEMO_SLIDES
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="max-w-2xl space-y-6">
          <div>
            <p className="text-lg font-medium leading-none text-primary-600 dark:text-primary-500">
              {props.eyebrow ?? 'Trusted Worldwide'}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {props.headline ?? 'Trusted by over 100 companies and 10,000+ freelancers'}
            </h2>
            <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
              {props.subheadline ?? 'Our rigorous security and compliance standards are at the heart of all we do. We work tirelessly to protect you and your customers.'}
            </p>
          </div>
          <div className="space-y-4">
            <a href={props.primaryCta?.href ?? '#'} title="" className="flex items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
              {props.primaryCta?.label ?? 'View all projects'}
              <ChevronRightIcon />
            </a>
            <a href={props.secondaryCta?.href ?? '#'} title="" className="flex items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
              {props.secondaryCta?.label ?? 'View all testimonials'}
              <ChevronRightIcon />
            </a>
          </div>
        </div>
        <Carousel
          leftControl={
            <svg aria-hidden="true" className="mr-2 h-7 w-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          }
          rightControl={
            <svg aria-hidden="true" className="ml-2 h-7 w-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          }
          theme={{
            root: {
              leftControl: "absolute -bottom-8 right-1/2 [&_svg]:text-gray-500 [&_svg]:hover:text-gray-900 [&_svg]:dark:hover:text-white",
              rightControl: "absolute -bottom-8 left-1/2 [&_svg]:text-gray-500 [&_svg]:hover:text-gray-900 [&_svg]:dark:hover:text-white",
            },
            indicators: { base: "hidden" },
          }}
          className="mt-8 h-[400px] sm:mt-12 lg:mt-16"
        >
          {slides.map((slideItems, si) => (
            <div key={si} className="grid grid-cols-1 gap-20 sm:grid-cols-2 xl:grid-cols-3">
              {slideItems.map((item, ii) => (
                <div key={ii} className="space-y-4">
                  <img className="h-12 w-auto object-contain" src={item.clientLogo ?? ''} alt="" />
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <a href={item.livePreviewHref ?? '#'} title="" className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Live preview
                      <ExternalLinkIcon />
                    </a>
                  </div>
                  <p className="text-lg font-normal text-gray-500 dark:text-gray-400">{item.description}</p>
                  {(item.technologies ?? []).length > 0 && (
                    <div className="flex items-center gap-2.5">
                      {(item.technologies ?? []).map((tech, ti) => (
                        <Tooltip key={ti} content={tech.name}>
                          <img className="h-8 w-auto object-contain" src={tech.logo} alt="" />
                        </Tooltip>
                      ))}
                    </div>
                  )}
                  <Button color="gray" href={item.cta?.href ?? '#'} theme={SecondaryBtnTheme} className="w-fit">
                    {item.cta?.label ?? 'View case study'}
                  </Button>
                </div>
              ))}
            </div>
          ))}
          {/* end slides */}
        </Carousel>
      </div>
    </section>
  );
}

export default ProjectPortfolioCarousel
