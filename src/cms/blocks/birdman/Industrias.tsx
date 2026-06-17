/**
 * Bloque Industrias de birdman. PATRÓN DE REFERENCIA para las demás secciones:
 *   1. markup JSX verbatim del port (BirdmanLanding.tsx), clases/IDs idénticos
 *   2. props desestructuradas (antes content.industrias.X → ahora X)
 *   3. fields = textos editables; defaultProps = slice de birdmanContent (fidelidad)
 */
import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'
import { stringList } from './fields'

type IndustriasProps = BirdmanContent['industrias']

export const Industrias: ComponentConfig<IndustriasProps> = {
  label: 'Industrias',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    items: stringList('industria'),
  } as never,
  defaultProps: birdmanContent.industrias,
  render: ({ eyebrow, title, items }) => (
    <section id="industrias" style={{ background: 'var(--surface)' }}>
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <div className="ind reveal">
          {items.map((item) => (
            <span className="item" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  ),
}
