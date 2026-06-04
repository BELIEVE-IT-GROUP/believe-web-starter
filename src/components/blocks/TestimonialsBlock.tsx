import Image from 'next/image'

import { getMediaUrl } from '@/lib/payload'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

type TestimonialItem = {
  quote: string
  author?: string
  name?: string
  role?: string
  company?: string
  avatar?: { url: string }
  photo?: { url: string; alt?: string }
  rating?: number
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 ${filled ? 'text-primary-500' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 00.95.69h3.47c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.37 1.12l1.07 3.3c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.3a1 1 0 00-.37-1.12L2.97 8.73c-.78-.57-.38-1.81.59-1.81h3.47a1 1 0 00.95-.69l1.07-3.3z" />
    </svg>
  )
}

export function TestimonialsBlock(props: {
  headline?: string
  layout?: string
  items?: TestimonialItem[]
  appearance?: BlockAppearance
}) {
  const { headline, items, layout = 'grid', appearance } = props

  return (
    <section {...getSectionProps(appearance, { background: 'bg-white' })}>
      <div className={getContainerClassName(appearance)}>
        {headline && (
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className={`grid gap-8 ${layout === 'carousel' ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {items?.map((item, i) => {
            const author = item.name || item.author || 'Cliente'
            const avatarUrl = getMediaUrl(item.photo || item.avatar)
            const rating = Math.max(0, Math.min(5, item.rating || 0))

            return (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              {rating > 0 && (
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <StarIcon key={starIndex} filled={starIndex < rating} />
                  ))}
                </div>
              )}
              <p className="mb-6 text-gray-600 italic">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                {avatarUrl && (
                  <Image
                    src={avatarUrl}
                    width={40}
                    height={40}
                    alt={item.photo?.alt || author}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">{author}</div>
                  {(item.role || item.company) && (
                    <div className="text-sm text-gray-500">
                      {item.role}{item.role && item.company ? ', ' : ''}{item.company}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
