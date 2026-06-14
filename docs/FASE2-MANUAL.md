# Fase 2 — Believe Web Factory · Manual operativo

> Estado: 2026-06-13. Núcleo LIVE y probado E2E. Manual completo (humano) en SiYuan:
> `BELIEVE/Infraestructura/Believe Web Factory - Fase 2`. Este doc es la referencia in-repo.

## Qué es

Fábrica de webs multimarca: *"creá una web para [marca]"* → DNA de Maasy → composición con las 133
variantes Flowbite + identidad de la marca → backend de leads → deploy → web administrable.
Tres capas, empaquetadas como plugin de Claude Code:

- **SKILL `/believe-web`** (cerebro) — `believe-web-plugin/skills/believe-web/SKILL.md`
- **MCP `believe-cms`** (manos) — `believe-cms-mcp/` (7 tools)
- **Librería 133 variantes** (activo) — `src/flowbite/blocks/` + `src/flowbite/registry.generated.ts`

## Cómo correrlo

```bash
# 1. Build del MCP
cd believe-cms-mcp && npm install && npm run build   # genera dist/

# 2. Secrets (Infisical believe-infra/prod) inyectados via helper:
#    CMS_ADMIN_EMAIL, CMS_ADMIN_PASSWORD (super-admin Payload), COOLIFY_HETZNER_TOKEN
#    (+ MAASY_*, APPWRITE_* para leads en vivo)
~/.believe/bin/infra node dist/index.js   # arranca el MCP stdio

# 3. Instalar el plugin believe-web-plugin/ (ver believe-web-plugin/INSTALL.md)
```

## Las 7 tools del MCP (`believe-cms`)

Todas las que crean recursos default **`dryRun:true`**. Orden canónico de ejecución abajo.

| Tool | Params | Nota |
|---|---|---|
| `cms_list_block_templates` | `blockType?` | read-only, 133 variantes |
| `cms_create_tenant` | `slug, name, domain?, dryRun` | idempotente; **bootstrappea settings** |
| `cms_set_theme_from_dna` | `tenantSlug, dna{colors,fonts,tone}, dryRun` | persiste settings.theme |
| `cms_create_page` | `tenantSlug, slug, title, blocks[], status?, dryRun` | **publica por default** |
| `cms_seed_content` | `tenantSlug, structure, dryRun` | varias páginas de una |
| `cms_deploy` | `tenantSlug, tenantId, domain?, dryRun` | Coolify Hetzner |
| `cms_provision_leads` | `tenantSlug, tenantId, email?, dryRun` | Maasy CRM o Appwrite |

Orden: `create_tenant` → `set_theme_from_dna` → `create_page`/`seed_content` → `provision_leads` → `deploy`.

Cada `block` = `{ blockType, templateId, ...campos }`. Los `templateId` válidos salen de
`cms_list_block_templates` (formato `<blockType>.<variant>`, ej. `hero.default`, `pricing.highlighted-plan`).

## Regenerar la librería de bloques

```bash
node scripts/extract-flowbite-catalog.mjs    # catalog.generated.json (133 templates + 355 inventario)
node scripts/validate-catalog.mjs            # contrato
node scripts/build-flowbite-blocks.mjs       # copia las 133 a src/flowbite/blocks/ + registry
```

Theming: el frontend lee `settings.theme` (poblado del DNA) y lo inyecta como CSS vars (`src/lib/theme.ts`).
Ramp de color por `color-mix` desde 1 color de marca; fuentes Google por tenant; Believe es el fallback.

## Estado / pendientes

Probado E2E: crear tenant + theme Trust + home publicada con su propio slug (multitenancy resuelta) +
deploy live 200. Pendientes:

1. **Render de contenido en deploy**: el app de prueba sirve 200 pero la home renderiza vacía — Next no
   re-inlineó `NEXT_PUBLIC_TENANT_ID` (cache de Docker build de Coolify pese a `is_build_time` + force).
   La data es correcta. Fix de la tool ya en `cms_deploy` (`coolify.ts`); falta validar rebuild limpio.
2. **Teardown** del test: app `web-mcp-test` + tenant `mcp-test` (id 3).
3. `cms_set_theme_from_dna` no persiste `fonts` (bug menor de mapping).
4. **Schema push CMS**: con `NODE_ENV=production` el db-push NO corre (pese a `PAYLOAD_DB_PUSH=true`) →
   los cambios de schema se aplicaron a mano por SQL. Para el futuro: `NODE_ENV=development` al arranque
   o formalizar migraciones.
5. **VPSDime sobre-suscrito**: el build del CMS falla con EAGAIN bajo carga → mover build a Hetzner.

## Gotchas (no repetir)

- Slug era único GLOBAL, no por-tenant → fix: índice compuesto unique `(tenant_id, slug)`.
- Tablas de versiones `_pages_v`/`_posts_v` espejan el schema: agregar columnas `version_*` también.
- `NEXT_PUBLIC_*` necesitan `is_build_time` en Coolify (Next los inlinea al compilar).
- Coolify `createApp` (`/applications/public`) requiere `environment_name` + `ports_exposes`.
- Redeploy con mismo commit reusa la layer de `next build` (cache) → no re-inlinea envs; usar force/no-cache.
