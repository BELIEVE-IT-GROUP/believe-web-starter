'use client'

import { Button, ToggleSwitch } from "flowbite-react";
import { useState } from "react";

type TogglePlan = {
  name: string
  price: string
  period?: string
  description?: string
  features?: string[]
  cta?: { label?: string; href?: string }
  ctaText?: string
  ctaUrl?: string
}

type ToggleSwitchPricingTableProps = {
  headline?: string
  subheadline?: string
  monthlyLabel?: string
  yearlyLabel?: string
  plans?: TogglePlan[]
  tiers?: TogglePlan[]
}

const DEMO_PLANS: TogglePlan[] = [
  {
    name: 'Freelancer',
    price: '$49',
    period: 'month',
    description: 'Best option for personal use and for your next side projects.',
    features: ['All tools you need to manage payments', 'No setup, monthly, or hidden fees'],
    ctaText: 'Get started',
    ctaUrl: '#',
  },
  {
    name: 'Company',
    price: '$199',
    period: 'month',
    description: 'Best option for personal use and for your next side projects.',
    features: ['All tools you need to manage payments', 'No setup, monthly, or hidden fees', 'Comprehensive security and rigorous', 'Get hundreds of feature updates'],
    ctaText: 'Get started',
    ctaUrl: '#',
  },
  {
    name: 'Enterprise',
    price: '$999',
    period: 'month',
    description: 'Best option for personal use and for your next side projects.',
    features: ['All tools you need to manage payments', 'No setup, monthly, or hidden fees', 'Comprehensive security', 'Get hundreds of feature updates', 'Payouts to your bank accounts', 'Financial reconciliation', '24×7chat and email support', 'Robust developer platform'],
    ctaText: 'Get started',
    ctaUrl: '#',
  },
]

const CheckIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

export function ToggleSwitchPricingTable(props: ToggleSwitchPricingTableProps = {}) {
  const [monthly, setMonthly] = useState(true);
  const plans = props.plans?.length ? props.plans : props.tiers?.length ? props.tiers : DEMO_PLANS

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16 ">
        <div className="mb-8 max-w-screen-md lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? 'Designed for business teams like yours'}
          </h2>
          <p className="mb-5 text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.subheadline ?? 'Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.'}
          </p>
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-900 dark:text-white">
              {props.monthlyLabel ?? 'Monthly'}
            </span>
            <div className="mx-3">
              <ToggleSwitch
                checked={!monthly}
                label=""
                onChange={() => setMonthly(!monthly)}
              />
            </div>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">
              {props.yearlyLabel ?? 'Yearly'}
            </span>
          </div>
        </div>
        <div className="mb-4 space-y-8 md:gap-12 lg:mb-8 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-16">
          {plans.map((plan, i) => {
            const ctaText = plan.ctaText ?? plan.cta?.label ?? 'Get started'
            const ctaUrl = plan.ctaUrl ?? plan.cta?.href ?? '#'
            return (
              <div key={i} className="flex max-w-lg flex-col text-gray-900 dark:text-gray-400">
                <h3 className="font-semibold uppercase text-gray-500 dark:text-gray-400">{plan.name}</h3>
                <div className="my-4 flex items-baseline">
                  <span className="mr-2 text-5xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>}
                </div>
                {plan.description && (
                  <p className="text-gray-500 dark:text-gray-300 sm:text-lg">{plan.description}</p>
                )}
                {plan.features && plan.features.length > 0 && (
                  <ul className="my-8 space-y-4 text-left">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center space-x-3">
                        <CheckIcon />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button href={ctaUrl}>{ctaText}</Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default ToggleSwitchPricingTable
