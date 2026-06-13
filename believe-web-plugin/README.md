# believe-web

Plugin de Claude Code para la **Believe Web Factory**: una sesion conversacional en la que
Jorge (o cualquier DRI) dice "crea una web para [marca]" y el sistema entrega un sitio
desplegado, tematizado y administrable sin tocar configuracion manual.

---

## Como se compone la fabrica

La fabrica tiene tres capas que trabajan juntas:

### 1. Skill `/believe-web` (el cerebro)

Archivo: `skills/believe-web/SKILL.md`

Orquesta la sesion de principio a fin:

1. Recibe el nombre o slug de la marca.
2. Llama a Maasy MCP (`maasy_list_brands`, `maasy_get_brand_dna`, `maasy_get_brand_context`)
   para cargar colores, tipografia, tono y propuesta de valor ya registrados.
3. Si la marca no esta en Maasy, entrevista al usuario con `AskUserQuestion` para suplir el DNA.
4. Selecciona bloques del catalogo de 133 variantes Flowbite con `cms_list_block_templates`.
5. Propone la estructura de paginas; pide aprobacion antes de escribir.
6. Ejecuta en orden: `cms_create_tenant` -> `cms_set_theme_from_dna` -> `cms_create_page`
   (o `cms_seed_content`) -> `cms_provision_leads` -> `cms_deploy`.
7. Todos los tools de escritura corren primero con `dryRun:true`; el skill muestra el plan
   y solo pasa `dryRun:false` tras confirmacion explicita del usuario.

### 2. MCP `believe-cms` (las manos)

Codigo: `../believe-cms-mcp/` (paquete separado, se compila una vez).

7 tools:

| Tool | Que hace |
|---|---|
| `cms_list_block_templates` | Devuelve el catalogo de 133 variantes (read-only) |
| `cms_create_tenant` | Crea tenant en el CMS multitenant |
| `cms_create_page` | Escribe una pagina con sus bloques |
| `cms_seed_content` | Siembra estructura completa de una vez |
| `cms_set_theme_from_dna` | Aplica colores y fuentes al tema del tenant |
| `cms_deploy` | Lanza el sitio en Coolify Hetzner y devuelve la URL |
| `cms_provision_leads` | Conecta formularios a Maasy CRM o Appwrite |

Todos los tools de escritura aceptan `dryRun:true` (default) para simular sin tocar nada.

### 3. Libreria de bloques Flowbite (133 variantes)

El frontend `believe-web-starter` ya incluye los 17 blockTypes:
`hero`, `features`, `pricing`, `cta`, `testimonials`, `faq`, `stats`, `team`,
`logo-cloud`, `gallery`, `contact`, `split-content`, `video-embed`, `newsletter`,
`blog-list`, `header`, `footer`.

Cada blockType tiene N variantes de diseno. El skill escoge segun el tono y
la densidad de contenido de la marca. El tema (colores, tipografia) se inyecta
via CSS vars desde `settings.theme` del CMS, por lo que una sola base de codigo
sirve a todas las marcas.

---

## Maasy MCP (contexto de marca)

El plugin asume que tienes el MCP `claude.ai Maasy MCP` conectado en tu sesion de Claude.
Este MCP aporta:

- `maasy_list_brands` -- descubre UUIDs de las marcas registradas
- `maasy_get_brand_dna(project_id)` -- paleta, tipografia y tono
- `maasy_get_brand_context(project_id)` -- propuesta de valor, audiencia, producto
- `maasy_get_crm_summary(project_id)` -- estado CRM para decisiones de leads backend

Si una marca no esta en Maasy el skill realiza la entrevista en vivo y construye
el DNA de forma incremental.

---

## Pre-requisitos de runtime

Documentados en INSTALL.md. Version corta:

1. Compilar el MCP (`cd believe-cms-mcp && npm install && npm run build`).
2. Variables de entorno: `CMS_ADMIN_EMAIL`, `CMS_ADMIN_PASSWORD`, `COOLIFY_HETZNER_TOKEN`.
   Se inyectan via `~/.believe/bin/infra` (Infisical believe-infra/prod).
3. Maasy MCP conectado en la sesion.

---

## Uso

```
/believe-web Pawers
```

El skill toma el control: carga el DNA de Pawers desde Maasy, propone estructura
y bloques, pide confirmacion, ejecuta en seco (dry-run), pide OK final y despliega.
