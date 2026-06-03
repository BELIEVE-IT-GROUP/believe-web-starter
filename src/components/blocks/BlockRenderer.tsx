import { HeroBlock } from './HeroBlock'
import { FeaturesBlock } from './FeaturesBlock'
import { PricingBlock } from './PricingBlock'
import { TestimonialsBlock } from './TestimonialsBlock'
import { CtaBlock } from './CtaBlock'
import { FaqBlock } from './FaqBlock'
import { StatsBlock } from './StatsBlock'
import { TeamBlock } from './TeamBlock'
import { LogoCloudBlock } from './LogoCloudBlock'
import { GalleryBlock } from './GalleryBlock'
import { ContactBlock } from './ContactBlock'
import { SplitContentBlock } from './SplitContentBlock'
import { VideoEmbedBlock } from './VideoEmbedBlock'
import { NewsletterBlock } from './NewsletterBlock'
import { BlogListBlock } from './BlogListBlock'

const blockComponents: Record<string, React.FC<any>> = {
  hero: HeroBlock,
  features: FeaturesBlock,
  pricing: PricingBlock,
  testimonials: TestimonialsBlock,
  cta: CtaBlock,
  faq: FaqBlock,
  stats: StatsBlock,
  team: TeamBlock,
  'logo-cloud': LogoCloudBlock,
  gallery: GalleryBlock,
  contact: ContactBlock,
  'split-content': SplitContentBlock,
  'video-embed': VideoEmbedBlock,
  newsletter: NewsletterBlock,
  'blog-list': BlogListBlock,
}

export function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return null

  return (
    <div>
      {blocks.map((block, i) => {
        const Component = blockComponents[block.blockType]
        if (!Component) {
          console.warn(`Block type "${block.blockType}" not found`)
          return null
        }
        return <Component key={`${block.id}-${i}`} {...block} />
      })}
    </div>
  )
}
