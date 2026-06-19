'use client'
import { useEffect } from 'react'

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --y: #FCFC00;
    --w: #FFFFFF;
    --bg: #000000;
    --gray: #667085;
    --gray-light: #1a1a1a;
    --gray-mid: #333;
  }

  html {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    scroll-behavior: smooth;
    background: var(--bg);
    font-family: 'Space Grotesk', sans-serif;
    color: var(--w);
  }

  section {
    scroll-snap-align: start;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 100px;
    position: relative;
    overflow: hidden;
  }

  .nav-dots {
    position: fixed;
    right: 32px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 100;
  }
  .nav-dots a {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gray);
    display: block;
    transition: all 0.2s;
    cursor: pointer;
    text-decoration: none;
  }
  .nav-dots a:hover, .nav-dots a.active { background: var(--y); transform: scale(1.4); }

  .slide-num {
    position: absolute;
    bottom: 36px;
    right: 60px;
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--gray);
    font-weight: 500;
    text-transform: uppercase;
  }

  .logo-mark {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .logo-circle {
    width: 44px;
    height: 44px;
    background: var(--y);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-circle span {
    font-size: 18px;
    font-weight: 800;
    color: #000;
    letter-spacing: -1px;
  }
  .logo-text {
    font-size: 22px;
    font-weight: 800;
    color: var(--w);
    letter-spacing: -0.5px;
  }

  .eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--y);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .eyebrow::before {
    content: '';
    display: block;
    width: 32px;
    height: 2px;
    background: var(--y);
  }

  h1 {
    font-size: clamp(48px, 7vw, 96px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -3px;
    color: var(--w);
  }
  h1 em { color: var(--y); font-style: normal; }

  h2 {
    font-size: clamp(32px, 4.5vw, 64px);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -2px;
    color: var(--w);
    margin-bottom: 40px;
  }
  h2 em { color: var(--y); font-style: normal; }
  h2 .white { color: var(--w); }

  h3 {
    font-size: clamp(20px, 2.5vw, 28px);
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--y);
    margin-bottom: 12px;
  }

  p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #ccc;
    max-width: 560px;
  }
  p strong { color: var(--w); font-weight: 600; }

  .cols-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
  .cols-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .cols-2-wide { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; align-items: center; }

  .card {
    background: var(--gray-light);
    border: 1px solid var(--gray-mid);
    border-radius: 16px;
    padding: 36px;
    position: relative;
  }
  .card.yellow-border { border-color: var(--y); }
  .card.white-border { border-color: #555; }

  .stat-block { display: flex; flex-direction: column; gap: 8px; }
  .stat-num {
    font-size: clamp(40px, 5vw, 72px);
    font-weight: 800;
    letter-spacing: -2px;
    color: var(--y);
    line-height: 1;
  }
  .stat-label {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #888;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .divider {
    width: 48px;
    height: 3px;
    background: var(--y);
    margin: 32px 0;
  }
  .divider.short { width: 24px; height: 2px; margin: 16px 0; }

  .bolt {
    color: var(--y);
    font-size: 1.2em;
    margin-right: 4px;
  }

  .tag {
    display: inline-block;
    background: var(--y);
    color: #000;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  .tag.white { background: var(--w); color: #000; }
  .tag.outline { background: transparent; border: 1px solid var(--y); color: var(--y); }

  .big-quote {
    font-size: clamp(24px, 3.5vw, 44px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -1.5px;
    color: var(--w);
    border-left: 4px solid var(--y);
    padding-left: 32px;
    margin: 40px 0;
    max-width: 800px;
  }

  .compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--gray-mid);
    border-radius: 16px;
    overflow: hidden;
  }
  .compare-header {
    padding: 20px 28px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .compare-header.left { background: var(--gray-light); color: var(--gray); border-bottom: 1px solid var(--gray-mid); border-right: 1px solid var(--gray-mid); }
  .compare-header.right { background: var(--y); color: #000; border-bottom: 1px solid #e6e600; }
  .compare-row { display: contents; }
  .compare-cell {
    padding: 16px 28px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    border-bottom: 1px solid var(--gray-mid);
  }
  .compare-cell.left { color: #888; text-decoration: line-through; border-right: 1px solid var(--gray-mid); background: #0d0d0d; }
  .compare-cell.right { color: #000; background: #fffe40; font-weight: 500; }

  .chat-ui {
    background: #0d0d0d;
    border: 1px solid var(--gray-mid);
    border-radius: 20px;
    padding: 28px;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--gray-mid);
    margin-bottom: 4px;
  }
  .chat-avatar {
    width: 36px;
    height: 36px;
    background: var(--y);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
    color: #000;
  }
  .chat-name { font-size: 14px; font-weight: 700; }
  .chat-status { font-size: 11px; color: #4ade80; }
  .bubble {
    max-width: 85%;
    padding: 12px 16px;
    border-radius: 16px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    line-height: 1.5;
  }
  .bubble.user {
    background: #333;
    color: var(--w);
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  .bubble.agent {
    background: #1a1a1a;
    color: var(--w);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    border-left: 2px solid var(--y);
  }
  .bubble.agent strong { color: var(--y); }
  .pill-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .pill {
    background: var(--y);
    color: #000;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
  }
  .pill.outline {
    background: transparent;
    border: 1px solid var(--gray-mid);
    color: #aaa;
  }

  .roadmap {
    display: flex;
    gap: 0;
    margin-top: 40px;
    position: relative;
  }
  .roadmap::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    height: 2px;
    background: var(--y);
  }
  .roadmap-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    position: relative;
    padding-top: 0;
  }
  .roadmap-dot {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg);
    border: 3px solid var(--y);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
    color: var(--y);
    position: relative;
    z-index: 1;
  }
  .roadmap-dot.filled { background: var(--y); color: #000; }
  .roadmap-dot.blue-dot { border-color: #888; color: #888; }
  .roadmap-content {
    text-align: center;
    padding: 0 8px;
  }
  .roadmap-date {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: var(--y);
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .roadmap-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--w);
    margin-bottom: 4px;
  }
  .roadmap-desc {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    color: #777;
    line-height: 1.4;
  }

  .product-card {
    border-radius: 20px;
    padding: 40px;
    position: relative;
    overflow: hidden;
  }
  .product-card.consumer {
    background: linear-gradient(135deg, #111 0%, #1a1a00 100%);
    border: 1px solid #3a3a00;
  }
  .product-card.business {
    background: linear-gradient(135deg, #111 0%, #1c1c1c 100%);
    border: 1px solid #444;
  }
  .product-icon {
    font-size: 40px;
    margin-bottom: 20px;
  }
  .product-name {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }
  .product-sub {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #888;
    margin-bottom: 24px;
  }
  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
  }
  .feature-item {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #ccc;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .feature-item::before {
    content: '⚡';
    font-size: 12px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .acq-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 12px;
    color: #888;
  }
  .acq-badge span { color: var(--y); font-weight: 600; }

  .evolution {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 24px;
    align-items: center;
    margin-top: 32px;
  }
  .evo-arrow {
    font-size: 32px;
    color: var(--y);
    text-align: center;
  }
  .evo-card {
    border-radius: 16px;
    padding: 32px;
  }
  .evo-card.before {
    background: #111;
    border: 1px solid var(--gray-mid);
    opacity: 0.7;
  }
  .evo-card.after {
    background: linear-gradient(135deg, #1a1a00, #0a0a00);
    border: 1px solid var(--y);
  }
  .evo-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 20px;
    color: var(--gray);
  }
  .evo-label.new { color: var(--y); }
  .evo-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #aaa;
    margin-bottom: 12px;
  }
  .evo-item.good { color: #ccc; }
  .evo-item.good::before { content: '✓'; color: var(--y); font-weight: 700; flex-shrink: 0; }
  .evo-item.bad::before { content: '✕'; color: #555; font-weight: 700; flex-shrink: 0; }

  .rev-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 32px;
  }
  .rev-bar {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .rev-label {
    font-size: 13px;
    font-weight: 600;
    color: #ccc;
    width: 160px;
    flex-shrink: 0;
  }
  .rev-track {
    flex: 1;
    height: 36px;
    background: #111;
    border-radius: 8px;
    overflow: hidden;
  }
  .rev-fill {
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 12px;
    font-weight: 700;
    color: #000;
  }
  .rev-fill.y { background: var(--y); }
  .rev-fill.b { background: #333; color: var(--w); }
  .rev-fill.mix { background: linear-gradient(to right, var(--y), #aaa); }

  .why-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 40px;
  }
  .why-item {
    background: var(--gray-light);
    border: 1px solid var(--gray-mid);
    border-radius: 14px;
    padding: 28px;
    position: relative;
  }
  .why-num {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -2px;
    color: #1a1a1a;
    position: absolute;
    top: 16px;
    right: 20px;
    line-height: 1;
  }
  .why-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--y);
    margin-bottom: 8px;
  }
  .why-desc {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #888;
    line-height: 1.5;
  }

  .bg-bolt {
    position: absolute;
    font-size: 400px;
    color: var(--y);
    opacity: 0.03;
    right: -60px;
    bottom: -80px;
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }
  .bg-circle {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: var(--y);
    opacity: 0.03;
    right: -200px;
    top: -200px;
    pointer-events: none;
  }

  #cover {
    justify-content: flex-end;
    padding-bottom: 100px;
  }
  #cover .bg-circle {
    width: 900px;
    height: 900px;
    right: -250px;
    top: -250px;
    opacity: 0.04;
  }
  #cover h1 { margin-bottom: 24px; }
  #cover p { font-size: 18px; color: #999; max-width: 600px; }

  #momento .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-top: 60px;
    border-top: 1px solid var(--gray-mid);
    padding-top: 48px;
  }

  #via-baloto .table-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: var(--gray-mid);
    border-radius: 16px;
    overflow: hidden;
    margin-top: 40px;
  }
  .tc-cell {
    background: #0a0a0a;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tc-cell.header { background: #111; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
  .tc-cell.header.y { color: var(--y); }
  .tc-cell.header.g { color: var(--gray); }
  .tc-icon { font-size: 20px; margin-bottom: 4px; }
  .tc-title { font-size: 14px; font-weight: 600; color: var(--w); }
  .tc-desc { font-family: 'Inter', sans-serif; font-size: 12px; color: #666; line-height: 1.4; }

  .footer-mark {
    position: absolute;
    bottom: 36px;
    left: 100px;
    font-size: 11px;
    color: #333;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }
`

export default function OnOngentDeck() {
  useEffect(() => {
    const sections = document.querySelectorAll('section')
    const dots = document.querySelectorAll('.nav-dots a')

    function updateDots() {
      let current = 0
      sections.forEach((s, i) => {
        const rect = s.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) current = i
      })
      dots.forEach((d, i) => d.classList.toggle('active', i === current))
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        const sArr = Array.from(sections)
        const current = sArr.findIndex(s => {
          const r = s.getBoundingClientRect()
          return r.top >= -10 && r.top <= 10
        })
        if (current < sections.length - 1) (sections[current + 1] as HTMLElement).scrollIntoView({ behavior: 'smooth' })
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        const sArr = Array.from(sections)
        const current = sArr.findIndex(s => {
          const r = s.getBoundingClientRect()
          return r.top >= -10 && r.top <= 10
        })
        if (current > 0) (sections[current - 1] as HTMLElement).scrollIntoView({ behavior: 'smooth' })
      }
    }

    document.addEventListener('keydown', handleKeydown)
    window.addEventListener('scroll', updateDots)
    updateDots()

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('scroll', updateDots)
    }
  }, [])

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <nav className="nav-dots">
        <a href="#cover" title="Portada"></a>
        <a href="#momento" title="El Momento"></a>
        <a href="#via-baloto" title="La Inspiración"></a>
        <a href="#ongent" title="El Ongent"></a>
        <a href="#vs" title="Comparador vs Agente"></a>
        <a href="#productos" title="Dos Productos"></a>
        <a href="#partner" title="ON! Partner"></a>
        <a href="#revenue" title="Revenue Model"></a>
        <a href="#por-que-ahora" title="Por Qué Ahora"></a>
        <a href="#roadmap" title="Roadmap"></a>
        <a href="#cierre" title="Cierre"></a>
      </nav>

      {/* SLIDE 1: COVER */}
      <section id="cover">
        <div className="bg-circle"></div>
        <div className="bg-bolt">⚡</div>

        <div className="logo-mark">
          <div className="logo-circle"><span>ON!</span></div>
          <span className="logo-text">onprende</span>
        </div>

        <h1>De franquicia<br />a plataforma<br /><em>agentica.</em></h1>

        <div className="divider"></div>

        <p>Una visión estratégica para el siguiente capítulo de ON! — cómo transformamos nuestra red, nuestra tecnología y nuestro modelo de negocio para capturar una oportunidad que nadie en México ha construido.</p>

        <div className="footer-mark">Confidencial — Socios &amp; Board — 2026</div>
        <span className="slide-num">01 / 11</span>
      </section>

      {/* SLIDE 2: EL MOMENTO */}
      <section id="momento">
        <div className="bg-bolt">⚡</div>

        <div className="eyebrow">El punto de partida</div>
        <h2>Tenemos todo<br />lo que se necesita.<br /><em>Menos escala.</em></h2>
        <p>ON! tiene verticales negociadas, apps funcionando, un cerebro central y APIs integradas. El cuello de botella no es el producto — es la velocidad de adquisición del modelo actual.</p>

        <div className="stats-row">
          <div className="stat-block">
            <div className="stat-num">3</div>
            <div className="stat-label">Verticales negociadas: envíos, seguros, fintech</div>
          </div>
          <div className="stat-block">
            <div className="stat-num">100%</div>
            <div className="stat-label">APIs ya integradas técnicamente. El MVP existe.</div>
          </div>
          <div className="stat-block">
            <div className="stat-num">0</div>
            <div className="stat-label">Meses necesarios para lanzar MVP — semanas.</div>
          </div>
        </div>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">02 / 11</span>
      </section>

      {/* SLIDE 3: VIA BALOTO */}
      <section id="via-baloto">
        <div className="bg-bolt">⚡</div>

        <div className="eyebrow">La inspiración</div>
        <h2>Via Baloto lo hizo<br />con <em>máquinas.</em><br />Nosotros con <span className="white">inteligencia.</span></h2>

        <div className="table-compare">
          <div className="tc-cell header g">Via Baloto — Colombia</div>
          <div className="tc-cell header y">ON! Ongent — México</div>

          <div className="tc-cell">
            <div className="tc-icon">🏪</div>
            <div className="tc-title">43,000 puntos físicos</div>
            <div className="tc-desc">Terminal en tiendas de barrio, droguerías, papelerías</div>
          </div>
          <div className="tc-cell">
            <div className="tc-icon">📱</div>
            <div className="tc-title">1 app en tu celular</div>
            <div className="tc-desc">El agente llega a ti. Sin filas, sin horarios, sin efectivo</div>
          </div>

          <div className="tc-cell">
            <div className="tc-icon">🙋</div>
            <div className="tc-title">Tú vas al punto</div>
            <div className="tc-desc">Tienes que desplazarte a hacer el trámite</div>
          </div>
          <div className="tc-cell">
            <div className="tc-icon">🤖</div>
            <div className="tc-title">El Ongent te busca</div>
            <div className="tc-desc">&ldquo;Tu seguro vence en 5 días. ¿Renuevo o comparamos?&rdquo;</div>
          </div>

          <div className="tc-cell">
            <div className="tc-icon">❓</div>
            <div className="tc-title">No sabe quién eres</div>
            <div className="tc-desc">Cada visita empieza de cero</div>
          </div>
          <div className="tc-cell">
            <div className="tc-icon">🧠</div>
            <div className="tc-title">Aprende tu vida</div>
            <div className="tc-desc">Tus servicios, tu historial, tus preferencias. Mejora solo.</div>
          </div>

          <div className="tc-cell">
            <div className="tc-icon">💰</div>
            <div className="tc-title">Solo cobra</div>
            <div className="tc-desc">Ejecuta transacciones básicas</div>
          </div>
          <div className="tc-cell">
            <div className="tc-icon">⚡</div>
            <div className="tc-title">Compara, actúa, optimiza</div>
            <div className="tc-desc">Envíos, seguros, créditos, pagos — miles de verticales</div>
          </div>
        </div>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">03 / 11</span>
      </section>

      {/* SLIDE 4: EL ONGENT */}
      <section id="ongent">
        <div className="cols-2-wide">
          <div>
            <div className="eyebrow">La visión central</div>
            <h2>El <em>Ongent:</em><br />tu asistente de vida<br />en tu celular.</h2>

            <p>No un chatbot que responde preguntas. Un agente que <strong>conoce tu vida</strong>, sabe qué servicios usas, cuándo vencen, qué estás pagando de más — y <strong>actúa en tu nombre</strong> sin que tengas que pedirlo.</p>

            <div className="divider"></div>

            <div className="feature-list">
              <div className="feature-item">Envíos al mejor precio, guía generada en segundos</div>
              <div className="feature-item">Seguro de auto: renovación automática, comparación proactiva</div>
              <div className="feature-item">Microcréditos basados en tu historial de transacciones</div>
              <div className="feature-item">Pagos de servicios sin abrir apps ni recordar fechas</div>
              <div className="feature-item">Miles de verticales. La misma interfaz conversacional.</div>
            </div>
          </div>

          <div className="chat-ui">
            <div className="chat-header">
              <div className="chat-avatar">ON</div>
              <div>
                <div className="chat-name">Ongent ⚡</div>
                <div className="chat-status">● En línea 24/7</div>
              </div>
            </div>

            <div className="bubble user">Necesito mandar un paquete a Monterrey, 2kg</div>

            <div className="bubble agent">
              Comparé <strong>FedEx, DHL y UPS</strong> con tus tarifas negociadas.<br /><br />
              Mejor opción: <strong>DHL — $145 MXN</strong>, entrega mañana 10am.<br /><br />
              ¿Agendo el pickup para las 9am?
            </div>

            <div className="pill-row">
              <span className="pill">Sí, agenda</span>
              <span className="pill outline">Ver opciones</span>
            </div>

            <div className="bubble agent">
              ✓ <strong>Pickup agendado mañana 9am.</strong><br />
              Guía: #DHL2847592 — te aviso cuando salga.
            </div>
          </div>
        </div>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">04 / 11</span>
      </section>

      {/* SLIDE 5: COMPARADOR VS AGENTE */}
      <section id="vs">
        <div className="bg-bolt">⚡</div>

        <div className="eyebrow">La diferencia crítica</div>
        <h2>No somos<br />un <em>comparador.</em><br />Somos el que <em>actúa.</em></h2>

        <div style={{ marginTop: '40px' }}>
          <div className="compare">
            <div className="compare-header left">Comparador (Skydropx, Coru, etc.)</div>
            <div className="compare-header right">⚡ ON! Ongent</div>

            <div className="compare-cell left">&ldquo;Aquí hay 5 opciones. Elige.&rdquo;</div>
            <div className="compare-cell right">&ldquo;Ya agendé tu pickup para mañana 9am.&rdquo;</div>

            <div className="compare-cell left">Existe cuando tú lo buscas</div>
            <div className="compare-cell right">Existe antes de que lo necesites</div>

            <div className="compare-cell left">Muestra cotizaciones</div>
            <div className="compare-cell right">Renueva, contrata, paga por ti</div>

            <div className="compare-cell left">Empieza de cero cada vez</div>
            <div className="compare-cell right">Aprende tu historial y preferencias</div>

            <div className="compare-cell left">Solo cuando hay fricción activa</div>
            <div className="compare-cell right">Proactivo: &ldquo;tu seguro vence en 3 días&rdquo;</div>

            <div className="compare-cell left">Una vertical por app</div>
            <div className="compare-cell right">Envíos + seguros + crédito + 1,000 verticales más</div>
          </div>
        </div>

        <div className="big-quote" style={{ marginTop: '40px', fontSize: '22px' }}>
          El moat son las <em style={{ color: 'var(--y)' }}>tarifas negociadas</em> que el usuario solo consigue aquí — y el historial de transacciones que hace migrar a otro lugar una decisión activa de perder dinero.
        </div>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">05 / 11</span>
      </section>

      {/* SLIDE 6: DOS PRODUCTOS */}
      <section id="productos">
        <div className="eyebrow">La arquitectura del negocio</div>
        <h2>Un ecosistema.<br /><em>Dos productos.</em></h2>

        <div className="cols-2" style={{ marginTop: '40px' }}>
          <div className="product-card consumer">
            <div className="product-icon">📱</div>
            <div className="tag">Ongent Personal</div>
            <div className="product-name" style={{ color: 'var(--y)' }}>B2C</div>
            <div className="product-sub">Para el mexicano urbano. Simplifica su vida.</div>

            <div className="feature-list">
              <div className="feature-item">Envíos al mejor precio, sin buscar apps</div>
              <div className="feature-item">Seguro de auto — cotización, contratación, renovación</div>
              <div className="feature-item">Microcréditos basados en comportamiento de uso</div>
              <div className="feature-item">Pagos de servicios sin recordar fechas</div>
              <div className="feature-item">Interfaz conversacional. Conversaciones + pills de decisión.</div>
            </div>

            <div className="acq-badge">
              Adquisición: <span>digital marketing + viral</span>
            </div>
          </div>

          <div className="product-card business">
            <div className="product-icon">🏢</div>
            <div className="tag white">Ongent Empresas</div>
            <div className="product-name" style={{ color: 'var(--w)' }}>B2B</div>
            <div className="product-sub">Para SMBs. Su operación simplificada.</div>

            <div className="feature-list">
              <div className="feature-item">Envíos masivos — tarifas negociadas por volumen</div>
              <div className="feature-item">Seguros comerciales y de flotilla</div>
              <div className="feature-item">Capital de trabajo y microcrédito empresarial</div>
              <div className="feature-item">Facturación electrónica y pagos a proveedores</div>
              <div className="feature-item">Panel + agente conversacional. El controller de su operación.</div>
            </div>

            <div className="acq-badge" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              Adquisición: <span>ON! Partners</span>
            </div>
          </div>
        </div>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">06 / 11</span>
      </section>

      {/* SLIDE 7: ON! PARTNER */}
      <section id="partner">
        <div className="bg-bolt">⚡</div>

        <div className="eyebrow">La evolución del ONprendedor</div>
        <h2>La franquicia no muere.<br /><em>Evoluciona.</em></h2>

        <div className="evolution">
          <div className="evo-card before">
            <div className="evo-label">Modelo actual — Franquicia</div>
            <div className="evo-item bad">$85,000 MXN de entrada</div>
            <div className="evo-item bad">Vende acceso a personas de su red</div>
            <div className="evo-item bad">Atiende transacciones manualmente</div>
            <div className="evo-item bad">Ingreso: solo cuando cierra una franquicia</div>
            <div className="evo-item bad">Pitch que suena a multinivel</div>
            <div className="evo-item bad">Escalabilidad limitada por tiempo propio</div>
          </div>

          <div className="evo-arrow">→</div>

          <div className="evo-card after">
            <div className="evo-label new">Modelo nuevo — ON! Partner</div>
            <div className="evo-item good">$0 entrada. Fee de certificación mínimo.</div>
            <div className="evo-item good">Incorpora SMBs de su red profesional al Ongent Empresas</div>
            <div className="evo-item good">El Ongent atiende. El Partner gestiona la relación.</div>
            <div className="evo-item good">Ingreso: comisión recurrente por TODAS las transacciones de su cartera</div>
            <div className="evo-item good">Pitch: &ldquo;construye una cartera que te paga sola&rdquo;</div>
            <div className="evo-item good">20 clientes SMB = ingreso mensual real sin techo</div>
          </div>
        </div>

        <p style={{ marginTop: '32px', color: '#666' }}>El ONprendedor con relaciones B2B reales tiene el perfil perfecto para ON! Partner. No cambia de industria — cambia el producto que vende y la forma en que gana.</p>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">07 / 11</span>
      </section>

      {/* SLIDE 8: REVENUE */}
      <section id="revenue">
        <div className="bg-bolt">⚡</div>

        <div className="cols-2-wide">
          <div>
            <div className="eyebrow">Modelo financiero</div>
            <h2>Comisión por<br />transacción.<br /><em>Sin techo.</em></h2>

            <p>Cada vertical genera una comisión. Cada usuario suma al volumen. El ingreso crece con el uso, no con el reclutamiento. Sin inventario, sin front-end capital, sin límite geográfico.</p>

            <div className="divider"></div>

            <div className="rev-stack">
              <div className="rev-bar">
                <div className="rev-label">Envíos</div>
                <div className="rev-track">
                  <div className="rev-fill y" style={{ width: '70%' }}>5-12% comisión</div>
                </div>
              </div>
              <div className="rev-bar">
                <div className="rev-label">Seguros de auto</div>
                <div className="rev-track">
                  <div className="rev-fill y" style={{ width: '85%' }}>10-20% prima</div>
                </div>
              </div>
              <div className="rev-bar">
                <div className="rev-label">Microcréditos</div>
                <div className="rev-track">
                  <div className="rev-fill b" style={{ width: '60%' }}>Tasa diferencial</div>
                </div>
              </div>
              <div className="rev-bar">
                <div className="rev-label">Servicios SMB</div>
                <div className="rev-track">
                  <div className="rev-fill mix" style={{ width: '90%' }}>Mixto por vertical</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card yellow-border">
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Ongent Personal</h3>
              <div className="stat-num" style={{ fontSize: '40px' }}>$4–30</div>
              <div className="stat-label">MXN por transacción de envío</div>
              <div className="divider short"></div>
              <div style={{ fontFamily: "'Inter'", fontSize: '12px', color: '#666', lineHeight: '1.5' }}>100K usuarios × 4 envíos/mes = volumen masivo de micro-comisiones</div>
            </div>

            <div className="card white-border">
              <h3 style={{ fontSize: '18px', color: 'var(--w)', marginBottom: '8px' }}>Ongent Empresas</h3>
              <div className="stat-num" style={{ fontSize: '40px' }}>10–50×</div>
              <div className="stat-label">el valor por cliente vs consumidor</div>
              <div className="divider short"></div>
              <div style={{ fontFamily: "'Inter'", fontSize: '12px', color: '#666', lineHeight: '1.5' }}>Un SMB en logística puede generar lo que 30 usuarios personales juntos</div>
            </div>
          </div>
        </div>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">08 / 11</span>
      </section>

      {/* SLIDE 9: POR QUÉ AHORA */}
      <section id="por-que-ahora">
        <div className="eyebrow">El timing</div>
        <h2>Por qué<br />este momento<br />es <em>el momento.</em></h2>

        <div className="why-grid">
          <div className="why-item">
            <div className="why-num">01</div>
            <div className="why-title">Las APIs ya existen</div>
            <div className="why-desc">El trabajo técnico más difícil (integrar carriers, CHUBB, fintech) ya está hecho. El MVP del Ongent es cuestión de semanas, no meses.</div>
          </div>

          <div className="why-item">
            <div className="why-num">02</div>
            <div className="why-title">El mercado está probado</div>
            <div className="why-desc">Kinro (EE.UU.) hace esto solo para seguros SMBs. Grab y Gojek en Asia lo hacen para todo. Nadie lo ha hecho en México con IA conversacional.</div>
          </div>

          <div className="why-item">
            <div className="why-num">03</div>
            <div className="why-title">IA conversacional llegó a mainstream</div>
            <div className="why-desc">El usuario mexicano ya usa WhatsApp para resolver todo. La barrera de adopción del chat conversacional desapareció.</div>
          </div>

          <div className="why-item">
            <div className="why-num">04</div>
            <div className="why-title">OXXO Pay es dumb</div>
            <div className="why-desc">La red física de pagos en México existe y procesa billones. Pero no sabe quién eres. El Ongent es OXXO Pay con cerebro — nadie lo ha construido.</div>
          </div>
        </div>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">09 / 11</span>
      </section>

      {/* SLIDE 10: ROADMAP */}
      <section id="roadmap">
        <div className="bg-bolt">⚡</div>

        <div className="eyebrow">Ejecución</div>
        <h2>Del MVP al<br /><em>ecosistema.</em></h2>

        <div className="roadmap">
          <div className="roadmap-item">
            <div className="roadmap-dot filled">Q3</div>
            <div className="roadmap-content">
              <div className="roadmap-date">2026 · Q3</div>
              <div className="roadmap-title">Ongent Personal MVP</div>
              <div className="roadmap-desc">Envíos conversacionales en app. Cotización + booking + tracking en un chat.</div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot">Q4</div>
            <div className="roadmap-content">
              <div className="roadmap-date">2026 · Q4</div>
              <div className="roadmap-title">ON! Partner Program</div>
              <div className="roadmap-desc">ONprendedores se certifican como Partners B2B. Cartera de SMBs con ingreso recurrente.</div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot blue-dot">2027</div>
            <div className="roadmap-content">
              <div className="roadmap-date">2027 · Expansión</div>
              <div className="roadmap-title">Seguros + Fintech + SMB</div>
              <div className="roadmap-desc">Seguros de auto, microcrédito empresarial y Ongent Empresas full. Nuevas verticales.</div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot blue-dot">∞</div>
            <div className="roadmap-content">
              <div className="roadmap-date">2028+ · Escala</div>
              <div className="roadmap-title">+1,000 Verticales</div>
              <div className="roadmap-desc">Cada integración nueva multiplica el valor del Ongent para todos los usuarios existentes.</div>
            </div>
          </div>
        </div>

        <div className="footer-mark">ON! — Visión Estratégica 2026</div>
        <span className="slide-num">10 / 11</span>
      </section>

      {/* SLIDE 11: CIERRE */}
      <section id="cierre" style={{ justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
        <div className="bg-circle" style={{ width: '1200px', height: '1200px', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}></div>

        <div className="logo-mark" style={{ justifyContent: 'center', marginBottom: '40px' }}>
          <div className="logo-circle" style={{ width: '80px', height: '80px' }}><span style={{ fontSize: '32px' }}>ON!</span></div>
        </div>

        <h1 style={{ textAlign: 'center', letterSpacing: '-4px', maxWidth: '900px' }}>ON! siempre fue<br />la plataforma de<br />servicios de <em>confianza.</em></h1>

        <div className="divider" style={{ margin: '40px auto' }}></div>

        <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', fontSize: '18px', color: '#888' }}>
          El Ongent no es un cambio de dirección.<br />Es el siguiente paso natural de lo que siempre quisimos ser.
        </p>

        <div style={{ marginTop: '60px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--y)', color: '#000', fontWeight: '700', fontSize: '14px', padding: '14px 32px', borderRadius: '40px', letterSpacing: '1px' }}>⚡ Ongent Personal — MVP en semanas</div>
          <div style={{ border: '1px solid #555', color: '#ccc', fontWeight: '700', fontSize: '14px', padding: '14px 32px', borderRadius: '40px', letterSpacing: '1px' }}>ON! Partners — Q4 2026</div>
        </div>

        <div className="footer-mark" style={{ left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>Confidencial — ON! 2026</div>
        <span className="slide-num">11 / 11</span>
      </section>
    </>
  )
}
