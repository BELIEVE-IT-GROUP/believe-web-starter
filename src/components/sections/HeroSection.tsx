/**
 * HeroSection — the reference custom section (world-class craft).
 *
 * Ports the approved trust-demo quality: eyebrow, headline with an em-highlight
 * in the brand color, subheadline, badge, CTAs and an asymmetric stats panel.
 * Server Component (no interaction). This is the visual benchmark every other
 * section imitates.
 *
 * Variants:
 *   metrics    — default. Asymmetric two-column (copy + stats panel).
 *   split      — copy left, media/visual panel right.
 *   minimal    — centered, no stats, restrained.
 *   fullscreen — min-height 100vh, ink background, dramatic scale.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow } from './_primitives'
import type { BlockAppearance, CtaLink, MediaRef } from './types'

export interface HeroStat {
  value?: string
  label?: string
  description?: string
}

export interface HeroSectionProps {
  eyebrow?: string
  headline?: string
  /** Optional emphasized tail rendered in the brand color (Trust-style em). */
  headlineEmphasis?: string
  subheadline?: string
  badge?: string
  variant?: 'metrics' | 'split' | 'minimal' | 'fullscreen'
  ctas?: CtaLink[]
  stats?: HeroStat[]
  image?: MediaRef
  videoUrl?: string
  appearance?: BlockAppearance
}

// ─── Small internal helpers ──────────────────────────────────────────────────

function ctaText(c: CtaLink): string {
  return c.text ?? c.label ?? ''
}

const HEADLINE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  lineHeight: 1.02,
  letterSpacing: 'var(--tracking-tight, -0.02em)',
  margin: '0 0 1.75rem',
}

const SUBHEAD: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(1rem, 1.4vw, 1.1875rem)',
  lineHeight: 1.7,
  maxWidth: '34rem',
  margin: '0 0 2.5rem',
}

function CtaRow({ ctas, on }: { ctas: CtaLink[]; on: 'paper' | 'ink' }) {
  if (!ctas.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
      {ctas.map((c, i) => {
        const primary = i === 0 && c.style !== 'secondary' && c.style !== 'outline'
        const base: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-display, system-ui, sans-serif)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          padding: '1rem 1.875rem',
          borderRadius: 'var(--radius-button, 0.375rem)',
          textDecoration: 'none',
          transition: 'opacity 150ms ease, border-color 150ms ease',
        }
        const style: CSSProperties = primary
          ? {
              ...base,
              background: 'var(--color-primary, #0c3bb9)',
              color: 'var(--color-on-primary, #ffffff)',
              boxShadow: 'var(--shadow-button, none)',
            }
          : {
              ...base,
              background: 'transparent',
              color: on === 'ink' ? 'rgb(255 255 255 / 0.82)' : 'var(--brand-ink, #1a1a1a)',
              border:
                on === 'ink'
                  ? '1px solid rgb(255 255 255 / 0.22)'
                  : '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.18)',
            }
        return (
          <a
            key={i}
            href={c.url || '#'}
            target={c.newTab ? '_blank' : undefined}
            rel={c.newTab ? 'noopener noreferrer' : undefined}
            style={style}
          >
            {ctaText(c)}
            {primary ? <span aria-hidden>&rarr;</span> : null}
          </a>
        )
      })}
    </div>
  )
}

function StatsPanel({ stats, on }: { stats: HeroStat[]; on: 'paper' | 'ink' }) {
  if (!stats.length) return null
  const borderCol = on === 'ink' ? 'rgb(255 255 255 / 0.08)' : 'rgb(from var(--brand-ink,#1a1a1a) r g b / 0.10)'
  const labelCol = 'var(--color-primary, #0c3bb9)'
  const numCol = on === 'ink' ? 'var(--brand-paper, #ffffff)' : 'var(--brand-ink, #1a1a1a)'
  const subCol = on === 'ink' ? 'rgb(255 255 255 / 0.45)' : 'rgb(from var(--brand-ink,#1a1a1a) r g b / 0.5)'

  return (
    <div style={{ border: `1px solid ${borderCol}` }}>
      {stats.slice(0, 4).map((s, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            padding: '1.75rem 2rem',
            borderBottom: i === stats.length - 1 ? 'none' : `1px solid ${borderCol}`,
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              top: '1.75rem',
              bottom: '1.75rem',
              width: '3px',
              background: 'var(--color-primary, #0c3bb9)',
            }}
          />
          <div
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1,
              color: numCol,
              marginBottom: '0.3rem',
            }}
          >
            {s.value}
          </div>
          {s.label ? (
            <div
              style={{
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: labelCol,
              }}
            >
              {s.label}
            </div>
          ) : null}
          {s.description ? (
            <div style={{ fontSize: '0.8125rem', color: subCol, marginTop: '0.2rem', lineHeight: 1.4 }}>
              {s.description}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function VisualPanel({ image, on }: { image?: MediaRef; on: 'paper' | 'ink' }) {
  const frame = on === 'ink' ? 'rgb(255 255 255 / 0.08)' : 'rgb(from var(--brand-ink,#1a1a1a) r g b / 0.08)'
  if (image?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.url}
        alt={image.alt || ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 'var(--radius-card, 0.5rem)',
          border: `1px solid ${frame}`,
          display: 'block',
        }}
      />
    )
  }
  // Graceful placeholder when no media: a quiet branded panel, not a broken img.
  return (
    <div
      aria-hidden
      style={{
        width: '100%',
        minHeight: '20rem',
        height: '100%',
        borderRadius: 'var(--radius-card, 0.5rem)',
        border: `1px solid ${frame}`,
        background:
          'radial-gradient(120% 100% at 80% 0%, color-mix(in oklab, var(--color-primary, #0c3bb9) 14%, transparent) 0%, transparent 60%)',
      }}
    />
  )
}

// ─── Headline renderer (em-highlight) ────────────────────────────────────────

function Headline({ text, emphasis, size }: { text?: string; emphasis?: string; size: string }) {
  if (!text && !emphasis) return null
  return (
    <h1 style={{ ...HEADLINE, fontSize: size }}>
      {text}
      {emphasis ? (
        <>
          {text ? <br /> : null}
          <em style={{ fontStyle: 'normal', color: 'var(--color-primary, #0c3bb9)' }}>{emphasis}</em>
        </>
      ) : null}
    </h1>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HeroSection({
  eyebrow,
  headline,
  headlineEmphasis,
  subheadline,
  badge,
  variant = 'metrics',
  ctas = [],
  stats = [],
  image,
  videoUrl,
  appearance,
}: HeroSectionProps) {
  const safeCtas = (ctas ?? []).filter((c) => ctaText(c))
  const safeStats = (stats ?? []).filter((s) => s.value || s.label)
  const isDark = variant === 'fullscreen'
  const on: 'paper' | 'ink' = isDark ? 'ink' : 'paper'

  const sectionBase: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: isDark ? 'var(--brand-ink, #0a0a0a)' : 'var(--brand-paper, #fafaf7)',
    color: isDark ? 'var(--brand-paper, #fafaf7)' : 'var(--brand-ink, #1a1a1a)',
    paddingTop: variant === 'fullscreen' ? 0 : 'var(--hero-padding-y, 8rem)',
    paddingBottom: variant === 'fullscreen' ? 0 : 'calc(var(--hero-padding-y, 8rem) * 0.7)',
    minHeight: variant === 'fullscreen' ? '100vh' : undefined,
    display: variant === 'fullscreen' ? 'grid' : undefined,
    alignItems: variant === 'fullscreen' ? 'center' : undefined,
  }

  const badgeNode = badge ? (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-primary, #0c3bb9)',
        background: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 10%, transparent)',
        padding: '0.4rem 0.75rem',
        borderRadius: 'var(--radius-full, 9999px)',
        marginBottom: '1.5rem',
      }}
    >
      {badge}
    </span>
  ) : null

  // ── Centered minimal variant ──────────────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <section id={appearance?.sectionId || undefined} style={sectionBase}>
        <Container size="md" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {badgeNode}
          {eyebrow ? (
            <div style={{ marginBottom: '1.25rem' }}>
              <Eyebrow rule={false}>{eyebrow}</Eyebrow>
            </div>
          ) : null}
          <Headline text={headline} emphasis={headlineEmphasis} size="clamp(2.5rem, 5.5vw, 4.5rem)" />
          {subheadline ? (
            <p style={{ ...SUBHEAD, marginLeft: 'auto', marginRight: 'auto', color: 'rgb(from var(--brand-ink,#1a1a1a) r g b / 0.62)' }}>
              {subheadline}
            </p>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CtaRow ctas={safeCtas} on={on} />
          </div>
        </Container>
      </section>
    )
  }

  // ── Two-column variants (metrics / split / fullscreen) ─────────────────────
  const rightCol =
    variant === 'split' ? (
      <VisualPanel image={image} on={on} />
    ) : (
      <StatsPanel stats={safeStats} on={on} />
    )

  const subColor = isDark ? 'rgb(255 255 255 / 0.62)' : 'rgb(from var(--brand-ink,#1a1a1a) r g b / 0.62)'

  return (
    <section id={appearance?.sectionId || undefined} style={sectionBase}>
      {/* Soft brand glow, top-right (Trust signature, no hard gradient text) */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '-18%',
          right: '-8%',
          width: 'min(46rem, 60vw)',
          height: 'min(46rem, 60vw)',
          background:
            'radial-gradient(ellipse, color-mix(in oklab, var(--color-primary, #0c3bb9) 10%, transparent) 0%, transparent 62%)',
          pointerEvents: 'none',
        }}
      />
      <Container
        size="xl"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
          gap: 'clamp(2.5rem, 5vw, 5.5rem)',
          alignItems: 'center',
        }}
        className="hero-two-col"
      >
        <div>
          {badgeNode}
          {eyebrow ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          ) : null}
          <Headline text={headline} emphasis={headlineEmphasis} size="clamp(2.75rem, 5.5vw, 5rem)" />
          {subheadline ? <p style={{ ...SUBHEAD, color: subColor }}>{subheadline}</p> : null}
          <CtaRow ctas={safeCtas} on={on} />
        </div>
        <div>{rightCol}</div>
      </Container>

      {videoUrl ? (
        <Container size="xl" style={{ marginTop: '3rem' }}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '16 / 9',
              borderRadius: 'var(--radius-card, 0.5rem)',
              overflow: 'hidden',
              border: isDark ? '1px solid rgb(255 255 255 / 0.1)' : '1px solid rgb(from var(--brand-ink,#1a1a1a) r g b / 0.08)',
            }}
          >
            <iframe
              src={videoUrl}
              title={headline || 'Video'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </Container>
      ) : null}

      {/* Collapse the asymmetric grid on small screens. */}
      <style>{`
        @media (max-width: 860px) {
          .hero-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
