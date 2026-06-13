'use client'

import { Button, Tooltip } from "flowbite-react";

type FeaturedItem = {
  title?: string
  liveUrl?: string
  liveUrlLabel?: string
  paragraphs?: string[]
  image?: string
  imageDark?: string
  technologies?: { name: string; logo: string }[]
  cta?: { label?: string; href?: string }
}

type PortfolioFeaturedProps = {
  headline?: string
  subheadline?: string
  primaryCta?: { label?: string; href?: string }
  secondaryCta?: { label?: string; href?: string }
  items?: FeaturedItem[]
}

const DEMO_FEATURED_ITEMS: FeaturedItem[] = [
  {
    title: "Creating Flowbite's dashboard",
    liveUrl: '#',
    liveUrlLabel: 'See the live website',
    paragraphs: [
      'The first step in creating a dashboard is to determine who will be using it and what their needs are. Are you creating a dashboard for your team to track progress on a project, or for executives to monitor key performance indicators (KPIs) for the company? What specific data points do they need to see in order to make decisions? Understanding your audience and their needs will help you determine what data to include on the dashboard.',
      'Use charts, graphs, and other visual elements to help users quickly understand the data, making sure to label all elements clearly and provide context for the data being presented.',
      'Test the dashboard with a few users before launching it to ensure that it is meeting their needs and is easy to use.',
    ],
    image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/dashboard.png',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/dashboard-dark.png',
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
    title: "Flowbite's landing page",
    liveUrl: '#',
    liveUrlLabel: 'See the live website',
    paragraphs: [
      'What action do you want visitors to take after they arrive on the page? Are you trying to sell a product, capture leads, or promote an event? Once you know your goal, you can identify your target audience and create a message that speaks directly to their needs and interests.',
      'Keep the design simple and focused on your goal, using clear headlines and calls-to-action to guide visitors towards the desired action. Use high-quality images and graphics to make the page visually appealing and highlight the benefits of your offer. Make sure the page is mobile-friendly and loads quickly to provide a good user experience.',
    ],
    image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/ngo-landing.jpg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/ngo-landing-dark.jpg',
    technologies: [
      { name: 'WordPress', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/wordpress.svg' },
      { name: 'HTML5', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/html5.svg' },
      { name: 'CSS3', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/css-3.svg' },
      { name: 'WooCommerce', logo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/technologies/woocommerce.svg' },
    ],
    cta: { label: 'View case study', href: '#' },
  },
  {
    title: 'Innovative Gallery API',
    liveUrl: '#',
    liveUrlLabel: 'See the live website',
    paragraphs: [
      'Determine what kind of emails you will be managing, who will be using the system, and what features are necessary, considering features like search, filtering, categorization, and sorting, as well as security and privacy requirements.',
    ],
    image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/gallery.jpg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/gallery-dark.jpg',
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

const ArrowRightIcon = () => (
  <svg aria-hidden="true" className="ml-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export function ProjectPortfolioFeaturedImage(props: PortfolioFeaturedProps = {}) {
  const items = (props.items && props.items.length > 0) ? props.items : DEMO_FEATURED_ITEMS
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {props.headline ?? 'Our work'}
          </h2>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.subheadline ?? 'Flowbite helps you connect with friends, family and communities of people who share your interests.'}
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-6 md:flex-row">
            <a href={props.primaryCta?.href ?? '#'} title="" className="inline-flex shrink-0 items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
              <svg aria-hidden="true" className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {props.primaryCta?.label ?? 'View all projects'}
            </a>
            <a href={props.secondaryCta?.href ?? '#'} title="" className="inline-flex shrink-0 items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
              {props.secondaryCta?.label ?? "Let's work together"}
              <svg aria-hidden="true" className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-5xl space-y-16 sm:mt-12 lg:mt-16">
          {items.map((item, i) => {
            const d = DEMO_FEATURED_ITEMS[i % DEMO_FEATURED_ITEMS.length]
            const paras = item.paragraphs ?? d.paragraphs ?? []
            const techs = item.technologies ?? d.technologies ?? []
            return (
              <div key={i} className="space-y-8 lg:space-y-12">
                <img className="h-auto w-full rounded-lg object-cover object-top shadow-lg dark:hidden" src={item.image ?? d.image} alt="" />
                <img className="hidden h-auto w-full rounded-lg object-cover object-top shadow-lg dark:block" src={item.imageDark ?? d.imageDark} alt="" />
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
                      {item.title ?? d.title}
                    </h3>
                    <a href={item.liveUrl ?? d.liveUrl ?? '#'} title="" className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline dark:text-primary-500">
                      {item.liveUrlLabel ?? d.liveUrlLabel ?? 'See the live website'}
                      <ExternalLinkIcon />
                    </a>
                    {paras.map((p, pi) => (
                      <p key={pi} className="text-base font-normal text-gray-500 dark:text-gray-400 sm:text-lg">{p}</p>
                    ))}
                  </div>
                  {techs.length > 0 && (
                    <div className="flex items-center gap-2.5">
                      {techs.map((tech, ti) => (
                        <Tooltip key={ti} content={tech.name}>
                          <img className="h-8 w-auto object-contain" src={tech.logo} alt="" />
                        </Tooltip>
                      ))}
                    </div>
                  )}
                  <Button href={item.cta?.href ?? d.cta?.href ?? '#'}>
                    {item.cta?.label ?? d.cta?.label ?? 'View case study'}
                    <ArrowRightIcon />
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

export default ProjectPortfolioFeaturedImage
