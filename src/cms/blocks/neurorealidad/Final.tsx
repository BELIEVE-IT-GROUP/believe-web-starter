'use client'
/**
 * Bloque Final (CTA "capitulo") de NeuroRealidad. Markup verbatim de
 * public/neurorealidad/landing.html (<section id="capitulo" class="final">),
 * con assets en ruta absoluta /neurorealidad/..., props desestructuradas,
 * fields editables y defaultProps inline con el copy real. El form usa onSubmit
 * con preventDefault + useState para la confirmacion (no onsubmit string inline).
 */
import type { ComponentConfig } from '@measured/puck'
import { useState } from 'react'

const AMZ = 'https://www.amazon.com/dp/B0H1JTHK57?utm_source=maas90d&utm_medium=libro_landing&utm_campaign=launch&utm_content=final_cta'

type FinalProps = {
  eyebrow: string; h2a: string; em: string; lead: string
  placeholder: string; submitLabel: string; confirm: string
  or: string; ctaLabel: string; price: string; micro: string
}

function LeadForm({ placeholder, submitLabel, confirm }: { placeholder: string; submitLabel: string; confirm: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  if (status === 'done') {
    return (
      <form className="leadform">
        <p className="micro">{confirm}</p>
      </form>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/capitulo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="leadform" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder={placeholder}
        aria-label="Tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
      />
      <button className="btn btn--ghost" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando…' : submitLabel}
      </button>
      {status === 'error' && (
        <p className="micro" style={{ color: '#f87171', marginTop: 8 }}>
          Algo salió mal. Intenta de nuevo o escríbeme a jorge@believe-global.com
        </p>
      )}
    </form>
  )
}

export const Final: ComponentConfig<FinalProps> = {
  label: 'Final (CTA capitulo)',
  fields: {
    eyebrow: { type: 'text' },
    h2a: { type: 'text' },
    em: { type: 'text' },
    lead: { type: 'textarea' },
    placeholder: { type: 'text' },
    submitLabel: { type: 'text' },
    confirm: { type: 'textarea' },
    or: { type: 'text' },
    ctaLabel: { type: 'text' },
    price: { type: 'text' },
    micro: { type: 'textarea' },
  } as never,
  defaultProps: {
    eyebrow: 'Tu cambio empieza con una página',
    h2a: 'Tu cerebro necesita ',
    em: 'evidencia nueva',
    lead: 'Dásela. Lee el primer capítulo gratis: si te reconoces en las primeras páginas, ya sabrás que este es tu camino.',
    placeholder: 'tu@correo.com',
    submitLabel: 'Enviarme el capítulo 1',
    confirm: 'Listo. Revisa tu correo: el primer capítulo va en camino.',
    or: 'o, si ya lo sabes',
    ctaLabel: 'Conseguir el libro en Amazon',
    price: '· $9.99',
    micro: 'Entrega inmediata en Kindle · El paso más pequeño hacia la versión de ti que sí ejecuta',
  },
  render: ({ eyebrow, h2a, em, lead, placeholder, submitLabel, confirm, or, ctaLabel, price, micro }) => (
    <section id="capitulo" className="final">
      <div className="wrap col" style={{ margin: '0 auto' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>{eyebrow}</span>
        <h2>{h2a}<em>{em}</em>.</h2>
        <p className="lead">{lead}</p>
        <LeadForm placeholder={placeholder} submitLabel={submitLabel} confirm={confirm} />
        <div className="or">{or}</div>
        <a className="btn btn--primary" href={AMZ} target="_blank" rel="noopener">{ctaLabel}<span className="price">{price}</span></a>
        <p className="micro">{micro}</p>
      </div>
    </section>
  ),
}
