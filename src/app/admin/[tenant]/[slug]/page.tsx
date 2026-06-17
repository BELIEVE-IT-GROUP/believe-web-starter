import type { Data } from '@measured/puck'
import { getPage } from '@/cms/store'
import { buildBirdmanSeed } from '@/cms/seed'
import { Editor } from './Editor'

const EMPTY: Data = { content: [], root: { props: {} } } as unknown as Data

export default async function EditPage({ params }: { params: { tenant: string; slug: string } }) {
  const { tenant, slug } = params
  const data = (await getPage(tenant, slug)) ?? (tenant === 'birdman' ? buildBirdmanSeed() : EMPTY)
  return <Editor tenant={tenant} slug={slug} data={data} />
}
