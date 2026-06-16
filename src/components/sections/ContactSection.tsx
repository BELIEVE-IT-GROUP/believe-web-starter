'use client'

/**
 * ContactSection (contact.custom): world-class craft.
 *
 * Asymmetric two-column: editorial contact context (eyebrow, headline, sub,
 * channels) on the left, a dynamic form rendered from fields[] on the right.
 * Client component: useState drives validation + a success state that replaces
 * the form in place. Required-field validation runs before "send".
 *
 * Imitates the approved Trust / Hero craft: strong type hierarchy, intentional
 * brand-color accents, an asymmetric grid that collapses cleanly on mobile.
 * Pure theme tokens (no Flowbite, no hardcoded hex except var() fallbacks).
 */

import { useId, useMemo, useState, type CSSProperties, type FormEvent } from 'react'

import { Container, Eyebrow } from './_primitives'
import type { BlockAppearance } from './types'

export interface ContactSectionFieldOption {
  label?: string
  value?: string
}

export interface ContactSectionField {
  fieldName?: string
  label?: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | string
  required?: boolean
  placeholder?: string
  options?: ContactSectionFieldOption[]
}

/** A reachable channel rendered alongside the form (email, phone, location). */
export interface ContactSectionChannel {
  label?: string
  value?: string
  href?: string
}

export interface ContactSectionProps {
  headline?: string
  subheadline?: string
  destinationEmail?: string
  successMessage?: string
  fields?: ContactSectionField[]
  appearance?: BlockAppearance
  // ── Optional craft fields (purely additive, never required) ───────────────
  /** Mono uppercase label above the headline. */
  eyebrow?: string
  /** Emphasized tail rendered in the brand color (Trust-style em). */
  headlineEmphasis?: string
  /** Label for the submit button. Defaults to a sensible Spanish CTA. */
  submitLabel?: string
  /** Small reassurance line under the submit button. */
  note?: string
  /** Reachable channels listed beside the form. */
  channels?: ContactSectionChannel[]
  /** Quiet ink panel instead of paper. */
  variant?: 'default' | 'ink'
}

// ─── Token helpers ────────────────────────────────────────────────────────────

const INK = 'var(--brand-ink, #1a1a1a)'
const PRIMARY = 'var(--color-primary, #0c3bb9)'

function inkAlpha(a: number, on: 'paper' | 'ink'): string {
  return on === 'ink'
    ? `rgb(255 255 255 / ${a})`
    : `rgb(from var(--brand-ink, #1a1a1a) r g b / ${a})`
}

const FIELD_BASE: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: '1rem',
  lineHeight: 1.4,
  padding: '0.875rem 1.05rem',
  borderRadius: 'var(--radius-input, 0.375rem)',
  outline: 'none',
  transition: 'border-color var(--transition-fast, 150ms) ease, box-shadow var(--transition-fast, 150ms) ease',
}

// ─── Field renderer ───────────────────────────────────────────────────────────

function Field({
  field,
  index,
  on,
  invalid,
}: {
  field: ContactSectionField
  index: number
  on: 'paper' | 'ink'
  invalid: boolean
}) {
  const reactId = useId()
  const name = field.fieldName?.trim() || `field_${index}`
  const id = `${reactId}-${name}`
  const errorId = `${id}-error`
  const type = field.type || 'text'
  const required = Boolean(field.required)
  const label = field.label?.trim() || name

  const borderCol = invalid ? PRIMARY : inkAlpha(on === 'ink' ? 0.18 : 0.14, on)
  const fieldStyle: CSSProperties = {
    ...FIELD_BASE,
    background: on === 'ink' ? inkAlpha(0.04, 'ink') : 'var(--brand-paper, #ffffff)',
    color: on === 'ink' ? 'var(--brand-paper, #fafaf7)' : INK,
    border: `1.5px solid ${borderCol}`,
    boxShadow: invalid ? `0 0 0 3px color-mix(in oklab, ${PRIMARY} 14%, transparent)` : 'none',
  }

  const labelStyle: CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-display, system-ui, sans-serif)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
    // AA: 0.7 alpha ink on paper drops below 4.5:1, bump to full ink (paper)
    // and a near-opaque white (ink) so labels clear normal-text contrast.
    color: on === 'ink' ? inkAlpha(0.92, 'ink') : INK,
    marginBottom: '0.45rem',
  }

  const isWide = type === 'textarea'

  let control
  if (type === 'textarea') {
    control = (
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder={field.placeholder || undefined}
        rows={5}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        style={{ ...fieldStyle, resize: 'vertical', minHeight: '7rem' }}
      />
    )
  } else if (type === 'select') {
    const options = (field.options ?? []).filter((o) => o && (o.value || o.label))
    control = (
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer' }}
      >
        <option value="" disabled>
          {field.placeholder || 'Selecciona una opcion'}
        </option>
        {options.map((o, i) => (
          <option key={i} value={o.value ?? o.label ?? ''}>
            {o.label ?? o.value ?? ''}
          </option>
        ))}
      </select>
    )
  } else {
    const inputType = type === 'email' || type === 'tel' ? type : 'text'
    control = (
      <input
        id={id}
        name={name}
        type={inputType}
        required={required}
        placeholder={field.placeholder || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        style={fieldStyle}
      />
    )
  }

  return (
    <div style={{ gridColumn: isWide ? '1 / -1' : undefined }}>
      <label htmlFor={id} style={labelStyle}>
        {label}
        {required ? (
          <span aria-hidden style={{ color: PRIMARY, marginLeft: '0.25rem' }}>
            *
          </span>
        ) : null}
      </label>
      {control}
      {invalid ? (
        <p
          id={errorId}
          style={{
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
            fontSize: '0.75rem',
            fontWeight: 500,
            lineHeight: 1.4,
            margin: '0.4rem 0 0',
            color: PRIMARY,
          }}
        >
          {required ? `Completa el campo ${label}.` : `Revisa el campo ${label}.`}
        </p>
      ) : null}
    </div>
  )
}

// ─── Default fields (graceful when fields[] is empty) ─────────────────────────

const DEFAULT_FIELDS: ContactSectionField[] = [
  { fieldName: 'name', label: 'Nombre', type: 'text', required: true, placeholder: 'Tu nombre' },
  { fieldName: 'email', label: 'Email', type: 'email', required: true, placeholder: 'tu@empresa.com' },
  { fieldName: 'message', label: 'Mensaje', type: 'textarea', required: true, placeholder: 'Contanos en que podemos ayudarte' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ContactSection({
  headline,
  subheadline,
  destinationEmail,
  successMessage,
  fields,
  appearance,
  eyebrow,
  headlineEmphasis,
  submitLabel,
  note,
  channels,
  variant = 'default',
}: ContactSectionProps) {
  const isDark = variant === 'ink'
  const on: 'paper' | 'ink' = isDark ? 'ink' : 'paper'

  const formFields = useMemo(() => {
    const provided = (fields ?? []).filter((f) => f && (f.fieldName || f.label))
    return provided.length ? provided : DEFAULT_FIELDS
  }, [fields])

  const [submitted, setSubmitted] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  // Names of the fields that actually failed validation, so we mark only those
  // (not every required field) as invalid.
  const [invalidNames, setInvalidNames] = useState<Set<string>>(() => new Set())

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      const failed = new Set<string>()
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(':invalid').forEach((el) => {
        if (el.name) failed.add(el.name)
      })
      setInvalidNames(failed)
      setShowErrors(true)
      const firstInvalid = form.querySelector<HTMLElement>(':invalid')
      firstInvalid?.focus()
      return
    }
    setInvalidNames(new Set())
    setSubmitted(true)
  }

  // ── Channels (email always surfaced if destinationEmail is set) ─────────────
  const resolvedChannels: ContactSectionChannel[] = useMemo(() => {
    const list = (channels ?? []).filter((c) => c && (c.value || c.label))
    if (destinationEmail && !list.some((c) => c.value === destinationEmail)) {
      list.unshift({ label: 'Email', value: destinationEmail, href: `mailto:${destinationEmail}` })
    }
    return list
  }, [channels, destinationEmail])

  const sectionStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: isDark ? 'var(--brand-ink, #0a0a0a)' : 'var(--brand-paper, #fafaf7)',
    color: isDark ? 'var(--brand-paper, #fafaf7)' : INK,
    paddingTop: 'var(--section-padding-y, 6rem)',
    paddingBottom: 'var(--section-padding-y, 6rem)',
  }

  const headlineStyle: CSSProperties = {
    fontFamily: 'var(--font-display, system-ui, sans-serif)',
    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
    fontWeight: 800,
    lineHeight: 1.04,
    letterSpacing: 'var(--tracking-tight, -0.02em)',
    margin: '0 0 1.25rem',
    color: isDark ? 'var(--brand-paper, #fafaf7)' : INK,
  }

  const subStyle: CSSProperties = {
    fontFamily: 'var(--font-body, system-ui, sans-serif)',
    fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
    lineHeight: 1.7,
    maxWidth: '30rem',
    margin: '0 0 2.5rem',
    // AA: lift alpha so body copy clears 4.5:1 on both paper and ink.
    color: inkAlpha(on === 'ink' ? 0.82 : 0.78, on),
  }

  return (
    <section id={appearance?.sectionId || undefined} style={sectionStyle} className={appearance?.customClassName}>
      {/* Soft brand glow, bottom-left (mirrors the Hero signature, no gradient text). */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-6%',
          width: 'min(40rem, 55vw)',
          height: 'min(40rem, 55vw)',
          background: `radial-gradient(ellipse, color-mix(in oklab, ${PRIMARY} 9%, transparent) 0%, transparent 64%)`,
          pointerEvents: 'none',
        }}
      />

      <Container
        size="xl"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1.15fr)',
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          alignItems: 'start',
        }}
        className="contact-two-col"
      >
        {/* ── Left: editorial context ─────────────────────────────────────── */}
        <div>
          {eyebrow ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          ) : null}

          {headline || headlineEmphasis ? (
            <h2 style={headlineStyle}>
              {headline}
              {headlineEmphasis ? (
                <>
                  {headline ? ' ' : null}
                  <em style={{ fontStyle: 'normal', color: PRIMARY }}>{headlineEmphasis}</em>
                </>
              ) : null}
            </h2>
          ) : null}

          {subheadline ? <p style={subStyle}>{subheadline}</p> : null}

          {resolvedChannels.length ? (
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                borderTop: `1px solid ${inkAlpha(on === 'ink' ? 0.1 : 0.1, on)}`,
              }}
            >
              {resolvedChannels.map((c, i) => {
                const labelNode = (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: PRIMARY,
                      minWidth: '5.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {c.label || 'Contacto'}
                  </span>
                )
                const valueStyle: CSSProperties = {
                  fontFamily: 'var(--font-body, system-ui, sans-serif)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: isDark ? 'var(--brand-paper, #fafaf7)' : INK,
                  textDecoration: 'none',
                  wordBreak: 'break-word',
                }
                return (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'baseline',
                      padding: '1rem 0',
                      borderBottom: `1px solid ${inkAlpha(on === 'ink' ? 0.1 : 0.1, on)}`,
                    }}
                  >
                    {labelNode}
                    {c.href ? (
                      <a href={c.href} style={valueStyle}>
                        {c.value || c.href}
                      </a>
                    ) : (
                      <span style={valueStyle}>{c.value}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>

        {/* ── Right: form or success ──────────────────────────────────────── */}
        <div
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            borderRadius: 'var(--radius-card, 0.5rem)',
            background: isDark ? inkAlpha(0.04, 'ink') : 'var(--brand-paper, #ffffff)',
            border: `1px solid ${inkAlpha(0.08, on)}`,
            boxShadow: isDark ? 'none' : 'var(--shadow-lg, 0 4px 16px rgba(0,0,0,0.1))',
          }}
        >
          {submitted ? (
            <div role="status" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span
                aria-hidden
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: 'var(--radius-full, 9999px)',
                  background: `color-mix(in oklab, ${PRIMARY} 12%, transparent)`,
                  color: PRIMARY,
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                &#10003;
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-display, system-ui, sans-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  margin: '0.5rem 0 0',
                  color: isDark ? 'var(--brand-paper, #fafaf7)' : INK,
                }}
              >
                {successMessage || 'Recibido. Te contactamos muy pronto.'}
              </p>
              <p style={{ fontSize: '0.875rem', color: inkAlpha(on === 'ink' ? 0.82 : 0.78, on), margin: 0, lineHeight: 1.6 }}>
                Revisa tu bandeja de entrada (y la de spam, por si acaso).
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '1.1rem',
                }}
                className="contact-field-grid"
              >
                {formFields.map((f, i) => {
                  const fieldName = f.fieldName?.trim() || `field_${i}`
                  return (
                    <Field
                      key={f.fieldName || i}
                      field={f}
                      index={i}
                      on={on}
                      invalid={showErrors && invalidNames.has(fieldName)}
                    />
                  )
                })}
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '1.6rem',
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-display, system-ui, sans-serif)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  padding: '1.05rem 1.75rem',
                  borderRadius: 'var(--radius-button, 0.375rem)',
                  border: '2px solid transparent',
                  background: PRIMARY,
                  color: 'var(--color-on-primary, #ffffff)',
                  boxShadow: 'var(--shadow-button, none)',
                  cursor: 'pointer',
                  transition: 'opacity var(--transition-fast, 150ms) ease',
                }}
              >
                {submitLabel || 'Enviar mensaje'}
                <span aria-hidden>&rarr;</span>
              </button>

              <p
                aria-live="polite"
                style={{
                  margin: '0.9rem 0 0',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  // AA: 0.5 alpha failed normal-text contrast, lift to clear 4.5:1.
                  color: showErrors ? PRIMARY : inkAlpha(on === 'ink' ? 0.82 : 0.78, on),
                }}
              >
                {showErrors
                  ? 'Revisa los campos marcados antes de enviar.'
                  : note || 'Tus datos quedan privados. Sin spam, sin compromiso.'}
              </p>
            </form>
          )}
        </div>
      </Container>

      {/* Collapse the asymmetric grid + paired fields on small screens. */}
      <style>{`
        @media (max-width: 860px) {
          .contact-two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .contact-field-grid { grid-template-columns: 1fr !important; }
        }
        .contact-two-col :is(input, textarea)::placeholder {
          color: ${inkAlpha(on === 'ink' ? 0.78 : 0.74, on)};
          opacity: 1;
        }
        .contact-two-col :is(input, textarea, select):focus-visible {
          border-color: ${PRIMARY} !important;
          box-shadow: 0 0 0 3px color-mix(in oklab, ${PRIMARY} 18%, transparent) !important;
        }
        .contact-two-col a:focus-visible,
        .contact-two-col button:focus-visible {
          outline: 2px solid ${PRIMARY};
          outline-offset: 3px;
        }
      `}</style>
    </section>
  )
}
