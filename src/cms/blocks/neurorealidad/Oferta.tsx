/**
 * Bloque Oferta de NeuroRealidad. Portado verbatim de la seccion
 * `<section id="comprar">` de public/neurorealidad/landing.html: header
 * (eyebrow + h2 + lead) y 3 tiers .offer. El primer tier (.tier--main) es el
 * libro con CTA a Amazon; los otros dos van a maas90d.com. Markup verbatim,
 * textos e items editables desde el CMS. Cierra fields con `} as never`.
 */
import type { ComponentConfig } from '@measured/puck'
import { stringList } from './fields'

const AMZ = 'https://www.amazon.com/dp/B0H1JTHK57?utm_source=maas90d&utm_medium=libro_landing&utm_campaign=launch&utm_content=offer_cta'
const APP = 'https://maas90d.com'

type Tier = {
  badge: string
  title: string
  price: string
  unit: string
  items: string[]
  ctaLabel: string
}

type OfertaProps = {
  eyebrow: string
  h2: string
  lead: string
  bookTitle: string
  bookPrice: string
  bookUnit: string
  bookBadge: string
  bookItems: string[]
  bookCta: string
  tiers: Tier[]
}

export const Oferta: ComponentConfig<OfertaProps> = {
  label: 'Oferta',
  fields: {
    eyebrow: { type: 'text' },
    h2: { type: 'text' },
    lead: { type: 'textarea' },
    bookBadge: { type: 'text' },
    bookTitle: { type: 'text' },
    bookPrice: { type: 'text' },
    bookUnit: { type: 'text' },
    bookItems: stringList('item'),
    bookCta: { type: 'text' },
    tiers: {
      type: 'array',
      arrayFields: {
        badge: { type: 'text' },
        title: { type: 'text' },
        price: { type: 'text' },
        unit: { type: 'text' },
        items: stringList('item'),
        ctaLabel: { type: 'text' },
      },
      getItemSummary: (item: Tier) => item.title || 'Tier',
    },
  } as never,
  defaultProps: {
    eyebrow: 'Empieza por el libro',
    h2: 'El primer paso cuesta menos de lo que crees.',
    lead: 'El método completo, en tus manos, sin comprometerte a nada más. Si el libro te transforma, el resto del camino te estará esperando.',
    bookBadge: 'EMPIEZA AQUÍ',
    bookTitle: 'El Libro',
    bookPrice: '$9.99',
    bookUnit: 'USD',
    bookItems: [
      'El método NeuroRealidad™ completo',
      'Las tres fases de los 90 días',
      'Kindle y tapa blanda en Amazon',
      'Tuyo para siempre, sin suscripción',
    ],
    bookCta: 'Conseguir en Amazon →',
    tiers: [
      {
        badge: '',
        title: 'Acompañamiento',
        price: '$59k',
        unit: 'COP/mes',
        items: [
          'La app que sostiene tu camino día a día',
          'Tu copiloto MAAsy',
          'Cancelas cuando quieras',
          '30 días gratis si ya leíste el libro',
        ],
        ctaLabel: 'Conocer la app',
      },
      {
        badge: '',
        title: 'Camino completo',
        price: '$599k',
        unit: 'COP/año',
        items: [
          'Un año entero de transformación',
          'App, Academy y comunidad',
          'Quienes hacen el mismo camino',
          'Todo el ecosistema MAAS 90D™',
        ],
        ctaLabel: 'Ver el ecosistema',
      },
    ],
  },
  render: ({ eyebrow, h2, lead, bookBadge, bookTitle, bookPrice, bookUnit, bookItems, bookCta, tiers }) => (
    <section id="comprar">
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h2" style={{ marginTop: 20, maxWidth: '18ch' }}>{h2}</h2>
        <p className="lead muted" style={{ marginTop: 18, maxWidth: '56ch' }}>{lead}</p>
        <div className="offer">
          <div className="tier tier--main">
            <span className="badge">{bookBadge}</span>
            <h3>{bookTitle}</h3>
            <div className="p">{bookPrice} <span>{bookUnit}</span></div>
            <ul>{(bookItems || []).map((it, i) => <li key={i}>{it}</li>)}</ul>
            <a className="btn btn--primary" href={AMZ} target="_blank" rel="noopener">{bookCta}</a>
          </div>
          {(tiers || []).map((t, i) => (
            <div className="tier" key={i}>
              <h3>{t.title}</h3>
              <div className="p">{t.price} <span>{t.unit}</span></div>
              <ul>{(t.items || []).map((it, j) => <li key={j}>{it}</li>)}</ul>
              <a className="btn btn--ghost" href={APP} target="_blank" rel="noopener">{t.ctaLabel}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
}
