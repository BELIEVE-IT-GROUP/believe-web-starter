import Link from 'next/link'
import { listTenants, listPages } from '@/cms/store'
import { AdminHeader } from './AdminHeader'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const tenants = await listTenants()
  const rows = await Promise.all(
    tenants.map(async (t) => ({ t, pages: (await listPages(t.slug)).length || 1 })),
  )
  return (
    <>
      <AdminHeader right={<span className="adm-pill">{tenants.length} tenants</span>} />
      <main className="adm-wrap">
        <h1 className="adm-h1">Tenants</h1>
        <p className="adm-sub">Sitios y landings administrados por el CMS Believe Puck.</p>
        {rows.length === 0 ? (
          <div className="adm-empty">Sin tenants todavía.</div>
        ) : (
          <div className="adm-grid">
            {rows.map(({ t, pages }) => {
              const domain = (t.domains ?? [])[0]
              return (
                <div className="adm-card" key={t.slug}>
                  <div className="adm-card__top">
                    <span className="adm-card__name">{t.name}</span>
                    <span className="adm-card__slug">/{t.slug}</span>
                  </div>
                  <div className="adm-chips">
                    <span className="adm-chip accent">{t.blockSet}</span>
                    <span className="adm-chip">
                      {pages} página{pages === 1 ? '' : 's'}
                    </span>
                    {domain && <span className="adm-chip">{domain}</span>}
                  </div>
                  <div className="adm-card__actions">
                    <Link className="adm-btn adm-btn--primary" href={`/admin/${t.slug}`}>
                      Administrar
                    </Link>
                    <a className="adm-btn adm-btn--ghost" href={`/s/${t.slug}`} target="_blank" rel="noopener">
                      Ver sitio ↗
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
