'use client'
import { Render } from '@measured/puck'
import type { Data } from '@measured/puck'
import { getConfig, withDefaults } from '@/cms/registry'

export function PublicRender({ blockSet, data }: { blockSet: string; data: Data }) {
  const config = getConfig(blockSet)
  return <Render config={config} data={withDefaults(config, data)} />
}
