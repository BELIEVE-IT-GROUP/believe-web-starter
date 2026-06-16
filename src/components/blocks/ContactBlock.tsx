'use client'

import { Label, Select, Textarea, TextInput } from 'flowbite-react'
import { useState } from 'react'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

type ContactField = {
  fieldName?: string
  name?: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  options?: { label?: string; value?: string }[]
}

export function ContactBlock(props: {
  headline?: string
  subheadline?: string
  destinationEmail?: string
  successMessage?: string
  fields?: ContactField[]
  formFields?: ContactField[]
  showMap?: boolean
  mapUrl?: string
  appearance?: BlockAppearance
}) {
  const { headline, subheadline, destinationEmail, successMessage, showMap, mapUrl, appearance } = props
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const fields = props.fields?.length
    ? props.fields
    : props.formFields?.length
    ? props.formFields
    : [
        { label: 'Nombre', fieldName: 'name', type: 'text', required: true },
        { label: 'Email', fieldName: 'email', type: 'email', required: true },
        { label: 'Mensaje', fieldName: 'message', type: 'textarea', required: true },
      ]

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, destinationEmail }),
    })

    setStatus(res.ok ? 'success' : 'error')
    if (res.ok) event.currentTarget.reset()
  }

  return (
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow mb-6 inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-400" aria-hidden="true" />
              Contacto
            </span>
            {headline && (
              <h2 className="font-display mb-4 text-balance text-3xl font-medium leading-tight tracking-tight text-ink-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="mb-8 text-lg leading-relaxed text-ink-500">{subheadline}</p>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {fields.map((field, i) => {
                const name = field.fieldName || field.name || `field_${i}`
                return (
                  <div key={name} className="space-y-1.5">
                    <Label
                      htmlFor={name}
                      value={`${field.label}${field.required ? ' *' : ''}`}
                      className="text-sm font-medium text-ink-900"
                    />
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={name}
                        name={name}
                        required={field.required}
                        rows={5}
                        placeholder={field.placeholder}
                        className="rounded-lg border border-ink-900/15 bg-paper text-ink-900 placeholder-ink-500/60 focus:ring-1 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                      />
                    ) : field.type === 'select' ? (
                      <Select
                        id={name}
                        name={name}
                        required={field.required}
                        className="rounded-lg border border-ink-900/15 bg-paper text-ink-900 focus:ring-1 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                      >
                        {field.placeholder && <option value="">{field.placeholder}</option>}
                        {field.options?.map((option, optionIndex) => (
                          <option key={`${option.value}-${optionIndex}`} value={option.value || option.label || ''}>
                            {option.label || option.value}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <TextInput
                        id={name}
                        name={name}
                        type={field.type || 'text'}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="rounded-lg border border-ink-900/15 bg-paper text-ink-900 placeholder-ink-500/60 focus:ring-1 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                      />
                    )}
                  </div>
                )
              })}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-7 py-3.5 text-base font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--btn-radius, 6px)' }}
              >
                {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
              </button>
              {status === 'success' && (
                <p className="text-sm" style={{ color: 'var(--color-primary)' }}>{successMessage || 'Mensaje enviado.'}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-ink-500">No se pudo enviar. Intentá de nuevo.</p>
              )}
            </form>
          </div>
          {showMap && mapUrl && (
            <div className="overflow-hidden rounded-xl border border-ink-900/10">
              <iframe
                src={mapUrl}
                className="h-full min-h-[400px] w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
