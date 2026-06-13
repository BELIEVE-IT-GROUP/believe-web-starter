type StatsDefaultProps = {
  items?: { value: string; label: string }[]
}

const DEFAULT_ITEMS = [
  { value: '73M+', label: 'developers' },
  { value: '1B+', label: 'contributors' },
  { value: '4M+', label: 'organizations' },
]

export function DefaultSocialProof(props: StatsDefaultProps = {}) {
  const items = props.items ?? DEFAULT_ITEMS
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-6 lg:py-16">
        <dl className="mx-auto grid max-w-screen-md gap-8 text-gray-900 dark:text-white sm:grid-cols-3">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl font-extrabold md:text-4xl">{item.value}</dt>
              <dd className="text-gray-500 dark:text-gray-400">{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default DefaultSocialProof
