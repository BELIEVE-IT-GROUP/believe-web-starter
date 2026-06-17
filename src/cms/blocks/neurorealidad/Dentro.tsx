/**
 * Bloque "Dentro" (seccion id="libro") de NeuroRealidad. Sigue el patron de Hero.tsx:
 * markup verbatim de public/neurorealidad/landing.html (assets en ruta absoluta
 * /neurorealidad/...), props desestructuradas, fields editables, defaultProps inline
 * con el copy real. Layout asimetrico: .inside con .inside__art img (book2.webp) +
 * columna con eyebrow, h2 y .bullets (4 .b con h3+p, array editable).
 */
import type { ComponentConfig } from '@measured/puck'

type Bullet = { h3: string; p: string }

type DentroProps = {
  eyebrow: string
  h2: string
  bullets: Bullet[]
}

export const Dentro: ComponentConfig<DentroProps> = {
  label: 'Dentro',
  fields: {
    eyebrow: { type: 'text' },
    h2: { type: 'textarea' },
    bullets: {
      type: 'array',
      arrayFields: {
        h3: { type: 'text' },
        p: { type: 'textarea' },
      },
      getItemSummary: (item: Bullet) => item.h3 || 'Bullet',
    },
  } as never,
  defaultProps: {
    eyebrow: 'Lo que vas a vivir leyéndolo',
    h2: 'No vas a leer un libro. Te vas a reconocer en él.',
    bullets: [
      {
        h3: 'El alivio de entenderte',
        p: 'Por fin un nombre para lo que te pasa: no estás roto, estás entrenado. Y por qué eso lo cambia todo.',
      },
      {
        h3: 'Un mapa, no una arenga',
        p: 'El recorrido completo de los 90 días, con pasos que puedes empezar el mismo día en que cierras el libro.',
      },
      {
        h3: 'Una forma de medir tu avance',
        p: 'Una manera simple y honesta de ver, día a día, cuánto te acercas a la coherencia que buscas.',
      },
      {
        h3: 'La persona que sales siendo',
        p: 'Al terminarlo no tienes más información. Tienes una versión tuya distinta: la que ejecuta y se sostiene.',
      },
    ],
  },
  render: ({ eyebrow, h2, bullets }) => (
    <section id="libro">
      <div className="wrap inside">
        <div className="inside__art reveal"><img src="/neurorealidad/book2.webp" alt="NeuroRealidad™" /></div>
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="h2" style={{ margin: '20px 0 8px', maxWidth: '18ch' }}>{h2}</h2>
          <div className="bullets reveal" style={{ marginTop: 24 }}>
            {bullets.map((b, i) => (
              <div className="b" key={i}><h3>{b.h3}</h3><p>{b.p}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
}
