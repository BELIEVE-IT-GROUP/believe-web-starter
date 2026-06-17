'use client'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'
import type { Data } from '@measured/puck'
import { getConfig, withDefaults } from '@/cms/registry'

export function Editor({ tenant, slug, blockSet, data }: { tenant: string; slug: string; blockSet: string; data: Data }) {
  const config = getConfig(blockSet)
  return (
    <Puck
      config={config}
      data={withDefaults(config, data)}
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
