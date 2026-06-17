import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'

export const Recursos: ComponentConfig<BirdmanContent['recursos']> = {
  label: 'Recursos',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        type: { type: 'text' },
        title: { type: 'text' },
        desc: { type: 'textarea' },
        cta: { type: 'text' },
        href: { type: 'text' },
      },
      getItemSummary: (item: { title?: string }) => item?.title || 'Recursos',
    },
  } as never,
  defaultProps: birdmanContent.recursos,
  render: ({ eyebrow, title, items }) => (
    <section id="recursos">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <div className="grid g3 reveal">
          {items.map((r) => (
            <a className="res-card" href={r.href} key={r.title}>
              <span className="type">{r.type}</span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
              <span className="go">{r.cta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  ),
}
