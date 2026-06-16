'use client'

/**
 * NewsletterBar: newsletter.custom
 *
 * Compact band: asymmetric two-column layout on wide screens (copy left,
 * form right), stacking gracefully at mobile. Uses useState for success
 * state (no backend, e.preventDefault). Client component by necessity.
 *
 * Design decisions:
 *   - ink background with a subtle primary glow (Trust-pattern, not hero)
 *   - Left column: eyebrow rule + headline + subheadline, tighter than hero
 *   - Right column: inline email row (input + button) with success overlay
 *   - No side-stripe border decoration, no gradient text, no glassmorphism
 *   - Spacing is denser than a full section (py-sm = 0.5x section-padding-y)
 *   - Typography ratio: headline ~2rem, subheadline ~1rem = ratio > 1.9
 */

import { useState, type FormEvent, type CSSProperties } from 'react'

import type { BlockAppearance } from './types'
import { Container, Eyebrow, Section } from './_primitives'

export interface NewsletterBarProps {
  headline?: string
  subheadline?: string
  placeholder?: string
  ctaText?: string
  successMessage?: string
  /** destinationEmail: unused in this no-backend stub, reserved for future mailto/API */
  destinationEmail?: string
  appearance?: BlockAppearance
}

// ─── Style constants ──────────────────────────────────────────────────────────

const HEADLINE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontSize: 'clamp(1.5rem, 2.8vw, 2.125rem)',
  fontWeight: 800,
  lineHeight: 1.08,
  letterSpacing: 'var(--tracking-tight, -0.015em)',
  color: 'var(--brand-paper, #fafaf7)',
  margin: '0 0 0.625rem',
}

const SUBHEADLINE: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(0.9rem, 1.2vw, 1.0625rem)',
  lineHeight: 1.65,
  color: 'color-mix(in oklab, var(--brand-paper, #fafaf7) 58%, transparent)',
  margin: 0,
  maxWidth: '32rem',
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-input, 0.375rem)',
        background: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 22%, transparent)',
        border: '1px solid color-mix(in oklab, var(--color-primary, #0c3bb9) 40%, transparent)',
      }}
    >
      {/* Checkmark icon (SVG, no emoji dependency) */}
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <circle cx="10" cy="10" r="9" stroke="var(--color-accent, #00aaff)" strokeWidth="1.5" />
        <path
          d="M6.5 10.25L8.75 12.5L13.5 7.5"
          stroke="var(--color-accent, #00aaff)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-body, system-ui, sans-serif)',
          fontSize: '0.9375rem',
          color: 'var(--brand-paper, #fafaf7)',
          lineHeight: 1.5,
        }}
      >
        {message}
      </span>
    </div>
  )
}

// ─── Email form row ───────────────────────────────────────────────────────────

function EmailForm({
  placeholder,
  ctaText,
  onSuccess,
}: {
  placeholder: string
  ctaText: string
  onSuccess: () => void
}) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!value.trim()) return
    onSuccess()
  }

  const inputStyle: CSSProperties = {
    flex: '1 1 0',
    minWidth: 0,
    fontFamily: 'var(--font-body, system-ui, sans-serif)',
    fontSize: '0.9375rem',
    color: 'var(--brand-paper, #fafaf7)',
    background: 'color-mix(in oklab, var(--brand-paper, #fafaf7) 6%, transparent)',
    border: focused
      ? '1.5px solid color-mix(in oklab, var(--color-primary, #0c3bb9) 80%, var(--color-accent, #00aaff))'
      : '1.5px solid color-mix(in oklab, var(--brand-paper, #fafaf7) 16%, transparent)',
    borderRadius: 'var(--radius-input, 0.375rem)',
    padding: '0.875rem 1.125rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast, 150ms) ease, background-color var(--transition-fast, 150ms) ease',
    boxSizing: 'border-box',
    lineHeight: 1,
  }

  const buttonStyle: CSSProperties = {
    flexShrink: 0,
    fontFamily: 'var(--font-display, system-ui, sans-serif)',
    fontSize: '0.9375rem',
    fontWeight: 700,
    color: 'var(--color-on-primary, #ffffff)',
    background: 'var(--color-primary, #0c3bb9)',
    border: '1.5px solid transparent',
    borderRadius: 'var(--radius-button, 0.375rem)',
    padding: '0.875rem 1.625rem',
    cursor: 'pointer',
    lineHeight: 1,
    letterSpacing: '0.01em',
    transition: 'opacity var(--transition-fast, 150ms) ease',
    whiteSpace: 'nowrap',
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}
    >
      {/* Visually hidden label for screen readers */}
      <label
        htmlFor="newsletter-email"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
        }}
      >
        Correo electrónico
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        autoComplete="email"
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
        aria-label={placeholder}
      />
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88' }}
        onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        onFocus={(e) => { e.currentTarget.style.outline = '2px solid var(--color-accent, #00aaff)'; e.currentTarget.style.outlineOffset = '3px' }}
        onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
      >
        {ctaText}
      </button>
    </form>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function NewsletterBar({
  headline,
  subheadline,
  placeholder = 'tu@correo.com',
  ctaText = 'Suscribirme',
  successMessage = 'Listo. Te avisamos pronto.',
  destinationEmail: _destinationEmail,
  appearance,
}: NewsletterBarProps) {
  const [submitted, setSubmitted] = useState(false)

  const hasText = Boolean(headline || subheadline)

  return (
    <Section
      appearance={appearance}
      background="ink"
      style={{
        paddingTop: 'calc(var(--section-padding-y, 6rem) * 0.6)',
        paddingBottom: 'calc(var(--section-padding-y, 6rem) * 0.6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow: brand primary, top-right, restrained */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '-40%',
          right: '-6%',
          width: 'min(28rem, 55vw)',
          height: 'min(28rem, 55vw)',
          background:
            'radial-gradient(ellipse, color-mix(in oklab, var(--color-primary, #0c3bb9) 16%, transparent) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <Container
        size="xl"
        style={{ position: 'relative' }}
        className="newsletter-bar-inner"
      >
        {/* Two-column: copy left, form right. Single column on mobile. */}
        <div className="newsletter-bar-grid">

          {/* Left: copy */}
          {hasText && (
            <div className="newsletter-bar-copy">
              {/* Eyebrow with primary color override for ink bg */}
              <div style={{ marginBottom: '0.875rem' }}>
                <p
                  className="newsletter-bar-eyebrow"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                    fontSize: 'var(--text-eyebrow, 0.72rem)',
                    fontWeight: 600,
                    letterSpacing: 'var(--tracking-wide, 0.2em)',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent, #00aaff)',
                    margin: 0,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: '1.25rem',
                      height: '2px',
                      flexShrink: 0,
                      background: 'var(--color-accent, #00aaff)',
                    }}
                  />
                  Newsletter
                </p>
              </div>

              {headline ? (
                <h2 style={HEADLINE}>{headline}</h2>
              ) : null}

              {subheadline ? (
                <p style={SUBHEADLINE}>{subheadline}</p>
              ) : null}
            </div>
          )}

          {/* Right: form or success */}
          <div className={`newsletter-bar-form${!hasText ? ' newsletter-bar-form--solo' : ''}`}>
            {submitted ? (
              <SuccessState message={successMessage ?? 'Listo. Te avisamos pronto.'} />
            ) : (
              <EmailForm
                placeholder={placeholder ?? 'tu@correo.com'}
                ctaText={ctaText ?? 'Suscribirme'}
                onSuccess={() => setSubmitted(true)}
              />
            )}

            {/* Privacy micro-copy */}
            {!submitted && (
              <p
                style={{
                  marginTop: '0.75rem',
                  fontFamily: 'var(--font-body, system-ui, sans-serif)',
                  fontSize: '0.75rem',
                  color: 'color-mix(in oklab, var(--brand-paper, #fafaf7) 38%, transparent)',
                  lineHeight: 1.5,
                }}
              >
                Sin spam. Puedes darte de baja cuando quieras.
              </p>
            )}
          </div>
        </div>
      </Container>

      {/* Responsive grid collapse */}
      <style>{`
        .newsletter-bar-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(2rem, 5vw, 4.5rem);
          align-items: center;
        }
        .newsletter-bar-form--solo {
          grid-column: 1 / -1;
          max-width: 36rem;
          margin: 0 auto;
        }
        @media (max-width: 720px) {
          .newsletter-bar-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .newsletter-bar-copy h2 {
            font-size: 1.5rem !important;
          }
        }
        /* Input placeholder color */
        #newsletter-email::placeholder {
          color: color-mix(in oklab, var(--brand-paper, #fafaf7) 35%, transparent);
        }
      `}</style>
    </Section>
  )
}
