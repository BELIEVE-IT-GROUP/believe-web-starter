/**
 * Birdman — contenido editable de la landing.
 *
 * Todos los textos y datos del HTML original (birdman-landing.html) viven aqui,
 * organizados por seccion. La pagina (page.tsx) LEE de `birdmanContent` en vez
 * de hardcodear texto en el JSX. Cada campo mapea a un futuro campo del CMS.
 *
 * El markup, los iconos SVG, el logo <symbol> y el CSS NO viven aqui: estan en
 * page.tsx tal cual el HTML, para garantizar fidelidad visual 100%.
 */

export interface NavLink {
  label: string
  href: string
}

export interface CtaLink {
  label: string
  href: string
  style?: 'primary' | 'ghost'
}

export interface HeroKpi {
  k: string
  v: string
  d: string
  /** d con clase .warn (naranja) en vez de .d default (verde) */
  warn?: boolean
}

export interface HeroTrack {
  id: string
  dest: string
  status: string
  /** estilo del pill: 'ok' (verde) o 'go' (naranja) */
  type: 'ok' | 'go'
}

export interface HeroPanel {
  ttl: string
  live: string
  kpis: HeroKpi[]
  chart: { label: string; delta: string }
  tracking: HeroTrack[]
}

export interface FeatureItem {
  title: string
  desc: string
}

export interface SolutionItem {
  title: string
  body: string
  chips?: string[]
}

export interface BenefitItem {
  label: string
  desc: string
  dir: 'up' | 'down'
}

export interface TechPanelKpi {
  k: string
  v: string
  d: string
  warn?: boolean
}

export interface TechPanelTrack {
  id: string
  dest: string
  status: string
  type: 'ok' | 'go'
}

export interface CaseItem {
  industry: string
  problem: string
  solution: string
  results: { n: string; l: string }[]
}

export interface ResourceItem {
  type: string
  title: string
  desc: string
  cta: string
  href: string
}

export interface BlogItem {
  type: string
  title: string
  desc: string
  href: string
}

export interface FaqItem {
  q: string
  a: string
  open?: boolean
}

export interface FooterColumn {
  title: string
  links: NavLink[]
}

export interface BirdmanContent {
  meta: { title: string; description: string }
  nav: {
    brand: string
    links: NavLink[]
    cta: CtaLink
  }
  hero: {
    tag: string
    headlineBefore: string
    headlineEm: string
    headlineAfter: string
    sub: string
    ctas: CtaLink[]
    note: string
    noteStrong: string
    panel: HeroPanel
  }
  queHacemos: {
    eyebrow: string
    title: string
    lead: string
    items: FeatureItem[]
  }
  problemas: {
    eyebrow: string
    title: string
    lead: string
    items: string[]
    ctaBand: { text: string; cta: CtaLink }
  }
  soluciones: {
    eyebrow: string
    title: string
    items: SolutionItem[]
  }
  industrias: {
    eyebrow: string
    title: string
    items: string[]
  }
  beneficios: {
    eyebrow: string
    title: string
    items: BenefitItem[]
  }
  tecnologia: {
    eyebrow: string
    title: string
    lead: string
    ticks: string[]
    panel: {
      ttl: string
      live: string
      kpis: TechPanelKpi[]
      chart: { label: string; delta: string }
      tracking: TechPanelTrack[]
    }
  }
  metodologia: {
    eyebrow: string
    title: string
    steps: string[]
  }
  casos: {
    eyebrow: string
    title: string
    items: CaseItem[]
    disclaimer: string
  }
  calculadora: {
    eyebrow: string
    title: string
    lead: string
    fields: {
      enviosLabel: string
      enviosDefault: string
      costoLabel: string
      costoDefault: string
      opsLabel: string
      opsDefault: string
      opsHint: string
    }
    rate: number
    labels: {
      annualK: string
      saveK: string
      perBefore: string
      perAfter: string
    }
    assume: string
    cta: CtaLink
  }
  diagnostico: {
    eyebrow: string
    title: string
    lead: string
    ticks: string[]
    form: {
      empresaLabel: string
      empresaPlaceholder: string
      empresaError: string
      industriaLabel: string
      industriaPlaceholder: string
      industriaOptions: string[]
      industriaError: string
      volumenLabel: string
      volumenPlaceholder: string
      volumenOptions: string[]
      volumenError: string
      estadoLabel: string
      estadoPlaceholder: string
      estadoError: string
      correoLabel: string
      correoPlaceholder: string
      correoError: string
      telLabel: string
      telPlaceholder: string
      telError: string
      submit: string
      legal: string
      success: { title: string; text: string }
    }
  }
  recursos: {
    eyebrow: string
    title: string
    items: ResourceItem[]
  }
  blog: {
    eyebrow: string
    title: string
    items: BlogItem[]
  }
  faq: {
    eyebrow: string
    title: string
    items: FaqItem[]
  }
  footer: {
    brandText: string
    columns: FooterColumn[]
    brands: string[]
    copyright: string
    waLabel: string
    waHref: string
  }
}

export const birdmanContent: BirdmanContent = {
  meta: {
    title: 'Birdman · Operador Logístico Corporativo',
    description:
      'Birdman optimiza la operación logística end-to-end de empresas con alto volumen de envíos mediante tecnología, trazabilidad y una red nacional e internacional de aliados.',
  },
  nav: {
    brand: 'Grupo ORVIA',
    links: [
      { label: 'Qué hacemos', href: '#que-hacemos' },
      { label: 'Soluciones', href: '#soluciones' },
      { label: 'Tecnología', href: '#tecnologia' },
      { label: 'Casos', href: '#casos' },
      { label: 'Calculadora', href: '#calculadora' },
      { label: 'Recursos', href: '#recursos' },
    ],
    cta: { label: 'Solicitar diagnóstico', href: '#diagnostico' },
  },
  hero: {
    tag: 'Operador Logístico Corporativo, impulsado por tecnología',
    headlineBefore: 'Operación Logística ',
    headlineEm: 'Inteligente',
    headlineAfter: ' para empresas con alto volumen de envíos',
    sub: 'Optimizamos toda tu operación logística end-to-end con tecnología, trazabilidad y una red nacional e internacional de aliados estratégicos.',
    ctas: [
      { label: 'Solicitar diagnóstico', href: '#diagnostico', style: 'primary' },
      { label: 'Agenda una reunión', href: '#diagnostico', style: 'ghost' },
    ],
    note: 'Diseñamos, administramos y optimizamos operaciones logísticas complejas de principio a fin. ',
    noteStrong: 'No vendemos guías ni transporte: vendemos control sobre tu operación.',
    panel: {
      ttl: 'birdman · centro de monitoreo',
      live: 'En vivo',
      kpis: [
        { k: 'Envíos activos', v: '8,412', d: '▲ 6% semana' },
        { k: 'A tiempo', v: '98.2%', d: '▲ 1.4 pts' },
        { k: 'Costo / envío', v: '$71', d: '▼ 14% mes' },
      ],
      chart: { label: 'Costo logístico mensual', delta: '−18% acumulado' },
      tracking: [
        { id: 'BRD-48120', dest: 'CDMX → Monterrey', status: 'Entregado', type: 'ok' },
        { id: 'BRD-48121', dest: 'Guadalajara → Tijuana', status: 'En ruta', type: 'go' },
        { id: 'BRD-48122', dest: 'Bajío → Laredo, TX', status: 'En ruta', type: 'go' },
      ],
    },
  },
  queHacemos: {
    eyebrow: 'Qué hacemos',
    title: 'Una plataforma operativa, no un proveedor de transporte',
    lead: 'Birdman optimiza la operación logística de empresas con alto volumen de envíos mediante una plataforma tecnológica, procesos especializados y una amplia red de aliados.',
    items: [
      {
        title: 'Gestión End-to-End',
        desc: 'Administramos toda tu cadena, de la orden de compra a la entrega final, en un solo control.',
      },
      {
        title: 'Administración Multi-Carrier',
        desc: 'Un solo tablero para todos tus transportistas. Comparamos, asignamos y auditamos por ti.',
      },
      {
        title: 'Optimización Operativa',
        desc: 'Reducimos tiempos, errores y costo por envío con procesos medibles y mejora continua.',
      },
      {
        title: 'Trazabilidad en Tiempo Real',
        desc: 'Visibilidad total de cada envío y cada indicador, en un dashboard que tu equipo entiende.',
      },
      {
        title: 'Operaciones Inplant',
        desc: 'Personal Birdman especializado operando dentro de tus instalaciones, como tu propio equipo.',
      },
      {
        title: 'Soluciones Personalizadas',
        desc: 'Diseñadas para la complejidad real de tu operación, no plantillas genéricas.',
      },
    ],
  },
  problemas: {
    eyebrow: 'El reto',
    title: '¿Te identificas con alguno de estos retos?',
    lead: 'Si dirige operaciones o supply chain en una empresa de alto volumen, probablemente reconozca más de uno.',
    items: [
      'Demasiados proveedores logísticos y ningún control central.',
      'Falta de visibilidad: no sabes dónde está cada envío.',
      'Costos logísticos que crecen mes con mes sin explicación.',
      'Retrasos que terminan afectando a tus clientes.',
      'Cero indicadores para tomar decisiones con datos.',
      'Procesos manuales que consumen el tiempo de tu equipo.',
      'Incidencias que aparecen y nadie da seguimiento.',
      'Reportes que llegan tarde, cuando el problema ya costó.',
    ],
    ctaBand: {
      text: 'Pongamos números a tu operación. El diagnóstico es gratuito y sin compromiso.',
      cta: { label: 'Agenda un diagnóstico gratuito', href: '#diagnostico' },
    },
  },
  soluciones: {
    eyebrow: 'Soluciones',
    title: 'Diseñamos, operamos y optimizamos toda la cadena',
    items: [
      {
        title: 'Gestión Integral',
        body: 'Administramos toda la operación logística por ti: planeación, ejecución, control y reporteo. <strong>Tu equipo deja de apagar incendios y empieza a tomar decisiones.</strong>',
      },
      {
        title: 'Optimización Operativa',
        body: 'Rediseñamos procesos para <strong>reducir tiempos y costos</strong> de forma sostenida, con indicadores que prueban cada mejora.',
      },
      {
        title: 'Tecnología',
        body: 'Toda la operación en una sola plataforma de control.',
        chips: ['Dashboard', 'KPIs en vivo', 'Tracking', 'Alertas', 'Reportes'],
      },
      {
        title: 'Operación Inplant',
        body: 'Personal especializado de Birdman operando <strong>dentro de las instalaciones del cliente</strong>, integrado a tu día a día.',
      },
      {
        title: 'Integración con aliados',
        body: 'Una red coordinada bajo un mismo estándar de servicio.',
        chips: ['Transportistas', 'Almacenes', 'Última milla', 'Cross-dock'],
      },
    ],
  },
  industrias: {
    eyebrow: 'Industrias',
    title: 'Operamos para sectores de alta exigencia',
    items: [
      'Retail',
      'Manufactura',
      'Automotriz',
      'Electrónica',
      'Consumo',
      'Ecommerce',
      'Distribución',
      'Farmacéutica',
      'Ropa y Textil',
    ],
  },
  beneficios: {
    eyebrow: 'Beneficios',
    title: 'Lo que cambia cuando Birdman opera tu logística',
    items: [
      { label: '+ Productividad', desc: 'Tu equipo se enfoca en lo estratégico, no en lo operativo.', dir: 'up' },
      { label: '+ Visibilidad', desc: 'Cada envío y cada KPI, visibles en tiempo real.', dir: 'up' },
      { label: '+ Control', desc: 'Un solo punto de mando sobre toda la operación.', dir: 'up' },
      { label: '− Incidencias', desc: 'Detección temprana y seguimiento hasta el cierre.', dir: 'down' },
      { label: '− Costo', desc: 'Reducción sostenida del costo logístico total.', dir: 'down' },
      { label: '+ Velocidad', desc: 'Entregas más rápidas y predecibles para tus clientes.', dir: 'up' },
    ],
  },
  tecnologia: {
    eyebrow: 'Tecnología',
    title: 'Tu operación, medida y controlada en un solo lugar',
    lead: 'Dashboards, KPIs, tracking, reportes y alertas. La misma capa tecnológica que usa nuestro centro de monitoreo, disponible para tu equipo.',
    ticks: [
      'Indicadores de servicio, costo y tiempo en vivo.',
      'Tracking unificado de todos tus carriers.',
      'Alertas automáticas ante cualquier desviación.',
      'Reportes ejecutivos listos para dirección.',
    ],
    panel: {
      ttl: 'dashboard · resumen operativo',
      live: 'En vivo',
      kpis: [
        { k: 'On-time', v: '98.2%', d: '▲ 1.4 pts' },
        { k: 'Incidencias', v: '0.7%', d: '▼ 35%' },
        { k: 'Ahorro mes', v: '$612K', d: '▲ MXN' },
      ],
      chart: { label: 'Cumplimiento de entregas, 8 semanas', delta: '↑ tendencia' },
      tracking: [
        { id: 'ALERTA', dest: 'Retraso previsto, ruta Bajío → Norte', status: 'Atendiendo', type: 'go' },
        { id: 'SLA', dest: 'Carrier #3 bajo objetivo de servicio', status: 'Reasignado', type: 'ok' },
      ],
    },
  },
  metodologia: {
    eyebrow: 'Metodología Birdman',
    title: 'Un método probado, de la primera reunión a la mejora continua',
    steps: [
      'Diagnóstico',
      'Diseño',
      'Implementación',
      'Optimización',
      'Operación',
      'Medición',
      'Mejora continua',
    ],
  },
  casos: {
    eyebrow: 'Casos de éxito',
    title: 'Resultados que un director firma con confianza',
    items: [
      {
        industry: 'Retail',
        problem: 'Múltiples carriers sin control central y costo creciente.',
        solution: 'Administración multi-carrier + dashboard único de KPIs.',
        results: [
          { n: '−18%', l: 'Costo logístico' },
          { n: '−35%', l: 'Incidencias' },
          { n: '+20%', l: 'Productividad' },
        ],
      },
      {
        industry: 'Manufactura',
        problem: 'Procesos manuales y cero visibilidad de planta a cliente.',
        solution: 'Operación inplant + trazabilidad end-to-end en tiempo real.',
        results: [
          { n: '+22%', l: 'On-time' },
          { n: '−27%', l: 'Tiempos muertos' },
          { n: '100%', l: 'Visibilidad' },
        ],
      },
      {
        industry: 'Ecommerce',
        problem: 'Picos de volumen y última milla sin estandarizar.',
        solution: 'Red de aliados coordinada + alertas automáticas de desviación.',
        results: [
          { n: '−15%', l: 'Costo / envío' },
          { n: '+30%', l: 'Capacidad pico' },
          { n: '−40%', l: 'Reclamos' },
        ],
      },
    ],
    disclaimer:
      'Cifras ilustrativas para esta propuesta de diseño. Se reemplazan por resultados verificados de clientes reales antes de publicar.',
  },
  calculadora: {
    eyebrow: 'Calculadora de ahorro',
    title: '¿Cuánto podrías ahorrar en logística este año?',
    lead: 'Ingresa tres datos de tu operación y obtén una estimación inmediata de tu potencial de ahorro anual.',
    fields: {
      enviosLabel: 'Envíos por mes',
      enviosDefault: '5000',
      costoLabel: 'Costo promedio por envío (MXN)',
      costoDefault: '85',
      opsLabel: 'Operadores dedicados a logística',
      opsDefault: '6',
      opsHint: 'Nos ayuda a dimensionar el potencial de automatización de procesos.',
    },
    rate: 0.14,
    labels: {
      annualK: 'Costo logístico anual estimado',
      saveK: 'Ahorro potencial anual',
      perBefore: '≈ ',
      perAfter: ' al mes recuperados.',
    },
    assume:
      'Estimación basada en una optimización del <b>14%</b> del costo logístico, el punto medio de los resultados típicos de nuestros proyectos (12% a 18%). El ahorro real se define en tu diagnóstico.',
    cta: { label: 'Quiero mi ahorro real', href: '#diagnostico' },
  },
  diagnostico: {
    eyebrow: 'Diagnóstico gratuito',
    title: 'Pongamos números a tu operación',
    lead: 'Un especialista analiza tu operación actual y te entrega oportunidades concretas de optimización. Sin costo, sin compromiso.',
    ticks: [
      'Respuesta en menos de 24 horas hábiles.',
      'Reunión con un especialista, no con un vendedor.',
      'Hallazgos accionables, los apliques con nosotros o no.',
    ],
    form: {
      empresaLabel: 'Empresa',
      empresaPlaceholder: 'Nombre de tu empresa',
      empresaError: 'Indica tu empresa.',
      industriaLabel: 'Industria',
      industriaPlaceholder: 'Selecciona',
      industriaOptions: [
        'Retail',
        'Manufactura',
        'Automotriz',
        'Electrónica',
        'Consumo',
        'Ecommerce',
        'Distribución',
        'Farmacéutica',
        'Ropa y Textil',
        'Otra',
      ],
      industriaError: 'Selecciona una industria.',
      volumenLabel: 'Volumen mensual de envíos',
      volumenPlaceholder: 'Selecciona',
      volumenOptions: [
        'Menos de 1,000',
        '1,000 a 5,000',
        '5,000 a 20,000',
        '20,000 a 100,000',
        'Más de 100,000',
      ],
      volumenError: 'Selecciona tu volumen.',
      estadoLabel: 'Estado',
      estadoPlaceholder: 'Ej. Nuevo León',
      estadoError: 'Indica tu estado.',
      correoLabel: 'Correo corporativo',
      correoPlaceholder: 'nombre@empresa.com',
      correoError: 'Correo no válido.',
      telLabel: 'Teléfono',
      telPlaceholder: '10 dígitos',
      telError: 'Teléfono a 10 dígitos.',
      submit: 'Quiero optimizar mi operación',
      legal:
        'Al enviar aceptas que un especialista de Birdman te contacte. Tus datos se tratan de forma confidencial.',
      success: {
        title: 'Solicitud recibida',
        text: 'Gracias. Un especialista de Birdman te contactará en menos de 24 horas hábiles con los primeros hallazgos.',
      },
    },
  },
  recursos: {
    eyebrow: 'Recursos',
    title: 'Herramientas para decidir con datos',
    items: [
      {
        type: 'Diagnóstico',
        title: 'Diagnóstico gratuito de tu operación',
        desc: 'Hallazgos accionables sobre costo, servicio y procesos.',
        cta: 'Solicitarlo',
        href: '#diagnostico',
      },
      {
        type: 'Herramienta',
        title: 'Calculadora de ahorro logístico',
        desc: 'Estima tu potencial de ahorro anual en un minuto.',
        cta: 'Calcular',
        href: '#calculadora',
      },
      {
        type: 'Checklist',
        title: 'Checklist de eficiencia logística',
        desc: '15 puntos para auditar tu operación hoy mismo.',
        cta: 'Descargar',
        href: '#diagnostico',
      },
      {
        type: 'Estudio',
        title: 'Estudio de benchmark del sector',
        desc: 'Compara tus indicadores contra empresas similares.',
        cta: 'Descargar',
        href: '#diagnostico',
      },
      {
        type: 'Guía',
        title: 'Guía de optimización de almacenes',
        desc: 'Mejores prácticas para reducir tiempos y errores.',
        cta: 'Descargar',
        href: '#diagnostico',
      },
      {
        type: 'Whitepaper',
        title: 'Cómo reducir el costo logístico total',
        desc: 'El marco que usamos para bajar costos de forma sostenida.',
        cta: 'Descargar',
        href: '#diagnostico',
      },
    ],
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Ideas para operar mejor',
    items: [
      {
        type: 'KPIs',
        title: 'Los 7 KPIs logísticos que todo COO debería vigilar',
        desc: 'Qué medir y cómo leerlo para decidir a tiempo.',
        href: '#',
      },
      {
        type: 'Supply Chain',
        title: 'Supply Chain resiliente: del control a la anticipación',
        desc: 'Cómo pasar de reaccionar a prever desviaciones.',
        href: '#',
      },
      {
        type: 'Última milla',
        title: 'Última milla: dónde se esconde el costo oculto',
        desc: 'Los puntos donde la operación pierde margen.',
        href: '#',
      },
      {
        type: 'Warehouse',
        title: 'Warehouse Management sin fricción',
        desc: 'Procesos para un almacén que no frena la operación.',
        href: '#',
      },
      {
        type: 'Costos',
        title: 'Cómo reducir costos logísticos sin sacrificar servicio',
        desc: 'El equilibrio entre ahorro y nivel de servicio.',
        href: '#',
      },
      {
        type: 'Lean',
        title: 'Lean Logistics aplicado a operaciones de alto volumen',
        desc: 'Eliminar desperdicio sin romper la cadena.',
        href: '#',
      },
    ],
  },
  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Lo que un director suele preguntar',
    items: [
      {
        q: '¿Qué empresas pueden trabajar con Birdman?',
        a: 'Empresas con operaciones logísticas complejas y alto volumen de envíos que buscan control, visibilidad y reducción de costos: retail, manufactura, automotriz, ecommerce, farmacéutica y más.',
        open: true,
      },
      {
        q: '¿Qué volumen mínimo manejan?',
        a: 'Trabajamos con operaciones desde volúmenes medios hasta más de 100,000 envíos mensuales. En el diagnóstico definimos el modelo que mejor se ajusta a tu escala.',
      },
      {
        q: '¿Trabajan a nivel nacional?',
        a: 'Sí. Operamos a nivel nacional y coordinamos rutas internacionales a través de nuestra red de aliados estratégicos.',
      },
      {
        q: '¿Integran varios transportistas?',
        a: 'Sí. Nuestra administración multi-carrier centraliza todos tus transportistas en un solo control, con comparación, asignación y auditoría automática.',
      },
      {
        q: '¿Tienen operación inplant?',
        a: 'Sí. Colocamos personal especializado de Birdman dentro de tus instalaciones, integrado a tu operación diaria como una extensión de tu equipo.',
      },
    ],
  },
  footer: {
    brandText: 'Operador Logístico Corporativo impulsado por tecnología. Parte de Grupo ORVIA.',
    columns: [
      {
        title: 'Soluciones',
        links: [
          { label: 'Gestión integral', href: '#soluciones' },
          { label: 'Optimización operativa', href: '#soluciones' },
          { label: 'Tecnología', href: '#tecnologia' },
          { label: 'Operación inplant', href: '#soluciones' },
        ],
      },
      {
        title: 'Empresa',
        links: [
          { label: 'Casos de éxito', href: '#casos' },
          { label: 'Recursos', href: '#recursos' },
          { label: 'Blog', href: '#blog' },
          { label: 'Preguntas frecuentes', href: '#faq' },
        ],
      },
      {
        title: 'Contacto',
        links: [
          { label: 'Solicitar diagnóstico', href: '#diagnostico' },
          { label: 'WhatsApp', href: 'https://wa.me/' },
          { label: 'LinkedIn', href: 'https://linkedin.com/' },
        ],
      },
    ],
    brands: ['Birdman', 'EnviaYa', 'Trust Logistics'],
    copyright: '© 2026 Grupo ORVIA. Todos los derechos reservados.',
    waLabel: 'Escríbenos por WhatsApp',
    waHref: 'https://wa.me/',
  },
}
