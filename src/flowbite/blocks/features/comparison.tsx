type FeaturesComparisonCard = {
  label?: string
  title?: string
  href?: string
  accentClass?: string
}

type FeaturesComparisonProps = {
  headline?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  cards?: FeaturesComparisonCard[]
}

const DEFAULT_COMPARISON_CARDS: FeaturesComparisonCard[] = [
  { label: 'Simplicity and Affordability', title: 'Flowbite vs Google', href: '#', accentClass: 'border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500' },
  { label: 'Built for customer support', title: 'Microsoft vs Apple', href: '#', accentClass: 'border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-500' },
  { label: 'Modern and intuitive ui', title: 'Zendesk vs Meet', href: '#', accentClass: 'border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-500' },
]

export function ComparisonCardsFeatureSection(props: FeaturesComparisonProps = {}) {
  const headline = props.headline ?? 'Compare Flowbite to other platforms on the market'
  const description = props.description ?? 'Here we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.'
  const ctaLabel = props.ctaLabel ?? 'Learn what makes Flowbite different'
  const ctaHref = props.ctaHref ?? '#'
  const cards = props.cards ?? DEFAULT_COMPARISON_CARDS

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="grid space-y-8 lg:grid-cols-2 lg:gap-12 lg:space-y-0">
          <div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {headline}
            </h2>
            <p className="mb-4 text-gray-500 dark:text-gray-400 sm:text-xl">
              {description}
            </p>
            <a
              href={ctaHref}
              className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 sm:text-lg"
            >
              {ctaLabel}&nbsp;
              <svg
                className="ml-1 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <div>
            {cards.map((card, i) => {
              const accent = card.accentClass ?? DEFAULT_COMPARISON_CARDS[i % DEFAULT_COMPARISON_CARDS.length].accentClass ?? 'border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500'
              const isLast = i === cards.length - 1
              return (
                <a
                  key={i}
                  href={card.href ?? '#'}
                  className={`${isLast ? '' : 'mb-6 '}flex items-center justify-between rounded-lg border-l-8 bg-white p-4 shadow hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 ${accent}`}
                >
                  <div>
                    <span className="mb-1 block text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      {card.label ?? DEFAULT_COMPARISON_CARDS[i % DEFAULT_COMPARISON_CARDS.length].label}
                    </span>
                    <span className={`text-xl font-semibold ${accent.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                      {card.title ?? DEFAULT_COMPARISON_CARDS[i % DEFAULT_COMPARISON_CARDS.length].title}
                    </span>
                  </div>
                  <svg
                    className={`h-6 w-6 ${accent.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComparisonCardsFeatureSection
