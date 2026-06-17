/**
 * Servicio MCP: lista las páginas de un tenant. GET /api/svc/cms/[tenant]
 * Protegido por X-CMS-Key (svcGate). Devuelve los slugs de páginas del tenant.
 */
import { NextResponse } from 'next/server'
import { listPages } from '@/cms/store'
import { svcGate } from '@/cms/svc-auth'

export async function GET(req: Request, { params }: { params: { tenant: string } }) {
  const blocked = svcGate(req, [params.tenant])
  if (blocked) return blocked
  return NextResponse.json({ tenant: params.tenant, pages: await listPages(params.tenant) })
}
