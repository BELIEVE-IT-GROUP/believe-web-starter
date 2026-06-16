/**
 * BenefitsGrid — benefits-grid.custom
 *
 * 3-column grid of benefit cards. Each card leads with a large "big" label
 * (accent/green when direction is up, primary/orange when down) over a short
 * description. Replicates the big-number look of birdman-landing.html lines
 * 511-523. Server Component, theme tokens only, no Flowbite.
 *
 * Reference: birdman-landing.html lines 511-523.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BenefitsGridItem {
  /** Big label, e.g. "+ Productividad" or "- Incidencias". */
  label?: string
  description?: string
  /** up = positive (accent/green), down = reduction (primary/orange). */
  direction?: 'up' | 'down'
}

export interface BenefitsGridProps {
  eyebrow?: string
  headline?: string
  items?: BenefitsGridItem[]
  appearance?: BlockAppearance
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: BenefitsGridItem[] = [
  {
    label: '+ Productividad',
    description: 'Tu equipo se enfoca en lo estrategico, no en lo operativo.',
    direction: 'up',
  },
  {
    label: '+ Visibilidad',
    description: 'Cada envio y cada KPI, visibles en tiempo real.',
    direction: 'up',
  },
  {
    label: '+ Control',
    description: 'Un solo punto de mando sobre toda la operacion.',
    direction: 'up',
  },
  {
    label: '- Incidencias',
    description: 'Deteccion temprana y seguimiento hasta el cierre.',
    direction: 'down',
  },
  {
    label: '- Costo',
    description: 'Reduccion sostenida del costo logistico total.',
    direction: 'down',
  },
  {
    label: '+ Velocidad',
    description: 'Entregas mas rapidas y predecibles para tus clientes.',
    direction: 'up',
  },
]

// ─── Styles ───────────────────────────────────────────────────────────────────

/**
 * Dark section background so the neon labels pop. We use var(--brand-ink) as
 * the base and layer a subtle tinted glow from the primary color.
 */
const SECTION_STYLE: CSSProperties = {
  background: 'var(--brand-ink, #0a0a0a)',
  color: 'var(--brand-paper, #f5f5f0)',
  position: 'relative',
  overflow: 'hidden',
}

const HEADLINE_STYLE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
  lineHeight: 1.06,
  letterSpacing: 'var(--tracking-tight, -0.015em)',
  color: 'var(--brand-paper, #f5f5f0)',
  margin: '1rem 0 0',
}

const HEADER_STYLE: CSSProperties = {
  marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
}

/** Accent/green for "up" items. We map --color-accent to the green token. */
const COLOR_UP = 'var(--color-accent, #22c55e)'
/** Primary/orange for "down" items. */
const COLOR_DOWN = 'var(--color-primary, #0c3bb9)'

const BIG_LABEL_BASE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 900,
  fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
  lineHeight: 1,
  letterSpacing: 'var(--tracking-tight, -0.02em)',
  marginBottom: '0.875rem',
  display: 'block',
}

const DESCRIPTION_STYLE: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(0.9375rem, 1.2vw, 1.0625rem)',
  lineHeight: 1.65,
  color: 'var(--brand-ink-muted, rgb(255 255 255 / 0.58))',
  margin: 0,
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function BenefitCard({ item, index }: { item: BenefitsGridItem; index: number }) {
  const isUp = item.direction !== 'down'
  const accentColor = isUp ? COLOR_UP : COLOR_DOWN

  const card: CSSProperties = {
    padding: 'clamp(1.5rem, 3vw, 2.25rem)',
    borderRadius: 'var(--radius-card, 0.5rem)',
    background: 'var(--surface-card, rgb(255 255 255 / 0.03))',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    /* Stagger vertical offset for visual rhythm */
    marginTop: index % 3 === 1 ? 'clamp(1rem, 2vw, 1.75rem)' : '0',
  }

  return (
    <article style={card}>
      {item.label ? (
        <h3 style={{ ...BIG_LABEL_BASE, color: accentColor }}>
          {item.label}
        </h3>
      ) : null}
      {item.description ? (
        <p style={DESCRIPTION_STYLE}>{item.description}</p>
      ) : null}
    </article>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function BenefitsGrid({
  eyebrow = 'Beneficios',
  headline = 'Lo que cambia cuando operamos tu logistica',
  items,
  appearance,
}: BenefitsGridProps) {
  const safeItems =
    Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS

  return (
    <Section appearance={appearance} background="ink" style={SECTION_STYLE}>
      {/* Ambient glow, top-left */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: 'min(40rem, 55vw)',
          height: 'min(40rem, 55vw)',
          background:
            'radial-gradient(ellipse, color-mix(in oklab, var(--color-primary, #0c3bb9) 8%, transparent) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      {/* Ambient glow, bottom-right */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-8%',
          width: 'min(32rem, 45vw)',
          height: 'min(32rem, 45vw)',
          background:
            'radial-gradient(ellipse, color-mix(in oklab, var(--color-accent, #22c55e) 5%, transparent) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <Container size="xl" style={{ position: 'relative' }}>
        {/* Section header */}
        <header style={HEADER_STYLE}>
          {eyebrow ? (
            <div style={{ marginBottom: '1rem' }}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          ) : null}
          {headline ? <h2 style={HEADLINE_STYLE}>{headline}</h2> : null}
        </header>

        {/* Benefits grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(1rem, 2.5vw, 1.5rem)',
          }}
          className="benefits-grid"
        >
          {safeItems.map((item, i) => (
            <BenefitCard key={i} item={item} index={i} />
          ))}
        </div>
      </Container>

      {/* Responsive grid expansion (mobile-first: base 1 col, expand up) */}
      <style>{`
        @media (min-width: 541px) {
          .benefits-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 861px) {
          .benefits-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        .benefits-grid article:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
      `}</style>
    </Section>
  )
}
