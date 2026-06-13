/**
 * A2 — Theming dinámico por tenant (DNA Maasy → CSS custom properties).
 *
 * El frontend NO hardcodea colores ni fuentes. Lee `settings.theme` (poblado desde el DNA
 * de la marca) y lo inyecta como CSS vars en :root por request. Tailwind consume esas vars
 * (tokens var(--color-primary), var(--font-display), etc.), así las 133 variantes Flowbite
 * se themean con la identidad de cada marca sin tocar archivo por archivo.
 *
 * Believe es el theme por defecto (fallbacks en globals.css + tailwind.config).
 */

export type TenantTheme = {
  primaryColor?: string | null
  accentColor?: string | null
  paperColor?: string | null
  inkColor?: string | null
  /** Fuentes Google por nombre (ej. "Poppins"). Si faltan, cae a las fuentes Believe. */
  fonts?: {
    display?: string | null
    body?: string | null
  } | null
  /** Tono de voz editorial (no afecta CSS; lo usa el skill/MCP para copy). */
  tone?: string | null
}

type SettingsLike = { theme?: TenantTheme | null } | null | undefined

function quoteFont(name: string): string {
  const n = name.trim()
  // Familias con espacios necesitan comillas en CSS.
  return /\s/.test(n) ? `'${n.replace(/'/g, '')}'` : n
}

/**
 * Devuelve el string CSS para inyectar en :root con las vars del tenant.
 * Solo emite las vars presentes (el resto cae al fallback Believe de globals.css).
 */
export function getThemeVars(settings: SettingsLike): string {
  const theme = settings?.theme
  if (!theme) return ''
  const vars: Record<string, string> = {}

  if (theme.primaryColor) vars['--color-primary'] = theme.primaryColor
  if (theme.accentColor) vars['--color-accent'] = theme.accentColor
  if (theme.paperColor) vars['--brand-paper'] = theme.paperColor
  if (theme.inkColor) vars['--brand-ink'] = theme.inkColor

  const display = theme.fonts?.display
  const body = theme.fonts?.body
  if (display) vars['--font-display'] = `${quoteFont(display)}, var(--font-fraunces), Georgia, serif`
  if (body) vars['--font-body'] = `${quoteFont(body)}, var(--font-inter), ui-sans-serif, system-ui, sans-serif`

  return Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
}

/**
 * Href de Google Fonts para las fuentes del tenant (display + body), o null si usa las Believe.
 * Se inyecta como <link> en el layout para cargar la familia por nombre.
 */
export function getGoogleFontsHref(settings: SettingsLike): string | null {
  const fonts = settings?.theme?.fonts
  if (!fonts) return null
  const families = new Set<string>()
  for (const name of [fonts.display, fonts.body]) {
    if (name && name.trim()) families.add(name.trim())
  }
  if (families.size === 0) return null
  const params = Array.from(families)
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

/** Theme de demo para evidencia visual de A2 (segundo tenant con identidad distinta a Believe). */
export const DEMO_THEMES: Record<string, TenantTheme> = {
  believe: {
    primaryColor: '#0c3bb9',
    accentColor: '#00aaff',
    paperColor: '#fafaf7',
    inkColor: '#1a1a1a',
  },
  // Marca demo "Trust" — verde profundo + dorado, fuente Poppins/serif distinta.
  trust: {
    primaryColor: '#0f766e',
    accentColor: '#f59e0b',
    paperColor: '#f8faf9',
    inkColor: '#0b1f1c',
    fonts: { display: 'Poppins', body: 'Poppins' },
    tone: 'cálido, cercano, confiable',
  },
}
