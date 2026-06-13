'use client'

import { Tabs, theme } from "flowbite-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type TabsPlan = {
  name: string
  detailsLabel?: string
  description?: string
  price?: string
  startsAtLabel?: string
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  footnote?: string
  defaultActive?: boolean
}

type TabsSelectorPricingCardsProps = {
  headline?: string
  plans?: TabsPlan[]
  tiers?: TabsPlan[]
}

const DEMO_PLANS: TabsPlan[] = [
  {
    name: 'Starter',
    detailsLabel: 'Starter details:',
    description: 'Plan pricing starts at 250 contacts. Select your audience size to calculate your price. The monthly email send limit for Standard plans is 12 times your maximum contact count.*.',
    price: '$49',
    startsAtLabel: 'Starts at',
    ctaLabel: 'Buy now',
    ctaHref: '#',
    secondaryLabel: 'View team pricing',
    secondaryHref: '#',
    footnote: "*To see the monthly email send limit included with your specific plan, click Calculate my price. If your plan's contact or email send limit is exceeded, you will be charged for overages.",
  },
  {
    name: 'Standard',
    detailsLabel: 'Standard details:',
    description: 'Plan pricing starts at 500 contacts. Select your audience size to calculate your price. The monthly email send limit for Standard plans is 12 times your maximum contact count.*.',
    price: '$99',
    startsAtLabel: 'Starts at',
    ctaLabel: 'Buy now',
    ctaHref: '#',
    secondaryLabel: 'View team pricing',
    secondaryHref: '#',
    footnote: "*To see the monthly email send limit included with your specific plan, click Calculate my price. If your plan's contact or email send limit is exceeded, you will be charged for overages.",
    defaultActive: true,
  },
  {
    name: 'Premium',
    detailsLabel: 'Premium details:',
    description: 'Plan pricing starts at 1000 contacts. Select your audience size to calculate your price. The monthly email send limit for Standard plans is 12 times your maximum contact count.*.',
    price: '$149',
    startsAtLabel: 'Starts at',
    ctaLabel: 'Buy now',
    ctaHref: '#',
    secondaryLabel: 'View team pricing',
    secondaryHref: '#',
    footnote: "*To see the monthly email send limit included with your specific plan, click Calculate my price. If your plan's contact or email send limit is exceeded, you will be charged for overages.",
  },
  {
    name: 'Enterprise',
    detailsLabel: 'Enterprise details:',
    description: 'Plan pricing starts at unlimited contacts. Select your audience size to calculate your price. The monthly email send limit for Standard plans is 12 times your maximum contact count.*.',
    price: '$249',
    startsAtLabel: 'Starts at',
    ctaLabel: 'Buy now',
    ctaHref: '#',
    secondaryLabel: 'View team pricing',
    secondaryHref: '#',
    footnote: "*To see the monthly email send limit included with your specific plan, click Calculate my price. If your plan's contact or email send limit is exceeded, you will be charged for overages.",
  },
]

export function TabsSelectorPricingCards(props: TabsSelectorPricingCardsProps = {}) {
  const plans = props.plans?.length ? props.plans : props.tiers?.length ? props.tiers : DEMO_PLANS
  const defaultActive = plans.find(p => p.defaultActive)?.name ?? plans[1]?.name ?? plans[0]?.name ?? ''
  const [activeTab, setActiveTab] = useState(defaultActive);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="divide-y divide-gray-200 rounded-lg bg-white shadow dark:divide-gray-700 dark:bg-gray-800 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <div className="col-span-2 p-6 lg:p-8">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {props.headline ?? 'Choose a pricing plan:'}
            </h3>
            <Tabs
              onClick={() => {
                window.setTimeout(() => {
                  setActiveTab(
                    document.querySelector("[aria-selected=true]")?.innerHTML ?? "",
                  );
                }, 50);
              }}
              variant="fullWidth"
              theme={{
                tablist: {
                  variant: {
                    fullWidth: "grid w-full grid-flow-col divide-x divide-gray-200 rounded-lg text-sm font-medium shadow dark:divide-gray-500 dark:text-gray-400",
                  },
                  tabitem: {
                    base: twMerge(theme.tabs.tablist.tabitem.base, "dark:focus:ring-0"),
                    variant: {
                      fullWidth: {
                        active: {
                          on: "active rounded-none border border-gray-200 bg-gray-100 p-4 text-gray-900 first:rounded-l-lg last:rounded-r-lg dark:border-gray-500 dark:bg-gray-600 dark:text-white",
                          off: "rounded-none border border-gray-200 bg-white first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50 hover:text-gray-700 dark:border-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white",
                        },
                      },
                    },
                  },
                },
              }}
            >
              {plans.map((plan, i) => (
                <Tabs.Item key={i} title={plan.name} active={plan.defaultActive}>
                  {plan.detailsLabel && (
                    <div className="mb-2 mt-6 font-medium text-gray-900 dark:text-white">{plan.detailsLabel}</div>
                  )}
                  <p className="text-lg text-gray-500 dark:text-gray-400">{plan.description}</p>
                </Tabs.Item>
              ))}
            </Tabs>
          </div>
          <div className="flex p-6 lg:p-8">
            {plans.map((plan, i) => (
              <div key={i} className={`w-full self-center ${activeTab === plan.name ? '' : 'hidden'}`}>
                <div className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                  {plan.name} plan
                </div>
                {plan.startsAtLabel && (
                  <div className="text-gray-500 dark:text-gray-400">{plan.startsAtLabel}</div>
                )}
                <div className="mb-4 text-5xl font-extrabold text-gray-900 dark:text-white">
                  {plan.price}
                </div>
                <a href={plan.ctaHref ?? '#'} className="mb-4 flex justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900">
                  {plan.ctaLabel ?? 'Buy now'}
                </a>
                {plan.secondaryLabel && (
                  <a href={plan.secondaryHref ?? '#'} className="mb-4 flex items-center font-medium text-primary-600 hover:text-primary-700 dark:text-primary-500">
                    {plan.secondaryLabel}
                    <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {plan.footnote && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{plan.footnote}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TabsSelectorPricingCards
