export function FeaturesBlock(props: {
  headline?: string
  subheadline?: string
  layout?: string
  items?: { icon?: string; title: string; description: string; image?: { url: string } }[]
}) {
  const { headline, subheadline, layout = 'grid-3', items } = props

  const gridCols = layout === 'grid-2' ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
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
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <span className="text-primary-600 text-lg">{item.icon || '✦'}</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
