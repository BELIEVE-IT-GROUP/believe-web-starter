/**
 * A2 — Theming dinámico por tenant (DNA Maasy → CSS custom properties).
 *
 * El frontend NO hardcodea colores ni fuentes. Lee `settings.theme` (poblado desde el DNA
 * de la marca) y lo inyecta como CSS vars en :root por request. Tailwind consume esas vars
 * (tokens var(--color-primary), var(--font-display), etc.), así las 133 variantes Flowbite
 * se themean con la identidad de cada marca sin tocar archivo por archivo.
 *
 * Believe es el theme por defecto (fallbacks en globals.css + tailwind.config).
 *
 * Arquitectura de capas:
 *   DNA input (Maasy) → CMS settings.theme (Payload) → CSS vars (:root inline) → Tailwind
 *
 * El <style> inyectado en <head> es unlayered → gana sobre @layer base → fallbacks Believe
 * solo aplican cuando el tenant no define un campo.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type TenantTheme = {
  // ── Colors (base) ────────────────────────────────────────────────────────
  primaryColor?: string | null
  accentColor?: string | null
  paperColor?: string | null
  inkColor?: string | null
  signalColor?: string | null
  inkMutedColor?: string | null

  // ── Fonts ────────────────────────────────────────────────────────────────
  displayFont?: string | null
  bodyFont?: string | null
  monoFont?: string | null
  /** @deprecated Use displayFont/bodyFont. Kept for backward compat. */
  fonts?: {
    display?: string | null
    body?: string | null
  } | null

  // ── Shape ────────────────────────────────────────────────────────────────
  /** Preset key: "none" | "soft" | "rounded" | "pill" */
  radiusBase?: string | null
  radiusButton?: string | null
  radiusCard?: string | null
  radiusInput?: string | null
  radiusPill?: string | null
  /** Preset key: "none" | "flat" | "soft" | "elevated" */
  shadowLevel?: 'none' | 'flat' | 'soft' | 'elevated' | null
  shadowCard?: string | null
  shadowButton?: string | null
  cardBorderWidth?: string | null

  // ── Spacing ──────────────────────────────────────────────────────────────
  /** Preset key: "compact" | "default" | "airy" */
  densityLevel?: 'compact' | 'default' | 'airy' | null
  sectionPaddingY?: string | null
  sectionPaddingYSm?: string | null
  heroPaddingY?: string | null
  cardPadding?: string | null

  // ── Motion ───────────────────────────────────────────────────────────────
  transitionDuration?: string | null
  transitionEasing?: string | null

  // ── Brand personality ─────────────────────────────────────────────────────
  grainOpacity?: string | null
  dividerOpacity?: string | null
  trackingTight?: string | null

  // ── Tone metadata (stored for copy context; drives derived shape/motion) ─
  tone?: string | null

  // ── Escape hatch (injected verbatim after structured vars) ───────────────
  cssVarsRaw?: Record<string, string> | null

  // Legacy (keep for backward compat — used by old seed scripts)
  defaultOgImage?: { id: string; url: string } | null
}

type SettingsLike = { theme?: TenantTheme | null } | null | undefined

// ─── Lookup tables ───────────────────────────────────────────────────────────

/** Tone keyword → derived CSS var values. Applied first; explicit fields override. */
const TONE_TOKENS: Record<string, Partial<TenantTheme>> = {
  professional: {
    radiusButton: '0.375rem',
    radiusCard: '0.5rem',
    shadowCard: '0 1px 3px rgba(0,0,0,0.08)',
    shadowButton: 'none',
    transitionDuration: '300ms',
    transitionEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    grainOpacity: '0.05',
    trackingTight: '-0.015em',
    cardBorderWidth: '0px',
    dividerOpacity: '0.12',
  },
  bold: {
    radiusButton: '0.5rem',
    radiusCard: '0.75rem',
    shadowCard: '0 4px 16px rgba(0,0,0,0.12)',
    shadowButton: '0 2px 8px color-mix(in oklab, var(--color-primary) 100%, transparent 75%)',
    transitionDuration: '150ms',
    transitionEasing: 'cubic-bezier(0.25, 0, 0, 1)',
    grainOpacity: '0.04',
    trackingTight: '-0.010em',
    cardBorderWidth: '0px',
    dividerOpacity: '0.10',
  },
  warm: {
    radiusButton: '9999px',
    radiusCard: '1rem',
    shadowCard: '0 2px 12px rgba(0,0,0,0.09)',
    shadowButton: '0 1px 4px rgba(0,0,0,0.10)',
    transitionDuration: '350ms',
    transitionEasing: 'ease-in-out',
    grainOpacity: '0.07',
    trackingTight: '-0.008em',
    cardBorderWidth: '0px',
    dividerOpacity: '0.15',
  },
  minimalist: {
    radiusButton: '0rem',
    radiusCard: '0rem',
    shadowCard: 'none',
    shadowButton: 'none',
    transitionDuration: '400ms',
    transitionEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    grainOpacity: '0.03',
    trackingTight: '-0.025em',
    cardBorderWidth: '1px',
    dividerOpacity: '0.08',
  },
}

/** shape.radius preset key → concrete CSS var values. */
const RADIUS_PRESETS: Record<string, {
  sm: string; md: string; lg: string; button: string; card: string; input: string
}> = {
  none: {
    sm: '0rem', md: '0rem', lg: '0rem',
    button: '0rem', card: '0rem', input: '0rem',
  },
  soft: {
    sm: '0.25rem', md: '0.5rem', lg: '0.75rem',
    button: '0.375rem', card: '0.5rem', input: '0.375rem',
  },
  rounded: {
    sm: '0.5rem', md: '0.75rem', lg: '1rem',
    button: '0.625rem', card: '1rem', input: '0.5rem',
  },
  pill: {
    sm: '0.75rem', md: '1.25rem', lg: '1.5rem',
    button: '9999px', card: '1.5rem', input: '9999px',
  },
}

/** shape.shadow preset key → concrete CSS var values. */
const SHADOW_PRESETS: Record<string, { card: string; button: string; borderWidth: string }> = {
  none: {
    card: 'none',
    button: 'none',
    borderWidth: '1px',
  },
  flat: {
    card: '0 1px 3px rgba(0,0,0,0.08)',
    button: 'none',
    borderWidth: '0px',
  },
  soft: {
    card: '0 2px 12px rgba(0,0,0,0.10)',
    button: '0 1px 4px rgba(0,0,0,0.12)',
    borderWidth: '0px',
  },
  elevated: {
    card: '0 4px 24px rgba(0,0,0,0.14)',
    button: '0 2px 8px color-mix(in oklab, var(--color-primary) 100%, transparent 70%)',
    borderWidth: '0px',
  },
}

/** spacing.density preset key → concrete CSS var values. */
const DENSITY_PRESETS: Record<string, {
  sectionY: string; sectionYSm: string; heroY: string; card: string
}> = {
  compact: { sectionY: '3rem', sectionYSm: '2rem', heroY: '4rem',  card: '1.25rem' },
  default: { sectionY: '6rem', sectionYSm: '4rem', heroY: '8rem',  card: '2rem'    },
  airy:    { sectionY: '8rem', sectionYSm: '5rem', heroY: '11rem', card: '2.5rem'  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolve a free-form tone string to one of the 4 preset keys.
 * Checks for keyword substrings; falls back to "professional".
 */
function resolveTone(tone?: string | null): string {
  if (!tone) return 'professional'
  const t = tone.toLowerCase()
  if (t.includes('bold') || t.includes('energetic') || t.includes('strong')) return 'bold'
  if (t.includes('warm') || t.includes('friendly') || t.includes('playful')) return 'warm'
  if (t.includes('minimal') || t.includes('clean') || t.includes('simple')) return 'minimalist'
  return 'professional'
}

/** Normalize 3-char hex shorthand to 6-char. Passthrough for others. */
function expandHex(hex: string): string {
  if (/^#[0-9a-fA-F]{3}$/.test(hex.trim())) {
    const h = hex.trim()
    return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
  }
  return hex.trim()
}

/** Strip unsafe chars from a Google Font family name for CSS injection. */
function sanitizeFontName(name: string): string {
  return name.trim().replace(/[^A-Za-z0-9 \-_]/g, '')
}

/** Wrap a font family name in quotes if it contains spaces. */
function quoteFont(name: string): string {
  const n = sanitizeFontName(name)
  return /\s/.test(n) ? `'${n}'` : n
}

/**
 * Derive the color-mix-based variant CSS vars from a primary hex.
 *
 * These are the vars that globals.css defines via formula notation but that
 * cannot be auto-derived in pure CSS without Houdini. We compute them
 * server-side so the :root block has concrete values.
 *
 * NOTE: The Tailwind primary.* ramp already handles this via color-mix() in
 * tailwind.config.ts — those resolve at browser runtime and are NOT emitted
 * here. Only the semantic named variants (hover, muted, dark) are emitted.
 */
function deriveColorVariants(primary: string): Record<string, string> {
  // These are semantic helpers consumed by non-Tailwind CSS (e.g. focus rings,
  // inline style overrides, the cssVarsRaw escape hatch).
  return {
    '--color-primary-hover': `color-mix(in oklab, ${primary} 85%, black)`,
    '--color-primary-dark': `color-mix(in oklab, ${primary} 62%, black)`,
    '--color-primary-muted': `color-mix(in oklab, ${primary} 12%, white)`,
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Build the CSS custom property string for :root injection.
 *
 * Returns a semicolon-joined string of "key:value" pairs (no spaces around
 * separators, valid as innerHTML of a <style> block that wraps it in :root{}).
 *
 * Layer order (later wins):
 *   1. Tone-derived defaults
 *   2. Shape/shadow/density preset overrides
 *   3. Explicit theme field overrides
 *   4. cssVarsRaw (escape hatch, injected last)
 */
export function getThemeVars(settings: SettingsLike): string {
  const theme = settings?.theme
  if (!theme) return ''

  const vars: Record<string, string> = {}

  // ── 1. Colors (base) ─────────────────────────────────────────────────────
  const primary = theme.primaryColor ? expandHex(theme.primaryColor) : null
  if (primary) {
    vars['--color-primary'] = primary
    // Derive semantic color variants from primary
    Object.assign(vars, deriveColorVariants(primary))
  }
  if (theme.accentColor)   vars['--color-accent']      = expandHex(theme.accentColor)
  if (theme.paperColor)    vars['--brand-paper']        = expandHex(theme.paperColor)
  if (theme.inkColor)      vars['--brand-ink']          = expandHex(theme.inkColor)
  if (theme.signalColor)   vars['--brand-signal']       = expandHex(theme.signalColor)
  if (theme.inkMutedColor) vars['--brand-ink-muted']    = expandHex(theme.inkMutedColor)

  // ── 2. Tone-derived defaults (applied before explicit to let explicit win) ─
  const toneKey = resolveTone(theme.tone)
  const toneDefaults = TONE_TOKENS[toneKey]

  // Apply tone shape/shadow/personality defaults
  if (toneDefaults.radiusButton)     vars['--radius-button']      = toneDefaults.radiusButton
  if (toneDefaults.radiusCard)       vars['--radius-card']        = toneDefaults.radiusCard
  if (toneDefaults.shadowCard)       vars['--shadow-card']        = toneDefaults.shadowCard
  if (toneDefaults.shadowButton)     vars['--shadow-button']      = toneDefaults.shadowButton
  if (toneDefaults.cardBorderWidth)  vars['--card-border-width']  = toneDefaults.cardBorderWidth
  if (toneDefaults.transitionDuration) vars['--transition-duration'] = toneDefaults.transitionDuration
  if (toneDefaults.transitionEasing)   vars['--transition-easing']   = toneDefaults.transitionEasing
  if (toneDefaults.grainOpacity)     vars['--grain-opacity']      = toneDefaults.grainOpacity
  if (toneDefaults.dividerOpacity)   vars['--divider-opacity']    = toneDefaults.dividerOpacity
  if (toneDefaults.trackingTight)    vars['--tracking-tight']     = toneDefaults.trackingTight

  // ── 3. Shape — radius preset ─────────────────────────────────────────────
  const radiusPresetKey = theme.radiusBase as keyof typeof RADIUS_PRESETS | undefined
  if (radiusPresetKey && RADIUS_PRESETS[radiusPresetKey]) {
    const r = RADIUS_PRESETS[radiusPresetKey]
    vars['--radius-none']   = '0rem'
    vars['--radius-sm']     = r.sm
    vars['--radius-md']     = r.md
    vars['--radius-lg']     = r.lg
    vars['--radius-full']   = '9999px'
    vars['--radius-button'] = r.button
    vars['--radius-card']   = r.card
    vars['--radius-input']  = r.input
  } else {
    // Individual explicit radius overrides (no preset)
    if (theme.radiusButton) vars['--radius-button'] = theme.radiusButton
    if (theme.radiusCard)   vars['--radius-card']   = theme.radiusCard
    if (theme.radiusInput)  vars['--radius-input']  = theme.radiusInput
    if (theme.radiusPill)   vars['--radius-full']   = theme.radiusPill
  }

  // ── 4. Shadow preset ─────────────────────────────────────────────────────
  const shadowPresetKey = theme.shadowLevel as keyof typeof SHADOW_PRESETS | undefined
  if (shadowPresetKey && SHADOW_PRESETS[shadowPresetKey]) {
    const s = SHADOW_PRESETS[shadowPresetKey]
    vars['--shadow-card']       = s.card
    vars['--shadow-button']     = s.button
    vars['--card-border-width'] = s.borderWidth
  }
  // Explicit shadow overrides win over preset
  if (theme.shadowCard)      vars['--shadow-card']       = theme.shadowCard
  if (theme.shadowButton)    vars['--shadow-button']     = theme.shadowButton
  if (theme.cardBorderWidth) vars['--card-border-width'] = theme.cardBorderWidth

  // ── 5. Density / Spacing preset ──────────────────────────────────────────
  const densityKey = theme.densityLevel as keyof typeof DENSITY_PRESETS | undefined
  if (densityKey && DENSITY_PRESETS[densityKey]) {
    const d = DENSITY_PRESETS[densityKey]
    vars['--section-padding-y']    = d.sectionY
    vars['--section-padding-y-sm'] = d.sectionYSm
    vars['--hero-padding-y']       = d.heroY
    vars['--card-padding']         = d.card
  } else {
    // Individual spacing overrides
    if (theme.sectionPaddingY)   vars['--section-padding-y']    = theme.sectionPaddingY
    if (theme.sectionPaddingYSm) vars['--section-padding-y-sm'] = theme.sectionPaddingYSm
    if (theme.heroPaddingY)      vars['--hero-padding-y']       = theme.heroPaddingY
    if (theme.cardPadding)       vars['--card-padding']         = theme.cardPadding
  }

  // ── 6. Motion overrides ───────────────────────────────────────────────────
  // (tone defaults already applied above; explicit wins)
  if (theme.transitionDuration) vars['--transition-duration'] = theme.transitionDuration
  if (theme.transitionEasing)   vars['--transition-easing']   = theme.transitionEasing

  // ── 7. Personality overrides ─────────────────────────────────────────────
  if (theme.grainOpacity)   vars['--grain-opacity']   = theme.grainOpacity
  if (theme.dividerOpacity) vars['--divider-opacity'] = theme.dividerOpacity

  // ── 8. Fonts ─────────────────────────────────────────────────────────────
  // Support both new flat fields (displayFont, bodyFont, monoFont) and legacy
  // nested fonts object — new fields take precedence.
  const displayFont = theme.displayFont ?? theme.fonts?.display ?? null
  const bodyFont    = theme.bodyFont    ?? theme.fonts?.body    ?? null
  const monoFont    = theme.monoFont    ?? null

  if (displayFont) {
    vars['--font-display'] = `${quoteFont(displayFont)}, var(--font-fraunces), Georgia, serif`
  }
  if (bodyFont) {
    vars['--font-body'] = `${quoteFont(bodyFont)}, var(--font-inter), ui-sans-serif, system-ui, sans-serif`
  }
  if (monoFont) {
    vars['--font-mono'] = `${quoteFont(monoFont)}, var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace`
  }

  // ── 9. cssVarsRaw escape hatch (injected last — wins over everything) ────
  if (theme.cssVarsRaw && typeof theme.cssVarsRaw === 'object') {
    for (const [k, v] of Object.entries(theme.cssVarsRaw)) {
      // Only allow valid CSS custom property names to prevent injection
      if (/^--[a-z][a-z0-9-]*$/.test(k)) {
        vars[k] = String(v)
      }
    }
  }

  return Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
}

// ─── Google Fonts ─────────────────────────────────────────────────────────────

/**
 * Href for Google Fonts <link> covering all tenant-specified font families.
 * Returns null when the tenant uses only the default Believe fonts (no extra load needed).
 */
export function getGoogleFontsHref(settings: SettingsLike): string | null {
  const theme = settings?.theme
  if (!theme) return null

  const families = new Set<string>()

  // Collect all font names from new and legacy fields
  const candidates = [
    theme.displayFont,
    theme.bodyFont,
    theme.monoFont,
    theme.fonts?.display,
    theme.fonts?.body,
  ]

  // Skip known Believe defaults — already loaded via next/font in layout.tsx
  const believeDefaults = new Set(['Fraunces', 'Inter', 'JetBrains Mono', 'JetBrains_Mono'])

  for (const name of candidates) {
    if (name && name.trim() && !believeDefaults.has(name.trim())) {
      families.add(sanitizeFontName(name.trim()))
    }
  }

  if (families.size === 0) return null

  const params = Array.from(families)
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700`)
    .join('&')

  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

// ─── Logo utility ──────────────────────────────────────────────────────────────

/**
 * Returns the tenant logo URL from settings, or null if using the wordmark fallback.
 * Consumed by Header and any block that renders a logo lockup.
 */
export function getLogoUrl(
  settings: { header?: { logo?: { url?: string } | null } | null } | null | undefined
): string | null {
  return settings?.header?.logo?.url ?? null
}

// ─── Demo themes ──────────────────────────────────────────────────────────────

/** Reference themes for visual QA and demo tenants. */
export const DEMO_THEMES: Record<string, TenantTheme> = {
  believe: {
    primaryColor: '#0c3bb9',
    accentColor: '#00aaff',
    paperColor: '#fafaf7',
    inkColor: '#1a1a1a',
    signalColor: '#00aaff',
    tone: 'professional',
    radiusBase: 'soft',
    shadowLevel: 'flat',
    densityLevel: 'default',
  },
  // Marca demo "Trust" — verde profundo + dorado, tono cálido, formas redondeadas.
  trust: {
    primaryColor: '#0f766e',
    accentColor: '#f59e0b',
    paperColor: '#f8faf9',
    inkColor: '#0b1f1c',
    signalColor: '#f59e0b',
    displayFont: 'Poppins',
    bodyFont: 'Poppins',
    tone: 'warm',
    radiusBase: 'rounded',
    shadowLevel: 'soft',
    densityLevel: 'default',
  },
  // Marca demo "Edge" — negro + rojo, bold, sin bordes.
  edge: {
    primaryColor: '#dc2626',
    accentColor: '#f97316',
    paperColor: '#0a0a0a',
    inkColor: '#f5f5f5',
    signalColor: '#f97316',
    tone: 'bold',
    radiusBase: 'none',
    shadowLevel: 'elevated',
    densityLevel: 'compact',
  },
  // Marca demo "Studio" — gris pizarra + índigo, minimalista.
  studio: {
    primaryColor: '#4f46e5',
    accentColor: '#818cf8',
    paperColor: '#ffffff',
    inkColor: '#0f172a',
    signalColor: '#818cf8',
    displayFont: 'DM Serif Display',
    bodyFont: 'DM Sans',
    tone: 'minimalist',
    radiusBase: 'none',
    shadowLevel: 'none',
    densityLevel: 'airy',
  },
}
