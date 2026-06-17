'use client'
/**
 * Custom field de imagen reutilizable para cualquier block set Puck.
 * Sube a /api/cms/upload (R2) y guarda la URL pública, o permite pegar una URL.
 * Uso en un config:  fields: { src: imageField('Imagen del hero') }
 */
import { useState } from 'react'
import { FieldLabel } from '@measured/puck'

type CustomFieldRenderProps = {
  value?: string
  onChange: (value: string) => void
  field?: { label?: string }
}

function ImageInput({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (v: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/cms/upload', { method: 'POST', body: fd, credentials: 'include' })
      const j = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !j.url) throw new Error(j.error || `error ${res.status}`)
      onChange(j.url)
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <FieldLabel label={label}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {value ? (
          <img
            src={value}
            alt=""
            style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 6 }}
          />
        ) : null}
        <input type="file" accept="image/*" onChange={handleFile} disabled={busy} />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder="o pegá una URL"
          style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6, fontSize: 12 }}
        />
        {busy ? <span style={{ fontSize: 12, color: '#888' }}>Subiendo…</span> : null}
        {err ? <span style={{ fontSize: 12, color: '#c00' }}>{err}</span> : null}
      </div>
    </FieldLabel>
  )
}

/** Devuelve un custom field Puck de imagen (con upload a R2 + pegar URL). */
export function imageField(label = 'Imagen') {
  return {
    type: 'custom' as const,
    label,
    render: ({ value, onChange, field }: CustomFieldRenderProps) => (
      <ImageInput label={field?.label || label} value={value} onChange={onChange} />
    ),
  }
}
