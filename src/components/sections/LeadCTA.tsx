'use client'

/**
 * LeadCTA (cta.custom): world-class craft, ports trust-demo quality.
 *
 * Two variants:
 *   banner: paper background, asymmetric (copy left, CTAs right). Quiet, editorial.
 *   form:   primary-color band with an inline lead form. useState success state,
 *           no backend (preventDefault + local success). Mirrors the trust-demo
 *           final CTA: bold color field, dark high-contrast submit.
 *
 * Client component (the form needs local state). The banner variant still works
 * here as a client component, it just renders no interactive form.
 */

import { useId, useState, type CSSProperties, type FormEvent } from 'react'

import { Button, Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance, CtaLink } from './types'

export interface LeadCTAFormField {
  fieldName?: string
  label?: string
  type?: string
  required?: boolean
  placeholder?: string
}

export interface LeadCTAProps {
  eyebrow?: string
  headline?: string
  subheadline?: string
  variant?: 'banner' | 'form'
  ctas?: CtaLink[]
  formEnabled?: boolean
  formFields?: LeadCTAFormField[]
  formDestinationEmail?: string
  /** Optional copy shown under the form (privacy reassurance, etc). */
  formNote?: string
  /** Optional headline for the post-submit success card. */
  successTitle?: string
  /** Optional body for the post-submit success card. */
  successBody?: string
  appearance?: BlockAppearance
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ctaText(c: CtaLink): string {
  return c.text ?? c.label ?? ''
}

const DEFAULT_FORM_FIELDS: LeadCTAFormField[] = [
  { fieldName: 'name', label: 'Nombre', type: 'text', required: true, placeholder: 'Tu nombre' },
  { fieldName: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Email de trabajo' },
]

const HEADLINE_BASE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  lineHeight: 1.04,
  letterSpacing: 'var(--tracking-tight, -0.02em)',
  margin: 0,
}

const SUBHEAD_BASE: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
  lineHeight: 1.7,
  margin: 0,
}

// ─── Form variant (interactive) ───────────────────────────────────────────────

function LeadForm({
  fields,
  note,
  submitLabel,
  successTitle,
  successBody,
}: {
  fields: LeadCTAFormField[]
  note?: string
  submitLabel: string
  successTitle: string
  successBody: string
}) {
  const [sent, setSent] = useState(false)
  const formId = useId()

  if (sent) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          maxWidth: '30rem',
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-card, 0.5rem)',
          background: 'var(--brand-ink, #0a0a0a)',
          color: 'var(--brand-paper, #ffffff)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontWeight: 700,
            fontSize: '1.1875rem',
            lineHeight: 1.25,
            margin: '0 0 0.5rem',
          }}
        >
          {successTitle}
        </p>
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'rgb(255 255 255 / 0.62)', margin: 0 }}>
          {successBody}
        </p>
      </div>
    )
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  // Contrast tokens for inputs sitting on the primary-color band.
  const onPrimary = 'var(--color-on-primary, #ffffff)'
  const fieldBorder = 'rgb(255 255 255 / 0.28)'

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '30rem', width: '100%' }}
    >
      {fields.map((f, i) => {
        const id = `${formId}-${f.fieldName || i}`
        const type = (f.type || 'text').toLowerCase()
        const label = f.label || f.placeholder || f.fieldName || `Campo ${i + 1}`
        const isTextarea = type === 'textarea'

        const fieldStyle: CSSProperties = {
          width: '100%',
          boxSizing: 'border-box',
          padding: '0.9375rem 1.125rem',
          fontSize: '1rem',
          fontFamily: 'var(--font-body, system-ui, sans-serif)',
          color: onPrimary,
          background: 'rgb(255 255 255 / 0.08)',
          border: `1.5px solid ${fieldBorder}`,
          borderRadius: 'var(--radius-input, 0.375rem)',
          outline: 'none',
          transition: 'border-color var(--transition-fast, 150ms) ease, background-color 150ms ease',
        }

        return (
          <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label
              htmlFor={id}
              style={{
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgb(255 255 255 / 0.78)',
              }}
            >
              {label}
              {f.required ? <span aria-hidden style={{ marginLeft: '0.25rem' }}>*</span> : null}
            </label>
            {isTextarea ? (
              <textarea
                id={id}
                name={f.fieldName || id}
                required={f.required}
                placeholder={f.placeholder}
                rows={4}
                style={{ ...fieldStyle, resize: 'vertical', minHeight: '6rem' }}
              />
            ) : (
              <input
                id={id}
                name={f.fieldName || id}
                type={type}
                required={f.required}
                placeholder={f.placeholder}
                style={fieldStyle}
              />
            )}
          </div>
        )
      })}

      <Button variant="ink" style={{ marginTop: '0.375rem', width: '100%', padding: '1.0625rem 2rem' }}>
        {submitLabel}
        <span aria-hidden>&rarr;</span>
      </Button>

      {note ? (
        <p style={{ fontSize: '0.8125rem', lineHeight: 1.5, color: 'rgb(255 255 255 / 0.66)', margin: '0.25rem 0 0' }}>
          {note}
        </p>
      ) : null}

      {/* Focus + placeholder styling for the on-primary inputs (no hardcoded brand hex). */}
      <style>{`
        form input::placeholder, form textarea::placeholder { color: rgb(255 255 255 / 0.5); }
        form input:focus-visible, form textarea:focus-visible {
          border-color: var(--color-on-primary, #ffffff);
          background: rgb(255 255 255 / 0.14);
          outline: 2px solid var(--color-on-primary, #ffffff);
          outline-offset: 2px;
        }
        form button:focus-visible {
          outline: 2px solid var(--color-on-primary, #ffffff);
          outline-offset: 3px;
        }
      `}</style>
    </form>
  )
}

// ─── Variant: form (primary band) ─────────────────────────────────────────────

function FormVariant({
  eyebrow,
  headline,
  subheadline,
  fields,
  note,
  submitLabel,
  successTitle,
  successBody,
  appearance,
}: {
  eyebrow?: string
  headline?: string
  subheadline?: string
  fields: LeadCTAFormField[]
  note?: string
  submitLabel: string
  successTitle: string
  successBody: string
  appearance?: BlockAppearance
}) {
  const onPrimary = 'var(--color-on-primary, #ffffff)'

  return (
    <Section appearance={appearance} background="primary" style={{ overflow: 'hidden' }}>
      {/* Soft inner glow, bottom-left, to break the flat band (Trust signature). */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: '-10%',
          bottom: '-30%',
          width: 'min(40rem, 55vw)',
          height: 'min(40rem, 55vw)',
          background: 'radial-gradient(ellipse, rgb(255 255 255 / 0.10) 0%, transparent 62%)',
          pointerEvents: 'none',
        }}
      />
      <Container
        size="lg"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.95fr)',
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          alignItems: 'center',
        }}
        className="leadcta-form-grid"
      >
        <div>
          {eyebrow ? (
            <div style={{ marginBottom: '1.25rem' }}>
              <p
                className="inline-flex items-center gap-3"
                style={{
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  fontSize: 'var(--text-eyebrow, 0.72rem)',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-wide, 0.2em)',
                  textTransform: 'uppercase',
                  color: onPrimary,
                  margin: 0,
                  opacity: 0.85,
                }}
              >
                <span
                  aria-hidden
                  style={{ display: 'inline-block', width: '1.75rem', height: '2px', flexShrink: 0, background: onPrimary, opacity: 0.6 }}
                />
                <span>{eyebrow}</span>
              </p>
            </div>
          ) : null}
          {headline ? (
            <h2 style={{ ...HEADLINE_BASE, fontSize: 'clamp(1.875rem, 4vw, 3rem)', color: onPrimary, marginBottom: subheadline ? '1.25rem' : 0 }}>
              {headline}
            </h2>
          ) : null}
          {subheadline ? (
            <p style={{ ...SUBHEAD_BASE, maxWidth: '34rem', color: 'rgb(255 255 255 / 0.82)' }}>{subheadline}</p>
          ) : null}
        </div>

        <div style={{ justifySelf: 'end', width: '100%' }} className="leadcta-form-col">
          <LeadForm
            fields={fields}
            note={note}
            submitLabel={submitLabel}
            successTitle={successTitle}
            successBody={successBody}
          />
        </div>
      </Container>

      <style>{`
        @media (max-width: 820px) {
          .leadcta-form-grid { grid-template-columns: 1fr !important; gap: 2.25rem !important; }
          .leadcta-form-col { justify-self: stretch !important; }
        }
      `}</style>
    </Section>
  )
}

// ─── Variant: banner (paper, asymmetric) ──────────────────────────────────────

function BannerVariant({
  eyebrow,
  headline,
  subheadline,
  ctas,
  appearance,
}: {
  eyebrow?: string
  headline?: string
  subheadline?: string
  ctas: CtaLink[]
  appearance?: BlockAppearance
}) {
  const subColor = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.62)'

  return (
    <Section appearance={appearance} background="paper" style={{ overflow: 'hidden' }}>
      {/* Quiet brand glow, right edge. */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          right: '-10%',
          transform: 'translateY(-50%)',
          width: 'min(38rem, 50vw)',
          height: 'min(38rem, 50vw)',
          background: 'radial-gradient(ellipse, color-mix(in oklab, var(--color-primary, #0c3bb9) 9%, transparent) 0%, transparent 62%)',
          pointerEvents: 'none',
        }}
      />
      <Container
        size="xl"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 0.85fr)',
          gap: 'clamp(2rem, 5vw, 4.5rem)',
          alignItems: 'center',
        }}
        className="leadcta-banner-grid"
      >
        <div>
          {eyebrow ? (
            <div style={{ marginBottom: '1.25rem' }}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          ) : null}
          {headline ? (
            <h2 style={{ ...HEADLINE_BASE, fontSize: 'clamp(1.875rem, 3.6vw, 2.875rem)', color: 'var(--brand-ink, #1a1a1a)', marginBottom: subheadline ? '1rem' : 0 }}>
              {headline}
            </h2>
          ) : null}
          {subheadline ? (
            <p style={{ ...SUBHEAD_BASE, maxWidth: '38rem', color: subColor }}>{subheadline}</p>
          ) : null}
        </div>

        {ctas.length ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.875rem' }}
            className="leadcta-banner-ctas"
          >
            {ctas.map((c, i) => {
              const primary = i === 0 && c.style !== 'secondary' && c.style !== 'outline' && c.style !== 'ghost'
              return (
                <Button
                  key={i}
                  href={c.url || '#'}
                  variant={primary ? 'primary' : 'outline'}
                  on="paper"
                  style={{ width: '100%' }}
                >
                  {ctaText(c)}
                  {primary ? <span aria-hidden>&rarr;</span> : null}
                </Button>
              )
            })}
          </div>
        ) : null}
      </Container>

      <style>{`
        @media (max-width: 760px) {
          .leadcta-banner-grid { grid-template-columns: 1fr !important; gap: 1.75rem !important; }
          .leadcta-banner-ctas { align-items: stretch !important; }
        }
      `}</style>
    </Section>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function LeadCTA({
  eyebrow,
  headline,
  subheadline,
  variant = 'banner',
  ctas = [],
  formEnabled,
  formFields,
  formNote,
  successTitle,
  successBody,
  appearance,
}: LeadCTAProps) {
  const safeCtas = (ctas ?? []).filter((c) => ctaText(c))

  // The form variant renders the form when explicitly enabled OR when the
  // variant itself is 'form' (sensible default so the band is never empty).
  const showForm = variant === 'form' && formEnabled !== false

  if (showForm) {
    const provided = (formFields ?? []).filter((f) => f.fieldName || f.label || f.placeholder)
    const fields = provided.length ? provided : DEFAULT_FORM_FIELDS
    const submitLabel = ctaText(safeCtas[0]) || 'Enviar'
    return (
      <FormVariant
        eyebrow={eyebrow}
        headline={headline}
        subheadline={subheadline}
        fields={fields}
        note={formNote}
        submitLabel={submitLabel}
        successTitle={successTitle || 'Recibido. Te contactamos pronto.'}
        successBody={successBody || 'Revisa tu bandeja de entrada en las próximas horas (y la carpeta de spam, por si acaso).'}
        appearance={appearance}
      />
    )
  }

  // Default + banner. Nothing to show? Render nothing rather than an empty band.
  if (!eyebrow && !headline && !subheadline && !safeCtas.length) return null

  return (
    <BannerVariant
      eyebrow={eyebrow}
      headline={headline}
      subheadline={subheadline}
      ctas={safeCtas}
      appearance={appearance}
    />
  )
}
