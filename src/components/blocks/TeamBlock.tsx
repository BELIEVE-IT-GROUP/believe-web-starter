import Image from 'next/image'

import { getMediaUrl } from '@/lib/payload'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

export function TeamBlock(props: {
  headline?: string
  subheadline?: string
  members?: {
    name: string
    role?: string
    bio?: string
    photo?: { url: string }
    social?: { platform: string; url: string }[]
  }[]
  appearance?: BlockAppearance
}) {
  const { headline, subheadline, members, appearance } = props

  return (
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        {(headline || subheadline) && (
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4 inline-block">Equipo</span>
            {headline && (
              <h2 className="font-display mb-4 text-balance text-3xl font-medium text-ink-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink-500">
                {subheadline}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members?.map((m, i) => {
            const photoUrl = getMediaUrl(m.photo)
            return (
              <div key={i} className="text-center">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    width={200}
                    height={200}
                    alt={m.name}
                    className="mx-auto mb-5 h-[120px] w-[120px] rounded-full border border-ink-900/10 object-cover"
                  />
                ) : (
                  /* Placeholder avatar when no photo */
                  <div className="mx-auto mb-5 flex h-[120px] w-[120px] items-center justify-center rounded-full border border-ink-900/10 bg-believe-900">
                    <span className="font-display text-3xl font-medium text-paper/80">
                      {m.name.charAt(0)}
                    </span>
                  </div>
                )}

                <h3 className="font-display text-lg font-medium text-ink-900">{m.name}</h3>

                {m.role && (
                  /* Flourish: a cian dot before the role label */
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-believe-700">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-400" aria-hidden="true" />
                    {m.role}
                  </p>
                )}

                {m.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{m.bio}</p>
                )}

                {m.social && m.social.length > 0 && (
                  <div className="mt-4 flex justify-center gap-3">
                    {m.social.map((s, j) => (
                      <a
                        key={j}
                        href={s.url}
                        className="text-sm text-ink-500 underline-offset-2 transition-colors hover:text-ink-900 hover:underline"
                      >
                        {s.platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
