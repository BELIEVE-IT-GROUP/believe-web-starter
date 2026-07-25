# Captura de leads en Puck Believe

Referencia canónica para que **cualquier landing nueva** del CMS capture leads sin trabajo extra.
Última actualización: 2026-07-08.

## Cómo funciona (en una frase)

Todo `<form>` de una landing que postee a **`/api/contact`** queda capturado: se guarda un respaldo en el
CMS, se notifica por email, y se reenvía a n8n, que rutea a los CRMs (Maasy + Zoho) con atribución de campaña.

## El contrato del formulario

Un form nuevo solo necesita:

```html
<form action="/api/contact" method="post">
  <input type="hidden" name="_tenant"  value="<slug-del-tenant>">
  <input type="hidden" name="_subject" value="<asunto legible>">
  <!-- campos visibles: usar estos names para que el CRM los mapee -->
  <input name="nombre">   <input name="empresa">  <input name="cargo">
  <input name="correo" type="email">  <input name="telefono" type="tel">
  <select name="servicio">…</select>  <select name="envios">…</select>
  <button type="submit">Enviar</button>
</form>
```

- **POST nativo, sin JS** (funciona en el blockSet `raw` que se renderiza SSR). La respuesta es una página
  de "gracias" on-brand.
- **Campaña / UTM**: NO hay que agregar nada al form. El cliente (`RawReveal`) lee `utm_campaign/source/medium`
  de la URL del anuncio y **inyecta campos ocultos** (`_campaign`, `_utm_*`) en todos los forms de la página.
  Si no hay UTM, `_campaign` cae en `<tenant>-web`.
- Landings con JS propio (ej. `birdman`): el form hace `fetch('/api/contact', {method:'POST', body: JSON})`
  incluyendo `_tenant`, `_subject`, `_campaign` + UTM leídos de `location.search`.

## Qué hace `/api/contact` (`src/app/api/contact/route.ts`)

Acepta form nativo (urlencoded) **y** JSON. Por cada lead:

1. **Respaldo**: escribe `data/pages/_leads/<tenant>/<ts>-<rand>.json` en el volumen persistente
   (`puck-cms-pages`). Sobrevive redeploys. Es el respaldo de verdad, no depende de nada externo.
2. **Webhook** (si `LEADS_WEBHOOK_URL`): reenvía el lead completo (fire-and-forget) → n8n.
3. **Email** (si `PLUNK_API_KEY` + `LEADS_NOTIFY_EMAIL`): notifica por correo (Plunk self-hosted).
4. Responde página de gracias (form nativo) o `{ok:true}` (JSON).

Campos capturados: `_tenant, _subject, _campaign, _utm_source, _utm_medium, _utm_content, _utm_term` +
`nombre, empresa, cargo, correo, telefono, volumen, envios, servicio, mensaje`.

## El flujo en n8n

Workflow **"🧲 Grupo ORVIA · Leads Intake"** (id `6Y5Dr9f1lHHe1d4e`, flows.believe-global.com):

```
Webhook (/webhook/grupo-orvia-leads)
├─ Zoho CRM · crear Lead        → TODAS las marcas (HTTP → zohoapis.com/crm/v2/Leads, cred OAuth "Zoho account")
└─ Ruta por marca (Switch _tenant)
   ├─ EnviaYa!  → CRM Maasy (landing-lead-capture, project_id 9d86d079…)
   ├─ Trust     → CRM Maasy (landing-lead-capture, project_id 06550ddf…)
   ├─ Birdman   → (no está en Maasy)
   ├─ Grupo ORVIA
   └─ Otros
```

- **Maasy CRM**: `POST https://esptwxlgdbblvnmdpoao.supabase.co/functions/v1/landing-lead-capture`
  con `{name, email, phone, company, project_id, source:_campaign}`. Solo marcas que existen en Maasy.
- **Zoho CRM**: HTTP Request con credencial `zohoOAuth2Api` ("Zoho account"). `Lead_Source = _campaign`,
  UTM en `Description`. Región `.com` (cambiar dominio si el cliente migra de datacenter).
- Para **agregar una marca al CRM Maasy**: duplicar la rama del Switch y poner su `project_id`.

## Variables de entorno (puck-cms.env en Contabo)

| Var | Para qué |
|---|---|
| `LEADS_WEBHOOK_URL` | webhook de n8n (activa el reenvío) |
| `LEADS_NOTIFY_EMAIL` | destinatario del email de notificación |
| `PLUNK_API_KEY` + `PLUNK_API_BASE` | envío de email (Plunk self-hosted `api.mailing.believe-global.com`) |
| `MAASY_FUNCTIONS_URL` + `MAASY_PUBLISHABLE_KEY` | llamadas a Maasy (CRM + AOS) |

Emails a varios destinatarios: hoy `LEADS_NOTIFY_EMAIL` es uno; para varios, sumar recipients (CMS o rama email en n8n).

## Checklist para una landing nueva

- [ ] El form postea a `/api/contact` con `_tenant` (= slug) y `_subject`.
- [ ] Names de los campos según la tabla de arriba (para que mapeen al CRM).
- [ ] Si la marca está en Maasy: agregar su rama con `project_id` en el workflow n8n.
- [ ] Campaña/UTM: automático, no requiere nada.
- [ ] Probar: enviar un lead con `?utm_campaign=test` y verificar respaldo + ejecución n8n + Zoho.
