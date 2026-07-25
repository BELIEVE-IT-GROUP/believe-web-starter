import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTenant, listPages } from '@/cms/store'
import { AdminHeader } from '../AdminHeader'

export const dynamic = 'force-dynamic'

export default async function TenantHome({ params }: { params: { tenant: string } }) {
  const t = await getTenant(params.tenant)
  if (!t) notFound()
  const pages = await listPages(params.tenant)
  const list = pages.length ? pages : ['home']
  const domain = (t.domains ?? [])[0]
  return (
    <>
      <AdminHeader
        crumbs={[{ label: t.name }]}
        right={
          <a className="adm-btn adm-btn--ghost" href={`/s/${t.slug}`} target="_blank" rel="noopener">
            Ver sitio ↗
          </a>
        }
      />
      <main className="adm-wrap">
        <h1 className="adm-h1">{t.name}</h1>
        <p className="adm-sub">
          <span className="adm-chip accent">{t.blockSet}</span>{' '}
          <span style={{ marginLeft: 6 }}>{domain ? domain : `/s/${t.slug}`}</span>
        </p>
        <div className="adm-grid">
          {list.map((slug) => (
            <div className="adm-card" key={slug}>
              <div className="adm-card__top">
                <span className="adm-card__name">{slug}</span>
                <span className="adm-card__slug">página</span>
              </div>
              <div className="adm-card__actions">
                <Link className="adm-btn adm-btn--primary" href={`/admin/${t.slug}/${slug}`}>
                  Editar
                </Link>
                <a
                  className="adm-btn adm-btn--ghost"
                  href={`/s/${t.slug}${slug === 'home' ? '' : '/' + slug}`}
                  target="_blank"
                  rel="noopener"
                >
                  Ver publicado ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
