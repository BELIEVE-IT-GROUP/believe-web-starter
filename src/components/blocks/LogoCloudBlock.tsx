import Image from 'next/image'

import { getMediaUrl } from '@/lib/payload'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

export function LogoCloudBlock(props: {
  headline?: string
  logos?: { image: { url: string }; alt?: string; url?: string }[]
  appearance?: BlockAppearance
}) {
  const { headline, logos, appearance } = props

  return (
    <section
      {...getSectionProps(appearance, {
        background: 'bg-paper',
        spacingTop: 'pt-12 lg:pt-16',
        spacingBottom: 'pb-12 lg:pb-16',
      })}
    >
      <div className={getContainerClassName(appearance)}>
        {headline && (
          <p className="eyebrow mb-10 text-center">{headline}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-10">
          {logos?.map((logo, i) => (
            <a
              key={i}
              href={logo.url || '#'}
              className="opacity-40 grayscale transition-all duration-200 hover:opacity-70 hover:grayscale-0"
            >
              {getMediaUrl(logo.image) && (
                <Image
                  src={getMediaUrl(logo.image)}
                  width={120}
                  height={40}
                  alt={logo.alt || 'Logo'}
                  className="h-8 w-auto object-contain"
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
