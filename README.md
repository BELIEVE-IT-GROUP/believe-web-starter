# believe-web-starter

Starter frontend para [Believe Agency CMS](https://github.com/BELIEVE-IT-GROUP/believe-agency-cms) — Next.js 15 + Tailwind + Flowbite Blocks Pro.

## Características

- **15 bloques de contenido**: Hero, Features, CTA, Split Content, Stats, Testimonials, Pricing, FAQ, Logo Cloud, Team, Gallery, Video Embed, Blog List, Contact, Newsletter
- **Multi-tenant**: Renderiza contenido filtrado por tenant desde Payload CMS
- **ISR**: Incremental Static Regeneration con revalidation cada 60s + webhook
- **Live Preview**: Ruta `/api/preview` para previsualizar cambios desde el CMS
- **Flowbite Pro**: Componentes premium con diseño profesional
- **TypeScript end-to-end**: Tipos compartidos entre CMS y frontend

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + Flowbite React
- Payload CMS 3 (REST API)

## Empezar

### 1. Clonar y configurar

```bash
git clone https://github.com/BELIEVE-IT-GROUP/believe-web-starter.git
cd believe-web-starter
pnpm install
```

### 2. Variables de entorno

Copiar `.env.example` a `.env.local`:

```env
NEXT_PUBLIC_PAYLOAD_URL=https://cms.believe-global.com
NEXT_PUBLIC_TENANT_SLUG=mi-cliente
NEXT_PUBLIC_PREVIEW_SECRET=preview-secret-123
```

### 3. Correr dev server

```bash
pnpm dev
```

### 4. Build y deploy

```bash
pnpm build
```

Deploy en Vercel (recomendado) o cualquier plataforma con Node.js 18+.

## Estructura

```
src/
  app/
    page.tsx           # Homepage con ISR
    layout.tsx         # Root layout + Header/Footer
    globals.css        # Tailwind + CSS variables
    api/
      preview/route.ts # Live preview API
      revalidate/route.ts # ISR webhook
  components/
    blocks/            # 15 block components
      BlockRenderer.tsx
      HeroBlock.tsx
      FeaturesBlock.tsx
      ...
    layout/
      Header.tsx
      Footer.tsx
  lib/
    payload.ts         # CMS API client
    tenant-style.tsx   # CSS variables per tenant
```

## Contratos CMS → Frontend

Cada bloque en Payload CMS tiene un `blockType` que mapea 1:1 con componentes React. Ver `BlockRenderer.tsx` para el mapeo completo.

## Licencia

MIT — Believe Global
