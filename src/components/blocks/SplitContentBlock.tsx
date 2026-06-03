import Image from 'next/image'

export function SplitContentBlock(props: {
  layout?: string
  headline?: string
  body?: string
  image?: { url: string; alt?: string }
  ctas?: { text: string; url: string; style: string }[]
}) {
  const { layout = 'image-right', headline, body, image, ctas } = props
  const isImageLeft = layout === 'image-left'

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className={`flex flex-col items-center gap-12 lg:flex-row ${isImageLeft ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1">
            {headline && (
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {body && <p className="mb-6 text-lg text-gray-500">{body}</p>}
            {ctas && ctas.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {ctas.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.url || '#'}
                    className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium ${
                      cta.style === 'primary'
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cta.text}
                  </a>
                ))}
              </div>
            )}
          </div>
          {image?.url && (
            <div className="flex-1">
              <Image
                src={image.url}
                width={600}
                height={400}
                alt={image.alt || ''}
                className="rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
