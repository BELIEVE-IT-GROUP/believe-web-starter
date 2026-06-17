/**
 * Bloque Beneficios de birdman. PATRÓN DE REFERENCIA para las demás secciones:
 *   1. markup JSX verbatim del port (BirdmanLanding.tsx), clases/IDs idénticos
 *   2. props desestructuradas (antes content.beneficios.X → ahora X)
 *   3. fields = textos editables; defaultProps = slice de birdmanContent (fidelidad)
 */
import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'

type BeneficiosProps = BirdmanContent['beneficios']

export const Beneficios: ComponentConfig<BeneficiosProps> = {
  label: 'Beneficios',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        label: { type: 'text' },
        desc: { type: 'textarea' },
        dir: {
          type: 'select',
          options: [
            { label: 'Arriba (up)', value: 'up' },
            { label: 'Abajo (down)', value: 'down' },
          ],
        },
      },
      getItemSummary: (item: { label?: string }) => item?.label || 'Beneficios',
    },
  } as never,
  defaultProps: birdmanContent.beneficios,
  render: ({ eyebrow, title, items }) => (
    <section id="beneficios">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <div className="ben reveal">
          {items.map((b) => (
            <div className="b" key={b.label}>
              <div className={`big ${b.dir}`}>{b.label}</div>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
}
