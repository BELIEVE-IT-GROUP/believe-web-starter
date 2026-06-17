'use client'
/**
 * Helpers de campos Puck reutilizables para los bloques birdman.
 *
 * stringList: edita un `string[]` como textarea (un item por linea) sin cambiar
 * la forma del dato ni el render. Puck no tiene array-de-primitivos nativo, asi
 * que usamos un campo 'custom' con round-trip join('\n') <-> split('\n').
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
