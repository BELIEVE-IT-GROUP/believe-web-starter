# MCP Tools Cheat-Sheet

Las "manos" de la fabrica son dos MCP servers. El skill `believe-web` es el
cerebro que los orquesta.

- `believe-cms` (server local, 7 tools) escribe en el CMS y deploya en Coolify.
- `Maasy MCP` (claude.ai) lee el DNA y el CRM de las marcas que ya estan en Maasy.

Regla de seguridad: TODAS las tools de escritura de `believe-cms` default
`dryRun: true`. Corren primero en dryRun para mostrar el plan; solo pasas
`dryRun: false` despues de que Jorge confirma (`brief.confirmado === true`).

---

## believe-cms (escritura CMS + deploy)

### cms_list_block_templates (read-only, siempre seguro)

Lista el catalogo Flowbite (133 templateId).

```json
{ "blockType": "hero" }   // opcional; omitir = todos los 133
```

Devuelve `{ blockType, count, templates: [{ templateId, blockType, label }] }`.

### cms_create_tenant

Crea un tenant. Idempotente: si el slug existe, devuelve el existente.

```json
{ "slug": "pawers", "name": "Pawers", "domain": "pawers.com",
  "primaryColor": "#0c3bb9", "accentColor": "#00aaff", "dryRun": true }
```

Requeridos: `slug`, `name`. Devuelve `tenant: { id, slug, name }`. Guarda el
`tenant.id`: lo necesitan `cms_provision_leads` y `cms_deploy`.

### cms_set_theme_from_dna

Aplica el DNA de marca a `settings.theme` del tenant. Mergea con el theme
existente (no pisa campos no provistos).

```json
{ "tenantSlug": "pawers",
  "dna": {
    "colors": { "primary": "#0c3bb9", "accent": "#00aaff",
                "paper": "#fafaf7", "ink": "#0a0a0a" },
    "fonts": { "display": "Fraunces", "body": "Inter" },
    "tone": "warm" },
  "dryRun": true }
```

Requeridos: `tenantSlug`, `dna.colors.primary`. Los colores deben ser hex
validos. Requiere que ya exista un documento `settings` para el tenant (lo crea
`cms_seed_content` o `cms_provision_leads`; si no existe, falla con mensaje
claro). El `tone` del brief-schema usa el enum del schema; el campo `tone` de
esta tool acepta texto libre, pasa el valor del brief tal cual.

### cms_create_page

Crea una pagina con bloques ordenados. Idempotente en (tenant, slug).

```json
{ "tenantSlug": "pawers", "slug": "home", "title": "Pawers",
  "blocks": [
    { "blockType": "header", "templateId": "header.default" },
    { "blockType": "hero", "templateId": "hero.cover-image-ctas",
      "heading": "...", "subheading": "..." },
    { "blockType": "footer", "templateId": "footer.default" }
  ],
  "dryRun": true }
```

Cada bloque: `{ templateId, blockType?, ...campos }`. El `templateId` debe
existir en el catalogo. `blockType` se deriva del catalogo si lo omitis; si lo
pasas, debe coincidir. Los campos extra (heading, items, etc.) se pasan verbatim
al CMS.

### cms_seed_content

Crea varias paginas de una. Valida TODOS los bloques antes de escribir nada.

```json
{ "tenantSlug": "pawers",
  "structure": { "pages": [
    { "slug": "home", "title": "Pawers", "blocks": [ ... ] },
    { "slug": "nosotros", "title": "Nosotros", "blocks": [ ... ] }
  ] },
  "dryRun": true }
```

Idempotente por pagina. Si una pagina ya existe la saltea. Util cuando el brief
tiene mas de una pagina: una sola llamada en vez de N `cms_create_page`.

### cms_provision_leads

Decide y configura el destino de los leads.

```json
{ "tenantSlug": "pawers", "tenantId": "<id de cms_create_tenant>",
  "email": "usesend", "dryRun": true }
```

Requeridos: `tenantSlug`, `tenantId`. `email` opcional: `"usesend"` o `"plunk"`.

Arbol de decision interno:
1. Si hay `MAASY_URL` + `MAASY_API_KEY` y el tenant es una marca en Maasy ->
   sink `maasy_crm` (CRM de Maasy, con HMAC por tenant).
2. Si no -> crea coleccion Appwrite `leads_<slug>` -> sink `appwrite`.
3. Si no hay credenciales de ninguno -> devuelve `action: "needsCreds"` con la
   lista de env vars que faltan. No es un error fatal: avisa y para.

Nota: el `brief.leads.backend` ("maasy"|"appwrite") es la INTENCION; la tool
decide el sink real segun credenciales y si la marca esta en Maasy. Si el brief
pide "maasy" pero la marca no esta en Maasy, cae a Appwrite (avisalo).

### cms_deploy

Crea y deploya el frontend `believe-web-starter` en Coolify Hetzner.

```json
{ "tenantSlug": "pawers", "tenantId": "<id>", "domain": "pawers.com",
  "dryRun": true }
```

Requeridos: `tenantSlug`, `tenantId`. `domain` opcional: si lo omitis, devuelve
una URL sslip.io de staging (`http://<uuid8>.5.78.214.173.sslip.io`). Inyecta
`NEXT_PUBLIC_TENANT_ID`, `NEXT_PUBLIC_PAYLOAD_URL`, `NEXT_PUBLIC_TENANT_SLUG`.
El build tarda unos minutos. Devuelve `app: { uuid, name, url, domain }`.

Requiere `COOLIFY_HETZNER_TOKEN` en el entorno (lo inyecta `infra`).

---

## Maasy MCP (lectura DNA + CRM)

Conectado via claude.ai. Solo lectura para esta fabrica.

### maasy_list_brands

Lista las marcas en Maasy con sus UUIDs. Primer paso siempre: descubrir si la
marca pedida ya existe. Devuelve marcas con `project_id` (UUID).

### maasy_get_brand_dna({ project_id })

Devuelve el DNA: colores, fuentes, tono, posicionamiento. Se mapea directo al
`brief.dna` y luego a `cms_set_theme_from_dna`.

### maasy_get_brand_context({ project_id })

Contexto extendido: publico objetivo, propuesta de valor, posicionamiento,
industria. Alimenta `brief.marca` y el contexto de copy.

### maasy_get_crm_summary({ project_id })

Resumen del CRM de la marca. Util para decidir el backend de leads
(`brief.leads.backend = "maasy"` cuando la marca ya tiene CRM en Maasy).

---

## Orden canonico de ejecucion (paso 4 del skill)

Todo en dryRun primero, mostrar plan, confirmar, repetir con dryRun:false.

1. `cms_create_tenant` -> capturar `tenant.id`.
2. `cms_seed_content` (o `cms_create_page`) -> crea paginas + el doc `settings`.
3. `cms_set_theme_from_dna` -> aplica el DNA al theme.
4. `cms_provision_leads({ tenantId })` -> destino de leads + email.
5. `cms_deploy({ tenantId, domain? })` -> URL final.

Nota de orden: `cms_set_theme_from_dna` y `cms_provision_leads` necesitan que ya
exista el documento `settings` del tenant. `cms_seed_content` lo materializa al
crear la primera pagina, asi que va antes. Si por algun motivo seedeas despues,
`cms_provision_leads` crea un `settings` minimo igual.
