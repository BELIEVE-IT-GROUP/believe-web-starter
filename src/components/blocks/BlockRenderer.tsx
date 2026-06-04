import { resolveBlockComponent, type RenderableBlock } from '@/components/flowbite-pro/registry'

export function BlockRenderer({ blocks }: { blocks: RenderableBlock[] }) {
  if (!blocks?.length) return null

  return (
    <div>
      {blocks.map((block, i) => {
        const Component = resolveBlockComponent(block)
        if (!Component) {
          console.warn(`Block "${block.blockType}" / template "${block.templateId}" not found`)
          return null
        }
        return <Component key={`${block.id}-${i}`} {...block} />
      })}
    </div>
  )
}
