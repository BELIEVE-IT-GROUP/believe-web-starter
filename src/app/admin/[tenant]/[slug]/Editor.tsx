'use client'
import { useState } from 'react'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'
import type { Data } from '@measured/puck'
import { getConfig, withDefaults } from '@/cms/registry'

type Toast = { kind: 'saving' | 'ok' | 'err'; msg: string }

export function Editor({ tenant, slug, blockSet, data }: { tenant: string; slug: string; blockSet: string; data: Data }) {
  const config = getConfig(blockSet)
  const [toast, setToast] = useState<Toast | null>(null)
  const [auditing, setAuditing] = useState(false)
  const liveUrl = `/s/${tenant}${slug === 'home' ? '' : '/' + slug}`

  async function auditAos() {
    setAuditing(true)
    setToast({ kind: 'saving', msg: 'Auditando operabilidad agéntica (AOS)…' })
    try {
      const r = await fetch(`/api/cms/${tenant}/${slug}/aos`, { method: 'POST' })
      const j = await r.json()
      if (!r.ok || !j.ok) throw new Error(j.error || String(r.status))
      setToast({ kind: 'ok', msg: `AOS ${j.score}/100 · ${j.band} · ${j.actions} acción(es). Recargá para ver JSON-LD/llms.txt.` })
    } catch (e) {
      setToast({ kind: 'err', msg: `AOS falló: ${(e as Error).message}` })
    }
    setAuditing(false)
    setTimeout(() => setToast(null), 8000)
  }

  return (
    <>
      <Puck
        config={config}
        data={withDefaults(config, data)}
        onPublish={async (d) => {
          setToast({ kind: 'saving', msg: 'Publicando…' })
          try {
            const r = await fetch(`/api/cms/${tenant}/${slug}`, {
              method: 'PUT',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(d),
            })
            if (!r.ok) throw new Error(String(r.status))
            setToast({ kind: 'ok', msg: 'Publicado ✓' })
          } catch {
            setToast({ kind: 'err', msg: 'Error al publicar. Reintenta.' })
          }
          setTimeout(() => setToast(null), 4500)
        }}
      />

      <div className="ed-exit">
        <a className="adm-btn adm-btn--ghost" href={`/admin/${tenant}`}>
          ← Salir
        </a>
        <a className="adm-btn adm-btn--ghost" href={liveUrl} target="_blank" rel="noopener">
          Ver publicado ↗
        </a>
        <button className="adm-btn adm-btn--primary" onClick={auditAos} disabled={auditing} type="button">
          {auditing ? 'Auditando…' : '⚡ Auditar AOS'}
        </button>
      </div>

      {toast && (
        <div className={`ed-toast show ${toast.kind === 'ok' ? 'ok' : toast.kind === 'err' ? 'err' : ''}`} role="status">
          {toast.msg}
          {toast.kind === 'ok' && (
            <a href={liveUrl} target="_blank" rel="noopener">
              ver ↗
            </a>
          )}
        </div>
      )}
    </>
  )
}
