import Link from 'next/link'
import Image from 'next/image'

import { getMediaUrl } from '@/lib/payload'

import {
  getAlignmentClassName,
  getContainerClassName,
  getSectionProps,
  type BlockAppearance,
} from './appearance'

export function HeroBlock(props: {
  variant?: string
  headline?: string
  subheadline?: string
  ctas?: { text: string; url: string; style: string }[]
  image?: { url: string; alt?: string }
  videoUrl?: string
  badge?: string
  appearance?: BlockAppearance
}) {
  const { headline, subheadline, ctas, image, badge, appearance } = props
  const imageUrl = getMediaUrl(image)
  const sectionProps = getSectionProps(appearance, { background: 'bg-paper' })
  const alignment = getAlignmentClassName(appearance, 'text-center')

  return (
    <section {...sectionProps}>
      <div className={getContainerClassName(appearance, alignment)}>
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center py-14 md:py-24">
          {badge && (
            <span className="eyebrow mb-7 inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-400" aria-hidden="true" />
              {badge}
            </span>
          )}
          <h1 className="font-display mb-6 max-w-3xl text-balance text-5xl font-medium leading-[1.03] tracking-tight text-ink-900 md:text-6xl lg:text-[4.25rem]">
            {headline || 'Bienvenido'}
          </h1>
          {subheadline && (
            <p className="mx-auto mb-9 max-w-2xl text-balance text-lg leading-relaxed text-ink-500 md:text-xl">
              {subheadline}
            </p>
          )}
          {ctas && ctas.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {ctas.map((cta, i) => (
                <Link
                  key={i}
                  href={cta.url || '#'}
                  className={
                    cta.style === 'primary'
                      ? 'px-7 py-3.5 text-base font-medium text-paper transition-opacity hover:opacity-90'
                      : 'border border-ink-900/15 px-7 py-3.5 text-base font-medium text-ink-900 transition-colors hover:border-ink-900/40'
                  }
                  style={
                    cta.style === 'primary'
                      ? { backgroundColor: 'var(--color-primary)', borderRadius: 'var(--btn-radius, 6px)' }
                      : { borderRadius: 'var(--btn-radius, 6px)' }
                  }
                >
                  {cta.text}
                </Link>
              ))}
            </div>
          )}
          {imageUrl && (
            <div className="mt-14 w-full">
              <Image
                src={imageUrl}
                width={1200}
                height={600}
                alt={image?.alt || ''}
                className="mx-auto rounded-xl border border-ink-900/10"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
