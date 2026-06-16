/**
 * LogoBar — logo-cloud.custom (templateId: logo-cloud.custom, blockType: logo-cloud)
 *
 * Horizontal logo band. Optional marquee when `animate` is true.
 * Logos are grayscale by default, transitioning to full color on hover.
 * Server Component: animation runs entirely in CSS via an inline <style> tag.
 */

import type { CSSProperties } from 'react'

import { Container, Section } from './_primitives'
import type { BlockAppearance, MediaRef } from './types'

// ─── Public interface ──────────────────────────────────────────────────────────

export interface LogoBarLogo {
  image?: MediaRef
  alt?: string
  url?: string
}

export interface LogoBarProps {
  headline?: string
  logos?: LogoBarLogo[]
  animate?: boolean
  appearance?: BlockAppearance
  /** Tone. Defaults to 'paper'. Pass 'ink' for dark-background sections. */
  on?: 'paper' | 'ink'
}

// ─── Static style objects ──────────────────────────────────────────────────────

const LABEL: CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: 'var(--text-eyebrow, 0.72rem)',
  fontWeight: 600,
  letterSpacing: 'var(--tracking-wide, 0.2em)',
  textTransform: 'uppercase',
  margin: 0,
}

// ─── Logo item renderer ────────────────────────────────────────────────────────

function LogoItem({ logo, on }: { logo: LogoBarLogo; on: 'paper' | 'ink' }) {
  const { image, alt, url } = logo

  if (!image?.url) return null

  const imgStyle: CSSProperties = {
    display: 'block',
    maxWidth: '100%',
    height: 'clamp(2rem, 3.5vw, 2.75rem)',
    width: 'auto',
    objectFit: 'contain',
    // Grayscale by default; color on hover handled by CSS class
    filter: on === 'ink' ? 'brightness(0) invert(1)' : 'grayscale(100%) opacity(0.55)',
    transition: 'filter var(--transition-duration, 300ms) var(--transition-easing, cubic-bezier(0.4,0,0.2,1))',
  }

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      alt={alt ?? image.alt ?? ''}
      loading="lazy"
      decoding="async"
      style={imgStyle}
      className="lb-logo-img"
    />
  )

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.25rem clamp(1.25rem, 2.5vw, 2rem)',
    flexShrink: 0,
  }

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="lb-logo-item"
        style={itemStyle}
        aria-label={alt ?? image.alt ?? 'Partner logo'}
      >
        {img}
      </a>
    )
  }

  return (
    <div className="lb-logo-item" style={itemStyle} aria-hidden={!alt}>
      {img}
    </div>
  )
}

// ─── Marquee track (static + animated shared layout) ──────────────────────────

function LogoTrack({
  logos,
  animate,
  on,
}: {
  logos: LogoBarLogo[]
  animate: boolean
  on: 'paper' | 'ink'
}) {
  const safe = logos.filter((l) => l.image?.url)
  if (!safe.length) return null

  const trackStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    // For static: centered. For animated, the marquee wrapper handles overflow.
    flexWrap: animate ? 'nowrap' : 'wrap',
    justifyContent: animate ? 'flex-start' : 'center',
    gap: 0,
    // Don't need gap here — LogoItem has its own horizontal padding for rhythm
  }

  if (!animate) {
    return (
      <div style={trackStyle} role="list" aria-label="Partners y clientes">
        {safe.map((logo, i) => (
          <div key={i} role="listitem">
            <LogoItem logo={logo} on={on} />
          </div>
        ))}
      </div>
    )
  }

  // Marquee: duplicate set for seamless loop.
  // We need enough items to fill the viewport; one duplicate is sufficient
  // for wide viewports if logos >= ~6. Duplicate twice to be safe.
  const repeated = [...safe, ...safe, ...safe]

  return (
    <div style={{ position: 'relative' }}>
      {/*
        Accessible list for screen readers: visually hidden, not aria-hidden.
        This is the authoritative list that AT announces. The animated track
        below is purely visual and carries aria-hidden to avoid duplicates.
      */}
      <ul
        role="list"
        aria-label="Partners y clientes"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
          listStyle: 'none',
        }}
      >
        {safe.map((logo, i) => (
          <li key={i}>
            {logo.alt ?? logo.image?.alt ?? `Partner logo ${i + 1}`}
          </li>
        ))}
      </ul>

      {/* Visual marquee — fully aria-hidden; AT reads the list above instead */}
      <div
        className="lb-marquee-outer"
        style={{ overflow: 'hidden', position: 'relative' }}
        aria-hidden
      >
        {/* Fade edges */}
        <span
          className="lb-fade lb-fade-l"
          style={{
            position: 'absolute',
            insetBlock: 0,
            left: 0,
            width: 'clamp(3rem, 8vw, 6rem)',
            background: `linear-gradient(to right, var(--brand-paper, #fafaf7), transparent)`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <span
          className="lb-fade lb-fade-r"
          style={{
            position: 'absolute',
            insetBlock: 0,
            right: 0,
            width: 'clamp(3rem, 8vw, 6rem)',
            background: `linear-gradient(to left, var(--brand-paper, #fafaf7), transparent)`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div
          className="lb-marquee-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            width: 'max-content',
            willChange: 'transform',
            animation: 'lb-scroll 32s linear infinite',
          }}
        >
          {repeated.map((logo, i) => (
            <div key={i} style={{ flexShrink: 0 }}>
              <LogoItem logo={logo} on={on} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Divider line helper ───────────────────────────────────────────────────────

function DividerLine({ on }: { on: 'paper' | 'ink' }) {
  return (
    <div
      aria-hidden
      style={{
        height: '1px',
        background:
          on === 'ink'
            ? 'var(--divider-ink, rgba(255,255,255,0.08))'
            : 'var(--divider-paper, rgba(26,26,26,0.12))',
        margin: '0 clamp(1.25rem, 5vw, 3rem)',
      }}
    />
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function LogoBar({
  headline,
  logos = [],
  animate = false,
  appearance,
  on = 'paper',
}: LogoBarProps) {
  const safeLogos = logos.filter((l) => l.image?.url)

  const labelColor =
    on === 'ink'
      ? 'var(--brand-ink-muted-inverse, rgb(255 255 255 / 0.38))'
      : 'var(--brand-ink-muted, #6b6b65)'

  const bgKey = on === 'ink' ? 'ink' : 'paper'

  // The grayscale → color hover for ink tone needs a different filter reset.
  const hoverFilter =
    on === 'ink'
      ? 'brightness(0) invert(1) opacity(0.95)'
      : 'grayscale(0%) opacity(1)'

  // Vertical padding is intentionally compact: this is a utility band,
  // not a hero. Asymmetric (top > bottom) creates subtle rhythm with
  // whatever comes below.
  const paddingTop = 'clamp(2.5rem, 4vw, 3.5rem)'
  const paddingBottom = 'clamp(2rem, 3vw, 2.75rem)'

  return (
    <>
      {/* CSS: marquee keyframe + hover color restore + pauses on focus */}
      <style>{`
        @keyframes lb-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .lb-marquee-outer:hover .lb-marquee-track,
        .lb-marquee-outer:focus-within .lb-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .lb-marquee-track {
            animation: none !important;
          }
        }
        .lb-logo-item:hover .lb-logo-img,
        .lb-logo-item:focus-visible .lb-logo-img {
          filter: ${hoverFilter} !important;
        }
        .lb-logo-item:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 4px;
          border-radius: var(--radius-sm, 0.25rem);
        }
        /* Ink-tone fade edges need different gradient color */
        ${on === 'ink' ? `
        .lb-fade-l { background: linear-gradient(to right, var(--brand-ink, #1a1a1a), transparent) !important; }
        .lb-fade-r { background: linear-gradient(to left,  var(--brand-ink, #1a1a1a), transparent) !important; }
        ` : ''}
      `}</style>

      <Section
        appearance={appearance}
        background={bgKey}
        style={{ paddingTop, paddingBottom }}
      >
        <DividerLine on={on} />

        <Container size="xl" style={{ paddingTop: 'clamp(1.5rem, 2.5vw, 2rem)', paddingBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
          {headline ? (
            <p
              style={{
                ...LABEL,
                color: labelColor,
                textAlign: 'center',
                marginBottom: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              }}
            >
              {headline}
            </p>
          ) : null}

          {safeLogos.length > 0 ? (
            <LogoTrack logos={safeLogos} animate={animate} on={on} />
          ) : null}
        </Container>

        <DividerLine on={on} />
      </Section>
    </>
  )
}
