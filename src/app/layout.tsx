import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSettings } from '@/lib/payload'

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

  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}>
      <body className="grain bg-paper font-sans text-ink-900 antialiased">
        <TenantTheme settings={settings} />
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}

function TenantTheme({ settings }: { settings: Awaited<ReturnType<typeof getSettings>> }) {
  const primary = settings?.theme?.primaryColor
  const accent = settings?.theme?.accentColor
  if (!primary && !accent) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root{${primary ? `--color-primary:${primary};` : ''}${accent ? `--color-accent:${accent};` : ''}}`,
      }}
    />
  )
}
