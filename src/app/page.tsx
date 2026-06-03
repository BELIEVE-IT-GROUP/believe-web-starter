import { Metadata } from 'next'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getPageBySlug } from '@/lib/payload'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home')
  return {
    title: page?.seo?.title || page?.title || 'Believe Agency',
    description: page?.seo?.description || 'Web construida con believe-web-starter',
  }
}

const demoBlocks = [
  {
    id: 'hero-1',
    blockType: 'hero',
    headline: 'Construimos webs que convierten',
    subheadline: 'Believe Agency: CMS multi-tenant + Next.js + Flowbite Pro. Desplegado en minutos, escalable para siempre.',
    badge: 'Nuevo: believe-web-starter',
    ctas: [
      { text: 'Ver documentación', url: '#', style: 'primary' },
      { text: 'GitHub', url: '#', style: 'secondary' },
    ],
  },
  {
    id: 'features-1',
    blockType: 'features',
    headline: 'Todo lo que necesitás',
    subheadline: 'Un stack completo para agencies y studios. CMS real conectado, no placeholder.',
    items: [
      { icon: 'zap', title: 'ISR + Revalidation', description: 'Contenido estático que se actualiza en segundos via webhook.' },
      { icon: 'palette', title: 'Flowbite Pro', description: '15 bloquepremium con diseño profesional listos para usar.' },
      { icon: 'building', title: 'Multi-tenant Real', description: 'Cada cliente ve solo su contenido. Un CMS, múltiples marcas.' },
      { icon: 'eye', title: 'Live Preview', description: 'Editá en el CMS y ve los cambios en tiempo real.' },
      { icon: 'smartphone', title: 'Mobile-first', description: 'Responsive por defecto. Optimizado para todos los dispositivos.' },
      { icon: 'shield', title: 'Type-safe', description: 'TypeScript end-to-end. Tipos autogenerados desde el schema.' },
    ],
  },
  {
    id: 'cta-1',
    blockType: 'cta',
    headline: 'Empezá hoy',
    subheadline: 'Cloná el repo, conectá tu tenant y tené tu web corriendo en minutos.',
    cta: { text: 'Ver en GitHub', url: 'https://github.com/BELIEVE-IT-GROUP/believe-web-starter' },
  },
]

export default async function HomePage() {
  const page = await getPageBySlug('home')
  // NOTE: Payload blocks requieren creación via admin por la complejidad de relaciones polimórficas.
  // Cuando se agreguen bloques desde el admin del CMS, se consumirán automáticamente.
  const blocks = page?.blocks?.length ? page.blocks : demoBlocks

  return <BlockRenderer blocks={blocks} />
}
