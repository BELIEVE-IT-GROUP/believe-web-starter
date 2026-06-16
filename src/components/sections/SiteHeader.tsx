'use client'

/**
 * SiteHeader: site chrome (layout: Settings.header).
 *
 * World-class header that mirrors the approved trust-demo craft: a quiet
 * top hairline, a primary-color dot wordmark fallback, an asymmetric nav row
 * with a single emphasized CTA, sticky-on-scroll condensation, and a full
 * mobile drawer (hamburger to overlay) with focus trap, ESC-to-close and
 * body scroll lock.
 *
 * Client Component: it owns real interaction (scroll state + mobile menu).
 * Pure theme tokens only, so every tenant re-skins it via the injected CSS vars.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react'

import type { BlockAppearance } from './types'

export interface SiteHeaderNavLink {
  label?: string
  url?: string
  newTab?: boolean
}

export interface SiteHeaderProps {
  siteName?: string
  logo?: { url?: string; alt?: string }
  navLinks?: SiteHeaderNavLink[]
  cta?: { label?: string; url?: string; newTab?: boolean }
  /** When false, the header scrolls away with the page instead of pinning. Default true. */
  sticky?: boolean
  appearance?: BlockAppearance
}

// ─── Brand mark ───────────────────────────────────────────────────────────────

function BrandMark({
  siteName,
  logo,
  condensed,
}: {
  siteName?: string
  logo?: { url?: string; alt?: string }
  condensed: boolean
}) {
  if (logo?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo.url}
        alt={logo.alt || siteName || 'Inicio'}
        style={{
          height: condensed ? '1.75rem' : '2.125rem',
          width: 'auto',
          display: 'block',
          transition: 'height var(--transition-fast, 150ms) ease',
        }}
      />
    )
  }

  // Wordmark fallback: siteName in the display face, a primary-color dot.
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: 'var(--font-display, Georgia, serif)',
        fontWeight: 700,
        fontSize: condensed ? '1.2rem' : '1.375rem',
        letterSpacing: 'var(--tracking-tight, -0.015em)',
        lineHeight: 1,
        color: 'var(--brand-ink, #1a1a1a)',
        transition: 'font-size var(--transition-fast, 150ms) ease',
      }}
    >
      {siteName || 'Believe'}
      <span aria-hidden style={{ color: 'var(--color-primary, #0c3bb9)', marginLeft: '0.06em' }}>
        .
      </span>
    </span>
  )
}

// ─── Hamburger / close icon (2 states, animated) ──────────────────────────────

function MenuGlyph({ open }: { open: boolean }) {
  const bar = {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    width: '1.125rem',
    height: '2px',
    marginLeft: '-0.5625rem',
    background: 'currentColor',
    borderRadius: '2px',
    transition: 'transform var(--transition-fast, 150ms) ease, opacity var(--transition-fast, 150ms) ease',
  }
  return (
    <span aria-hidden style={{ position: 'relative', display: 'block', width: '1.125rem', height: '1.125rem' }}>
      <span style={{ ...bar, transform: open ? 'translateY(0) rotate(45deg)' : 'translateY(-0.3125rem)' }} />
      <span style={{ ...bar, opacity: open ? 0 : 1, transform: 'translateX(0)' }} />
      <span style={{ ...bar, transform: open ? 'translateY(0) rotate(-45deg)' : 'translateY(0.3125rem)' }} />
    </span>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SiteHeader({
  siteName,
  logo,
  navLinks = [],
  cta,
  sticky = true,
  appearance,
}: SiteHeaderProps) {
  const links = (navLinks ?? []).filter((l) => l?.label && l.label.trim())
  const hasCta = Boolean(cta?.label && cta.label.trim())
  const ctaHref = cta?.url || '#'

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Sticky condensation: flip a flag once the page has scrolled past a small offset.
  useEffect(() => {
    if (!sticky) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sticky])

  const close = useCallback(() => setOpen(false), [])

  // Lock body scroll and run a real focus trap for the drawer dialog: move
  // focus into the drawer on open, keep Tab cycling inside it, close on ESC,
  // and restore focus to the toggle (the trigger) on close.
  useEffect(() => {
    if (!open) return
    const drawer = drawerRef.current
    const trigger = toggleRef.current

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const getFocusable = () =>
      drawer ? Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE)) : []

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        // Nothing focusable inside, keep focus pinned to the drawer container.
        e.preventDefault()
        drawer?.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null
      // Trap: cycle focus at the boundaries and pull stray focus back inside.
      if (e.shiftKey) {
        if (active === first || !drawer?.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !drawer?.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    // Move focus into the drawer for keyboard users.
    const firstFocusable = getFocusable()[0]
    firstFocusable?.focus()

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      // Restore focus to the trigger when the drawer closes.
      trigger?.focus()
    }
  }, [open, close])

  const condensed = sticky && scrolled

  const navLinkStyle = {
    fontFamily: 'var(--font-body, system-ui, sans-serif)',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.78)',
    textDecoration: 'none',
    transition: 'color var(--transition-fast, 150ms) ease',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <header
      id={appearance?.sectionId || undefined}
      className={`site-header${condensed ? ' site-header--scrolled' : ''}`}
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 50,
        width: '100%',
        background: condensed
          ? 'color-mix(in oklab, var(--brand-paper, #fafaf7) 88%, transparent)'
          : 'var(--brand-paper, #fafaf7)',
        backdropFilter: condensed ? 'saturate(160%) blur(12px)' : undefined,
        WebkitBackdropFilter: condensed ? 'saturate(160%) blur(12px)' : undefined,
        borderBottom: condensed
          ? '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)'
          : '1px solid transparent',
        transition:
          'background var(--transition-fast, 150ms) ease, border-color var(--transition-fast, 150ms) ease, padding var(--transition-fast, 150ms) ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          maxWidth: 'var(--container-max, 80rem)',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1.25rem, 5vw, 3rem)',
          paddingRight: 'clamp(1.25rem, 5vw, 3rem)',
          paddingTop: condensed ? '0.75rem' : '1.1rem',
          paddingBottom: condensed ? '0.75rem' : '1.1rem',
          transition: 'padding var(--transition-fast, 150ms) ease',
        }}
      >
        {/* Brand */}
        <a
          href="/"
          aria-label={`${siteName || 'Believe'}, inicio`}
          className="site-header__brand"
          style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
        >
          <BrandMark siteName={siteName} logo={logo} condensed={condensed} />
        </a>

        {/* Desktop nav (hidden under 860px via scoped CSS) */}
        <nav
          aria-label="Principal"
          className="site-header__nav"
          style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }}
        >
          {links.length > 0 ? (
            <ul style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
              {links.map((l, i) => (
                <li key={`${l.url ?? 'link'}-${i}`}>
                  <a
                    href={l.url || '#'}
                    target={l.newTab ? '_blank' : undefined}
                    rel={l.newTab ? 'noopener noreferrer' : undefined}
                    className="site-header__link"
                    style={navLinkStyle}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {hasCta ? (
            <a
              href={ctaHref}
              target={cta?.newTab ? '_blank' : undefined}
              rel={cta?.newTab ? 'noopener noreferrer' : undefined}
              className="site-header__cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: '0.875rem',
                fontWeight: 700,
                lineHeight: 1,
                padding: '0.7rem 1.3rem',
                borderRadius: 'var(--radius-button, 0.375rem)',
                background: 'var(--color-primary, #0c3bb9)',
                color: 'var(--color-on-primary, #ffffff)',
                boxShadow: 'var(--shadow-button, none)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'background var(--transition-fast, 150ms) ease',
              }}
            >
              {cta?.label}
              <span aria-hidden>&rarr;</span>
            </a>
          ) : null}
        </nav>

        {/* Mobile toggle (shown under 860px via scoped CSS) */}
        <button
          ref={toggleRef}
          type="button"
          className="site-header__toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem',
            flexShrink: 0,
            padding: 0,
            background: 'transparent',
            border: '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.14)',
            borderRadius: 'var(--radius-button, 0.375rem)',
            color: 'var(--brand-ink, #1a1a1a)',
            cursor: 'pointer',
          }}
        >
          <MenuGlyph open={open} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="site-header__scrim"
        data-open={open ? 'true' : 'false'}
        onClick={close}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'var(--color-overlay, rgba(0,0,0,0.45))',
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          transition: 'opacity var(--transition-fast, 150ms) ease, visibility var(--transition-fast, 150ms) ease',
        }}
      />
      <div
        ref={drawerRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="site-header__drawer"
        data-open={open ? 'true' : 'false'}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 41,
          width: 'min(20rem, 84vw)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--brand-paper, #fafaf7)',
          borderLeft: '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)',
          boxShadow: 'var(--shadow-xl, 0 10px 40px rgba(0,0,0,0.12))',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          visibility: open ? 'visible' : 'hidden',
          transition: 'transform var(--transition-duration, 300ms) var(--transition-easing, cubic-bezier(0.4,0,0.2,1)), visibility var(--transition-duration, 300ms)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.1rem clamp(1.25rem, 6vw, 1.75rem)',
            borderBottom: '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)',
          }}
        >
          <BrandMark siteName={siteName} logo={logo} condensed />
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => {
              close()
              toggleRef.current?.focus()
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              padding: 0,
              background: 'transparent',
              border: 'none',
              color: 'var(--brand-ink, #1a1a1a)',
              cursor: 'pointer',
            }}
          >
            <MenuGlyph open />
          </button>
        </div>

        <nav
          aria-label="Principal (móvil)"
          style={{ display: 'flex', flexDirection: 'column', padding: 'clamp(1.25rem, 6vw, 1.75rem)', flex: 1 }}
        >
          {links.length > 0 ? (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 0, listStyle: 'none', margin: 0, padding: 0 }}>
              {links.map((l, i) => (
                <li key={`m-${l.url ?? 'link'}-${i}`}>
                  <a
                    href={l.url || '#'}
                    target={l.newTab ? '_blank' : undefined}
                    rel={l.newTab ? 'noopener noreferrer' : undefined}
                    onClick={close}
                    className="site-header__drawer-link"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.75rem',
                      padding: '0.95rem 0',
                      fontFamily: 'var(--font-display, system-ui, sans-serif)',
                      fontSize: '1.0625rem',
                      fontWeight: 600,
                      color: 'var(--brand-ink, #1a1a1a)',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.07)',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--color-primary, #0c3bb9)',
                        minWidth: '1.5rem',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-body, system-ui, sans-serif)',
                fontSize: '0.9375rem',
                color: 'var(--brand-ink-muted, #6b6b65)',
                margin: 0,
              }}
            >
              {siteName || 'Believe'}
            </p>
          )}

          {hasCta ? (
            <a
              href={ctaHref}
              target={cta?.newTab ? '_blank' : undefined}
              rel={cta?.newTab ? 'noopener noreferrer' : undefined}
              onClick={close}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                marginTop: '1.75rem',
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                lineHeight: 1,
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-button, 0.375rem)',
                background: 'var(--color-primary, #0c3bb9)',
                color: 'var(--color-on-primary, #ffffff)',
                boxShadow: 'var(--shadow-button, none)',
                textDecoration: 'none',
              }}
            >
              {cta?.label}
              <span aria-hidden>&rarr;</span>
            </a>
          ) : null}
        </nav>
      </div>

      {/* Scoped responsive + interaction CSS. Hover/focus can't be inlined. */}
      <style>{`
        .site-header__link:hover { color: var(--color-primary, #0c3bb9); }
        .site-header__cta:hover { background: var(--color-primary-hover, #0e46d9); }
        .site-header__toggle:hover { border-color: rgb(from var(--brand-ink, #1a1a1a) r g b / 0.3); }
        .site-header__drawer-link:active { color: var(--color-primary, #0c3bb9); }

        .site-header a:focus-visible,
        .site-header button:focus-visible,
        .site-header__drawer a:focus-visible,
        .site-header__drawer button:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 3px;
          border-radius: var(--radius-sm, 0.25rem);
        }

        @media (max-width: 860px) {
          .site-header__nav { display: none !important; }
          .site-header__toggle { display: inline-flex !important; }
        }
        @media (min-width: 861px) {
          .site-header__scrim,
          .site-header__drawer { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .site-header,
          .site-header *,
          .site-header__scrim,
          .site-header__drawer { transition-duration: 1ms !important; }
        }
      `}</style>
    </header>
  )
}
