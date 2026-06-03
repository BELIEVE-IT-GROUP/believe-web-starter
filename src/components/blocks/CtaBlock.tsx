import Link from 'next/link'

export function CtaBlock(props: {
  headline?: string
  subheadline?: string
  cta?: { text: string; url: string }
  variant?: string
}) {
  const { headline, subheadline, cta, variant = 'default' } = props

  const bg = variant === 'dark'
    ? 'bg-gray-900 text-white'
    : 'bg-primary-600 text-white'

  return (
    <section className={bg}>
      <div className="mx-auto max-w-screen-xl px-4 py-16 text-center lg:py-24">
        {headline && (
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            {headline}
          </h2>
        )}
        {subheadline && (
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            {subheadline}
          </p>
        )}
        {cta && (
          <Link
            href={cta.url || '#'}
            className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            {cta.text}
          </Link>
        )}
      </div>
    </section>
  )
}
