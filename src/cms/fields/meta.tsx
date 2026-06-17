/**
 * Campo SEO/metadata estándar para el Root de CUALQUIER block set.
 * Transversal (todo sitio lo necesita): title, description, favicon, ogImage.
 * generateMetadata (en /s/[tenant]) lo lee de root.props.meta y lo emite al <head>.
 *
 * Uso en un Root:  fields: { meta: metaField(), ...resto }
 *                  type RootProps = { meta?: MetaProps; ... }
 */
import { imageField } from './image'

export type MetaProps = {
  title?: string
  description?: string
  favicon?: string
  ogImage?: string
}

export function metaField() {
  return {
    type: 'object' as const,
    label: 'SEO / Metadata',
    objectFields: {
      title: { type: 'text' as const },
      description: { type: 'textarea' as const },
      favicon: imageField('Favicon'),
      ogImage: imageField('Imagen para compartir (OG)'),
    },
  }
}
