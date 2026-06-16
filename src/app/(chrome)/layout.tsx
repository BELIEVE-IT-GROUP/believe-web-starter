import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SiteHeader } from '@/components/sections/SiteHeader'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { getSettings } from '@/lib/payload'

// Chrome del tenant Believe (header + footer + fondo). Envuelve solo las paginas
// que heredan el chrome del sitio. Las paginas standalone (birdman, trust-demo,
// *-preview) viven fuera de este grupo y se sirven con el root layout neutro,
// trayendo su propio chrome dentro de su markup.
export default async function ChromeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  // Render mode por tenant (build-time): 'custom' usa el motor de secciones custom.
  const useCustomChrome = process.env.NEXT_PUBLIC_RENDER_MODE === 'custom'

  return (
    <div className="grain bg-paper font-sans text-ink-900 antialiased min-h-screen">
      {useCustomChrome ? (
        <SiteHeader
          siteName={settings?.siteName}
          logo={settings?.header?.logo}
          navLinks={settings?.header?.navLinks}
          cta={settings?.header?.cta}
        />
      ) : (
        <Header settings={settings} />
      )}
      <main>{children}</main>
      {useCustomChrome ? (
        <SiteFooter
          siteName={settings?.siteName}
          text={settings?.footer?.text}
          links={settings?.footer?.links}
          social={settings?.socialLinks}
        />
      ) : (
        <Footer settings={settings} />
      )}
    </div>
  )
}
