import { resolveBlockComponent, type RenderableBlock } from '@/components/flowbite-pro/registry'
import { resolveFlowbiteTemplate } from '@/flowbite/registry.generated'
import { isPorted } from '@/flowbite/ported'

/**
 * A4 — Routing por templateId con 3 niveles (sin romper Fase 1):
 *   1. templateId deep-portado  → variante Flowbite (acepta props CMS + tokens de theme).
 *   2. componente legacy por blockType → render Fase 1 con contenido real (home believe).
 *   3. templateId sin legacy    → variante Flowbite cruda (contenido demo) como último recurso.
 */
export function BlockRenderer({ blocks }: { blocks: RenderableBlock[] }) {
  if (!blocks?.length) return null

  return (
    <div>
      {blocks.map((block, i) => {
        const key = `${block.id ?? block.blockType}-${i}`

        // 1. Variante deep-portada: toma precedencia sobre el legacy.
        if (isPorted(block.templateId)) {
          const Ported = resolveFlowbiteTemplate(block.templateId)
          if (Ported) return <Ported key={key} {...block} />
        }

        // 2. Componente legacy de Fase 1 (preserva la home believe).
        const Legacy = resolveBlockComponent(block)
        if (Legacy) return <Legacy key={key} {...block} />

        // 3. Último recurso: variante Flowbite por templateId (sin legacy para esa blockType).
        const Flowbite = resolveFlowbiteTemplate(block.templateId)
        if (Flowbite) return <Flowbite key={key} {...block} />

        console.warn(`Block "${block.blockType}" / template "${block.templateId}" not found`)
        return null
      })}
    </div>
  )
}
