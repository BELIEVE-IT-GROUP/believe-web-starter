import { ImageResponse } from 'next/og'
import { getTenant, getTenantByDomain, getPage } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { metaOf } from '@/lib/seo'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Grupo ORVIA'

/** OG image dinámica on-brand (negro + naranja) por landing. */
export default async function OgImage({ params }: { params: { tenant: string } }) {
  let t = await getTenant(params.tenant)
  if (!t && params.tenant.includes('.')) t = await getTenantByDomain(params.tenant)
  const data = t ? ((await getPage(t.slug, 'home')) ?? getSeed(t.blockSet)) : null
  const meta = metaOf(data as Parameters<typeof metaOf>[0])
  const title = meta.title?.split('·')[0]?.trim() || t?.name || 'Grupo ORVIA'
  const desc = (meta.description || '').slice(0, 150)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: '#000000',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 16, height: 16, background: '#ff8400', borderRadius: 3 }} />
          <div style={{ color: '#ff8400', fontSize: 26, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase' }}>
            Grupo ORVIA
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, lineHeight: 1.05, color: '#ff8400', maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#b7b7b7', lineHeight: 1.35, maxWidth: 1000 }}>{desc}</div>
      </div>
    ),
    { ...size },
  )
}
