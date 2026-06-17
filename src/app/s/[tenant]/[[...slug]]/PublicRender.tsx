'use client'
import { Render } from '@measured/puck'
import type { Data } from '@measured/puck'
import { config } from '@/cms/puck.config'

export function PublicRender({ data }: { data: Data }) {
  return <Render config={config} data={data} />
}
