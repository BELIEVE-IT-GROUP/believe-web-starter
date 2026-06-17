import type { Data } from '@measured/puck'
import { notFound } from 'next/navigation'
import { getPage, getTenant } from '@/cms/store'
import { getSeed } from '@/cms/registry'
import { Editor } from './Editor'

const EMPTY: Data = { content: [], root: { props: {} } } as unknown as Data

export default async function EditPage({ params }: { params: { tenant: string; slug: string } }) {
  const { tenant, slug } = params
  const t = await getTenant(tenant)
  if (!t) notFound()
  const data = (await getPage(tenant, slug)) ?? getSeed(t.blockSet) ?? EMPTY
  return <Editor tenant={tenant} slug={slug} blockSet={t.blockSet} data={data} />
}
