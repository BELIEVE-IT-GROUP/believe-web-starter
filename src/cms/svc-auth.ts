/**
 * Gate compartido del endpoint de servicio (/api/svc/cms/...).
 * Server-safe (no importa nada de Puck/cliente). Protege con X-CMS-Key timing-safe.
 */
import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

const SLUG = /^[a-z0-9][a-z0-9-]*$/

/** Devuelve una NextResponse de error si la request no pasa, o null si está OK. */
export function svcGate(req: Request, slugs: string[]): NextResponse | null {
  const key = process.env.PUCK_SVC_KEY
  if (!key) {
    return NextResponse.json({ error: 'svc endpoint disabled (no PUCK_SVC_KEY)' }, { status: 503 })
  }
  const given = req.headers.get('x-cms-key') ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(key)
  if (!(a.length === b.length && timingSafeEqual(a, b))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  for (const s of slugs) {
    if (!SLUG.test(s)) return NextResponse.json({ error: 'bad tenant/slug' }, { status: 400 })
  }
  return null
}
