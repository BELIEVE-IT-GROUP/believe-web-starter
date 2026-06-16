/**
 * Custom Sections — theme-aware primitives (NO flowbite).
 *
 * Base building blocks shared by every custom section. Pure theme tokens
 * (var(--color-primary), var(--font-display), var(--section-padding-y), etc.)
 * so each tenant skins them via the CSS vars injected in <head>.
 *
 * These primitives are intentionally small and unopinionated: sections compose
 * them and add their own layout. They must compile as Server Components
 * (no hooks, no 'use client').
 */

import type { CSSProperties, ReactNode } from 'react'

import type { BlockAppearance } from './types'

// ─── Shared spacing maps (mirror appearance.ts intent, no Flowbite import) ────

const spacingScale: Record<string, string> = {
  none: '0',
  sm: 'calc(var(--section-padding-y, 6rem) * 0.5)',
  md: 'calc(var(--section-padding-y, 6rem) * 0.75)',
  default: 'var(--section-padding-y, 6rem)',
  lg: 'calc(var(--section-padding-y, 6rem) * 1.35)',
}

function resolveSpacing(key?: string): string {
  if (!key || key === 'default') return spacingScale.default
  return spacingScale[key] ?? spacingScale.default
}

// ─── Backgrounds ──────────────────────────────────────────────────────────────

export type SectionBackground = 'paper' | 'ink' | 'primary' | 'white'

const backgroundStyles: Record<SectionBackground, CSSProperties> = {
  paper: {
    background: 'var(--brand-paper, #fafaf7)',
    color: 'var(--brand-ink, #1a1a1a)',
  },
  white: {
    background: 'var(--brand-paper, #ffffff)',
    color: 'var(--brand-ink, #1a1a1a)',
  },
  ink: {
    background: 'var(--brand-ink, #0a0a0a)',
    color: 'var(--brand-paper, #fafaf7)',
  },
  primary: {
    background: 'var(--color-primary, #0c3bb9)',
    color: 'var(--color-on-primary, #ffffff)',
  },
}

// ─── Section ──────────────────────────────────────────────────────────────────

export interface SectionProps {
  children: ReactNode
  appearance?: BlockAppearance
  className?: string
  background?: SectionBackground
  style?: CSSProperties
}

/**
 * Top-level <section> wrapper: vertical rhythm via --section-padding-y,
 * tenant-driven background, and appearance (id, spacing, customClassName).
 */
export function Section({
  children,
  appearance,
  className = '',
  background = 'paper',
  style,
}: SectionProps) {
  const paddingTop = resolveSpacing(appearance?.spacingTop)
  const paddingBottom = resolveSpacing(appearance?.spacingBottom)

  return (
    <section
      id={appearance?.sectionId || undefined}
      className={`relative w-full ${className} ${appearance?.customClassName ?? ''}`.trim()}
      style={{
        ...backgroundStyles[background],
        paddingTop,
        paddingBottom,
        ...style,
      }}
    >
      {children}
    </section>
  )
}

// ─── Container ────────────────────────────────────────────────────────────────

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const containerMax: Record<ContainerSize, string> = {
  sm: '42rem',
  md: '56rem',
  lg: '64rem',
  xl: '80rem',
  full: '100%',
}

export interface ContainerProps {
  children: ReactNode
  size?: ContainerSize
  className?: string
  style?: CSSProperties
}

/** Responsive max-width wrapper with fluid horizontal gutters. */
export function Container({ children, size = 'xl', className = '', style }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${className}`.trim()}
      style={{
        maxWidth: containerMax[size],
        paddingLeft: 'clamp(1.25rem, 5vw, 3rem)',
        paddingRight: 'clamp(1.25rem, 5vw, 3rem)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────

export interface EyebrowProps {
  children: ReactNode
  className?: string
  /** When true, render a short leading rule (Trust-style). */
  rule?: boolean
}

/** Uppercase mono label in the brand primary color. */
export function Eyebrow({ children, className = '', rule = true }: EyebrowProps) {
  return (
    <p
      className={`inline-flex items-center gap-3 ${className}`.trim()}
      style={{
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        fontSize: 'var(--text-eyebrow, 0.72rem)',
        fontWeight: 600,
        letterSpacing: 'var(--tracking-wide, 0.2em)',
        textTransform: 'uppercase',
        color: 'var(--color-primary, #0c3bb9)',
        margin: 0,
      }}
    >
      {rule ? (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '1.75rem',
            height: '2px',
            flexShrink: 0,
            background: 'var(--color-primary, #0c3bb9)',
          }}
        />
      ) : null}
      <span>{children}</span>
    </p>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'outline' | 'ink' | 'ghost'

export interface ButtonProps {
  href?: string
  children: ReactNode
  variant?: ButtonVariant
  className?: string
  /** Pass 'ink' / 'paper' to tune outline/ghost contrast on dark backgrounds. */
  on?: 'paper' | 'ink'
  style?: CSSProperties
}

const buttonBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontSize: '0.9375rem',
  fontWeight: 700,
  lineHeight: 1,
  padding: '1rem 1.75rem',
  borderRadius: 'var(--radius-button, 0.375rem)',
  textDecoration: 'none',
  transition: 'opacity var(--transition-fast, 150ms) ease, border-color 150ms ease, background-color 150ms ease',
  cursor: 'pointer',
}

function buttonStyles(variant: ButtonVariant, on: 'paper' | 'ink'): CSSProperties {
  if (variant === 'primary') {
    return {
      ...buttonBase,
      background: 'var(--color-primary, #0c3bb9)',
      color: 'var(--color-on-primary, #ffffff)',
      border: '2px solid transparent',
      boxShadow: 'var(--shadow-button, none)',
    }
  }
  if (variant === 'ink') {
    return {
      ...buttonBase,
      background: 'var(--brand-ink, #0a0a0a)',
      color: 'var(--brand-paper, #ffffff)',
      border: '2px solid transparent',
    }
  }
  if (variant === 'ghost') {
    return {
      ...buttonBase,
      background: 'transparent',
      color: on === 'ink' ? 'var(--brand-paper, #ffffff)' : 'var(--brand-ink, #1a1a1a)',
      border: '2px solid transparent',
    }
  }
  // outline
  return {
    ...buttonBase,
    background: 'transparent',
    color: on === 'ink' ? 'var(--brand-paper, #ffffff)' : 'var(--brand-ink, #1a1a1a)',
    border:
      on === 'ink'
        ? '2px solid rgb(255 255 255 / 0.25)'
        : '2px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.18)',
  }
}

/** Themed link/button. Renders an <a> when href is present. */
export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  on = 'paper',
  style,
}: ButtonProps) {
  const merged = { ...buttonStyles(variant, on), ...style }

  if (href) {
    return (
      <a href={href} className={className} style={merged}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={className} style={merged}>
      {children}
    </button>
  )
}
