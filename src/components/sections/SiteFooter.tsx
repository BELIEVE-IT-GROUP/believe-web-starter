/**
 * SiteFooter — site chrome (layout: Settings.footer, blockType: footer).
 *
 * Ink background. Grouped link columns (keyed by `group`), social icons,
 * wordmark with signal dot, and a legal/copyright bar. Server Component.
 *
 * Craft principles:
 *   - Asymmetric layout: brand col wider than nav cols
 *   - Typographic hierarchy: display wordmark > mono eyebrow labels > body links
 *   - Signal dot (cyan) matches the Believe wordmark brandbook spec
 *   - No gradient text, no glassmorphism, no side-stripe borders
 *   - Varied spacing rhythm: tall brand col, compact nav cols, tight legal bar
 */

import type { CSSProperties } from 'react'

import type { BlockAppearance } from './types'

// ─── Platform icon registry (inline SVG paths, no external dep) ──────────────

const SOCIAL_ICONS: Record<string, string> = {
  twitter:   'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  x:         'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  linkedin:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  facebook:  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  youtube:   'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok:    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  github:    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
}

function SocialIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase().trim()
  const path = SOCIAL_ICONS[key]

  if (!path) {
    // Fallback: mono initial badge
    return (
      <span
        aria-hidden
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1.125rem',
          height: '1.125rem',
          fontFamily: 'var(--font-mono, ui-monospace)',
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: 0,
          textTransform: 'uppercase',
        }}
      >
        {key[0]}
      </span>
    )
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      width="18"
      height="18"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path d={path} />
    </svg>
  )
}

// ─── Group links by `group` field ────────────────────────────────────────────

interface LinkGroup {
  name: string
  links: Array<{ label?: string; url?: string }>
}

function groupLinks(links: Array<{ label?: string; url?: string; group?: string }>): LinkGroup[] {
  const map = new Map<string, LinkGroup>()
  for (const link of links) {
    const g = link.group?.trim() || ''
    if (!map.has(g)) map.set(g, { name: g, links: [] })
    map.get(g)!.links.push({ label: link.label, url: link.url })
  }
  return Array.from(map.values())
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SiteFooterLink {
  label?: string
  url?: string
  group?: string
}

export interface SiteFooterSocial {
  platform?: string
  url?: string
}

export interface SiteFooterProps {
  siteName?: string
  text?: string
  links?: SiteFooterLink[]
  social?: SiteFooterSocial[]
  appearance?: BlockAppearance
  /** Optional one-line tagline rendered under the wordmark */
  tagline?: string
}

// ─── Shared style constants ───────────────────────────────────────────────────

const MUTED_TEXT: CSSProperties = {
  color: 'rgb(255 255 255 / 0.4)',
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: '0.8125rem',
  lineHeight: 1.5,
}

const NAV_HEADING: CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: 'var(--text-eyebrow, 0.72rem)',
  fontWeight: 600,
  letterSpacing: 'var(--tracking-wide, 0.2em)',
  textTransform: 'uppercase' as const,
  color: 'var(--color-primary, #0c3bb9)',
  marginBottom: '1.25rem',
}

const NAV_LINK: CSSProperties = {
  color: 'rgb(255 255 255 / 0.55)',
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: '0.9375rem',
  lineHeight: 1.5,
  textDecoration: 'none',
  display: 'block',
  padding: '0.25rem 0',
  transition: 'color var(--transition-fast, 150ms) ease',
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SiteFooter({
  siteName,
  text,
  links = [],
  social = [],
  appearance,
  tagline,
}: SiteFooterProps) {
  const safeLinks = (links ?? []).filter((l) => l.label || l.url)
  const safeSocial = (social ?? []).filter((s) => s.platform && s.url)
  const groups = groupLinks(safeLinks)

  // Compute grid: brand col always first, then one col per group (up to 4)
  const groupCols = Math.min(groups.length, 4)
  // On desktop: brand col = 2fr, each nav col = 1fr
  const gridCols =
    groupCols > 0
      ? `2fr ${Array(groupCols).fill('1fr').join(' ')}`
      : '1fr'

  const borderColor = 'rgb(255 255 255 / 0.08)'
  const signalDot = 'var(--brand-signal, #00aaff)'

  return (
    <footer
      id={appearance?.sectionId || undefined}
      style={{
        background: 'var(--brand-ink, #1a1a1a)',
        color: 'var(--brand-paper, #fafaf7)',
        position: 'relative',
      }}
    >
      {/* ── Top band: brand + nav columns ────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container-max, 80rem)',
          margin: '0 auto',
          padding: 'clamp(3.5rem, 6vw, 5rem) clamp(1.25rem, 5vw, 3rem) clamp(2.5rem, 4vw, 3.5rem)',
        }}
      >
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'start',
          }}
        >
          {/* Brand column */}
          <div style={{ paddingRight: 'clamp(0px, 3vw, 2rem)' }}>
            {/* Wordmark */}
            <div
              style={{
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: 'clamp(1.375rem, 2.5vw, 1.75rem)',
                fontWeight: 700,
                letterSpacing: 'var(--tracking-tight, -0.015em)',
                lineHeight: 1,
                color: 'var(--brand-paper, #fafaf7)',
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '0.18em',
                marginBottom: '1rem',
              }}
            >
              <span>{siteName || 'Brand'}</span>
              {/* Signal dot matches wordmark spec in globals.css */}
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: '0.24em',
                  height: '0.24em',
                  borderRadius: '9999px',
                  background: signalDot,
                  marginBottom: '0.12em',
                  flexShrink: 0,
                }}
              />
            </div>

            {tagline ? (
              <p
                style={{
                  ...MUTED_TEXT,
                  marginBottom: '1.5rem',
                  maxWidth: '20rem',
                }}
              >
                {tagline}
              </p>
            ) : null}

            {/* Social icons */}
            {safeSocial.length > 0 ? (
              <ul
                role="list"
                aria-label="Social media"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.625rem',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  marginTop: tagline ? 0 : '0.5rem',
                }}
              >
                {safeSocial.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="footer-social-link"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: 'var(--radius-sm, 0.25rem)',
                        border: '1px solid rgb(255 255 255 / 0.12)',
                        color: 'rgb(255 255 255 / 0.5)',
                        textDecoration: 'none',
                        transition: 'color var(--transition-fast, 150ms) ease, border-color var(--transition-fast, 150ms) ease, background var(--transition-fast, 150ms) ease',
                      }}
                    >
                      <SocialIcon platform={s.platform!} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Nav columns */}
          {groups.map((group, gi) => (
            <nav
              key={gi}
              aria-label={group.name || `Footer links ${gi + 1}`}
            >
              {group.name ? (
                <h2 style={NAV_HEADING}>{group.name}</h2>
              ) : (
                /* Zero-width placeholder keeps rhythm even without a heading */
                <h2 style={{ ...NAV_HEADING, opacity: 0, pointerEvents: 'none', userSelect: 'none' }} aria-hidden>
                  &nbsp;
                </h2>
              )}
              <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {group.links.map((link, li) => (
                  <li key={li}>
                    <a
                      href={link.url || '#'}
                      className="footer-nav-link"
                      style={NAV_LINK}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Legal bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <div
          className="footer-legal"
          style={{
            maxWidth: 'var(--container-max, 80rem)',
            margin: '0 auto',
            padding: '1.25rem clamp(1.25rem, 5vw, 3rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Copyright */}
          <p style={{ ...MUTED_TEXT, margin: 0 }}>
            {text || `© ${new Date().getFullYear()} ${siteName || 'Brand'}. All rights reserved.`}
          </p>

          {/* Subtle brand signal: a single dot in cyan, no side-stripe */}
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '9999px',
              background: signalDot,
              opacity: 0.6,
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* ── CSS: hover states + responsive overrides ─────────────────────── */}
      <style>{`
        .footer-nav-link:hover {
          color: var(--brand-paper, #fafaf7) !important;
        }
        .footer-social-link:hover {
          color: var(--brand-paper, #fafaf7) !important;
          border-color: rgb(255 255 255 / 0.28) !important;
          background: rgb(255 255 255 / 0.06) !important;
        }
        .footer-social-link:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
        .footer-nav-link:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
          border-radius: var(--radius-sm, 0.25rem);
        }
        @media (max-width: 720px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .footer-legal {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
        }
        @media (min-width: 721px) and (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </footer>
  )
}
