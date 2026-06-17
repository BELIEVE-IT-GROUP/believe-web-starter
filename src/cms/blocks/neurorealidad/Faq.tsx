/**
 * Bloque FAQ de NeuroRealidad. Markup verbatim de public/neurorealidad/landing.html
 * (seccion <section id="faq">), con textos sacados a props y los items como array
 * field editable. Sigue el patron de Hero.tsx: defaultProps inline con el copy real,
 * fields cerrados con `} as never`. El primer <details> queda abierto (open) igual
 * que la fuente.
 */
import type { ComponentConfig } from '@measured/puck'

type FaqItem = { q: string; a: string }

type FaqProps = {
  eyebrow: string
  h2: string
  items: FaqItem[]
}

export const Faq: ComponentConfig<FaqProps> = {
  label: 'FAQ',
  fields: {
    eyebrow: { type: 'text' },
    h2: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        q: { type: 'text' },
        a: { type: 'textarea' },
      },
      getItemSummary: (item: FaqItem) => item.q || 'Pregunta',
    },
  } as never,
  defaultProps: {
    eyebrow: 'Antes de dar el paso',
    h2: 'Lo que quizás te preguntas',
    items: [
      {
        q: '¿Es otro libro de autoayuda?',
        a: 'No. La autoayuda te dice "tú puedes" y te deja igual. Este libro te explica por qué te cuesta y te da un camino concreto para cambiarlo. Y lo tienes completo sin suscribirte a nada.',
      },
      {
        q: '¿No será otra promesa que no se cumple?',
        a: 'Entiendo el cansancio, lo viviste muchas veces. Por eso aquí no hay magia de siete días ni frases bonitas: hay un recorrido real de 90 días, pensado para que esta vez sí se quede.',
      },
      {
        q: '¿Necesito la app para que me sirva?',
        a: 'No. El libro es completo por sí solo. La app existe para acompañarte después, si quieres, pero el cambio empieza solo contigo y estas páginas.',
      },
      {
        q: '¿Y si soy muy escéptico con estos temas?',
        a: 'Mejor. Este libro no te pide creer en nada: te pide leer, reconocerte y probar. Está escrito para gente analítica que ya no se traga el humo.',
      },
      {
        q: '¿Para quién no es este libro?',
        a: 'Para quien busca sentirse bien un ratito y seguir igual. Si solo quieres motivación express, hay opciones más baratas. Esto es para quien de verdad está listo para cambiar.',
      },
    ],
  },
  render: ({ eyebrow, h2, items }) => (
    <section id="faq">
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h2" style={{ marginTop: 20 }}>{h2}</h2>
        <div className="faq reveal">
          {items.map((item, i) => (
            <details key={i} open={i === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  ),
}
