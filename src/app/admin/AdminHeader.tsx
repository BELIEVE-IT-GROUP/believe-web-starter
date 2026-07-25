import Link from 'next/link'

/** Header con marca + breadcrumbs para las pantallas de listado del admin. */
export function AdminHeader({ crumbs, right }: { crumbs?: { label: string; href?: string }[]; right?: React.ReactNode }) {
  return (
    <header className="adm-hd">
      <div className="adm-hd__row">
        <Link href="/admin" className="adm-brand" aria-label="Believe · CMS Puck">
          <span className="bw" aria-hidden="true">
            Believ<span className="bw-e">e</span>
            <span className="bw-dot" />
          </span>
          <span className="adm-brand__sub">CMS · Puck</span>
        </Link>
        {crumbs && crumbs.length > 0 && (
          <nav className="adm-crumbs">
            {crumbs.map((c, i) => (
              <span key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="sep">/</span>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <span className="adm-hd__spacer" />
        {right}
      </div>
    </header>
  )
}
