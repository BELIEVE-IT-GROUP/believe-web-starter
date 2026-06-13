'use client'

import { Button, ToggleSwitch } from "flowbite-react";
import { useState } from "react";

type HighlightedPlan = {
  name: string
  price: string
  annualNote?: string
  annualLinkLabel?: string
  annualLinkHref?: string
  features?: string[]
  notIncluded?: string[]
  cta?: { label?: string; href?: string }
  ctaText?: string
  ctaUrl?: string
  highlighted?: boolean
  badge?: string
}

type HighlightedPlanPricingTableProps = {
  headline?: string
  subheadline?: string
  plans?: HighlightedPlan[]
  tiers?: HighlightedPlan[]
}

const DEMO_PLANS: HighlightedPlan[] = [
  {
    name: 'Starter',
    price: '$29',
    annualNote: '$19 USD per month, paid annually',
    annualLinkLabel: 'Go to annual plan',
    annualLinkHref: '#',
    features: ['All tools you need to manage payments', 'No setup, monthly, or hidden fees', 'Comprehensive security'],
    notIncluded: ['Get hundreds of feature updates', 'Payouts to your bank account', 'Financial reconciliation and reporting', '24×7 phone, chat, and email support', 'Robust developer platform'],
    ctaText: 'Get started',
    ctaUrl: '#',
  },
  {
    name: 'Premium',
    price: '$199',
    annualNote: '$159 USD per month, paid annually',
    annualLinkLabel: 'Go to annual plan',
    annualLinkHref: '#',
    features: ['All tools you need to manage payments', 'No setup, monthly, or hidden fees', 'Comprehensive security', 'Get hundreds of feature updates', 'Payouts to your bank account'],
    notIncluded: ['Financial reconciliation and reporting', '24×7 phone, chat, and email support', 'Robust developer platform'],
    ctaText: 'Get started',
    ctaUrl: '#',
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: '$599',
    annualNote: '$499 USD per month, paid annually',
    annualLinkLabel: 'Go to annual plan',
    annualLinkHref: '#',
    features: ['All tools you need to manage payments', 'No setup, monthly, or hidden fees', 'Comprehensive security', 'Get hundreds of feature updates', 'Payouts to your bank account', 'Financial reconciliation and reporting', '24×7 phone, chat, and email support', 'Robust developer platform'],
    notIncluded: [],
    ctaText: 'Get started',
    ctaUrl: '#',
  },
]

export function HighlightedPlanPricingTable(props: HighlightedPlanPricingTableProps = {}) {
  const [monthly, setMonthly] = useState(true);
  const plans = props.plans?.length ? props.plans : props.tiers?.length ? props.tiers : DEMO_PLANS

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? 'Designed for business teams like yours'}
          </h2>
          <p className="mb-5 text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.subheadline ?? 'Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.'}
          </p>
          <div className="flex items-center justify-center">
            <span className="text-base font-medium text-gray-900 dark:text-white">
              Monthly
            </span>
            <div className="mx-3">
              <ToggleSwitch
                checked={!monthly}
                label=""
                onChange={() => setMonthly(!monthly)}
              />
            </div>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">
              Yearly
            </span>
          </div>
        </div>
        <div className="grid gap-8 xl:grid-cols-3 xl:gap-10">
          {plans.map((plan, i) => {
            const ctaText = plan.ctaText ?? plan.cta?.label ?? 'Get started'
            const ctaUrl = plan.ctaUrl ?? plan.cta?.href ?? '#'
            const isHighlighted = plan.highlighted ?? false
            return (
              <div key={i} className={`mx-auto flex max-w-xl flex-col rounded-lg p-6 text-center shadow dark:bg-gray-800 xl:max-w-lg xl:p-8 ${isHighlighted ? 'border border-primary-600 bg-white' : 'border border-gray-200 bg-white dark:border-gray-700'}`}>
                {plan.badge && (
                  <div className="mb-2">
                    <span className="rounded bg-primary-100 px-3 py-1 text-sm text-primary-800 dark:bg-primary-200 dark:text-primary-800">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="mb-4 text-2xl font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                {plan.annualNote && (
                  <p className="mb-1 mt-4 text-gray-500 dark:text-gray-400">{plan.annualNote}</p>
                )}
                {plan.annualLinkLabel && (
                  <a href={plan.annualLinkHref ?? '#'} className="inline-flex items-center justify-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">
                    {plan.annualLinkLabel}
                    <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                <Button href={ctaUrl} className={`my-6 ${isHighlighted ? '' : 'dark:bg-gray-700 dark:hover:bg-gray-600'}`} color={isHighlighted ? undefined : 'dark'}>
                  {ctaText}
                </Button>
                <ul className="space-y-4 text-left text-gray-900 dark:text-gray-400">
                  {(plan.features ?? []).map((f, j) => (
                    <li key={j} className="flex items-center space-x-3">
                      <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                  {(plan.notIncluded ?? []).map((f, j) => (
                    <li key={`x-${j}`} className="flex items-center space-x-3 text-gray-500">
                      <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      <span className="line-through">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default HighlightedPlanPricingTable
