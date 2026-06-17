/**
 * Helpers de campos Puck para los bloques NeuroRealidad.
 *
 * stringList: edita un `string[]` como textarea (un item por linea) sin cambiar
 * la forma del dato ni el render. Copia local (sin 'use client') del helper de
 * birdman: la factory debe ser una funcion real en el grafo del server component
 * (admin/[tenant]/[slug]/page.tsx la alcanza via registry). El `render` solo se
 * invoca dentro del editor Puck, que ya es client.
 */
import type { Field } from '@measured/puck'

export function stringList(itemLabel = 'item'): Field {
  return {
    type: 'custom',
    render: ({ value, onChange }: { value?: string[]; onChange: (v: string[]) => void }) => (
      <textarea
        value={(value || []).join('\n')}
        onChange={(e) => onChange(e.currentTarget.value.split('\n'))}
        rows={Math.max(3, (value || []).length + 1)}
        placeholder={`Un ${itemLabel} por linea`}
        style={{ width: '100%', fontFamily: 'inherit', fontSize: 14, padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
      />
    ),
  } as Field
}
