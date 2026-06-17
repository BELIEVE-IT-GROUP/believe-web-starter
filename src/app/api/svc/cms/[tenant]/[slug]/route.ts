/**
 * Endpoint de servicio para el MCP (puck-cms-mcp): GET/PUT/POST del Puck Data por API-key.
 *
 * Vive en /api/svc/* (NO en /api/cms) a propósito: el router Traefik puck-adm solo
 * protege /admin y /api/cms con Authelia, así que este path queda servido por el router
 * público. La protección acá es el header X-CMS-Key (PUCK_SVC_KEY), comparado timing-safe.
 *
 * GET   -> lee el Puck Data de la página (o null).
 * PUT   -> guarda el Puck Data (sobrescribe).
 * POST  -> siembra la página con el seed del block set del tenant (body { force? }).
 */
import { NextResponse } from 'next/server'
import { getTenant, getPage, savePage } from '@/cms/store'
import { seedFor } from '@/cms/seeds.server'
import { svcGate } from '@/cms/svc-auth'

export async function GET(req: Request, { params }: { params: { tenant: string; slug: string } }) {
  const blocked = svcGate(req, [params.tenant, params.slug])
  if (blocked) return blocked
  return NextResponse.json(await getPage(params.tenant, params.slug))
}

export async function PUT(req: Request, { params }: { params: { tenant: string; slug: string } }) {
  const blocked = svcGate(req, [params.tenant, params.slug])
  if (blocked) return blocked
  let data: unknown
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json body' }, { status: 400 })
  }
  if (!data || typeof data !== 'object') {
    return NextResponse.json({ error: 'expected Puck Data object' }, { status: 400 })
  }
  await savePage(params.tenant, params.slug, data as Parameters<typeof savePage>[2])
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request, { params }: { params: { tenant: string; slug: string } }) {
  const blocked = svcGate(req, [params.tenant, params.slug])
  if (blocked) return blocked
  const tenant = await getTenant(params.tenant)
  if (!tenant) return NextResponse.json({ error: `tenant '${params.tenant}' no existe` }, { status: 404 })

  const body = (await req.json().catch(() => ({}))) as { force?: boolean }
  const existing = await getPage(params.tenant, params.slug)
  if (existing && !body.force) {
    return NextResponse.json(
      { error: 'la página ya existe; pasá force:true para sobrescribir con el seed' },
      { status: 409 },
    )
  }
  const seed = seedFor(tenant.blockSet)
  if (!seed) {
    return NextResponse.json({ error: `no hay seed para el block set '${tenant.blockSet}'` }, { status: 422 })
  }
  await savePage(params.tenant, params.slug, seed)
  return NextResponse.json({ ok: true, seeded: seed })
}
