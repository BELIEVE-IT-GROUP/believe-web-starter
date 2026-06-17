# Handoff — MCP `believe-puck` (las "manos" por API del CMS Puck)

> Para retomar en otra sesión. El CMS Believe Puck ya está LIVE y multi-tenant; falta el MCP que lo opere por API desde cualquier cliente (Claude Desktop, Hermes, o el paso 7 del skill `/believe-web`). El viejo `believe-cms-mcp/` (Payload+Flowbite) NO sirve: rehacer, pero su scaffold de servidor MCP es buen template.

## Objetivo del MCP
Dar tools para operar tenants/contenido/deploy del CMS Puck SIN estar en el repo. NO genera bloques (eso es código a medida del skill `/believe-web`); gestiona lo repetible: listar/crear tenants, tokens, publicar contenido, disparar deploy.

## Estado del CMS (ya construido, NO rehacer)
- **Repo:** `BELIEVE-IT-GROUP/believe-web-starter`, branch `feat/puck-cms`. Next 14, `output: standalone`. Worktree de la sesión: `.claude/worktrees/transient-moseying-emerson` (mergear/commitear a feat/puck-cms).
- **CMS:** `src/cms/` — `store.ts` (store JSON multi-tenant), `registry.ts` (`getConfig`/`getSeed`/`withDefaults` por blockSet), `blocks/<tenant>/` (bloques a medida por marca), `puck.config.tsx` (birdman).
- **Tenants LIVE** en `puck.believe-global.com` (Contabo, container `puck-cms`, Traefik red `coolify`, Authelia sobre `/admin`+`/api/cms`, `/s/*` público):
  - `birdman` → `/s/birdman`, editor `/admin/birdman/home`
  - `neurorealidad` → `/s/neurorealidad`, editor `/admin/neurorealidad/home`
- **Store:** `data/tenants/<slug>.json` (config del tenant, en git) + `data/pages/<tenant>/<slug>.json` (Puck Data editable, en **volumen** `puck-cms-pages`→`/app/data/pages`, NO en git).
- **API existente:** `src/app/api/cms/[tenant]/[slug]/route.ts` → `GET`/`PUT` del Puck Data JSON. El `PUT` está detrás de Authelia (cookie de sesión).
- **Deploy:** `rsync` worktree → `contabo-believe:/root/puck-cms/` + `docker build -t puck-cms:latest .` + `bash deploy/run-puck.sh` (recrea container con labels Traefik + volumen). OJO: `rsync --delete` borra del VPS lo que no esté en el repo (por eso `run-puck.sh` se movió a `deploy/`).

## Tools que debe exponer (propuesta)
1. `puck_list_tenants` — lee `data/tenants/`.
2. `puck_get_tenant(slug)`.
3. `puck_create_tenant(slug, name, blockSet, tokens?, settings?)` — escribe `data/tenants/<slug>.json`.
4. `puck_set_tokens(slug, tokens)` / `puck_update_tenant(slug, patch)`.
5. `puck_get_page(tenant, slug)` / `puck_publish_page(tenant, slug, data)` — el contenido editable.
6. `puck_deploy()` — dispara rsync+build+run en Contabo.
7. `puck_list_blocksets()` / `puck_list_blocks(blockSet)` — qué bloques tiene cada set.

## Decisión a tomar con Jorge ANTES de codear (gate de arquitectura)
**¿Dónde corre el MCP y qué toca?**
- (a) **Local que opera el repo + `ssh contabo-believe`** (igual que el skill): simple, sin auth nueva, pero solo desde la máquina con acceso SSH/repo. Bueno para el flujo `/believe-web`.
- (b) **Servicio remoto que llama la API `/api/cms`**: usable desde cualquier lado, pero `/api/cms` está tras Authelia → necesita un token de servicio o un endpoint API-key aparte (bypass de Authelia para el MCP). Más trabajo.
- Recomendación inicial: (a) para tenants/deploy (escribe repo + ssh) y un endpoint API-key dedicado para `publish_page` si se quiere editar contenido remoto.

## Modelo (no romper)
"A medida por tenant" (decisión de Jorge). Crear una web nueva SIEMPRE pasa por el skill `/believe-web` (genera los bloques React a medida) + deploy. El MCP NO genera diseño; orquesta tenants/contenido/deploy.

## Referencias
- Receta técnica del troceo: `~/.claude/skills/believe-web/references/puck-generation.md`
- Skill: `~/.claude/skills/believe-web/SKILL.md` (v3, los 3 gates)
- Manual de infra: SiYuan → BELIEVE/Infraestructura/CMS Believe Puck
- Memoria: `~/.claude/projects/-Users-mac/memory/project_believe_puck_cms.md`
- Template de estructura MCP (viejo): `believe-cms-mcp/src/index.ts` (server stdio), `coolify.ts`, `package.json`
- Tokens en Infisical `believe-infra/prod` (NO hay COOLIFY_CONTABO_TOKEN; Contabo se opera por SSH `contabo-believe`).

## Primer paso al retomar
1. Confirmar arquitectura (a)/(b) con Jorge.
2. Scaffold del MCP (reusar estructura de `believe-cms-mcp/`): `package.json`, `src/index.ts` (MCP server stdio), tipos.
3. Implementar `puck_list_tenants` + `puck_publish_page` primero (los más simples), probar end-to-end contra el CMS live.
4. `puck_deploy` (rsync+build+run) y `puck_create_tenant`.
5. Registrar el MCP en la config de Claude y conectarlo al paso 7 del skill `/believe-web`.

## Pendientes relacionados (no bloqueantes del MCP)
- Cambiar los 9 testimonios placeholder de neurorealidad por reales (editables desde el editor Puck).
- `generateMetadata` por tenant en `/s/[tenant]` (title/SEO).
- Matar Payload (`cms.believe-global.com` + `/birdman` viejo) una vez todo validado.
