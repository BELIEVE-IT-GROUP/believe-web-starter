import { Badge, Button } from "flowbite-react";

type PortfolioItem = {
  badge?: string
  title?: string
  description?: string
  cta?: { label?: string; href?: string }
}

type PortfolioDefaultProps = {
  headline?: string
  subheadline?: string
  items?: PortfolioItem[]
}

const DEMO_ITEMS: PortfolioItem[] = [
  { badge: 'Alphabet Inc.', title: 'Official website', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', cta: { label: 'View case study', href: '#' } },
  { badge: 'Microsoft Corp.', title: 'Management system', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', cta: { label: 'View case study', href: '#' } },
  { badge: 'Adobe Inc.', title: 'Logo design', description: 'Flowbite helps you connect with friends, family and communities of people who share your interests.', cta: { label: 'View case study', href: '#' } },
]

const ArrowIcon = () => (
  <svg aria-hidden="true" className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

export function DefaultProjectPortfolio(props: PortfolioDefaultProps = {}) {
  const items = props.items ?? DEMO_ITEMS
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {props.headline ?? 'Our work'}
          </h2>
          <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.subheadline ?? 'Crafted with skill and care to help our clients grow their business!'}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-x-20 gap-y-12 text-center sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {(items.length ? items : DEMO_ITEMS).map((item, i) => (
            <div key={i} className="space-y-4">
              <Badge color="gray" className="inline-flex">
                {item.badge ?? DEMO_ITEMS[i % DEMO_ITEMS.length].badge}
              </Badge>
              <h3 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                {item.title ?? DEMO_ITEMS[i % DEMO_ITEMS.length].title}
              </h3>
              <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
                {item.description ?? DEMO_ITEMS[i % DEMO_ITEMS.length].description}
              </p>
              <Button href={item.cta?.href ?? '#'} className="inline-flex">
                {item.cta?.label ?? 'View case study'}
                <ArrowIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DefaultProjectPortfolio
