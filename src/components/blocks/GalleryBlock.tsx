import Image from 'next/image'

export function GalleryBlock(props: {
  headline?: string
  layout?: string
  images?: { image: { url: string }; caption?: string }[]
}) {
  const { headline, images, layout = 'grid' } = props

  const cols = layout === 'masonry' ? 'columns-2 md:columns-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        {headline && (
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className={layout === 'masonry' ? cols : `grid gap-4 ${cols}`}>
          {images?.map((img, i) => (
            <div key={i} className={layout === 'masonry' ? 'mb-4 break-inside-avoid' : ''}>
              <Image
                src={img.image.url}
                width={400}
                height={300}
                alt={img.caption || ''}
                className="rounded-lg object-cover"
              />
              {img.caption && (
                <p className="mt-2 text-sm text-gray-500">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
