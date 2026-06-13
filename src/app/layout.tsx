import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSettings } from '@/lib/payload'
import { getThemeVars, getGoogleFontsHref } from '@/lib/theme'

// Tipografia Believe (brandbook 2026): Fraunces display, Inter body, JetBrains Mono data
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz'],
  display: 'swap',
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Believe Agency',
  description: 'Web construida con believe-web-starter',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const themeVars = getThemeVars(settings)
  const googleFontsHref = getGoogleFontsHref(settings)

  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}>
      <head>
        {/* A2 — identidad del tenant (DNA Maasy): CSS vars en :root + fuentes Google dinámicas. */}
        {themeVars ? <style dangerouslySetInnerHTML={{ __html: `:root{${themeVars}}` }} /> : null}
        {googleFontsHref ? <link rel="stylesheet" href={googleFontsHref} /> : null}
      </head>
      <body className="grain bg-paper font-sans text-ink-900 antialiased">
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
