export function FaqBlock(props: {
  headline?: string
  items?: { question: string; answer: string }[]
  layout?: string
}) {
  const { headline, items, layout = 'accordion' } = props

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        {headline && (
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className={`mx-auto max-w-3xl ${layout === 'columns' ? 'columns-1 md:columns-2 gap-8' : 'space-y-4'}`}>
          {items?.map((item, i) => (
            <details
              key={i}
              className="group rounded-lg border border-gray-200 bg-white p-6 open:ring-1 open:ring-primary-600"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
                {item.question}
                <span className="ml-4 text-primary-600 transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
