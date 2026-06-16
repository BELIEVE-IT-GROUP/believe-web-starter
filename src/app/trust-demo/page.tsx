import { TrustForm } from './TrustForm'

export const metadata = {
  title: 'Trust — Fulfillment que se mide, no se promete',
  description: '+300,000 órdenes procesadas con control total. Diagnóstico Operativo Gratuito para marcas DTC en México.',
}

export default function TrustHome() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');

        .t { font-family: 'Montserrat', system-ui, sans-serif; }
        .t-d { font-family: 'Syne', system-ui, sans-serif; }

        .trust-hero {
          background: #000;
          min-height: 100vh;
          display: grid;
          align-items: center;
          padding: clamp(5rem, 10vw, 8rem) clamp(1.5rem, 6vw, 5rem);
          position: relative;
          overflow: hidden;
        }
        .trust-hero::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(255,132,0,0.08) 0%, transparent 65%);
          pointer-events: none;
        }
        .trust-hero-grid {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: clamp(3rem, 6vw, 6rem);
          align-items: center;
        }
        @media (max-width: 900px) {
          .trust-hero-grid { grid-template-columns: 1fr; }
        }

        .trust-badge {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #ff8400;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .trust-badge::before {
          content: '';
          display: inline-block;
          width: 2rem;
          height: 2px;
          background: #ff8400;
          flex-shrink: 0;
        }

        .trust-h1 {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: clamp(2.75rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.0;
          color: #fff;
          margin: 0 0 2rem;
          letter-spacing: -0.02em;
        }
        .trust-h1 em {
          color: #ff8400;
          font-style: normal;
        }

        .trust-lead {
          font-size: clamp(1rem, 1.5vw, 1.125rem);
          line-height: 1.75;
          color: rgba(255,255,255,0.6);
          max-width: 520px;
          margin: 0 0 2.5rem;
        }

        .trust-cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .trust-cta-primary {
          font-family: 'Syne', system-ui, sans-serif;
          background: #ff8400;
          color: #000;
          padding: 1rem 2rem;
          font-weight: 700;
          font-size: 0.9375rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: opacity 0.15s;
        }
        .trust-cta-primary:hover { opacity: 0.9; }
        .trust-cta-secondary {
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          padding: 1rem 2rem;
          font-size: 0.9375rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: border-color 0.15s;
        }
        .trust-cta-secondary:hover { border-color: rgba(255,255,255,0.5); }

        .trust-stats {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .trust-stat-item {
          padding: 2rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
        }
        .trust-stat-item:last-child { border-bottom: none; }
        .trust-stat-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #ff8400;
        }
        .trust-stat-num {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .trust-stat-label {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #ff8400;
        }
        .trust-stat-sub {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.4);
          margin-top: 0.2rem;
        }

        /* PAIN SECTION */
        .trust-pain {
          background: #fff;
          padding: clamp(5rem, 8vw, 8rem) clamp(1.5rem, 6vw, 5rem);
        }
        .trust-pain-inner { max-width: 1200px; margin: 0 auto; }
        .trust-section-eyebrow {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #ff8400;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .trust-section-eyebrow::before {
          content: '';
          display: inline-block;
          width: 1.5rem;
          height: 2px;
          background: #ff8400;
          flex-shrink: 0;
        }
        .trust-h2 {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #000;
          line-height: 1.05;
          margin: 0 0 1.25rem;
          letter-spacing: -0.02em;
        }
        .trust-h2 em { color: #ff8400; font-style: normal; }
        .trust-sub {
          font-size: 1.0625rem;
          color: #555;
          max-width: 540px;
          line-height: 1.7;
          margin: 0 0 4rem;
        }
        .trust-pain-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: #f0f0f0;
        }
        @media (max-width: 800px) {
          .trust-pain-grid { grid-template-columns: 1fr; }
        }
        .trust-pain-card {
          background: #fff;
          padding: 2.5rem 2rem;
        }
        .trust-pain-icon {
          font-size: 1.75rem;
          margin-bottom: 1.25rem;
          display: block;
        }
        .trust-pain-title {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 1.125rem;
          font-weight: 700;
          color: #000;
          margin: 0 0 0.75rem;
        }
        .trust-pain-desc {
          font-size: 0.9375rem;
          color: #444;
          line-height: 1.65;
          margin: 0 0 1rem;
        }
        .trust-pain-data {
          font-size: 0.8125rem;
          color: #ff8400;
          font-weight: 600;
        }

        /* SISTEMA */
        .trust-sistema {
          background: #000;
          padding: clamp(5rem, 8vw, 8rem) clamp(1.5rem, 6vw, 5rem);
        }
        .trust-sistema-inner { max-width: 1200px; margin: 0 auto; }
        .trust-sistema-header { margin-bottom: 5rem; }
        .trust-h2-white {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          margin: 0 0 1.25rem;
          letter-spacing: -0.02em;
        }
        .trust-h2-white em { color: #ff8400; font-style: normal; }
        .trust-sub-white {
          font-size: 1.0625rem;
          color: rgba(255,255,255,0.5);
          max-width: 540px;
          line-height: 1.7;
          margin: 0;
        }
        .trust-pilares {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
        }
        @media (max-width: 700px) {
          .trust-pilares { grid-template-columns: 1fr; }
        }
        .trust-pilar {
          background: #0a0a0a;
          padding: 3rem 2.5rem;
        }
        .trust-pilar-code {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #ff8400;
          margin-bottom: 1.25rem;
        }
        .trust-pilar-title {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.875rem;
        }
        .trust-pilar-desc {
          font-size: 0.9375rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          margin: 0;
        }

        /* SOCIAL PROOF */
        .trust-proof {
          background: #fff;
          padding: clamp(5rem, 8vw, 8rem) clamp(1.5rem, 6vw, 5rem);
        }
        .trust-proof-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(3rem, 6vw, 6rem);
          align-items: start;
        }
        @media (max-width: 800px) {
          .trust-proof-inner { grid-template-columns: 1fr; }
        }
        .trust-quote {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: clamp(1.375rem, 2.5vw, 1.875rem);
          font-weight: 700;
          color: #000;
          line-height: 1.35;
          margin: 0 0 1.75rem;
          padding-top: 1.25rem;
          border-top: 4px solid #ff8400;
        }
        .trust-cite {
          font-size: 0.875rem;
          color: #888;
          font-style: normal;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f0f0;
          display: block;
        }
        .trust-metrics-panel {
          background: #000;
          padding: 0;
        }
        .trust-metric-row {
          padding: 1.75rem 2.5rem;
          border-bottom: 1px solid #1a1a1a;
          display: flex;
          align-items: baseline;
          gap: 1.25rem;
        }
        .trust-metric-row:last-child { border-bottom: none; }
        .trust-metric-num {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: clamp(1.75rem, 2.5vw, 2.25rem);
          font-weight: 800;
          color: #ff8400;
          line-height: 1;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .trust-metric-label {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.4;
        }

        /* CTA */
        .trust-cta {
          background: #ff8400;
          padding: clamp(5rem, 8vw, 8rem) clamp(1.5rem, 6vw, 5rem);
        }
        .trust-cta-inner {
          max-width: 820px;
          margin: 0 auto;
        }
        .trust-h2-black {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 800;
          color: #000;
          line-height: 1.05;
          margin: 0 0 1.25rem;
          letter-spacing: -0.02em;
        }
        .trust-sub-black {
          font-size: 1.0625rem;
          color: rgba(0,0,0,0.6);
          max-width: 520px;
          line-height: 1.7;
          margin: 0 0 3rem;
        }
        .trust-form {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          max-width: 480px;
        }
        .trust-input {
          padding: 1rem 1.25rem;
          font-size: 1rem;
          font-family: 'Montserrat', system-ui, sans-serif;
          border: 2px solid rgba(0,0,0,0.12);
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
          box-sizing: border-box;
        }
        .trust-input::placeholder { color: rgba(0,0,0,0.4); }
        .trust-input:focus { border-color: #000; }
        .trust-submit {
          font-family: 'Syne', system-ui, sans-serif;
          background: #000;
          color: #fff;
          padding: 1.125rem 2rem;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          text-align: center;
          transition: opacity 0.15s;
          width: 100%;
        }
        .trust-submit:hover { opacity: 0.85; }
        .trust-form-note {
          font-size: 0.8125rem;
          color: rgba(0,0,0,0.5);
          margin: 0;
        }

        /* FOOTER TRUST */
        .trust-footer {
          background: #000;
          padding: 3rem clamp(1.5rem, 6vw, 5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .trust-footer-brand {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .trust-footer-brand span { color: #ff8400; }
        .trust-footer-tagline {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.35);
          margin-top: 0.25rem;
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="trust-hero">
        <div className="trust-hero-grid">
          <div>
            <p className="trust-badge">Fulfillment que se demuestra</p>
            <h1 className="trust-h1">
              Tu operación<br />
              <em>no puede seguir<br />siendo una apuesta.</em>
            </h1>
            <p className="trust-lead">
              Cada orden tardada es un cliente que no vuelve. Cada error de picking, una
              devolución. Cada SLA incumplido, una queja pública. TRUST convierte tu
              fulfillment en un sistema predecible — con evidencia de cada movimiento.
            </p>
            <div className="trust-cta-row">
              <a href="#diagnostico" className="trust-cta-primary">
                Diagnóstico Operativo GRATIS &rarr;
              </a>
              <a href="#sistema" className="trust-cta-secondary">
                Ver el sistema
              </a>
            </div>
          </div>

          <div className="trust-stats">
            {[
              { num: '+300K', label: 'órdenes procesadas', sub: 'con trazabilidad completa' },
              { num: '−30%', label: 'errores de picking', sub: 'promedio en primer trimestre' },
              { num: '+15%', label: 'velocidad de entrega', sub: 'en primeros 60 días' },
            ].map((s) => (
              <div key={s.num} className="trust-stat-item">
                <div className="trust-stat-num">{s.num}</div>
                <div className="trust-stat-label">{s.label}</div>
                <div className="trust-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOLOR ────────────────────────────────────────── */}
      <section className="trust-pain">
        <div className="trust-pain-inner">
          <p className="trust-section-eyebrow">El costo real</p>
          <h2 className="trust-h2">
            ¿Qué pasa cuando<br />
            <em>el fulfillment falla?</em>
          </h2>
          <p className="trust-sub">
            No es solo un error en el almacén. Es tu reputación, tu CAC y tu tasa de
            recompra. Los números son más duros de lo que parecen.
          </p>
          <div className="trust-pain-grid">
            {[
              {
                icon: '📦',
                title: 'Errores de picking',
                desc: 'Cada devolución te cuesta entre $120 y $400 pesos en reversa, reposición y atención al cliente — más el cliente que ya no regresa.',
                data: '1 de cada 8 órdenes tiene algún error en operaciones sin sistema.',
              },
              {
                icon: '⏱',
                title: 'SLA incumplido',
                desc: 'Un día de retraso aumenta 40% la probabilidad de cancelación o queja pública en redes. En temporada alta, el daño se multiplica.',
                data: 'Temporada alta: 3 de cada 10 órdenes llegan tarde sin operador dedicado.',
              },
              {
                icon: '↩',
                title: 'Devoluciones sin control',
                desc: 'Sin proceso de reversa trazado, pierdes el producto y el historial del cliente. La logística inversa es donde más dinero se pierde en silencio.',
                data: '68% de compradores DTC no vuelven si la devolución fue mala experiencia.',
              },
            ].map((c) => (
              <div key={c.title} className="trust-pain-card">
                <span className="trust-pain-icon">{c.icon}</span>
                <h3 className="trust-pain-title">{c.title}</h3>
                <p className="trust-pain-desc">{c.desc}</p>
                <p className="trust-pain-data">{c.data}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SISTEMA ──────────────────────────────────────── */}
      <section className="trust-sistema" id="sistema">
        <div className="trust-sistema-inner">
          <div className="trust-sistema-header">
            <p className="trust-section-eyebrow" style={{ color: '#ff8400' }}>
              El sistema TRUST
            </p>
            <h2 className="trust-h2-white">
              Cuatro pilares.<br />
              <em>Un solo resultado: certeza.</em>
            </h2>
            <p className="trust-sub-white">
              No vendemos promesas de fulfillment. Instalamos un sistema de operación
              medible con cuatro componentes que funcionan juntos, y que se miden o
              se corrigen si no se cumplen.
            </p>
          </div>
          <div className="trust-pilares">
            {[
              {
                code: 'Panel — Control',
                title: 'Visibilidad en tiempo real',
                desc: 'Dashboard con tu inventario, órdenes en proceso y estado de cada entrega. Todo en un lugar, siempre actualizado. Sin llamadas para saber qué pasó.',
              },
              {
                code: 'POD — Evidencia',
                title: 'Prueba de cada entrega',
                desc: 'Foto, firma y timestamp en cada orden entregada. Si ocurrió, quedó registrado. Sin supuestos, sin "el repartidor dice". Evidencia operativa real.',
              },
              {
                code: 'SLA — Ritmo',
                title: 'Tiempos comprometidos por escrito',
                desc: 'Tiempo de alistamiento, despacho y entrega definidos en el contrato. Lo cumplimos o lo medimos juntos para corregirlo, sin excusas de temporada.',
              },
              {
                code: 'COD — Ciclo completo',
                title: 'Pago contraentrega incluido',
                desc: 'Los únicos en el mercado con operación cerrada de principio a fin, incluyendo COD y reconciliación de flujo. Tu cliente paga. Tú cobras. Sin fuga.',
              },
            ].map((p) => (
              <div key={p.code} className="trust-pilar">
                <p className="trust-pilar-code">{p.code}</p>
                <h3 className="trust-pilar-title">{p.title}</h3>
                <p className="trust-pilar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRUEBA SOCIAL ─────────────────────────────────── */}
      <section className="trust-proof">
        <div className="trust-proof-inner">
          <div>
            <p className="trust-section-eyebrow">Resultados reales</p>
            <blockquote className="trust-quote">
              Estábamos hartos de la incertidumbre en nuestras entregas. Con TRUST, la paz mental regresó.
            </blockquote>
            <cite className="trust-cite">
              CEO, tienda en línea de moda — Ciudad de México
            </cite>
            <p style={{ marginTop: '2.5rem', fontSize: '1rem', color: '#444', lineHeight: '1.75', maxWidth: '480px' }}>
              Trabajamos con marcas que ya venden y que ya sienten el peso de escalar sin
              sistema. Si tienes volumen y no tienes control, TRUST es para ti.
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.9375rem', color: '#999', fontStyle: 'italic' }}>
              Anti-ICP: si estás empezando o solo buscas precio, no somos tu operador.
              TRUST no compite por precio. Compite por certeza.
            </p>
          </div>

          <div className="trust-metrics-panel">
            {[
              { num: '+300,000', label: 'órdenes procesadas con control y trazabilidad demostrables' },
              { num: '30%', label: 'reducción promedio de errores de picking tras primer trimestre' },
              { num: '15%', label: 'mejora en tiempos de entrega en los primeros 60 días' },
              { num: '100%', label: 'rastreabilidad en cada orden — ningún movimiento sin registro' },
            ].map((m) => (
              <div key={m.num} className="trust-metric-row">
                <div className="trust-metric-num">{m.num}</div>
                <div className="trust-metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────── */}
      <section className="trust-cta" id="diagnostico">
        <div className="trust-cta-inner">
          <p className="trust-section-eyebrow" style={{ color: '#000', marginBottom: '1.5rem' }}>
            Sin costo, sin compromiso
          </p>
          <h2 className="trust-h2-black">
            48 horas para saber exactamente<br />dónde falla tu operación.
          </h2>
          <p className="trust-sub-black">
            El Diagnóstico Operativo TRUST es gratuito. En 48 horas recibes un análisis
            real de tu operación actual, cuánto te está costando y qué necesita cambiar para
            que tu fulfillment deje de ser un riesgo diario.
          </p>
          <TrustForm />
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="trust-footer">
        <div>
          <div className="trust-footer-brand">
            TRUST<span>.</span>
          </div>
          <div className="trust-footer-tagline">
            Fulfillment que se mide, no se promete.
          </div>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>
          trustlogistics.com.mx &nbsp;&middot;&nbsp; CDMX &nbsp;&middot;&nbsp; GDL &nbsp;&middot;&nbsp; MTY
        </div>
      </footer>
    </>
  )
}
