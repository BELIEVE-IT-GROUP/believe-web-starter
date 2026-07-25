'use client'
import { useEffect } from 'react'

/**
 * Cliente de las landings 'raw'. Dos cosas, sin romper el SSR/SEO (el HTML ya viene del server):
 *  1. reveal-on-scroll: añade .visible al entrar en viewport.
 *  2. atribución: lee los UTM de la URL (del anuncio) e inyecta campos ocultos en cada <form>
 *     — _campaign (utm_campaign o fallback <landing>-web) + _utm_source/medium/content/term.
 *     Así cada lead que sale al CMS/n8n/CRM llega con su campaña.
 */
export function RawReveal() {
  useEffect(() => {
    // ── Atribución UTM → campos ocultos en los forms
    try {
      const params = new URLSearchParams(window.location.search)
      const utm = (k: string) => params.get('utm_' + k) || ''
      const tenant = window.location.pathname.match(/\/s\/([^/]+)/)?.[1] || 'web'
      const campaign = utm('campaign') || `${tenant}-web`
      const setHidden = (form: HTMLFormElement, name: string, value: string) => {
        if (!value) return
        let i = form.querySelector<HTMLInputElement>(`input[name="${name}"]`)
        if (!i) {
          i = document.createElement('input')
          i.type = 'hidden'
          i.name = name
          form.appendChild(i)
        }
        i.value = value
      }
      document.querySelectorAll<HTMLFormElement>('form').forEach((form) => {
        setHidden(form, '_campaign', campaign)
        setHidden(form, '_utm_source', utm('source'))
        setHidden(form, '_utm_medium', utm('medium'))
        setHidden(form, '_utm_content', utm('content'))
        setHidden(form, '_utm_term', utm('term'))
      })
    } catch {
      /* atribución best-effort: nunca rompe la landing */
    }

    // ── Reveal-on-scroll
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
