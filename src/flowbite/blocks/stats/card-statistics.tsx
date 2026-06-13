import { Card } from "flowbite-react";

type StatsCardItem = {
  value: string
  label: string
  description?: string
}

type StatsCardStatisticsProps = {
  headline?: string
  items?: StatsCardItem[]
  footnote?: string
}

const DEFAULT_ITEMS: StatsCardItem[] = [
  { value: '40%', label: 'Reduction', description: 'in developer onboarding time' },
  { value: '469%', label: 'Return on investment', description: 'over 3 years' },
  { value: '60+', label: 'Minutes saved', description: 'per developer, per day' },
]

export function CardsWithStatisticsSocialProof(props: StatsCardStatisticsProps = {}) {
  const headline = props.headline ?? 'Transformation by the numbers'
  const items = props.items ?? DEFAULT_ITEMS
  const footnote = props.footnote ?? 'Results based on a composite organization of 1,800 developers using GitHub over three years.'
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 xl:px-0">
        <div className="mx-auto mb-8 max-w-screen-md text-center md:mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            {headline}
          </h2>
        </div>
        <div className="mb-4 space-y-4 md:mb-8 md:grid md:grid-cols-3 md:gap-4 md:space-y-0 xl:gap-16">
          {items.map((item, i) => (
            <Card key={i} className="flex items-center justify-center rounded border-0 bg-gray-100 p-0 text-center shadow-none xl:p-6">
              <div>
                <p className="mb-2 text-4xl font-extrabold dark:text-white md:text-5xl">
                  {item.value}
                </p>
                <h3 className="mb-2 text-xl font-semibold dark:text-white">
                  {item.label}
                </h3>
                {item.description && (
                  <p className="text-gray-500 dark:text-gray-400">
                    {item.description}&nbsp;
                    <span className="font-medium text-primary-600 dark:text-primary-500">
                      *
                    </span>
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-primary-600 dark:text-primary-500">
            *
          </span>
          &nbsp;{footnote}
        </p>
      </div>
    </section>
  );
}

export default CardsWithStatisticsSocialProof
