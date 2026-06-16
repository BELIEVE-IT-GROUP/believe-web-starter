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

  const sectionProps = getSectionProps(appearance, {
    background: '',
    className: 'relative overflow-hidden',
  })

  const sectionStyle = backgroundImageUrl
    ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: 'var(--brand-ink, #0a0a0a)' }

  return (
    <section
      {...sectionProps}
      style={sectionStyle}
    >
      {backgroundImageUrl && (
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--brand-ink, #0a0a0a)', opacity: 0.8 }} aria-hidden="true" />
      )}
      <div className={getContainerClassName(appearance, 'relative text-center')}>
        <span className="eyebrow mb-7 inline-flex items-center gap-2 text-paper/60">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-400" aria-hidden="true" />
        </span>
        {headline && (
          <h2 className="font-display mb-4 text-balance text-3xl font-medium leading-tight tracking-tight text-paper md:text-4xl lg:text-5xl">
            {headline}
          </h2>
        )}
        {subheadline && (
          <p className="mx-auto mb-10 max-w-2xl text-balance text-lg leading-relaxed text-paper/70">
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
                    ? 'inline-flex items-center rounded-full border border-paper/40 px-7 py-3.5 text-base font-medium text-paper transition-colors hover:border-paper/70 hover:bg-paper/10'
                    : 'inline-flex items-center rounded-full bg-paper px-7 py-3.5 text-base font-medium text-believe-900 transition-colors hover:bg-paper/90'
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
