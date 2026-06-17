# Receta: HTML top-notch → tenant Puck a medida (modelo Believe Web Factory v3)

> Cómo convertir una web top-notch (paso 6 del flow) en un tenant editable del **CMS Believe Puck**, a medida, con fidelidad 100% y todos los items editables. Reemplaza el viejo "motor custom Flowbite + Payload". Ejemplo vivo y probado: tenant **birdman** en `src/cms/blocks/birdman/`.

Repo: `BELIEVE-IT-GROUP/believe-web-starter`. CMS: `src/cms/`. Manual de infra: SiYuan BELIEVE/Infraestructura/CMS Believe Puck.

## Modelo (decisión de Jorge, no negociar sin él)

**A medida por tenant.** Cada web = bloques React propios troceados del HTML aprobado. NUNCA un motor de componentes genéricos (pierde fidelidad, Jorge lo rechazó). El CMS almacena y hace editable un diseño ya hecho a mano; no lo genera.

## Prerequisitos (de pasos anteriores del flow)

> ANTES de llegar aquí, los 3 gates del SKILL.md v3 deben estar cumplidos: (1) entrevista completa del producto puntual, no solo DNA de marca; (2) assets y URLs reales pedidos a Jorge y recibidos; (3) skills de diseño (/impeccable + /ui-ux-pro-max) invocados ANTES de generar el HTML. Saltarlos = iteraciones perdidas.

- HTML top-notch aprobado (paso 6), con CSS propio (no Tailwind obligatorio).
- `brief` con: slug del tenant, tokens de marca (colores/fuentes), nombre, settings.
- Assets (logos/imágenes/mockups/fotos) reales recibidos de Jorge y URLs (compra, dominio) confirmadas.

## Receta de troceo (el patrón birdman)

Trabajar en `src/cms/blocks/<slug>/`. Si el HTML ya está portado a un componente React fiel (como `src/app/birdman/BirdmanLanding.tsx`), trocear ESE (menos riesgo); si no, portar el HTML primero (CSS+markup verbatim).

1. **CSS verbatim → `<slug>/styles.css.ts`.** Extraer el `<style>` del HTML TAL CUAL (script node, no a mano) y exportar `export const CSS = \`...\``. No traducir a Tailwind. Verificar que no contenga backticks ni `${`.

2. **`Root.tsx`** (`RootConfig`, `'use client'`). Es el shell que envuelve los bloques:
   - Inyecta `<style>{CSS}</style>` una vez.
   - Define assets globales (logo SVG symbol) reusados por nav/footer.
   - `useEffect` con la interactividad GLOBAL (anchor-scroll con offset, reveal-on-scroll por IntersectionObserver). NO depende de `content`.
   - **Fix obligatorio:** si `puck.isEditing`, inyectar `<style>.reveal{opacity:1!important;transform:none!important}</style>` (en el iframe del editor el observer no dispara → contenido `.reveal` quedaría invisible).
   - Renderiza `<header>` (nav editable) + `<main>{children}</main>` + `<footer>` + flotantes.
   - `fields` para nav/footer/meta; `defaultProps` = slices de content. Cerrar `fields` con `} as never`.

3. **Un bloque por `<section>`** (`ComponentConfig<Slice>`). Patrón de referencia: `Hero.tsx`, `QueHacemos.tsx`, `Problemas.tsx`.
   - `render`: JSX **verbatim** de la sección (clases/ids/estilos idénticos), reemplazando `content.<seccion>.X` por props desestructuradas.
   - `defaultProps` = `brandContent.<seccion>` (garantiza fidelidad inicial).
   - `fields` = **TODOS** los campos editables del slice (Jorge exige editar todo, no solo títulos):
     - string corto → `{type:'text'}`; párrafo → `{type:'textarea'}`
     - `string[]` → `stringList('etiqueta')` (helper en `<slug>/fields.tsx` o reusar `blocks/birdman/fields.tsx`; Puck no tiene array-de-primitivos)
     - número → `{type:'number'}`; boolean → `{type:'radio', options:[{label,value:true},...]}`
     - union de strings (ej `'up'|'down'`) → `{type:'select', options:[...]}`
     - array de objetos → `{type:'array', arrayFields:{...}, getItemSummary:(i)=>i.title}`
     - objeto → `{type:'object', objectFields:{...}}`; anidar recursivamente
     - cerrar con `} as never`
   - Iconos SVG por índice (no editables) van hardcodeados en el bloque, no como fields.

4. **`content.ts`** del tenant: interfaces + objeto `<brand>Content` con todos los textos. Es la fuente de defaults y de fidelidad.

5. **`puck.config.tsx`**: `{ root: Root, components: {todos los bloques en orden}, categories }`. Cast `as unknown as Config`.

6. **`seed.ts`** (`build<Brand>Seed()`): arma el Puck `Data` desde content.ts → `root.props` = meta/nav/footer; `content` = bloques en orden con `props.id` único.

7. **`data/tenants/<slug>.json`**: `{slug, name, blockSet, tokens, settings}`.

## Gotchas (ya resueltos en birdman, respetar)

- Config Puck es client module → el render público debe usar un wrapper `'use client'` (`PublicRender`), no `<Render>` directo en server component.
- `.reveal` invisible en editor → fix `puck.isEditing` en Root (arriba).
- `fields` incompletos → `} as never`.
- `string[]` → helper `stringList`.
- standalone no copia `data/` → Dockerfile `COPY --from=builder /app/data ./data`; `data/pages` por volumen.
- Authelia 403 en dominio nuevo → agregar regla `one_factor` (ver Deploy).

## Orquestación recomendada (harness)

Para una web de ~10-15 secciones, usar un Workflow:
- Fase Bloques: 1 agente por sección en paralelo, cada uno con el rango de líneas exacto del HTML/port + `Hero.tsx` como contrato. Verbatim, sin inventar markup.
- Fase Wire: registrar todo en `puck.config`.
- Fase Build: build verde con fix-loop.
- Fase Verify (paralelo): auditor de **fidelidad** (markup bloque vs original) + auditor de **cobertura** (cada campo del slice tiene field) + E2E (build, server, las N secciones renderizan, diff vs HTML original, editar-persistir).
DE-RISK primero el patrón con 1 bloque presentacional + 1 con array + 1 con string[] (build verde) antes de escalar.

## Deploy (Contabo, SSH directo)

```bash
rsync -az --delete --exclude node_modules --exclude .next --exclude .git \
  --exclude data/pages ./ contabo-believe:/root/puck-cms/
ssh contabo-believe "cd /root/puck-cms && docker build -t puck-cms:latest . && bash run-puck.sh"
```
`run-puck.sh` (en el VPS) levanta el container en red `coolify` con 2 routers Traefik: público (Host, priority 1) + protegido (Host && PathPrefix `/admin`||`/api/cms`, middleware `authelia-tars-auth@docker`, priority 10), cert letsencrypt, port 3000, volumen `puck-cms-pages`→`/app/data/pages`.

**Por tenant nuevo:** (1) DNS `<slug>.believe-global.com` o ruta `/s/<slug>` en el dominio existente; (2) si dominio nuevo, agregar regla Authelia `- domain: <dominio> / policy: one_factor` en `/root/authelia-tars/config/configuration.yml` + `docker restart authelia-tars` (lo corre Jorge, reinicia auth compartido).

## Verificación (criterios de aceptación)

- Build verde.
- `/s/<slug>` → 200, cert válido, **byte-for-byte vs el HTML aprobado** (solo difieren comentarios HTML).
- `/admin/<slug>/home` → login Authelia, editor Puck carga, TODOS los items editables.
- Editar → publicar → persiste en volumen → visible en `/s/<slug>`.
