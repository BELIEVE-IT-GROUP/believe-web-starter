'use client'
import { useEffect } from 'react'
import type { RootConfig } from '@measured/puck'
import { imageField } from '@/cms/fields/image'

/**
 * Root genérico del blockSet 'raw'. Inyecta las fonts (<link>) + el <style> global
 * VERBATIM del HTML de Maasy, y renderiza las secciones (RawSection) como children.
 * Fidelidad perfecta: mismo CSS global + mismas secciones que el HTML original.
 *
 * Corre el reveal-on-scroll global (las landings de Maasy usan .reveal); en el editor
 * Puck fuerza .reveal visible para que no quede todo invisible al editar.
 */
export type RootRawProps = {
  meta: {
    title: string
    description?: string
    ogImage?: string
    canonical?: string
    robots?: 'index' | 'noindex'
    jsonLd?: string
    llmsTxt?: string
  }
  fontsHtml: string // los <link>/<style> de fonts del <head> original
  css: string // el contenido del <style> global de la landing
}

export const RootRaw: RootConfig<RootRawProps> = {
  fields: {
    meta: {
      type: 'object',
      label: 'SEO · Meta',
      objectFields: {
        title: { type: 'text', label: 'Título (SEO / <title>)' },
        description: { type: 'textarea', label: 'Meta description' },
        ogImage: imageField('OG image — subir o pegar URL (vacío = imagen auto on-brand)'),
        canonical: { type: 'text', label: 'URL canónica (vacío = automática)' },
        robots: {
          type: 'radio',
          label: 'Indexación',
          options: [
            { label: 'Indexar (público)', value: 'index' },
            { label: 'No indexar', value: 'noindex' },
          ],
        },
        jsonLd: { type: 'textarea', label: 'JSON-LD (vacío = auto). Schema.org para buscadores y agentes' },
        llmsTxt: { type: 'textarea', label: 'llms.txt (vacío = auto). Resumen agent-readable del sitio' },
      },
    },
    fontsHtml: { type: 'textarea', label: 'Avanzado · Fuentes (<link>/<style> del head)' },
    css: { type: 'textarea', label: 'Avanzado · CSS global de la landing' },
  },
  defaultProps: { meta: { title: '', description: '', robots: 'index' }, fontsHtml: '', css: '' },
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
