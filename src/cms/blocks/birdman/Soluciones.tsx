import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'
import { stringList } from './fields'

type SolucionesProps = BirdmanContent['soluciones']

export const Soluciones: ComponentConfig<SolucionesProps> = {
  label: 'Soluciones',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        title: { type: 'text' },
        body: { type: 'textarea' },
        chips: stringList('chip'),
      },
      getItemSummary: (item: { title?: string }) => item?.title || 'Soluciones',
    },
  } as never,
  defaultProps: birdmanContent.soluciones,
  render: ({ eyebrow, title, items }) => (
    <section id="soluciones">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <div className="reveal">
          {items.map((s) => (
            <div className="sol" key={s.title}>
              <h3>{s.title}</h3>
              <div className="body">
                <span dangerouslySetInnerHTML={{ __html: s.body }} />
                {s.chips && (
                  <div className="chips">
                    {s.chips.map((chip) => (
                      <span className="chip" key={chip}>
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
}
