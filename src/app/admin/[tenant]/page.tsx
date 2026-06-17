import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenant, listPages } from '@/cms/store'

export const dynamic = 'force-dynamic'

export default async function TenantHome({ params }: { params: { tenant: string } }) {
  const t = await getTenant(params.tenant)
  if (!t) notFound()
  const pages = await listPages(params.tenant)
  const list = pages.length ? pages : ['home']
  return (
    <main style={{ maxWidth: 720, margin: '64px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/admin" style={{ color: '#999' }}>
          ← Tenants
        </Link>
      </p>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>{t.name}</h1>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {list.map((slug) => (
          <li
            key={slug}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Link href={`/admin/${t.slug}/${slug}`} style={{ fontSize: 18, fontWeight: 600 }}>
              {slug} (editar)
            </Link>
            <Link href={`/s/${t.slug}/${slug === 'home' ? '' : slug}`} target="_blank" style={{ color: '#0a7' }}>
              ver publicado ↗
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
