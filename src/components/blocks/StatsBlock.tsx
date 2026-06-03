export function StatsBlock(props: {
  headline?: string
  items?: { label: string; value: string }[]
  layout?: string
}) {
  const { headline, items, layout = 'grid' } = props

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        {headline && (
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className={`grid gap-8 ${layout === 'row' ? 'md:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {items?.map((item, i) => (
            <div key={i} className="text-center">
              <div className="mb-2 text-4xl font-extrabold text-primary-600 md:text-5xl">
                {item.value}
              </div>
              <div className="text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
