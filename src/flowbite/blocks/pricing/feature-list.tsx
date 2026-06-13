import { Button } from "flowbite-react";

type FeatureItem = {
  title: string
  description: string
}

type SinglePlan = {
  name: string
  price: string
  period?: string
  description?: string
  features?: string[]
  cta?: { label?: string; href?: string }
  ctaText?: string
  ctaUrl?: string
}

type FeatureListPricingCardProps = {
  headline?: string
  subheadline?: string
  featureItems?: FeatureItem[]
  plans?: SinglePlan[]
  tiers?: SinglePlan[]
}

const DEMO_FEATURE_ITEMS: FeatureItem[] = [
  { title: 'Industry analysis', description: 'Benchmark your company against the industry to inform your growth strategy and analyze market trends.' },
  { title: 'Company analysis', description: "Uncover competitor digital strategies and deep dive into any company's digital footprint." },
  { title: 'App analysis', description: 'Analyze app industry trends and discover audience interests to learn which apps are gaining traction in the app ecosystem.' },
  { title: 'Audience analysis', description: 'Benchmark your company against the industry to inform your growth strategy and analyze market trends.' },
]

const DEMO_PLAN: SinglePlan = {
  name: 'Pro Plan',
  price: '$599',
  period: 'month',
  description: 'Best for large scale uses and extended redistribution rights.',
  features: ['A/B Testing', '24/7 Email & Chat Support', 'Custom Branding', 'Creative Assistant', 'Website Builder', 'Advanced Segmentation', 'Multivariate Testing', 'Comparative Reporting', 'Custom Templates', 'Dynamic Content'],
  ctaText: 'Upgrade now',
  ctaUrl: '#',
}

const FeatureIcons = [
  <path key="0" fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />,
  <path key="1" fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />,
  <path key="2" fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />,
  <path key="3" d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />,
]

const CheckCircleIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

export function FeatureListPricingCard(props: FeatureListPricingCardProps = {}) {
  const featureItems = props.featureItems ?? DEMO_FEATURE_ITEMS
  const planData = props.plans?.[0] ?? props.tiers?.[0] ?? DEMO_PLAN
  const ctaText = planData.ctaText ?? planData.cta?.label ?? 'Upgrade now'
  const ctaUrl = planData.ctaUrl ?? planData.cta?.href ?? '#'
  // Split features into two columns (first 5, rest)
  const features = planData.features ?? DEMO_PLAN.features ?? []
  const col1 = features.slice(0, 5)
  const col2 = features.slice(5)

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl items-center gap-8 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16 xl:gap-16">
        <div className="text-gray-500 sm:text-lg">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? 'Why you should upgrade to Flowbite Pro'}
          </h2>
          <p className="mb-8 dark:text-gray-400 lg:text-xl">
            {props.subheadline ?? 'Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value.'}
          </p>
          <div className="grid gap-8 border-t border-gray-200 py-8 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-1">
            {featureItems.map((item, i) => (
              <div key={i} className="flex">
                <div className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded bg-white shadow dark:bg-gray-700">
                  <svg className="h-7 w-7 text-gray-900 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    {FeatureIcons[i % FeatureIcons.length]}
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col rounded-lg bg-white p-6 shadow dark:bg-gray-800 xl:p-8">
          <div className="items-center justify-between md:flex">
            <div>
              <div className="mb-2 flex justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {planData.name}
                </h3>
                <div className="flex items-center md:hidden">
                  <div className="mr-1 text-xl font-extrabold text-gray-900 dark:text-white lg:text-5xl">
                    {planData.price}
                  </div>
                  {planData.period && <span className="text-gray-500 dark:text-gray-400">/{planData.period}</span>}
                </div>
              </div>
              {planData.description && (
                <p className="text-lg text-gray-500 dark:text-gray-400 md:mr-2">{planData.description}</p>
              )}
            </div>
            <div className="hidden md:block">
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white lg:text-5xl">
                {planData.price}
              </div>
              {planData.period && <span className="text-gray-500 dark:text-gray-400">per {planData.period}</span>}
            </div>
          </div>
          <Button href={ctaUrl} className="my-6">
            {ctaText}
          </Button>
          <div className="justify-between space-y-4 sm:flex sm:space-y-0">
            {col1.length > 0 && (
              <ul className="space-y-4">
                {col1.map((f, j) => (
                  <li key={j} className="flex space-x-2.5">
                    <CheckCircleIcon />
                    <span className="leading-tight text-gray-500 dark:text-gray-400">{f}</span>
                  </li>
                ))}
              </ul>
            )}
            {col2.length > 0 && (
              <ul className="space-y-4">
                {col2.map((f, j) => (
                  <li key={j} className="flex space-x-2.5">
                    <CheckCircleIcon />
                    <span className="leading-tight text-gray-500 dark:text-gray-400">{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureListPricingCard
