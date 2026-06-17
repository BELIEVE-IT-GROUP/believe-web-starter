import { NextResponse } from 'next/server'
import { getPage, savePage } from '@/cms/store'

export async function GET(_req: Request, { params }: { params: { tenant: string; slug: string } }) {
  return NextResponse.json(await getPage(params.tenant, params.slug))
}

export async function PUT(req: Request, { params }: { params: { tenant: string; slug: string } }) {
  const data = await req.json()
  await savePage(params.tenant, params.slug, data)
  return NextResponse.json({ ok: true })
}
