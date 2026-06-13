import { Button } from "flowbite-react";

type HorizontalPricingTableProps = {
  headline?: string
  subheadline?: string
  featuresCol1?: string[]
  featuresCol2?: string[]
  featuresCol3?: string[]
  price?: string
  period?: string
  primaryCta?: { label?: string; href?: string }
  secondaryCta?: { label?: string; href?: string }
}

const DEMO_COL1 = ['A/B Testing', '24/7 Chat Support', 'Custom Branding', 'Creative Assistant', 'Website Builder']
const DEMO_COL2 = ['Customer Builder', 'Marketing CRM', 'Custom Templates', 'Creative Assistant', 'Multivariate Testing']
const DEMO_COL3 = ['Advanced Tools', 'Multivariate Testing', 'Reporting', 'Custom Templates', 'Dynamic Content']

const CheckCircleIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

export function HorizontalPricingTable(props: HorizontalPricingTableProps = {}) {
  const col1 = props.featuresCol1 ?? DEMO_COL1
  const col2 = props.featuresCol2 ?? DEMO_COL2
  const col3 = props.featuresCol3 ?? DEMO_COL3
  const price = props.price ?? '$99'
  const period = props.period ?? 'month'
  const ctaLabel = props.primaryCta?.label ?? 'Buy now'
  const ctaHref = props.primaryCta?.href ?? '#'
  const secLabel = props.secondaryCta?.label ?? 'View team pricing'
  const secHref = props.secondaryCta?.href ?? '#'

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="rounded-lg bg-white shadow dark:bg-gray-800 lg:grid lg:grid-cols-3">
          <div className="col-span-2 p-6 lg:p-8">
            <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
              {props.headline ?? 'Pricing built for all businesses.'}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {props.subheadline ?? 'Best for large scale uses and extended redistribution rights.'}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6">
              <ul className="space-y-4 dark:text-white">
                {col1.map((f, i) => (
                  <li key={i} className="flex space-x-2.5">
                    <CheckCircleIcon />
                    <span className="leading-tight text-gray-500 dark:text-gray-400">{f}</span>
                  </li>
                ))}
              </ul>
              <ul className="hidden space-y-4 dark:text-white sm:block">
                {col2.map((f, i) => (
                  <li key={i} className="flex space-x-2.5">
                    <CheckCircleIcon />
                    <span className="leading-tight text-gray-500 dark:text-gray-400">{f}</span>
                  </li>
                ))}
              </ul>
              <ul className="hidden space-y-4 dark:text-white lg:block">
                {col3.map((f, i) => (
                  <li key={i} className="flex space-x-2.5">
                    <CheckCircleIcon />
                    <span className="leading-tight text-gray-500 dark:text-gray-400">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex bg-gray-50 p-6 text-center dark:bg-gray-700 lg:p-8">
            <div className="w-full self-center">
              <div className="text-5xl font-extrabold text-gray-900 dark:text-white">
                {price}
              </div>
              <div className="mb-4 mt-1 text-gray-500 dark:text-gray-400">
                per {period}
              </div>
              <Button href={ctaHref}>{ctaLabel}</Button>
              <a
                href={secHref}
                className="mt-4 flex items-center justify-center font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {secLabel}
                <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HorizontalPricingTable
