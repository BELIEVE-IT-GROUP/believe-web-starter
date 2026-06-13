# PRD · BLUEPRINT — Fase 2: Fábrica de Webs Believe (automatizada, multi-marca)

**Producto:** Believe Web Factory · **Metodología:** BAAS™ (Architect → Discover → Plan → Build → Review → QA → Ship)
**Fecha:** 2026-06-13 · **Autor:** Claude (Opus 4.8) para Jorge / Believe
**Estado:** Architect completo · Decompose listo · **ejecutable en sesión nueva**
**Pre-requisito:** Fase 1 LIVE (`project_believe_web_factory` en memoria · `docs/PRD-LANDINGS-PRODUCCION.md` · `docs/RUNBOOK-NUEVO-CLIENTE.md`)

---

## PARTE I — PRD

### 1. Problema

Hoy crear una web de cliente es manual: clonar/parametrizar el starter, escribir contenido en el CMS, deployar, configurar leads. Y solo se renderizan **15 de las 351 variantes** Flowbite Pro compradas (el CMS ya tiene el campo `templateId` con 356 templates registrados, pero el frontend dibuja una sola versión por tipo). El activo está al ~4% de su valor y el flujo no escala a "producción en serie".

### 2. Objetivo

Que Jorge diga *"creá una web para [marca]"* y el sistema, en una sola sesión conversacional:
1. Cargue el **DNA de la marca** desde Maasy (o entreviste si no existe).
2. Pregunte lo que falta (objetivo, estructura, páginas, CTAs).
3. Componga la web eligiendo entre las **351 variantes** Flowbite, aplicando la **identidad real de esa marca** (colores + fuentes + tono).
4. Decida el **backend de leads** (cliente Maasy → CRM Maasy; si no → Appwrite en su CMS) y el email (useSend/Plunk).
5. **Deploye en Coolify** y deje la web **administrable** desde el CMS.
6. Sin que Jorge habilite un solo acceso a mano.

### 3. Usuarios

- **Jorge / equipo Believe** (operador): dispara y supervisa.
- **Cliente / tenant**: edita su contenido en `cms.believe-global.com/admin`.
- **Agentes** (ejecutores): Architect, Orchestrator, Implementers (multimodelo), Reviewer, QA.

### 4. Métricas de éxito (Definition of Done del producto)

- "Creá web para [marca]" → **URL viva administrable con la identidad de esa marca** en < 30 min, sin intervención manual de infra.
- **351/351** variantes renderizables (el `templateId` del CMS dibuja la variante correcta).
- Un lead enviado desde el form llega al destino correcto (CRM Maasy o Appwrite) **verificado E2E**.
- El skill + MCP **instalables como plugin** por cualquiera del equipo.

### 5. Decisiones cerradas (Clarify R1)

| Decisión | Valor |
|---|---|
| Alcance bloques | **351 completas** (marketing + ecommerce + application + publisher) |
| Theming | **DNA completo por tenant** (colores + fuentes + tono desde `maasy_get_brand_dna`) |
| Storage leads | **Condicional**: cliente Maasy → CRM Maasy; si no → Appwrite (leads en su CMS) |
| Email | Por web: useSend / Plunk (rama del skill en runtime) |
| Empaque | **Plugin Claude Code `believe-web`** = skill + MCP `believe-cms` |
| Deploy | Un repo `believe-web-starter`, N deploys parametrizados (TENANT_ID + dominio + theme dinámico) |

### 6. Fuera de alcance (Fase 2)

- Editor visual drag-and-drop (el CMS Payload ya da el admin).
- Multi-idioma (Fase 3).
- A/B testing de variantes (Fase 3).
- Generación de copy con IA dentro del CMS (se puede sumar vía Maasy en Fase 3).

---

## PARTE II — BLUEPRINT (arquitectura)

### 7. Arquitectura (3 capas + plugin)

```
PLUGIN believe-web (instalable por el equipo)
│
├─ SKILL /believe-web ............ CEREBRO (conversacional, Opus)
│     entrevista → DNA Maasy → estructura → diseño(351) → backend → deploy → verify
│
├─ MCP believe-cms ............... MANOS (acciones contra sistemas)
│     cms_create_tenant · cms_list_block_templates · cms_create_page · cms_seed_content
│     cms_set_theme_from_dna · cms_deploy · cms_provision_leads
│
└─ LIBRERÍA 351 bloques .......... ACTIVO (en believe-web-starter)
      src/components/flowbite/<categoria>/<seccion>/<variante>.tsx
      + registry templateId→componente  + theming dinámico (DNA→CSS vars)
```

### 8. Data flow ("creá web para Trust")

```
Jorge ──"creá web para Trust"──▶ SKILL /believe-web
  │
  ├─▶ Maasy MCP: maasy_list_brands → ¿Trust existe?
  │     sí → maasy_get_brand_dna(Trust)  { colors, fonts, tone, positioning }
  │     no → entrevista breve (AskUserQuestion)
  │
  ├─▶ AskUserQuestion: objetivo (leads/venta/autoridad/booking), páginas, secciones, CTAs
  │
  ├─▶ Composición: mapea estructura → templateIds (de las 351) + skills diseño (ui-ux-pro-max/impeccable)
  │
  ├─▶ MCP believe-cms:
  │     cms_create_tenant(trust) → cms_set_theme_from_dna(trust, dna)
  │     cms_create_page(trust, home, [bloques con templateId])
  │     cms_provision_leads(trust)  → Maasy CRM (es cliente) | Appwrite (no)
  │     cms_deploy(trust)           → Coolify Hetzner, dominio, env
  │
  └─▶ verify: screenshot + curl 200 + lead de prueba E2E
```

### 9. Theming dinámico (pieza foundational)

El frontend NO hardcodea colores. Lee `settings.theme` del tenant (poblado desde el DNA de Maasy) y lo inyecta como CSS custom properties por request:

```
:root {
  --brand-primary: <dna.colors.primary>;
  --brand-ink:     <dna.colors.ink ?? #1a1a1a>;
  --brand-paper:   <dna.colors.paper ?? #fafaf7>;
  --brand-signal:  <dna.colors.accent>;
  --font-display:  <dna.fonts.display ?? Fraunces>;
  --font-body:     <dna.fonts.body ?? Inter>;
}
```

Tailwind se reconfigura para consumir estos tokens (`bg-[var(--brand-paper)]`, `font-[var(--font-display)]`). Believe es el theme por defecto (fallback). Cada una de las 351 variantes usa tokens, nunca hex fijo.

### 10. Backend de leads condicional

`cms_provision_leads(tenant)`:
1. `maasy_list_brands` → ¿el tenant es cliente Maasy?
2. **Sí** → configura `settings.leads = { sink: 'maasy_crm', endpoint, hmac }`. El form POST `/api/lead` reenvía al CRM Maasy (HMAC firmado).
3. **No** → crea Appwrite collection `leads_<tenant>` (DB en `appwrite.believe-global.com`) + `settings.leads = { sink: 'appwrite', dbId, collectionId, apiKey }`. El form POST `/api/lead` escribe en Appwrite.
4. Email de notificación: useSend (FROM `besend.somosbelieve.com`) o Plunk, según elección del skill.

### 11. Mapa de accesos / infra / keys (autonomía total)

> La sesión nueva corre en el entorno de Jorge y hereda todo. Nada que pedir a mano. Autorizar SSH a prod una vez al inicio.

| Recurso | Acceso | Detalle operativo |
|---|---|---|
| Secrets (78) | `~/.believe/bin/infra <cmd>` | Inyecta env. `INFISICAL_CLIENT_ID/SECRET` en ~/.zshrc. Proyecto `believe-infra`/prod |
| Coolify VPSDime | `$COOLIFY_TOKEN` `$COOLIFY_URL` | CMS app `qijimwqdndh8p21vmh5xvzz5` · DB `ujbs8iuf...` (user `agency_cms_user` db `agency_cms`) |
| Coolify Hetzner | `$COOLIFY_HETZNER_TOKEN` `https://coolify.backends.believe-global.com` | Frontend app `rp5k1vhk9gz81ivi09vrq8g6` · proyecto `believe-landings` `sy6mbsp3b73r6f5k7jq9d6en` · server `o5de31aovlrol4bvhvy9wtk2` · IP `5.78.214.173` |
| SSH | `ssh believe-vps` · `hetzner-believe` · `contabo-believe` | Llaves instaladas. Classifier bloquea writes a prod → autorizar al inicio |
| Maasy MCP | claude.ai Maasy MCP | `maasy_list_brands` · `maasy_get_brand_dna` · `maasy_get_brand_context` · `maasy_get_crm_summary` |
| CMS | `https://cms.believe-global.com` | REST `/api/*` · `/admin`. Bin: `payload bootstrap:settings`/`bootstrap:tenant-content` con `NODE_ENV=development` |
| Appwrite | `https://appwrite.believe-global.com` | Keys `APPWRITE_*` Infisical. v1.8.1 (Hetzner) |
| useSend | `https://besend.believe-global.com` | FROM verificado `besend.somosbelieve.com` (NO @believe-global.com). `USESEND_*` Infisical |
| Plunk | `https://mailing.believe-global.com` | `PLUNK_*` Infisical |
| R2 media | Cloudflare R2 | `R2_*` Infisical, ya en el CMS |
| GitHub | `gh` CLI (auth ok) | Org `BELIEVE-IT-GROUP` · repos `believe-agency-cms`, `believe-web-starter` |
| DNS | Cloudflare | subdominios → `5.78.214.173`. NUNCA GoDaddy |

### 12. Gotchas heredados (no repetir — de Fase 1)

- Scripts del CMS: usar `payload bootstrap:*` (bin del config), **no** `payload run scripts/...` (no ejecuta nada).
- Schema push solo con `NODE_ENV=development` dentro del container (`next start` lo desactiva en prod).
- Frontend builds en **Hetzner** (VPSDime tiene load crónico 29-37 → `spawn EAGAIN`). `experimental.cpus:1` en next.config.
- Filtro de tenant por `NEXT_PUBLIC_TENANT_ID` (numérico); `tenant.slug` no está habilitado en el CMS.
- Coolify **restart NO recrea** el container con env nueva → **redeploy**.
- `postcss.config.js` obligatorio o Tailwind no corre. `public/` debe existir (COPY del Dockerfile).

---

## PARTE III — DECOMPOSE (épicas + issues)

> Cada issue es autónomo. Convención BAAS: declara **Deps** y **Phase** (setup/foundational/story/ship). `foundational` bloquea todo step posterior no-foundational. **Modelo por complejidad** (ahorro de tokens): Haiku (mecánico) · Sonnet (edición con contrato) · Opus (arquitectura/razonamiento/audit). Constitution gate por issue (brain-first · traceability · surgical · las 4). Verificación con evidencia: nada "listo" sin build verde / screenshot / E2E.

### ÉPICA A — Librería de los 351 bloques + theming (Fase 2.1)

---

**[A1] Extraer catálogo de los 351 bloques**
- Épica: A · Phase: setup · Deps: Ninguna · Complejidad: 2 · Modelo: **Haiku**
- Objetivo: inventario máquina-legible de las 351 variantes Flowbite Pro.
- Archivos: `believe-web-starter/scripts/extract-flowbite-catalog.mjs` (nuevo), `believe-web-starter/src/flowbite/catalog.generated.json` (nuevo). Fuente: `believe-cms-multitenant/flowbite-react-blocks-1.8.0-beta/app/**`.
- Implementación: recorrer `app/<categoria>/<seccion>/*.tsx`; por cada archivo extraer { category, section, variantId, filePath, hasDarkMode, propsShape (inferida de la firma/JSX) }. Normalizar IDs (`hero-01`, `pricing-table-03`).
- Contrato: `catalog.generated.json` con **351 entries**, cada una resuelve a un .tsx existente; schema validado.
- Test/evidencia: script `validate-catalog.mjs` confirma count=351 y que cada `filePath` existe.

**[A2] Sistema de theming dinámico (DNA → CSS vars)**
- Épica: A · Phase: **foundational** · Deps: Ninguna · Complejidad: 4 · Modelo: **Opus**
- Objetivo: que el frontend renderice con la identidad de cada tenant desde `settings.theme`.
- Archivos: `src/lib/theme.ts` (nuevo), `src/app/layout.tsx` (inyección `:root`), `tailwind.config.ts` (tokens `var(--brand-*)`), `src/app/globals.css`. CMS: extender `settings.theme` con `fonts` y `tone` (collection `Settings.ts` en believe-agency-cms).
- Implementación: `getThemeVars(settings)` → objeto CSS vars con fallbacks Believe; inyectar en `<html style>` SSR; mapear fuentes (next/font dinámico o link a Google Fonts por nombre); Tailwind tokens `--brand-primary/ink/paper/signal`, `--font-display/body`.
- Contrato: dos tenants con DNA distinto (ej. Believe azul/Fraunces vs Trust con otra paleta/fuente) renderizan con identidades visiblemente distintas.
- Test/evidencia: screenshot tenant A vs B lado a lado; build verde; typecheck.

**[A3] Registry templateId → componente + contrato de props**
- Épica: A · Phase: **foundational** · Deps: A1 · Complejidad: 4 · Modelo: **Opus**
- Objetivo: resolver cualquier `templateId` del CMS al componente React correcto, con props uniformes.
- Archivos: `src/flowbite/registry.ts` (extender), `src/flowbite/types.ts` (contrato de props por blockType), `believe-agency-cms/src/flowbite/registry.ts` (sincronizar opciones de `templateId`).
- Implementación: generar registry desde `catalog.generated.json` (lazy `import()` por variante para code-splitting); definir contrato de props normalizado por tipo de sección (Hero, Pricing, etc.) y un adapter CMS-data→props por variante.
- Contrato: registry cubre las 351; `resolveTemplate(templateId)` devuelve componente + adapter; typecheck verde.
- Test/evidencia: unit test resolución para muestra de 30 templateIds (incluye 1 por categoría).

**[A4] BlockRenderer extendido (routing por templateId)**
- Épica: A · Phase: **foundational** · Deps: A3 · Complejidad: 3 · Modelo: **Sonnet**
- Objetivo: el renderer dibuja la variante elegida en el CMS, no una fija por tipo.
- Archivos: `src/components/blocks/BlockRenderer.tsx`.
- Implementación: por cada bloque del CMS, leer `block.templateId`, `resolveTemplate`, aplicar adapter de props + `appearance`. Fallback al componente legacy si `templateId` ausente.
- Contrato: una página con bloques de distintos templateIds renderiza cada uno correcto; sin romper las páginas Fase 1 existentes.
- Test/evidencia: build + render de la home believe (regresión) + una página con 3 variantes nuevas.

**[A5] Mapear marketing-ui · lote 1 (hero, feature, pricing, cta)**
- Épica: A · Phase: story · Deps: A4 · Complejidad: 3 · Modelo: **Sonnet** (subagentes paralelos)
- Objetivo: convertir ~45 variantes a componentes parametrizados por CMS + tokens de theme.
- Archivos: `src/components/flowbite/marketing-ui/{hero-sections,feature-sections,pricing-tables,cta-sections}/*.tsx`.
- Implementación: por variante, portar el JSX de Flowbite Pro reemplazando datos estáticos por props del CMS y colores por tokens `var(--brand-*)`; respetar light/dark; sin colores hardcodeados.
- Contrato: cada variante usa tokens + props del CMS; typecheck verde; renderiza en el showcase.
- Test/evidencia: build + smoke visual del lote.

**[A6] Mapear marketing-ui · lote 2 (testimonials, faq, team, blog, content)** — igual patrón que A5, ~40 variantes · Sonnet · Deps: A4
**[A7] Mapear marketing-ui · lote 3 (headers, footers, banners, customer-logos, newsletter, contact, social-proof, stats)** — ~40 variantes · Sonnet · Deps: A4
**[A8] Mapear marketing-ui · lote 4 (login, register, recovery, onboarding, popups, cookie, 404, 500, maintenance, portfolio, event)** — ~40 variantes · Sonnet · Deps: A4
**[A9] Mapear ecommerce-ui (navbars, categories, cart, order-summary, orders, refund, discount, customer-service)** — ~50 variantes · Sonnet · Deps: A4
**[A10] Mapear application-ui · lote 1 (las más usables en webs: stats, CRUD-lite, settings)** — ~45 variantes · Sonnet · Deps: A4
**[A11] Mapear application-ui · lote 2 (resto)** — ~45 variantes · Sonnet/Haiku · Deps: A4
**[A12] Mapear publisher-ui (blog-templates, related-articles, comments)** — ~30 variantes · Sonnet · Deps: A4

> A5–A12 son **paralelizables** (archivos disjuntos). Contrato idéntico. Cada lote reporta variantes portadas + cualquiera que requiera lógica especial (forms, carruseles → marcar 'use client').

**[A13] Audit adversarial + visual regression de los 351**
- Épica: A · Phase: story · Deps: A5..A12 · Complejidad: 3 · Modelo: **Opus** (auditor, fan-out)
- Objetivo: garantizar fidelidad, responsive, dark mode, props vacías, accesibilidad, consumo de tokens.
- Implementación: subagentes auditor por categoría; cada uno revisa contra checklist y corrige findings reales.
- Contrato: reporte por categoría; cero colores hardcodeados; cero crashes con props vacías.
- Test/evidencia: screenshots por categoría; build verde global.

**[A14] Showcase `/catalog` (galería navegable de los 351)**
- Épica: A · Phase: story · Deps: A4 · Complejidad: 2 · Modelo: **Sonnet**
- Objetivo: página interna que lista las 351 variantes con su `templateId` (referencia para el skill y para Jorge).
- Archivos: `src/app/catalog/page.tsx`.
- Contrato: renderiza las 351 agrupadas por categoría con su id; sirve de fuente de verdad visual.
- Test/evidencia: HTTP 200, count visible = 351.

### ÉPICA B — MCP believe-cms (Fase 2.2)

**[B1] Scaffold MCP server + auth Infisical**
- Épica: B · Phase: setup · Deps: A3 · Complejidad: 3 · Modelo: **Sonnet**
- Objetivo: servidor MCP base con credenciales server-injected.
- Archivos: nuevo repo/paquete `believe-cms-mcp/` (TS, @modelcontextprotocol/sdk). `src/index.ts`, `src/auth.ts` (lee secrets vía Infisical), `manifest`.
- Implementación: server stdio; auth a CMS REST + Coolify API leyendo de `~/.believe/bin/infra`; tools declaradas (stubs).
- Contrato: `mcp list-tools` muestra las 7 tools; arranca sin secrets en repo.
- Test/evidencia: smoke `list-tools`.

**[B2] Tools de contenido (tenant · page · blocks · seed)**
- Épica: B · Phase: **foundational** · Deps: B1 · Complejidad: 4 · Modelo: **Opus**
- Tools: `cms_create_tenant(slug,name)`, `cms_list_block_templates(blockType)` (de `catalog.generated.json`), `cms_create_page(tenant,slug,blocks[])`, `cms_seed_content(tenant,structure)`.
- Implementación: cada tool ejecuta contra el CMS (REST autenticado + bin con `NODE_ENV=development` vía SSH cuando haga falta schema). Reemplaza el flujo SSH manual del runbook.
- Contrato: crear un tenant de prueba + página con bloques, E2E, vía MCP; idempotente.
- Test/evidencia: integración crea+lee+rollback tenant `mcp-test`.

**[B3] Tool `cms_set_theme_from_dna`**
- Épica: B · Phase: story · Deps: B2, A2 · Complejidad: 3 · Modelo: **Sonnet**
- Objetivo: poblar `settings.theme` de un tenant desde un objeto DNA.
- Contrato: dado un DNA (colors/fonts/tone), el tenant queda con su theme; el frontend lo refleja.
- Test/evidencia: aplicar DNA dummy → screenshot con esa identidad.

**[B4] Tool `cms_deploy` (Coolify)**
- Épica: B · Phase: story · Deps: B2 · Complejidad: 3 · Modelo: **Sonnet**
- Objetivo: crear app Coolify (Hetzner) del frontend para un tenant + env + dominio + deploy.
- Implementación: envuelve la API de Coolify (el runbook de Fase 1) en una tool.
- Contrato: `cms_deploy(tenant, domain?)` → app creada, env (TENANT_ID, secrets), build, HTTP 200.
- Test/evidencia: deploy de prueba con tenant `mcp-test` → URL viva.

**[B5] Tool `cms_provision_leads` (condicional Maasy/Appwrite)**
- Épica: B · Phase: story · Deps: B2 · Complejidad: 4 · Modelo: **Opus**
- Objetivo: configurar el destino de leads según si la marca es cliente Maasy.
- Implementación: `maasy_list_brands` → sí: configura sink CRM Maasy (endpoint+HMAC en settings.leads); no: crea Appwrite collection + apikey, sink Appwrite. Configura email (useSend/Plunk).
- Contrato: tras provision, un POST `/api/lead` del frontend llega al destino correcto.
- Test/evidencia: lead de prueba E2E a CRM Maasy (marca cliente) y a Appwrite (marca no-cliente).

**[B6] Tests de integración del MCP**
- Épica: B · Phase: story · Deps: B2..B5 · Complejidad: 2 · Modelo: **Sonnet**
- Contrato: suite que ejercita las 7 tools contra un tenant efímero y limpia.
- Test/evidencia: suite verde en CI local.

### ÉPICA C — Skill /believe-web + plugin (Fase 2.3)

**[C1] Esqueleto del skill + carga de DNA / entrevista**
- Épica: C · Phase: **foundational** · Deps: B2 · Complejidad: 4 · Modelo: **Opus**
- Objetivo: el skill toma la marca, carga DNA (Maasy) o entrevista, y produce un brief estructurado.
- Archivos: `~/.claude/skills/believe-web/SKILL.md` + helpers.
- Implementación: paso 1 `maasy_list_brands`/`maasy_get_brand_dna`; paso 2 `AskUserQuestion` de objetivo/estructura/páginas/CTAs; salida = `brief.json`.
- Contrato: corre la entrevista y emite un brief válido (marca, dna, objetivo, páginas, secciones).
- Test/evidencia: dry-run con una marca real de Maasy → brief.

**[C2] Composición: estructura → bloques + diseño pro**
- Épica: C · Phase: story · Deps: C1, A14 · Complejidad: 4 · Modelo: **Opus**
- Objetivo: del brief, elegir las variantes (de las 351 vía `cms_list_block_templates`) por sección e invocar skills de diseño (`ui-ux-pro-max`, `impeccable`, `frontend`) para calidad y coherencia con el DNA.
- Contrato: brief → plan de página(s) con `templateId` por bloque + contenido inicial.
- Test/evidencia: plan revisado contra el DNA (paleta/tono coherentes).

**[C3] Orquestación E2E: backend + deploy + verify**
- Épica: C · Phase: story · Deps: C2, B3, B4, B5 · Complejidad: 4 · Modelo: **Opus**
- Objetivo: ejecutar el plan: crear tenant+theme+páginas (MCP), provisionar leads, deployar, verificar.
- Contrato: "creá web para [marca]" → URL viva administrable con identidad de la marca + lead E2E ok.
- Test/evidencia: corrida real con una marca de Maasy de principio a fin (screenshot + lead).

**[C4] Plugin `believe-web` + docs + registro equipo**
- Épica: C · Phase: **ship** · Deps: C3 · Complejidad: 2 · Modelo: **Sonnet**
- Objetivo: empaquetar skill + MCP como plugin instalable.
- Archivos: `believe-web-plugin/` (plugin.json, skill, mcp config), README, guía de instalación.
- Contrato: instalación limpia en sesión nueva + smoke "creá web demo".
- Test/evidencia: instalar + correr en entorno limpio.

---

## PARTE IV — EJECUCIÓN

### 13. Grafo de build order

```
setup/foundational (secuencial, Opus):
  A1 ─┐
      ├─▶ A3 ─▶ A4 ──▶ [A5..A12 paralelo, Sonnet] ─▶ A13 (audit, Opus)
  A2 ─┘                         └─▶ A14 (showcase)
A3 ─▶ B1 ─▶ B2 ─┬─▶ B3, B4, B5 ─▶ B6
                │
                └─▶ C1 ─▶ C2 ─▶ C3 ─▶ C4 (ship)
A2 ─▶ B3 (theme tool necesita theming)
```
Regla: foundational (A2, A3, A4, B2, C1) bloquea sus stories. A5–A12 y A13 son los grandes fan-outs.

### 14. Harness de orquestación

- **Worktree por issue** (BAAS regla 2). Sin push a main; PRs por Review.
- **Constitution gate** por issue afirmado antes de editar (brain-first · traceability · surgical · las 4).
- **Audit gate por fase**: no se avanza sin evidencia verde.
- **Multimodelo**: Haiku (A1, A11-parcial) · Sonnet (A4–A12, B1/B3/B4/B6, C4) · Opus (A2/A3/A13, B2/B5, C1/C2/C3).
- **Fan-out**: A5–A12 (mapeo) y A13 (audit) con subagentes en paralelo (workflow). Resto secuencial por deps.
- **Prompt caching** en cada call. **cost-cap-check** activo.

### 15. Estrategia de QA

- Unit: registry (A3), adapters de props.
- Integración: MCP tools (B6), provision_leads (B5).
- Visual: regresión por categoría (A13), showcase (A14).
- E2E: la corrida completa del skill (C3) con una marca real.
- Regresión Fase 1: la home believe sigue viva tras A4.

### 16. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Portar 351 variantes es caro | Multimodelo (Haiku/Sonnet), fan-out paralelo, lotes por categoría; A14 showcase para detectar gaps temprano |
| Variantes con JS (carruseles, tabs) | Marcar `'use client'`; el contrato del lote lo exige; auditor (A13) lo verifica |
| DNA de Maasy incompleto (sin fuentes) | Fallbacks Believe en theming (A2); el skill entrevista lo faltante |
| Coolify/VPSDime build frágil | Frontend en Hetzner; `cpus:1`; lección Fase 1 documentada |
| Costo total | cost-cap-check; empezar por A1–A4 + un lote (A5) para validar el patrón antes del resto |

### 17. Arranque de la sesión nueva limpia

```
Directorio: /Users/mac/Developer/believe-web-starter (el MCP y el skill se crean en sus rutas)
Leer: docs/BLUEPRINT-FASE2.md (este) + memoria project_believe_web_factory + docs/PRD-LANDINGS-PRODUCCION.md + docs/RUNBOOK-NUEVO-CLIENTE.md
Autorizar al inicio: SSH believe-vps + Coolify (una vez).
Orden: A1 → A2/A3 → A4 → (validar con A5 + A14) → A6..A12 paralelo → A13 → B → C.
Modo: BAAS, multiorquestado, multimodelo, verificación con evidencia.
```

Prompt para abrir la sesión:
> "Ejecutá la Fase 2 de la fábrica de webs Believe siguiendo `docs/BLUEPRINT-FASE2.md`, modo BAAS multiorquestado. Empezá por la Épica A (A1→A4), validá el patrón con A5+A14 antes de paralelizar A6..A12. Autorizo Coolify y SSH a prod."

---

*Believe Tech · Sistema sobre proyecto. Dato sobre opinión. Calma sobre euforia.*
