'use client'
/**
 * Root del set de bloques NeuroRealidad. Shell de la landing del libro.
 * Inyecta el CSS (scopeado a .nr-shell), la malla de fondo, nav + footer,
 * y corre la interactividad: reveal-on-scroll + duplicación del carrusel.
 * En el editor de Puck fuerza .reveal visible (el observer no dispara en el iframe).
 */
import { useEffect } from 'react'
import type { RootConfig } from '@measured/puck'
import { NR_CSS } from './nr.css'

const AMZ = 'https://www.amazon.com/dp/B0H1JTHK57?utm_source=maas90d&utm_medium=libro_landing&utm_campaign=launch&utm_content=nav_cta'

type RootProps = { ctaLabel: string }

export const Root: RootConfig<RootProps> = {
  fields: { ctaLabel: { type: 'text' } } as never,
  defaultProps: { ctaLabel: 'Conseguir el libro' },
  render: ({ children, ctaLabel, puck }) => {
    useEffect(() => {
      const cleanups: Array<() => void> = []
      const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches
      // reveal on scroll
      {
        const els = document.querySelectorAll('.nr-shell .reveal')
        if (reduce || !('IntersectionObserver' in window)) {
          els.forEach((el) => el.classList.add('in'))
        } else {
          const io = new IntersectionObserver(
            (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
            { rootMargin: '0px 0px -12% 0px' }
          )
          els.forEach((el) => io.observe(el))
          cleanups.push(() => io.disconnect())
        }
      }
      // carrusel: duplica el track para loop continuo
      {
        const tt = document.getElementById('ttrack')
        if (tt && !reduce && tt.dataset.dup !== '1') { tt.innerHTML += tt.innerHTML; tt.dataset.dup = '1' }
      }
      return () => cleanups.forEach((fn) => fn())
    }, [children])

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: NR_CSS }} />
        {puck?.isEditing && (
          <style dangerouslySetInnerHTML={{ __html: '.nr-shell .reveal{opacity:1 !important;transform:none !important}' }} />
        )}
        <div className="nr-shell">
          <div className="bg" />
          <header className="nav">
            <div className="wrap nav__row">
              <a className="wm" href="#top">Neuro<span>Realidad</span><span className="tm">™</span></a>
              <nav className="nav__links">
                <a href="#cerebro">Por qué te cuesta</a>
                <a href="#reconoces">¿Te reconoces?</a>
                <a href="#camino">El camino</a>
                <a href="#autor">El autor</a>
              </nav>
              <a className="btn btn--primary" href={AMZ} target="_blank" rel="noopener">{ctaLabel}</a>
            </div>
          </header>

          <main id="top">{children}</main>

          <footer>
            <div className="wrap foot">
              <div><span className="wm">Neuro<span>Realidad</span><span className="tm">™</span></span> · un libro de MAAS 90D™</div>
              <div>© 2026 Jorge Beltrán Liévano · @hellosoygeorge</div>
            </div>
          </footer>
        </div>
      </>
    )
  },
}
