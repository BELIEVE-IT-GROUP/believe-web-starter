type StatsHeadingProps = {
  headline?: string
  subheadline?: string
  items?: { value: string; label: string }[]
}

const DEFAULT_ITEMS = [
  { value: '$76 bilion', label: '24h trading volume on Flowbite exchange' },
  { value: '600+', label: 'Cryptocurrencies listed on our platform' },
  { value: '90 milion', label: 'Registered users who trust Flowbite' },
  { value: '<0.10%', label: 'Lowest transaction fees' },
]

export function HeadingWithStatisticsSocialProof(props: StatsHeadingProps = {}) {
  const headline = props.headline ?? 'Sign up for our newsletter'
  const subheadline = props.subheadline ?? 'Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.'
  const items = props.items ?? DEFAULT_ITEMS
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {headline}
        </h2>
        <p className="max-w-2xl text-gray-500 dark:text-gray-400 sm:text-xl">
          {subheadline}
        </p>
        <dl className="mt-8 grid gap-8 text-gray-900 dark:text-white sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-20">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col">
              <dt className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                {item.value}
              </dt>
              <dd className="text-gray-500 dark:text-gray-400">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default HeadingWithStatisticsSocialProof
