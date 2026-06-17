# puck-cms-mcp

Las **manos** del CMS Believe Puck: un MCP server (stdio) para operar tenants, tokens,
contenido y deploys del CMS sin estar dentro del repo. NO genera diseño ni bloques (eso
es código a medida del skill `/believe-web`); orquesta lo repetible.

## Arquitectura (híbrida)

- **Local** (opera el repo + `ssh contabo-believe`): tenants, tokens, deploy, catálogo de bloques.
  Lee/escribe `data/tenants/*.json` y `src/cms/blocks/` directamente; dispara el deploy por rsync+ssh.
- **Remoto** (vía endpoint de servicio con API-key): contenido de páginas del CMS live, sin
  pasar por Authelia. El endpoint `/api/svc/cms/[tenant]/[slug]` se sirve por el router público
  de Traefik (no cae en `/api/cms`) y se protege con el header `X-CMS-Key`.

## Tools

| Tool | Lado | Qué hace |
|---|---|---|
| `puck_list_tenants` | local | lista `data/tenants/` (slug, name, blockSet, tokens) |
| `puck_get_tenant` | local | devuelve un tenant completo |
| `puck_create_tenant` | local | crea `data/tenants/<slug>.json` (valida blockSet, no sobrescribe) |
| `puck_update_tenant` | local | merge parcial de name/blockSet/tokens/settings |
| `puck_set_tokens` | local | reemplaza el objeto de tokens del tenant |
| `puck_list_blocksets` | local | subdirectorios de `src/cms/blocks/` |
| `puck_list_blocks` | local | bloques (componentes PascalCase) de un block set |
| `puck_deploy` | local | rsync + docker build + run-puck.sh en Contabo (`dryRun:true` por defecto) |
| `puck_get_page` | remoto | lee el Puck Data de una página del CMS live |
| `puck_publish_page` | remoto | guarda el Puck Data de una página en el CMS live |

## Env vars

| Var | Default | Para qué |
|---|---|---|
| `PUCK_REPO_DIR` | resuelta desde el binario (`<repo>/puck-cms-mcp/dist/..`) | raíz del repo que el MCP opera localmente. Setear si el MCP no vive dentro del repo. |
| `PUCK_CMS_BASE_URL` | `https://puck.believe-global.com` | base del CMS live para las tools remotas |
| `PUCK_SVC_KEY` | — | API-key del endpoint de servicio (debe coincidir con la del CMS). Sin ella, las tools remotas fallan. |
| `PUCK_DEPLOY_HOST` | `contabo-believe` | alias SSH del VPS de deploy |

## Build y verificación

```bash
npm install
npm run build
npm run smoke        # E2E del contrato MCP contra el repo (tools locales read-only)
```

## Registro en Claude Code

Hay un `.mcp.json` en la raíz del repo que lo registra para este proyecto. Para las tools
remotas, exportá `PUCK_SVC_KEY` en el entorno del proceso de Claude (no se versiona el secreto).

## Encender el lado remoto (acciones de prod, una vez)

1. Generar el token y subirlo a Infisical `believe-infra/prod` como `PUCK_SVC_KEY`.
2. Deployar el CMS con la var seteada: `PUCK_SVC_KEY=<token> bash deploy/run-puck.sh`
   (o `puck_deploy` tras exportarla en el entorno del deploy).
3. Verificar: `curl -H "X-CMS-Key: <token>" https://puck.believe-global.com/api/svc/cms/birdman/home`
   (sin header debe dar 401; sin token configurado, 503).
