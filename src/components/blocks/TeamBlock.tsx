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
    <section {...getSectionProps(appearance, { background: 'bg-white' })}>
      <div className={getContainerClassName(appearance)}>
        {(headline || subheadline) && (
          <div className="mb-12 text-center">
            {headline && (
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && <p className="text-lg text-gray-500">{subheadline}</p>}
          </div>
        )}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members?.map((m, i) => (
            <div key={i} className="text-center">
              {getMediaUrl(m.photo) && (
                <Image
                  src={getMediaUrl(m.photo)}
                  width={200}
                  height={200}
                  alt={m.name}
                  className="mx-auto mb-4 rounded-full object-cover"
                />
              )}
              <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
              {m.role && <p className="text-primary-600">{m.role}</p>}
              {m.bio && <p className="mt-2 text-sm text-gray-500">{m.bio}</p>}
              {m.social && m.social.length > 0 && (
                <div className="mt-4 flex justify-center gap-3">
                  {m.social.map((s, j) => (
                    <a key={j} href={s.url} className="text-gray-400 hover:text-gray-600">
                      {s.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
