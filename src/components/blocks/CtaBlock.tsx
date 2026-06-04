import Link from 'next/link'

import { getMediaUrl } from '@/lib/payload'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

export function CtaBlock(props: {
  headline?: string
  subheadline?: string
  cta?: { text: string; url: string }
  ctas?: { text?: string; url?: string; style?: string }[]
  backgroundImage?: { url?: string }
  variant?: string
  appearance?: BlockAppearance
}) {
  const { headline, subheadline, cta, ctas, backgroundImage, variant = 'default', appearance } = props
  const actions = ctas?.length ? ctas : cta?.text ? [{ ...cta, style: 'primary' }] : []
  const backgroundImageUrl = getMediaUrl(backgroundImage)

  const bg = backgroundImageUrl || variant === 'dark'
    ? 'bg-gray-900 text-white bg-cover bg-center'
    : 'bg-primary-600 text-white'
  const sectionProps = getSectionProps(appearance, { background: bg, className: 'relative overflow-hidden' })

  return (
    <section
      {...sectionProps}
      style={backgroundImageUrl ? { backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.72), rgba(17, 24, 39, 0.72)), url(${backgroundImageUrl})` } : undefined}
    >
      <div className={getContainerClassName(appearance, 'relative text-center')}>
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
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {actions.map((action, index) => (
              <Link
                key={`${action.text}-${index}`}
                href={action.url || '#'}
                className={
                  action.style === 'secondary' || action.style === 'outline'
                    ? 'inline-flex items-center rounded-lg border border-white/70 px-6 py-3 text-base font-medium text-white hover:bg-white/10'
                    : 'inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-100'
                }
              >
                {action.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
