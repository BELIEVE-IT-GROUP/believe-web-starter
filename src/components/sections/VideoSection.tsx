'use client'

/**
 * VideoSection — video-embed.custom (templateId: video-embed.custom, blockType: video-embed)
 *
 * Facade pattern: renders a poster image with a play button. On click, the
 * poster is replaced by the actual iframe (YouTube/Vimeo) or <video> (direct).
 * This avoids loading heavy third-party scripts on page load.
 *
 * Supports:
 *   source="youtube"  → https://www.youtube-nocookie.com/embed/{videoId}
 *   source="vimeo"    → https://player.vimeo.com/video/{videoId}
 *   source="direct"   → <video src={videoId} controls>
 */

import { type CSSProperties, useState } from 'react'

import { Container, Eyebrow, Section, type SectionBackground } from './_primitives'
import type { BlockAppearance, MediaRef } from './types'

export interface VideoSectionProps {
  headline?: string
  subheadline?: string
  /** Video host. Defaults to 'youtube'. */
  source?: 'youtube' | 'vimeo' | 'direct'
  /** YouTube/Vimeo video ID, or full URL for direct <video>. */
  videoId?: string
  /** Poster image shown before the video loads. */
  poster?: MediaRef
  /** Autoplay when the facade is clicked (passed to embed URL). */
  autoplay?: boolean
  /** Expand the video player to full container width without text header. */
  fullWidth?: boolean
  appearance?: BlockAppearance
}

// ─── URL builders ────────────────────────────────────────────────────────────

function buildEmbedUrl(source: string, videoId: string, autoplay: boolean): string {
  if (source === 'vimeo') {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      title: '0',
      byline: '0',
      portrait: '0',
      color: '0c3bb9',
    })
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`
  }
  // youtube (default)
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
  })
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}

// ─── Play button SVG ─────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Filled circle track */}
      <circle cx="32" cy="32" r="31" fill="currentColor" fillOpacity="0.12" />
      <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
      {/* Triangle play mark */}
      <polygon
        points="26,20 26,44 48,32"
        fill="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Facade (poster + play button) ───────────────────────────────────────────

interface FacadeProps {
  poster?: MediaRef
  label: string
  isDark: boolean
  onPlay: () => void
}

function VideoFacade({ poster, label, isDark, onPlay }: FacadeProps) {
  const [hovered, setHovered] = useState(false)

  const overlayBg = isDark
    ? 'rgb(0 0 0 / 0.38)'
    : 'rgb(0 0 0 / 0.28)'

  const btnColor = isDark ? 'var(--brand-paper, #fafaf7)' : 'var(--brand-paper, #fafaf7)'
  const btnScale = hovered ? 'scale(1.08)' : 'scale(1)'

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="video-facade-btn"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        display: 'block',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 'var(--radius-card, 0.5rem)',
        background: 'var(--brand-ink, #1a1a1a)',
        // Focus ring visible without side-stripe borders
        outline: 'none',
      }}
    >
      {/* Focus-visible ring */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-3px',
          borderRadius: 'calc(var(--radius-card, 0.5rem) + 3px)',
          outline: '2px solid var(--color-primary, #0c3bb9)',
          outlineOffset: '2px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10,
        }}
        className="video-focus-ring"
      />

      {/* Poster image */}
      {poster?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster.url}
          alt={poster.alt || ''}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform var(--transition-slow, 500ms) cubic-bezier(0.4,0,0.2,1)',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
          }}
        />
      ) : (
        /* Branded placeholder when no poster */
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(140% 120% at 60% 20%, color-mix(in oklab, var(--color-primary, #0c3bb9) 20%, transparent) 0%, var(--brand-ink, #1a1a1a) 65%)',
          }}
        />
      )}

      {/* Gradient overlay so play button stays legible */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${overlayBg} 0%, transparent 75%)`,
          transition: 'background var(--transition-fast, 150ms) ease',
        }}
      />

      {/* Play button */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'clamp(3.5rem, 7vw, 5rem)',
          height: 'clamp(3.5rem, 7vw, 5rem)',
          transform: `translate(-50%, -50%) ${btnScale}`,
          transition: 'transform var(--transition-fast, 150ms) cubic-bezier(0.34,1.56,0.64,1)',
          color: btnColor,
          filter: 'drop-shadow(0 4px 16px rgb(0 0 0 / 0.4))',
          zIndex: 2,
        }}
      >
        <PlayIcon />
      </span>

      {/* Duration badge slot (kept empty, can be extended) */}
      <style>{`
        .video-facade-btn:focus-visible .video-focus-ring { opacity: 1 !important; }
      `}</style>
    </button>
  )
}

// ─── Video player (loaded after click) ───────────────────────────────────────

interface PlayerProps {
  source: 'youtube' | 'vimeo' | 'direct'
  videoId: string
  autoplay: boolean
  headline?: string
}

function VideoPlayer({ source, videoId, autoplay, headline }: PlayerProps) {
  const title = headline || 'Video'

  if (source === 'direct') {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={videoId}
        controls
        autoPlay={autoplay}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'var(--brand-ink, #1a1a1a)',
          borderRadius: 'var(--radius-card, 0.5rem)',
        }}
      />
    )
  }

  const embedUrl = buildEmbedUrl(source, videoId, autoplay)

  return (
    <iframe
      src={embedUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="eager"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 0,
        borderRadius: 'var(--radius-card, 0.5rem)',
      }}
    />
  )
}

// ─── Composable video wrapper ─────────────────────────────────────────────────

interface VideoWrapperProps {
  source?: 'youtube' | 'vimeo' | 'direct'
  videoId?: string
  poster?: MediaRef
  autoplay?: boolean
  headline?: string
  isDark: boolean
}

function VideoWrapper({ source = 'youtube', videoId, poster, autoplay = false, headline, isDark }: VideoWrapperProps) {
  const [playing, setPlaying] = useState(false)

  // No videoId: render a tasteful placeholder frame
  if (!videoId) {
    return (
      <div
        aria-label="Video no disponible"
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: 'var(--radius-card, 0.5rem)',
          border: isDark
            ? '1px solid rgb(255 255 255 / 0.08)'
            : '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)',
          background: isDark
            ? 'var(--brand-ink, #1a1a1a)'
            : 'color-mix(in oklab, var(--color-primary, #0c3bb9) 4%, var(--brand-paper, #fafaf7))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, ui-monospace, monospace)',
            fontSize: '0.8125rem',
            color: isDark ? 'rgb(255 255 255 / 0.3)' : 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.3)',
            letterSpacing: '0.05em',
          }}
        >
          video
        </span>
      </div>
    )
  }

  const playLabel = `Reproducir ${headline ? `"${headline}"` : 'video'}`

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 'var(--radius-card, 0.5rem)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-xl, 0 10px 40px rgba(0,0,0,0.12))',
    border: isDark
      ? '1px solid rgb(255 255 255 / 0.08)'
      : '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.06)',
  }

  return (
    <div style={wrapperStyle}>
      {playing ? (
        <VideoPlayer source={source} videoId={videoId} autoplay={autoplay} headline={headline} />
      ) : (
        <VideoFacade
          poster={poster}
          label={playLabel}
          isDark={isDark}
          onPlay={() => setPlaying(true)}
        />
      )}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function VideoSection({
  headline,
  subheadline,
  source = 'youtube',
  videoId,
  poster,
  autoplay = false,
  fullWidth = false,
  appearance,
}: VideoSectionProps) {
  const hasText = Boolean(headline || subheadline)
  // The section is cinematically dark by default. A tenant opts into a light
  // surface only via appearance.background = 'white' | 'gray' | 'image'.
  const isLight =
    appearance?.background === 'white' ||
    appearance?.background === 'gray' ||
    appearance?.background === 'image'
  const isDark = !isLight
  const sectionBackground: SectionBackground = isDark ? 'ink' : 'paper'

  const borderMuted = 'rgb(255 255 255 / 0.07)'
  const subColor = 'rgb(255 255 255 / 0.58)'

  return (
    <Section appearance={appearance} background={sectionBackground}>
      {/* Soft ambient glow behind the player */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(56rem, 80vw)',
          height: 'min(24rem, 40vw)',
          background:
            'radial-gradient(ellipse, color-mix(in oklab, var(--color-primary, #0c3bb9) 8%, transparent) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      <Container size={fullWidth ? 'full' : 'xl'} style={{ position: 'relative' }}>
        {/* Header row: only rendered when there is text and not fullWidth */}
        {hasText && !fullWidth ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: headline && subheadline ? 'minmax(0, 1fr) minmax(0, 0.72fr)' : '1fr',
              gap: 'clamp(1.5rem, 4vw, 4rem)',
              alignItems: 'end',
              marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
              paddingBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
              borderBottom: `1px solid ${borderMuted}`,
            }}
            className="video-section-header"
          >
            {headline ? (
              <h2
                style={{
                  fontFamily: 'var(--font-display, system-ui, sans-serif)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  lineHeight: 'var(--leading-tight, 1.06)',
                  letterSpacing: 'var(--tracking-tight, -0.015em)',
                  color: 'var(--brand-paper, #fafaf7)',
                  margin: 0,
                }}
              >
                {headline}
              </h2>
            ) : null}

            {subheadline ? (
              <p
                style={{
                  fontFamily: 'var(--font-body, system-ui, sans-serif)',
                  fontSize: 'clamp(0.9375rem, 1.3vw, 1.0625rem)',
                  lineHeight: 1.7,
                  color: subColor,
                  margin: 0,
                }}
              >
                {subheadline}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Only headline, no subheadline and not fullWidth */}
        {headline && !subheadline && !fullWidth ? null : null}

        {/* Player */}
        <VideoWrapper
          source={source}
          videoId={videoId}
          poster={poster}
          autoplay={autoplay}
          headline={headline}
          isDark={isDark}
        />

        {/* Caption bar: source label + signal accent */}
        {videoId && !fullWidth ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              marginTop: '1.25rem',
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: '1.5rem',
                height: '2px',
                background: 'var(--brand-signal, #00aaff)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgb(255 255 255 / 0.32)',
              }}
            >
              {source === 'direct' ? 'Video' : source === 'vimeo' ? 'Vimeo' : 'YouTube'}
            </span>
          </div>
        ) : null}
      </Container>

      {/* Responsive grid collapse */}
      <style>{`
        @media (max-width: 720px) {
          .video-section-header { grid-template-columns: 1fr !important; }
        }
        .video-facade-btn:focus-visible .video-focus-ring {
          opacity: 1 !important;
        }
      `}</style>
    </Section>
  )
}
