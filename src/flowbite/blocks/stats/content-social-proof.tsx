type StatsContentProps = {
  headline?: string
  subheadline?: string
  items?: { value: string; label: string }[]
}

const DEFAULT_ITEMS = [
  { value: '73M+', label: 'developers' },
  { value: '1B+', label: 'contributors' },
  { value: '4M+', label: 'organizations' },
]

export function SocialProofContentSection(props: StatsContentProps = {}) {
  const headline = props.headline ?? 'Home to the software teams'
  const subheadline = props.subheadline ?? "Meet your developers where they already are. GitHub is home to over 40 million developers and the world's largest open source community."
  const items = props.items ?? DEFAULT_ITEMS
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-6 lg:py-16">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-5xl">
          {headline}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 sm:px-8 sm:text-lg lg:px-32 xl:px-64">
          {subheadline}
        </p>
        <dl className="mx-auto mt-8 grid max-w-screen-md grid-cols-2 gap-8 text-gray-900 dark:text-white sm:grid-cols-3 lg:mt-14">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-4xl font-extrabold">{item.value}</dt>
              <dd className="text-xl font-normal text-gray-500 dark:text-gray-400">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default SocialProofContentSection
