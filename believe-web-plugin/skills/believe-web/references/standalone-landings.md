# Landings standalone nivel dios + mapeo al CMS

Este es el modo de la fábrica para landings de **altísima calidad y diseño único**
(como `birdman`). Es distinto del modo motor (componentes custom). Acá Claude genera
un HTML completo, autónomo y excepcional, se porta fiel a Next, se aísla del chrome
Believe, y se mapea al CMS para que el tenant edite cada texto.

> Regla de oro: si el HTML ya existe y está bueno, NO lo reconstruyas con componentes.
> Portalo fiel y parametrizá sus items. El éxito se mide en que el screenshot quede
> idéntico al HTML. (Ver [[feedback_html_listo_portar_fiel]].)

---

## Cuándo usar este modo (vs el motor de componentes)

| | Modo motor (componentes) | Modo standalone (HTML nivel dios) |
|---|---|---|
| Cuándo | Webs estándar, multi-sección, varias páginas, edición block por block | Landing premium donde el diseño debe ser único y excepcional |
| Cómo | Compone con los 26 componentes `src/components/sections/*` via `templateId .custom` | Un HTML completo autónomo, portado fiel a `src/app/<slug>/` |
| Diseño | Consistente, theme por tokens del tenant | Único por landing, su propio design system |
| Edición CMS | Campos por block | Campos del `content.ts` de esa landing |
| Chrome | Header/Footer del tenant (Settings) | El nav/footer viven DENTRO del HTML |

Elegí standalone cuando el cliente quiere "que se vea de otro nivel" y vale el diseño a medida.

---

## Parte A — Generar el HTML nivel dios

El objetivo: un solo archivo HTML, autónomo, que se vea de clase mundial. Lo que hace
excepcional a un HTML como `birdman-landing.html`:

### A1. Design system completo en `:root`
Define TODO como tokens antes de escribir una sola sección:
- **Color**: usá OKLCH. Dark o light decidido por una escena de uso concreta (no por reflejo).
  Surfaces en capas (`--bg`, `--surface`, `--surface-2`, `--surface-3`), texto en grados
  (`--text`, `--muted`, `--faint`), un accent que carga la identidad (`--accent` + `--accent-hover`
  + `--accent-soft`), borders en grados, semánticos (`--success`, `--danger`). Nunca `#000`/`#fff`
  planos: tintá los neutros.
- **Tipografía**: una familia con peso (`--w-body` 500, `--w-strong` 700) + mono para datos.
- **Espaciado**: escala (`--s1..--s8`), radios (`--radius`, `--pill`), motion (`--dur`, `--ease`).
- **Focus**: `--focus` ring visible para a11y.

### A2. Jerarquía tipográfica fuerte
- Eyebrow: mono, uppercase, `letter-spacing` amplio, color accent, 13px.
- Title (h2): `clamp(28px, 3.4vw, 38px)`, weight strong, `letter-spacing:-.02em`, `text-wrap:balance`, `max-width:18ch`.
- Hero h1: `clamp(34px, 4.6vw, 56px)`, una palabra resaltada en accent (`em { color: var(--accent) }`).
- Lead: 19px, muted, `max-width:60ch`. Ratio >=1.25 entre escalas.

### A3. Patrón de sección consistente
Cada sección: `eyebrow` + `h2.title` + `lead` + contenido. Alterná fondo (`--bg` vs `--surface`)
para ritmo. `section { padding: 96px 0 }`.

### A4. Elementos premium (lo que sube el nivel de "bueno" a "dios")
Estos son los patrones que el cliente percibe como producto serio. Incluí los que apliquen:
- **Panel/dashboard mock**: una "ventana" con barra (lights + título + "En vivo"), grid de KPIs
  (valor grande + delta verde/naranja), un **sparkline SVG inline** con gradiente, filas de tracking
  con pills de estado. Comunica "esto es tecnología real" sin una sola imagen.
- **Calculadora interactiva**: 3 inputs + panel de resultado que recalcula en vivo (sin librerías),
  formato moneda local, un supuesto visible y honesto, CTA. Genera engagement y captura intención.
- **Casos con resultados**: card con tag de industria + problema + solución + 3 métricas duras.
  Disclaimer honesto si las cifras son ilustrativas.
- **Methodology steps**: pasos numerados (`counter`) con nodos conectados por línea.
- **Problemas con iconos**, **industrias como pills**, **beneficios +/-**, **recursos/blog cards**,
  **FAQ con `<details>`/`<summary>`** nativo y un `+`/`-` animado.

### A5. Interactividad nativa (cero frameworks en el HTML)
Todo en `<script>` vanilla, con cleanup mental para el porte a React:
- Smooth scroll con offset por el nav sticky (delegación de eventos, `window.scrollTo`).
- Calculadora en vivo (`input` listeners).
- Form: validación required/email/teléfono, estado `.sent` de éxito, focus management, limpia error al corregir.
- Reveal-on-scroll con `IntersectionObserver` + fallback `prefers-reduced-motion`.

### A6. Craft no negociable
- a11y: `:focus-visible` con ring, `aria-*`, roles válidos, labels.
- Responsive: 2-3 breakpoints (960px, 560px), mobile-first en la cabeza.
- **Sin em dashes** en copy ni comentarios. Español neutro, método ATIDCOA.
- Self-contained: un archivo, su CSS, sus SVG inline, logo como `<symbol>` + `<use>`.
- El test final: ¿alguien diría "esto lo hizo una IA"? Si sí, no llegó a nivel dios.

> Para subir la barra, invocá `impeccable` o `ui-ux-pro-max` con el DNA antes de cerrar el HTML.

---

## Parte B — Portar el HTML fiel a Next

El HTML ya es perfecto. El porte NO rediseña: reproduce + separa contenido.

Destino: `src/app/<slug>/page.tsx` + `src/app/<slug>/content.ts`.

1. **CSS verbatim**: el `<style>` entero va a un const `CSS` e se inyecta con
   `<style dangerouslySetInnerHTML={{__html: CSS}}/>`. No lo conviertas a Tailwind. `:root` intacto.
2. **Logo**: el `<symbol id="...">` una vez (oculto) + `<use href="#...">` en nav y footer.
3. **Markup a JSX**: solo `class→className`, `for→htmlFor`, `stroke-width→strokeWidth`, inline `style→{{}}`,
   self-closing, `value→defaultValue` en inputs. Mismos `id` de sección para el smooth scroll.
4. **Scripts a un `useEffect`**: `'use client'` en la page, la lógica de los `<script>` en uno o varios
   `useEffect` con el MISMO comportamiento, listeners limpiados en el return.
5. **Contenido a `content.ts`**: ver Parte C. El JSX lee de `content.X`, no hardcodea texto.
6. Corré `npm run typecheck` hasta exit 0. Tocá solo `src/app/<slug>/`.

---

## Parte C — Aislar la landing del chrome Believe (CRÍTICO)

Este repo envuelve cada página con el header/footer/fondo del tenant Believe (en el route
group `(chrome)`) y con `globals.css` (estilos base + fuentes del tenant). Una landing standalone
trae SU PROPIO nav/footer/CSS, así que NO debe heredar nada de eso, o sale **doble header/footer**
y **fuentes/colores del tenant pisando los tuyos** (titulares ilegibles).

Arquitectura ya montada en el repo (respetala):
- **Root layout neutro** (`src/app/layout.tsx`): solo `<html><body>{children}</body>` + fuentes +
  CSS vars del tenant. NO importa `globals.css`. NO pone Header/Footer.
- **Route group `(chrome)`** (`src/app/(chrome)/layout.tsx`): importa `globals.css` y pone
  Header/Footer/fondo. Ahí viven las páginas Believe (home, `[slug]`, blog, catalog).
- **Las landings standalone viven FUERA de `(chrome)`**, en `src/app/<slug>/`. NO importan `globals.css`.
  Traen su CSS en su propio `<style>`. Resultado: cero chrome ajeno, cero contaminación de fuentes.

Checklist al crear una landing standalone:
```
[ ] La carpeta es src/app/<slug>/ (NO dentro de (chrome))
[ ] page.tsx NO importa globals.css
[ ] El <style> de la landing define su propio body{ background, color, font-family }
[ ] Verificá el screenshot: un solo header, un solo footer, fondo y fuentes correctos
```

---

## Parte D — Mapear `content.ts` al CMS (edición 100% por el tenant)

`content.ts` ES el modelo de datos. Cada campo se vuelve un campo editable en Payload. La página
lee el contenido del CMS y usa `content.ts` como **default/fallback** (si el CMS no tiene el campo,
gana el default, así nunca se ve vacío).

### D1. El modelo ya está tipado
La interface `BirdmanContent` define la forma exacta (meta, nav, hero+panel, queHacemos, problemas,
soluciones, industrias, beneficios, tecnologia, metodologia, casos, calculadora, diagnostico,
recursos, blog, faq, footer). Esa interface ES el contrato del schema CMS.

### D2. Schema en Payload (espeja `content.ts`)
Creá un bloque/collection que matchee la interface. Patrón: un `group` por sección, `array` por
listas. Ejemplo (recortado):
```ts
// believe-cms-multitenant/src/blocks/StandaloneLanding.ts  (o una collection "landings")
{
  slug: 'birdman',
  fields: [
    { name: 'hero', type: 'group', fields: [
      { name: 'headlineBefore', type: 'text' },
      { name: 'headlineEm', type: 'text' },          // la palabra en accent
      { name: 'headlineAfter', type: 'text' },
      { name: 'sub', type: 'textarea' },
      { name: 'ctas', type: 'array', fields: [
        { name: 'label', type: 'text' }, { name: 'href', type: 'text' },
        { name: 'style', type: 'select', options: ['primary','ghost'] } ] },
      { name: 'panel', type: 'group', fields: [
        { name: 'kpis', type: 'array', fields: [
          { name: 'k', type: 'text' }, { name: 'v', type: 'text' }, { name: 'd', type: 'text' },
          { name: 'warn', type: 'checkbox' } ] },
        /* chart, tracking... */ ] } ] },
    { name: 'problemas', type: 'group', fields: [
      { name: 'eyebrow', type: 'text' }, { name: 'title', type: 'text' }, { name: 'lead', type: 'textarea' },
      { name: 'items', type: 'array', fields: [ { name: 'text', type: 'text' } ] } ] },
    /* ...una entrada por cada seccion de BirdmanContent... */
  ]
}
```
Regla: **todos los campos opcionales** (sin `required`) para que el default cubra lo que el tenant no toca.

### D3. Fetch + merge en la página
La page lee del CMS y mergea sobre el default:
```ts
import { birdmanContent } from './content'           // default (el HTML original)
import { getLandingContent } from '@/lib/payload'    // helper nuevo

const cms = await getLandingContent('birdman')        // { hero?: {...}, ... } | null
const content = deepMerge(birdmanContent, cms ?? {})  // CMS pisa default campo por campo
```
`deepMerge`: para cada campo, si el CMS lo trae no-vacío, gana; si no, queda el default. Para arrays,
si el CMS trae el array completo, reemplaza; si no, queda el del default. Así el tenant edita lo que
quiere y el resto se ve siempre bien.

### D4. Seed inicial
Cargá `content.ts` al CMS una vez (seed) para que el tenant arranque editando el contenido real, no
campos vacíos. Via MCP (`cms_seed_content` con la estructura) o un script de seed.

### D5. Edición por el tenant
El tenant entra a `cms.believe-global.com`, abre la landing, y edita cada campo (headline, KPIs,
problemas, casos, FAQ, etc.) en la UI de Payload. La página revalida (ISR 60s) y se actualiza. El
diseño (CSS) NO se toca: solo cambian los textos/datos.

### D6. Por qué este approach
- **Fidelidad**: el diseño es el HTML exacto, intocable. El tenant solo edita contenido.
- **Granular**: cada item es un campo, no un JSON crudo.
- **Repetible**: cada landing standalone define su `content.ts` -> su schema -> su fetch. Mismo patrón.
- **Seguro**: el default (`content.ts`) garantiza que nunca se vea rota aunque el CMS falle.

---

## Parte E — Publicar: receta de 4 comandos

> Prerequisito: `src/app/<slug>/page.tsx` ya pusheado a `main`.

Cada landing standalone tiene su propia app en Coolify Hetzner (proyecto `believe-landings`).
Copia, pega y cambia `SLUG`:

```bash
SLUG="mi-landing"   # <-- solo cambiar esto

# 1. Crear la app
APP_UUID=$(~/.believe/bin/infra bash -c "
  curl -s -X POST \
    -H 'Authorization: Bearer \$COOLIFY_HETZNER_TOKEN' \
    -H 'Content-Type: application/json' \
    'https://coolify.backends.believe-global.com/api/v1/applications/public' \
    -d '{
      \"project_uuid\": \"sy6mbsp3b73r6f5k7jq9d6en\",
      \"environment_name\": \"production\",
      \"server_uuid\": \"o5de31aovlrol4bvhvy9wtk2\",
      \"destination_uuid\": \"txzg68of4rbwautjac77pqfv\",
      \"github_app_uuid\": \"c9l2y8paufjlitsqlr11jbkg\",
      \"name\": \"web-$SLUG\",
      \"git_repository\": \"https://github.com/BELIEVE-IT-GROUP/believe-web-starter\",
      \"git_branch\": \"main\",
      \"build_pack\": \"dockerfile\",
      \"ports_exposes\": \"3000\"
    }'" | python3 -c "import sys,json; print(json.load(sys.stdin)['uuid'])")
echo "APP_UUID=$APP_UUID"

# 2. Crear env var
~/.believe/bin/infra bash -c "
  curl -s -X POST \
    -H 'Authorization: Bearer \$COOLIFY_HETZNER_TOKEN' \
    -H 'Content-Type: application/json' \
    'https://coolify.backends.believe-global.com/api/v1/applications/$APP_UUID/envs' \
    -d '{\"key\": \"NEXT_PUBLIC_STANDALONE_SLUG\", \"value\": \"$SLUG\"}'" > /dev/null

# 3. Marcarla build-time (campo exacto: is_buildtime sin guión)
~/.believe/bin/infra bash -c "
  curl -s -X PATCH \
    -H 'Authorization: Bearer \$COOLIFY_HETZNER_TOKEN' \
    -H 'Content-Type: application/json' \
    'https://coolify.backends.believe-global.com/api/v1/applications/$APP_UUID/envs' \
    -d '{\"key\": \"NEXT_PUBLIC_STANDALONE_SLUG\", \"value\": \"$SLUG\", \"is_buildtime\": true}'" > /dev/null

# 4. Deploy
~/.believe/bin/infra bash -c "
  curl -s -X POST \
    -H 'Authorization: Bearer \$COOLIFY_HETZNER_TOKEN' \
    'https://coolify.backends.believe-global.com/api/v1/deploy?uuid=$APP_UUID&force=false'" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['deployments'][0]['message'])"
```

La app queda en `http://<APP_UUID>.5.78.214.173.sslip.io`.
Para dominio propio: `PATCH /applications/<APP_UUID>` con `{"fqdn": "https://tu-dominio.com"}`.

### Constantes (nunca cambian)

| Dato | Valor |
|---|---|
| Proyecto uuid | `sy6mbsp3b73r6f5k7jq9d6en` |
| Server uuid | `o5de31aovlrol4bvhvy9wtk2` |
| Destination uuid | `txzg68of4rbwautjac77pqfv` |
| GitHub App uuid | `c9l2y8paufjlitsqlr11jbkg` |

### Gotcha documentado (2026-06-19)

- El campo build-time en la API es `is_buildtime` (sin guión). `is_build_time` devuelve 422.
- POST crea, PATCH actualiza. No hay forma de pasar `is_buildtime` en el POST inicial.
- El Dockerfile tiene ARG/ENV para `NEXT_PUBLIC_STANDALONE_SLUG` desde commit `1ebbae6e`.

### Apps existentes

| Slug | App UUID |
|---|---|
| birdman | `k2vq8ll1518at1w8v611axiu` |
| on-ongent | `aqtb4yr4nkkex3zg6dnaf2ma` |

---

## Flujo completo (resumen)

```
1. Portar HTML a Next    →  src/app/<slug>/page.tsx  (fuera de (chrome), sin globals.css)
2. git push origin main
3. Receta Parte E        →  4 comandos, 1 minuto, deck publicado
```

Casos de referencia: `src/app/birdman/` y `src/app/on-ongent/`.
