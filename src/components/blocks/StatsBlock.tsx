import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

export function StatsBlock(props: {
  headline?: string
  items?: { label: string; value: string }[]
  layout?: string
  appearance?: BlockAppearance
}) {
  const { headline, items, layout = 'grid', appearance } = props

  return (
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        {headline && (
          <h2 className="font-display mb-12 text-center text-3xl font-medium text-ink-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className={`grid gap-8 ${layout === 'row' ? 'md:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {items?.map((item, i) => (
            <div key={i} className="border-t border-ink-900/10 pt-6 text-center">
              <div className="font-display mb-2 text-5xl font-medium text-believe-700 md:text-6xl">
                {item.value}
              </div>
              <div className="text-ink-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
