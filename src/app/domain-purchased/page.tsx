// Página de agradecimiento tras comprar un dominio desde la app Believable. Es el
// success_url del checkout de Stripe (ver believable/src/main/deploy/registrar.ts).
// Antes esta ruta no existía y el usuario caía en un 404 tras pagar. Standalone y
// autocontenida (fondo + estilos propios), como el resto de las páginas standalone
// del sitio (trust-demo, birdman): no depende del chrome ni de Payload.

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dominio comprado — Believe',
  description: 'Tu dominio se está conectando a tu proyecto en Believable.',
  robots: { index: false, follow: false }
}

const NAVY = '#0a0e1a'
const CARD = '#111725'
const BORDER = '#22304a'
const TEXT = '#eaf0fb'
const DIM = '#9fb0cc'
const SIGNAL = '#5b8cff'
const OK = '#3ecf8e'

export default function DomainPurchasedPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: `radial-gradient(120% 120% at 50% 0%, #16203a 0%, ${NAVY} 55%)`,
        color: TEXT,
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 20,
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)'
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            margin: '0 auto 20px',
            borderRadius: 14,
            background: 'rgba(62,207,142,0.12)',
            border: `1px solid ${OK}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={OK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-fraunces), Georgia, serif',
            fontSize: 26,
            fontWeight: 500,
            margin: '0 0 10px',
            lineHeight: 1.15
          }}
        >
          ¡Pago confirmado!
        </h1>

        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.6, margin: '0 0 8px' }}>
          Tu dominio se está registrando y conectando a tu proyecto.
        </p>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          Vuelve a la app <strong style={{ color: TEXT }}>Believable</strong>: ahí ves el
          progreso en vivo y, cuando termina, el dominio queda conectado en verde.
        </p>

        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: `1px solid ${BORDER}`,
            color: '#6b7c9c',
            fontSize: 13
          }}
        >
          Ya puedes cerrar esta pestaña.
        </div>

        <div style={{ marginTop: 22 }}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: SIGNAL
            }}
          >
            Believe
          </span>
        </div>
      </div>
    </main>
  )
}
