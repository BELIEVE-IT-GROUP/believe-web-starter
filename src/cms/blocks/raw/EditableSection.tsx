import type { ComponentConfig } from '@measured/puck'

/**
 * Bloque editable por CAMPOS (no por HTML). El troceador extrae de cada sección
 * los textos e imágenes y deja el markup como `template` con marcadores {{t0}},
 * {{i0}}. El editor (Puck) muestra los textos como campos amigables ("Título: ...")
 * y las imágenes como campos de URL/upload. El render vuelve a meter los valores
 * en el template -> fidelidad perfecta, editable por cualquier persona, sin código.
 */
type Txt = { label: string; value: string }
type Img = { alt: string; src: string }
export type EditableSectionProps = { label?: string; template: string; texts: Txt[]; images: Img[] }

export const EditableSection: ComponentConfig<EditableSectionProps> = {
  label: 'Sección',
  fields: {
    texts: {
      type: 'array',
      arrayFields: { label: { type: 'text' }, value: { type: 'textarea' } },
      getItemSummary: (it: Partial<Txt>) =>
        it?.label ? `${it.label}: ${(it.value || '').slice(0, 32)}` : 'Texto',
    },
    images: {
      type: 'array',
      arrayFields: { alt: { type: 'text' }, src: { type: 'text' } },
      getItemSummary: (it: Partial<Img>) => it?.alt || 'Imagen',
    },
    // Markup de la sección con marcadores. Editable solo por devs; las personas
    // normales tocan 'texts'/'images'.
    template: { type: 'textarea' },
  } as never,
  defaultProps: { label: 'Sección', template: '', texts: [], images: [] },
  render: ({ template, texts, images }) => {
    let html = template || ''
    ;(texts || []).forEach((t, i) => {
      html = html.split(`{{t${i}}}`).join(t?.value ?? '')
    })
    ;(images || []).forEach((m, i) => {
      html = html.split(`{{i${i}}}`).join(m?.src ?? '')
    })
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  },
}
