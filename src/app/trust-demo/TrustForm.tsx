'use client'

import { useState } from 'react'

export function TrustForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div style={{ padding: '2rem', background: '#000', color: '#fff', maxWidth: '480px', fontFamily: 'Montserrat, system-ui, sans-serif' }}>
        <p style={{ fontFamily: 'Syne, system-ui, sans-serif', fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem' }}>
          Recibido. En 48 horas te contactamos.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          Revisa tu bandeja de entrada — y la de spam, por si acaso.
        </p>
      </div>
    )
  }

  return (
    <form
      className="trust-form"
      onSubmit={(e) => { e.preventDefault(); setSent(true) }}
    >
      <input className="trust-input" type="text" placeholder="Tu nombre" required />
      <input className="trust-input" type="email" placeholder="Email de trabajo" required />
      <input className="trust-input" type="text" placeholder="¿Cuántas órdenes/mes procesas?" required />
      <button type="submit" className="trust-submit">
        Obtener Diagnóstico Gratuito &rarr;
      </button>
      <p className="trust-form-note">
        Sin compromiso. Sin spam. Solo un análisis real de tu operación.
      </p>
    </form>
  )
}
