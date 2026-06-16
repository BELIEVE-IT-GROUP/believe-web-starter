# PRD — Custom Sections Engine (Believe Web Factory)

> Motor de secciones custom de clase mundial, editables desde Payload CMS, sin Flowbite.
> Mantiene el flujo Flowbite manual intacto en paralelo.
> Autor/director: Opus. Ejecución: workflow orquestado, agentes con contrato, modelos por complejidad.
> Fecha: 2026-06-16.

---

## 1. Contexto y problema

La fábrica actual (`/believe-web` + MCP `believe-cms` + 133 variantes Flowbite) tiene un techo de calidad:
los bloques Flowbite cambian colores via CSS vars pero NO estructura ni jerarquía. El resultado se ve genérico,
no se ve "de la marca". El test del `trust-demo` (Next.js custom escrito a mano con DNA real de Trust) lo confirmó:
Jorge lo aprobó ("ya parece de trust").

Jorge pide dos cosas que conviven:

1. **Mantener Flowbite** para creación manual humana (con fidelidad de marca 100% via CSS vars).
2. **Nuevo flujo custom**: el skill/MCP deja de componer con bloques Flowbite y pasa a usar **componentes custom
   de clase mundial** (ui-ux-pro-max + impeccable + frontend skill), editables item por item desde el CMS.

Pregunta de arquitectura ya resuelta: **¿cómo se mapea el diseño custom en el CMS?**
Respuesta: el CMS ya separa **datos** (`blocks[]` con campos) de **presentación** (componente por `blockType`).
No se reinventa el data model. Se agrega una **capa de componentes custom** que el dispatcher elige cuando el
`templateId` es `*.custom`. Cada campo de texto/array sigue viviendo en Payload y siendo editable.

---

## 2. Arquitectura

### 2.1 Estado actual (verificado)

- **Frontend** (`believe-web-starter`, este worktree): `src/components/blocks/` (15 componentes Flowbite),
  dispatcher `src/components/blocks/BlockRenderer.tsx` (routing 3 niveles), registry
  `src/components/flowbite-pro/registry.ts` (`byBlockType` + 123 alias).
- **Theming**: `src/lib/theme.ts` → `getThemeVars(settings)` (35-48 CSS vars) inyectado en `src/app/layout.tsx`
  `<head>` como `<style>` unlayered (gana sobre `@layer base` de `globals.css`). Fuentes del tenant via
  `getGoogleFontsHref` (`<link>` a Google Fonts).
- **Multitenancy**: build-time, un deploy por tenant via `NEXT_PUBLIC_TENANT_ID/SLUG`. ISR 60s.
- **CMS** (`believe-cms-multitenant`, repo aparte): Payload v3, collections Pages/Settings/Tenants/Posts.
  Pages tiene campo `blocks` (15 block configs en `src/blocks/*.ts`). Cada block: `templateId` (select req) +
  `appearance` (group) + campos propios. Auth REST: `POST /api/users/login` → JWT Bearer.
- **MCP** (`believe-cms-mcp`, dentro de este worktree): 7 tools. `cms_seed_content`/`cms_create_page` validan
  blocks contra catálogo (`flowbite-catalog.json`, 133 templates) pero **preservan campos extra verbatim**
  (`_blocks.ts`). Auth super-admin cacheada.
- **Tooling**: Next 14.2.5, React 18.3.1, Tailwind 3.4.7. **Sin tests** (no jest/vitest/playwright).

### 2.2 Diseño objetivo

```
CMS page.blocks[]  →  BlockRenderer  →  ┌ templateId *.custom  → CUSTOM SECTION (clase mundial, sin Flowbite)
                                        ├ templateId ported    → Flowbite ported (manual)
                                        ├ blockType legacy      → componente Fase 1
                                        └ templateId Flowbite   → variante cruda (último recurso)
```

- **Nueva capa**: `src/components/sections/` — componentes custom theme-aware, sin Flowbite.
- **Discriminador**: `templateId = "<blockType>.custom"`. Sub-layouts via campo `variant`.
- **Nuevo registry**: `src/components/sections/registry.ts` → `customByTemplateId` + `resolveCustomSection`.
- **Wire**: `BlockRenderer` gana un **nivel 0**: si `resolveCustomSection(templateId)` existe → render custom.
  Los 3 niveles Flowbite quedan intactos abajo. Flowbite manual NO se toca.
- **Schema Payload**: a cada block se agrega la opción `<blockType>.custom` en `templateId` + campos opcionales
  que los custom aprovechan. Campos OPCIONALES → no rompe Flowbite ni datos existentes. + 2 blocks nuevos: `pain`, `steps`.
- **MCP**: catálogo gana las ~19 entradas `*.custom`. `cms_seed_content` ya sirve (preserva campos extra).
- **Fuentes**: fix en `getGoogleFontsHref` para pesos completos (incluir 800/900) — Syne 800 hoy no carga.

### 2.3 Anti-conflicto (clave para el run paralelo)

La Fase 1 crea TODO el scaffolding de una vez: `registry.ts` con los 19 imports/mappings + **19 archivos stub**
(`export function XSection(){ return <Section>…stub…</Section> }`) + primitives + contrato + wire + showcase.
**Build verde desde el inicio.** Cada agente de Fase 2 **reemplaza el body de SU stub** (1 archivo), no toca
`registry.ts` ni el showcase. Cero edición concurrente del mismo archivo. Si un componente falla, queda su stub
y el build no rompe.

---

## 3. Contrato de componente (todos los agentes lo cumplen)

Cada Custom Section DEBE:

1. Vivir en la ruta EXACTA y exportar el nombre EXACTO de la tabla §5 (el registry ya lo importa así).
2. Props = mapeo 1:1 de los campos del block en el CMS, tipados con una `interface` propia.
3. **Cero** imports de `flowbite`, `flowbite-react`, `@/flowbite/*`, `@/components/blocks/*`, `@/components/flowbite-pro/*`.
4. **Cero** colores hex hardcodeados salvo como fallback dentro de `var(--token, #fallback)`.
5. Usa tokens del theme: `var(--color-primary)`, `var(--font-display)`, `var(--radius-*)`, `var(--shadow-*)`,
   `var(--section-padding-y)`, etc. Texto display con `var(--font-display)`, cuerpo con `var(--font-body)`.
6. Responsive mobile-first (breakpoints Tailwind). Legible en 360px y 1440px.
7. a11y: headings jerárquicos (un solo h1 por página lo pone el hero), `alt` en imgs, `label` en inputs,
   estados `:focus-visible` visibles, contraste AA.
8. Respeta design laws de impeccable: **prohibido** side-stripe borders (>1px lateral de color), gradient text
   (`background-clip:text`), glassmorphism decorativo por defecto, el cliché hero-metric genérico, grids de cards
   idénticas repetidas, modal como primera opción. **Sin em dashes** en copy ni en JSX.
9. Server Component por defecto. `'use client'` SOLO si hay interacción (forms, acordeón, tabs, lightbox, carousel,
   mobile menu). Si es client, separar la parte interactiva en un sub-archivo `*.client.tsx` cuando aplique.
10. Acepta `appearance?: BlockAppearance` y lo respeta donde tenga sentido (usar helpers de `appearance.ts` o
    equivalentes propios sin importar Flowbite).
11. Maneja campos vacíos/ausentes con gracia (sin romper si falta una imagen, un array, un CTA).
12. Copy de los mocks en español neutro, alineado al tono de marca. Sin inventar métricas en el componente
    (los datos vienen por props).

Referencia de calidad: `src/app/trust-demo/page.tsx` (ya aprobado por Jorge). Mismo nivel de craft.

---

## 4. Cambios de schema (Payload — `believe-cms-multitenant`)

Todos los campos nuevos son **opcionales**. A cada block existente se agrega `<blockType>.custom` en el select
`templateId`. Campos nuevos por block:

- **Hero**: `eyebrow` (text), `stats` (array `{value, label}`, max 4). [ya tiene badge, ctas, variant, image, videoUrl]
- **Features**: `eyebrow` (text); en `items[]` agregar `code` (text, opcional, para layout "pilares").
- **Cta**: `eyebrow` (text), `formEnabled` (checkbox), `formFields` (array `{fieldName,label,type,required,placeholder}`),
  `formDestinationEmail` (email).
- **Stats**: `eyebrow` (text); en `items[]` agregar `icon` (text, opcional).
- **Testimonials**: en `items[]` agregar `metric` (text, opcional, para variant single con dato).
- **SplitContent**: `eyebrow` (text), `ctas` (array, reemplaza cta único cuando custom).
- **Otros** (logo-cloud, gallery, team, faq, video-embed, newsletter, blog-list, pricing, contact): agregar solo
  `<blockType>.custom` al select; los campos actuales bastan.
- **NUEVO block `pain`** (`src/blocks/Pain.ts`): `eyebrow`, `headline`, `subheadline`, `variant` (cards|statement),
  `cards` (array `{title, description, data}`). Registrar en Pages.
- **NUEVO block `steps`** (`src/blocks/Steps.ts`): `eyebrow`, `headline`, `subheadline`, `variant` (linear|vertical|grid),
  `items` (array `{number, title, description}`). Registrar en Pages.

Nota: el push de schema en este Payload requiere `PAYLOAD_DB_PUSH !== 'false'` (auto-push). No correr migraciones
destructivas. Solo agregar.

---

## 5. Decompose — issues y asignación de modelos

Modelo por complejidad: **opus** = layout multi-variante, lógica, forms, interacción rica; **sonnet** = secciones
de presentación acotadas.

| # | Issue | templateId | blockType | Archivo (export) | Modelo | Compl. |
|---|---|---|---|---|---|---|
| F1 | Scaffolding + contrato + primitives + registry + 19 stubs + wire + showcase + fix fuentes + HeroSection real (referencia) | — | — | `sections/*` | **opus** | alta |
| C1 | SiteHeader (logo, nav, CTA, sticky, mobile menu) | — (Settings.header) | — | `SiteHeader.tsx` (SiteHeader) | opus | alta |
| C2 | SiteFooter (cols, social, legal) | — (Settings.footer) | — | `SiteFooter.tsx` (SiteFooter) | sonnet | media |
| C3 | FeatureGrid (variants grid/pillars/alternating) | features.custom | features | `FeatureGrid.tsx` (FeatureGrid) | opus | alta |
| C4 | MetricsPanel | stats.custom | stats | `MetricsPanel.tsx` (MetricsPanel) | sonnet | media |
| C5 | SocialProof (variants single/grid) | testimonials.custom | testimonials | `SocialProof.tsx` (SocialProof) | sonnet | media |
| C6 | LeadCTA (variants banner/form) | cta.custom | cta | `LeadCTA.tsx` (LeadCTA) | opus | alta |
| C7 | FaqAccordion (client) | faq.custom | faq | `FaqAccordion.tsx` (FaqAccordion) | sonnet | media |
| C8 | LogoBar | logo-cloud.custom | logo-cloud | `LogoBar.tsx` (LogoBar) | sonnet | baja |
| C9 | ContentSplit | split-content.custom | split-content | `ContentSplit.tsx` (ContentSplit) | sonnet | media |
| C10 | PricingTable (toggle mensual/anual, client) | pricing.custom | pricing | `PricingTable.tsx` (PricingTable) | opus | alta |
| C11 | TeamGrid | team.custom | team | `TeamGrid.tsx` (TeamGrid) | sonnet | media |
| C12 | ContactSection (form configurable, client) | contact.custom | contact | `ContactSection.tsx` (ContactSection) | opus | alta |
| C13 | GalleryGrid (lightbox, client) | gallery.custom | gallery | `GalleryGrid.tsx` (GalleryGrid) | sonnet | media |
| C14 | VideoSection | video-embed.custom | video-embed | `VideoSection.tsx` (VideoSection) | sonnet | baja |
| C15 | NewsletterBar | newsletter.custom | newsletter | `NewsletterBar.tsx` (NewsletterBar) | sonnet | baja |
| C16 | BlogPreview | blog-list.custom | blog-list | `BlogPreview.tsx` (BlogPreview) | sonnet | media |
| C17 | PainSection (variants cards/statement) | pain.custom | pain | `PainSection.tsx` (PainSection) | opus | alta |
| C18 | StepsSection (variants linear/vertical/grid) | steps.custom | steps | `StepsSection.tsx` (StepsSection) | sonnet | media |
| B1 | Schema Payload (campos + 2 blocks nuevos + opciones .custom) | — | — | `believe-cms-multitenant/src/blocks/*`, `Pages.ts` | opus | alta |
| B2 | Catálogo MCP custom + verificación seed | — | — | `believe-cms-mcp/src/flowbite-catalog.json` | sonnet | baja |

(HeroSection lo implementa F1 como referencia; los 18 C* son los restantes.)

---

## 6. Gates de calidad

- **Gate 0 — PRD** (este documento): arquitectura + contrato + decompose. Director: Opus.
- **Gate 1 — Scaffolding** (post F1): `npm run typecheck` verde con los 19 stubs + showcase. Si rojo, F1 se corrige
  antes de abrir Fase 2.
- **Gate 2 — Por componente** (auditor, cada entrega): el auditor (sonnet) verifica el **contrato §3** punto por punto
  sobre el archivo entregado. Veredicto estructurado `{passes, violations[], severity}`. Si falla con severidad
  alta → 1 loop de fix (mismo modelo). Segundo fallo → se deja el stub y se reporta.
- **Gate 3 — Build** (post Fase 2): `npm run typecheck && npm run build` verde. Errores → fixer (opus) los resuelve.
- **Gate 4 — E2E funcional** (post build): `next dev` levanta, el showcase responde 200 y el HTML contiene los
  marcadores de los 19 componentes (render real, no stub). Reporte.
- **Gate 5 — Auditoría visual** (Jorge + Opus, post-run): screenshots del showcase, evaluados contra design laws +
  identidad de marca. (Lo ejecuta el main loop con `/browse`, no el workflow background.)

---

## 7. Plan E2E

1. **Compila** (`next build`) — prueba de integración de los 19 + registry + wire.
2. **Renderiza** — `/sections-preview` responde 200 con los 19 componentes reales y datos mock estilo Trust.
3. **CMS editable** — verificación con MCP en `dryRun`: un `cms_seed_content` con `templateId:"hero.custom"` +
   campos custom valida OK contra el catálogo extendido. (El deploy real a CMS prod lo dispara Jorge, no el run.)
4. **Visual** — screenshots del showcase (main loop, `/browse`) para confirmar craft de marca.

---

## 8. Fuera de alcance (este run)

- Deploy real a Coolify / CMS prod (lo dispara Jorge con supervisión).
- Migración de tenants Flowbite existentes a custom (opt-in posterior).
- Nuevo tool MCP dedicado `cms_seed_custom_page` (el `cms_seed_content` actual basta; se evaluará después).
- Tests unitarios por componente (el repo no tiene runner; se monta en sprint aparte si se decide).
