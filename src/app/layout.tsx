import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
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

// Root layout NEUTRO: solo el documento + fuentes + las CSS vars del tenant.
// NO impone header/footer ni fondo: ese chrome vive en el route group (chrome)
// para las paginas Believe. Las paginas standalone (birdman, trust-demo, *-preview)
// traen su propio chrome y fondo dentro de su markup, sin duplicados.
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
        {/* A2 — identidad del tenant (DNA Maasy): CSS vars en :root + fuentes Google dinamicas. */}
        {themeVars ? <style dangerouslySetInnerHTML={{ __html: `:root{${themeVars}}` }} /> : null}
        {googleFontsHref ? <link rel="stylesheet" href={googleFontsHref} /> : null}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
