# Puck Believe — estado al 2026-07-08

Resumen de todo lo montado hoy sobre el CMS Puck de Believe (`believe-web-starter`, deploy en Contabo,
`https://puck.believe-global.com`). Rama de trabajo: `feat/maasy-raw-blockset`.

## 1. Las 4 landings del Grupo Orvia (live)

Cuatro landings del grupo logístico Orvia, negro + naranja `#ff8400`, generadas con el flujo **blockSet `raw`**
(HTML a medida → troceado a datos editables → deploy, sin recompilar por landing):

| Marca | URL | blockSet | Notas |
|---|---|---|---|
| EnviaYa! | `/s/envia-ya` | raw | Montserrat, comparador de tarifas animado, stats 250K/$69 |
| Trust Logistics | `/s/trust-logistics` | raw | Syne+Montserrat, panel de evidencia (98.4% pick, +300K órdenes), pilares PANEL·POD·SLA·COD |
| Grupo ORVIA | `/s/orvia` | raw | Sombrilla; diagrama de ecosistema, las 3 empresas con links, metodología |
| Birdman Logistics | `/s/birdman` | birdman (custom) | In-Plant Shipping Management; calculadora + casos + tecnología |

- **Logos reales** (SVG en `/public/logos/`) en nav, footer y cards, dimensionados por marca para verse parejos.
- Footers con "Una empresa de [Grupo ORVIA]" + fila de las 3 hermanas.
- Datos de marca (colores, tipografía, stats) tomados del `design.md` de cada marca en Maasy.

## 2. SEO / GEO ready (todo el CMS)

Cada landing nace lista para buscadores y motores generativos (`src/lib/seo.ts` + la ruta pública):

- **Buscadores**: `<title>`, meta description, canonical, robots, **JSON-LD** (Organization + WebSite).
- **Redes**: Open Graph + Twitter card + **OG images dinámicas on-brand** (`/s/<slug>/opengraph-image`).
- **GEO / agentes**: `robots.txt` con los 15 crawlers de IA permitidos (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended…), `sitemap.xml`, y **`llms.txt`** por landing (índice en la raíz + por-tenant).
- Todo editable en el editor (grupo "SEO · Meta": título, description, OG image con upload, canonical,
  robots, JSON-LD y llms.txt como override; vacío = auto).

## 3. AOS — Agent Operability (integración con Maasy)

El CMS integra el **AOS de Maasy** (Agent Operability): botón **"⚡ Auditar AOS"** en el editor →

1. `aos-audit-url` audita la landing en vivo → score + forms detectados.
2. `aos-generate` por cada form → JSON-LD `potentialAction` + tool MCP + endpoint MCP.
3. Hornea el JSON-LD y el `llms.txt` (con las acciones + endpoint MCP) en la página.

Resultado: cada landing puede volverse **agent-operable** (un agente ejecuta el form real vía el endpoint MCP
público de Maasy `aos-mcp?audit_id=…`, sin simular DOM). Código en `src/lib/aos.ts` +
`src/app/api/cms/[tenant]/[slug]/aos/route.ts`.

## 4. UI del CMS con el Believe Brand System

El admin (tras Authelia) se rediseñó con el brandbook Believe v.2026:

- Wordmark **"Believe."** (Fraunces azul `#0c3bb9` + punto cian + e rotada), Paper 50, cian solo como señal.
- Tipografías Fraunces (display) + Inter (body) + JetBrains Mono (data). Cero sombras/gradientes.
- Cards de tenant con blockSet, nº de páginas, ver-sitio; editor con feedback de publicación (toast) + salir/ver.
- **Upload de imágenes** a R2 en secciones y OG image (subir archivo o pegar URL).

## 5. Captura de leads → email + CRM Maasy + Zoho

Pipeline completo (detalle en `docs/leads-puck.md`):

`Form → /api/contact → respaldo en CMS + email + webhook → n8n → Zoho CRM (todas) + CRM Maasy (Envía Ya/Trust)`

- **Atribución de campaña/UTM**: cada landing lee `utm_campaign/source/medium` de la URL del anuncio
  (fallback `<landing>-web`) → viaja a Maasy (`source`) y Zoho (`Lead_Source`).
- Workflow n8n **"🧲 Grupo ORVIA · Leads Intake"** (`6Y5Dr9f1lHHe1d4e`). Zoho vía HTTP Request con
  credencial OAuth. Verificado E2E (Zoho devuelve `code: SUCCESS`).

## Arquitectura clave (para retomar)

- **blockSet `raw`** (`src/cms/blocks/raw/`): genérico, data-driven. Toda landing de marca es datos, no código.
  Render público SSR en `src/app/s/[tenant]/[[...slug]]/page.tsx` (sin marcadores, SEO ✅).
- **Troceador** `scripts/trocear-maasy.mjs`: HTML → tenant + página editable.
- **Deploy**: MCP `puck-cms` (`puck_deploy`) → rsync a Contabo + docker build + run. `data/tenants/*` se
  versiona; `data/pages/*` vive en el volumen `puck-cms-pages` (se publica por API, no en el build).
- **Publicar contenido**: `PUT /api/svc/cms/<tenant>/<slug>` (header `X-CMS-Key`).

## Gotchas / aprendizajes

- **Imágenes de landings (`public/img/<slug>/*.webp`)**: se hornean en la imagen Docker vía `COPY public` (el standalone arma su manifiesto de estáticos EN BUILD; un `docker cp` en caliente NO las sirve → siempre rebuild). NO están gitignored. Bug real 2026-07-10: unos webp quedaron fuera del disco de la checkout main, un `git add -A` posterior los capturó como **borrados**, y el `rsync --delete` del deploy los eliminó del container → 404/placeholders en TODAS las landings. Prevención: antes de commitear en deploys, verificar que los assets sigan en disco (`find public/img -name '*.webp' | wc -l`); tras deployar, verificar cada asset en 200 (no solo que el HTML lo referencie); assets nuevos van commiteados (trackeados) antes del rsync. Restaurar con `git checkout <commit> -- public/img/<slug>`.

## Pendientes

- Correos de notificación por marca (los entrega el cliente) → sumar a `LEADS_NOTIFY_EMAIL`.
- Dominios custom de las landings (hoy en staging `puck.believe-global.com/s/<slug>`).
