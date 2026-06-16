/**
 * PainSection — pain.custom (ATIDCOA: identificación del dolor).
 *
 * The moment the reader recognizes their own problem on the page. Two variants:
 *
 *   cards     (default). Editorial intro (eyebrow + headline + subheadline) plus
 *               an asymmetric hairline grid of 3-4 pain cards. The first card is
 *               featured (wider, larger data) so the grid has hierarchy instead
 *               of a flat repeat. Each card leads with a hard data point in mono.
 *   statement   one brutal paragraph in large display type, no ornament. A single
 *               emphasized clause carries the brand color. Ink background, lots of
 *               negative space, asymmetric measure.
 *
 * Server Component (no interaction). Theme tokens only, no Flowbite, no hex
 * except as var(--token, #fallback). Mirrors HeroSection / trust-demo craft.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow } from './_primitives'
import type { BlockAppearance } from './types'

export interface PainSectionCard {
  title?: string
  description?: string
  /** Hard data point of the pain, e.g. "-30% picking". */
  data?: string
}

export interface PainSectionProps {
  eyebrow?: string
  headline?: string
  /** Optional clause rendered in the brand color (statement em-highlight). */
  headlineEmphasis?: string
  subheadline?: string
  variant?: 'cards' | 'statement'
  cards?: PainSectionCard[]
  appearance?: BlockAppearance
}

// ─── Shared type styles ───────────────────────────────────────────────────────

const HEADLINE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  lineHeight: 1.04,
  letterSpacing: 'var(--tracking-tight, -0.02em)',
  margin: '1.5rem 0 0',
}

const SUBHEAD: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
  lineHeight: 1.7,
  margin: '1.25rem 0 0',
}

// On-paper muted tones (derived from ink, no new hex).
const INK_62 = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.62)'
const INK_10 = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.1)'

// ─── Card data point ──────────────────────────────────────────────────────────

function DataChip({ value, featured }: { value: string; featured: boolean }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        fontWeight: 700,
        fontSize: featured ? 'clamp(2.5rem, 5vw, 3.75rem)' : 'clamp(1.875rem, 3vw, 2.5rem)',
        lineHeight: 0.95,
        letterSpacing: '-0.02em',
        color: 'var(--color-primary, #0c3bb9)',
        marginBottom: '1.5rem',
      }}
    >
      {value}
    </div>
  )
}

// ─── Pain card ────────────────────────────────────────────────────────────────

function PainCard({ card, featured }: { card: PainSectionCard; featured: boolean }) {
  const hasData = Boolean(card.data)
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--brand-paper, #fafaf7)',
        padding: featured ? 'clamp(2.25rem, 3.5vw, 3.25rem)' : 'clamp(1.875rem, 2.5vw, 2.5rem)',
        height: '100%',
      }}
    >
      {hasData ? <DataChip value={card.data as string} featured={featured} /> : null}
      {card.title ? (
        <h3
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontWeight: 700,
            fontSize: featured ? 'clamp(1.375rem, 2vw, 1.625rem)' : '1.1875rem',
            lineHeight: 1.18,
            letterSpacing: 'var(--tracking-tight, -0.015em)',
            margin: 0,
            marginTop: hasData ? 0 : 'auto',
            color: 'var(--brand-ink, #1a1a1a)',
          }}
        >
          {card.title}
        </h3>
      ) : null}
      {card.description ? (
        <p
          style={{
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
            fontSize: featured ? '1.0625rem' : '0.9375rem',
            lineHeight: 1.65,
            color: INK_62,
            margin: '0.875rem 0 0',
            maxWidth: featured ? '32rem' : undefined,
          }}
        >
          {card.description}
        </p>
      ) : null}
    </article>
  )
}

// ─── cards variant ────────────────────────────────────────────────────────────

function CardsVariant({
  eyebrow,
  headline,
  subheadline,
  cards,
}: {
  eyebrow?: string
  headline?: string
  subheadline?: string
  cards: PainSectionCard[]
}) {
  const [first, ...rest] = cards
  const hasHeader = Boolean(eyebrow || headline || subheadline)

  return (
    <Container size="xl">
      {hasHeader ? (
        <header style={{ maxWidth: '46rem', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {headline ? (
            <h2 style={{ ...HEADLINE, fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>{headline}</h2>
          ) : null}
          {subheadline ? <p style={{ ...SUBHEAD, color: INK_62, maxWidth: '38rem' }}>{subheadline}</p> : null}
        </header>
      ) : null}

      {/* Hairline grid: thin ink rule between cards (no side-stripe color bars). */}
      {/* Mobile-first: single column by default, promoted to 2 columns up. */}
      <div
        className="pain-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1px',
          background: INK_10,
          border: `1px solid ${INK_10}`,
        }}
      >
        {first ? (
          // Featured card spans the full top row for asymmetric weight.
          <div className="pain-featured" style={{ gridColumn: '1 / -1' }}>
            <PainCard card={first} featured />
          </div>
        ) : null}
        {rest.map((card, i) => (
          <PainCard key={i} card={card} featured={false} />
        ))}
      </div>

      <style>{`
        @media (min-width: 721px) {
          .pain-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </Container>
  )
}

// ─── statement variant ────────────────────────────────────────────────────────

function StatementVariant({
  eyebrow,
  headline,
  headlineEmphasis,
  subheadline,
}: {
  eyebrow?: string
  headline?: string
  headlineEmphasis?: string
  subheadline?: string
}) {
  // Muted on-ink tone derived from the paper token (no raw rgb/hex).
  const sub62 = 'rgb(from var(--brand-paper, #fafaf7) r g b / 0.55)'
  return (
    <Container size="lg">
      {eyebrow ? (
        <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      ) : null}

      {headline || headlineEmphasis ? (
        <h2
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontWeight: 700,
            fontSize: 'clamp(1.875rem, 4.5vw, 3.5rem)',
            lineHeight: 1.18,
            letterSpacing: 'var(--tracking-tight, -0.02em)',
            color: 'var(--brand-paper, #fafaf7)',
            margin: 0,
            maxWidth: '54rem',
          }}
        >
          {headline}
          {headlineEmphasis ? (
            <>
              {headline ? ' ' : ''}
              <em style={{ fontStyle: 'normal', color: 'var(--color-primary, #0c3bb9)' }}>{headlineEmphasis}</em>
            </>
          ) : null}
        </h2>
      ) : null}

      {subheadline ? (
        <p
          style={{
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
            fontSize: 'clamp(1rem, 1.4vw, 1.1875rem)',
            lineHeight: 1.7,
            color: sub62,
            margin: 'clamp(2rem, 3vw, 2.75rem) 0 0',
            maxWidth: '40rem',
            paddingLeft: 'clamp(0rem, 6vw, 5rem)',
          }}
        >
          {subheadline}
        </p>
      ) : null}
    </Container>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PainSection({
  eyebrow,
  headline,
  headlineEmphasis,
  subheadline,
  variant = 'cards',
  cards = [],
  appearance,
}: PainSectionProps) {
  const safeCards = (cards ?? []).filter((c) => c.title || c.description || c.data)
  const isStatement = variant === 'statement'

  const paddingTop = 'var(--section-padding-y, 6rem)'
  const paddingBottom = 'calc(var(--section-padding-y, 6rem) * 1.05)'

  const sectionStyle: CSSProperties = isStatement
    ? {
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--brand-ink, #0a0a0a)',
        color: 'var(--brand-paper, #fafaf7)',
        paddingTop: 'calc(var(--section-padding-y, 6rem) * 1.25)',
        paddingBottom: 'calc(var(--section-padding-y, 6rem) * 1.25)',
      }
    : {
        position: 'relative',
        background: 'var(--brand-paper, #fafaf7)',
        color: 'var(--brand-ink, #1a1a1a)',
        paddingTop,
        paddingBottom,
      }

  // statement falls back to the cards layout if there is no statement copy.
  if (isStatement && (headline || headlineEmphasis || subheadline || eyebrow)) {
    return (
      <section id={appearance?.sectionId || undefined} className={appearance?.customClassName} style={sectionStyle}>
        {/* Quiet brand glow, bottom-left (no gradient text, no glassmorphism). */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-25%',
            left: '-10%',
            width: 'min(40rem, 60vw)',
            height: 'min(40rem, 60vw)',
            background:
              'radial-gradient(ellipse, color-mix(in oklab, var(--color-primary, #0c3bb9) 16%, transparent) 0%, transparent 64%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <StatementVariant
            eyebrow={eyebrow}
            headline={headline}
            headlineEmphasis={headlineEmphasis}
            subheadline={subheadline}
          />
        </div>
      </section>
    )
  }

  // cards variant (and graceful fallback). If there is nothing at all, render a
  // minimal header so the block never collapses to nothing.
  if (!safeCards.length && !eyebrow && !headline && !subheadline) {
    return null
  }

  return (
    <section id={appearance?.sectionId || undefined} className={appearance?.customClassName} style={sectionStyle}>
      <CardsVariant eyebrow={eyebrow} headline={headline} subheadline={subheadline} cards={safeCards} />
    </section>
  )
}
