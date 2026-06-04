import { Metadata } from 'next'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

export const metadata: Metadata = {
  title: 'Flowbite Pro Showcase',
  description: 'Showcase de los 15 bloques CMS mapeados a templates Flowbite Pro.',
}

const showcaseBlocks = [
  {
    id: 'hero-showcase',
    blockType: 'hero',
    templateId: 'hero.default',
    badge: 'Flowbite Pro',
    headline: 'CMS blocks mapped to real Flowbite templates',
    subheadline: 'Cada bloque trae blockType, templateId, contenido y appearance para renderizar cualquier web desde Payload.',
    appearance: { background: 'white', container: 'xl', alignment: 'center', spacingTop: 'lg', sectionId: 'top' },
    ctas: [
      { text: 'Ver bloques', url: '#features', style: 'primary' },
      { text: 'Contactar', url: '#contact', style: 'secondary' },
    ],
  },
  {
    id: 'features-showcase',
    blockType: 'features',
    templateId: 'features.card-list',
    headline: 'Sistema listo para escalar',
    subheadline: 'El CMS controla variantes visuales sin redeploy.',
    appearance: { background: 'gray', sectionId: 'features' },
    items: [
      { icon: 'blocks', title: '15 bloques', description: 'Hero, features, pricing, CTA, forms, blog y más.' },
      { icon: 'palette', title: 'Templates Pro', description: 'Cada bloque referencia un archivo Flowbite React Blocks.' },
      { icon: 'refresh', title: 'ISR', description: 'Publicar en Payload puede revalidar el frontend.' },
    ],
  },
  {
    id: 'split-showcase',
    blockType: 'split-content',
    templateId: 'split-content.two-columns',
    headline: 'Contenido flexible',
    body: 'Rich text, imágenes, CTAs y layouts se adaptan al template seleccionado.',
    appearance: { background: 'white', container: 'lg' },
    ctas: [{ text: 'Leer más', url: '#', style: 'primary' }],
  },
  {
    id: 'stats-showcase',
    blockType: 'stats',
    templateId: 'stats.heading-statistics',
    headline: 'Métricas',
    appearance: { background: 'gray', spacingTop: 'md', spacingBottom: 'md' },
    items: [
      { value: '15', label: 'Bloques' },
      { value: '100+', label: 'Templates mapeables' },
      { value: '<5s', label: 'ISR target' },
      { value: '1', label: 'CMS multi-tenant' },
    ],
  },
  {
    id: 'pricing-showcase',
    blockType: 'pricing',
    templateId: 'pricing.highlighted-plan',
    headline: 'Pricing',
    subheadline: 'Planes renderizados desde Payload.',
    appearance: { background: 'gray' },
    tiers: [
      { name: 'Starter', price: '$99', period: 'mes', features: ['CMS', 'Hosting', 'Soporte'], cta: { text: 'Elegir', url: '#' } },
      { name: 'Pro', price: '$299', period: 'mes', highlighted: true, features: ['Todo Starter', 'Blog', 'Analytics'], cta: { text: 'Elegir Pro', url: '#' } },
      { name: 'Scale', price: '$799', period: 'mes', features: ['Multi-site', 'SLA', 'Integraciones'], cta: { text: 'Hablar ventas', url: '#' } },
    ],
  },
  {
    id: 'testimonials-showcase',
    blockType: 'testimonials',
    templateId: 'testimonials.cards',
    headline: 'Testimonios',
    appearance: { background: 'white', container: 'lg' },
    items: [
      { quote: 'El CMS dejó de ser una caja negra.', author: 'George', role: 'Operator', company: 'Believe' },
      { quote: 'Ahora las variantes visuales están bajo control editorial.', author: 'Team', role: 'Design', company: 'Believe' },
    ],
  },
  {
    id: 'logo-showcase',
    blockType: 'logo-cloud',
    templateId: 'logo-cloud.default',
    headline: 'Confían en nosotros',
    appearance: { background: 'gray', spacingTop: 'sm', spacingBottom: 'sm' },
    logos: [],
  },
  {
    id: 'gallery-showcase',
    blockType: 'gallery',
    templateId: 'gallery.image-gallery',
    headline: 'Galería',
    appearance: { background: 'white', container: 'lg' },
    images: [],
  },
  {
    id: 'video-showcase',
    blockType: 'video-embed',
    templateId: 'video-embed.content-video',
    headline: 'Video',
    appearance: { background: 'gray', container: 'lg' },
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    caption: 'Video embebido desde el CMS.',
  },
  {
    id: 'team-showcase',
    blockType: 'team',
    templateId: 'team.grid-clean',
    headline: 'Equipo',
    appearance: { background: 'white' },
    members: [
      { name: 'Editor CMS', role: 'Content', bio: 'Gestiona bloques y variantes.' },
      { name: 'Frontend', role: 'Renderer', bio: 'Convierte templateId en UI real.' },
    ],
  },
  {
    id: 'faq-showcase',
    blockType: 'faq',
    templateId: 'faq.accordion',
    headline: 'FAQ',
    appearance: { background: 'gray', container: 'md' },
    items: [
      { question: '¿El templateId viene del CMS?', answer: 'Sí, Payload guarda la variante Flowbite elegida.' },
      { question: '¿Esto reemplaza el frontend?', answer: 'No. El starter adapta y renderiza los templates.' },
    ],
  },
  {
    id: 'blog-showcase',
    blockType: 'blog-list',
    templateId: 'blog-list.default',
    headline: 'Blog',
    appearance: { background: 'white' },
    posts: [],
  },
  {
    id: 'cta-showcase',
    blockType: 'cta',
    templateId: 'cta.default',
    headline: 'Listo para conectar contenido real',
    subheadline: 'El siguiente paso es copiar/adaptar más variantes Flowbite Pro específicas.',
    appearance: { background: 'primary', sectionId: 'cta' },
    cta: { text: 'Volver arriba', url: '#' },
  },
  {
    id: 'newsletter-showcase',
    blockType: 'newsletter',
    templateId: 'newsletter.default',
    headline: 'Newsletter',
    subheadline: 'Endpoint real conectado a /api/newsletter.',
    appearance: { background: 'primary' },
  },
  {
    id: 'contact-showcase',
    blockType: 'contact',
    templateId: 'contact.default',
    headline: 'Contacto',
    subheadline: 'Endpoint real conectado a /api/contact.',
    destinationEmail: 'hello@example.com',
    appearance: { background: 'white', sectionId: 'contact' },
  },
]

export default function FlowbiteProShowcasePage() {
  return <BlockRenderer blocks={showcaseBlocks} />
}
