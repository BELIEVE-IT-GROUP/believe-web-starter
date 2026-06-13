'use client'

import { Button, Tooltip } from "flowbite-react";

type AlternateItem = {
  title?: string
  url?: string
  urlLabel?: string
  description?: string
  image?: string
  imageDark?: string
  technologies?: { name: string; logo: string }[]
  cta?: { label?: string; href?: string }
}

type PortfolioAlternateProps = {
  headline?: string
  subheadline?: string
  items?: AlternateItem[]
}

const DEMO_ITEMS: AlternateItem[] = [
  {
    title: "Flowbite's dashboard",
    url: 'https://flowbite.com',
    urlLabel: 'https://flowbite.com',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests. Connecting with your friends and family as well as discovering new ones is easy with features like Groups.',
    image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/flowbite-dashboard.jpg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/flowbite-dashboard-dark.jpg',
    technologies: [
      { name: 'HTML5', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/html5.svg' },
      { name: 'CSS3', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/css-3.svg' },
      { name: 'JavaScript', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/javascript.svg' },
      { name: 'Tailwind CSS', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/tailwind-css.svg' },
      { name: 'TypeScript', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/typescript.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
  {
    title: 'Agency Landing Page',
    url: 'https://themesberg.com',
    urlLabel: 'https://themesberg.com',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests. Connecting with your friends and family as well as discovering new ones is easy with features like Groups.',
    image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/agency-landing-page.jpg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/agency-landing-page-dark.jpg',
    technologies: [
      { name: 'WordPress', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/wordpress.svg' },
      { name: 'HTML5', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/html5.svg' },
      { name: 'CSS3', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/css-3.svg' },
      { name: 'WooCommerce', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/woocommerce.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
  {
    title: 'Mail management system',
    url: 'https://ui.glass',
    urlLabel: 'https://ui.glass',
    description: 'Flowbite helps you connect with friends, family and communities of people who share your interests. Connecting with your friends and family as well as discovering new ones is easy with features like Groups.',
    image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/mail-management-system.jpg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/mail-management-system-dark.jpg',
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
]

const ExternalLinkIcon = () => (
  <svg aria-hidden="true" className="ml-2.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
  </svg>
)

const ArrowIcon = () => (
  <svg aria-hidden="true" className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

export function ProjectPortfolioAlternateSections(props: PortfolioAlternateProps = {}) {
  const items = (props.items && props.items.length > 0) ? props.items : DEMO_ITEMS
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {props.headline ?? 'Our work'}
          </h2>
          <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.subheadline ?? 'Flowbite helps you connect with friends, family and communities of people who share your interests.'}
          </p>
        </div>
        <div className="mt-12 space-y-16 sm:mt-16">
          {items.map((item, i) => {
            const d = DEMO_ITEMS[i % DEMO_ITEMS.length]
            const isEven = i % 2 === 1
            return (
              <div key={i} className="flex flex-col gap-y-8 sm:gap-y-12 lg:flex-row lg:items-center lg:gap-x-16 xl:gap-x-24">
                <div className={isEven ? 'lg:order-2' : ''}>
                  <img className="w-full rounded-lg object-cover shadow-lg dark:hidden" src={item.image ?? d.image} alt="" />
                  <img className="hidden w-full rounded-lg object-cover shadow-lg dark:block" src={item.imageDark ?? d.imageDark} alt="" />
                </div>
                <div className={`w-full shrink-0 space-y-6 lg:max-w-lg xl:max-w-2xl${isEven ? ' lg:order-1' : ''}`}>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
                      {item.title ?? d.title}
                    </h3>
                    <a href={item.url ?? d.url ?? '#'} title="" className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline dark:text-primary-500">
                      {item.urlLabel ?? item.url ?? d.urlLabel}
                      <ExternalLinkIcon />
                    </a>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400 sm:text-lg">
                      {item.description ?? d.description}
                    </p>
                  </div>
                  {(item.technologies ?? d.technologies ?? []).length > 0 && (
                    <div className="flex items-center gap-2.5">
                      {(item.technologies ?? d.technologies ?? []).map((tech, ti) => (
                        <Tooltip key={ti} content={tech.name}>
                          <img className="h-8 w-auto object-contain" src={tech.logo} alt="" />
                        </Tooltip>
                      ))}
                    </div>
                  )}
                  <Button href={item.cta?.href ?? d.cta?.href ?? '#'}>
                    {item.cta?.label ?? d.cta?.label ?? 'View case study'}
                    <ArrowIcon />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default ProjectPortfolioAlternateSections
