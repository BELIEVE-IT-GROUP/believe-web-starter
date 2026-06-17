/**
 * Bloque Hero de NeuroRealidad. PATRÓN DE REFERENCIA para las demás secciones:
 * markup verbatim de public/neurorealidad/landing.html (con assets en ruta
 * absoluta /neurorealidad/...), props desestructuradas, fields editables,
 * defaultProps inline con el copy real. Cerrar fields con `} as never`.
 */
import type { ComponentConfig } from '@measured/puck'

const AMZ = 'https://www.amazon.com/dp/B0H1JTHK57?utm_source=maas90d&utm_medium=libro_landing&utm_campaign=launch&utm_content=hero_cta'

type HeroProps = {
  eyebrow: string; h1a: string; em: string; sub: string
  ctaLabel: string; ghost: string; trust: string; badgeN: string; badgeT: string
}

export const Hero: ComponentConfig<HeroProps> = {
  label: 'Hero',
  fields: {
    eyebrow: { type: 'text' },
    h1a: { type: 'text' },
    em: { type: 'text' },
    sub: { type: 'textarea' },
    ctaLabel: { type: 'text' },
    ghost: { type: 'text' },
    trust: { type: 'text' },
    badgeN: { type: 'text' },
    badgeT: { type: 'text' },
  } as never,
  defaultProps: {
    eyebrow: 'Un libro de Jorge Beltrán Liévano',
    h1a: 'No estás roto.',
    em: 'entrenado',
    sub: 'Llevas años sabiendo exactamente qué hacer y, aun así, no lo haces. No es falta de disciplina ni de ganas: nadie te enseñó a cambiar de verdad. NeuroRealidad™ es el camino, paso a paso, para volver a ser quien siempre supiste que podías ser.',
    ctaLabel: 'Conseguir el libro',
    ghost: 'Leer el primer capítulo gratis',
    trust: '+40.000 personas esperaban este libro',
    badgeN: '90 días',
    badgeT: 'el tiempo real de un cambio que se queda',
  },
  render: ({ eyebrow, h1a, em, sub, ctaLabel, ghost, trust, badgeN, badgeT }) => (
    <section className="hero">
      <div className="wrap hero__grid">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="display">
            {h1a}
            <br />
            Estás <em>{em}</em>.
          </h1>
          <p className="lead">{sub}</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href={AMZ} target="_blank" rel="noopener">
              {ctaLabel}
              <span className="price">· $9.99</span>
            </a>
            <a className="btn btn--ghost" href="#capitulo">{ghost}</a>
          </div>
          <div className="hero__trust">
            <span className="stars">★★★★★</span>
            <span>{trust}</span>
          </div>
        </div>
        <div className="hero__art">
          <div className="bookwrap">
            <div className="book__glow" />
            <img className="bookimg" src="/neurorealidad/portada.jpg" alt="Portada del libro NeuroRealidad de Jorge Beltran Lievano" />
            <div className="hero__badge">
              <b>{badgeN}</b>
              {badgeT}
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
}
