'use client'
import { useEffect } from 'react'

/**
 * Reveal-on-scroll para las landings 'raw'. El HTML ya viene del servidor (SEO ✅);
 * esto solo añade la clase .visible al entrar en viewport. No renderiza nada.
 */
export function RawReveal() {
  useEffect(() => {
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
