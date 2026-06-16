/**
 * SolutionsList (solutions-list.custom)
 *
 * Editorial list of solutions: each item is a row with the title in a narrow
 * left column (~220px) and the body on the right, separated by a hairline top
 * border. Some items surface chips (pills) under the body. Body copy may carry
 * one emphasized clause rendered in bold with a brand-color tint.
 *
 * Reference: birdman-landing.html lines 464-494.
 * Theme: DARK (brand-paper dark, brand-ink light) via tokens only.
 * Server Component (no interaction). No Flowbite.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SolutionsListItem {
  title?: string
  /** Body copy; the component renders an inner emphasized clause in bold. */
  body?: string
  /** Optional emphasized clause appended in the brand color and bold. */
  emphasis?: string
  chips?: string[]
}

export interface SolutionsListProps {
  eyebrow?: string
  headline?: string
  items?: SolutionsListItem[]
  appearance?: BlockAppearance
}

// ─── Default content (values from HTML reference) ────────────────────────────

const DEFAULT_ITEMS: SolutionsListItem[] = [
  {
    title: 'Gestión Integral',
    body: 'Administramos toda la operación logística por ti: planeación, ejecución, control y reporteo.',
    emphasis: 'Tu equipo deja de apagar incendios y empieza a tomar decisiones.',
  },
  {
    title: 'Optimización Operativa',
    body: 'Rediseñamos procesos para',
    emphasis: 'reducir tiempos y costos',
  },
  {
    title: 'Tecnología',
    body: 'Toda la operación en una sola plataforma de control.',
    chips: ['Dashboard', 'KPIs en vivo', 'Tracking', 'Alertas', 'Reportes'],
  },
  {
    title: 'Operación Inplant',
    body: 'Personal especializado operando',
    emphasis: 'dentro de las instalaciones del cliente',
  },
  {
    title: 'Integración con aliados',
    body: 'Una red coordinada bajo un mismo estándar de servicio.',
    chips: ['Transportistas', 'Almacenes', 'Última milla', 'Cross-dock'],
  },
]

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Render body copy with an optional emphasized tail.
 * Emphasis is shown in bold with a brand-primary tint.
 * Works for: "prefix body, emphasis." and bare emphasis-only strings.
 */
function BodyText({
  body,
  emphasis,
  inkMuted,
  inkEmphasis,
}: {
  body?: string
  emphasis?: string
  inkMuted: string
  inkEmphasis: string
}) {
  if (!body && !emphasis) return null

  const bodyStyle: CSSProperties = {
    fontFamily: 'var(--font-body, system-ui, sans-serif)',
    fontSize: 'clamp(0.9375rem, 1.15vw, 1.0625rem)',
    lineHeight: 1.7,
    color: inkMuted,
    margin: 0,
  }

  const emStyle: CSSProperties = {
    fontWeight: 700,
    color: inkEmphasis,
    fontStyle: 'normal',
  }

  if (!emphasis) {
    return <p style={bodyStyle}>{body}</p>
  }

  // Body trailing with space then bold emphasis
  return (
    <p style={bodyStyle}>
      {body ? <>{body} </> : null}
      <strong style={emStyle}>{emphasis}</strong>
      {body ? '.' : null}
    </p>
  )
}

/** Pill chips row shown beneath the body of certain items. */
function ChipsRow({ chips, border, text }: { chips: string[]; border: string; text: string }) {
  if (!chips.length) return null
  return (
    <div
      role="list"
      aria-label="Capacidades"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: '1rem',
      }}
    >
      {chips.map((chip) => (
        <span
          key={chip}
          role="listitem"
          style={{
            fontFamily: 'var(--font-mono, ui-monospace, monospace)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: text,
            padding: '0.35rem 0.75rem',
            border: `1px solid ${border}`,
            borderRadius: 'var(--radius-full, 9999px)',
            whiteSpace: 'nowrap',
          }}
        >
          {chip}
        </span>
      ))}
    </div>
  )
}

/** Single solution row: narrow title left, body right, hairline border on top. */
function SolutionRow({
  item,
  index,
  total,
  borderColor,
  inkMuted,
  inkEmphasis,
  chipBorder,
  chipText,
  titleColor,
}: {
  item: SolutionsListItem
  index: number
  total: number
  borderColor: string
  inkMuted: string
  inkEmphasis: string
  chipBorder: string
  chipText: string
  titleColor: string
}) {
  const isLast = index === total - 1

  return (
    <div
      className="solutions-row"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)',
        gap: 'clamp(1.5rem, 3vw, 3.5rem)',
        paddingTop: 'clamp(1.5rem, 2.5vw, 2.25rem)',
        paddingBottom: isLast ? 0 : 'clamp(1.5rem, 2.5vw, 2.25rem)',
        borderTop: `1px solid ${borderColor}`,
        alignItems: 'start',
      }}
    >
      {/* Left: title */}
      <h3
        style={{
          fontFamily: 'var(--font-display, system-ui, sans-serif)',
          fontWeight: 700,
          fontSize: 'clamp(0.9375rem, 1.15vw, 1.0625rem)',
          lineHeight: 1.3,
          letterSpacing: 'var(--tracking-tight, -0.01em)',
          color: titleColor,
          margin: 0,
          paddingTop: '0.1rem', // Optical alignment with body text cap height
        }}
      >
        {item.title}
      </h3>

      {/* Right: body + optional chips */}
      <div>
        <BodyText
          body={item.body}
          emphasis={item.emphasis}
          inkMuted={inkMuted}
          inkEmphasis={inkEmphasis}
        />
        {item.chips?.length ? (
          <ChipsRow chips={item.chips} border={chipBorder} text={chipText} />
        ) : null}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SolutionsList({
  eyebrow = 'Soluciones',
  headline = 'Diseñamos, operamos y optimizamos toda la cadena',
  items,
  appearance,
}: SolutionsListProps) {
  const safeItems = (items ?? DEFAULT_ITEMS).filter(
    (item) => item.title || item.body || item.chips?.length,
  )

  // Dark theme token aliases
  // brand-paper = dark background, brand-ink = light text in dark theme
  const borderColor = 'var(--solutions-border, rgb(255 255 255 / 0.10))'
  const inkMuted = 'var(--brand-ink-muted, rgb(255 255 255 / 0.60))'
  const titleColor = 'var(--brand-ink, #fafaf7)'
  const inkEmphasis = 'var(--color-primary, #00aaff)'
  const chipBorder = 'var(--chip-border, rgb(255 255 255 / 0.18))'
  const chipText = 'var(--brand-ink, #fafaf7)'

  const headlineStyle: CSSProperties = {
    fontFamily: 'var(--font-display, system-ui, sans-serif)',
    fontWeight: 800,
    fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
    lineHeight: 1.06,
    letterSpacing: 'var(--tracking-tight, -0.015em)',
    color: 'var(--brand-ink, #fafaf7)',
    margin: '1.1rem 0 0',
  }

  return (
    <Section appearance={appearance} background="ink">
      <Container>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(2.5rem, 4vw, 4rem)' }}>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {headline ? <h2 style={headlineStyle}>{headline}</h2> : null}
        </div>

        {/* Solutions list */}
        {safeItems.length > 0 ? (
          <div role="list" aria-label="Lista de soluciones">
            {safeItems.map((item, i) => (
              <div key={`${item.title ?? i}-${i}`} role="listitem">
                <SolutionRow
                  item={item}
                  index={i}
                  total={safeItems.length}
                  borderColor={borderColor}
                  inkMuted={inkMuted}
                  inkEmphasis={inkEmphasis}
                  chipBorder={chipBorder}
                  chipText={chipText}
                  titleColor={titleColor}
                />
              </div>
            ))}
          </div>
        ) : null}
      </Container>

      {/* Collapse the two-column row to single column on small screens */}
      <style>{`
        @media (max-width: 600px) {
          .solutions-row {
            grid-template-columns: 1fr !important;
            gap: 0.625rem !important;
          }
        }
      `}</style>
    </Section>
  )
}
