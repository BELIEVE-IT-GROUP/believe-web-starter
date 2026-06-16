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
        // believe.* remapped to CSS vars so all bg-believe-* / text-believe-* classes
        // respond to --color-primary. This single change makes all 31 hardcoded color
        // usages in block components tenant-dynamic without touching any TSX file.
        believe: {
          DEFAULT: 'var(--color-primary, #0c3bb9)',
          700: 'var(--color-primary, #0c3bb9)',
          900: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 62%, black)',
        },
        // signal.400 remapped so text-signal-400 / bg-signal-400 respect --brand-signal.
        signal: {
          DEFAULT: 'var(--brand-signal, #00aaff)',
          400: 'var(--brand-signal, #00aaff)',
        },
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
        // Fuentes theme-able: tenant override via CSS vars, fallback Believe.
        display: ['var(--font-display, var(--font-fraunces))', 'Georgia', 'Cambria', 'serif'],
        sans:    ['var(--font-body, var(--font-inter))', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // mono updated to use --font-mono so tenant monoFont field propagates.
        mono:    ['var(--font-mono, var(--font-jetbrains))', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // Radius tokens — all backed by CSS vars so tenant radiusBase preset cascades
      // to every rounded-button, rounded-card, rounded-input class in blocks.
      borderRadius: {
        none:   'var(--radius-none, 0rem)',
        sm:     'var(--radius-sm, 0.25rem)',
        DEFAULT:'var(--radius-md, 0.5rem)',
        md:     'var(--radius-md, 0.5rem)',
        lg:     'var(--radius-lg, 0.75rem)',
        full:   'var(--radius-full, 9999px)',
        button: 'var(--radius-button, 0.375rem)',
        card:   'var(--radius-card, 0.5rem)',
        input:  'var(--radius-input, 0.375rem)',
      },
      // Shadow tokens — backed by CSS vars so tenant shadowLevel preset cascades.
      boxShadow: {
        sm:     'var(--shadow-sm)',
        DEFAULT:'var(--shadow-md)',
        md:     'var(--shadow-md)',
        lg:     'var(--shadow-lg)',
        xl:     'var(--shadow-xl)',
        card:   'var(--shadow-card)',
        button: 'var(--shadow-button)',
      },
      // Transition duration tokens — backed by CSS vars so tone drives animation speed.
      transitionDuration: {
        fast:    'var(--transition-fast, 150ms)',
        DEFAULT: 'var(--transition-duration, 300ms)',
        slow:    'var(--transition-slow, 500ms)',
      },
      // Named padding tokens for section/card spacing.
      padding: {
        section: 'var(--section-padding-y, 6rem)',
        card:    'var(--card-padding, 2rem)',
      },
      maxWidth: {
        headline:  '14ch',
        container: 'var(--container-max, 80rem)',
      },
      letterSpacing: {
        eyebrow: '0.2em',
        tight:   'var(--tracking-tight, -0.015em)',
      },
    },
  },
  plugins: [flowbite],
}
export default config
