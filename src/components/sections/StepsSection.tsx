/**
 * StepsSection — steps.custom
 *
 * Numbered steps. Three variants:
 *   linear   — horizontal row of steps connected by a progress rail (desktop)
 *   vertical — timeline with alternating indent, step numbers as anchors
 *   grid     — asymmetric numbered cells in a 2-up or 3-up grid
 *
 * Server Component (no interaction). Theme-token-driven only.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

export interface StepsSectionItem {
  number?: string
  title?: string
  description?: string
}

export interface StepsSectionProps {
  eyebrow?: string
  headline?: string
  subheadline?: string
  variant?: 'linear' | 'vertical' | 'grid'
  items?: StepsSectionItem[]
  appearance?: BlockAppearance
}

// ─── Shared typography constants ─────────────────────────────────────────────

const HEADLINE_STYLE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  fontSize: 'clamp(1.85rem, 3.8vw, 3rem)',
  lineHeight: 'var(--leading-tight, 1.06)',
  letterSpacing: 'var(--tracking-tight, -0.015em)',
  color: 'var(--brand-ink, #1a1a1a)',
  margin: '0 0 1.125rem',
}

const SUBHEAD_STYLE: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
  lineHeight: 'var(--leading-body, 1.6)',
  color: 'var(--brand-ink-muted, #6b6b65)',
  maxWidth: '36rem',
  margin: 0,
}

// ─── Step number badge ────────────────────────────────────────────────────────

function StepBadge({
  label,
  size = 'md',
}: {
  label: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const dim = size === 'lg' ? '3.5rem' : size === 'sm' ? '2rem' : '2.75rem'
  const fs = size === 'lg' ? '1.125rem' : size === 'sm' ? '0.75rem' : '0.875rem'
  return (
    <div
      aria-hidden="true"
      style={{
        width: dim,
        height: dim,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary-muted, rgba(12,59,185,0.12))',
        borderRadius: 'var(--radius-full, 9999px)',
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        fontWeight: 700,
        fontSize: fs,
        color: 'var(--color-primary, #0c3bb9)',
        letterSpacing: '-0.01em',
      }}
    >
      {label}
    </div>
  )
}

// ─── Section header (shared across variants) ──────────────────────────────────

function SectionHeader({
  eyebrow,
  headline,
  subheadline,
  centered = false,
}: {
  eyebrow?: string
  headline?: string
  subheadline?: string
  centered?: boolean
}) {
  if (!eyebrow && !headline && !subheadline) return null
  return (
    <div
      style={{
        marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
        textAlign: centered ? 'center' : 'left',
        ...(centered ? { display: 'flex', flexDirection: 'column', alignItems: 'center' } : {}),
      }}
    >
      {eyebrow ? (
        <div style={{ marginBottom: '1.25rem' }}>
          <Eyebrow rule={!centered}>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      {headline ? <h2 style={HEADLINE_STYLE}>{headline}</h2> : null}
      {subheadline ? <p style={SUBHEAD_STYLE}>{subheadline}</p> : null}
    </div>
  )
}

// ─── Linear variant ───────────────────────────────────────────────────────────
// Horizontal row (desktop) with a connecting rail between steps.
// Collapses to vertical stack on mobile.

function LinearSteps({ items }: { items: StepsSectionItem[] }) {
  if (!items.length) return null
  const borderCol = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.09)'
  return (
    <>
      <ol
        className="steps-linear"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          gap: 0,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          position: 'relative',
        }}
        aria-label="Steps"
      >
        {/* Connecting rail behind the badges */}
        <li
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '1.375rem', // half of badge height (2.75rem)
            left: `calc(100% / ${items.length} / 2)`,
            right: `calc(100% / ${items.length} / 2)`,
            height: '2px',
            background: borderCol,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Progress fill — first third highlighted */}
        <li
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '1.375rem',
            left: `calc(100% / ${items.length} / 2)`,
            width: '0%',
            height: '2px',
            background: 'var(--color-primary, #0c3bb9)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {items.map((item, i) => {
          const label = item.number ?? String(i + 1).padStart(2, '0')
          const isLast = i === items.length - 1
          return (
            <li
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: `0 clamp(0.75rem, 2vw, 1.5rem)`,
                position: 'relative',
                zIndex: 1,
                borderRight: !isLast ? `1px solid ${borderCol}` : 'none',
              }}
            >
              <StepBadge label={label} size="md" />
              {item.title ? (
                <h3
                  style={{
                    fontFamily: 'var(--font-display, system-ui, sans-serif)',
                    fontWeight: 700,
                    fontSize: 'clamp(0.9375rem, 1.4vw, 1.0625rem)',
                    lineHeight: 1.25,
                    color: 'var(--brand-ink, #1a1a1a)',
                    margin: '1.25rem 0 0.5rem',
                  }}
                >
                  {item.title}
                </h3>
              ) : null}
              {item.description ? (
                <p
                  style={{
                    fontFamily: 'var(--font-body, system-ui, sans-serif)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: 'var(--brand-ink-muted, #6b6b65)',
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              ) : null}
            </li>
          )
        })}
      </ol>
      <style>{`
        @media (max-width: 700px) {
          .steps-linear {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .steps-linear li[aria-hidden="true"] {
            display: none !important;
          }
          .steps-linear li {
            align-items: flex-start !important;
            text-align: left !important;
            border-right: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            flex-direction: row !important;
            gap: 1.25rem;
          }
          .steps-linear li > div:first-child {
            flex-shrink: 0;
          }
          .steps-linear li > div:last-child,
          .steps-linear li > h3,
          .steps-linear li > p {
            text-align: left;
          }
        }
      `}</style>
    </>
  )
}

// ─── Vertical variant ─────────────────────────────────────────────────────────
// Timeline with a left-edge track and step numbers as anchors.

function VerticalSteps({ items }: { items: StepsSectionItem[] }) {
  if (!items.length) return null
  const borderCol = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.09)'
  return (
    <ol
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      aria-label="Steps"
    >
      {/* Vertical track line */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '1.375rem', // center of the 2.75rem badge
          top: '1.375rem',
          bottom: '1.375rem',
          width: '2px',
          background: borderCol,
          zIndex: 0,
        }}
      />
      {items.map((item, i) => {
        const label = item.number ?? String(i + 1).padStart(2, '0')
        const isLast = i === items.length - 1
        return (
          <li
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '2.75rem 1fr',
              gap: '0 1.75rem',
              alignItems: 'start',
              marginBottom: isLast ? 0 : 'clamp(2rem, 4vw, 3rem)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <StepBadge label={label} size="md" />
            <div
              style={{
                paddingTop: '0.3125rem', // optically align text to badge center
                paddingBottom: '2rem',
                borderBottom: !isLast ? `1px solid ${borderCol}` : 'none',
              }}
            >
              {item.title ? (
                <h3
                  style={{
                    fontFamily: 'var(--font-display, system-ui, sans-serif)',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                    lineHeight: 1.2,
                    color: 'var(--brand-ink, #1a1a1a)',
                    margin: '0 0 0.625rem',
                  }}
                >
                  {item.title}
                </h3>
              ) : null}
              {item.description ? (
                <p
                  style={{
                    fontFamily: 'var(--font-body, system-ui, sans-serif)',
                    fontSize: 'var(--text-body, 1.0625rem)',
                    lineHeight: 'var(--leading-body, 1.6)',
                    color: 'var(--brand-ink-muted, #6b6b65)',
                    margin: 0,
                    maxWidth: '52rem',
                  }}
                >
                  {item.description}
                </p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// ─── Grid variant ─────────────────────────────────────────────────────────────
// Asymmetric numbered cells in 2-up or 3-up grid.
// First cell gets a slight accent treatment to create hierarchy.

function GridSteps({ items }: { items: StepsSectionItem[] }) {
  if (!items.length) return null
  const borderCol = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.10)'

  // Use 3-column grid for 3 or 6 items, otherwise 2-column
  const cols = items.length % 3 === 0 ? 3 : 2

  return (
    <>
      <ol
        className="steps-grid"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '2px',
          background: borderCol,
          borderRadius: 'var(--radius-card, 0.5rem)',
          overflow: 'hidden',
        }}
        aria-label="Steps"
      >
        {items.map((item, i) => {
          const label = item.number ?? String(i + 1).padStart(2, '0')
          // First card gets a subtle primary tint as anchor
          const isFirst = i === 0
          return (
            <li
              key={i}
              style={{
                background: isFirst
                  ? 'var(--color-primary-muted, rgba(12,59,185,0.06))'
                  : 'var(--brand-paper, #fafaf7)',
                padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Number badge + optional accent bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StepBadge label={label} size="lg" />
                {isFirst ? (
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-block',
                      width: '2.5rem',
                      height: '3px',
                      background: 'var(--color-primary, #0c3bb9)',
                      borderRadius: 'var(--radius-full, 9999px)',
                    }}
                  />
                ) : null}
              </div>
              {item.title ? (
                <h3
                  style={{
                    fontFamily: 'var(--font-display, system-ui, sans-serif)',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 1.6vw, 1.1875rem)',
                    lineHeight: 1.2,
                    color: 'var(--brand-ink, #1a1a1a)',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
              ) : null}
              {item.description ? (
                <p
                  style={{
                    fontFamily: 'var(--font-body, system-ui, sans-serif)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.65,
                    color: 'var(--brand-ink-muted, #6b6b65)',
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              ) : null}
            </li>
          )
        })}
      </ol>
      <style>{`
        @media (max-width: 700px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 701px) and (max-width: 960px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function StepsSection({
  eyebrow,
  headline,
  subheadline,
  variant = 'linear',
  items = [],
  appearance,
}: StepsSectionProps) {
  const safeItems = (items ?? []).filter(
    (item) => item.title || item.description || item.number,
  )

  // Vertical variant works better on a paper background with extra breathing room.
  // Linear + grid feel at home on paper too.
  return (
    <Section appearance={appearance} background="paper">
      <Container size={variant === 'vertical' ? 'md' : 'xl'}>
        <SectionHeader
          eyebrow={eyebrow}
          headline={headline}
          subheadline={subheadline}
          centered={variant === 'linear'}
        />

        {safeItems.length > 0 ? (
          <>
            {variant === 'linear' && <LinearSteps items={safeItems} />}
            {variant === 'vertical' && <VerticalSteps items={safeItems} />}
            {variant === 'grid' && <GridSteps items={safeItems} />}
          </>
        ) : null}
      </Container>
    </Section>
  )
}
