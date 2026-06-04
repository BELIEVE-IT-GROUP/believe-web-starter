import Image from 'next/image'

import { getMediaUrl } from '@/lib/payload'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

function FeatureIcon({ label }: { label?: string }) {
  if (label) {
    return <span className="text-sm font-semibold text-primary-700">{label.slice(0, 2).toUpperCase()}</span>
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export function FeaturesBlock(props: {
  headline?: string
  subheadline?: string
  layout?: string
  items?: { icon?: string; title: string; description: string; image?: { url?: string } }[]
  appearance?: BlockAppearance
}) {
  const { headline, subheadline, layout = 'grid-3', items, appearance } = props

  const gridCols = layout === 'grid-2' ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <section {...getSectionProps(appearance, { background: 'bg-white' })}>
      <div className={getContainerClassName(appearance)}>
        {(headline || subheadline) && (
          <div className="mb-12 max-w-2xl">
            {headline && (
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && <p className="text-lg text-gray-500">{subheadline}</p>}
          </div>
        )}
        <div className={`grid gap-8 ${gridCols}`}>
          {items?.map((item, i) => (
            <div key={i}>
              {getMediaUrl(item.image) ? (
                <Image
                  src={getMediaUrl(item.image)}
                  width={480}
                  height={300}
                  alt={item.title}
                  className="mb-5 aspect-[16/10] w-full rounded-lg object-cover"
                />
              ) : (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <FeatureIcon label={item.icon} />
                </div>
              )}
              <h3 className="mb-2 text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
