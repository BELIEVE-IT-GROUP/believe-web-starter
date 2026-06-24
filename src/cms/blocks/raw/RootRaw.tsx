'use client'
import { useEffect } from 'react'
import type { RootConfig } from '@measured/puck'

/**
 * Root genérico del blockSet 'raw'. Inyecta las fonts (<link>) + el <style> global
 * VERBATIM del HTML de Maasy, y renderiza las secciones (RawSection) como children.
 * Fidelidad perfecta: mismo CSS global + mismas secciones que el HTML original.
 *
 * Corre el reveal-on-scroll global (las landings de Maasy usan .reveal); en el editor
 * Puck fuerza .reveal visible para que no quede todo invisible al editar.
 */
export type RootRawProps = {
  meta: { title: string; description?: string }
  fontsHtml: string // los <link>/<style> de fonts del <head> original
  css: string // el contenido del <style> global de la landing
}

export const RootRaw: RootConfig<RootRawProps> = {
  fields: {
    meta: {
      type: 'object',
      objectFields: {
        title: { type: 'text' },
        description: { type: 'textarea' },
      },
    },
    fontsHtml: { type: 'textarea' },
    css: { type: 'textarea' },
  },
  defaultProps: { meta: { title: '', description: '' }, fontsHtml: '', css: '' },
  render: ({ fontsHtml, css, children, puck }) => {
    const isEditing = (puck as { isEditing?: boolean } | undefined)?.isEditing
    useEffect(() => {
      if (isEditing) return
      const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
        { threshold: 0.1 }
      )
      els.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }, [isEditing])
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: fontsHtml || '' }} />
        <style dangerouslySetInnerHTML={{ __html: css || '' }} />
        {/* En el editor, .reveal visible para no editar a ciegas */}
        {isEditing ? <style>{'.reveal{opacity:1!important;transform:none!important}'}</style> : null}
        {children}
      </>
    )
  },
}
