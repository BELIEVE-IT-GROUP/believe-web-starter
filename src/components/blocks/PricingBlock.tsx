import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

type PricingFeature = string | { feature?: string }

type PricingPlan = {
  name: string
  price: string
  period?: string
  description?: string
  features?: PricingFeature[]
  notIncluded?: PricingFeature[]
  cta?: { text?: string; url?: string }
  ctaText?: string
  ctaUrl?: string
  highlighted?: boolean
  badge?: string
}

function featureText(feature: PricingFeature) {
  return typeof feature === 'string' ? feature : feature.feature || ''
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 12h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}

export function PricingBlock(props: {
  headline?: string
  subheadline?: string
  plans?: PricingPlan[]
  tiers?: PricingPlan[]
  appearance?: BlockAppearance
}) {
  const { headline, subheadline, appearance } = props
  const plans = props.plans?.length ? props.plans : props.tiers || []

  return (
    <section {...getSectionProps(appearance, { background: 'bg-gray-50' })}>
      <div className={getContainerClassName(appearance)}>
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
          {plans.map((tier, i) => {
            const included = tier.features?.map(featureText).filter(Boolean) || []
            const excluded = tier.notIncluded?.map(featureText).filter(Boolean) || []
            const ctaText = tier.ctaText || tier.cta?.text
            const ctaUrl = tier.ctaUrl || tier.cta?.url || '#'

            return (
            <div
              key={i}
              className={`relative rounded-lg border p-8 ${
                tier.highlighted
                  ? 'border-primary-600 bg-white shadow-lg'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {tier.badge && (
                <div className="absolute right-6 top-6 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  {tier.badge}
                </div>
              )}
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
                {included.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-600">
                    <span className="text-primary-600"><CheckIcon /></span>
                    <span>{f}</span>
                  </li>
                ))}
                {excluded.map((f, j) => (
                  <li key={`excluded-${j}`} className="flex items-center gap-2 text-gray-400">
                    <span><MinusIcon /></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {ctaText && (
                <a
                  href={ctaUrl}
                  className={`block w-full rounded-lg px-5 py-3 text-center text-sm font-medium ${
                    tier.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  {ctaText}
                </a>
              )}
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
