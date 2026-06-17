/**
 * Bloque Autor de NeuroRealidad. Sigue el patrón de Hero.tsx: markup verbatim de
 * public/neurorealidad/landing.html (sección id="autor"), con assets en ruta
 * absoluta /neurorealidad/..., props desestructuradas, fields editables y
 * defaultProps inline con el copy real. Cerrar fields con `} as never`.
 */
import type { ComponentConfig } from '@measured/puck'
import { stringList } from './fields'

type MetaItem = { value: string; label: string }

type AutorProps = {
  photoAlt: string
  eyebrow: string
  quote: string
  lead: string
  meta: MetaItem[]
  logos: string[]
}

export const Autor: ComponentConfig<AutorProps> = {
  label: 'Autor',
  fields: {
    photoAlt: { type: 'text' },
    eyebrow: { type: 'text' },
    quote: { type: 'textarea' },
    lead: { type: 'textarea' },
    meta: {
      type: 'array',
      arrayFields: {
        value: { type: 'text' },
        label: { type: 'text' },
      },
      getItemSummary: (item: MetaItem) => `${item.value} ${item.label}`,
    },
    logos: stringList('logo'),
  } as never,
  defaultProps: {
    photoAlt: 'Jorge Beltran Lievano',
    eyebrow: 'Quién te acompaña',
    quote: '"Escribí este libro porque fui mi primer caso. Yo también era brillante en las ideas y un desastre ejecutando mi propia vida."',
    lead: 'Jorge Beltrán Liévano lleva 27 años ayudando a las marcas más exigentes a volverse coherentes con lo que prometen. Un día decidió aplicar todo eso a lo único que de verdad importa: cómo vive una persona.',
    meta: [
      { value: '27', label: 'años diseñando sistemas' },
      { value: '+40K', label: 'esperando el libro' },
      { value: '+200', label: 'marcas acompañadas' },
    ],
    logos: ['AUDI', 'PORSCHE', 'NESTLÉ', 'RAPPI', 'EL TIEMPO'],
  },
  render: ({ photoAlt, eyebrow, quote, lead, meta, logos }) => (
    <section id="autor">
      <div className="wrap author">
        <div className="author__photo reveal"><img src="/neurorealidad/autor.jpg" alt={photoAlt} /></div>
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <blockquote>{quote}</blockquote>
          <p className="lead muted">{lead}</p>
          <div className="meta">
            {meta.map((m, i) => (
              <div key={i}><b>{m.value}</b>{m.label}</div>
            ))}
          </div>
          <div className="logos">{logos.map((l, i) => <span key={i}>{l}</span>)}</div>
        </div>
      </div>
    </section>
  ),
}
