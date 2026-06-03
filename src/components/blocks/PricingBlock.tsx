export function PricingBlock(props: {
  headline?: string
  subheadline?: string
  tiers?: {
    name: string
    price: string
    period?: string
    description?: string
    features: string[]
    cta?: { text: string; url: string }
    highlighted?: boolean
  }[]
}) {
  const { headline, subheadline, tiers } = props

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        {(headline || subheadline) && (
          <div className="mb-12 text-center">
            {headline && (
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && <p className="text-lg text-gray-500">{subheadline}</p>}
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tiers?.map((tier, i) => (
            <div
              key={i}
              className={`rounded-lg border p-8 ${
                tier.highlighted
                  ? 'border-primary-600 bg-white shadow-lg'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{tier.name}</h3>
              {tier.description && (
                <p className="mb-4 text-sm text-gray-500">{tier.description}</p>
              )}
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                {tier.period && (
                  <span className="text-gray-500">/{tier.period}</span>
                )}
              </div>
              <ul className="mb-8 space-y-3">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-600">
                    <span className="text-primary-600">✓</span> {f}
                  </li>
                ))}
              </ul>
              {tier.cta && (
                <a
                  href={tier.cta.url || '#'}
                  className={`block w-full rounded-lg px-5 py-3 text-center text-sm font-medium ${
                    tier.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {tier.cta.text}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
