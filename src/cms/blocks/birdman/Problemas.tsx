import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'
import { stringList } from './fields'

export const Problemas: ComponentConfig<BirdmanContent['problemas']> = {
  label: 'Problemas',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    lead: { type: 'textarea' },
    items: stringList('reto'),
    ctaBand: {
      type: 'object',
      objectFields: {
        text: { type: 'text' },
        cta: {
          type: 'object',
          objectFields: { label: { type: 'text' }, href: { type: 'text' } },
        },
      },
    },
  } as never,
  defaultProps: birdmanContent.problemas,
  render: ({ eyebrow, title, lead, items, ctaBand }) => (
    <section id="problemas" style={{ background: 'var(--surface)' }}>
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <p className="lead">{lead}</p>
        <div className="prob-grid reveal">
          {items.map((p) => (
            <div className="prob" key={p}>
              <span className="x">!</span>
              <p>{p}</p>
            </div>
          ))}
        </div>
        <div className="cta-band reveal">
          <p>{ctaBand.text}</p>
          <a className="btn btn--primary" href={ctaBand.cta.href}>
            {ctaBand.cta.label}
          </a>
        </div>
      </div>
    </section>
  ),
}
