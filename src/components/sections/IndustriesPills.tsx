/**
 * IndustriesPills — industries-pills.custom
 *
 * Header (eyebrow + headline) followed by a fluid wrap band of bordered pills.
 * Each pill shifts to the brand primary on hover. Theme-aware: built for DARK
 * (brand-paper = dark surface, brand-ink = light text) via CSS tokens only.
 *
 * Reference: birdman-landing.html lines 498-507.
 * Server Component (no interaction). Zero Flowbite. Zero raw hex (fallbacks only).
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

// == Default content (mirrors birdman-landing.html §industrias) ==

const DEFAULT_EYEBROW = 'Industrias'
const DEFAULT_HEADLINE = 'Operamos para sectores de alta exigencia'
const DEFAULT_ITEMS = [
  'Retail',
  'Manufactura',
  'Automotriz',
  'Electrónica',
  'Consumo',
  'Ecommerce',
  'Distribución',
  'Farmacéutica',
  'Ropa y Textil',
]

// == Props ==

export interface IndustriesPillsProps {
  eyebrow?: string
  headline?: string
  /** Industry names rendered as wrapping pills. */
  items?: string[]
  appearance?: BlockAppearance
}

// == Style constants ==

const HEADLINE_STYLE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
  lineHeight: 1.06,
  letterSpacing: 'var(--tracking-tight, -0.02em)',
  color: 'var(--brand-ink, #fafaf7)',
  margin: '1.1rem 0 0',
}

const BAND_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'clamp(0.625rem, 1.2vw, 0.875rem)',
  marginTop: 'clamp(2rem, 4vw, 3rem)',
}

// == Pill (plain span + injected hover style via style tag) ==

/**
 * CSS class-based hover so the component stays a Server Component.
 * The pill border fades from the muted ink-alpha to the primary on :hover.
 * Background tints to a very subtle primary wash on hover for depth.
 */
const PILL_BASE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(0.875rem, 1.1vw, 1rem)',
  fontWeight: 500,
  lineHeight: 1,
  padding: 'clamp(0.6rem, 1vw, 0.8rem) clamp(1rem, 1.8vw, 1.5rem)',
  borderRadius: 'var(--radius-full, 9999px)',
  border: '1.5px solid var(--brand-ink-muted, rgb(255 255 255 / 0.15))',
  color: 'var(--brand-ink, #fafaf7)',
  background: 'transparent',
  transition:
    'border-color 180ms ease, background-color 180ms ease, color 180ms ease',
  cursor: 'default',
  whiteSpace: 'nowrap' as const,
}

// == Component ==

export function IndustriesPills({
  eyebrow,
  headline,
  items,
  appearance,
}: IndustriesPillsProps) {
  const resolvedEyebrow = eyebrow ?? DEFAULT_EYEBROW
  const resolvedHeadline = headline ?? DEFAULT_HEADLINE
  const resolvedItems = (items && items.length > 0) ? items : DEFAULT_ITEMS

  return (
    <Section appearance={appearance} background="ink">
      {/* Pill hover styles injected inline: zero JS, zero client bundle */}
      <style>{`
        .ind-pill:hover {
          border-color: var(--color-primary, #0c3bb9) !important;
          background: color-mix(in oklab, var(--color-primary, #0c3bb9) 12%, transparent) !important;
          color: var(--color-accent, #00aaff) !important;
        }
        .ind-pill:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 3px;
        }
      `}</style>

      <Container size="xl">
        {/* Header block */}
        <div>
          {resolvedEyebrow ? <Eyebrow>{resolvedEyebrow}</Eyebrow> : null}
          {resolvedHeadline ? (
            <h2 style={HEADLINE_STYLE}>{resolvedHeadline}</h2>
          ) : null}
        </div>

        {/* Pill band */}
        {resolvedItems.length > 0 ? (
          <div
            role="list"
            aria-label={resolvedHeadline || resolvedEyebrow || 'Industries'}
            style={BAND_STYLE}
          >
            {resolvedItems.map((name) => (
              <span
                key={name}
                role="listitem"
                className="ind-pill"
                style={PILL_BASE}
              >
                {name}
              </span>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
