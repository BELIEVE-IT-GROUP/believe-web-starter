import { RichTextRenderer } from '@/components/richtext/RichTextRenderer'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 transition group-open:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export function FaqBlock(props: {
  headline?: string
  subheadline?: string
  items?: { question: string; answer: unknown }[]
  layout?: string
  appearance?: BlockAppearance
}) {
  const { headline, subheadline, items, layout = 'accordion', appearance } = props
  const isColumns = layout === 'columns' || layout === 'grid' || layout === 'grid-layout'

  return (
    <section {...getSectionProps(appearance, { background: 'bg-gray-50' })}>
      <div className={getContainerClassName(appearance)}>
        {(headline || subheadline) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {headline && (
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && <p className="text-lg text-gray-500">{subheadline}</p>}
          </div>
        )}
        <div className={`mx-auto ${isColumns ? 'grid max-w-5xl gap-4 md:grid-cols-2' : 'max-w-3xl space-y-4'}`}>
          {items?.map((item, i) => (
            <details
              key={i}
              className="group break-inside-avoid rounded-lg border border-gray-200 bg-white p-6 open:ring-1 open:ring-primary-600"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
                {item.question}
                <span className="ml-4 text-primary-600">
                  <ChevronIcon />
                </span>
              </summary>
              <div className="mt-4">
                <RichTextRenderer data={item.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
