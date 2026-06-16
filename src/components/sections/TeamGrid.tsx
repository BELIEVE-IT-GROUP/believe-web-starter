/**
 * TeamGrid — team.custom
 *
 * People grid with photo, name, role, bio, and social icons.
 * Asymmetric header (eyebrow + headline left, subheadline right) breaks the
 * uniform-padding cliche. Cards vary in height by design; the grid uses
 * auto-rows so taller bios stretch naturally. Photos get a subtle primary-tint
 * frame on hover, never a side-stripe border.
 *
 * Server Component — no interaction needed for a static team grid.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance, MediaRef } from './types'

export interface TeamGridMember {
  name?: string
  role?: string
  bio?: string
  photo?: MediaRef
  social?: { linkedin?: string; twitter?: string; instagram?: string }
}

export interface TeamGridProps {
  headline?: string
  subheadline?: string
  members?: TeamGridMember[]
  appearance?: BlockAppearance
  /** Optional mono eyebrow label above the headline. */
  eyebrow?: string
  /** Light (default) or ink background tone. */
  tone?: 'light' | 'dark'
}

// ─── Social icons (inline SVG, no external dep) ──────────────────────────────

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

// ─── Photo placeholder (graceful fallback) ────────────────────────────────────

function PhotoPlaceholder({ name, isDark }: { name?: string; isDark: boolean }) {
  const initials = (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        background: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 10%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display, system-ui, sans-serif)',
        fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
        fontWeight: 700,
        color: isDark ? 'var(--color-accent, #00aaff)' : 'var(--color-primary, #0c3bb9)',
        letterSpacing: '-0.02em',
        userSelect: 'none',
      }}
    >
      {initials || '?'}
    </div>
  )
}

// ─── Member card ─────────────────────────────────────────────────────────────

function MemberCard({ member, isDark }: { member: TeamGridMember; isDark: boolean }) {
  const ink = isDark ? 'var(--brand-paper, #fafaf7)' : 'var(--brand-ink, #1a1a1a)'
  const inkMuted = isDark ? 'var(--brand-paper-muted, color-mix(in oklab, var(--brand-paper, #fafaf7) 55%, transparent))' : 'var(--brand-ink-muted, #6b6b65)'
  const border = isDark
    ? '1px solid var(--brand-paper-08, color-mix(in oklab, var(--brand-paper, #fafaf7) 8%, transparent))'
    : '1px solid var(--brand-ink-10, color-mix(in oklab, var(--brand-ink, #1a1a1a) 10%, transparent))'

  const socialLinks = [
    { key: 'linkedin', href: member.social?.linkedin, label: 'LinkedIn', icon: <LinkedInIcon /> },
    { key: 'twitter', href: member.social?.twitter, label: 'X (Twitter)', icon: <TwitterIcon /> },
    { key: 'instagram', href: member.social?.instagram, label: 'Instagram', icon: <InstagramIcon /> },
  ].filter((s) => s.href)

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderTop: `2px solid var(--color-primary, #0c3bb9)`,
        paddingTop: '1.5rem',
      }}
    >
      {/* Photo */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md, 0.5rem)',
          border,
          marginBottom: '1.25rem',
          background: isDark ? 'var(--brand-paper-04, color-mix(in oklab, var(--brand-paper, #fafaf7) 4%, transparent))' : 'var(--brand-ink-04, color-mix(in oklab, var(--brand-ink, #1a1a1a) 4%, transparent))',
          flexShrink: 0,
        }}
      >
        {member.photo?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo.url}
            alt={member.photo.alt || (member.name ? `Foto de ${member.name}` : '')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
        ) : (
          <PhotoPlaceholder name={member.name} isDark={isDark} />
        )}
      </div>

      {/* Role chip */}
      {member.role ? (
        <p
          style={{
            fontFamily: 'var(--font-mono, ui-monospace, monospace)',
            fontSize: 'var(--text-eyebrow, 0.72rem)',
            fontWeight: 600,
            letterSpacing: 'var(--tracking-wide, 0.2em)',
            textTransform: 'uppercase',
            color: 'var(--color-primary, #0c3bb9)',
            margin: '0 0 0.5rem',
          }}
        >
          {member.role}
        </p>
      ) : null}

      {/* Name */}
      {member.name ? (
        <h3
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: 'var(--tracking-tight, -0.015em)',
            color: ink,
            margin: '0 0 0.75rem',
          }}
        >
          {member.name}
        </h3>
      ) : null}

      {/* Bio */}
      {member.bio ? (
        <p
          style={{
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: inkMuted,
            margin: '0 0 1.25rem',
            flexGrow: 1,
          }}
        >
          {member.bio}
        </p>
      ) : null}

      {/* Social links */}
      {socialLinks.length > 0 ? (
        <ul
          style={{
            display: 'flex',
            gap: '0.625rem',
            marginTop: 'auto',
            paddingTop: member.bio ? '0' : '0.5rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
          aria-label={`Redes sociales de ${member.name ?? 'este miembro'}`}
        >
          {socialLinks.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} de ${member.name ?? ''}`}
                className="team-grid-social-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-sm, 0.25rem)',
                  color: inkMuted,
                  background: 'transparent',
                  border: isDark
                    ? '1px solid var(--brand-paper-14, color-mix(in oklab, var(--brand-paper, #fafaf7) 14%, transparent))'
                    : '1px solid var(--brand-ink-12, color-mix(in oklab, var(--brand-ink, #1a1a1a) 12%, transparent))',
                  textDecoration: 'none',
                  transition: 'color var(--transition-fast, 150ms) ease, border-color var(--transition-fast, 150ms) ease',
                  outline: 'none',
                }}
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

// ─── Grid layout helpers ──────────────────────────────────────────────────────

const GRID_RESPONSIVE_STYLE = `
  .team-grid-members {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem);
  }
  @media (min-width: 640px) {
    .team-grid-members {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media (min-width: 1024px) {
    .team-grid-members {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .team-grid-header {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: clamp(3rem, 5vw, 4.5rem);
  }
  @media (min-width: 768px) {
    .team-grid-header {
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: end;
    }
  }
  .team-grid-social-link:focus-visible {
    outline: 2px solid var(--color-primary, #0c3bb9);
    outline-offset: 2px;
  }
`

// ─── Main component ───────────────────────────────────────────────────────────

export function TeamGrid({
  headline,
  subheadline,
  members,
  appearance,
  eyebrow,
  tone = 'light',
}: TeamGridProps) {
  const safeMembers = (members ?? []).filter((m) => m.name || m.role || m.photo?.url)
  const isDark = tone === 'dark'

  const bg = isDark ? 'ink' : 'paper'
  const ink = isDark ? 'var(--brand-paper, #fafaf7)' : 'var(--brand-ink, #1a1a1a)'
  const inkMuted = isDark ? 'var(--brand-paper-muted, color-mix(in oklab, var(--brand-paper, #fafaf7) 55%, transparent))' : 'var(--brand-ink-muted, #6b6b65)'

  const headlineStyle: CSSProperties = {
    fontFamily: 'var(--font-display, system-ui, sans-serif)',
    fontSize: 'var(--text-h2, clamp(1.5rem, 3vw, 2.25rem))',
    fontWeight: 800,
    lineHeight: 'var(--leading-tight, 1.06)',
    letterSpacing: 'var(--tracking-tight, -0.015em)',
    color: ink,
    margin: 0,
  }

  const subheadStyle: CSSProperties = {
    fontFamily: 'var(--font-body, system-ui, sans-serif)',
    fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
    lineHeight: 1.7,
    color: inkMuted,
    margin: 0,
  }

  return (
    <Section appearance={appearance} background={bg}>
      <style>{GRID_RESPONSIVE_STYLE}</style>

      <Container size="xl">
        {/* Asymmetric header: eyebrow + headline left, subheadline right */}
        {(headline || subheadline) ? (
          <header className="team-grid-header">
            <div>
              {eyebrow ? (
                <div style={{ marginBottom: '1rem' }}>
                  <Eyebrow>{eyebrow}</Eyebrow>
                </div>
              ) : null}
              {headline ? (
                <h2 style={headlineStyle}>{headline}</h2>
              ) : null}
            </div>
            {subheadline ? (
              <p style={{ ...subheadStyle, paddingBottom: '0.25rem' }}>{subheadline}</p>
            ) : null}
          </header>
        ) : null}

        {/* Members grid */}
        {safeMembers.length > 0 ? (
          <div className="team-grid-members" role="list">
            {safeMembers.map((member, i) => (
              <div key={member.name ?? i} role="listitem">
                <MemberCard member={member} isDark={isDark} />
              </div>
            ))}
          </div>
        ) : null}

        {/* Empty state: renders nothing visible, no broken layout */}
        {safeMembers.length === 0 && !headline && !subheadline ? null : null}
      </Container>
    </Section>
  )
}
