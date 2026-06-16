/**
 * FeatureGrid (features.custom, world-class craft).
 *
 * Ports the approved trust-demo quality into a reusable, theme-skinned section.
 * Server Component (no interaction). Three intentional layouts, each with its
 * own hierarchy instead of a uniform card grid:
 *
 *   grid:        editorial. The first item is a featured lede (wider, optional
 *                media); the rest fall into a hairline-divided mosaic.
 *   pillars:     ink background, 2x2 grid. Big mono `code` (POD / SLA / COD /
 *                Panel) over title + description (the trust-demo pilares look).
 *   alternating: zig-zag rows. Copy and media swap sides row by row, numbered
 *                for rhythm, with a quiet branded panel when media is absent.
 *
 * Pure theme tokens (var(--color-primary), var(--font-display), --brand-ink ...)
 * so each tenant skins it via the CSS vars injected in <head>. No Flowbite,
 * no hardcoded hex except as var() fallbacks.
 */

import type { CSSProperties, ReactNode } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance, MediaRef } from './types'

export interface FeatureGridItem {
  /** Heroicon name (e.g. "bolt") or an emoji/glyph. Rendered gracefully either way. */
  icon?: string
  title?: string
  description?: string
  image?: MediaRef
  /** For variant "pillars": short code label, e.g. "POD", "SLA". */
  code?: string
}

export interface FeatureGridProps {
  eyebrow?: string
  headline?: string
  /** Optional tail rendered in the brand color (Trust-style em highlight). */
  headlineEmphasis?: string
  subheadline?: string
  layout?: string
  variant?: 'grid' | 'pillars' | 'alternating'
  items?: FeatureGridItem[]
  appearance?: BlockAppearance
}

// ─── Shared type-scale (display ratio >= 1.25 between tiers) ──────────────────

const HEADLINE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 700,
  fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
  lineHeight: 1.06,
  letterSpacing: 'var(--tracking-tight, -0.015em)',
  margin: '1.1rem 0 0',
  maxWidth: '20ch',
  textWrap: 'balance',
}

const SUBHEAD: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(1rem, 1.3vw, 1.0625rem)',
  lineHeight: 1.7,
  maxWidth: '38rem',
  margin: '1.1rem 0 0',
}

// Hairline color tuned per surface (paper vs ink).
function hairline(on: 'paper' | 'ink'): string {
  return on === 'ink'
    ? 'color-mix(in srgb, var(--brand-paper, #fafaf7) 9%, transparent)'
    : 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.10)'
}

function mutedColor(on: 'paper' | 'ink'): string {
  return on === 'ink'
    ? 'color-mix(in srgb, var(--brand-paper, #fafaf7) 60%, transparent)'
    : 'var(--brand-ink-muted, #6b6b65)'
}

function titleColor(on: 'paper' | 'ink'): string {
  return on === 'ink' ? 'var(--brand-paper, #fafaf7)' : 'var(--brand-ink, #1a1a1a)'
}

// ─── Icon mark ────────────────────────────────────────────────────────────────
//
// `icon` may be an emoji ("📦") or a heroicon-style name ("bolt", "shield-check").
// Without an icon dependency we render emoji/glyphs verbatim and turn names into a
// tasteful 2-letter monospace mark. Either way it never breaks the layout.

function isGlyph(icon: string): boolean {
  const trimmed = icon.trim()
  // Any character outside the Latin/ASCII range (covers emoji, arrows, symbols).
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed.charCodeAt(i) > 0x24f) return true
  }
  // A short pure-symbol token (e.g. "→", "*") with no letters/digits.
  return trimmed.length <= 2 && !/[a-z0-9]/i.test(trimmed)
}

function nameToMark(name: string): string {
  const cleaned = name.replace(/[^a-z]/gi, '')
  if (!cleaned) return '◆'
  return cleaned.slice(0, 2).toUpperCase()
}

function IconMark({ icon, on }: { icon?: string; on: 'paper' | 'ink' }) {
  if (!icon) return null
  const glyph = isGlyph(icon)
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.75rem',
        height: '2.75rem',
        flexShrink: 0,
        borderRadius: 'var(--radius-md, 0.5rem)',
        fontSize: glyph ? '1.5rem' : '0.8125rem',
        fontWeight: 700,
        lineHeight: 1,
        fontFamily: glyph
          ? 'inherit'
          : 'var(--font-mono, ui-monospace, monospace)',
        letterSpacing: glyph ? 0 : '0.04em',
        color: 'var(--color-primary, #0c3bb9)',
        background: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 10%, transparent)',
      }}
    >
      {glyph ? icon : nameToMark(icon)}
    </span>
  )
}

// ─── Section header (eyebrow + headline + subheadline) ───────────────────────

function Header({
  eyebrow,
  headline,
  headlineEmphasis,
  subheadline,
  on,
  align = 'left',
  maxWidth,
}: {
  eyebrow?: string
  headline?: string
  headlineEmphasis?: string
  subheadline?: string
  on: 'paper' | 'ink'
  align?: 'left' | 'center'
  maxWidth?: string
}) {
  if (!eyebrow && !headline && !headlineEmphasis && !subheadline) return null
  const centered = align === 'center'
  return (
    <div
      style={{
        maxWidth: maxWidth ?? (centered ? '42rem' : '46rem'),
        marginLeft: centered ? 'auto' : undefined,
        marginRight: centered ? 'auto' : undefined,
        textAlign: centered ? 'center' : undefined,
      }}
    >
      {eyebrow ? <Eyebrow rule={!centered}>{eyebrow}</Eyebrow> : null}
      {headline || headlineEmphasis ? (
        <h2
          style={{
            ...HEADLINE,
            color: titleColor(on),
            marginLeft: centered ? 'auto' : undefined,
            marginRight: centered ? 'auto' : undefined,
          }}
        >
          {headline}
          {headlineEmphasis ? (
            <>
              {headline ? ' ' : null}
              <em style={{ fontStyle: 'normal', color: 'var(--color-primary, #0c3bb9)' }}>
                {headlineEmphasis}
              </em>
            </>
          ) : null}
        </h2>
      ) : null}
      {subheadline ? (
        <p
          style={{
            ...SUBHEAD,
            color: mutedColor(on),
            marginLeft: centered ? 'auto' : undefined,
            marginRight: centered ? 'auto' : undefined,
          }}
        >
          {subheadline}
        </p>
      ) : null}
    </div>
  )
}

// ─── Media frame (graceful placeholder when no image) ────────────────────────

function MediaFrame({
  image,
  on,
  minHeight = '16rem',
}: {
  image?: MediaRef
  on: 'paper' | 'ink'
  minHeight?: string
}) {
  const frame = hairline(on)
  if (image?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.url}
        alt={image.alt || ''}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          minHeight,
          objectFit: 'cover',
          borderRadius: 'var(--radius-card, 0.5rem)',
          border: `1px solid ${frame}`,
          display: 'block',
        }}
      />
    )
  }
  return (
    <div
      aria-hidden
      style={{
        width: '100%',
        minHeight,
        height: '100%',
        borderRadius: 'var(--radius-card, 0.5rem)',
        border: `1px solid ${frame}`,
        background:
          'radial-gradient(120% 100% at 82% 0%, color-mix(in oklab, var(--color-primary, #0c3bb9) 12%, transparent) 0%, transparent 60%)',
      }}
    />
  )
}

// ─── Empty-state guard ───────────────────────────────────────────────────────

function EmptyNote({ on }: { on: 'paper' | 'ink' }) {
  return (
    <p
      style={{
        marginTop: '2rem',
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        fontSize: '0.8125rem',
        color: mutedColor(on),
      }}
    >
      No hay elementos para mostrar todavía.
    </p>
  )
}

// ─── Variant: grid (editorial, asymmetric) ───────────────────────────────────

function GridVariant({
  items,
  header,
  on,
}: {
  items: FeatureGridItem[]
  header: ReactNode
  on: 'paper' | 'ink'
}) {
  const line = hairline(on)
  const [lede, ...rest] = items
  const hasLede = Boolean(lede)

  function Cell({ item, featured }: { item: FeatureGridItem; featured?: boolean }) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          padding: featured ? '0' : '0.25rem 0',
        }}
      >
        <IconMark icon={item.icon} on={on} />
        {item.title ? (
          <h3
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontWeight: 700,
              fontSize: featured ? 'clamp(1.35rem, 2.2vw, 1.65rem)' : '1.1875rem',
              lineHeight: 1.18,
              letterSpacing: 'var(--tracking-tight, -0.015em)',
              color: titleColor(on),
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
              fontSize: featured ? '1.0625rem' : '0.9375rem',
              lineHeight: 1.65,
              color: mutedColor(on),
              margin: 0,
              maxWidth: '34rem',
            }}
          >
            {item.description}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <>
      {header ? <div style={{ marginBottom: 'clamp(2.75rem, 5vw, 4rem)' }}>{header}</div> : null}

      {/* Featured lede row: copy + optional media, asymmetric. */}
      {hasLede ? (
        <div
          className="fg-grid-lede"
          style={{
            display: 'grid',
            gridTemplateColumns: lede.image?.url ? 'minmax(0, 1.05fr) minmax(0, 0.95fr)' : '1fr',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'center',
            paddingBottom: rest.length ? 'clamp(2.5rem, 4vw, 3.5rem)' : 0,
            borderBottom: rest.length ? `1px solid ${line}` : 'none',
          }}
        >
          <Cell item={lede} featured />
          {lede.image?.url ? <MediaFrame image={lede.image} on={on} minHeight="18rem" /> : null}
        </div>
      ) : null}

      {/* Remaining items: hairline-divided mosaic, no repeated boxes. */}
      {rest.length ? (
        <div
          className="fg-grid-rest"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            columnGap: 'clamp(2rem, 4vw, 3.5rem)',
            rowGap: 'clamp(2.25rem, 4vw, 3rem)',
            marginTop: hasLede ? 'clamp(2.5rem, 4vw, 3.5rem)' : 0,
          }}
        >
          {rest.map((item, i) => (
            <Cell key={i} item={item} />
          ))}
        </div>
      ) : null}

      <style>{`
        @media (max-width: 880px) {
          .fg-grid-lede { grid-template-columns: 1fr !important; }
          .fg-grid-rest { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 560px) {
          .fg-grid-rest { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

// ─── Variant: pillars (2x2 mono code, ink surface) ───────────────────────────

function PillarsVariant({
  items,
  header,
}: {
  items: FeatureGridItem[]
  header: ReactNode
}) {
  // Ink surface for pillars (trust-demo pilares). 1px gap reveals the grid lines.
  const cellBg = 'var(--brand-ink, #0a0a0a)'
  const gridLine = 'color-mix(in srgb, var(--brand-paper, #fafaf7) 7%, transparent)'

  return (
    <>
      {header ? <div style={{ marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>{header}</div> : null}
      <div
        className="fg-pillars"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '1px',
          background: gridLine,
          border: `1px solid ${gridLine}`,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: cellBg,
              padding: 'clamp(2rem, 3.5vw, 3rem) clamp(1.75rem, 3vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {item.code ? (
              <span
                style={{
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-primary, #0c3bb9)',
                  marginBottom: '1.25rem',
                }}
              >
                {item.code}
              </span>
            ) : item.icon ? (
              <span style={{ marginBottom: '1.25rem' }}>
                <IconMark icon={item.icon} on="ink" />
              </span>
            ) : null}
            {item.title ? (
              <h3
                style={{
                  fontFamily: 'var(--font-display, system-ui, sans-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: 'var(--tracking-tight, -0.015em)',
                  color: 'var(--brand-paper, #fafaf7)',
                  margin: '0 0 0.75rem',
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
                  color: 'color-mix(in srgb, var(--brand-paper, #fafaf7) 62%, transparent)',
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 680px) {
          .fg-pillars { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

// ─── Variant: alternating (zig-zag rows) ─────────────────────────────────────

function AlternatingVariant({
  items,
  header,
  on,
}: {
  items: FeatureGridItem[]
  header: ReactNode
  on: 'paper' | 'ink'
}) {
  return (
    <>
      {header ? <div style={{ marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>{header}</div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3.5rem, 7vw, 6rem)' }}>
        {items.map((item, i) => {
          const flip = i % 2 === 1
          return (
            <div
              key={i}
              className={`fg-alt-row${flip ? ' fg-alt-flip' : ''}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: 'clamp(2rem, 5vw, 4.5rem)',
                alignItems: 'center',
              }}
            >
              {/* Copy column */}
              <div style={{ order: flip ? 2 : 1 }}>
                <span
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: 'var(--tracking-wide, 0.2em)',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary, #0c3bb9)',
                    marginBottom: '1.1rem',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '1.75rem',
                      height: '2px',
                      background: 'var(--color-primary, #0c3bb9)',
                    }}
                  />
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.title ? (
                  <h3
                    style={{
                      fontFamily: 'var(--font-display, system-ui, sans-serif)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.5rem, 2.6vw, 2rem)',
                      lineHeight: 1.14,
                      letterSpacing: 'var(--tracking-tight, -0.015em)',
                      color: titleColor(on),
                      margin: '0 0 1rem',
                    }}
                  >
                    {item.title}
                  </h3>
                ) : null}
                {item.description ? (
                  <p
                    style={{
                      fontFamily: 'var(--font-body, system-ui, sans-serif)',
                      fontSize: '1.0625rem',
                      lineHeight: 1.7,
                      color: mutedColor(on),
                      margin: 0,
                      maxWidth: '32rem',
                    }}
                  >
                    {item.description}
                  </p>
                ) : null}
              </div>
              {/* Media column */}
              <div style={{ order: flip ? 1 : 2 }}>
                <MediaFrame image={item.image} on={on} minHeight="17rem" />
              </div>
            </div>
          )
        })}
      </div>
      <style>{`
        @media (max-width: 820px) {
          .fg-alt-row { grid-template-columns: 1fr !important; }
          .fg-alt-row > div:nth-child(1) { order: 1 !important; }
          .fg-alt-row > div:nth-child(2) { order: 2 !important; }
        }
      `}</style>
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function FeatureGrid({
  eyebrow,
  headline,
  headlineEmphasis,
  subheadline,
  variant = 'grid',
  items,
  appearance,
}: FeatureGridProps) {
  const safeItems = (items ?? []).filter(
    (it) => it && (it.title || it.description || it.code || it.icon || it.image?.url),
  )
  const isPillars = variant === 'pillars'

  // Pillars renders its own ink surface, so the Section stays on paper and we
  // center the header. Other variants live directly on the paper surface.
  const on: 'paper' | 'ink' = 'paper'

  const header = (
    <Header
      eyebrow={eyebrow}
      headline={headline}
      headlineEmphasis={headlineEmphasis}
      subheadline={subheadline}
      on={on}
      align={isPillars ? 'center' : 'left'}
    />
  )

  let body: ReactNode
  if (!safeItems.length) {
    body = (
      <>
        {header}
        <EmptyNote on={on} />
      </>
    )
  } else if (variant === 'pillars') {
    body = <PillarsVariant items={safeItems} header={header} />
  } else if (variant === 'alternating') {
    body = <AlternatingVariant items={safeItems} header={header} on={on} />
  } else {
    body = <GridVariant items={safeItems} header={header} on={on} />
  }

  return (
    <Section appearance={appearance} background="paper">
      <Container>{body}</Container>
    </Section>
  )
}
