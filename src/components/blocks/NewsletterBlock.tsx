'use client'

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
    <section {...getSectionProps(appearance, { background: 'bg-paper' })}>
      <div className={getContainerClassName(appearance)}>
        <div
          className={`${
            isInline
              ? 'flex flex-col items-center justify-between gap-8 md:flex-row'
              : 'text-center'
          }`}
        >
          <div className={isInline ? '' : 'mx-auto max-w-2xl'}>
            {headline && (
              <h2 className="font-display mb-4 text-balance text-3xl font-medium leading-tight tracking-tight text-ink-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="text-lg leading-relaxed text-ink-500">{subheadline}</p>
            )}
          </div>
          <form
            className={`w-full ${isInline ? 'md:w-auto' : 'mx-auto mt-8 max-w-md'}`}
            onSubmit={handleSubmit}
          >
            <div className="flex gap-2">
              <input
                name="email"
                type="email"
                placeholder={placeholder}
                required
                className="flex-1 rounded-lg border border-ink-900/15 bg-paper px-4 py-3 text-base text-ink-900 placeholder-ink-500/60 outline-none transition-colors focus:border-believe-700"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-full bg-believe-700 px-6 py-3 text-base font-medium text-paper transition-colors hover:bg-believe-900 disabled:opacity-60"
              >
                {status === 'loading' ? '…' : ctaText}
              </button>
            </div>
            {status === 'success' && (
              <p className="mt-3 text-sm text-believe-700">{successMessage}</p>
            )}
            {status === 'error' && (
              <p className="mt-3 text-sm text-ink-500">No se pudo suscribir. Intentá de nuevo.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
