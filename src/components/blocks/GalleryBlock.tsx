import Image from 'next/image'

import { getMediaUrl } from '@/lib/payload'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

export function GalleryBlock(props: {
  headline?: string
  layout?: string
  images?: { image: { url: string }; caption?: string }[]
  appearance?: BlockAppearance
}) {
  const { headline, images, layout = 'grid', appearance } = props

  const cols =
    layout === 'masonry'
      ? 'columns-2 md:columns-3'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        {headline && (
          <h2 className="font-display mb-12 text-center text-3xl font-medium text-ink-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className={layout === 'masonry' ? cols : `grid gap-6 ${cols}`}>
          {images?.map((img, i) => (
            <div key={i} className={layout === 'masonry' ? 'mb-6 break-inside-avoid' : ''}>
              {getMediaUrl(img.image) && (
                <div className="overflow-hidden rounded-xl border border-ink-900/10">
                  <Image
                    src={getMediaUrl(img.image)}
                    width={400}
                    height={300}
                    alt={img.caption || ''}
                    className="w-full object-cover"
                  />
                </div>
              )}
              {img.caption && (
                <p className="mt-2 text-sm text-ink-500">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
