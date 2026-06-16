import Image from 'next/image'

import { RichTextRenderer } from '@/components/richtext/RichTextRenderer'
import { getMediaUrl } from '@/lib/payload'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

export function SplitContentBlock(props: {
  layout?: string
  headline?: string
  body?: unknown
  image?: { url: string; alt?: string }
  imagePosition?: string
  cta?: { text?: string; url?: string }
  ctas?: { text: string; url: string; style: string }[]
  appearance?: BlockAppearance
}) {
  const { layout = 'image-right', headline, body, image, imagePosition, cta, ctas, appearance } = props
  const imageUrl = getMediaUrl(image)
  const isImageLeft = layout === 'image-left' || imagePosition === 'left'
  const actions = ctas?.length ? ctas : cta?.text ? [{ ...cta, style: 'primary' }] : []

  return (
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        <div className={`flex flex-col items-center gap-12 lg:gap-16 lg:flex-row ${isImageLeft ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1">
            {headline && (
              <h2 className="font-display mb-5 text-3xl font-medium leading-tight tracking-tight text-ink-900 md:text-4xl">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-400 mr-2 align-middle" aria-hidden="true" />
                {headline}
              </h2>
            )}
            {body ? (
              <div className="mb-7 text-lg leading-relaxed text-ink-500">
                <RichTextRenderer data={body} />
              </div>
            ) : null}
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {actions.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.url || '#'}
                    className={`inline-flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                      cta.style === 'primary'
                        ? 'text-paper hover:opacity-90'
                        : 'border border-ink-900/15 text-ink-900 hover:border-ink-900/40'
                    }`}
                    style={
                      cta.style === 'primary'
                        ? { backgroundColor: 'var(--color-primary)', borderRadius: 'var(--btn-radius, 6px)' }
                        : { borderRadius: 'var(--btn-radius, 6px)' }
                    }
                  >
                    {cta.text}
                  </a>
                ))}
              </div>
            )}
          </div>
          {imageUrl && (
            <div className="flex-1">
              <Image
                src={imageUrl}
                width={600}
                height={400}
                alt={image?.alt || ''}
                className="rounded-xl border border-ink-900/10"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
