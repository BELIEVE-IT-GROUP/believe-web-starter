import type { ComponentConfig } from '@measured/puck'

/**
 * Bloque genérico: renderiza el HTML VERBATIM de UNA sección de la landing.
 *
 * NO reconstruye nada (esto NO es Flowbite, ver POSTMORTEM.md): muestra el HTML
 * tal cual lo generó Maasy, con fidelidad perfecta, y lo hace editable. Una landing
 * entera = N de estos bloques + el CSS global en el Root. CERO código a medida por
 * landing, CERO rebuild del CMS: el bloque se compila UNA vez y lo reusan todas.
 */
export type RawSectionProps = { html: string; label?: string }

export const RawSection: ComponentConfig<RawSectionProps> = {
  label: 'Sección (HTML)',
  fields: {
    label: { type: 'text' },
    // El editor de texto alcanza para el primer cierre (editás el HTML de la sección).
    // Más adelante se pueden extraer campos finos sin tocar este contrato.
    html: { type: 'textarea' },
  },
  defaultProps: { html: '<section>(vacío)</section>', label: 'Sección' },
  render: ({ html }) => <div dangerouslySetInnerHTML={{ __html: html || '' }} />,
}
