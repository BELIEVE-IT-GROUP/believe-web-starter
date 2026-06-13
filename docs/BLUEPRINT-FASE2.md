# BLUEPRINT — Fase 2: Fábrica de Webs Believe (automatizada, multi-marca)

**Metodología:** BAAS™ (Architect → Discover → Plan → Build → Review → QA → Ship)
**Fecha:** 2026-06-13 · **Autor:** Claude (Opus 4.8) · **Estado:** Architect / listo para ejecutar en sesión nueva
**Pre-requisito:** Fase 1 LIVE (ver `project_believe_web_factory` en memoria + `docs/PRD-LANDINGS-PRODUCCION.md`)

---

## 0. Visión (una línea)

Jorge dice *"creá una web para [marca]"* → Claude carga el DNA de la marca desde Maasy, entrevista lo que falta, compone la web con las 351 variantes Flowbite Pro aplicando la identidad real de esa marca, decide el backend de leads según si es cliente Maasy, la deploya en Coolify y la deja administrable. Sin que Jorge habilite un solo acceso a mano.

## 1. Decisiones de arquitectura (cerradas en Clarify)

| Decisión | Valor | Razón |
|---|---|---|
| Alcance bloques | **351 variantes completas** (marketing + ecommerce + application + publisher) | Máximo activo de lo comprado |
| Theming | **DNA completo por tenant** (colores + fuentes + tono desde `maasy_get_brand_dna`) | Cada cliente con su identidad real |
| Storage leads | **Condicional**: cliente Maasy → CRM Maasy; si no → Appwrite (leads en su CMS) | El lead nace donde vive la marca |
| Email forms | Por web: useSend (besend) o Plunk — rama del skill en runtime | Ya en infra |
| Empaque | **Plugin Claude Code `believe-web`** = skill (cerebro) + MCP `believe-cms` (manos) | Instalable por el equipo |
| Patrón deploy | Un repo `believe-web-starter`, N deploys parametrizados (TENANT_ID + dominio + theme dinámico) | Producción en serie sin clonar código |

## 2. Arquitectura (3 capas + plugin)

```
PLUGIN believe-web (instalable)
├── SKILL /believe-web ........... cerebro: entrevista → DNA → estructura → diseño → backend → deploy → verify
├── MCP believe-cms .............. manos: cms_create_tenant, cms_list_block_templates, cms_create_page,
│                                         cms_seed_content, cms_set_theme_from_dna, cms_deploy, cms_provision_leads
└── librería 351 bloques ......... en believe-web-starter: components/flowbite/<categoria>/<variante>.tsx
                                    + registry templateId→componente + theming dinámico (DNA→CSS vars)
```

**Theming dinámico (foundational):** el frontend lee `settings.theme` del tenant (poblado desde `maasy_get_brand_dna`) y lo inyecta como CSS custom properties en `:root` por request. Tokens: `--brand-primary`, `--brand-ink`, `--brand-paper`, `--brand-signal`, `--font-display`, `--font-body`. Los 351 bloques consumen estos tokens (no colores hardcodeados). Believe es solo el theme por defecto.

**Backend leads condicional (foundational):** `cms_provision_leads(tenant)` detecta vía `maasy_list_brands` si la marca existe en Maasy → configura webhook del form al CRM Maasy; si no → crea Appwrite collection `leads_<tenant>` y apunta el form ahí. El form del frontend hace POST a `/api/lead` que enruta según config del tenant.

## 3. Mapa de accesos / infra / keys (TODO incluido — autonomía total)

> La sesión nueva corre en el entorno de Jorge y hereda estos accesos. Nada que pedir a mano.

| Recurso | Acceso | Detalle |
|---|---|---|
| **Secrets (78)** | `~/.believe/bin/infra <cmd>` | Inyecta env vars. `INFISICAL_CLIENT_ID/SECRET` en ~/.zshrc. Proyecto `believe-infra`/prod. NUNCA pedir tokens. |
| **Coolify VPSDime** | `$COOLIFY_TOKEN` `$COOLIFY_URL` | CMS app `qijimwqdndh8p21vmh5xvzz5`, DB container `ujbs8iuf...` (user `agency_cms_user` db `agency_cms`) |
| **Coolify Hetzner** | `$COOLIFY_HETZNER_TOKEN` `https://coolify.backends.believe-global.com` | Frontend app `rp5k1vhk9gz81ivi09vrq8g6`, proyecto `believe-landings` `sy6mbsp3b73r6f5k7jq9d6en`, server `o5de31aovlrol4bvhvy9wtk2`, IP `5.78.214.173` |
| **SSH** | `ssh believe-vps` · `ssh hetzner-believe` · `ssh contabo-believe` | Llaves instaladas. Classifier puede bloquear writes a prod → autorizar al inicio |
| **Maasy MCP** | claude.ai Maasy MCP | `maasy_list_brands`, `maasy_get_brand_dna`, `maasy_get_brand_context`, `maasy_get_crm_summary` |
| **CMS** | `https://cms.believe-global.com` | `/api/*` REST, `/admin`. Bin: `payload bootstrap:settings` / `bootstrap:tenant-content` con `NODE_ENV=development` |
| **Appwrite** | `https://appwrite.believe-global.com` (Hetzner) | Keys `APPWRITE_*` en Infisical. v1.8.1 |
| **useSend** | `https://besend.believe-global.com` | FROM verificado `besend.somosbelieve.com` (NO @believe-global.com). Key `USESEND_*` Infisical |
| **Plunk** | `https://mailing.believe-global.com` | Key `PLUNK_*` Infisical |
| **R2 (media)** | Cloudflare R2 | `R2_*` en Infisical, ya en el CMS |
| **GitHub** | `gh` CLI (auth ok) | Org `BELIEVE-IT-GROUP`. Repos: `believe-agency-cms`, `believe-web-starter` |
| **DNS** | Cloudflare | Subdominios → `5.78.214.173` (Hetzner). NUNCA GoDaddy |

## 4. Build order (issues · deps · phase · complejidad · modelo · contrato · test)

> Convención BAAS: cada step declara **Dependencias** y **Phase** (setup/foundational/story). `foundational` bloquea todo step posterior no-foundational. Modelo por complejidad para ahorrar tokens: **Haiku** (mecánico), **Sonnet** (edición con contrato), **Opus** (arquitectura/razonamiento/audit adversarial).

### FASE 2.1 — Conectar las 351 variantes Flowbite (el activo)

**F2.1-S1 · Extraer catálogo de los 351** · Deps: Ninguna · Phase: setup · cx2 · **Haiku**
Contrato: `flowbite-catalog.json` con las 351 variantes (categoria, seccion, id, path, props inferidas, light/dark). Evidencia: count=351, schema válido.
Test: script valida que cada entry resuelve a un archivo .tsx existente.

**F2.1-S2 · Registry templateId→componente + normalización de props** · Deps: S1 · Phase: foundational · cx4 · **Opus**
Contrato: registry tipado que mapea cada `templateId` del CMS a un componente; contrato de props normalizado (cada variante recibe datos del CMS de forma uniforme). Extiende `src/flowbite/registry.ts`. Evidencia: typecheck verde, registry cubre las 351.
Test: unit test de resolución templateId→componente para muestra de 30.

**F2.1-S3 · Theming dinámico (DNA→CSS vars) + BlockRenderer extendido** · Deps: S2 · Phase: foundational · cx4 · **Opus**
Contrato: `settings.theme` (poblado de DNA) → CSS vars en :root por tenant; BlockRenderer dibuja según `templateId`; los bloques consumen tokens, no colores fijos. Evidencia: 2 tenants con DNA distinto renderizan con identidades distintas (screenshot).
Test: visual diff tenant A vs B; build verde.

**F2.1-S4..S11 · Mapear las 351 variantes a componentes parametrizados** · Deps: S3 · Phase: story · cx3 c/u · **Sonnet** (mecánico-medio; Haiku para variantes triviales)
Reparto en 8 lotes por categoria/sección (marketing-ui 1, marketing-ui 2, ecommerce-ui, application-ui, publisher-ui, etc.), ~40-50 variantes por lote, subagentes en paralelo. Contrato por variante: usa tokens de theme, props del CMS, sin colores hardcodeados, typecheck verde, sin sombras/gradientes salvo que el template del cliente lo pida. Evidencia: showcase renderiza la categoría completa.
Test: build + visual smoke por lote.

**F2.1-S12 · Audit adversarial + visual regression** · Deps: S4..S11 · Phase: story · cx3 · **Opus** (auditor)
Contrato: cada lote revisado contra responsive, dark mode, props vacías, accesibilidad, fidelidad al theme. Findings reales corregidos. Evidencia: reporte por categoría + correcciones aplicadas.

### FASE 2.2 — MCP `believe-cms` (las manos)

**F2.2-S1 · Scaffold MCP server** · Deps: F2.1-S3 · Phase: setup · cx3 · **Sonnet**
Contrato: MCP server (TS) con auth a CMS + Coolify vía Infisical. Tools stub. Evidencia: server arranca, lista tools.

**F2.2-S2 · Tools de contenido** · Deps: S1 · Phase: foundational · cx4 · **Opus**
Tools: `cms_create_tenant`, `cms_list_block_templates(blockType)`, `cms_create_page(tenant,slug,blocks[])`, `cms_seed_content`, `cms_set_theme_from_dna(tenant,dna)`. Contrato: cada tool ejecuta contra el CMS real (reemplaza SSH+bootstrap manual). Evidencia: crear un tenant de prueba E2E vía MCP.
Test: integración crea+lee tenant; rollback.

**F2.2-S3 · Tools de deploy + leads** · Deps: S2 · Phase: story · cx3 · **Sonnet**
Tools: `cms_deploy(coolify)`, `cms_provision_leads(tenant)` (condicional Maasy CRM / Appwrite). Contrato: deploy crea app Coolify + env + dominio; provision_leads enruta según marca. Evidencia: web de prueba deployada + lead de prueba llega al destino correcto.
Test: smoke deploy + lead E2E.

### FASE 2.3 — Skill `/believe-web` (el cerebro)

**F2.3-S1 · Esqueleto del skill + flujo de entrevista** · Deps: F2.2-S2 · Phase: foundational · cx4 · **Opus**
Contrato: skill que (a) toma el nombre de marca, (b) carga DNA vía Maasy MCP o entrevista corta, (c) AskUserQuestion de estructura/objetivos. Evidencia: corre la entrevista y produce un brief estructurado.

**F2.3-S2 · Composición: estructura→bloques + diseño pro** · Deps: S1 · Phase: story · cx4 · **Opus**
Contrato: del brief elige las variantes Flowbite (de las 351) por sección, invoca skills de diseño (`ui-ux-pro-max`, `impeccable`, `frontend`) para calidad, arma el árbol de bloques. Evidencia: brief→plan de página con templateIds.

**F2.3-S3 · Backend + deploy + verify (orquestación E2E)** · Deps: S2, F2.2-S3 · Phase: story · cx4 · **Opus**
Contrato: decide backend (Maasy CRM / Appwrite + useSend/Plunk), crea tenant+páginas+theme vía MCP, deploya, verifica con screenshot. Evidencia: "creá web para [marca]" → URL viva administrable con identidad de la marca.
Test: E2E completo con una marca real de Maasy.

### FASE 2.4 — Empaque

**F2.4-S1 · Plugin `believe-web` + docs** · Deps: F2.3-S3 · Phase: ship · cx2 · **Sonnet**
Contrato: plugin instalable (skill + MCP + config), README, registro en el equipo. Evidencia: instalación limpia en una sesión nueva + smoke.

## 5. Harness de orquestación

- **Worktree por issue** (BAAS regla 2). Sin push a main; PRs por Review.
- **Constitution gate** por issue (brain-first, traceability, surgical, las 4 de engineering-discipline) afirmado antes de editar.
- **Audit gate por fase**: no se avanza sin evidencia verde. Foundational bloquea stories.
- **Multimodelo**: Haiku mecánico · Sonnet edición-con-contrato · Opus arquitectura/razonamiento/audit. Prompt caching siempre.
- **Fan-out**: F2.1-S4..S11 (mapeo 351) y F2.1-S12 (audit) son paralelos con subagentes. El resto secuencial por deps.
- **Verificación con evidencia** (lección Fase 1): nada "listo" sin URL viva / build verde / screenshot.

## 6. Orden de valor

1. **F2.1** (351 bloques + theming) → el activo desbloqueado, base de todo.
2. **F2.2** (MCP) → manos limpias.
3. **F2.3** (skill) → el flujo "creá web para X" funcionando E2E.
4. **F2.4** (plugin) → instalable por el equipo.

## 7. Arranque de la sesión nueva limpia

```
Trabajar en: /Users/mac/Developer/believe-web-starter (repo del frontend; el MCP y skill se crean en sus rutas)
Leer primero: docs/BLUEPRINT-FASE2.md (este) + memoria project_believe_web_factory + docs/PRD-LANDINGS-PRODUCCION.md
Autorizar al inicio: acceso SSH a believe-vps (prod) + Coolify, una vez.
Empezar por: FASE 2.1 (S1 catálogo → S2 registry → S3 theming → S4..S11 mapeo en lotes paralelos → S12 audit).
Modo: BAAS, multiorquestado, multimodelo, verificación con evidencia.
```

Prompt sugerido para abrir la sesión nueva:
> "Ejecutá la Fase 2 de la fábrica de webs Believe siguiendo docs/BLUEPRINT-FASE2.md, modo BAAS multiorquestado. Arrancá por F2.1. Autorizo acceso a Coolify y SSH a prod."

---

*Believe Tech · Sistema sobre proyecto. Dato sobre opinión. Calma sobre euforia.*
