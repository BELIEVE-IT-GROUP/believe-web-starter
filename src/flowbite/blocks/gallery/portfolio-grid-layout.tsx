import { Badge, Button } from "flowbite-react";

type GridItem = {
  image?: string
  imageDark?: string
  badge?: string
  badgeColor?: string
  title?: string
  titleHref?: string
  description?: string
  primaryCta?: { label?: string; href?: string }
  secondaryCta?: { label?: string; href?: string }
}

type PortfolioGridProps = {
  headline?: string
  subheadline?: string
  items?: GridItem[]
}

const DEMO_GRID_ITEMS: GridItem[] = [
  { image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/agency-landing-page.jpg', imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/agency-landing-page-dark.jpg', badge: 'Figma design', badgeColor: 'indigo', title: 'Agency Landing Page', titleHref: '#', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', primaryCta: { label: 'Case study', href: '#' }, secondaryCta: { label: 'Live preview', href: '#' } },
  { image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/analytics-tool.jpg', imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/analytics-tool-dark.jpg', badge: 'Front-end', badgeColor: 'green', title: 'Analytics tool', titleHref: '#', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', primaryCta: { label: 'Case study', href: '#' }, secondaryCta: { label: 'Live preview', href: '#' } },
  { image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/task-management.jpg', imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/task-management-dark.jpg', badge: 'Back-end', badgeColor: 'blue', title: 'Task management system', titleHref: '#', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', primaryCta: { label: 'Case study', href: '#' }, secondaryCta: { label: 'Live preview', href: '#' } },
  { image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/flowbite-dashboard.jpg', imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/flowbite-dashboard-dark.jpg', badge: 'Figma design', badgeColor: 'indigo', title: "Flowbite's dashboard", titleHref: '#', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', primaryCta: { label: 'Case study', href: '#' }, secondaryCta: { label: 'Live preview', href: '#' } },
  { image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/landing-page-ngo.jpg', imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/landing-page-ngo-dark.jpg', badge: 'Figma design', badgeColor: 'indigo', title: 'NGO Landing Page', titleHref: '#', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', primaryCta: { label: 'Case study', href: '#' }, secondaryCta: { label: 'Live preview', href: '#' } },
  { image: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/mail-management-system.jpg', imageDark: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/case-study/mail-management-system-dark.jpg', badge: 'Front-end', badgeColor: 'green', title: 'Mail management system', titleHref: '#', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', primaryCta: { label: 'Case study', href: '#' }, secondaryCta: { label: 'Live preview', href: '#' } },
]

const SecondaryBtnTheme = {
  color: { gray: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:text-primary-600 focus:text-primary-700 focus:ring-2 focus:ring-primary-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white' },
  inner: { base: 'flex items-stretch transition-none' },
}

const ExternalLinkSm = () => (
  <svg aria-hidden="true" className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
  </svg>
)

export function GridLayoutImageCTAPreviewProjectPortfolio(props: PortfolioGridProps = {}) {
  const items = (props.items && props.items.length > 0) ? props.items : DEMO_GRID_ITEMS
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {props.headline ?? 'Custom works'}
          </h2>
          <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.subheadline ?? 'Flowbite helps you connect with friends, family and communities of people who share your interests.'}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-12 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-16">
          {items.map((item, i) => {
            const d = DEMO_GRID_ITEMS[i % DEMO_GRID_ITEMS.length]
            return (
              <div key={i}>
                <img className="mb-6 w-full rounded-lg object-cover shadow-lg dark:hidden" src={item.image ?? d.image} alt="" />
                <img className="mb-6 hidden w-full rounded-lg object-cover shadow-lg dark:block" src={item.imageDark ?? d.imageDark} alt="" />
                <div className="mb-6 space-y-3">
                  <Badge color={(item.badgeColor ?? d.badgeColor ?? 'blue') as any} className="w-fit">
                    {item.badge ?? d.badge}
                  </Badge>
                  <h3 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                    <a href={item.titleHref ?? d.titleHref ?? '#'} className="hover:underline">
                      {item.title ?? d.title}
                    </a>
                  </h3>
                  <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
                    {item.description ?? d.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button href={item.primaryCta?.href ?? d.primaryCta?.href ?? '#'}>{item.primaryCta?.label ?? d.primaryCta?.label ?? 'Case study'}</Button>
                  <Button color="gray" href={item.secondaryCta?.href ?? d.secondaryCta?.href ?? '#'} theme={SecondaryBtnTheme} className="w-fit">
                    <ExternalLinkSm />
                    {item.secondaryCta?.label ?? d.secondaryCta?.label ?? 'Live preview'}
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

export default GridLayoutImageCTAPreviewProjectPortfolio
