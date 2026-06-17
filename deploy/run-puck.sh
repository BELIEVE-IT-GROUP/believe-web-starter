#!/bin/bash
# Arranca el CMS Believe Puck en Contabo, detras del Traefik de Coolify.
# Routers: publico (puck.believe-global.com) + admin (Authelia /admin /api/cms)
# + UNO por cada dominio custom declarado en data/tenants/*.json (domains[]),
# con cert Let's Encrypt automatico. Router-por-dominio (NO catch-all): Traefik
# solo emite cert para dominios conocidos -> sin abuso de rate-limits.
# Vive en el repo para que `rsync --delete` no lo borre del VPS.
set -e

docker rm -f puck-cms 2>/dev/null || true

# --- Labels base (sistema) ---
LABELS=(
  --label 'traefik.enable=true'
  --label 'traefik.docker.network=coolify'
  --label 'traefik.http.routers.puck-pub.rule=Host(`puck.believe-global.com`)'
  --label 'traefik.http.routers.puck-pub.entrypoints=https'
  --label 'traefik.http.routers.puck-pub.tls=true'
  --label 'traefik.http.routers.puck-pub.tls.certresolver=letsencrypt'
  --label 'traefik.http.routers.puck-pub.service=puck'
  --label 'traefik.http.routers.puck-pub.priority=1'
  --label 'traefik.http.routers.puck-adm.rule=Host(`puck.believe-global.com`) && (PathPrefix(`/admin`) || PathPrefix(`/api/cms`))'
  --label 'traefik.http.routers.puck-adm.entrypoints=https'
  --label 'traefik.http.routers.puck-adm.tls=true'
  --label 'traefik.http.routers.puck-adm.tls.certresolver=letsencrypt'
  --label 'traefik.http.routers.puck-adm.service=puck'
  --label 'traefik.http.routers.puck-adm.middlewares=authelia-tars-auth@docker'
  --label 'traefik.http.routers.puck-adm.priority=10'
  --label 'traefik.http.services.puck.loadbalancer.server.port=3000'
)

# --- Routers por dominio custom (uno por cada domains[] de cada tenant) ---
i=0
for f in /root/puck-cms/data/tenants/*.json; do
  [ -f "$f" ] || continue
  for d in $(jq -r '.domains[]? // empty' "$f" 2>/dev/null); do
    r="cust$i"
    LABELS+=(
      --label "traefik.http.routers.$r.rule=Host(\`$d\`)"
      --label "traefik.http.routers.$r.entrypoints=https"
      --label "traefik.http.routers.$r.tls=true"
      --label "traefik.http.routers.$r.tls.certresolver=letsencrypt"
      --label "traefik.http.routers.$r.service=puck"
      --label "traefik.http.routers.$r-http.rule=Host(\`$d\`)"
      --label "traefik.http.routers.$r-http.entrypoints=http"
    )
    echo "+ router dominio custom: $d (cust$i)"
    i=$((i + 1))
  done
done
echo "dominios custom configurados: $i"

docker run -d --name puck-cms --restart unless-stopped \
  --network coolify \
  -e NODE_ENV=production -e PORT=3000 \
  --env-file /root/puck-cms.env \
  -v puck-cms-pages:/app/data/pages \
  "${LABELS[@]}" \
  puck-cms:latest

sleep 3
echo "=== container ==="
docker ps --filter name=puck-cms --format '{{.Names}} | {{.Status}}'
echo "=== health interno ==="
docker exec puck-cms wget -qO- --timeout=5 http://localhost:3000/s/birdman >/dev/null 2>&1 && echo "interno OK" || echo "interno aun arrancando"
