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
      className={`h-4 w-4 ${filled ? 'text-believe-700' : 'text-ink-900/20'}`}
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
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        {headline && (
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4 inline-block">Testimonios</span>
            <h2 className="font-display mx-auto max-w-2xl text-balance text-3xl font-medium text-ink-900 md:text-4xl">
              {headline}
            </h2>
          </div>
        )}
        <div
          className={`grid gap-6 ${
            layout === 'carousel' ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {items?.map((item, i) => {
            const author = item.name || item.author || 'Cliente'
            const avatarUrl = getMediaUrl(item.photo || item.avatar)
            const rating = Math.max(0, Math.min(5, item.rating || 0))

            return (
              <div
                key={i}
                className="relative flex flex-col rounded-xl border border-ink-900/10 bg-paper p-7"
              >
                {/* Flourish: large open-quote in believe-700 at low opacity */}
                {i === 0 && (
                  <span
                    aria-hidden="true"
                    className="font-display pointer-events-none absolute right-6 top-4 select-none text-7xl font-medium leading-none text-believe-700/10"
                  >
                    &ldquo;
                  </span>
                )}

                {rating > 0 && (
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <StarIcon key={starIndex} filled={starIndex < rating} />
                    ))}
                  </div>
                )}

                <p className="font-display mb-6 flex-1 text-lg font-medium leading-relaxed text-ink-900">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  {avatarUrl && (
                    <Image
                      src={avatarUrl}
                      width={40}
                      height={40}
                      alt={item.photo?.alt || author}
                      className="rounded-full border border-ink-900/10 object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-ink-900">{author}</div>
                    {(item.role || item.company) && (
                      <div className="text-sm text-ink-500">
                        {item.role}
                        {item.role && item.company ? ', ' : ''}
                        {item.company}
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
