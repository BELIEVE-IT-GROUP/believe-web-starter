import { RichTextRenderer } from '@/components/richtext/RichTextRenderer'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
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
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        {(headline || subheadline) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="eyebrow mb-4 inline-block">FAQ</span>
            {headline && (
              <h2 className="font-display mb-4 text-balance text-3xl font-medium text-ink-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="text-lg leading-relaxed text-ink-500">{subheadline}</p>
            )}
          </div>
        )}

        <div
          className={`mx-auto ${
            isColumns
              ? 'grid max-w-5xl gap-3 md:grid-cols-2'
              : 'max-w-3xl divide-y divide-ink-900/10'
          }`}
        >
          {items?.map((item, i) =>
            isColumns ? (
              /* Grid/columns layout: bordered cards */
              <details
                key={i}
                className="group break-inside-avoid rounded-xl border border-ink-900/10 bg-paper px-6 py-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink-900">
                  {item.question}
                  <span className="text-believe-700">
                    <ChevronIcon />
                  </span>
                </summary>
                <div className="mt-4 text-ink-500">
                  <RichTextRenderer data={item.answer} />
                </div>
              </details>
            ) : (
              /* Accordion layout: flush rows separated by divider */
              <details key={i} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink-900">
                  {item.question}
                  <span className="text-believe-700">
                    {/* Flourish: a single cian dot signals the active item */}
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-signal-400 opacity-0 transition-opacity group-open:opacity-100" aria-hidden="true" />
                    <ChevronIcon />
                  </span>
                </summary>
                <div className="mt-4 text-ink-500">
                  <RichTextRenderer data={item.answer} />
                </div>
              </details>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
