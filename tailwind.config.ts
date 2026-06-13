import type { Config } from 'tailwindcss'
import flowbite from 'flowbite/plugin'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/dist/**/*.{js,mjs}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Sistema de color Believe (brandbook 2026): Paper · Ink · Signal
        paper: { DEFAULT: '#fafaf7', 50: '#fafaf7', 100: '#f2f2ec' },
        ink: { DEFAULT: '#1a1a1a', 900: '#1a1a1a', 700: '#3a3a38', 500: '#6b6b65' },
        believe: { DEFAULT: '#0c3bb9', 700: '#0c3bb9', 900: '#062778' },
        signal: { DEFAULT: '#00aaff', 400: '#00aaff' },
        // primary mapeado a Believe Blue 700 (el TenantTheme aun puede overridear via --color-primary)
        primary: {
          DEFAULT: 'var(--color-primary, #0c3bb9)',
          50: '#eaeefb',
          100: '#d2dcf6',
          200: '#a6b9ed',
          300: '#7896e4',
          400: '#3f63d4',
          500: 'var(--color-primary, #0c3bb9)',
          600: '#0c3bb9',
          700: '#0c3bb9',
          800: '#0a31a0',
          900: '#062778',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #00aaff)',
          400: '#00aaff',
          500: 'var(--color-accent, #00aaff)',
          600: '#0090e0',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
