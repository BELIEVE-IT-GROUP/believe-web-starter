import { Metadata } from 'next'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getPageBySlug, getTenant } from '@/lib/payload'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home')
  const tenant = await getTenant()

  return {
    title: page?.meta?.title || tenant?.name || 'Believe Agency',
    description: page?.meta?.description || 'Web construida con believe-web-starter',
  }
}

// Demo content fallback when CMS is not available
const demoBlocks = [
  {
    id: 'hero-1',
    blockType: 'hero',
    headline: 'Construimos webs que convierten',
    subheadline: 'Believe Agency CMS + Next.js 15 + Flowbite Pro. Multi-tenant, ISR, live preview.',
    badge: 'Nuevo: believe-web-starter',
    ctas: [
      { text: 'Ver documentación', url: '#', style: 'primary' },
      { text: 'GitHub', url: '#', style: 'secondary' },
    ],
  },
  {
    id: 'features-1',
    blockType: 'features',
    headline: 'Todo lo que necesitas',
    subheadline: '15 bloques listos para usar, conectados a Payload CMS multi-tenant.',
    items: [
      { icon: '⚡', title: 'ISR + Revalidation', description: 'Páginas estáticas que se actualizan en segundos.' },
      { icon: '🎨', title: 'Flowbite Pro', description: 'Componentes premium con diseño profesional.' },
      { icon: '🏢', title: 'Multi-tenant', description: 'Un CMS, múltiples clientes aislados.' },
      { icon: '👁', title: 'Live Preview', description: 'Edición visual en tiempo real desde el CMS.' },
      { icon: '📱', title: 'Responsive', description: 'Mobile-first, optimizado para todos los dispositivos.' },
      { icon: '🔒', title: 'Type-safe', description: 'TypeScript end-to-end con tipos generados.' },
    ],
  },
  {
    id: 'cta-1',
    blockType: 'cta',
    headline: 'Empezá hoy',
    subheadline: 'Cloná el repo, configurá tu tenant y tené tu web corriendo en minutos.',
    cta: { text: 'Ver en GitHub', url: 'https://github.com/BELIEVE-IT-GROUP/believe-web-starter' },
  },
]

export default async function HomePage() {
  const page = await getPageBySlug('home')
  const blocks = page?.layout || demoBlocks

  return <BlockRenderer blocks={blocks} />
}
