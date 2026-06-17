/**
 * Bloque QueHacemos de birdman. Sigue el PATRÓN DE REFERENCIA de Hero.tsx:
 *   1. markup JSX verbatim del port (BirdmanLanding.tsx), clases/IDs idénticos
 *   2. props desestructuradas (antes content.queHacemos.X → ahora X)
 *   3. fields = textos editables; defaultProps = slice de birdmanContent (fidelidad)
 */
import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'

type QueHacemosProps = BirdmanContent['queHacemos']

const queHacemosIcons = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6 3" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v5h-5" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21 8 14 2 9.4h7.6z" /></svg>,
]

export const QueHacemos: ComponentConfig<QueHacemosProps> = {
  label: 'QueHacemos',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    lead: { type: 'textarea' },
    items: {
      type: 'array',
      arrayFields: {
        title: { type: 'text' },
        desc: { type: 'textarea' },
      },
      getItemSummary: (item: { title?: string }) => item?.title || 'Card',
    },
  } as never,
  defaultProps: birdmanContent.queHacemos,
  render: ({ eyebrow, title, lead, items }) => (
    <section id="que-hacemos">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <p className="lead">{lead}</p>
        <div className="grid g3 reveal">
          {items.map((item, i) => (
            <div className="card" key={item.title}>
              <div className="ico">{queHacemosIcons[i]}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
}
