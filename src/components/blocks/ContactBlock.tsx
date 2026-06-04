'use client'

import { Button, Label, Select, Textarea, TextInput } from 'flowbite-react'
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
    <section {...getSectionProps(appearance, { background: 'bg-white dark:bg-gray-900' })}>
      <div className={getContainerClassName(appearance)}>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            {headline && <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">{headline}</h2>}
            {subheadline && <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">{subheadline}</p>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {fields.map((field, i) => {
                const name = field.fieldName || field.name || `field_${i}`
                return (
                  <div key={name}>
                    <Label htmlFor={name} value={`${field.label}${field.required ? ' *' : ''}`} />
                    {field.type === 'textarea' ? (
                      <Textarea id={name} name={name} required={field.required} rows={5} placeholder={field.placeholder} />
                    ) : field.type === 'select' ? (
                      <Select id={name} name={name} required={field.required}>
                        {field.placeholder && <option value="">{field.placeholder}</option>}
                        {field.options?.map((option, optionIndex) => (
                          <option key={`${option.value}-${optionIndex}`} value={option.value || option.label || ''}>
                            {option.label || option.value}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <TextInput id={name} name={name} type={field.type || 'text'} required={field.required} placeholder={field.placeholder} />
                    )}
                  </div>
                )
              })}
              <Button type="submit" color="info" isProcessing={status === 'loading'}>
                Enviar mensaje
              </Button>
              {status === 'success' && <p className="text-sm text-green-600">{successMessage || 'Mensaje enviado.'}</p>}
              {status === 'error' && <p className="text-sm text-red-600">No se pudo enviar. Intentá de nuevo.</p>}
            </form>
          </div>
          {showMap && mapUrl && (
            <div className="overflow-hidden rounded-lg">
              <iframe src={mapUrl} className="h-full min-h-[400px] w-full" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
