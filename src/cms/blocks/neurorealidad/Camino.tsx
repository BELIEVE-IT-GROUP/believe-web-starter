/**
 * Bloque Camino de NeuroRealidad. Sigue el PATRON de Hero.tsx: markup verbatim
 * de public/neurorealidad/landing.html (seccion id="camino"), props
 * desestructuradas, fields editables, defaultProps inline con el copy real.
 * Cierra fields con `} as never`.
 */
import type { ComponentConfig } from '@measured/puck'

type Fase = { num: string; t: string; h3: string; p: string }

type CaminoProps = {
  eyebrow: string; h2: string; lead: string
  fases: Fase[]
}

export const Camino: ComponentConfig<CaminoProps> = {
  label: 'Camino',
  fields: {
    eyebrow: { type: 'text' },
    h2: { type: 'text' },
    lead: { type: 'textarea' },
    fases: {
      type: 'array',
      arrayFields: {
        num: { type: 'text' },
        t: { type: 'text' },
        h3: { type: 'text' },
        p: { type: 'textarea' },
      },
      getItemSummary: (item: Fase) => item.h3 || item.t || 'Fase',
    },
  } as never,
  defaultProps: {
    eyebrow: 'El camino, no un truco',
    h2: 'Noventa días, en tres movimientos.',
    lead: 'Nada de cambios de la noche a la mañana. Un recorrido honesto, pensado para que esta vez el cambio se quede.',
    fases: [
      {
        num: '30',
        t: 'Días 1 — 30',
        h3: 'Desmontaje',
        p: 'Ves con honestidad cómo funcionas hoy y por qué. Sin culpa. Empiezas a soltar los automatismos que te tienen atascado.',
      },
      {
        num: '60',
        t: 'Días 31 — 60',
        h3: 'Arquitectura',
        p: 'Reconstruyes, pieza por pieza, una nueva forma de vivir tu día. Lo correcto empieza a costar menos.',
      },
      {
        num: '90',
        t: 'Días 61 — 90',
        h3: 'Sostenimiento',
        p: 'Lo nuevo deja de ser esfuerzo y se vuelve quien eres. El cambio se queda cuando dejas de vigilarlo.',
      },
    ],
  },
  render: ({ eyebrow, h2, lead, fases }) => (
    <section id="camino">
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h2" style={{ marginTop: 20, maxWidth: '16ch' }}>{h2}</h2>
        <p className="lead muted" style={{ marginTop: 18, maxWidth: '58ch' }}>{lead}</p>
        <div className="line reveal">
          {fases.map((f, i) => (
            <div className="mv" key={i}>
              <div className="mv__dot" />
              <div className="mv__d">{f.num}</div>
              <div className="t">{f.t}</div>
              <h3>{f.h3}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
}
