# Composition Playbook -- Recetas por objetivo (MOTOR CUSTOM)

Mapea cada `objetivo` del brief a una estructura de pagina con el **motor de
secciones custom de clase mundial** (sin Flowbite). Cada blockType es UN template
`<blockType>.custom` con un campo `variant` interno que elige el sub-layout.

Confirma cada templateId con `cms_list_block_templates({ blockType })` (el catalogo
del MCP ya incluye las entradas `.custom`). El render lo resuelve
`resolveCustomSection(templateId)` en el frontend (`src/components/sections/registry.ts`).

> El flujo Flowbite manual (133 variantes) sigue disponible para edicion a mano
> desde el CMS admin. Este playbook es para el flujo AUTOMATICO del skill, que usa
> el motor custom.

## Reglas duras (custom)

- **Header y Footer NO son page.blocks**. En el motor custom se configuran en
  `Settings` (header/footer) y el layout renderiza `SiteHeader` / `SiteFooter`
  custom. La receta de `page.blocks` arranca en `hero.custom`. El skill setea
  header/footer via `cms_create_tenant` (bootstrappea settings) + el theme.
- Toda home arranca con `hero.custom` como primer page.block.
- **Un template por blockType**: no elijas entre `hero.A` y `hero.B`. Usa
  `hero.custom` y selecciona el sub-layout con el campo `variant`.
- El bloque de captura de leads (el que dispara `cms_provision_leads`) es
  `cta.custom` (variant `form`) o `contact.custom`. Debe aparecer en toda pagina
  con objetivo `leads` o `booking`.
- Dos blockTypes nuevos del motor custom: `pain.custom` (identificacion del dolor,
  metodo ATIDCOA) y `steps.custom` (como funciona).

## Como elegir el `variant` segun el DNA

- Tono `premium` / `authoritative` / `minimalist`: `hero.custom` variant `minimal`
  o `metrics`; `features.custom` variant `grid` o `pillars`; `pain.custom` variant
  `statement`. Menos ornamento, mas aire, tipografia que manda.
- Tono `playful` / `warm` / `bold`: `hero.custom` variant `split` o `fullscreen`;
  `features.custom` variant `alternating`; `pain.custom` variant `cards`.
- Tono `conversational`: prioriza `testimonials.custom` (SocialProof) y `faq.custom`.
- Marca con producto visual fuerte (moda, comida, viajes, diseno): suma
  `gallery.custom` y `split-content.custom`.
- B2B con metricas duras (fulfillment, SaaS, logistica): `hero.custom` variant
  `metrics`, `stats.custom` (MetricsPanel), `pain.custom` variant `cards` con dato.

### Catalogo de variants por componente custom

```
hero.custom         variant: metrics | split | minimal | fullscreen
features.custom      variant: grid | pillars | alternating   (+ items[].code para pillars)
pain.custom          variant: cards | statement              (cards[].data = dato duro)
steps.custom         variant: linear | vertical | grid
stats.custom         (MetricsPanel: numeros grandes, sin variant)
testimonials.custom  variant: single | grid                  (SocialProof, items[].metric)
split-content.custom imagePosition: left | right
pricing.custom       (PricingTable: toggle mensual/anual interno)
team.custom          (TeamGrid)
contact.custom       (ContactSection: form dinamico por fields[])
cta.custom           variant: banner | form                  (form: captura inline)
faq.custom           (FaqAccordion)
logo-cloud.custom    (LogoBar: animate bool)
gallery.custom       layout: masonry | grid | carousel
video-embed.custom   source: youtube | vimeo | direct
newsletter.custom    (NewsletterBar)
blog-list.custom     layout: grid | list | featured
```

---

## 1. objetivo: `leads` -- Landing de captacion

La home esta optimizada para una sola accion: dejar datos. CTA repetido, friccion
minima, identificacion del dolor temprana (ATIDCOA), prueba social arriba del
pliegue inferior.

### Pagina: `home` (page.blocks; header/footer via Settings)

| Orden | blockType    | templateId      | variant recomendado | Razon de la seccion |
| ----- | ------------ | --------------- | ------------------- | ------------------- |
| 1     | hero         | `hero.custom`   | `metrics` (B2B con datos) / `split` (con imagen) / `minimal` | Primer impacto + stats panel. Captura de atencion + tension (ATIDCOA) |
| 2     | pain         | `pain.custom`   | `cards` / `statement` | Identificacion del dolor del cliente con dato duro. Ej "1 de cada 8 ordenes con error" |
| 3     | features     | `features.custom` | `pillars` / `grid` | Los pilares de la solucion. Pillars usa items[].code (POD, SLA, COD). Deseo (ATIDCOA) |
| 4     | steps        | `steps.custom`  | `linear` | Como funciona en 3 pasos. Baja la ansiedad del proceso |
| 5     | stats        | `stats.custom`  | (MetricsPanel) | Numeros que sostienen la promesa. Prueba cuantitativa |
| 6     | testimonials | `testimonials.custom` | `single` (1 potente) / `grid` (3+) | Prueba social + confianza (ATIDCOA). single usa metric asociado |
| 7     | logo-cloud   | `logo-cloud.custom` | (LogoBar) | Logos de clientes refuerzan confianza |
| 8     | faq          | `faq.custom`    | (FaqAccordion) | Elimina objeciones antes del cierre |
| 9     | cta          | `cta.custom`    | `form` | Captura de leads inline. Oferta + accion (ATIDCOA). Dispara cms_provision_leads |

> Header/Footer: `SiteHeader` + `SiteFooter` via Settings (logo, nav, CTA, social).

### Paginas adicionales tipicas para `leads`

- `nosotros`: hero.custom (minimal) -> split-content.custom -> team.custom -> stats.custom
- `gracias`: hero.custom (minimal, mensaje de confirmacion)

---

## 2. objetivo: `venta` -- Producto / Pricing / E-commerce

Lleva al usuario a comparar y comprar. El centro de gravedad es `pricing.custom`.

### Pagina: `home`

| Orden | blockType     | templateId        | variant recomendado | Razon de la seccion |
| ----- | ------------- | ----------------- | ------------------- | ------------------- |
| 1     | hero          | `hero.custom`     | `split` / `metrics` | El producto es protagonista. Split para mostrarlo |
| 2     | pain          | `pain.custom`     | `cards` | El problema que el producto resuelve |
| 3     | features      | `features.custom` | `alternating` / `grid` | Features con imagen-texto alternada |
| 4     | video-embed   | `video-embed.custom` | (source segun asset) | Demo en video. Omitir si no hay video |
| 5     | pricing       | `pricing.custom`  | (toggle interno) | Planes y precios. Plan destacado para conversion |
| 6     | testimonials  | `testimonials.custom` | `grid` | Cards con foto y empresa generan credibilidad |
| 7     | faq           | `faq.custom`      | (FaqAccordion) | Objeciones de precio, garantia, cancelacion |
| 8     | cta           | `cta.custom`      | `banner` / `form` | Cierre. Banner para trial; form para captura |

### Pagina: `pricing` (independiente)

```
hero.custom (minimal, propuesta de valor)
pricing.custom
faq.custom (preguntas de precio)
cta.custom (banner)
```

---

## 3. objetivo: `autoridad` -- Institucional / Thought Leadership

Construye credibilidad a largo plazo. Mas contenido editorial, equipo e historia.

### Pagina: `home`

| Orden | blockType     | templateId        | variant recomendado | Razon de la seccion |
| ----- | ------------- | ----------------- | ------------------- | ------------------- |
| 1     | hero          | `hero.custom`     | `fullscreen` / `minimal` | Imagen de marca fuerte o tipografia pura |
| 2     | split-content | `split-content.custom` | (imagePosition) | Manifiesto: por que existimos, que creemos |
| 3     | stats         | `stats.custom`    | (MetricsPanel) | Numeros de impacto, no de ventas |
| 4     | logo-cloud    | `logo-cloud.custom` | (LogoBar) | Clientes / partners |
| 5     | blog-list     | `blog-list.custom` | `featured` / `grid` | Contenido editorial como prueba de autoridad |
| 6     | team          | `team.custom`     | (TeamGrid) | Humaniza la marca |
| 7     | testimonials  | `testimonials.custom` | `grid` | Citas de referentes |
| 8     | cta           | `cta.custom`      | `banner` | Multiples acciones editoriales |

### Pagina: `nosotros`

```
hero.custom (split, foto del equipo con headline de mision)
split-content.custom (historia)
team.custom
stats.custom
gallery.custom (cultura, oficinas -- si hay assets)
cta.custom (banner)
```

---

## 4. objetivo: `booking` -- Agenda de citas / Servicios / Consulting

Optimizada para reservar. Friction minima; el CTA primario abre form de fecha/hora.

### Pagina: `home`

| Orden | blockType    | templateId        | variant recomendado | Razon de la seccion |
| ----- | ------------ | ----------------- | ------------------- | ------------------- |
| 1     | hero         | `hero.custom`     | `split` / `minimal` | Headline de servicio + CTA "Agendar" |
| 2     | steps        | `steps.custom`    | `vertical` / `linear` | Como funciona la reserva en 3 pasos |
| 3     | features     | `features.custom` | `grid` | Que incluye cada sesion o paquete |
| 4     | stats        | `stats.custom`    | (MetricsPanel) | Sesiones realizadas, anos de experiencia |
| 5     | gallery      | `gallery.custom`  | `grid` / `carousel` | El lugar, el estudio, el entorno |
| 6     | testimonials | `testimonials.custom` | `single` | El boca a boca es el cierre en servicios personales |
| 7     | pricing      | `pricing.custom`  | (toggle) | Paquetes y tarifas |
| 8     | faq          | `faq.custom`      | (FaqAccordion) | Duracion, precio, modalidad, cancelacion |
| 9     | contact      | `contact.custom`  | (ContactSection) | Formulario de booking. Dispara cms_provision_leads |

---

## Paginas secundarias universales (cualquier objetivo)

- `contacto`: hero.custom (minimal) -> contact.custom
- `precios`: hero.custom (minimal) -> pricing.custom -> faq.custom -> cta.custom (form)
- `blog`: hero.custom (minimal) -> blog-list.custom (grid) -> newsletter.custom

---

## Notas de uso para el skill

1. Leer el campo `objetivo` del brief antes de seleccionar una receta.
2. Si la marca tiene `maasy_project_id`, el DNA viene de `maasy_get_brand_dna`; priorizarlo.
3. Cada blockType custom acepta el campo `variant` (cuando aplica). Setealo segun el
   tono del DNA usando el catalogo de variants de arriba. Si el variant no existe, el
   componente usa su default sin romper.
4. Elegir variant de testimonials (`testimonials.custom`) segun cantidad disponible:
   - 1 testimonio potente: variant `single` (con `metric` asociado).
   - 2+: variant `grid`.
5. `pain.custom` lleva `cards[].data` con el dato duro del dolor (ej "-30% picking").
   Si no hay dato, usar variant `statement`.
6. `features.custom` variant `pillars` usa `items[].code` (ej "POD", "SLA", "COD").
7. Cuando la marca no tiene video, omitir `video-embed.custom` silenciosamente.
8. Antes de fijar el plan de bloques, invocar `impeccable` o `ui-ux-pro-max` pasando
   el DNA y la lista de bloques para validar jerarquia y coherencia visual antes de
   ejecutar cualquier tool de escritura.
9. Header/Footer (`SiteHeader`/`SiteFooter`) NO van como page.blocks: se configuran
   en Settings (logo, navLinks, cta, footer links, social) y el layout custom los
   renderiza. El skill los setea en el bootstrap del tenant.

## Variants disponibles por blockType custom

hero: metrics/split/minimal/fullscreen | features: grid/pillars/alternating |
pain: cards/statement | steps: linear/vertical/grid | testimonials: single/grid |
cta: banner/form | gallery: masonry/grid/carousel | blog-list: grid/list/featured |
split-content: imagePosition left/right | video-embed: source youtube/vimeo/direct |
stats, pricing, team, contact, faq, logo-cloud, newsletter: layout interno (sin variant).
Total: 17 blockTypes custom + SiteHeader/SiteFooter via Settings.
