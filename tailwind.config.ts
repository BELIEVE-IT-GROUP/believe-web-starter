import type { Config } from 'tailwindcss'
import flowbite from 'flowbite/plugin'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Las 133 variantes Flowbite copiadas (A3) viven acá: Tailwind DEBE escanearlas
    // o renderizan sin estilos (lección Fase 1: CSS 2.4KB).
    './src/flowbite/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/dist/**/*.{js,mjs}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Sistema de color Believe (brandbook 2026) — ahora theme-able por tenant via CSS vars.
        // Fallbacks Believe en cada var: sin theme, todo se ve Believe.
        paper: { DEFAULT: 'var(--brand-paper, #fafaf7)', 50: '#fafaf7', 100: '#f2f2ec' },
        ink: { DEFAULT: 'var(--brand-ink, #1a1a1a)', 900: 'var(--brand-ink, #1a1a1a)', 700: '#3a3a38', 500: '#6b6b65' },
        believe: { DEFAULT: '#0c3bb9', 700: '#0c3bb9', 900: '#062778' },
        signal: { DEFAULT: 'var(--brand-signal, #00aaff)', 400: '#00aaff' },
        // Ramp del primary derivado de UN color de marca (var --color-primary) via color-mix.
        // 600/700 = color exacto de la marca (botones Flowbite on-brand); tints/shades derivados.
        primary: {
          DEFAULT: 'var(--color-primary, #0c3bb9)',
          50: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 8%, white)',
          100: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 16%, white)',
          200: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 30%, white)',
          300: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 50%, white)',
          400: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 72%, white)',
          500: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 90%, white)',
          600: 'var(--color-primary, #0c3bb9)',
          700: 'var(--color-primary, #0c3bb9)',
          800: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 80%, black)',
          900: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 62%, black)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #00aaff)',
          400: 'var(--color-accent, #00aaff)',
          500: 'var(--color-accent, #00aaff)',
          600: 'color-mix(in oklab, var(--color-accent, #00aaff) 85%, black)',
        },
      },
      fontFamily: {
        // Fuentes theme-able: tenant override via --font-display/--font-body, fallback Believe.
        display: ['var(--font-display, var(--font-fraunces))', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-body, var(--font-inter))', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        headline: '14ch',
      },
      letterSpacing: {
        eyebrow: '0.2em',
      },
    },
  },
  plugins: [flowbite],
}
export default config
