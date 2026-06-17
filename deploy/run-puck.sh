#!/bin/bash
# Arranca el CMS Believe Puck en Contabo, detras del Traefik de Coolify.
# Router publico para todo el sitio + router protegido (Authelia) para /admin y /api/cms.
# Vive en el repo para que `rsync --delete` no lo borre del VPS.
set -e

docker rm -f puck-cms 2>/dev/null || true

docker run -d --name puck-cms --restart unless-stopped \
  --network coolify \
  -e NODE_ENV=production -e PORT=3000 \
  --env-file /root/puck-cms.env \
  -v puck-cms-pages:/app/data/pages \
  --label 'traefik.enable=true' \
  --label 'traefik.docker.network=coolify' \
  --label 'traefik.http.routers.puck-pub.rule=Host(`puck.believe-global.com`)' \
  --label 'traefik.http.routers.puck-pub.entrypoints=https' \
  --label 'traefik.http.routers.puck-pub.tls=true' \
  --label 'traefik.http.routers.puck-pub.tls.certresolver=letsencrypt' \
  --label 'traefik.http.routers.puck-pub.service=puck' \
  --label 'traefik.http.routers.puck-pub.priority=1' \
  --label 'traefik.http.routers.puck-adm.rule=Host(`puck.believe-global.com`) && (PathPrefix(`/admin`) || PathPrefix(`/api/cms`))' \
  --label 'traefik.http.routers.puck-adm.entrypoints=https' \
  --label 'traefik.http.routers.puck-adm.tls=true' \
  --label 'traefik.http.routers.puck-adm.tls.certresolver=letsencrypt' \
  --label 'traefik.http.routers.puck-adm.service=puck' \
  --label 'traefik.http.routers.puck-adm.middlewares=authelia-tars-auth@docker' \
  --label 'traefik.http.routers.puck-adm.priority=10' \
  --label 'traefik.http.services.puck.loadbalancer.server.port=3000' \
  puck-cms:latest

sleep 3
echo "=== container ==="
docker ps --filter name=puck-cms --format '{{.Names}} | {{.Status}}'
echo "=== health interno ==="
docker exec puck-cms wget -qO- --timeout=5 http://localhost:3000/s/birdman >/dev/null 2>&1 && echo "interno OK" || echo "interno aun arrancando"
