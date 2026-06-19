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
  title: 'Believe Global Group — Brand Intelligence para la era de los agentes',
  description: 'Believe construye la infraestructura de marca para la era de los agentes IA. MAAS™, Brand Brain OS, APS Optimizer y Agent-Ready Brand Audit para marcas en LATAM.',
  metadataBase: new URL('https://believe-global.com'),
  openGraph: {
    title: 'Believe Global Group',
    description: 'Brand intelligence para la era de los agentes IA.',
    url: 'https://believe-global.com',
    siteName: 'Believe Global Group',
    locale: 'es_LA',
    type: 'website',
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'Believe Global Group',
                  url: 'https://believe-global.com',
                  logo: 'https://believe-global.com/logo.png',
                  description: 'Believe construye la infraestructura de marca para la era de los agentes IA. MAAS™ es la metodología propietaria para que las marcas sean recomendadas por inteligencias artificiales.',
                  founder: { '@type': 'Person', name: 'Jorge Beltrán' },
                  sameAs: [
                    'https://believe-global.com',
                    'https://maasy.ai',
                  ],
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Productos MAAS 3.0',
                    itemListElement: [
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Agent-Ready Brand Audit™', description: 'Diagnóstico y plan de acción de recomendabilidad agentica: qué tan bien preparada está una marca para ser preferida por agentes IA.' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brand Brain OS™', description: 'Sistema operativo de marca vectorizado, auto-evolucionable y consumible via MCP por cualquier LLM.' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Agent-Readable Brand Profile™', description: 'Perfil público LLM-native por marca: URL canónica consultable directamente por agentes de IA.' } },
                    ],
                  },
                },
                {
                  '@type': 'FAQPage',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: '¿Qué es MAAS™?',
                      acceptedAnswer: { '@type': 'Answer', text: 'MAAS™ (Marketing as a System) es la metodología propietaria de Believe para construir marcas que sean preferidas y recomendadas por agentes de IA. Va más allá del SEO tradicional: se trata de que la marca tenga un ADN estructurado, verificable y consumible por cualquier LLM.' },
                    },
                    {
                      '@type': 'Question',
                      name: '¿Qué es el APS (Agent Preference Score)?',
                      acceptedAnswer: { '@type': 'Answer', text: 'El APS es la métrica propietaria de Believe que mide qué tan probable es que un agente de IA prefiera y recomiende una marca. Se evalúa en 5 dimensiones: Discoverabilidad Agéntica, Inteligencia Estructurada, Capacidad de Acción, Autoridad de Fuente y Reputación Agéntica. Escala de 0 a 100.' },
                    },
                    {
                      '@type': 'Question',
                      name: '¿Cómo puede un agente de IA acceder a la inteligencia de marca de Believe?',
                      acceptedAnswer: { '@type': 'Answer', text: 'A través del MCP server de Maasy (mcp.maasy.ai) con 21 herramientas especializadas de marketing. Los agentes pueden consultar el Brand Brain, generar contenido calibrado para cada marca y ejecutar acciones de marketing. Instalar: npx -y @maasy-ai/mcp-server@latest' },
                    },
                    {
                      '@type': 'Question',
                      name: '¿En qué se diferencia Believe de una agencia de marketing tradicional?',
                      acceptedAnswer: { '@type': 'Answer', text: 'Believe construye infraestructura de marca para la era de los agentes, no solo campañas. Desarrollamos el Brand Brain vectorizado de cada marca, medimos su APS y diseñamos su Agent-Readable Brand Profile para que sea preferida cuando un agente IA tome una decisión de compra o recomendación en nombre de un usuario.' },
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
