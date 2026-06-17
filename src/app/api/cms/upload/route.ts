/**
 * Upload de media para el editor Puck. POST /api/cms/upload (multipart).
 * Vive bajo /api/cms → protegido por Authelia (cookie de sesión del editor).
 * Sube a R2 y devuelve { url } (dominio público r2.dev).
 */
import { NextResponse } from 'next/server'
import { uploadToR2, r2Configured } from '@/lib/r2'

const SLUG = /^[a-z0-9][a-z0-9-]*$/
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: Request) {
  if (!r2Configured()) {
    return NextResponse.json({ error: 'R2 no está configurado en el server' }, { status: 503 })
  }
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const tenant = String(form?.get('tenant') || 'shared')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'falta el campo file' }, { status: 400 })
  }
  if (!SLUG.test(tenant)) {
    return NextResponse.json({ error: 'tenant inválido' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'solo se permiten imágenes' }, { status: 415 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'la imagen supera 10MB' }, { status: 413 })
  }

  const ext = (file.name.split('.').pop() || 'img').toLowerCase().replace(/[^a-z0-9]/g, '') || 'img'
  const key = `puck/${tenant}/${crypto.randomUUID()}.${ext}`
  const buf = await file.arrayBuffer()
  try {
    const url = await uploadToR2(key, buf, file.type)
    return NextResponse.json({ url, key })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 })
  }
}
