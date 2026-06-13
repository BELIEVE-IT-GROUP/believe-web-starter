import { Button } from "flowbite-react";

type FeaturesRoundedItem = { title: string; description: string }

type FeaturesRoundedIconsProps = {
  headline?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  items?: FeaturesRoundedItem[]
}

const DEFAULT_ROUNDED_ITEMS: FeaturesRoundedItem[] = [
  { title: 'Automatic categorization', description: 'Flow Budget automatically categorizes your income and expenses, making it easy to track where your money is going.' },
  { title: 'Budgeting methods', description: 'The app offers a variety of budgeting methods, such as 50/30/20 rule, to help users find the approach that works best for them.' },
  { title: 'Budget goals', description: 'Set budget goals for each category and get real-time updates on how close you are to reaching them.' },
  { title: 'Reports and Analytics', description: 'We provide detailed reports and analytics that help users understand their spending habits, and make more informed financial decisions.' },
  { title: 'Cloud synchronization', description: 'Synch your data across multiple devices, so you can access your budget and expenses from anywhere, at any time, and on any device.' },
  { title: 'Alerts and notifications', description: "Flow budget will alert you if you are over-budgeting, and remind you of upcoming bills, so you'll never miss a payment again." },
]

const ROUNDED_ICON_PATHS = [
  <><path key="0a" strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path key="0b" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
  <path key="1" strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
  <path key="2" strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
  <path key="3" strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />,
  <path key="4" strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />,
  <path key="5" strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
]

export function RoundedIconsFeatureSection(props: FeaturesRoundedIconsProps = {}) {
  const headline = props.headline ?? 'Designed for business teams like yours'
  const description = props.description ?? 'Here we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.'
  const ctaLabel = props.ctaLabel ?? 'Get a demo'
  const ctaHref = props.ctaHref ?? '#'
  const items = props.items ?? DEFAULT_ROUNDED_ITEMS

  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            {description}
          </p>
        </div>
        <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800 sm:p-12 lg:mt-16">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2">
            {items.map((item, i) => (
              <div key={i} className="flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 lg:h-24 lg:w-24">
                  <svg
                    aria-hidden="true"
                    className="h-10 w-10 text-primary-600 dark:text-primary-500 lg:h-12 lg:w-12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {ROUNDED_ICON_PATHS[i % ROUNDED_ICON_PATHS.length]}
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center text-center lg:mt-16">
          <Button color="info" href={ctaHref} className="w-fit">
            {ctaLabel}
            <svg
              aria-hidden="true"
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default RoundedIconsFeatureSection
