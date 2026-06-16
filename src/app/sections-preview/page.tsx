import '../globals.css'

/**
 * Sections showcase — static prerendered preview of all 19 custom sections.
 *
 * No fetch, no force-dynamic: this page must prerender in `next build`. That is
 * our render E2E gate. Each section is rendered once with rich Trust-style mock
 * data (fulfillment DTC Mexico) and labeled with a small [Export] QA rotulo.
 *
 * The whole page is wrapped in a div that sets Trust CSS vars + imports
 * Syne/Montserrat, so the showcase looks like Trust regardless of the global
 * Believe theme.
 */

import type { CSSProperties } from 'react'

import { BlogPreview } from '@/components/sections/BlogPreview'
import { ContactSection } from '@/components/sections/ContactSection'
import { ContentSplit } from '@/components/sections/ContentSplit'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { GalleryGrid } from '@/components/sections/GalleryGrid'
import { HeroSection } from '@/components/sections/HeroSection'
import { LeadCTA } from '@/components/sections/LeadCTA'
import { LogoBar } from '@/components/sections/LogoBar'
import { MetricsPanel } from '@/components/sections/MetricsPanel'
import { NewsletterBar } from '@/components/sections/NewsletterBar'
import { PainSection } from '@/components/sections/PainSection'
import { PricingTable } from '@/components/sections/PricingTable'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { SiteHeader } from '@/components/sections/SiteHeader'
import { SocialProof } from '@/components/sections/SocialProof'
import { StepsSection } from '@/components/sections/StepsSection'
import { TeamGrid } from '@/components/sections/TeamGrid'
import { VideoSection } from '@/components/sections/VideoSection'

export const metadata = {
  title: 'Sections Preview — Custom Sections Engine',
  description: 'Showcase estatico de los 19 componentes custom con datos mock estilo Trust.',
}

// Trust theme vars applied to the whole showcase tree.
const TRUST_VARS: CSSProperties = {
  // @ts-expect-error CSS custom properties
  '--color-primary': '#ff8400',
  '--color-primary-hover': '#e07600',
  '--color-primary-dark': '#b35e00',
  '--color-on-primary': '#0a0a0a',
  '--brand-paper': '#ffffff',
  '--brand-ink': '#0a0a0a',
  '--brand-ink-muted': '#5a5a5a',
  '--brand-signal': '#ff8400',
  '--color-accent': '#ff8400',
  '--font-display': "'Syne', system-ui, sans-serif",
  '--font-body': "'Montserrat', system-ui, sans-serif",
  '--font-mono': "'Syne', ui-monospace, monospace",
}

// Small QA label above each section.
function Rotulo({ name }: { name: string }) {
  return (
    <div
      style={{
        fontFamily: 'ui-monospace, monospace',
        fontSize: '0.6875rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#ff8400',
        background: '#0a0a0a',
        padding: '0.5rem clamp(1.25rem, 5vw, 3rem)',
      }}
    >
      [{name}]
    </div>
  )
}

export default function SectionsPreviewPage() {
  return (
    <div style={TRUST_VARS}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');
      `}</style>

      <Rotulo name="SiteHeader" />
      <SiteHeader
        siteName="Trust"
        navLinks={[
          { label: 'Sistema', url: '#sistema' },
          { label: 'Resultados', url: '#resultados' },
          { label: 'Precios', url: '#precios' },
          { label: 'Contacto', url: '#contacto' },
        ]}
        cta={{ label: 'Diagnostico gratis', url: '#diagnostico' }}
      />

      <Rotulo name="HeroSection (metrics)" />
      <HeroSection
        variant="metrics"
        badge="Fulfillment DTC Mexico"
        eyebrow="Fulfillment que se demuestra"
        headline="Tu operacion no puede seguir"
        headlineEmphasis="siendo una apuesta."
        subheadline="Cada orden tardada es un cliente que no vuelve. Cada error de picking, una devolucion. TRUST convierte tu fulfillment en un sistema predecible, con evidencia de cada movimiento."
        ctas={[
          { text: 'Diagnostico Operativo gratis', url: '#diagnostico', style: 'primary' },
          { text: 'Ver el sistema', url: '#sistema', style: 'secondary' },
        ]}
        stats={[
          { value: '+300K', label: 'ordenes procesadas', description: 'con trazabilidad completa' },
          { value: '-30%', label: 'errores de picking', description: 'promedio en primer trimestre' },
          { value: '+15%', label: 'velocidad de entrega', description: 'en los primeros 60 dias' },
        ]}
      />

      <Rotulo name="PainSection (cards)" />
      <PainSection
        eyebrow="El costo real"
        headline="Que pasa cuando el fulfillment falla"
        subheadline="No es solo un error en el almacen. Es tu reputacion, tu CAC y tu tasa de recompra."
        variant="cards"
        cards={[
          { title: 'Errores de picking', description: 'Cada devolucion cuesta entre 120 y 400 pesos en reversa, reposicion y atencion, mas el cliente que ya no regresa.', data: '1 de cada 8 ordenes con error sin sistema' },
          { title: 'SLA incumplido', description: 'Un dia de retraso aumenta 40% la probabilidad de cancelacion o queja publica. En temporada alta el dano se multiplica.', data: '3 de cada 10 ordenes tarde en peak' },
          { title: 'Devoluciones sin control', description: 'Sin proceso de reversa trazado pierdes el producto y el historial del cliente. La logistica inversa es donde mas dinero se pierde en silencio.', data: '68% no vuelve tras una mala devolucion' },
        ]}
      />

      <Rotulo name="FeatureGrid (pillars)" />
      <FeatureGrid
        eyebrow="El sistema TRUST"
        headline="Cuatro pilares. Un solo resultado: certeza."
        subheadline="No vendemos promesas de fulfillment. Instalamos un sistema de operacion medible con cuatro componentes que funcionan juntos."
        variant="pillars"
        items={[
          { code: 'POD', title: 'Prueba de cada entrega', description: 'Foto, firma y timestamp en cada orden entregada. Si ocurrio, quedo registrado.' },
          { code: 'SLA', title: 'Tiempos por escrito', description: 'Alistamiento, despacho y entrega definidos en contrato. Lo cumplimos o lo medimos juntos.' },
          { code: 'COD', title: 'Pago contraentrega', description: 'Operacion cerrada de punta a punta, incluyendo COD y reconciliacion de flujo. Sin fuga.' },
          { code: 'Panel', title: 'Visibilidad en vivo', description: 'Inventario, ordenes en proceso y estado de cada entrega en un dashboard siempre actualizado.' },
        ]}
      />

      <Rotulo name="StepsSection (linear)" />
      <StepsSection
        eyebrow="Como funciona"
        headline="De caja negra a operacion medible en tres pasos"
        subheadline="Sin frenar tus ventas durante la transicion."
        variant="linear"
        items={[
          { number: '01', title: 'Diagnostico', description: 'Auditamos tu operacion actual y cuantificamos cuanto te cuesta hoy.' },
          { number: '02', title: 'Instalacion', description: 'Conectamos panel, SLA, POD y COD a tu catalogo y canales de venta.' },
          { number: '03', title: 'Operacion medida', description: 'Cada orden con evidencia. Cada SLA con numero. Sin supuestos.' },
        ]}
      />

      <Rotulo name="MetricsPanel" />
      <MetricsPanel
        eyebrow="Resultados reales"
        headline="Numeros que se sostienen con evidencia"
        items={[
          { value: '+300,000', label: 'ordenes procesadas', description: 'con control y trazabilidad demostrables' },
          { value: '30%', label: 'menos errores de picking', description: 'promedio tras el primer trimestre' },
          { value: '15%', label: 'mejor tiempo de entrega', description: 'en los primeros 60 dias' },
          { value: '100%', label: 'rastreabilidad', description: 'ningun movimiento sin registro' },
        ]}
      />

      <Rotulo name="SocialProof (single)" />
      <SocialProof
        headline="Lo que dicen las marcas que ya operan con certeza"
        variant="single"
        items={[
          {
            name: 'Direccion general',
            role: 'CEO',
            company: 'Tienda de moda DTC, CDMX',
            quote: 'Estabamos hartos de la incertidumbre en nuestras entregas. Con TRUST la paz mental regreso y los numeros lo confirman.',
            rating: 5,
            metric: '-32% en quejas por entrega',
          },
        ]}
      />

      <Rotulo name="LogoBar" />
      <LogoBar
        headline="Marcas DTC que ya operan con TRUST"
        logos={[
          { alt: 'Marca uno', url: '#' },
          { alt: 'Marca dos', url: '#' },
          { alt: 'Marca tres', url: '#' },
          { alt: 'Marca cuatro', url: '#' },
          { alt: 'Marca cinco', url: '#' },
        ]}
      />

      <Rotulo name="ContentSplit" />
      <ContentSplit
        eyebrow="Para quien es"
        headline="Si ya vendes y sientes el peso de escalar sin sistema, TRUST es para ti"
        body="Trabajamos con marcas que ya tienen volumen y que ya sienten el costo de operar a ciegas. Si tienes ordenes y no tienes control, este es tu operador. Anti-ICP: si estas empezando o solo buscas precio, no somos para ti."
        imagePosition="right"
        ctas={[{ text: 'Ver si califico', url: '#diagnostico', style: 'primary' }]}
      />

      <Rotulo name="PricingTable" />
      <PricingTable
        headline="Planes que escalan con tu volumen"
        subheadline="Sin letra chica. El SLA va por escrito en cada plan."
        plans={[
          { name: 'Arranque', price: '$0 setup', description: 'Para marcas que estan ordenando su operacion.', features: ['Panel en vivo', 'POD en cada entrega', 'Soporte por chat'], notIncluded: ['COD', 'SLA contractual'], ctaText: 'Empezar', ctaUrl: '#contacto' },
          { name: 'Operacion', price: 'A medida', description: 'El plan completo para marcas con volumen.', features: ['Todo en Arranque', 'COD y reconciliacion', 'SLA contractual', 'Account manager'], notIncluded: [], ctaText: 'Cotizar', ctaUrl: '#contacto', highlighted: true, badge: 'Mas elegido' },
        ]}
      />

      <Rotulo name="TeamGrid" />
      <TeamGrid
        headline="El equipo detras de la operacion"
        subheadline="Gente que vive de que tu orden llegue bien."
        members={[
          { name: 'Operaciones', role: 'Head of Fulfillment', bio: 'Disena el SLA de cada cuenta.' },
          { name: 'Tecnologia', role: 'Head of Platform', bio: 'Mantiene el panel y la trazabilidad.' },
          { name: 'Exito', role: 'Customer Success', bio: 'Acompana a cada marca tras el onboarding.' },
        ]}
      />

      <Rotulo name="VideoSection" />
      <VideoSection
        headline="Mira como se ve una operacion con evidencia"
        subheadline="Dos minutos del panel real en accion."
        source="youtube"
        videoId="dQw4w9WgXcQ"
      />

      <Rotulo name="GalleryGrid" />
      <GalleryGrid
        headline="Adentro del centro de operacion"
        layout="grid"
        images={[
          { caption: 'Zona de picking' },
          { caption: 'Estacion de empaque' },
          { caption: 'Control de calidad' },
          { caption: 'Despacho' },
        ]}
      />

      <Rotulo name="BlogPreview" />
      <BlogPreview
        headline="Aprende a medir tu operacion"
        layout="grid"
        count={3}
        cta={{ text: 'Ver todos los articulos', url: '#blog' }}
        posts={[
          { title: 'Como calcular el costo real de una devolucion', slug: 'costo-devolucion', excerpt: 'La devolucion no es solo el flete de regreso.', category: 'Operacion', publishedAt: '2026-05-02', readTime: '6 min' },
          { title: 'SLA: por que ponerlo por escrito cambia todo', slug: 'sla-por-escrito', excerpt: 'Un SLA sin numero es una promesa.', category: 'Metodo', publishedAt: '2026-04-18', readTime: '5 min' },
          { title: 'COD sin fuga: anatomia de un cobro limpio', slug: 'cod-sin-fuga', excerpt: 'Donde se pierde el dinero en pago contraentrega.', category: 'Finanzas', publishedAt: '2026-03-30', readTime: '7 min' },
        ]}
      />

      <Rotulo name="FaqAccordion" />
      <FaqAccordion
        eyebrow="Dudas frecuentes"
        headline="Lo que toda marca pregunta antes de empezar"
        subheadline="Si tu pregunta no esta aqui, la resolvemos en el diagnostico."
        items={[
          { question: 'Cuanto tarda la instalacion?', answer: 'Entre dos y cuatro semanas segun tu catalogo y canales.' },
          { question: 'Que pasa si incumplen un SLA?', answer: 'Lo medimos juntos y aplica lo pactado en contrato. Sin excusas de temporada.' },
          { question: 'Manejan COD en todo Mexico?', answer: 'Si, con reconciliacion de flujo incluida en el plan Operacion.' },
        ]}
      />

      <Rotulo name="NewsletterBar" />
      <NewsletterBar
        headline="Una idea de operacion por semana"
        subheadline="Sin spam. Solo lo que mueve la aguja de tu fulfillment."
        placeholder="tu@correo.com"
        ctaText="Suscribirme"
        successMessage="Listo, revisa tu correo."
      />

      <Rotulo name="ContactSection" />
      <ContactSection
        headline="Hablemos de tu operacion"
        subheadline="Cuentanos tu volumen y te decimos como se veria con TRUST."
        destinationEmail="ventas@trust.mx"
        successMessage="Gracias, te contactamos en menos de 48 horas."
        fields={[
          { fieldName: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Tu nombre' },
          { fieldName: 'email', label: 'Correo', type: 'email', required: true, placeholder: 'tu@correo.com' },
          { fieldName: 'volumen', label: 'Ordenes al mes', type: 'select', required: true, options: [{ label: 'Menos de 500', value: 'lt500' }, { label: '500 a 5000', value: '500-5000' }, { label: 'Mas de 5000', value: 'gt5000' }] },
          { fieldName: 'mensaje', label: 'Cuentanos mas', type: 'textarea', required: false, placeholder: 'Tu situacion actual' },
        ]}
      />

      <Rotulo name="LeadCTA (form)" />
      <LeadCTA
        eyebrow="Sin costo, sin compromiso"
        headline="48 horas para saber exactamente donde falla tu operacion"
        subheadline="El Diagnostico Operativo TRUST es gratuito. Recibes un analisis real de tu operacion actual y que necesita cambiar."
        variant="form"
        formEnabled
        formDestinationEmail="ventas@trust.mx"
        formFields={[
          { fieldName: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Tu nombre' },
          { fieldName: 'email', label: 'Correo', type: 'email', required: true, placeholder: 'tu@correo.com' },
        ]}
        ctas={[{ text: 'Solicitar diagnostico', url: '#', style: 'primary' }]}
      />

      <Rotulo name="HeroSection (split)" />
      <HeroSection
        variant="split"
        eyebrow="Operacion visible"
        headline="Tu panel,"
        headlineEmphasis="tu operacion en una sola vista."
        subheadline="Inventario, ordenes y entregas en tiempo real. Sin llamadas para saber que paso."
        ctas={[{ text: 'Ver el panel', url: '#', style: 'primary' }]}
      />

      <Rotulo name="HeroSection (minimal)" />
      <HeroSection
        variant="minimal"
        eyebrow="Certeza operativa"
        headline="Fulfillment que se mide,"
        headlineEmphasis="no se promete."
        subheadline="La frase no es marketing. Es el contrato."
        ctas={[{ text: 'Empezar', url: '#', style: 'primary' }]}
      />

      <Rotulo name="HeroSection (fullscreen)" />
      <HeroSection
        variant="fullscreen"
        badge="Temporada alta sin sustos"
        eyebrow="El sistema TRUST"
        headline="En peak, la diferencia"
        headlineEmphasis="es tener evidencia."
        subheadline="Cuando todos colapsan, tu operacion sigue medida. Cada orden con foto, firma y timestamp."
        ctas={[
          { text: 'Diagnostico gratis', url: '#diagnostico', style: 'primary' },
          { text: 'Ver casos', url: '#resultados', style: 'secondary' },
        ]}
        stats={[
          { value: '24/7', label: 'operacion monitoreada', description: 'sin ventanas ciegas' },
          { value: '100%', label: 'ordenes con POD', description: 'evidencia en cada entrega' },
        ]}
      />

      <Rotulo name="SiteFooter" />
      <SiteFooter
        siteName="Trust"
        text="Fulfillment que se mide, no se promete."
        links={[
          { label: 'Sistema', url: '#sistema', group: 'Producto' },
          { label: 'Precios', url: '#precios', group: 'Producto' },
          { label: 'Casos', url: '#resultados', group: 'Producto' },
          { label: 'Contacto', url: '#contacto', group: 'Empresa' },
          { label: 'Aviso de privacidad', url: '#privacidad', group: 'Legal' },
        ]}
        social={[
          { platform: 'LinkedIn', url: '#' },
          { platform: 'Instagram', url: '#' },
        ]}
      />
    </div>
  )
}
