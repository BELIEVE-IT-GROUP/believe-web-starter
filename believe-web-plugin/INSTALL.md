# Instalacion del plugin believe-web

## Resumen

El plugin tiene dos componentes:

- **MCP believe-cms** (proceso Node que Claude Code lanza automaticamente via `.mcp.json`)
- **Skill `/believe-web`** (archivo Markdown que Claude Code carga como skill)

Ambos viven en este repositorio; no hay publicacion en npm ni en el marketplace.

---

## Paso 1 -- Compilar el MCP

El MCP necesita compilarse una sola vez (o despues de cada cambio en `src/`).

```bash
cd /Users/mac/Developer/believe-web-starter/.claude/worktrees/fase2/believe-cms-mcp
npm install
npm run build
# Verifica: debe existir dist/index.js
ls dist/index.js
```

Si ya compilaste antes y no hay cambios, puedes saltar este paso.

---

## Paso 2 -- Inyectar los secrets de runtime

El MCP necesita tres variables de entorno para operar:

| Variable | Para que sirve |
|---|---|
| `CMS_ADMIN_EMAIL` | Email del super-admin de Payload CMS |
| `CMS_ADMIN_PASSWORD` | Password del super-admin de Payload CMS |
| `COOLIFY_HETZNER_TOKEN` | Token API de Coolify Hetzner para deploy |

**Estas variables ya existen en Infisical `believe-infra/prod`.** Nunca las pidas a Jorge ni las
pegues en archivos de texto plano.

Para correr Claude Code con estos secrets inyectados usa el helper del equipo:

```bash
~/.believe/bin/infra claude
```

Esto lanza Claude Code con los 78 secrets de `believe-infra/prod` disponibles como env vars.
El MCP los hereda automaticamente al arrancar porque Claude Code lo lanza como proceso hijo.

Si necesitas verificar que las variables llegan al proceso:

```bash
~/.believe/bin/infra env | grep -E "CMS_ADMIN|COOLIFY_HETZNER"
```

---

## Paso 3 -- Verificar que el MCP responde

Con Claude Code abierto (via `~/.believe/bin/infra claude`) ejecuta en la sesion:

```
/mcp
```

Debes ver `believe-cms` listado como servidor conectado. Luego verifica los tools:

```
Listame los tools del MCP believe-cms
```

Claude debe mostrar los 7 tools:
`cms_list_block_templates`, `cms_create_tenant`, `cms_create_page`,
`cms_seed_content`, `cms_set_theme_from_dna`, `cms_deploy`, `cms_provision_leads`.

Si el MCP no aparece, revisa:

1. Que `dist/index.js` exista (paso 1 no se completo).
2. Que el path en `.mcp.json` sea correcto relativo a donde abres Claude Code.
   El path por defecto asume que abres Claude Code desde `believe-web-plugin/`
   o que el plugin esta instalado en el directorio padre de `believe-cms-mcp/`.
   Ajustalo si la estructura de carpetas difiere:
   ```json
   "args": ["<ruta-absoluta>/believe-cms-mcp/dist/index.js"]
   ```

---

## Paso 4 -- Verificar Maasy MCP

El skill tambien consume el MCP `claude.ai Maasy MCP` (ya conectado en el workspace
de Claude Code de Believe). Verifica que esta disponible:

```
Listame las marcas en Maasy
```

Debe devolver al menos las marcas activas (Pawers, etc.).

---

## Paso 5 -- Smoke test: crear una web demo

Ejecuta el skill con una marca de prueba:

```
/believe-web demo-smoke-test
```

El skill debe:

1. Detectar que "demo-smoke-test" no esta en Maasy.
2. Entrevistarte con 4-6 preguntas sobre la marca.
3. Proponer una estructura (dry-run).
4. Mostrar el plan sin escribir nada.

Para un test completo con escritura real, usa una marca que si este en Maasy
(ej. `/believe-web pawers`) y confirma cada paso cuando el skill lo pida.

---

## Nota sobre el path relativo en `.mcp.json`

El archivo `.mcp.json` usa:

```json
"args": ["../believe-cms-mcp/dist/index.js"]
```

Este path es relativo al **directorio de trabajo** desde el que Claude Code
resuelve el MCP, no al directorio del plugin. Si instalas el plugin fuera del
worktree de `fase2`, ajusta el path a la ruta absoluta del MCP compilado:

```json
"args": ["/ruta/absoluta/a/believe-cms-mcp/dist/index.js"]
```

---

## Actualizaciones del MCP

Cuando se modifique `believe-cms-mcp/src/`:

```bash
cd believe-cms-mcp && npm run build
```

Luego reinicia la sesion de Claude Code para que recargue el proceso MCP.
