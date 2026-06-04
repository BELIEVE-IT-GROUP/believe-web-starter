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
    <section {...getSectionProps(appearance, { background: 'bg-white' })}>
      <div className={getContainerClassName(appearance)}>
        <div className={`flex flex-col items-center gap-12 lg:flex-row ${isImageLeft ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1">
            {headline && (
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {body ? (
              <div className="mb-6 text-lg">
                <RichTextRenderer data={body} />
              </div>
            ) : null}
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {actions.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.url || '#'}
                    className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium ${
                      cta.style === 'primary'
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
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
                className="rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
