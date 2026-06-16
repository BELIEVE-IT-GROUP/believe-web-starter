---
name: believe-web
description: >-
  Fabrica de webs Believe end-to-end en una sola sesion conversacional. Dispara
  cuando Jorge diga "crea una web para [marca]", "crea/armame una landing para
  [marca]", "nueva web de cliente", "necesito un sitio para [marca]", "montame la
  web de [marca]" o variantes. Carga el DNA de la marca (Maasy o entrevista),
  entrevista lo que falta, compone la web con las 133 variantes Flowbite
  aplicando la identidad real, decide el backend de leads, deploya en Coolify y
  la deja administrable. NO usar para editar una web ya creada ni para tareas de
  ads, contenido o research.
allowed-tools: AskUserQuestion, Read, Bash, Skill
---

# Believe Web Factory

Convertis una frase ("crea una web para Pawers") en una web real: DNA cargado,
entrevista, composicion con bloques Flowbite, leads conectados, deploy en
Coolify, administrable desde el CMS. Una sola sesion conversacional.

Vos sos el cerebro. Las manos son dos MCP servers:

- `believe-cms` (7 tools) escribe en el CMS y deploya en Coolify.
- `Maasy MCP` lee el DNA y el CRM de marcas que ya estan en Maasy.

Cheat-sheet de las 7 tools con params reales: `references/mcp-tools.md`.
Schema del brief estructurado: `references/brief-schema.json`.
Recetas objetivo -> bloques: `references/composition-playbook.md`.
Resumen de los 17 blockTypes y para que sirve cada uno: `references/block-catalog.md`.

## Reglas duras

- **Solo ASCII** en cualquier valor que mandes a las tools del CMS y en el JSON
  del brief. El texto visible para el usuario (copy de bloques en espanol) puede
  llevar tildes. Markdown de notas puede llevar tildes.
- **Gate de confirmacion**: ninguna tool de escritura corre con `dryRun: false`
  hasta que Jorge revise el resumen del brief y diga OK. Eso fija
  `brief.confirmado = true`. Sin eso, todo es dryRun.
- **Nada de pedir accesos a mano**: los secrets ya viven en Infisical y los
  inyecta `~/.believe/bin/infra`. Nunca le pidas a Jorge un token ni una
  password. Si falta un secret, avisas claro (ver "Si faltan secrets").
- **No toques** el frontend `believe-web-starter` ni el codigo del MCP. Tu
  trabajo es orquestar tools, no editar repos.

## Prerequisitos de runtime (verifica, no resuelvas)

Para que la fabrica EJECUTE (no solo dryRun) hace falta:

- El MCP `believe-cms` instalado y corrido via
  `~/.believe/bin/infra node dist/index.js` (asi tiene los secrets en el env).
- Secrets de setup: `CMS_ADMIN_EMAIL` y `CMS_ADMIN_PASSWORD` (super-admin
  Payload). Mas `COOLIFY_HETZNER_TOKEN` para el deploy. Todos via Infisical.
- Maasy MCP conectado en claude.ai (para cargar DNA de marcas que ya estan ahi).

Si algo de esto no esta, las tools fallan con mensaje claro al usarlas. No
intentes instalar ni configurar nada: reporta que falta y a quien (Jorge).

---

## Paso 1 - Cargar DNA de la marca

1. Corre `maasy_list_brands` para ver si la marca existe en Maasy.
2. **Existe** -> toma su `project_id` (UUID) y carga:
   - `maasy_get_brand_dna({ project_id })`: colores, fuentes, tono, posicionamiento.
   - `maasy_get_brand_context({ project_id })`: publico objetivo, propuesta de
     valor, industria.
   - `maasy_get_crm_summary({ project_id })`: si ya tiene CRM, el backend de
     leads tiende a `maasy`.
   Mapea todo a `brief.marca` y `brief.dna`. Guarda el UUID en
   `brief.marca.maasy_project_id`.
3. **No existe en Maasy** -> entrevista breve para suplir el DNA (ver abajo).
   Deja `brief.marca.maasy_project_id` sin setear.

### Marca NO en Maasy: suplir el DNA con AskUserQuestion

Pregunta lo minimo para llenar `brief.dna`:

- Colores de marca (al menos el primario, hex). Si solo te dan un nombre de
  color o una referencia, proponé un hex y confirmá.
- Fuente de titulos y de cuerpo (nombres de Google Fonts). Si no saben, propone
  un par coherente con la industria.
- Tono (enum del brief: professional, playful, bold, minimalist, warm,
  authoritative, conversational, premium).
- Posicionamiento / propuesta de valor en una frase.

Con eso armas un DNA valido aunque la marca no este en Maasy. No bloquees la
fabrica por falta de Maasy.

## Paso 2 - Entrevista (AskUserQuestion) -> brief.json

Usa `AskUserQuestion` para cerrar lo que falte. Agrupa preguntas para no marear.
Cubri:

- **Objetivo** de la web: `leads`, `venta`, `autoridad`, `booking` (uno).
  Esto elige la receta de composicion.
- **Paginas**: cuales y en que orden (home siempre). Cada una con su slug y
  titulo.
- **Secciones por pagina**: que cuenta cada pagina. No le pidas templateIds al
  usuario; vos los mapeas en el paso 3.
- **CTAs**: la accion principal (reservar, comprar, dejar email, contactar).
- **Leads**: backend (`maasy` o `appwrite`), proveedor de email opcional
  (`usesend`/`plunk`), email de notificacion.
- **Dominio**: FQDN sin protocolo (`pawers.com`) o nada (usa staging sslip.io).

Produci un brief que valide contra `references/brief-schema.json`. Campos
requeridos: `marca`, `dna`, `objetivo`, `pages`, `leads`. Guarda el brief como
`brief.json` en el directorio de trabajo de la sesion. Recordá: valores ASCII en
los campos que van al CMS.

## Paso 3 - Composicion (brief -> plan de bloques, MOTOR CUSTOM)

El flujo automatico usa el **motor de secciones custom de clase mundial** (sin
Flowbite). Cada blockType es UN template `<blockType>.custom` con un campo
`variant` interno que elige el sub-layout. Para cada pagina del brief:

1. Toma la receta base de `references/composition-playbook.md` segun
   `brief.objetivo`. El playbook ya esta en formato custom.
2. Para cada `blockType`, usa `<blockType>.custom` (ej `hero.custom`,
   `pain.custom`, `cta.custom`). Confirmalo con
   `cms_list_block_templates({ blockType })` (el catalogo incluye las entradas
   `.custom`). **Nunca inventes templateIds.** NO elijas entre multiples
   templateId Flowbite: en custom hay UNO por blockType.
3. Setea el campo `variant` de cada bloque segun el tono del DNA, usando el
   "Catalogo de variants" del playbook (ej `hero.custom` variant `metrics` para
   B2B con datos; `pain.custom` variant `cards` con `cards[].data`;
   `features.custom` variant `pillars` con `items[].code`). Si el variant no
   existe, el componente usa su default sin romper.
4. Genera el contenido inicial de cada bloque (heading, subheading, items, copy,
   stats, cards, etc.) usando el DNA y el contexto. Copy en espanol neutro, sin
   em-dashes, con metodo ATIDCOA, alineado al tono de la marca.
5. **Sube la calidad con skills de diseno**: invoca `impeccable` o
   `ui-ux-pro-max` pasandoles el DNA + el plan de bloques; pedi que revisen orden,
   jerarquia y coherencia. Aplica sus correcciones al plan ANTES de ejecutar.

Resultado: por cada pagina, una lista ordenada de
`{ blockType, templateId: "<blockType>.custom", variant?, ...campos de contenido }`.
La home arranca con `hero.custom`. **Header y Footer NO son page.blocks**: se
configuran en `Settings` (logo, navLinks, cta, footer, social) y el layout custom
los renderiza como `SiteHeader` / `SiteFooter`; el skill los setea en el bootstrap
del tenant (`cms_create_tenant`) y el theme.

## Paso 4 - Ejecucion (gate de confirmacion)

1. **Muestra el plan completo en dryRun**. Corre, en orden, todas las tools de
   escritura con `dryRun: true` y resume a Jorge: tenant, theme (colores/fuentes),
   paginas y bloques, destino de leads, dominio/URL.
2. **Pedi confirmacion explicita.** Recien cuando Jorge diga OK, fija
   `brief.confirmado = true`.
3. **Ejecuta con `dryRun: false`** en este orden canonico (detalle y por que del
   orden en `references/mcp-tools.md`):

   1. `cms_create_tenant({ slug, name, domain?, dryRun:false })` -> captura
      `tenant.id`. (Idempotente: si existe, lo reusa.)
   2. `cms_seed_content({ tenantSlug, structure:{pages:[...]}, dryRun:false })`
      -> crea todas las paginas con sus bloques y materializa el doc `settings`.
      (O `cms_create_page` pagina por pagina si preferis granularidad.)
   3. `cms_set_theme_from_dna({ tenantSlug, dna, dryRun:false })` -> aplica DNA al
      theme.
   4. `cms_provision_leads({ tenantSlug, tenantId, email?, dryRun:false })` ->
      conecta el destino de leads. Si la tool devuelve `action:"needsCreds"`,
      para y avisa que faltan credenciales (no es error fatal).
   5. `cms_deploy({ tenantSlug, tenantId, domain?, dryRun:false })` -> deploya en
      Coolify Hetzner. Captura la URL devuelta.

Pasa siempre el `tenant.id` real (de la tool 1) a `cms_provision_leads` y
`cms_deploy`. Si una tool falla, para, reporta el error tal cual y no sigas con
las siguientes.

## Paso 5 - Verificacion (E2E)

1. **La URL responde 200.** El build de Coolify tarda unos minutos; reintenta
   con backoff. Para chequear:
   `curl -s -o /dev/null -w "%{http_code}" <url>` via Bash.
2. **Screenshot** de la home para verificar identidad visual (colores, fuentes,
   bloques renderizando). Usa la skill `/browse` (regla global: nunca uses
   herramientas de chrome directas). Confirma que el theme de la marca se ve
   aplicado.
3. **Lead de prueba E2E**: envia un lead por el formulario y confirma que llega
   al destino correcto:
   - sink `maasy_crm`: verifica con `maasy_get_crm_summary({ project_id })` que
     aparezca, o revisa el endpoint del CRM.
   - sink `appwrite`: verifica que el documento este en la coleccion
     `leads_<slug>`.
4. **Reporta** a Jorge: URL final, destino de leads confirmado, y que quedo
   administrable desde el CMS (`cms.believe-global.com`).

---

## Si faltan secrets

Las tools fallan con mensaje claro cuando falta un secret. No los resuelvas;
traduce el fallo a una accion para Jorge:

- `CMS_ADMIN_EMAIL` / `CMS_ADMIN_PASSWORD` faltantes -> el MCP no puede
  loguearse al CMS. Avisa: "el MCP believe-cms necesita correr via
  `~/.believe/bin/infra` con el super-admin de Payload en Infisical".
- `COOLIFY_HETZNER_TOKEN` faltante -> `cms_deploy` no puede crear la app. Avisa
  que falta el token de Coolify Hetzner en el env.
- `cms_provision_leads` devuelve `action:"needsCreds"` -> ni Maasy ni Appwrite
  tienen credenciales. Lista las env vars que pide la tool y para esa parte; el
  resto de la web ya quedo creada.

Regla: nunca pidas que peguen un token en el chat. Todo vive en Infisical y se
inyecta con `infra`. Si un secret nuevo hiciera falta, va a Infisical, no al
chat ni a `.zshrc`.

## Manejo de errores y reanudacion

- Guarda el `brief.json` apenas lo tengas: si la sesion se corta, podes retomar.
- Las tools de creacion de CMS son idempotentes (tenant por slug, pagina por
  (tenant, slug)). Recorrer el paso 4 no duplica recursos.
- `cms_deploy` crea una app nueva cada vez; no la corras dos veces para el mismo
  tenant sin verificar antes en Coolify.
