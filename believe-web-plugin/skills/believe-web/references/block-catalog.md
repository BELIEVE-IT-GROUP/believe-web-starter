# Block Catalog - Referencia rapida

Cada fila = un blockType disponible en el CMS. Usar templateId exacto al componer paginas.

| blockType | Variantes | Para que sirve |
|---|---|---|
| `header` | 8 | Navegacion superior. Siempre el primer bloque de cada pagina. Opciones: logo centrado, dropdown, mega-menu, busqueda, user-dropdown. |
| `hero` | 22 | Primer impacto visual de la pagina. Convierte atencion en interes. Opciones: imagen de fondo, signup de email, app preview, carrusel, storefront, mockup de celular, video embed. |
| `features` | 10 | Explica los beneficios/funcionalidades del producto o servicio. Variantes con iconos, imagenes, cards, comparacion, alternancia imagen-texto. |
| `pricing` | 7 | Muestra planes y precios. Variantes con toggle mensual/anual, plan destacado, tabla de comparacion, horizontal, feature list por plan. |
| `testimonials` | 5 | Prueba social con citas de clientes. Variantes: blockquote, carrusel, grid de cards, tabs por industria. |
| `cta` | 13 | Llamada a la accion standalone o como cierre de seccion. Incluye banners de anuncio/lanzamiento, CTA de email, app movil, QR, dos-cards. |
| `faq` | 6 | Resuelve objeciones antes del cierre. Variantes: accordion, grid 3 columnas, help center con/sin busqueda, customer service e-commerce. |
| `stats` | 7 | Numeros que generan confianza (clientes, proyectos, anos). Variantes: cards, carrusel, heading+stats, iconos+CTA, ilustracion, social-proof de contenido. |
| `team` | 8 | Muestra el equipo o personas detras de la marca. Variantes: cards default, carrusel, grid 4 col, overlay zoom, con descripcion de empresa. |
| `logo-cloud` | 5 | Logos de clientes o partners. Variantes: fila default, grid 4 col, cards+CTA, cards+descripcion, heading+grid. |
| `gallery` | 6 | Portafolio o galeria de imagenes/proyectos. Variantes: galeria simple, portafolio default, alternado, carrusel, imagen destacada, grid con preview. |
| `contact` | 6 | Formulario de contacto o captura de leads. Variantes: default, con direccion/mapa, imagen de fondo, info de empresa, help center, links de contacto. |
| `split-content` | 6 | Seccion de contenido en dos columnas, texto e imagen. Variantes: dos-columnas, heading+descripcion, heading+imagenes, feature list, card-images, tabla de contenidos. |
| `video-embed` | 3 | Integra un video (YouTube/Vimeo). Variantes: seccion de contenido, hero con CTA, hero con email signup. |
| `newsletter` | 5 | Captura de suscriptores. Variantes: default, banner, card de signup, modal, popup. |
| `blog-list` | 9 | Lista de articulos o contenido editorial. Variantes: default, card+imagen, posts centrados, post destacado, list+heading; variantes publisher para articulos relacionados. |
| `footer` | 7 | Pie de pagina. Variantes: default, sitemap+links, sitemap+logo, redes sociales, newsletter integrado, pre-footer CTA, flowbite-footer. |

**Total: 133 templates** en 17 blockTypes.

## Reglas de uso

- `header` y `footer` van siempre como primer y ultimo bloque de cada pagina.
- Un bloque `cta` intermedio (entre features y testimonials, o entre pricing y footer) mejora la conversion en paginas largas.
- `newsletter` y `contact` son mutuamente excluyentes en la misma pagina salvo casos especificos (ej: landing de lanzamiento + pagina separada de contacto).
- `video-embed` requiere URL de video real; si la marca no tiene video, preferir `hero.visual-image-heading` o `split-content.heading-images`.
