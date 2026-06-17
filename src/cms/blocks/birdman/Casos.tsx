/**
 * Bloque Casos de birdman. PATRÓN DE REFERENCIA para las demás secciones:
 *   1. markup JSX verbatim del port (BirdmanLanding.tsx), clases/IDs idénticos
 *   2. props desestructuradas (antes content.casos.X → ahora X)
 *   3. fields = textos editables; defaultProps = slice de birdmanContent (fidelidad)
 */
import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'

type CasosProps = BirdmanContent['casos']

export const Casos: ComponentConfig<CasosProps> = {
  label: 'Casos',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        industry: { type: 'text' },
        problem: { type: 'textarea' },
        solution: { type: 'textarea' },
        results: {
          type: 'array',
          arrayFields: {
            n: { type: 'text' },
            l: { type: 'text' },
          },
          getItemSummary: (item: { l?: string }) => item?.l || 'Resultado',
        },
      },
      getItemSummary: (item: { industry?: string }) => item?.industry || 'Casos',
    },
    disclaimer: { type: 'textarea' },
  } as never,
  defaultProps: birdmanContent.casos,
  render: ({ eyebrow, title, items, disclaimer }) => (
    <section id="casos" style={{ background: 'var(--surface)' }}>
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <div className="grid g3 reveal">
          {items.map((c) => (
            <div className="case" key={c.industry}>
              <span className="ind-tag">{c.industry}</span>
              <div className="qa">
                <b>Problema</b>
                {c.problem}
              </div>
              <div className="qa">
                <b>Solución</b>
                {c.solution}
              </div>
              <div className="res">
                {c.results.map((r) => (
                  <div className="r" key={r.l}>
                    <div className="n num">{r.n}</div>
                    <div className="l">{r.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: 'var(--faint)', marginTop: '18px' }}>{disclaimer}</p>
      </div>
    </section>
  ),
}
