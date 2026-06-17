/**
 * Subida de media a Cloudflare R2 (bucket believe-r2) vía aws4fetch (cliente S3
 * minúsculo, SigV4). Las imágenes se sirven por el dominio público r2.dev.
 * Env (inyectadas al container Puck): R2_ACCESS_KEY, R2_SECRET_KEY, R2_ENDPOINT,
 * R2_BUCKET (def believe-r2), R2_PUBLIC_URL (https://pub-...r2.dev).
 */
import { AwsClient } from 'aws4fetch'

const ENDPOINT = (process.env.R2_ENDPOINT || '').replace(/\/$/, '')
const BUCKET = process.env.R2_BUCKET || 'believe-r2'
const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')

export function r2Configured(): boolean {
  return Boolean(process.env.R2_ACCESS_KEY && process.env.R2_SECRET_KEY && ENDPOINT && PUBLIC_URL)
}

const client = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY || '',
  secretAccessKey: process.env.R2_SECRET_KEY || '',
  region: 'auto',
  service: 's3',
})

/** Sube el buffer a R2 bajo `key` y devuelve la URL pública. */
export async function uploadToR2(key: string, body: ArrayBuffer, contentType: string): Promise<string> {
  // Blob (no ArrayBuffer crudo): undici SIEMPRE manda Content-Length con un Blob
  // (conoce su .size). R2 exige Content-Length y rechaza chunked → error 411
  // MissingContentLength. El Blob también lleva el content-type.
  const res = await client.fetch(`${ENDPOINT}/${BUCKET}/${key}`, {
    method: 'PUT',
    body: new Blob([body], { type: contentType }),
  })
  if (!res.ok) {
    throw new Error(`R2 PUT ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
  return `${PUBLIC_URL}/${key}`
}
