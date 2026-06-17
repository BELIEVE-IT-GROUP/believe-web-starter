/**
 * Bloque "Reconoces" de NeuroRealidad. Markup verbatim de
 * public/neurorealidad/landing.html (seccion id="reconoces"), props
 * desestructuradas, fields editables, defaultProps inline con el copy real.
 * Sigue el patron de Hero.tsx. Cierra fields con `} as never`.
 */
import type { ComponentConfig } from '@measured/puck'

type RecogItem = { n: string; h3: string; p: string }

type ReconocesProps = {
  eyebrow: string
  h2: string
  lead: string
  items: RecogItem[]
}

export const Reconoces: ComponentConfig<ReconocesProps> = {
  label: 'Reconoces',
  fields: {
    eyebrow: { type: 'text' },
    h2: { type: 'text' },
    lead: { type: 'textarea' },
    items: {
      type: 'array',
      arrayFields: {
        n: { type: 'text' },
        h3: { type: 'text' },
        p: { type: 'textarea' },
      },
      getItemSummary: (item: RecogItem) => item.h3 || 'Fila',
    },
  } as never,
  defaultProps: {
    eyebrow: 'Quizás te suene',
    h2: 'Si te reconoces aquí, este libro es tuyo.',
    lead: 'No te falta información. Te sobra. Lo que duele es otra cosa, y la reconoces al instante.',
    items: [
      {
        n: 'i',
        h3: 'Marzo te encuentra igual que diciembre.',
        p: 'Empezaste el año decidido. El plan era impecable. Pasaron los meses y sigues en el mismo lugar, con la misma sensación en el pecho.',
      },
      {
        n: 'ii',
        h3: 'Cursos a medias, intentos abandonados.',
        p: 'Libros sin terminar, apps que duraron dos semanas, propósitos que se apagaron. Y una vocecita que dice "otra vez no".',
      },
      {
        n: 'iii',
        h3: 'Brillante por fuera, atascado por dentro.',
        p: 'En tu trabajo todos confían en ti. En tu propia vida no logras aplicar esa misma claridad. Y casi nadie lo sabe.',
      },
      {
        n: 'iv',
        h3: 'El cansancio de empezar de nuevo.',
        p: 'No es que no quieras. Estás agotado de prometerte cosas y volver a fallarte. De vivir por debajo de lo que sabes que eres.',
      },
    ],
  },
  render: ({ eyebrow, h2, lead, items }) => (
    <section id="reconoces">
      <div className="wrap">
        <div className="recog__t">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="h2" style={{ marginTop: 20 }}>{h2}</h2>
          </div>
          <p className="lead muted" style={{ alignSelf: 'end' }}>{lead}</p>
        </div>
        <div className="recog reveal">
          {items.map((item, i) => (
            <div className="recog__row" key={i}>
              <div className="recog__n">{item.n}</div>
              <div>
                <h3>{item.h3}</h3>
                <p>{item.p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
}
