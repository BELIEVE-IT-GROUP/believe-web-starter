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
    <section {...getSectionProps(appearance, { background: 'bg-gray-50', spacingTop: 'pt-12 lg:pt-16', spacingBottom: 'pb-12 lg:pb-16' })}>
      <div className={getContainerClassName(appearance)}>
        {headline && (
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wide text-gray-500">
            {headline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0">
          {logos?.map((logo, i) => (
            <a key={i} href={logo.url || '#'} className="transition-opacity hover:opacity-100">
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
