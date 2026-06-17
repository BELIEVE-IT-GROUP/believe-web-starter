/**
 * Endpoint de servicio para el MCP (puck-cms-mcp): GET/PUT del Puck Data por API-key.
 *
 * Vive en /api/svc/* (NO en /api/cms) a propósito: el router Traefik puck-adm solo
 * protege /admin y /api/cms con Authelia, así que este path queda servido por el router
 * público. La protección acá es el header X-CMS-Key (PUCK_SVC_KEY), comparado timing-safe.
 * Si PUCK_SVC_KEY no está configurada, el endpoint queda deshabilitado (503).
 */
import { NextResponse } from 'next/server'
import { getPage, savePage } from '@/cms/store'
import { timingSafeEqual } from 'node:crypto'

const SLUG = /^[a-z0-9][a-z0-9-]*$/

function authorized(req: Request): boolean {
  const key = process.env.PUCK_SVC_KEY
  if (!key) return false
  const given = req.headers.get('x-cms-key') ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(key)
  return a.length === b.length && timingSafeEqual(a, b)
}

function gate(req: Request, tenant: string, slug: string): NextResponse | null {
  if (!process.env.PUCK_SVC_KEY) {
    return NextResponse.json({ error: 'svc endpoint disabled (no PUCK_SVC_KEY)' }, { status: 503 })
  }
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!SLUG.test(tenant) || !SLUG.test(slug)) {
    return NextResponse.json({ error: 'bad tenant/slug' }, { status: 400 })
  }
  return null
}

export async function GET(req: Request, { params }: { params: { tenant: string; slug: string } }) {
  const blocked = gate(req, params.tenant, params.slug)
  if (blocked) return blocked
  return NextResponse.json(await getPage(params.tenant, params.slug))
}

export async function PUT(req: Request, { params }: { params: { tenant: string; slug: string } }) {
  const blocked = gate(req, params.tenant, params.slug)
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
