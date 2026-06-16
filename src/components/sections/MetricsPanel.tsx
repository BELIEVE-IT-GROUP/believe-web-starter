/**
 * MetricsPanel: stats.custom
 *
 * Displays large display numbers with earned context, avoiding the generic
 * hero-metric cliche. Each metric gets a value, a label, and a description
 * so the number means something, not just floats in a vacuum.
 *
 * Layout: ink background, asymmetric grid (header left, metrics right on desktop),
 * collapses to stacked on mobile. No side-stripe borders, no gradient text,
 * no glassmorphism.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

export interface MetricsPanelItem {
  value?: string
  label?: string
  description?: string
  icon?: string
}

export interface MetricsPanelProps {
  eyebrow?: string
  headline?: string
  items?: MetricsPanelItem[]
  appearance?: BlockAppearance
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

const DIVIDER: CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border-subtle, rgb(255 255 255 / 0.07))',
  margin: 0,
}

/**
 * A single metric cell: value in display scale, label in primary, description
 * in muted paper. No side stripe (the accent shows via the value color).
 */
function MetricCell({
  item,
  index,
  total,
}: {
  item: MetricsPanelItem
  index: number
  total: number
}) {
  if (!item.value && !item.label) return null

  const isLast = index === total - 1

  return (
    <div
      style={{
        padding: 'clamp(1.75rem, 3vw, 2.5rem) 0',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle, rgb(255 255 255 / 0.07))',
      }}
    >
      {/* Optional icon: rendered as aria-hidden decorative text */}
      {item.icon ? (
        <span
          aria-hidden
          style={{
            display: 'block',
            fontSize: '1.375rem',
            marginBottom: '0.875rem',
            lineHeight: 1,
          }}
        >
          {item.icon}
        </span>
      ) : null}

      {/* The number: display font, large, primary accent */}
      {item.value ? (
        <div
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: 'var(--tracking-tight, -0.02em)',
            color: 'var(--color-accent, #00aaff)',
            marginBottom: '0.5rem',
          }}
        >
          {item.value}
        </div>
      ) : null}

      {/* Label: display font, smaller, warm paper */}
      {item.label ? (
        <div
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--brand-paper, #fafaf7)',
            marginBottom: item.description ? '0.375rem' : 0,
            lineHeight: 1.3,
          }}
        >
          {item.label}
        </div>
      ) : null}

      {/* Description: body font, muted, gives the number context */}
      {item.description ? (
        <div
          style={{
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
            fontSize: 'var(--text-small, 0.875rem)',
            color: 'var(--brand-ink-muted, rgb(250 250 247 / 0.45))',
            lineHeight: 'var(--leading-body, 1.6)',
            maxWidth: '28ch',
          }}
        >
          {item.description}
        </div>
      ) : null}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MetricsPanel({ eyebrow, headline, items = [], appearance }: MetricsPanelProps) {
  const safeItems = (items ?? []).filter((it) => it.value || it.label)

  // Split items into two columns for a more editorial layout when 4+ items.
  // 1-2 items: single column spanning full right side.
  // 3+ items: split into left/right columns of roughly equal size.
  const useTwoCol = safeItems.length >= 3
  const midpoint = Math.ceil(safeItems.length / 2)
  const col1 = useTwoCol ? safeItems.slice(0, midpoint) : safeItems
  const col2 = useTwoCol ? safeItems.slice(midpoint) : []

  return (
    <Section appearance={appearance} background="ink">
      {/* Quiet radial brand glow behind the content */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 15% 50%, color-mix(in oklab, var(--color-primary, #0c3bb9) 12%, transparent) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container style={{ position: 'relative' }}>
        {/*
         * Two-zone layout: header (left ~40%) and metric grid (right ~60%).
         * On mobile both zones stack vertically.
         */}
        <div className="mp-outer">
          {/* ── Left: label + headline ───────────────────────────────────── */}
          {(eyebrow || headline) ? (
            <div className="mp-header">
              {eyebrow ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <Eyebrow>{eyebrow}</Eyebrow>
                </div>
              ) : null}

              {headline ? (
                <h2
                  style={{
                    fontFamily: 'var(--font-display, system-ui, sans-serif)',
                    fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)',
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: 'var(--tracking-tight, -0.02em)',
                    color: 'var(--brand-paper, #fafaf7)',
                    margin: 0,
                  }}
                >
                  {headline}
                </h2>
              ) : null}

              {/* Decorative thin horizontal rule below headline */}
              {headline ? (
                <hr
                  aria-hidden
                  style={{
                    ...DIVIDER,
                    marginTop: 'clamp(2rem, 4vw, 3rem)',
                    width: '2.5rem',
                    borderTopColor: 'var(--color-accent, #00aaff)',
                    opacity: 0.6,
                  }}
                />
              ) : null}
            </div>
          ) : null}

          {/* ── Right: metric grid ────────────────────────────────────────── */}
          {safeItems.length > 0 ? (
            <div
              className="mp-metrics"
              style={{
                display: 'grid',
                gridTemplateColumns: useTwoCol ? '1fr 1fr' : '1fr',
                gap: '0 clamp(2rem, 4vw, 3.5rem)',
              }}
            >
              {/* Column 1 */}
              <div>
                {col1.map((item, i) => (
                  <MetricCell
                    key={`c1-${i}`}
                    item={item}
                    index={i}
                    total={col1.length}
                  />
                ))}
              </div>

              {/* Column 2 (only when useTwoCol) */}
              {useTwoCol && col2.length > 0 ? (
                <div
                  style={{
                    // Offset the second column slightly down for visual rhythm
                    paddingTop: 'clamp(1.75rem, 3vw, 2.5rem)',
                  }}
                >
                  {col2.map((item, i) => (
                    <MetricCell
                      key={`c2-${i}`}
                      item={item}
                      index={i}
                      total={col2.length}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>

      {/* Responsive layout: outer grid collapses header above metrics on mobile */}
      <style>{`
        .mp-outer {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(3rem, 6vw, 6rem);
          align-items: start;
        }
        .mp-header {
          position: sticky;
          top: 2rem;
        }
        @media (max-width: 800px) {
          .mp-outer {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .mp-header {
            position: static;
          }
        }
        @media (max-width: 480px) {
          .mp-metrics {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Section>
  )
}
