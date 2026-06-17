---
name: believe-web
description: >-
  Fabrica de webs Believe end-to-end en una sola sesion conversacional. Dispara
  cuando Jorge diga "crea una web para [marca]", "crea/armame una landing para
  [marca]", "nueva web de cliente", "necesito un sitio para [marca]", "montame la
  web de [marca]" o variantes. Carga el DNA de la marca (Maasy o entrevista),
  entrevista lo que falta, genera el HTML top-notch a medida con skills de
  diseno, lo trocea en bloques editables del CMS Believe Puck y lo deploya en
  Contabo. NO usar para editar una web ya creada ni para tareas de ads,
  contenido o research.
allowed-tools: AskUserQuestion, Read, Write, Edit, Bash, Skill, Workflow, mcp__puck-cms__puck_list_tenants, mcp__puck-cms__puck_get_tenant, mcp__puck-cms__puck_create_tenant, mcp__puck-cms__puck_update_tenant, mcp__puck-cms__puck_set_tokens, mcp__puck-cms__puck_list_blocksets, mcp__puck-cms__puck_list_blocks, mcp__puck-cms__puck_deploy, mcp__puck-cms__puck_seed_page, mcp__puck-cms__puck_publish_page, mcp__puck-cms__puck_list_pages
---

# Believe Web Factory v3 (motor Puck a medida)

Convertis una frase ("crea una web para Pawers") en una web real: DNA completo
cargado, entrevista con contratos duros, copy de clase mundial, HTML top-notch a
medida, troceado en bloques editables del CMS Believe Puck, deployado en Contabo
y administrable con live preview.

**Motor v3 (Puck a medida), no v2 (Flowbite+Payload).** Jorge rechazo el motor
de componentes genericos: pierde fidelidad y quema tokens. Ahora generas el
diseno a mano (skills de diseno) y el CMS solo lo vuelve editable. La receta
tecnica completa (del HTML a tenant Puck + deploy) esta en
`references/puck-generation.md` — es el corazon de esta fabrica. Ejemplo vivo y
probado: tenant **birdman**.

Vos sos el cerebro. Las manos:
- Tus propias Write/Edit para GENERAR los bloques a medida en el repo (el MCP NO
  genera diseno: eso es codigo a medida que escribis vos con la receta Puck).
- MCP `puck-cms` para lo REPETIBLE por API: alta de tenants, tokens, deploy a
  Contabo, publicar/sembrar contenido. Reemplaza el viejo `believe-cms`/Payload.
- `Maasy MCP` lee el DNA y el CRM de marcas que ya estan en Maasy.

Brief schema: `references/brief-schema.json`. Copywriting y gates de calidad:
pasos 3B-3E de abajo (SIGUEN VIGENTES). El motor viejo (Flowbite + Payload +
Coolify) esta DEPRECADO: el Paso 4 ahora deploya con la receta Puck + MCP `puck-cms`.

---

## Flujo v3 — TRES GATES OBLIGATORIOS antes de diseñar (lecciones del primer run real: NeuroRealidad)

No los saltes. Se aprendieron fallando, y el costo fue iteraciones y tokens.

1. **ENTREVISTA COMPLETA, nunca minima.** Que la marca tenga DNA en Maasy NO te exime: el DNA es de la MARCA, no del PRODUCTO puntual (un libro, un curso, un evento, un servicio nuevo). Carga el DNA Y ademas entrevista el producto especifico: que es, oferta y precio exacto, objetivo, CTA primario/secundario, publico puntual. (Fallo: la entrevista fue minima, asumi todo del DNA de marca.)

2. **PIDE ASSETS Y URLS REALES ANTES DE DISENar (Bloque D, explicito).** En la entrevista, pide a Jorge de forma explicita: logo, portada/mockups, fotos (autor, producto), imagenes, video, y las URLS reales (link de compra/Amazon, dominio, redes, links de otros productos). NO busques en local ni asumas: preguntale y espera los archivos. Sin assets reales confirmados, no generas. (Fallo: no se pidieron; Jorge tuvo que entregar el link de Amazon, el mockup y su foto a mitad del proceso.)

3. **INVOCA LOS SKILLS DE DISENO ANTES DE GENERAR EL HTML, no despues.** Antes de escribir una linea de HTML: invoca `/impeccable` para la direccion de diseno (sistema tipografico, hero, ritmo de secciones, anti-AI-slop, uso de los assets) y disena CON esa guia. Tras un primer HTML, pasa `/ui-ux-pro-max` como auditoria. Generar a ciegas y arreglar despues quema iteraciones. (Fallo: se generaron 3 versiones antes de invocar los skills de diseno.)

Solo despues de estos 3 gates: genera el HTML top-notch (paso 6) y troceaalo a bloques Puck con la receta `references/puck-generation.md`. Si el cliente YA tiene un HTML/diseno bueno, portalo fiel (no lo reconstruyas).

---

## Reglas duras del sistema

- **Solo ASCII** en cualquier valor que mandes a las tools del CMS y en el JSON
  del brief. El texto visible para el usuario (copy de bloques en espanol) puede
  llevar tildes. Markdown de notas puede llevar tildes.
- **Gate de confirmacion**: ninguna tool de escritura corre con `dryRun: false`
  hasta que Jorge revise el resumen del brief y diga OK. Eso fija
  `brief.confirmado = true`. Sin eso, todo es dryRun.
- **Nada de pedir accesos a mano**: los secrets ya viven en Infisical y los
  inyecta `~/.believe/bin/infra`. Nunca le pidas a Jorge un token ni una
  password. Si falta un secret, avisas claro (ver "Si faltan secrets").
- **Motor v3 = a medida en el repo.** A diferencia de v2, en v3 SI escribis
  codigo: los bloques Puck a medida del tenant en `src/cms/blocks/<slug>/` del
  repo `believe-web-starter`, su `content.ts`, el registro en `puck.config.tsx`,
  `data/tenants/<slug>.json`, y deployas. NO toques otros tenants ni el viejo
  motor Flowbite/Payload. Sigue la receta `references/puck-generation.md`.
- **Gates obligatorios son DUROS**: los 4 gates del Paso 3 no son sugerencias.
  Ninguno puede saltarse. Si un gate falla, corriges antes de avanzar.
- **Contratos de paso**: cada paso define su INPUT MINIMO y su OUTPUT ESPERADO.
  Si el input minimo no esta completo, no empezas el paso: vuelves al anterior.

## Prerequisitos de runtime (verifica, no resuelvas)

Para que la fabrica EJECUTE (no solo dryRun) hace falta:

- La sesion corre en el repo `believe-web-starter` (ahi vive el `.mcp.json` que
  registra el MCP `puck-cms`; arranca via `~/.believe/bin/infra`, que le inyecta
  los secrets). Si el MCP no aparece, hace falta `npm --prefix puck-cms-mcp run build`.
- Para deployar: acceso SSH `contabo-believe` (ya configurado). Para publicar
  contenido remoto: `PUCK_SVC_KEY` en Infisical (lo inyecta `infra` al MCP).
- Maasy MCP conectado en claude.ai (para cargar DNA de marcas que ya estan ahi).

Si algo de esto no esta, las tools fallan con mensaje claro al usarlas. No
intentes instalar ni configurar nada: reporta que falta y a quien (Jorge).

---

## MAPA DE CONTRATOS ENTRE PASOS

```
Paso 1: DNA Completo
  INPUT:  nombre de marca
  OUTPUT: brief.marca + brief.dna (con assets, voice, colors completos)
  GATE:   checklist-1 todos OK antes de avanzar al Paso 2
     |
     v
Paso 2: Entrevista -> brief.json completo
  INPUT:  brief.marca + brief.dna del Paso 1
  OUTPUT: brief completo (objetivo, pages, leads, seo, social, analytics, locale)
  GATE:   checklist-2 todos OK + brief valida contra brief-schema.json
     |
     v
Paso 3A: Estructura (templateIds validados)
  INPUT:  brief.objetivo + brief.dna + brief.pages
  OUTPUT: plan de bloques con templateIds reales de catalogo
  GATE:   checklist-3A - todos los templateIds confirmados via cms_list_block_templates
     |
     v
Paso 3B: Copywriting clase mundial (8 pasos)
  INPUT:  plan de bloques + COPY CONTEXT construido desde brief.dna.copy
  OUTPUT: copy completo por bloque, con checklist de validacion aprobado
  GATE:   checklist-3B - 7 puntos de calidad, todos OK o CORREGIDO
     |
     v
Paso 3C: Gate UI/UX + Design Review (OBLIGATORIO)
  INPUT:  plan de bloques + copy validado + DNA completo
  OUTPUT: correcciones de ui-ux-pro-max aplicadas al plan
  GATE:   checklist-3C - todas las correcciones de ui-ux-pro-max aplicadas
     |
     v
Paso 3D: Gate Copy Final (OBLIGATORIO)
  INPUT:  plan de bloques + copy post-ui-ux + COPY CONTEXT
  OUTPUT: copy revisado por impeccable, correcciones aplicadas
  GATE:   checklist-3D - correcciones de impeccable aplicadas
     |
     v
Paso 3E: Coherencia de marca + Aprobacion de Jorge
  INPUT:  plan final con copy y estructura validados
  OUTPUT: brief.confirmado = true (aprobacion explicita de Jorge)
  GATE:   Jorge dice OK al plan completo
     |
     v
Paso 4: Ejecucion (dryRun:false)
  INPUT:  brief.confirmado = true + bloques a medida generados en el repo
  OUTPUT: tenant dado de alta + codigo deployado a Contabo + URL live
  GATE:   puck_deploy({dryRun:true}) revisado antes de dryRun:false
     |
     v
Paso 5: Verificacion E2E
  INPUT:  https://puck.believe-global.com/s/<slug>
  OUTPUT: criterios de aceptacion visuales OK, lead E2E verificado
  GATE:   checklist-5 todos los criterios aprobados
```

---

## Paso 1 - DNA Completo de la Marca

**CONTRACT INPUT**: nombre o referencia de la marca pedida por Jorge.
**CONTRACT OUTPUT**: `brief.marca` completo + `brief.dna` completo incluyendo
`colors` (primary + accent + paper + ink), `fonts`, `tone`, `positioning`,
`copy` (los 8 campos), `voice`, `assets` (con logo y hero al menos intentados).

### 1.1 - Buscar en Maasy primero

1. Corre `maasy_list_brands` para ver si la marca existe en Maasy.

2. **Existe en Maasy** -> toma su `project_id` (UUID) y carga en paralelo:
   - `maasy_get_brand_dna({ project_id })`: colores, fuentes, tono, posicionamiento.
   - `maasy_get_brand_context({ project_id })`: publico objetivo, propuesta de
     valor, industria.
   - `maasy_get_crm_summary({ project_id })`: si ya tiene CRM, el backend de
     leads tiende a `maasy`.

   Mapea todo a `brief.marca` y `brief.dna`. Guarda el UUID en
   `brief.marca.maasy_project_id`.

   Despues del mapeo inicial, verifica que el DNA de Maasy cubra TODOS los
   campos del CHECKLIST-1 (ver abajo). Lo que falte, completalo con la
   entrevista del punto 1.2 (version reducida: solo los campos faltantes).

3. **No existe en Maasy** -> pasa directamente al punto 1.2 con la entrevista
   completa. Deja `brief.marca.maasy_project_id` sin setear.

### 1.2 - Entrevista de DNA (AskUserQuestion)

Agrupa las preguntas en BLOQUES para no marear. Nunca hagas mas de un
AskUserQuestion separado cuando podas agrupar. Los grupos son:

**BLOQUE A - Identidad basica** (siempre preguntar, incluso si viene de Maasy
  pero con campos faltantes):

- Nombre exacto de la marca (si no se especifico aun).
- Slug URL (propone uno a partir del nombre; confirma).
- Industria o categoria (ej: "3PL logistica DTC", "clinica dental", "moda
  femenina").
- Descripcion del cliente ideal EXACTO: cargo o perfil, tamano o contexto,
  situacion actual. Ej: "Fundadores de marcas DTC con 500+ pedidos/mes en
  Shopify sin equipo propio de logistica".
- El problema especifico que los mantiene despiertos a las 3am (emocional y
  concreto, no generico).
- La transformacion que promete la marca: estado antes -> estado despues en
  90 dias. Ej: "De apagar incendios de logistica a tener SLA garantizado en
  tiempo real".

**BLOQUE B - Diferenciacion y prueba** (siempre preguntar):

- El diferenciador REAL de la marca: una cosa que ningun competidor hace igual.
  Tiene que ser concreto y defensible.
- Las 3 objeciones mas frecuentes antes de cerrar un cliente (frases reales
  de prospectos).
- 2-5 pruebas sociales: numeros reales (% precision, clientes, meses), nombres
  de clientes con permiso, o testimonios verbatim. Si no tienen ninguno todavia,
  anota "SIN DATOS REALES" - NO inventes.
- Competidores directos (2-4 nombres) - solo para diferenciacion interna,
  nunca en copy visible.

**BLOQUE C - Paleta y visual** (siempre preguntar):

- Color primario hex (el mas importante; si dicen nombre de color o ref,
  propone un hex y confirma).
- Color acento/secundario hex. Si solo tienen primario, propones un acento
  complementario y confirmas.
- Color de fondo (paper). Si no tienen, propones `#ffffff` y confirmas.
- Color de texto (ink). Si no tienen, propones `#111111` y confirmas.
- Fuente de titulos (Google Fonts). Si no saben, propones una coherente con
  la industria y el tono.
- Fuente de cuerpo (Google Fonts). Si no saben, propones `Inter` como default
  seguro y confirmas.

**BLOQUE D - Assets visuales** (siempre preguntar; todos opcionales pero
  registrar si existen o no):

- URL del logo (PNG o SVG). Si no tienen URL, anotas que el header usara
  wordmark de texto.
- URL de imagen hero principal (foto de producto, equipo, ambiente). Si no
  tienen, preguntas si quieren fondo de color solido con el primario o si
  tienen descripcion para imagen generativa.
- URLs de fotos adicionales de producto o servicio (hasta 5).
- URL de video de producto o marca (YouTube o Vimeo). Si no tienen, anotas
  que `video-embed` queda excluido del plan.
- Link de referencia visual (Figma, competitor website, moodboard). Opcional.

**BLOQUE E - Voz y vocabulario** (siempre preguntar):

- Tono de la marca: professional, bold, authoritative, warm, playful,
  minimalist, premium, conversational. Propones el mas probable segun la
  industria y confirmas.
- CTA principal (el verbo): reservar, contactar, comprar, calcular, ver,
  agendar, descargar. Si no saben, propones segun el objetivo mas probable.
- Registro: "tu" o "usted". Default: "tu" para mayoría de marcas; "usted"
  para salud, legal, finanzas conservadoras.
- Hasta 3 frases de vocabulario propio de la marca (terminos especiales,
  nombres de metodologia, tagline).
- Hasta 5 palabras o frases que la marca jamas usaria.

**BLOQUE F - SEO y digital** (preguntar al final):

- Propuesta de valor en 1 frase corta (para meta description). Ej: "El primer
  fulfillment DTC con SLA garantizado y dashboard en tiempo real".
- Tagline de la marca (si tienen uno). Ej: "Entrega que no falla."
- Redes sociales: handles de Instagram, TikTok, LinkedIn, X (los que tenga).
- Proveedor de analitica: OpenPanel (recomendado en el stack Believe),
  GA4, o ninguno. Si eligen uno, pides el tracking ID.

### 1.3 - CHECKLIST-1 (gate duro - no avanzas al Paso 2 sin todos OK)

Verifica que el brief tenga estos campos con valores reales (no vacios, no
placeholders como "TBD"):

```
[ ] brief.marca.nombre SET
[ ] brief.marca.slug SET, patron ^[a-z0-9]+(-[a-z0-9]+)*$
[ ] brief.marca.industria SET
[ ] brief.dna.colors.primary SET, patron hex #XXXXXX
[ ] brief.dna.colors.accent SET, patron hex #XXXXXX
[ ] brief.dna.colors.paper SET (puede ser el default #ffffff confirmado)
[ ] brief.dna.colors.ink SET (puede ser el default #111111 confirmado)
[ ] brief.dna.fonts.display SET
[ ] brief.dna.fonts.body SET
[ ] brief.dna.tone SET (valor del enum)
[ ] brief.dna.positioning SET (frase de posicionamiento)
[ ] brief.dna.copy.cliente_ideal SET (con cargo y contexto especifico)
[ ] brief.dna.copy.pain_principal SET (especifico y emocional)
[ ] brief.dna.copy.transformacion SET (formato before/after)
[ ] brief.dna.copy.diferenciador_real SET (concreto y defensible)
[ ] brief.dna.copy.objeciones SET (array, al menos 3 items)
[ ] brief.dna.copy.competidores SET (array, al menos 2 items)
[ ] brief.dna.voice.cta_verb SET
[ ] brief.dna.voice.register SET (tu | usted)
[ ] brief.assets.logo_url SET o brief.assets.logo_fallback = "wordmark"
[ ] brief.assets.hero_image_url SET o brief.assets.hero_fallback SET
```

Si alguno falta, volvé a preguntar ese campo especifico antes de avanzar.
No inventes valores; registra "SIN DATOS REALES" solo para prueba social cuando
sea literalmente el caso.

---

## Paso 2 - Entrevista Completa -> brief.json

**CONTRACT INPUT**: brief.marca + brief.dna completos (checklist-1 OK).
**CONTRACT OUTPUT**: brief.json completo y validado contra `references/brief-schema.json`
con todos los campos requeridos: `marca`, `dna`, `objetivo`, `pages`, `leads`,
`locale`, `seo`, `social`, `analytics`.

Usa `AskUserQuestion` para cerrar lo que falte. Agrupa preguntas para no
marear. Si muchos campos del Paso 1 ya cubrieron estos temas, saltea y usa los
datos ya capturados.

**BLOQUE G - Objetivo y arquitectura de paginas**:

- **Objetivo** de la web: `leads`, `venta`, `autoridad`, `booking`.
  Propones el mas probable segun la industria y confirmas.
- **Idioma/locale**: espanol (default), ingles, o ambos.
  Esto determina en que idioma se genera todo el copy.
- **Paginas**: cuales y en que orden (home siempre incluida). Para cada una,
  su slug y titulo aproximado.
- **CTAs**: la accion principal que quiere que el visitante haga.

**BLOQUE H - Leads y dominio**:

- **Leads backend**: `maasy` (si la marca esta en Maasy) o `appwrite`.
  Si `maasy_project_id` esta seteado, default `maasy`.
- **Proveedor de email de notificacion**: usesend o plunk.
- **Email de notificacion** de leads nuevos.
- **Dominio**: FQDN sin protocolo (`pawers.com`) o nada (usa staging sslip.io).

**BLOQUE I - SEO**:

- Site title (para la etiqueta `<title>` y OG). Ej: "Pawers - Fulfillment DTC
  Garantizado". Max 60 chars.
- Meta description global. Si no tienen, propones una basada en el positioning.
  Max 160 chars.
- OG image URL (para compartir en redes). Si no tienen, anota que usara el hero.

Produce el brief completo y guardalo como `brief.json` en el directorio de
trabajo de la sesion.

### 2.1 - CHECKLIST-2 (gate duro - no avanzas al Paso 3 sin todos OK)

```
[ ] brief.objetivo SET (uno del enum: leads|venta|autoridad|booking)
[ ] brief.locale SET (es | en | es-en)
[ ] brief.pages SET, al menos 1 pagina, home incluida
[ ] brief.pages[*].slug SET, patron valido
[ ] brief.pages[*].title SET
[ ] brief.leads.backend SET
[ ] brief.leads.notification_email SET o anotado que no quieren notificaciones
[ ] brief valida contra references/brief-schema.json (sin errores de schema)
[ ] brief.seo.site_title SET
[ ] brief.seo.meta_description SET
[ ] brief.social SET (aunque sea objeto vacio si la marca no tiene redes aun)
[ ] brief.analytics SET (aunque sea { provider: "none" })
```

Valida el JSON contra el schema antes de avanzar. Si hay errores de
validacion, corriges el brief antes de pasar al Paso 3.

---

## Paso 3 - Composicion, Copywriting y Gates de Calidad

Este paso es el corazon de la fabrica y tiene 5 sub-pasos en orden estricto
con gates duros entre ellos. No se puede saltar ninguno.

### DOS MODOS DE GENERACION (elegi antes de 3A)

1. **Modo motor (componentes custom)**: web compuesta con los componentes custom
   via `templateId .custom` + `variant` (paso 3A en adelante). Para webs estandar,
   multi-seccion, editables block por block.
2. **Modo standalone (landing nivel dios)**: Claude genera un HTML completo y unico
   de altisima calidad, se porta fiel a Next (`src/app/<slug>/page.tsx` + `content.ts`),
   se aisla del chrome Believe (fuera del route group `(chrome)`, sin `globals.css`) y
   se mapea al CMS via `content.ts`. Para landings premium con diseno a medida.
   **Si el cliente ya tiene un HTML bueno, NO lo reconstruyas con componentes: portalo fiel.**
   Procedimiento completo (generacion + porte + aislamiento + mapeo CMS) en
   `references/standalone-landings.md`. Caso vivo: `src/app/birdman/`.

Si elegis modo standalone, segui `references/standalone-landings.md` y salta los sub-pasos
3A (estructura de blocks) que son del modo motor; conserva los gates de copywriting (3B),
UI/UX (3C) y aprobacion (3E).

### Paso 3A - Estructura con templateIds Validados (MOTOR CUSTOM)

El flujo automatico usa el **motor de secciones custom de clase mundial** (sin
Flowbite, theme-aware). Cada blockType es UN template `<blockType>.custom` con un
campo `variant` interno que elige el sub-layout. (El Flowbite manual de 133
variantes queda para edicion a mano en el CMS admin.)

**CONTRACT INPUT**: brief.objetivo + brief.dna + brief.pages (checklist-2 OK).
**CONTRACT OUTPUT**: lista de `{ blockType, templateId: "<blockType>.custom",
variant?, intent }` por pagina, con todos los templateIds confirmados contra el
catalogo real.

1. Lee la receta base de `references/composition-playbook.md` segun
   `brief.objetivo`. El playbook ya esta en formato custom (con el catalogo de
   variants y los blockTypes nuevos `pain` y `steps`).

2. Para cada `blockType` en la receta, usa `<blockType>.custom` (uno por
   blockType, NO multiples variantes Flowbite). Confirmalo con
   `cms_list_block_templates({ blockType })` (el catalogo incluye los `.custom`).
   Setea el campo `variant` segun el tono del DNA (catalogo de variants en el
   playbook). Condiciones de inclusion:
   - `video-embed.custom`: incluir solo si `brief.assets.video_url` esta seteado.
   - `testimonials.custom`: si hay testimonios reales (tipo `testimonio` en
     `brief.dna.copy.prueba_social`), variant `single` (1) o `grid` (2+). Si no,
     anota placeholder pero mantiene el bloque si el objetivo lo requiere.
   - `stats.custom` (MetricsPanel): incluir solo si hay datos reales (tipo `stat`).
   - `pain.custom`: variant `cards` con `cards[].data` si hay dato duro del dolor;
     si no, variant `statement`.
   - `features.custom` variant `pillars`: usa `items[].code` (ej POD, SLA, COD).
   - Header/Footer NO van como page.blocks: se configuran en Settings (logo,
     navLinks, cta, footer, social) y el layout custom los renderiza
     (`SiteHeader`/`SiteFooter`).

3. **NUNCA inventes templateIds**. Si dudas si existe, correlo contra el
   catalogo y usa el que devuelva la tool.

4. Produce el listado intermedio de estructura por pagina.

**CHECKLIST-3A (gate duro antes de 3B)**:

```
[ ] Cada templateId tiene formato <blockType>.custom y existe en el catalogo
    (confirmado via cms_list_block_templates)
[ ] La home tiene hero.custom como primer page.block
[ ] Header/Footer configurados via Settings (NO como page.blocks)
[ ] Cada bloque con variants tiene su campo variant seteado segun el tono del DNA
[ ] video-embed.custom incluido SOLO si brief.assets.video_url esta seteado
[ ] stats.custom incluido SOLO si hay datos reales (tipo "stat" en prueba_social)
[ ] Bloque de captura de leads (cta.custom variant form, o contact.custom)
    presente en toda pagina de objetivo leads o booking
```

### Paso 3B - Copywriting de Clase Mundial (8 Pasos Obligatorios)

**CONTRACT INPUT**: plan de estructura 3A + brief.dna.copy completo.
**CONTRACT OUTPUT**: copy validado para cada bloque de cada pagina, mas el
resultado del checklist de calidad en `brief.notas`.

El copy generico es el error mas costoso de la fabrica. Cada bloque necesita
un proceso propio. Sigue estos 8 pasos en orden, sin saltear ninguno.

#### 3B.1 - Construir el COPY CONTEXT (referencia fija para todo el copy)

Antes de escribir una sola palabra, construi el COPY CONTEXT como bloque de
referencia. Lo usaras literalmente para cada bloque:

```
COPY CONTEXT - [nombre de marca]
================================
ICP exacto: [brief.dna.copy.cliente_ideal]
Pain dormido: [brief.dna.copy.pain_principal]
Transformacion: [brief.dna.copy.transformacion]
Diferenciador real: [brief.dna.copy.diferenciador_real]
Prueba social: [brief.dna.copy.prueba_social listada]
Objeciones a neutralizar: [brief.dna.copy.objeciones listadas]
Competidores (solo referencia interna): [brief.dna.copy.competidores]
Tono: [brief.dna.tone]
Palabras propias: [brief.dna.copy.palabras_propias o brief.dna.voice.palabras_propias]
Palabras prohibidas (base): innovador, soluciones, de la mano, integral,
  calidad, expertos, confiable, comprometidos, pasion + [brief.dna.copy.palabras_prohibidas]
CTA verb: [brief.dna.voice.cta_verb]
Registro: [brief.dna.voice.register]
Objetivo web: [brief.objetivo]
Locale: [brief.locale]
```

Si `brief.dna.copy` esta vacio o con menos de 3 campos, **detenete y entrevista**
(AskUserQuestion) con estas 5 preguntas en un solo bloque antes de continuar:

1. Quien es el cliente ideal EXACTO (cargo, tamano de empresa o contexto)?
2. Que problema especifico los mantiene despiertos a las 3am?
3. Que cambia en su vida/negocio 90 dias despues de contratar a [marca]?
4. Cuales son las 3 objeciones que mas escuchan antes de cerrar un cliente?
5. Tienen algun numero real: porcentaje, tiempo ahorrado, clientes, ordenes?

#### 3B.2 - Hero Headline (el mas critico; el mas trabajado)

El hero headline es la unica linea que el 80% de los visitantes lee. Proceso:

1. Genera **5 variantes** siguiendo exactamente estos 5 formatos distintos:
   - **RESULTADO**: "[Metrica o resultado concreto] para [ICP exacto]."
   - **TRANSFORMACION**: "De [before state] a [after state]. Sin [friccion tipica]."
   - **TENSION**: "[Pain especifico que reconocen al instante]. [Resolucion inesperada]."
   - **DECLARACION**: "[Afirmacion audaz del diferenciador] para [ICP]."
   - **PREGUNTA**: "[Pregunta que solo el ICP verdadero puede responder afirmativamente]?"

2. Filtra con **3 criterios duros**: descarta cualquier headline que...
   - (a) Contenga palabras prohibidas o terminos genericos (innovador, soluciones,
     confiable, calidad, expertos, comprometidos, de la mano, pasion, integral).
   - (b) No cambie si reemplazas el nombre de la marca por el de un competidor
     directo (si es intercambiable, no sirve).
   - (c) No refleje el pain especifico del ICP del COPY CONTEXT.

3. Selecciona la mejor variante. Genera la **subheadline**: 1-2 oraciones que
   amplican con el mecanismo o la prueba. Max 25 palabras. Nunca parafrasees
   el headline.

4. Genera el **CTA primario del hero**: verbo especifico de `brief.dna.voice.cta_verb`
   + beneficio inmediato. Nada de "Contactanos" o "Saber mas".

#### 3B.3 - Features (beneficios, no caracteristicas)

Para cada feature en el bloque de features:

1. **Titulo**: verbo de resultado en presente o infinitivo + objeto especifico.
   "Metricas SLA auditables por tu cliente" > "Dashboard de metricas".

2. **Descripcion**: [lo que hace] + [por que importa al ICP] + [resultado si
   hay dato]. Max 30 palabras.

3. **Max 6 features**. Si el brief pide mas, agrupas o descartaz los menos
   diferenciadores. Regla: si el competidor directo puede decirlo igual, no va.

#### 3B.4 - Stats (numeros que prueban, no que decoran)

- Usa SOLO numeros reales de `brief.dna.copy.prueba_social` (tipo `stat`).
- Si no hay stats reales: **excluye el bloque** del plan y anota en
  `brief.notas`: "[stats excluido: pendiente datos reales de [marca]]".
  Nunca inventes porcentajes o numeros redondos.
- Cada stat tiene: numero + etiqueta de 2-4 palabras + linea de apoyo 8-12
  palabras opcionales que explica como se logro o que significa.

#### 3B.5 - Testimonials (la voz del cliente hace lo que el copy no puede)

1. Si hay testimonios reales en `brief.dna.copy.prueba_social` (tipo
   `testimonio`): usarlos verbatim. Nunca los parafrasees ni "mejores".
2. Si no hay testimonios reales: genera PLACEHOLDERS especificos:
   "[TESTIMONIO PENDIENTE: cliente [perfil del ICP], resultado:
   [transformacion especifica], incluir nombre y empresa]".
   NO generes testimonios falsos aunque sean plausibles.
3. Nombre y cargo del autor obligatorios. "Maria G., Fundadora de Marca X" >
   "Fundadora de empresa".

#### 3B.6 - FAQ (neutraliza objeciones antes del cierre)

Usa `brief.dna.copy.objeciones` como fuente. Para cada objecion:

1. **Pregunta**: formula la objecion tal como la diria el prospecto, en primera
   persona. "Y si mi volumen baja un mes, que pasa?" > "Flexibilidad de volumen?"

2. **Respuesta**: directa, sin intro. Max 60 palabras. Si hay numero o garantia,
   arranca con ese.

Incluye siempre como penultima pregunta: "Como empezamos?" o "Cual es el primer
paso?" - es la pregunta que convierte a quien ya convenciste.

#### 3B.7 - CTA de Cierre (el mas especifico del funnel)

El CTA final de la pagina tiene el trabajo mas duro. Reglas:

- **Headline**: repite el beneficio core, no el nombre de la marca. Ej: "Tu
  fulfillment en orden en 30 dias o te devolvemos el primer mes."
- **Subtext**: elimina el ultimo punto de friccion. "Sin contrato anual. Sin
  setup fee. Empezas en 48 horas."
- **Boton**: `brief.dna.voice.cta_verb` + resultado inmediato. "Agendar
  diagnostico gratuito" > "Enviar".
- **Micro-copy bajo el boton**: neutraliza el miedo al compromiso. "Sin tarjeta.
  Respuesta en menos de 24 horas."

#### 3B.8 - Validacion de Calidad OBLIGATORIA (7 puntos)

Ejecuta este checklist sobre TODO el copy antes de pasar a 3C.
Si alguno falla, corriges en el momento. No avanzas con copy que no pase.

1. **GENERICIDAD**: Reemplaza nombre de la marca por el de un competidor. Si el
   copy sigue valido al 80%, es generico. Reescribe.

2. **ICP TEST**: El hero headline excluye activamente a quien no es el cliente
   ideal. Si alguien fuera del ICP lo lee y piensa "esto es para mi", es
   demasiado amplio.

3. **POWER WORDS en headlines**: Al menos 1 categoria debe aparecer en el hero:
   numero especifico, resultado concreto, nombre del pain especifico, o
   diferenciador unico. Si no hay ninguna, reescribe.

4. **CTA SPECIFICITY**: Cada CTA responde "exactamente que pasa despues del
   click?". "Contactanos" no lo responde. "Agendar diagnostico de 30 minutos" si.

5. **PALABRAS PROHIBIDAS**: Busca en todo el copy: innovador/a, soluciones,
   de la mano, integral/es, calidad, expertos, confiable, comprometidos,
   pasion/passion, y las de `brief.dna.copy.palabras_prohibidas`. Si alguna
   aparece, reemplazala.

6. **READABILITY**: Ninguna oracion supera 25 palabras. Ningun parrafo supera
   3 oraciones. Si alguno falla, parte.

7. **PRUEBA SOCIAL**: Al menos un numero real (o "[PENDIENTE]" marcado) aparece
   en el hero o en los primeros 2 bloques despues del header.

Registra el resultado del checklist en `brief.notas` como resumen de 1 linea
por punto: "OK" o "CORREGIDO: [que cambiaste]".

**CHECKLIST-3B (gate duro antes de 3C)**:

```
[ ] COPY CONTEXT construido y visible como referencia
[ ] Hero headline tiene 5 variantes generadas, filtradas con 3 criterios, 1 elegida
[ ] Hero subheadline generada (max 25 palabras, no parafrasea el headline)
[ ] Hero CTA primario usa brief.dna.voice.cta_verb + beneficio inmediato
[ ] Features: max 6, cada una con titulo verbo-resultado + descripcion max 30 palabras
[ ] Stats: solo con datos reales O bloque excluido y anotado en brief.notas
[ ] Testimonials: verbatim reales O placeholders especificos (no testimonios falsos)
[ ] FAQ: cada pregunta en primera persona del prospecto, respuesta max 60 palabras
[ ] CTA cierre: headline beneficio + subtext friccion cero + boton + micro-copy
[ ] Checklist de 7 puntos ejecutado, resultado en brief.notas
```

### Paso 3C - Gate UI/UX Design Review (OBLIGATORIO, no opcional)

**CONTRACT INPUT**: plan de bloques con templateIds + copy validado + DNA completo.
**CONTRACT OUTPUT**: plan revisado con correcciones de ui-ux-pro-max aplicadas.

Invoca el skill `ui-ux-pro-max` pasandole:
- El DNA completo (colores, fuentes, tono, assets).
- La lista de bloques con templateIds y el copy draft completo.
- El objetivo del sitio y el ICP.

Aplica TODAS las correcciones que devuelva. No es discrecional.

**CHECKLIST-3C (gate duro antes de 3D)**:

```
[ ] ui-ux-pro-max invocado con DNA + plan de bloques + copy
[ ] Correcciones de ui-ux-pro-max documentadas (cuales eran)
[ ] Correcciones de ui-ux-pro-max aplicadas al plan (o justificacion de por que
    una correccion especifica no aplica en este contexto)
[ ] Plan de bloques actualizado con los cambios
```

### Paso 3D - Gate Copywriting Final (OBLIGATORIO, no opcional)

**CONTRACT INPUT**: plan de bloques post-ui-ux + COPY CONTEXT + copy revisado.
**CONTRACT OUTPUT**: copy final revisado por impeccable, correcciones aplicadas.

Invoca el skill `impeccable` pasandole:
- El COPY CONTEXT completo.
- El plan de bloques con TODO el copy generado y revisado.
- Las instrucciones de tono y registro del brief.

Aplica TODAS las correcciones que devuelva. Este es el gate final de calidad
antes de que cualquier texto llegue al CMS.

**CHECKLIST-3D (gate duro antes de 3E)**:

```
[ ] impeccable invocado con COPY CONTEXT + plan completo + instrucciones de tono
[ ] Correcciones de impeccable documentadas
[ ] Correcciones de impeccable aplicadas al copy final
[ ] Copy final sin palabras prohibidas (verificacion post-impeccable)
```

### Paso 3E - Coherencia de Marca + Aprobacion de Jorge

**CONTRACT INPUT**: plan completo con estructura validada + copy validado por
2 skills + correcciones aplicadas.
**CONTRACT OUTPUT**: `brief.confirmado = true` (aprobacion explicita de Jorge).

1. Verifica coherencia global de marca entre bloques:
   - El tono es consistente en todos los bloques (no hay bloques formales
     mezclados con bloques desenfadados si el tono es uniforme).
   - Los colores del DNA estan mapeados a bloques con contraste legible
     (primario como fondo en CTA, acento como highlight, paper como fondo general).
   - Las imagenes de assets (hero_image, product_images) estan asignadas a los
     bloques correctos y no quedan bloques de galeria o hero con placeholder
     cuando hay assets disponibles.

2. Presenta el plan completo a Jorge en formato legible:
   - Resumen del DNA aplicado (colores, fuentes, tono, assets usados).
   - Lista de paginas con bloques y copy de los headlines principales.
   - Destino de leads y email de notificacion.
   - Dominio o URL de staging.
   - Resultado de los gates: que correcciones se aplicaron en 3B, 3C y 3D.

3. Pide confirmacion explicita de Jorge. Cuando diga OK:
   - Fija `brief.confirmado = true`.
   - Guarda el `brief.json` final.

**CHECKLIST-3E (gate duro antes de Paso 4)**:

```
[ ] Coherencia de tono verificada entre todos los bloques
[ ] Assets mapeados a bloques correctos (no placeholders cuando hay images reales)
[ ] Colores con contraste verificado (primario como fondo en CTA funciona legible)
[ ] Plan presentado a Jorge con resumen completo
[ ] Jorge dijo OK explicitamente
[ ] brief.confirmado = true
```

**Resultado del Paso 3 completo**: por cada pagina, una lista ordenada de
`{ blockType, templateId, ...todos los campos de contenido con copy validado }`.
Toda pagina arranca con `header.*` y termina con `footer.*`; la home lleva
`hero.*` primero.

---

## Paso 4 - Ejecucion (Gate de Confirmacion)

**CONTRACT INPUT**: `brief.confirmado = true` (checklist-3E OK) + los bloques a
medida YA generados en el repo `believe-web-starter` (receta
`references/puck-generation.md`): `src/cms/blocks/<slug>/`, su `content.ts`, el
registro en `registry.ts` y el seed del block set.

**CONTRACT OUTPUT**: tenant dado de alta, codigo deployado a Contabo, URL live
`https://puck.believe-global.com/s/<slug>`.

El MCP `puck-cms` hace lo REPETIBLE por API; los bloques los escribiste vos con
Write/Edit. Orden canonico:

1. **Verifica el block set**. `puck_list_blocksets()` -> el `<slug>` que generaste
   debe aparecer. Si no esta, todavia no terminaste de generar/registrar los bloques.

2. **Alta del tenant**. `puck_create_tenant({ slug, name, blockSet: slug, tokens })`.
   La tool valida que el blockSet exista y NO pisa un tenant existente. Los `tokens`
   son overrides de paleta (`{ "--brand": "#..." }`); si el CSS del block set ya
   trae los colores fieles, va `{}`. Para cambiarlos luego: `puck_set_tokens`.

3. **Plan de deploy (dryRun)**. `puck_deploy({ dryRun:true })` y resume a Jorge:
   rama, comandos (rsync + docker build + run-puck) y destino. Segunda revision
   antes de tocar produccion.

4. **Deploy real**. `puck_deploy({ dryRun:false })` -> rsync del repo a Contabo,
   docker build y recrea el container. La PRIMERA publicacion de una marca nueva
   SIEMPRE pasa por aca (los bloques son codigo). Captura el resultado.

5. **Contenido**. La home renderiza desde el seed del block set apenas deployaste.
   Para sumar paginas sin redeploy: `puck_seed_page({ tenant, slug })` (las crea
   con el seed, lista para editar). Para editar contenido por API:
   `puck_publish_page({ tenant, slug, data })`. Tambien se edita visual en
   `/admin/<slug>/<page>` (tras Authelia) con live preview.

Leads: los forms de los bloques postean a `/api/contact` y `/api/newsletter` del
repo; el destino se configura en el codigo/env del CMS, no hay tool de leads.

Si una tool falla, para, reporta el error tal cual y no sigas con las siguientes.

---

## Paso 5 - Verificacion E2E con Criterios de Aceptacion

**CONTRACT INPUT**: `https://puck.believe-global.com/s/<slug>` tras `puck_deploy`.
**CONTRACT OUTPUT**: verificacion documentada de todos los criterios de aceptacion.

### 5.1 - Disponibilidad HTTP

Verifica que la URL responde 200. El build en Contabo tarda unos minutos; usa
curl con reintentos (NO `sleep` en foreground):

```bash
curl -s --retry 12 --retry-delay 30 --retry-all-errors -o /dev/null \
  -w "%{http_code}" https://puck.believe-global.com/s/<slug>
```

Si no hay 200: para y reporta "URL no responde. Ver logs con:
`ssh contabo-believe docker logs puck-cms`". No hagas mas intentos.

### 5.2 - Screenshot y Verificacion Visual

Usa el skill `/browse` (regla global: nunca uses herramientas de chrome
directas) para tomar un screenshot de la home.

Verifica estos criterios de aceptacion visuales (no pases si alguno falla):

1. **Color primario visible**: el color `brief.dna.colors.primary` aparece en el
   header, en el CTA principal o en un bloque de fondo de color. Si no aparece
   ninguno de los tres, reporta fallo.

2. **Fuente display cargada**: el `h1` o `h2` del hero usa la fuente
   `brief.dna.fonts.display` (verificar en computed styles o por inspeccion
   visual del screenshot). Si usa una fuente de sistema generica, reporta fallo.

3. **Sin placeholder de imagen en el hero**: si `brief.assets.hero_image_url`
   esta seteado, el hero NO debe mostrar el placeholder gris por defecto.
   Si hay placeholder visible y hay una imagen real disponible, reporta fallo.

4. **Logo o wordmark en header**: el header muestra el logo (si se proveyó URL)
   o el nombre de la marca como texto. Si el header esta en blanco o con logo
   generico, reporta fallo.

5. **CTA visible above the fold**: al menos un CTA con el texto del
   `brief.dna.voice.cta_verb` es visible sin scroll. Si no hay CTA visible,
   reporta fallo.

Si `/browse` no esta disponible o falla, fallback: parsea el HTML de la URL con
`curl` y verifica que el color primario y el nombre de la marca aparezcan en el
HTML como indicadores minimos.

### 5.3 - Lead E2E

Envia un lead de prueba por el formulario y confirma que llega al destino:

- sink `maasy_crm`: verifica con `maasy_get_crm_summary({ project_id })` que
  aparezca, o revisa el endpoint del CRM. El lead de prueba debe tener email
  con prefijo `test-` para identificarlo facilmente.
- sink `appwrite`: verifica que el documento este en la coleccion
  `leads_<slug>` de Appwrite.

### 5.4 - Reporte Final

Reporta a Jorge:

```
WEB LISTA - [nombre de marca]
==============================
URL: [url final]
CMS admin: https://cms.believe-global.com (tenant: [slug])
Destino de leads: [maasy_crm | appwrite] confirmado E2E
Gates aplicados:
  - Copywriting: [resumen del checklist-3B]
  - Design review (ui-ux-pro-max): [correcciones aplicadas]
  - Copy final (impeccable): [correcciones aplicadas]
Criterios visuales: [lista OK/FALLO por criterio]
Proximos pasos sugeridos:
  - Reemplazar placeholders [PENDIENTE] con datos reales cuando disponibles
  - Verificar que el dominio [brief.dominio] apunta a [URL staging]
  - Conectar [analytics provider] con ID [tracking_id]
```

**CHECKLIST-5 (cierre del Paso 5)**:

```
[ ] HTTP 200 confirmado
[ ] Color primario visible en screenshot
[ ] Fuente display cargada en headers
[ ] Sin placeholders de imagen cuando hay assets reales
[ ] Logo o wordmark en header
[ ] CTA visible above the fold
[ ] Lead E2E enviado y confirmado en destino
[ ] Reporte final entregado a Jorge
```

---

## Si faltan secrets

Las tools fallan con mensaje claro cuando falta un secret. No los resuelvas;
traduce el fallo a una accion para Jorge:

- `puck_deploy` falla en rsync/ssh -> no hay acceso a `contabo-believe`. Avisa
  que falta la config SSH o la key del VPS (no la pidas por chat; va a Infisical).
- `puck_publish_page`/`puck_get_page` dan 503 -> el container no tiene
  `PUCK_SVC_KEY` (revisar `/root/.puck-svc-key` en el VPS + redeploy). Dan 401 ->
  la key del MCP (via infra) no coincide con la del CMS.
- El MCP `puck-cms` no aparece -> la sesion no esta en el repo `believe-web-starter`
  (ahi vive su `.mcp.json`) o falta `npm --prefix puck-cms-mcp run build`.

Regla: nunca pidas que peguen un token en el chat. Todo vive en Infisical y se
inyecta con `infra`. Si un secret nuevo hiciera falta, va a Infisical, no al
chat ni a `.zshrc`.

## Manejo de Errores y Reanudacion

- Guarda el `brief.json` apenas tengas el Paso 1 completo: si la sesion se
  corta, podes retomar desde el checklist donde quedaste.
- Las tools del MCP son idempotentes/seguras: `puck_create_tenant` no pisa un
  tenant existente, `puck_publish_page` sobrescribe la misma pagina, y
  `puck_deploy` recrea el mismo container (NO crea apps nuevas). Recorrer el
  Paso 4 no duplica recursos.
- Si un gate falla (checklist no pasa), volvés al sub-paso anterior y corriges.
  No saltas gates aunque Jorge este apurado.
