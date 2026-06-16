import '../globals.css'

/**
 * Birdman — HOME completa (Operador Logistico Corporativo, Grupo ORVIA).
 *
 * Pagina real compuesta con los componentes del motor en
 * src/components/sections/, alimentados con el contenido del prototipo
 * birdman-landing.html. Theme DARK (paper negro, primary naranja #ff8400).
 *
 * Server Component: sin fetch, sin force-dynamic. Prerenderiza en `next build`.
 * El arbol entero se envuelve en un <div> que fija las CSS vars del theme
 * Birdman inline, de modo que la pagina se lee como Birdman sin depender del
 * theme global de Believe.
 */

import type { CSSProperties } from 'react'

import { BenefitsGrid } from '@/components/sections/BenefitsGrid'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { ContactSection } from '@/components/sections/ContactSection'
import { ContentSplit } from '@/components/sections/ContentSplit'
import { DashboardPanel } from '@/components/sections/DashboardPanel'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { HeroSection } from '@/components/sections/HeroSection'
import { IndustriesPills } from '@/components/sections/IndustriesPills'
import { PainSection } from '@/components/sections/PainSection'
import { ResourceCards } from '@/components/sections/ResourceCards'
import { SavingsCalculator } from '@/components/sections/SavingsCalculator'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { SiteHeader } from '@/components/sections/SiteHeader'
import { SolutionsList } from '@/components/sections/SolutionsList'
import { StepsSection } from '@/components/sections/StepsSection'

export const metadata = {
  title: 'Birdman . Operador Logistico Corporativo',
  description:
    'Birdman optimiza la operacion logistica end-to-end de empresas con alto volumen de envios mediante tecnologia, trazabilidad y una red nacional e internacional de aliados.',
}

// ─── Birdman DARK theme vars (aplicadas a todo el arbol) ──────────────────────
const BIRDMAN_VARS: CSSProperties = {
  // @ts-expect-error CSS custom properties
  '--brand-paper': '#000000',
  '--brand-ink': '#ffffff',
  '--brand-ink-muted': '#b3b3b3',
  '--color-primary': '#ff8400',
  '--color-primary-hover': '#ff9a33',
  '--color-primary-dark': '#cc6a00',
  '--color-accent': '#25d366',
  '--color-on-primary': '#141414',
  '--font-display': "'Helvetica Neue', Arial, sans-serif",
  '--font-body': "'Helvetica Neue', Arial, sans-serif",
  '--radius-button': '50px',
  '--radius-card': '14px',
}

export default function BirdmanPreviewPage() {
  return (
    <div style={{ ...BIRDMAN_VARS, background: '#000', minHeight: '100vh' }}>
      {/* ── 1 · Header ─────────────────────────────────────────────────────── */}
      <SiteHeader
        siteName="Birdman"
        logo={{ url: '/birdman-logo.svg', alt: 'Birdman' }}
        navLinks={[
          { label: 'Que hacemos', url: '#que-hacemos' },
          { label: 'Soluciones', url: '#soluciones' },
          { label: 'Tecnologia', url: '#tecnologia' },
          { label: 'Casos', url: '#casos' },
          { label: 'Calculadora', url: '#calculadora' },
          { label: 'Recursos', url: '#recursos' },
        ]}
        cta={{ label: 'Solicitar diagnostico', url: '#diagnostico' }}
      />

      {/* ── 2 · Hero (copy izquierda) + DashboardPanel (panel derecha) ──────── */}
      <HeroSection
        variant="split"
        badge="Operador Logistico Corporativo, impulsado por tecnologia"
        headline="Operacion Logistica Inteligente para empresas con alto volumen de envios"
        subheadline="Optimizamos toda tu operacion logistica end-to-end con tecnologia, trazabilidad y una red nacional e internacional de aliados estrategicos."
        ctas={[
          { text: 'Solicitar diagnostico', url: '#diagnostico', style: 'primary' },
          { text: 'Agenda una reunion', url: '#diagnostico', style: 'outline' },
        ]}
        appearance={{ sectionId: 'top' }}
      />
      <DashboardPanel
        title="birdman . centro de monitoreo"
        live
        liveLabel="En vivo"
        kpis={[
          { label: 'Envios activos', value: '8,412', delta: '6% semana', deltaDir: 'up' },
          { label: 'A tiempo', value: '98.2%', delta: '1.4 pts', deltaDir: 'up' },
          { label: 'Costo / envio', value: '$71', delta: '14% mes', deltaDir: 'down' },
        ]}
        chartLabel="Costo logistico mensual"
        chartDelta="-18% acumulado"
        chartTone="cost"
        tracking={[
          { id: 'BRD-48120', dest: 'CDMX a Monterrey', status: 'Entregado', statusType: 'ok' },
          { id: 'BRD-48121', dest: 'Guadalajara a Tijuana', status: 'En ruta', statusType: 'go' },
          { id: 'BRD-48122', dest: 'Bajio a Laredo, TX', status: 'En ruta', statusType: 'go' },
        ]}
      />

      {/* ── 3 · Que hacemos (FeatureGrid grid, 6 cards) ─────────────────────── */}
      <FeatureGrid
        variant="grid"
        eyebrow="Que hacemos"
        headline="Una plataforma operativa, no un proveedor de transporte"
        subheadline="Birdman optimiza la operacion logistica de empresas con alto volumen de envios mediante una plataforma tecnologica, procesos especializados y una amplia red de aliados."
        items={[
          {
            icon: '☰',
            title: 'Gestion End-to-End',
            description:
              'Administramos toda tu cadena, de la orden de compra a la entrega final, en un solo control.',
          },
          {
            icon: '◷',
            title: 'Administracion Multi-Carrier',
            description:
              'Un solo tablero para todos tus transportistas. Comparamos, asignamos y auditamos por ti.',
          },
          {
            icon: '📈',
            title: 'Optimizacion Operativa',
            description:
              'Reducimos tiempos, errores y costo por envio con procesos medibles y mejora continua.',
          },
          {
            icon: '👁',
            title: 'Trazabilidad en Tiempo Real',
            description:
              'Visibilidad total de cada envio y cada indicador, en un dashboard que tu equipo entiende.',
          },
          {
            icon: '🏢',
            title: 'Operaciones Inplant',
            description:
              'Personal Birdman especializado operando dentro de tus instalaciones, como tu propio equipo.',
          },
          {
            icon: '★',
            title: 'Soluciones Personalizadas',
            description:
              'Disenadas para la complejidad real de tu operacion, no plantillas genericas.',
          },
        ]}
        appearance={{ sectionId: 'que-hacemos' }}
      />

      {/* ── 4 · Problemas (PainSection cards, 8 problemas) + CTA band ───────── */}
      <PainSection
        variant="cards"
        eyebrow="El reto"
        headline="Te identificas con alguno de estos retos?"
        subheadline="Si diriges operaciones o supply chain en una empresa de alto volumen, probablemente reconozcas mas de uno."
        cards={[
          { title: 'Demasiados proveedores logisticos y ningun control central.' },
          { title: 'Falta de visibilidad: no sabes donde esta cada envio.' },
          { title: 'Costos logisticos que crecen mes con mes sin explicacion.' },
          { title: 'Retrasos que terminan afectando a tus clientes.' },
          { title: 'Cero indicadores para tomar decisiones con datos.' },
          { title: 'Procesos manuales que consumen el tiempo de tu equipo.' },
          { title: 'Incidencias que aparecen y nadie da seguimiento.' },
          { title: 'Reportes que llegan tarde, cuando el problema ya costo.' },
        ]}
        appearance={{ sectionId: 'problemas' }}
      />
      {/* CTA band del diagnostico gratuito (PainSection cards no lo renderiza). */}
      <section style={{ background: 'var(--brand-paper)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            paddingLeft: 'clamp(1.25rem, 5vw, 3rem)',
            paddingRight: 'clamp(1.25rem, 5vw, 3rem)',
          }}
        >
          <div
            className="birdman-cta-band"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              background:
                'linear-gradient(120deg, color-mix(in oklab, var(--brand-ink) 6%, var(--brand-paper)), var(--brand-paper))',
              border: '1px solid rgb(255 255 255 / 0.14)',
              borderRadius: 'var(--radius-card, 16px)',
              padding: 'clamp(1.5rem, 3vw, 1.75rem) clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            <p
              style={{
                flex: 1,
                minWidth: '15rem',
                margin: 0,
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: 'clamp(1.0625rem, 1.6vw, 1.25rem)',
                fontWeight: 700,
                lineHeight: 1.35,
                color: 'var(--brand-ink, #fff)',
              }}
            >
              Pongamos numeros a tu operacion. El diagnostico es gratuito y sin compromiso.
            </p>
            <a
              href="#diagnostico"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                lineHeight: 1,
                padding: '1rem 1.75rem',
                borderRadius: 'var(--radius-button, 50px)',
                background: 'var(--color-primary, #ff8400)',
                color: 'var(--color-on-primary, #141414)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Agenda un diagnostico gratuito
              <span aria-hidden>&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 5 · Soluciones (SolutionsList, 5 items con chips) ───────────────── */}
      <SolutionsList
        eyebrow="Soluciones"
        headline="Disenamos, operamos y optimizamos toda la cadena"
        items={[
          {
            title: 'Gestion Integral',
            body: 'Administramos toda la operacion logistica por ti: planeacion, ejecucion, control y reporteo.',
            emphasis: 'Tu equipo deja de apagar incendios y empieza a tomar decisiones.',
          },
          {
            title: 'Optimizacion Operativa',
            body: 'Redisenamos procesos para',
            emphasis: 'reducir tiempos y costos',
          },
          {
            title: 'Tecnologia',
            body: 'Toda la operacion en una sola plataforma de control.',
            chips: ['Dashboard', 'KPIs en vivo', 'Tracking', 'Alertas', 'Reportes'],
          },
          {
            title: 'Operacion Inplant',
            body: 'Personal especializado de Birdman operando',
            emphasis: 'dentro de las instalaciones del cliente',
          },
          {
            title: 'Integracion con aliados',
            body: 'Una red coordinada bajo un mismo estandar de servicio.',
            chips: ['Transportistas', 'Almacenes', 'Ultima milla', 'Cross-dock'],
          },
        ]}
        appearance={{ sectionId: 'soluciones' }}
      />

      {/* ── 6 · Industrias (IndustriesPills, 9 industrias) ──────────────────── */}
      <IndustriesPills
        eyebrow="Industrias"
        headline="Operamos para sectores de alta exigencia"
        items={[
          'Retail',
          'Manufactura',
          'Automotriz',
          'Electronica',
          'Consumo',
          'Ecommerce',
          'Distribucion',
          'Farmaceutica',
          'Ropa y Textil',
        ]}
        appearance={{ sectionId: 'industrias' }}
      />

      {/* ── 7 · Beneficios (BenefitsGrid, 6 con +/-) ────────────────────────── */}
      <BenefitsGrid
        eyebrow="Beneficios"
        headline="Lo que cambia cuando Birdman opera tu logistica"
        items={[
          {
            label: '+ Productividad',
            description: 'Tu equipo se enfoca en lo estrategico, no en lo operativo.',
            direction: 'up',
          },
          {
            label: '+ Visibilidad',
            description: 'Cada envio y cada KPI, visibles en tiempo real.',
            direction: 'up',
          },
          {
            label: '+ Control',
            description: 'Un solo punto de mando sobre toda la operacion.',
            direction: 'up',
          },
          {
            label: '- Incidencias',
            description: 'Deteccion temprana y seguimiento hasta el cierre.',
            direction: 'down',
          },
          {
            label: '- Costo',
            description: 'Reduccion sostenida del costo logistico total.',
            direction: 'down',
          },
          {
            label: '+ Velocidad',
            description: 'Entregas mas rapidas y predecibles para tus clientes.',
            direction: 'up',
          },
        ]}
        appearance={{ sectionId: 'beneficios' }}
      />

      {/* ── 8 · Tecnologia (ContentSplit texto+ticks + DashboardPanel 2) ────── */}
      <ContentSplit
        tone="paper"
        eyebrow="Tecnologia"
        headline="Tu operacion, medida y controlada en un solo lugar"
        body="Dashboards, KPIs, tracking, reportes y alertas. La misma capa tecnologica que usa nuestro centro de monitoreo, disponible para tu equipo. Indicadores de servicio, costo y tiempo en vivo. Tracking unificado de todos tus carriers. Alertas automaticas ante cualquier desviacion. Reportes ejecutivos listos para direccion."
        image={undefined}
        imagePosition="right"
        appearance={{ sectionId: 'tecnologia' }}
      />
      <DashboardPanel
        title="dashboard . resumen operativo"
        live
        liveLabel="En vivo"
        kpis={[
          { label: 'On-time', value: '98.2%', delta: '1.4 pts', deltaDir: 'up' },
          { label: 'Incidencias', value: '0.7%', delta: '35%', deltaDir: 'down' },
          { label: 'Ahorro mes', value: '$612K', delta: 'MXN', deltaDir: 'up' },
        ]}
        chartLabel="Cumplimiento de entregas, 8 semanas"
        chartDelta="tendencia al alza"
        chartTone="delivery"
        tracking={[
          {
            id: 'ALERTA',
            dest: 'Retraso previsto, ruta Bajio a Norte',
            status: 'Atendiendo',
            statusType: 'go',
          },
          {
            id: 'SLA',
            dest: 'Carrier #3 bajo objetivo de servicio',
            status: 'Reasignado',
            statusType: 'ok',
          },
        ]}
      />

      {/* ── 9 · Metodologia (StepsSection linear, 7 pasos) ──────────────────── */}
      <StepsSection
        variant="linear"
        eyebrow="Metodologia Birdman"
        headline="Un metodo probado, de la primera reunion a la mejora continua"
        items={[
          { title: 'Diagnostico' },
          { title: 'Diseno' },
          { title: 'Implementacion' },
          { title: 'Optimizacion' },
          { title: 'Operacion' },
          { title: 'Medicion' },
          { title: 'Mejora continua' },
        ]}
        appearance={{ sectionId: 'metodologia' }}
      />

      {/* ── 10 · Casos (CaseStudies, 3 casos con disclaimer) ────────────────── */}
      <CaseStudies
        eyebrow="Casos de exito"
        headline="Resultados que un director firma con confianza"
        cases={[
          {
            industry: 'Retail',
            problem: 'Multiples carriers sin control central y costo creciente.',
            solution: 'Administracion multi-carrier mas dashboard unico de KPIs.',
            results: [
              { value: '-18%', label: 'Costo logistico' },
              { value: '-35%', label: 'Incidencias' },
              { value: '+20%', label: 'Productividad' },
            ],
          },
          {
            industry: 'Manufactura',
            problem: 'Procesos manuales y cero visibilidad de planta a cliente.',
            solution: 'Operacion inplant mas trazabilidad end-to-end en tiempo real.',
            results: [
              { value: '+22%', label: 'On-time' },
              { value: '-27%', label: 'Tiempos muertos' },
              { value: '100%', label: 'Visibilidad' },
            ],
          },
          {
            industry: 'Ecommerce',
            problem: 'Picos de volumen y ultima milla sin estandarizar.',
            solution: 'Red de aliados coordinada mas alertas automaticas de desviacion.',
            results: [
              { value: '-15%', label: 'Costo / envio' },
              { value: '+30%', label: 'Capacidad pico' },
              { value: '-40%', label: 'Reclamos' },
            ],
          },
        ]}
        disclaimer="Cifras ilustrativas para esta propuesta de diseno. Se reemplazan por resultados verificados de clientes reales antes de publicar."
        appearance={{ sectionId: 'casos' }}
      />

      {/* ── 11 · Calculadora (SavingsCalculator) ────────────────────────────── */}
      <SavingsCalculator
        eyebrow="Calculadora de ahorro"
        headline="Cuanto podrias ahorrar en logistica este ano?"
        lead="Ingresa tres datos de tu operacion y obten una estimacion inmediata de tu potencial de ahorro anual."
        fields={[
          { id: 'envios', label: 'Envios por mes', defaultValue: 5000 },
          { id: 'costo', label: 'Costo promedio por envio (MXN)', prefix: '$', defaultValue: 85 },
          {
            id: 'ops',
            label: 'Operadores dedicados a logistica',
            defaultValue: 6,
            hint: 'Nos ayuda a dimensionar el potencial de automatizacion de procesos.',
          },
        ]}
        rate={0.14}
        outputAnnualLabel="Costo logistico anual estimado"
        outputSaveLabel="Ahorro potencial anual"
        outputMonthlyLabel="aprox. {value} al mes recuperados."
        ctaText="Quiero mi ahorro real"
        ctaUrl="#diagnostico"
        assumptionNote="Estimacion basada en una optimizacion del 14% del costo logistico, el punto medio de los resultados tipicos de nuestros proyectos (12% a 18%). El ahorro real se define en tu diagnostico."
        appearance={{ sectionId: 'calculadora' }}
      />

      {/* ── 12 · Diagnostico (ContactSection, form completo) ────────────────── */}
      <ContactSection
        variant="ink"
        eyebrow="Diagnostico gratuito"
        headline="Pongamos numeros a tu operacion"
        subheadline="Un especialista analiza tu operacion actual y te entrega oportunidades concretas de optimizacion. Sin costo, sin compromiso."
        submitLabel="Quiero optimizar mi operacion"
        note="Al enviar aceptas que un especialista de Birdman te contacte. Tus datos se tratan de forma confidencial."
        successMessage="Solicitud recibida. Un especialista de Birdman te contactara en menos de 24 horas habiles con los primeros hallazgos."
        fields={[
          { fieldName: 'empresa', label: 'Empresa', type: 'text', required: true, placeholder: 'Nombre de tu empresa' },
          {
            fieldName: 'industria',
            label: 'Industria',
            type: 'select',
            required: true,
            placeholder: 'Selecciona',
            options: [
              { label: 'Retail' },
              { label: 'Manufactura' },
              { label: 'Automotriz' },
              { label: 'Electronica' },
              { label: 'Consumo' },
              { label: 'Ecommerce' },
              { label: 'Distribucion' },
              { label: 'Farmaceutica' },
              { label: 'Ropa y Textil' },
              { label: 'Otra' },
            ],
          },
          {
            fieldName: 'volumen',
            label: 'Volumen mensual de envios',
            type: 'select',
            required: true,
            placeholder: 'Selecciona',
            options: [
              { label: 'Menos de 1,000' },
              { label: '1,000 a 5,000' },
              { label: '5,000 a 20,000' },
              { label: '20,000 a 100,000' },
              { label: 'Mas de 100,000' },
            ],
          },
          { fieldName: 'estado', label: 'Estado', type: 'text', required: true, placeholder: 'Ej. Nuevo Leon' },
          { fieldName: 'correo', label: 'Correo corporativo', type: 'email', required: true, placeholder: 'nombre@empresa.com' },
          { fieldName: 'telefono', label: 'Telefono', type: 'tel', required: true, placeholder: '10 digitos' },
        ]}
        channels={[
          { label: 'Respuesta', value: 'En menos de 24 horas habiles' },
          { label: 'Reunion', value: 'Con un especialista, no con un vendedor' },
          { label: 'Hallazgos', value: 'Accionables, los apliques con nosotros o no' },
        ]}
        appearance={{ sectionId: 'diagnostico' }}
      />

      {/* ── 13 · Recursos (ResourceCards, 6) ────────────────────────────────── */}
      <ResourceCards
        eyebrow="Recursos"
        headline="Herramientas para decidir con datos"
        items={[
          {
            type: 'Diagnostico',
            title: 'Diagnostico gratuito de tu operacion',
            description: 'Hallazgos accionables sobre costo, servicio y procesos.',
            ctaText: 'Solicitarlo',
            url: '#diagnostico',
          },
          {
            type: 'Herramienta',
            title: 'Calculadora de ahorro logistico',
            description: 'Estima tu potencial de ahorro anual en un minuto.',
            ctaText: 'Calcular',
            url: '#calculadora',
          },
          {
            type: 'Checklist',
            title: 'Checklist de eficiencia logistica',
            description: '15 puntos para auditar tu operacion hoy mismo.',
            ctaText: 'Descargar',
            url: '#diagnostico',
          },
          {
            type: 'Estudio',
            title: 'Estudio de benchmark del sector',
            description: 'Compara tus indicadores contra empresas similares.',
            ctaText: 'Descargar',
            url: '#diagnostico',
          },
          {
            type: 'Guia',
            title: 'Guia de optimizacion de almacenes',
            description: 'Mejores practicas para reducir tiempos y errores.',
            ctaText: 'Descargar',
            url: '#diagnostico',
          },
          {
            type: 'Whitepaper',
            title: 'Como reducir el costo logistico total',
            description: 'El marco que usamos para bajar costos de forma sostenida.',
            ctaText: 'Descargar',
            url: '#diagnostico',
          },
        ]}
        appearance={{ sectionId: 'recursos' }}
      />

      {/* ── 14 · Blog (BlogPreview, 6 posts) ────────────────────────────────── */}
      <BlogPreview
        layout="grid"
        eyebrow="Blog"
        headline="Ideas para operar mejor"
        posts={[
          {
            title: 'Los 7 KPIs logisticos que todo COO deberia vigilar',
            slug: 'kpis-logisticos-coo',
            category: 'KPIs',
            excerpt: 'Que medir y como leerlo para decidir a tiempo.',
          },
          {
            title: 'Supply Chain resiliente: del control a la anticipacion',
            slug: 'supply-chain-resiliente',
            category: 'Supply Chain',
            excerpt: 'Como pasar de reaccionar a prever desviaciones.',
          },
          {
            title: 'Ultima milla: donde se esconde el costo oculto',
            slug: 'ultima-milla-costo-oculto',
            category: 'Ultima milla',
            excerpt: 'Los puntos donde la operacion pierde margen.',
          },
          {
            title: 'Warehouse Management sin friccion',
            slug: 'warehouse-management-sin-friccion',
            category: 'Warehouse',
            excerpt: 'Procesos para un almacen que no frena la operacion.',
          },
          {
            title: 'Como reducir costos logisticos sin sacrificar servicio',
            slug: 'reducir-costos-sin-sacrificar-servicio',
            category: 'Costos',
            excerpt: 'El equilibrio entre ahorro y nivel de servicio.',
          },
          {
            title: 'Lean Logistics aplicado a operaciones de alto volumen',
            slug: 'lean-logistics-alto-volumen',
            category: 'Lean',
            excerpt: 'Eliminar desperdicio sin romper la cadena.',
          },
        ]}
        appearance={{ sectionId: 'blog' }}
      />

      {/* ── 15 · FAQ (FaqAccordion, 5) ──────────────────────────────────────── */}
      <FaqAccordion
        eyebrow="Preguntas frecuentes"
        headline="Lo que un director suele preguntar"
        items={[
          {
            question: 'Que empresas pueden trabajar con Birdman?',
            answer:
              'Empresas con operaciones logisticas complejas y alto volumen de envios que buscan control, visibilidad y reduccion de costos: retail, manufactura, automotriz, ecommerce, farmaceutica y mas.',
          },
          {
            question: 'Que volumen minimo manejan?',
            answer:
              'Trabajamos con operaciones desde volumenes medios hasta mas de 100,000 envios mensuales. En el diagnostico definimos el modelo que mejor se ajusta a tu escala.',
          },
          {
            question: 'Trabajan a nivel nacional?',
            answer:
              'Si. Operamos a nivel nacional y coordinamos rutas internacionales a traves de nuestra red de aliados estrategicos.',
          },
          {
            question: 'Integran varios transportistas?',
            answer:
              'Si. Nuestra administracion multi-carrier centraliza todos tus transportistas en un solo control, con comparacion, asignacion y auditoria automatica.',
          },
          {
            question: 'Tienen operacion inplant?',
            answer:
              'Si. Colocamos personal especializado de Birdman dentro de tus instalaciones, integrado a tu operacion diaria como una extension de tu equipo.',
          },
        ]}
        appearance={{ sectionId: 'faq' }}
      />

      {/* ── 16 · Footer ─────────────────────────────────────────────────────── */}
      <SiteFooter
        siteName="Birdman"
        tagline="Operador Logistico Corporativo impulsado por tecnologia. Parte de Grupo ORVIA."
        text="© 2026 Grupo ORVIA. Todos los derechos reservados."
        links={[
          { group: 'Soluciones', label: 'Gestion integral', url: '#soluciones' },
          { group: 'Soluciones', label: 'Optimizacion operativa', url: '#soluciones' },
          { group: 'Soluciones', label: 'Tecnologia', url: '#tecnologia' },
          { group: 'Soluciones', label: 'Operacion inplant', url: '#soluciones' },
          { group: 'Empresa', label: 'Casos de exito', url: '#casos' },
          { group: 'Empresa', label: 'Recursos', url: '#recursos' },
          { group: 'Empresa', label: 'Blog', url: '#blog' },
          { group: 'Empresa', label: 'Preguntas frecuentes', url: '#faq' },
          { group: 'Contacto', label: 'Solicitar diagnostico', url: '#diagnostico' },
          { group: 'Contacto', label: 'WhatsApp', url: 'https://wa.me/' },
          { group: 'Contacto', label: 'LinkedIn', url: 'https://linkedin.com/' },
        ]}
        appearance={{ sectionId: 'footer' }}
      />

      {/* Marcas hermanas del Grupo ORVIA, bajo el footer. */}
      <div style={{ background: 'var(--brand-ink, #000)' }}>
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '1.25rem clamp(1.25rem, 5vw, 3rem)',
            borderTop: '1px solid rgb(255 255 255 / 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.125rem',
            flexWrap: 'wrap',
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontSize: '0.9375rem',
            fontWeight: 700,
          }}
        >
          <span style={{ color: 'var(--color-primary, #ff8400)' }}>Birdman</span>
          <span style={{ color: 'rgb(255 255 255 / 0.6)' }}>EnviaYa</span>
          <span style={{ color: 'rgb(255 255 255 / 0.6)' }}>Trust Logistics</span>
        </div>
      </div>
    </div>
  )
}
