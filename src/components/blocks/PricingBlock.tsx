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
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
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
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
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
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        {(headline || subheadline) && (
          <div className="mb-12 text-center">
            {headline && (
              <h2 className="font-display mb-4 text-3xl font-medium text-ink-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && <p className="text-lg text-ink-500">{subheadline}</p>}
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
                className={`relative rounded-xl border p-8 ${
                  tier.highlighted
                    ? 'border-believe-700 bg-believe-900 text-paper'
                    : 'border-ink-900/10 bg-paper'
                }`}
              >
                {tier.badge && (
                  <div className="absolute right-6 top-6">
                    <span className="eyebrow">{tier.badge}</span>
                  </div>
                )}
                <h3 className={`font-display mb-2 text-xl font-medium ${tier.highlighted ? 'text-paper' : 'text-ink-900'}`}>
                  {tier.name}
                </h3>
                {tier.description && (
                  <p className={`mb-4 text-sm ${tier.highlighted ? 'text-paper/70' : 'text-ink-500'}`}>
                    {tier.description}
                  </p>
                )}
                <div className="mb-6">
                  <span className={`font-display text-4xl font-medium ${tier.highlighted ? 'text-paper' : 'text-ink-900'}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={tier.highlighted ? 'text-paper/70' : 'text-ink-500'}>/{tier.period}</span>
                  )}
                </div>
                <ul className="mb-8 space-y-3">
                  {included.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 ${tier.highlighted ? 'text-paper/90' : 'text-ink-900'}`}>
                      <span className={tier.highlighted ? 'text-signal-400' : 'text-believe-700'}>
                        <CheckIcon />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                  {excluded.map((f, j) => (
                    <li key={`excluded-${j}`} className={`flex items-center gap-2 ${tier.highlighted ? 'text-paper/40' : 'text-ink-500/50'}`}>
                      <span><MinusIcon /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {ctaText && (
                  <a
                    href={ctaUrl}
                    className={`block w-full rounded-full px-5 py-3 text-center text-sm font-medium transition-colors ${
                      tier.highlighted
                        ? 'bg-paper text-believe-900 hover:bg-paper/90'
                        : 'rounded-full bg-believe-700 text-paper hover:bg-believe-900'
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
