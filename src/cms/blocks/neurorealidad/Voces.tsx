/**
 * Bloque Voces (testimonios) de NeuroRealidad. Markup verbatim de la seccion
 * <section id="voces"> de public/neurorealidad/landing.html: carrusel autoplay
 * con eyebrow + h2 en .wrap y .tcar > .ttrack#ttrack con 9 figuras .tq.
 * Los 9 testimonios son un array editable. El JS que duplica #ttrack para el
 * loop continuo vive en Root, NO aqui. Mantenemos id="ttrack" en el track.
 */
import type { ComponentConfig } from '@measured/puck'

type Testimonio = { quote: string; avatar: string; name: string; location: string }

type VocesProps = {
  eyebrow: string
  h2: string
  testimonios: Testimonio[]
}

export const Voces: ComponentConfig<VocesProps> = {
  label: 'Voces',
  fields: {
    eyebrow: { type: 'text' },
    h2: { type: 'textarea' },
    testimonios: {
      type: 'array',
      arrayFields: {
        quote: { type: 'textarea' },
        avatar: { type: 'text' },
        name: { type: 'text' },
        location: { type: 'text' },
      },
      getItemSummary: (item: Testimonio) => item.name || 'Testimonio',
    },
  } as never,
  defaultProps: {
    eyebrow: 'Los primeros lectores',
    h2: 'Lo que dicen quienes ya empezaron el camino.',
    testimonios: [
      {
        quote: '"Lo abrí esperando otro libro de moda. El capítulo del Desmontaje me incomodó, me vi retratado tal cual. Voy 40 días y por primera vez no abandoné en la semana dos."',
        avatar: 'R',
        name: 'Ricardo M.',
        location: 'Fundador de agencia · CDMX, México',
      },
      {
        quote: '"No es un libro para sentirte bien. Es para ordenarte la cabeza. Lo subrayé entero y volví sobre el capítulo de las decisiones tres veces."',
        avatar: 'M',
        name: 'Mariana T.',
        location: 'Directora de producto · Monterrey, México',
      },
      {
        quote: '"Me lo pasó mi socio. Lo leí en dos noches y el lunes ya hacía las cosas distinto. No me pasaba con un libro desde la universidad."',
        avatar: 'D',
        name: 'Diego H.',
        location: 'Consultor · Guadalajara, México',
      },
      {
        quote: '"Vivo en Miami hace diez años y probé de todo: terapia, apps, retiros carísimos. Este libro me dio lo único que faltaba, un mapa que sí podía seguir sola."',
        avatar: 'C',
        name: 'Carolina R.',
        location: 'Miami, FL · Estados Unidos',
      },
      {
        quote: '"Soy ingeniero, necesito que las cosas tengan lógica. Es el primer libro del tema que no me sonó a humo. Lo terminé y lo volví a empezar al día siguiente."',
        avatar: 'E',
        name: 'Esteban V.',
        location: 'Houston, TX · Estados Unidos',
      },
      {
        quote: '"Lo regalé a tres personas de mi equipo apenas lo terminé. Creo que eso lo resume mejor que cualquier reseña que pueda escribir."',
        avatar: 'P',
        name: 'Patricia G.',
        location: 'Nueva York, NY · Estados Unidos',
      },
      {
        quote: '"Sigo a George hace años. El libro es él en su mejor momento: directo, sin relleno, te confronta pero con cariño. Lo necesitaba y no lo sabía."',
        avatar: 'J',
        name: 'Juan David O.',
        location: 'Medellín, Colombia',
      },
      {
        quote: '"Cada enero la misma lista de propósitos, cada marzo el mismo punto. Hice los 90 días del libro y este diciembre, por fin, fue diferente."',
        avatar: 'L',
        name: 'Laura C.',
        location: 'Bogotá, Colombia',
      },
      {
        quote: '"No me gusta la autoayuda, y este no es autoayuda. Es como si alguien por fin te explicara cómo funciona la máquina por dentro."',
        avatar: 'A',
        name: 'Andrés P.',
        location: 'Cali, Colombia',
      },
    ],
  },
  render: ({ eyebrow, h2, testimonios }) => (
    <section id="voces" style={{ paddingBottom: 'clamp(70px,9vw,110px)' }}>
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h2" style={{ marginTop: 20, maxWidth: '22ch' }}>{h2}</h2>
      </div>
      <div className="tcar"><div className="ttrack" id="ttrack">
        {(testimonios || []).map((t, i) => (
          <figure className="tq" key={i}>
            <div className="tq__stars">★★★★★</div>
            <p>{t.quote}</p>
            <figcaption className="tq__who">
              <span className="tq__av">{t.avatar}</span>
              <span><b>{t.name}</b><span>{t.location}</span></span>
            </figcaption>
          </figure>
        ))}
      </div></div>
    </section>
  ),
}
