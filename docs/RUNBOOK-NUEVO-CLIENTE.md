# Runbook — Nueva web/landing en serie

Fábrica de webs Believe: CMS multitenant (`cms.believe-global.com`) + frontend `believe-web-starter` deployado por tenant en Coolify Hetzner. **Cero Vercel.** Una web nueva = ~15 min.

Patrón: **un solo repo `believe-web-starter`, N deploys parametrizados** por `NEXT_PUBLIC_TENANT_ID` + dominio. No se clona el código por cliente (salvo que necesite código custom).

---

## Pasos

### 1. Crear el tenant + contenido en el CMS

El CMS arranca con `next start` (producción), que NO aplica schema push. Para tenants/contenido nuevos corré los bin de Payload con `NODE_ENV=development` dentro del container (esto fuerza el push aditivo del schema y siembra el contenido):

```bash
# container del CMS (nombre = uuid de Coolify, cambia en cada deploy):
APP=$(ssh believe-vps "docker ps --filter name=qijimwqdndh8p21vmh5xvzz5 --format '{{.Names}}' | head -1")

# crea tenant + páginas + posts + bloques Flowbite + settings:
ssh believe-vps "docker exec -e NODE_ENV=development \
  -e BOOTSTRAP_TENANT_SLUG=clientex -e BOOTSTRAP_SITE_NAME='Cliente X' \
  $APP node_modules/.bin/payload bootstrap:tenant-content"
```

> Importante: el comando correcto es `payload bootstrap:tenant-content` (bin del config), NO `payload run scripts/...` (ese no ejecuta nada — bug histórico ya documentado).

Anotá el **tenant id** numérico (lo necesitás para el frontend):
```bash
DB=$(ssh believe-vps "docker ps --filter name=believe-agency-cms-db --format '{{.Names}}' | head -1")
ssh believe-vps "docker exec $DB psql -U agency_cms_user -d agency_cms -tAc \"SELECT id,slug,name FROM tenants ORDER BY id;\""
```

### 2. Crear la app del frontend en Coolify (Hetzner)

```bash
HET="https://coolify.backends.believe-global.com"
PROJECT=sy6mbsp3b73r6f5k7jq9d6en   # proyecto believe-landings (Hetzner)
SERVER=o5de31aovlrol4bvhvy9wtk2    # localhost Hetzner

~/.believe/bin/infra bash -c "curl -s -X POST -H \"Authorization: Bearer \$COOLIFY_HETZNER_TOKEN\" -H 'Content-Type: application/json' \"$HET/api/v1/applications/public\" -d '{
  \"project_uuid\": \"'$PROJECT'\",
  \"server_uuid\": \"'$SERVER'\",
  \"environment_name\": \"production\",
  \"git_repository\": \"https://github.com/BELIEVE-IT-GROUP/believe-web-starter.git\",
  \"git_branch\": \"main\",
  \"build_pack\": \"dockerfile\",
  \"ports_exposes\": \"3000\",
  \"name\": \"web-clientex\",
  \"instant_deploy\": false
}'"
# devuelve {uuid, domains:sslip}. Guardá el APPUUID.
```

### 3. Env vars del frontend

```bash
APPUUID=<uuid devuelto>
REV=$(openssl rand -hex 24); PREV=$(openssl rand -hex 24)
set_env(){ ~/.believe/bin/infra bash -c "curl -s -X POST -H \"Authorization: Bearer \$COOLIFY_HETZNER_TOKEN\" -H 'Content-Type: application/json' \"$HET/api/v1/applications/$APPUUID/envs\" -d '{\"key\":\"$1\",\"value\":\"$2\"}'"; }
set_env NEXT_PUBLIC_PAYLOAD_URL https://cms.believe-global.com
set_env NEXT_PUBLIC_TENANT_ID <tenant-id-del-paso-1>   # OJO: ID numérico, no slug (el filtro por tenant.slug no está habilitado en el CMS)
set_env NEXT_PUBLIC_SITE_NAME "Cliente X"
set_env REVALIDATE_SECRET $REV
set_env PREVIEW_SECRET $PREV
```

### 4. Deploy + verificar

```bash
~/.believe/bin/infra bash -c "curl -s -H \"Authorization: Bearer \$COOLIFY_HETZNER_TOKEN\" \"$HET/api/v1/deploy?uuid=$APPUUID&force=false\""
# esperar build (~3 min). Verificar:
curl -s -o /dev/null -w "%{http_code}\n" https://<sslip-o-dominio>/
```

### 5. Conectar revalidación (editar en CMS → reflejar en web)

```bash
FURL="http://<sslip-o-dominio>"
# setear el mismo REVALIDATE_SECRET en el CMS:
~/.believe/bin/infra bash -c "curl -s -X POST -H \"Authorization: Bearer \$COOLIFY_TOKEN\" -H 'Content-Type: application/json' \"\$COOLIFY_URL/api/v1/applications/qijimwqdndh8p21vmh5xvzz5/envs\" -d '{\"key\":\"PAYLOAD_REVALIDATE_SECRET\",\"value\":\"'$REV'\"}'"
# redeploy del CMS para recrear el container con la env (el restart NO basta):
~/.believe/bin/infra bash -c "curl -s -H \"Authorization: Bearer \$COOLIFY_TOKEN\" \"\$COOLIFY_URL/api/v1/deploy?uuid=qijimwqdndh8p21vmh5xvzz5\""
# apuntar el webhook del tenant al frontend:
ssh believe-vps "docker exec -e BOOTSTRAP_TENANT_SLUG=clientex -e BOOTSTRAP_SITE_NAME='Cliente X' \
  -e BOOTSTRAP_PREVIEW_URL='$FURL' -e BOOTSTRAP_REVALIDATE_WEBHOOK_URL='$FURL/api/revalidate' \
  $APP node_modules/.bin/payload bootstrap:settings"
```

> Nota: el `PAYLOAD_REVALIDATE_SECRET` del CMS es uno solo. Si manejás varios tenants con distinto secret, usá `settings.revalidateWebhookUrl` por tenant y un secret compartido a nivel CMS.

### 6. Dominio propio (opcional)

1. En Cloudflare: registro A/CNAME del subdominio → IP de Hetzner (`5.78.214.173`).
2. En Coolify (app del frontend): agregar el dominio en Settings → Domains. Coolify emite el cert Let's Encrypt automático.
3. Actualizar `BOOTSTRAP_PREVIEW_URL`/webhook (paso 5) al dominio final.

---

## Edición de contenido (cliente / equipo)

`https://cms.believe-global.com/admin` → entrar al tenant → editar páginas (bloques Flowbite con campos mapeados: Hero, Features, Pricing, Testimonials, FAQ, Stats, Team, LogoCloud, Gallery, Contact, SplitContent, VideoEmbed, Newsletter, BlogList, CTA). Publicar → la web revalida en < 30s.

## Identidad de marca

El frontend ya trae el Believe Brand System 2026 (brandbook): Fraunces + Inter + JetBrains Mono, paleta Paper/Ink/Believe Blue/Cyan, wordmark con punto cian, cero sombras/gradientes. Para un cliente con marca propia, override por tenant vía `settings.theme.primaryColor` (CMS) o fork del starter.
