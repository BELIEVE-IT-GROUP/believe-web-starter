/**
 * Bloque Cerebro de NeuroRealidad. Statement centrado (.say): eyebrow, .k
 * titular grande con <em>, .sub parrafo. Markup verbatim de
 * public/neurorealidad/landing.html (seccion id="cerebro"). Sigue el patron de
 * Hero.tsx: props desestructuradas, fields editables, defaultProps inline con el
 * copy real. Cerrar fields con `} as never`.
 */
import type { ComponentConfig } from '@measured/puck'

type CerebroProps = {
  eyebrow: string; ka: string; em: string; sub: string
}

export const Cerebro: ComponentConfig<CerebroProps> = {
  label: 'Cerebro',
  fields: {
    eyebrow: { type: 'text' },
    ka: { type: 'text' },
    em: { type: 'text' },
    sub: { type: 'textarea' },
  } as never,
  defaultProps: {
    eyebrow: 'Por qué te cuesta tanto cambiar',
    ka: 'Tu cerebro no busca tu felicidad. Busca tu',
    em: 'supervivencia',
    sub: 'Está diseñado para mantenerte vivo, no para hacerte feliz. Y su forma favorita de protegerte es simple: que no cambies nada. Por eso cada intento de mejorar se siente como nadar contra la corriente, y vuelves al punto de partida una y otra vez. No es debilidad. No es falta de carácter. Es biología. Y la biología se puede reentrenar.',
  },
  render: ({ eyebrow, ka, em, sub }) => (
    <section id="cerebro">
      <div className="wrap col say" style={{ margin: '0 auto' }}>
        <div className="rule"></div>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</span>
        <p className="k">{ka} <em>{em}</em>.</p>
        <p className="sub">{sub}</p>
      </div>
    </section>
  ),
}
