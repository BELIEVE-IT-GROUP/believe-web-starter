'use client'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'
import type { Data } from '@measured/puck'
import { config } from '@/cms/puck.config'

export function Editor({ tenant, slug, data }: { tenant: string; slug: string; data: Data }) {
  return (
    <Puck
      config={config}
      data={data}
      onPublish={async (d) => {
        await fetch(`/api/cms/${tenant}/${slug}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(d),
        })
      }}
    />
  )
}
