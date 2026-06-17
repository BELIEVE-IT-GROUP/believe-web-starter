import Link from 'next/link'
import { listTenants } from '@/cms/store'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const tenants = await listTenants()
  return (
    <main style={{ maxWidth: 720, margin: '64px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>CMS Believe Puck</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Tenants</p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {tenants.map((t) => (
          <li key={t.slug} style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
            <Link href={`/admin/${t.slug}`} style={{ fontSize: 18, fontWeight: 600 }}>
              {t.name}
            </Link>
            <span style={{ color: '#999', marginLeft: 8 }}>/{t.slug}</span>
          </li>
        ))}
        {tenants.length === 0 && <li style={{ color: '#999' }}>Sin tenants todavía.</li>}
      </ul>
    </main>
  )
}
