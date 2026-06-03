import Image from 'next/image'

export function TestimonialsBlock(props: {
  headline?: string
  layout?: string
  items?: {
    quote: string
    author: string
    role?: string
    company?: string
    avatar?: { url: string }
  }[]
}) {
  const { headline, items, layout = 'grid' } = props

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        {headline && (
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className={`grid gap-8 ${layout === 'carousel' ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {items?.map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-6 text-gray-600 italic">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                {item.avatar?.url && (
                  <Image
                    src={item.avatar.url}
                    width={40}
                    height={40}
                    alt={item.author}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">{item.author}</div>
                  {(item.role || item.company) && (
                    <div className="text-sm text-gray-500">
                      {item.role}{item.role && item.company ? ', ' : ''}{item.company}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
