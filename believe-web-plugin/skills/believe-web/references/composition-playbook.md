# Composition Playbook -- Recetas por objetivo

Mapea cada `objetivo` del brief a una estructura de pagina recomendada con
multiples opciones de templateId por seccion. Todos los templateId son REALES
del catalogo (133 variantes). No inventes ids: si dudas, corre
`cms_list_block_templates({ blockType })`.

Reglas duras:
- Toda pagina arranca con `header.*` y termina con `footer.*`.
- La home siempre tiene `hero.*` como primer bloque despues del header.
- El bloque de captura de leads (el que dispara `cms_provision_leads`) es
  `contact.*` o `cta.email-signup`. Debe aparecer en toda pagina con objetivo
  `leads` o `booking`.

## Como elegir variante segun el DNA

- Tono `premium` / `authoritative` / `minimalist`: variantes sobrias
  (`hero.default`, `hero.cover-image-ctas`, `features.icons-list`,
  `pricing.feature-list`). Menos ornamento, mas aire.
- Tono `playful` / `warm` / `bold`: variantes con imagen e ilustracion
  (`hero.visual-image-heading`, `hero.illustration-email-signup`,
  `features.image-list`, `gallery.portfolio-carousel`).
- Tono `conversational`: prioriza prueba social y FAQ
  (`testimonials.carousel-slider`, `faq.accordion`).
- Marca con producto visual fuerte (moda, comida, viajes, diseno): suma
  `gallery.*` y `split-content.heading-images`.
- Elegir variantes las variantes storefront (`hero.storefront-default`, `hero.storefront-full-slider`, `hero.storefront-grid-view`) para marcas de e-commerce o
  comercio fisico con catalogo de productos.

---

## 1. objetivo: `leads` -- Landing de captacion

La home esta optimizada para una sola accion: dejar datos. CTA repetido,
friccion minima, prueba social arriba del pliegue inferior.

### Pagina: `home`

| Orden | blockType    | Opciones de templateId (primera = recomendada) | Razon de la seccion |
| ----- | ------------ | ----------------------------------------------- | ------------------- |
| 1     | header       | `header.default` / `header.centered` | Navbar simple, un solo CTA visible, sin mega-menu que distraiga |
| 2     | hero         | `hero.illustration-email-signup` / `hero.email-signup-video` / `hero.cover-image-ctas` | Captura inline en el hero = menor friction. Elegir segun si hay video o imagen de producto |
| 3     | logo-cloud   | `logo-cloud.default` / `logo-cloud.4-columns` | Logos de clientes justo bajo el hero generan confianza antes de explicar el producto |
| 4     | features     | `features.icons-list` / `features.description-icon-list` / `features.card-list` | 3-6 beneficios. Icons-list es el mas escaneable. Description agrega parrafo intro para leads B2B |
| 5     | stats        | `stats.default` / `stats.card-statistics` | 3 numeros grandes (clientes, proyectos, anos). Prueba cuantitativa |
| 6     | testimonials | `testimonials.grid-layout-cards` / `testimonials.carousel-slider` / `testimonials.blockquote` | Prueba social cualitativa. Grid para 3+ testimonios; blockquote para 1 testimonio poderoso |
| 7     | faq          | `faq.accordion` / `faq.default` | Elimina objeciones antes del form. Accordion para 6+ preguntas |
| 8     | contact      | `contact.default` / `contact.company-information` | Formulario de cierre. El mas simple posible. Company-info si la marca quiere mostrar telefono y email |
| 9     | cta          | `cta.default` / `cta.heading-button` | CTA final sobre color de marca. Repite el headline con boton grande |
| 10    | footer       | `footer.default` | Footer minimo, sin mapa de sitio extenso que distraiga |

### Paginas adicionales tipicas para `leads`

- `nosotros`: header.default -> hero.default -> split-content.heading-images -> team.default -> stats.heading-statistics -> footer.default
- `gracias`: header.default -> hero.default (mensaje de confirmacion) -> footer.default

---

## 2. objetivo: `venta` -- Producto / Pricing / E-commerce

Lleva al usuario a comparar y comprar. El centro de gravedad es `pricing`.

### Pagina: `home`

| Orden | blockType     | Opciones de templateId (primera = recomendada) | Razon de la seccion |
| ----- | ------------- | ----------------------------------------------- | ------------------- |
| 1     | header        | `header.dropdown` / `header.mega-menu` | Con dropdown para navegar a Producto, Precios y Blog |
| 2     | hero          | `hero.app-preview-ctas` / `hero.screenshot-download` / `hero.storefront-full-slider` | El producto es el protagonista. App-preview para SaaS; storefront para e-commerce |
| 3     | logo-cloud    | `logo-cloud.cards-cta` / `logo-cloud.heading-grid` | Logos de clientes con CTA a casos de uso |
| 4     | features      | `features.alternate` / `features.image-list` / `features.comparison` | Imagen-texto alternada para 3-4 features. Comparison si el diferencial vs competencia es claro |
| 5     | video-embed   | `video-embed.content-video` | Demo en video reduce tiempo de decision. Omitir si no hay video de producto |
| 6     | pricing       | `pricing.highlighted-plan` / `pricing.toggle` / `pricing.comparison-table` | Highlighted para conversion optima. Toggle para SaaS con billing mensual/anual. Comparison cuando hay muchas diferencias entre tiers |
| 7     | testimonials  | `testimonials.cards` / `testimonials.tabs` | Cards con foto y empresa generan credibilidad. Tabs por industria si los clientes son muy distintos |
| 8     | faq           | `faq.accordion` / `faq.default` | Responde objeciones de precio, garantia, cancelacion |
| 9     | cta           | `cta.heading-button` / `cta.two-cards` | Cierre activo. Two-cards para dos opciones: trial vs demo |
| 10    | footer        | `footer.sitemap-links` / `footer.sitemap-logo` | Footer con mapa de sitio completo para paginas multi-seccion |

### Pagina: `pricing` (independiente)

```
header.dropdown
hero.default          (headline de propuesta de valor)
pricing.highlighted-plan  o  pricing.comparison-table
faq.accordion         (preguntas especificas de precio)
cta.default
footer.default
```

### Pagina: `producto` (detalle de feature principal)

```
header.dropdown
hero.app-preview-ctas  o  hero.visual-image-heading
features.alternate
split-content.feature-list
video-embed.content-video   (si existe video)
testimonials.blockquote     (1 testimonio anchor de cliente conocido)
cta.heading-button
footer.default
```

---

## 3. objetivo: `autoridad` -- Institucional / Thought Leadership

Construye credibilidad a largo plazo. Mas contenido editorial, equipo e
historia. Menos venta directa.

### Pagina: `home`

| Orden | blockType     | Opciones de templateId (primera = recomendada) | Razon de la seccion |
| ----- | ------------- | ----------------------------------------------- | ------------------- |
| 1     | header        | `header.mega-menu` / `header.dropdown` | Mega-menu refleja amplitud: soluciones, industrias, recursos, empresa |
| 2     | hero          | `hero.background-cover-ctas` / `hero.blog-posts-featured` / `hero.carousel` | Imagen de marca fuerte. Blog-posts como hero si la marca tiene mucho contenido. Carousel para hitos |
| 3     | split-content | `split-content.heading-description` / `split-content.heading-images` | Manifiesto de la empresa: por que existimos, que creemos |
| 4     | stats         | `stats.illustration` / `stats.content-social-proof` / `stats.heading-statistics` | Numeros de impacto, no de ventas. Illustration da tono mas editorial |
| 5     | logo-cloud    | `logo-cloud.cards-description` / `logo-cloud.cards-cta` | Logos con descripcion breve. Mas narrativo que una fila de logos solos |
| 6     | blog-list     | `blog-list.featured-post` / `blog-list.card-with-image` / `blog-list.centered-posts` | Contenido editorial como prueba de autoridad. Solo si la marca publica con regularidad |
| 7     | team          | `team.description` / `team.four-columns` / `team.grid-clean` | Humaniza la marca. Description para fundadores con bio. Four-columns para equipo amplio |
| 8     | testimonials  | `testimonials.tabs` / `testimonials.carousel-slider` | Tabs por industria demuestra amplitud. Carousel para citas de referentes conocidos |
| 9     | cta           | `cta.cards-icons` / `cta.heading-button` | Cards-icons para multiples acciones editoriales: leer blog, ver casos, hablar con nosotros |
| 10    | footer        | `footer.sitemap-logo` / `footer.sitemap-links` | Footer institucional con logo grande y links de prensa/legal |

### Pagina: `nosotros`

```
header.mega-menu
hero.cover-image-ctas      (foto del equipo con headline de mision)
split-content.heading-description   (historia de la empresa)
team.cta-grid
stats.card-statistics
gallery.portfolio-default  (fotos de eventos, oficinas, cultura -- si existen)
cta.heading-button         ("Sumate al equipo" o "Hablemos")
footer.sitemap-logo
```

### Pagina: `blog` o `recursos`

```
header.mega-menu
hero.blog-posts-featured  o  hero.default
blog-list.card-with-image
newsletter.banner
footer.newsletter
```

---

## 4. objetivo: `booking` -- Agenda de citas / Servicios / Consulting

Optimizada para que el usuario reserve una sesion, consulta o turno. Friction
minima; el CTA primario abre un calendario o form de fecha/hora.

### Pagina: `home`

| Orden | blockType    | Opciones de templateId (primera = recomendada) | Razon de la seccion |
| ----- | ------------ | ----------------------------------------------- | ------------------- |
| 1     | header       | `header.default` / `header.centered` | Navbar simple con un solo CTA: "Reservar" o "Agendar ahora" |
| 2     | hero         | `hero.search-datepicker` / `hero.signup-cta` / `hero.video-embed-cta` | Search-datepicker para reserva de fecha inline. Signup-cta si es form simple. Video si existe presentacion del profesional |
| 3     | split-content | `split-content.heading-images` / `split-content.two-columns` | "Como funciona" en 3 pasos con imagenes. Reduce ansiedad del proceso de agenda |
| 4     | features     | `features.icon-list-cta` / `features.icons-list` | Que incluye cada sesion o paquete. Icon-list-cta tiene CTA inline por feature |
| 5     | stats        | `stats.default` / `stats.heading-statistics` | Sesiones realizadas, clientes atendidos, anos de experiencia |
| 6     | gallery      | `gallery.portfolio-carousel` / `gallery.image-gallery` | Mostrar el lugar, el estudio, el entorno del servicio |
| 7     | testimonials | `testimonials.blockquote` / `testimonials.grid-layout-cards` | En servicios personales el boca a boca digital es el cierre mas fuerte. Blockquote para 1 testimonio potente |
| 8     | pricing      | `pricing.horizontal` / `pricing.default` | Paquetes y tarifas. Horizontal para 2-3 opciones simples |
| 9     | faq          | `faq.accordion` / `faq.customer-service` | Preguntas sobre duracion, precio, modalidad, cancelacion |
| 10    | contact      | `contact.default` / `contact.address-location` | Formulario de booking. El bloque mas visible de la pagina. Address-location si hay ubicacion fisica |
| 11    | cta          | `cta.default` / `cta.heading-button` | CTA de remate: "Reservar mi lugar" o "Agendar sesion" |
| 12    | footer       | `footer.default` | Footer minimo |

### Paginas adicionales tipicas para `booking`

- `servicios`: header -> hero.default -> features.alternate -> pricing.horizontal -> faq.accordion -> contact.default -> footer.default
- `sobre-mi` / `nosotros`: header -> hero.default -> split-content.heading-description -> team.description -> gallery.image-gallery -> footer.default

---

## Paginas secundarias universales (cualquier objetivo)

- `contacto`: header.default -> hero.default -> contact.address-location -> footer.default
- `precios`: header.default -> hero.default -> pricing.comparison-table -> faq.default -> cta.email-signup -> footer.default
- `blog`: header.default -> hero.default -> blog-list.card-with-image -> newsletter.default -> footer.default

---

## Notas de uso para el skill

1. Leer el campo `objetivo` del brief antes de seleccionar una receta.
2. Si la marca tiene `maasy_project_id`, el DNA viene de `maasy_get_brand_dna`; priorizarlo.
3. Cuando la marca no tiene video, omitir `video-embed` silenciosamente.
4. Elegir variante de testimonials segun cantidad disponible:
   - 1 testimonio: `testimonials.blockquote`
   - 2-4: `testimonials.cards`
   - 5+: `testimonials.carousel-slider` o `testimonials.grid-layout-cards`
5. `cta.email-signup` es redundante si ya hay `contact.default` o `newsletter.*`. No duplicar.
6. Para marcas e-commerce, preferir variantes las variantes storefront (`hero.storefront-default`, `hero.storefront-full-slider`, `hero.storefront-grid-view`) y `faq.customer-service`.
7. `blog-list.*` solo si la marca confirma que publicara contenido regularmente.
8. Antes de fijar el plan de bloques, invocar `ui-ux-pro-max` o `impeccable` pasando el DNA
   y la lista de bloques para validar coherencia visual antes de ejecutar cualquier tool de escritura.

## Variantes disponibles por blockType

hero 22 | features 10 | pricing 7 | testimonials 5 | cta 13 | faq 6 | stats 7 |
team 8 | logo-cloud 5 | gallery 6 | contact 6 | split-content 6 | video-embed 3 |
newsletter 5 | blog-list 9 | header 8 | footer 7 | Total: 133
