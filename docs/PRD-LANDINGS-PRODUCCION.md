# PRD — Fábrica de Landings y Webs Believe (Producción en serie)

**Fecha:** 2026-06-13
**Autor:** Claude (Opus 4.8) en modo Ops para Jorge / Believe
**Estado:** En ejecución
**Repos:** `BELIEVE-IT-GROUP/believe-agency-cms` (CMS) · `BELIEVE-IT-GROUP/believe-web-starter` (frontend)

---

## 1. Objetivo (el contrato)

Tener un sistema **producción-ready** donde Jorge pueda decir *"creá la landing/web XY"* y el resultado sea:

1. Una **URL viva** renderizando bloques Flowbite reales (no HTML artesanal).
2. **Administrable desde el CMS** (`cms.believe-global.com/admin`) con todos los campos mapeados por bloque.
3. **Multi-tenant**: cada cliente = un tenant aislado, con sus settings (logo, colores, nav, footer).
4. **100% sobre infra Believe**: Coolify (deploy) + Postgres Coolify (DB) + R2 (media) + Plunk/useSend (email). **CERO Vercel.**
5. **Replicable en serie**: agregar un cliente nuevo es un procedimiento de minutos, no una sesión de ingeniería.

**Definition of Done (maestro):** existe al menos **una landing del tenant `believe` viva en una URL de Coolify**, editable desde el CMS, donde un cambio publicado en el CMS se refleja en la web. Probado con evidencia (curl + screenshot), no con promesas.

> Lección grabada de 3 postmortems previos: *código en GitHub ≠ producto en producción*. Nada se declara "listo" sin URL viva + evidencia.

---

## 2. Estado real verificado (2026-06-13)

| Componente | Estado | Brecha |
|---|---|---|
| CMS admin (`cms.believe-global.com`) | OK HTTP 200, vivo en Coolify VPSDime | — |
| CMS contenido tenant `believe` | OK posts seeded en DB | Faltan settings + páginas demo |
| CMS código (`origin/main`) | OK Settings, mapeo Flowbite, hooks revalidación, 15 bloques | — |
| CMS API `/api/pages`, `/api/settings` | ROTO "Something went wrong" | **Schema Postgres desincronizado** |
| `believe-web-starter` código | OK 15 bloques, BlockRenderer, cliente CMS tenant-aware, Dockerfile standalone | Solo 3/15 bloques usan Flowbite real |
| `believe-web-starter` DEPLOY | NO deployado en ningún lado | **La pieza que nadie logró** |
| Clientes (`procional/uniplaza/cecilia/viziona-web`) | 4 repos clonados | Cero deployados |
| Git local CMS | Divergido (behind 4, +28 sin commit) | Limpiar |

---

## 3. Decisiones de arquitectura

| Decisión | Valor | Razón |
|---|---|---|
| Deploy frontend | **Coolify VPSDime** (co-ubicado con el CMS) | Fetch server-side en misma red; cero Vercel |
| Patrón multitenant frontend | **Un repo `believe-web-starter`, N deploys parametrizados** por `NEXT_PUBLIC_TENANT_SLUG` + dominio | Producción en serie sin clonar código 50 veces |
| DB | Postgres existente Coolify (`believe-agency-cms-db`) | Ya operativo, con schema push |
| Media | Cloudflare R2 (ya configurado en CMS) | — |
| Email/forms | Plunk / useSend (SES) | Ya en infra; Appwrite opción futura, no se fuerza |
| UI bloques | `flowbite-react` + bloques Pro `flowbite-react-blocks-1.8.0-beta` | Calidad premium real |
| Revalidación | Hook `afterChange` CMS → `POST /api/revalidate` (secret compartido) | ISR on-demand |

---

## 4. Issues decompuestas (build order)

Cada issue: **complejidad** (1-5) → **modelo** → **contrato** (criterio verificable) → **evidencia**.

### FASE A — CMS sólido (bloqueante, secuencial, prod)

- **A1 · Limpiar git CMS local** · c2 · Opus(self) — Contrato: rama reconciliada con `origin/main`, backup, working tree limpio. Evidencia: `git status` limpio.
- **A2 · Arreglar schema Postgres prod** · c3 · Opus(self)+prod — Contrato: tabla `settings` + columnas bloques existen; `/api/pages` y `/api/settings` → 200. Evidencia: curl con docs.
- **A3 · Seed settings + página demo tenant `believe`** · c2 · Opus(self)+prod — Contrato: settings doc + página `home` publicada con ≥4 bloques. Evidencia: curl devuelve bloques.

### FASE B — Frontend vivo en Coolify (corazón del entregable)

- **B1 · Deployar `believe-web-starter` en Coolify** · c4 · Opus(self)+prod — Contrato: app Coolify VPSDime, env configurado, build Dockerfile OK, dominio, HTTP 200 renderizando home del tenant. Evidencia: URL viva.
- **B2 · Webhook revalidación E2E** · c3 · impl+verify — Contrato: editar+publicar en CMS refleja en web sin redeploy. Evidencia: cambio en < 30s.

### FASE C — Calidad de bloques (paralelizable)

- **C1 · 12 bloques de HTML artesanal → Flowbite real** · c3 c/u · subagentes paralelos + auditor — Bloques: Features, Pricing, Testimonials, Cta, Faq, BlogList, Stats, Team, LogoCloud, Gallery, SplitContent, VideoEmbed. Contrato: usan `flowbite-react`/Pro; props CMS; `appearance`+`templateId`; typecheck verde. Evidencia: 15/15 usan flowbite, build verde.
- **C2 · Auditoría adversarial de bloques** · c3 · auditor(Opus) — Contrato: cada bloque responsive, dark mode, props vacías, accesible. Evidencia: reporte por bloque, findings corregidos.

### FASE D — Fábrica en serie + cierre

- **D1 · Runbook "nueva landing/web XY"** · c3 · Opus(self) — Contrato: procedimiento crea tenant + deploy Coolify + dominio, administrable. Evidencia: `docs/RUNBOOK-NUEVO-CLIENTE.md` probado con 1 cliente real.
- **D2 · QA E2E + evidencia final** · c3 · QA(Opus)+prod — Contrato: smoke CMS→API→frontend→revalidación→forms. Evidencia: `docs/QA-RESULTADOS.md` con curls + screenshots.

---

## 5. Orquestación

- **Secuencial/infra/prod** (A1-A3, B1, D1): orquestador Opus directo (requieren SSH/Coolify que los subagentes no tienen).
- **Paralelizable** (C1): fan-out subagentes, 1 bloque por agente, contrato explícito.
- **Auditoría/QA** (C2, B2-verify, D2): subagentes auditor/QA Opus, adversariales.
- **Gate por fase**: no se avanza sin evidencia verde. A bloquea B. B desbloquea valor visible. C y D pulen.

## 6. Orden de valor (qué ve Jorge y cuándo)

1. **A2+A3+B1** → primera URL viva administrable. **Máxima prioridad.**
2. **B2** → editar en CMS se refleja en la web.
3. **C1+C2** → se ve premium.
4. **D1+D2** → fábrica en serie + evidencia.
