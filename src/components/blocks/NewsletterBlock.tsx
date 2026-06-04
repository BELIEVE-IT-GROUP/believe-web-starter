'use client'

import { Button, TextInput } from 'flowbite-react'
import { useState } from 'react'

import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

export function NewsletterBlock(props: {
  headline?: string
  subheadline?: string
  placeholder?: string
  ctaText?: string
  successMessage?: string
  listId?: string
  destinationEmail?: string
  variant?: string
  appearance?: BlockAppearance
}) {
  const {
    headline,
    subheadline,
    placeholder = 'tu@email.com',
    ctaText = 'Suscribirse',
    successMessage = '¡Suscrito! Gracias.',
    listId,
    destinationEmail,
    variant = 'default',
    appearance,
  } = props
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const isInline = variant === 'inline' || props.variant === 'newsletter.banner'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '')

    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, listId, destinationEmail }),
    })

    setStatus(res.ok ? 'success' : 'error')
    if (res.ok) event.currentTarget.reset()
  }

  return (
    <section {...getSectionProps(appearance, { background: 'bg-primary-600 dark:bg-gray-900' })}>
      <div className={getContainerClassName(appearance)}>
        <div className={`${isInline ? 'flex flex-col items-center justify-between gap-8 md:flex-row' : 'text-center'}`}>
          <div className={isInline ? '' : 'mx-auto max-w-2xl'}>
            {headline && <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{headline}</h2>}
            {subheadline && <p className="text-lg text-primary-100">{subheadline}</p>}
          </div>
          <form className={`w-full ${isInline ? 'md:w-auto' : 'mx-auto mt-8 max-w-md'}`} onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <TextInput name="email" type="email" placeholder={placeholder} required className="flex-1" />
              <Button type="submit" color="light" isProcessing={status === 'loading'}>
                {ctaText}
              </Button>
            </div>
            {status === 'success' && <p className="mt-3 text-sm text-white">{successMessage}</p>}
            {status === 'error' && <p className="mt-3 text-sm text-red-100">No se pudo suscribir. Intentá de nuevo.</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
