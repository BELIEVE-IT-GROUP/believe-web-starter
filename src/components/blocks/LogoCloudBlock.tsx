import Image from 'next/image'

export function LogoCloudBlock(props: {
  headline?: string
  logos?: { image: { url: string }; alt?: string; url?: string }[]
}) {
  const { headline, logos } = props

  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        {headline && (
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wide text-gray-500">
            {headline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0">
          {logos?.map((logo, i) => (
            <a key={i} href={logo.url || '#'} className="transition-opacity hover:opacity-100">
              <Image
                src={logo.image.url}
                width={120}
                height={40}
                alt={logo.alt || 'Logo'}
                className="h-8 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
