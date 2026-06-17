/**
 * Bloque Promesa (seccion `vow`) de NeuroRealidad. Portado verbatim de
 * public/neurorealidad/landing.html con los textos sacados a props editables.
 * Statement: <p> grande con <br> y <em>, y <p class="two"> en italica.
 * Solo textos. Cerrar fields con `} as never`.
 */
import type { ComponentConfig } from '@measured/puck'

type PromesaProps = {
  line1: string; em: string; line2: string
}

export const Promesa: ComponentConfig<PromesaProps> = {
  label: 'Promesa',
  fields: {
    line1: { type: 'text' },
    em: { type: 'text' },
    line2: { type: 'textarea' },
  } as never,
  defaultProps: {
    line1: 'No te prometo que será fácil.',
    em: 'real',
    line2: 'No te prometo que nunca te caerás. Te prometo que nunca más te quedarás tirado sin mapa.',
  },
  render: ({ line1, em, line2 }) => (
    <section className="vow">
      <div className="wrap col" style={{ margin: '0 auto' }}>
        <p>
          {line1}
          <br />
          Te prometo que será <em>{em}</em>.
        </p>
        <p className="two">{line2}</p>
      </div>
    </section>
  ),
}
