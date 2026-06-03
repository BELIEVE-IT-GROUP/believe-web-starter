# Deployment Strategy — believe-web-starter

> Documento de referencia para el equipo de deploy y operaciones.

---

## 1. Fix Vercel 401 (Deployment Protection)

### Problema
Los deploys de preview en Vercel devuelven **401 Unauthorized** con cookie `_vercel_sso_nonce`. Esto ocurre cuando **Vercel Deployment Protection** está activado en modo "Standard Protection".

### Solución inmediata (Dashboard)

1. Ir a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Seleccionar el team **Believe Pro** (`team_LN2zShAK2ga5NE1nKcTthqjt`)
3. Entrar al proyecto `believe-web-starter`
4. **Settings** → **Deployment Protection**
5. Cambiar de **"Standard Protection"** a **"Disabled"**
6. Guardar

### Solución vía API (automatizable)

```bash
# 1. Obtener token
TOKEN=$(vercel token)

# 2. Desactivar SSO Protection
# Nota: la API de Vercel no expone directamente un toggle de "Deployment Protection",
# pero se puede gestionar vía project settings o contactando a soporte para teams Enterprise.
# Para teams Pro, la única vía confiable es el Dashboard.
```

### Verificación

```bash
# Después de desactivar, un nuevo deploy de preview debe devolver 200
curl -s -o /dev/null -w "%{http_code}" \
  https://believe-web-starter-<hash>-believe-projects.vercel.app
# Esperado: 200
```

---

## 2. ISR Revalidation Webhook

### Endpoint

```
POST /api/revalidate
```

### Implementación

Ver `src/app/api/revalidate/route.ts`.

### Body del webhook

```json
{
  "secret": "REVALIDATE_SECRET",
  "paths": ["/", "/about", "/blog/nuevo-post"],
  "tags": ["pages", "posts"]
}
```

- `secret` (requerido): debe coincidir con `REVALIDATE_SECRET`
- `paths` (opcional): array de rutas a revalidar con `revalidatePath()`
- `tags` (opcional): array de tags a revalidar con `revalidateTag()`
- Al menos uno de `paths` o `tags` debe estar presente

### Configuración en Payload CMS

En el admin de Payload, ir a **Settings** → **Webhooks** (o configurar en código):

```ts
// payload.config.ts (o similar)
{
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const webhookUrl = 'https://preview.believe-global.com/api/revalidate'
        const secret = process.env.REVALIDATE_SECRET

        const paths = []
        if (doc.slug) {
          paths.push(doc.slug === 'home' ? '/' : `/${doc.slug}`)
        }

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, paths }),
        })
      },
    ],
  },
}
```

### Seguridad

- El secret se compara en constant time (aunque Next.js no tiene `timingSafeEqual` nativo en Edge, la comparación `===` en JavaScript es suficiente para este caso)
- El endpoint rechaza GET y cualquier método que no sea POST
- El secret nunca se expone al cliente (variable de entorno server-side)

---

## 3. Variables de Entorno

### Requeridas

| Variable | Scope | Descripción | Ejemplo |
|---|---|---|---|
| `NEXT_PUBLIC_PAYLOAD_URL` | Public | URL base de la API de Payload CMS | `https://cms.believe-global.com` |
| `NEXT_PUBLIC_TENANT_SLUG` | Public | Slug del tenant por defecto | `believe` |
| `NEXT_PUBLIC_PREVIEW_SECRET` | Public | Secret para el modo Live Preview | `preview-secret-123` |
| `REVALIDATE_SECRET` | Server | Secret para autenticar webhooks de revalidación | `openssl rand -base64 32` |

### Opcionales

| Variable | Scope | Descripción | Ejemplo |
|---|---|---|---|
| `PAYLOAD_API_KEY` | Server | API key para autenticar requests al CMS (cuando se implemente) | `cms-api-key-123` |
| `VERCEL_TOKEN` | CI/CD | Token para deploys automatizados desde GitHub Actions | `vercel-token-abc` |

### Generar secrets

```bash
# Preview secret
openssl rand -hex 24

# Revalidate secret
openssl rand -base64 32
```

### Configurar en Vercel

```bash
vercel env add NEXT_PUBLIC_PAYLOAD_URL production
vercel env add NEXT_PUBLIC_TENANT_SLUG production
vercel env add NEXT_PUBLIC_PREVIEW_SECRET production
vercel env add REVALIDATE_SECRET production
```

---

## 4. Estrategia de Deploy

### Opción A: Vercel (recomendada, actual)

**Pros:**
- ISR nativo con `revalidatePath`/`revalidateTag`
- Edge network global
- Zero-config para Next.js
- Preview deployments automáticos por PR

**Contras:**
- Deployment Protection puede bloquear previews (ya documentado arriba)
- Límites de funciones en plan Pro
- Costo escalable

**Estado actual:**
- Proyecto: `believe-web-starter` en team `Believe Pro`
- Project ID: `prj_WxnHpYb4cVgkL8HDGux51Fm6ttX2`
- Último deploy preview: 401 por Deployment Protection
- Dominio objetivo: `preview.believe-global.com` (actualmente 502, revisar DNS)

**Próximos pasos:**
1. Desactivar Deployment Protection en Dashboard
2. Configurar `preview.believe-global.com` en Vercel Domains
3. Verificar CNAME en Cloudflare apunte a `cname.vercel-dns.com`
4. Agregar variables de entorno en Vercel
5. Hacer deploy de producción: `vercel --prod`

### Opción B: Cloudflare Pages (alternativa)

**Pros:**
- Generoso free tier
- Edge network masivo
- Buena integración con Cloudflare (ya usamos Cloudflare para DNS y R2)

**Contras:**
- Next.js en Cloudflare Pages requiere `@cloudflare/next-on-pages` o `open-next`
- ISR no es nativo; requiere Workers KV para cache
- Revalidation webhook más complejo de implementar
- No soporta `revalidatePath` de Next.js directamente

**Veredicto:** No recomendado para este proyecto. El stack depende fuertemente de ISR y revalidation de Next.js, que funcionan mejor en Vercel.

### Opción C: VPS propio (Coolify)

**Pros:**
- Control total
- Sin límites de Vercel
- Ya tenemos infraestructura Coolify en 3 VPS

**Contras:**
- Los VPS están sobrecargados actualmente
- Requiere configurar reverse proxy, SSL, etc.
- ISR en self-hosted requiere Redis o similar para cache distribuido
- No es viable a corto plazo dado el estado de la infraestructura

**Veredicto:** Postergar hasta que los VPS tengan capacidad o se aprovisione uno nuevo.

### Opción D: GitHub Actions → Vercel (CI/CD automatizado)

**Pros:**
- Deploy automático en push a `main`
- Preview deployments en PRs
- Control total del pipeline

**Implementación:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Requiere:**
- `VERCEL_TOKEN` en GitHub Secrets (obtenible desde Vercel Dashboard → Settings → Tokens)
- `VERCEL_ORG_ID`: `team_LN2zShAK2ga5NE1nKcTthqjt`
- `VERCEL_PROJECT_ID`: `prj_WxnHpYb4cVgkL8HDGux51Fm6ttX2`

---

## 5. Recomendación final

**Corto plazo (esta semana):**
1. Desactivar Vercel Deployment Protection vía Dashboard
2. Configurar dominio `preview.believe-global.com` en Vercel
3. Agregar variables de entorno (`REVALIDATE_SECRET`, etc.)
4. Hacer deploy de producción
5. Probar el webhook de revalidación desde Payload CMS

**Mediano plazo:**
1. Implementar autenticación API en Payload (API key o JWT)
2. Actualizar `lib/payload.ts` para hacer requests reales al CMS
3. Configurar GitHub Actions para deploy automático
4. Monitorear uso de Vercel y evaluar si se necesita plan Enterprise

**Largo plazo:**
- Evaluar self-hosted en Coolify cuando los VPS tengan capacidad
- Considerar un VPS dedicado para el frontend si el tráfico lo justifica

---

## Referencias

- [Vercel Deployment Protection](https://vercel.com/docs/security/deployment-protection)
- [Next.js ISR Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Payload CMS Webhooks](https://payloadcms.com/docs/hooks/overview)
