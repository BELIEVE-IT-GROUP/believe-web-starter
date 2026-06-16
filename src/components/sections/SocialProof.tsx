/**
 * SocialProof — testimonials.custom
 *
 * Variants:
 *   single  — One large pull-quote with avatar, attribution, and an optional
 *              hard metric displayed in a dark panel beside the quote.
 *   grid    — 2-3 cards with quote, stars, avatar, and optional metric chip.
 *
 * Server Component. No interactivity needed.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance, MediaRef } from './types'

// ─── Public interface (stub signature preserved, metric added to item) ────────

export interface SocialProofItem {
  name?: string
  role?: string
  company?: string
  photo?: MediaRef
  quote?: string
  rating?: number
  /** Hard metric tied to the testimonial (variant single). */
  metric?: string
}

export interface SocialProofProps {
  headline?: string
  layout?: string
  variant?: 'single' | 'grid'
  items?: SocialProofItem[]
  appearance?: BlockAppearance
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Clamp star rating to 1-5, fallback to 5. */
function safeRating(r?: number): number {
  if (!r || r < 1) return 5
  return Math.min(5, Math.round(r))
}

/** Render a row of filled / unfilled star marks. */
function Stars({ rating, on }: { rating: number; on: 'paper' | 'ink' }) {
  const filled = safeRating(rating)
  const fillColor = 'var(--color-primary, #0c3bb9)'
  const emptyColor = on === 'ink' ? 'rgba(255,255,255,0.18)' : 'rgba(26,26,26,0.12)'

  return (
    <span
      aria-label={`${filled} de 5 estrellas`}
      role="img"
      style={{ display: 'inline-flex', gap: '0.25rem', lineHeight: 1 }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill={i < filled ? fillColor : emptyColor}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 1l1.854 3.756 4.146.603-3 2.923.708 4.129L8 10.25l-3.708 1.95.708-4.129-3-2.923 4.146-.603L8 1z" />
        </svg>
      ))}
    </span>
  )
}

/** Circular avatar with graceful fallback to initials. */
function Avatar({ photo, name, size = 52 }: { photo?: MediaRef; name?: string; size?: number }) {
  const initials = (name ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()

  const avatarStyle: CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: '50%',
    overflow: 'hidden',
    background: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 12%, var(--brand-paper, #fafaf7))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display, system-ui, sans-serif)',
    fontSize: size * 0.35,
    fontWeight: 700,
    color: 'var(--color-primary, #0c3bb9)',
    flexShrink: 0,
  }

  if (photo?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo.url}
        alt={photo.alt || (name ? `Foto de ${name}` : 'Avatar')}
        width={size}
        height={size}
        style={{ ...avatarStyle, objectFit: 'cover' }}
      />
    )
  }

  return <div style={avatarStyle} aria-hidden>{initials}</div>
}

/** Author byline: avatar + name + role / company. */
function Byline({
  item,
  on,
  avatarSize = 44,
}: {
  item: SocialProofItem
  on: 'paper' | 'ink'
  avatarSize?: number
}) {
  const nameColor = on === 'ink' ? 'var(--brand-paper, #fafaf7)' : 'var(--brand-ink, #1a1a1a)'
  const metaColor =
    on === 'ink'
      ? 'rgba(255,255,255,0.48)'
      : 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.5)'

  const roleLine = [item.role, item.company].filter(Boolean).join(', ')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
      <Avatar photo={item.photo} name={item.name} size={avatarSize} />
      <div>
        {item.name ? (
          <div
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: nameColor,
              lineHeight: 1.2,
            }}
          >
            {item.name}
          </div>
        ) : null}
        {roleLine ? (
          <div
            style={{
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
              fontSize: '0.75rem',
              color: metaColor,
              marginTop: '0.2rem',
              letterSpacing: '0.04em',
            }}
          >
            {roleLine}
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ─── Variant: single ─────────────────────────────────────────────────────────

function SingleVariant({ headline, items, appearance }: { headline?: string; items: SocialProofItem[]; appearance?: BlockAppearance }) {
  const item = items[0]
  if (!item) return null

  const hasMetric = Boolean(item.metric)
  const borderColor = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)'

  return (
    <Section background="paper" appearance={appearance}>
      <Container size="xl">
        {headline ? (
          <div style={{ marginBottom: 'clamp(2.5rem, 4vw, 4rem)' }}>
            <Eyebrow>Testimonios</Eyebrow>
            <h2
              style={{
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: 'var(--text-h2, clamp(1.5rem, 3vw, 2.25rem))',
                fontWeight: 800,
                letterSpacing: 'var(--tracking-tight, -0.015em)',
                color: 'var(--brand-ink, #1a1a1a)',
                margin: '0.875rem 0 0',
                lineHeight: 'var(--leading-tight, 1.06)',
              }}
            >
              {headline}
            </h2>
          </div>
        ) : null}

        {/* Two-column: quote left, metric panel right */}
        <div className="sp-single-grid">
          {/* Left: quote card */}
          <article
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              background: 'var(--brand-paper, #fafaf7)',
              border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-card, 0.5rem)',
              boxShadow: 'var(--shadow-lg, 0 4px 16px rgba(0,0,0,0.10))',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent line in brand signal color */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: 0,
                left: 'clamp(2rem, 4vw, 3.5rem)',
                right: 'clamp(2rem, 4vw, 3.5rem)',
                height: '3px',
                background: 'var(--color-primary, #0c3bb9)',
              }}
            />

            {/* Stars + rating */}
            {(item.rating ?? 5) > 0 ? (
              <div style={{ paddingTop: '0.5rem' }}>
                <Stars rating={item.rating ?? 5} on="paper" />
              </div>
            ) : null}

            {/* Pull-quote */}
            {item.quote ? (
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display, system-ui, sans-serif)',
                  fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  letterSpacing: 'var(--tracking-tight, -0.015em)',
                  color: 'var(--brand-ink, #1a1a1a)',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display, system-ui, sans-serif)',
                    fontSize: '4rem',
                    lineHeight: 0.6,
                    color: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 22%, transparent)',
                    marginBottom: '0.5rem',
                    userSelect: 'none',
                  }}
                >
                  &ldquo;
                </span>
                {item.quote}
              </blockquote>
            ) : null}

            {/* Author */}
            <footer
              style={{
                marginTop: 'auto',
                paddingTop: '1.5rem',
                borderTop: `1px solid ${borderColor}`,
              }}
            >
              <Byline item={item} on="paper" avatarSize={48} />
            </footer>
          </article>

          {/* Right: metric panel (dark) */}
          {hasMetric ? (
            <aside
              aria-label="Resultado clave"
              style={{
                background: 'var(--brand-ink, #1a1a1a)',
                borderRadius: 'var(--radius-card, 0.5rem)',
                padding: 'clamp(2rem, 4vw, 3.5rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle radial glow */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '-30%',
                  right: '-20%',
                  width: '18rem',
                  height: '18rem',
                  background:
                    'radial-gradient(ellipse, color-mix(in oklab, var(--color-primary, #0c3bb9) 18%, transparent) 0%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />

              <p
                style={{
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-wide, 0.2em)',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent, #00aaff)',
                  margin: 0,
                }}
              >
                Resultado clave
              </p>

              <div
                style={{
                  fontFamily: 'var(--font-display, system-ui, sans-serif)',
                  fontSize: 'clamp(2.75rem, 5vw, 4.5rem)',
                  fontWeight: 800,
                  letterSpacing: 'var(--tracking-tight, -0.015em)',
                  lineHeight: 1,
                  color: 'var(--brand-paper, #fafaf7)',
                }}
              >
                {item.metric}
              </div>

              {item.name ? (
                <p
                  style={{
                    fontFamily: 'var(--font-body, system-ui, sans-serif)',
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.45)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {[item.company, item.name].filter(Boolean).join(', ')}
                </p>
              ) : null}
            </aside>
          ) : (
            /* Placeholder panel when no metric: branded quiet visual */
            <aside
              aria-hidden
              style={{
                borderRadius: 'var(--radius-card, 0.5rem)',
                background:
                  'radial-gradient(120% 100% at 80% 0%, color-mix(in oklab, var(--color-primary, #0c3bb9) 10%, transparent) 0%, transparent 60%), var(--brand-paper, #fafaf7)',
                border: `1px solid ${borderColor}`,
                minHeight: '12rem',
              }}
            />
          )}
        </div>
      </Container>

      <style>{`
        .sp-single-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1.5rem, 3vw, 2.5rem);
          align-items: stretch;
        }
        @media (max-width: 768px) {
          .sp-single-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </Section>
  )
}

// ─── Variant: grid ────────────────────────────────────────────────────────────

function GridCard({ item }: { item: SocialProofItem }) {
  const borderColor = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)'

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        background: 'var(--brand-paper, #fafaf7)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-card, 0.5rem)',
        boxShadow: 'var(--shadow-card, 0 1px 3px rgba(0,0,0,0.08))',
        transition: 'box-shadow var(--transition-duration, 300ms) var(--transition-easing, cubic-bezier(0.4,0,0.2,1))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Thin top accent bar */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: '1.5rem',
          right: '1.5rem',
          height: '2px',
          background: 'var(--color-primary, #0c3bb9)',
          opacity: 0.6,
        }}
      />

      {/* Stars */}
      {(item.rating ?? 5) > 0 ? (
        <div style={{ paddingTop: '0.375rem' }}>
          <Stars rating={item.rating ?? 5} on="paper" />
        </div>
      ) : null}

      {/* Quote */}
      {item.quote ? (
        <blockquote
          style={{
            margin: 0,
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
            fontSize: 'clamp(0.9375rem, 1.3vw, 1.0625rem)',
            lineHeight: 1.7,
            color: 'var(--brand-ink, #1a1a1a)',
            flexGrow: 1,
          }}
        >
          {item.quote}
        </blockquote>
      ) : null}

      {/* Metric chip */}
      {item.metric ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            background: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 10%, transparent)',
            borderRadius: 'var(--radius-full, 9999px)',
            alignSelf: 'flex-start',
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--color-primary, #0c3bb9)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-primary, #0c3bb9)',
            }}
          >
            {item.metric}
          </span>
        </div>
      ) : null}

      {/* Author */}
      <footer
        style={{
          marginTop: 'auto',
          paddingTop: '1.125rem',
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <Byline item={item} on="paper" avatarSize={40} />
      </footer>
    </article>
  )
}

function GridVariant({ headline, items, appearance }: { headline?: string; items: SocialProofItem[]; appearance?: BlockAppearance }) {
  if (!items.length) return null

  const colCount = Math.min(3, items.length)

  return (
    <Section background="paper" appearance={appearance}>
      <Container size="xl">
        {/* Header row: eyebrow + headline left-aligned */}
        {headline ? (
          <div style={{ marginBottom: 'clamp(2.5rem, 4vw, 4rem)', maxWidth: '40rem' }}>
            <Eyebrow>Testimonios</Eyebrow>
            <h2
              style={{
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: 'var(--text-h2, clamp(1.5rem, 3vw, 2.25rem))',
                fontWeight: 800,
                letterSpacing: 'var(--tracking-tight, -0.015em)',
                color: 'var(--brand-ink, #1a1a1a)',
                margin: '0.875rem 0 0',
                lineHeight: 'var(--leading-tight, 1.06)',
              }}
            >
              {headline}
            </h2>
          </div>
        ) : null}

        {/* Card grid — responsive: 1 col mobile, 2 col tablet, up to 3 desktop */}
        <div
          className={`sp-grid sp-grid-${colCount}`}
          role="list"
        >
          {items.slice(0, 3).map((item, i) => (
            <div key={i} role="listitem">
              <GridCard item={item} />
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        .sp-grid {
          display: grid;
          gap: clamp(1.25rem, 2.5vw, 2rem);
          align-items: stretch;
        }
        .sp-grid-1 { grid-template-columns: 1fr; }
        .sp-grid-2 { grid-template-columns: repeat(2, 1fr); }
        .sp-grid-3 { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) {
          .sp-grid-3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .sp-grid-2,
          .sp-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </Section>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function SocialProof({
  headline,
  layout,
  variant = 'grid',
  items = [],
  appearance,
}: SocialProofProps) {
  const safeItems = (items ?? []).filter((it) => it.quote || it.name || it.metric)

  if (!safeItems.length) {
    // Graceful empty state: nothing rendered (don't break layouts).
    return null
  }

  if (variant === 'single') {
    return <SingleVariant headline={headline} items={safeItems} appearance={appearance} />
  }

  return <GridVariant headline={headline} items={safeItems} appearance={appearance} />
}
