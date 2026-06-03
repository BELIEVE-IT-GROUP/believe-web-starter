export function NewsletterBlock(props: {
  headline?: string
  subheadline?: string
  ctaText?: string
  variant?: string
}) {
  const { headline, subheadline, ctaText = 'Suscribirse', variant = 'default' } = props

  const isInline = variant === 'inline'

  return (
    <section className="bg-primary-600 py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className={`${isInline ? 'flex flex-col items-center justify-between gap-8 md:flex-row' : 'text-center'}`}>
          <div className={isInline ? '' : 'mx-auto max-w-2xl'}>
            {headline && (
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && <p className="text-lg text-primary-100">{subheadline}</p>}
          </div>
          <form className={`flex w-full ${isInline ? 'md:w-auto' : 'mx-auto mt-8 max-w-md'} gap-2`}>
            <input
              type="email"
              placeholder="tu@email.com"
              required
              className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder:text-primary-200 focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-primary-600 hover:bg-gray-100"
            >
              {ctaText}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
