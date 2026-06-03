import Image from 'next/image'
import Link from 'next/link'

export function HeroBlock(props: {
  variant?: string
  headline?: string
  subheadline?: string
  ctas?: { text: string; url: string; style: string }[]
  image?: { url: string; alt?: string }
  videoUrl?: string
  badge?: string
}) {
  const { headline, subheadline, ctas, image, badge } = props

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4 text-center">
        {badge && (
          <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1 text-sm font-medium text-primary-600">
            {badge}
          </span>
        )}
        <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
          {headline || 'Bienvenido'}
        </h1>
        {subheadline && (
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-500 lg:text-xl">
            {subheadline}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {ctas.map((cta, i) => (
              <Link
                key={i}
                href={cta.url || '#'}
                className={`inline-flex items-center rounded-lg px-6 py-3 text-base font-medium ${
                  cta.style === 'primary'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : cta.style === 'secondary'
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cta.text}
              </Link>
            ))}
          </div>
        )}
        {image?.url && (
          <div className="mt-12">
            <Image
              src={image.url}
              width={1200}
              height={600}
              alt={image.alt || ''}
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  )
}
