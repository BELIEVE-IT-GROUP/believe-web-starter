import type { ComponentType } from 'react'

import { BlogListBlock } from '@/components/blocks/BlogListBlock'
import { ContactBlock } from '@/components/blocks/ContactBlock'
import { CtaBlock } from '@/components/blocks/CtaBlock'
import { FaqBlock } from '@/components/blocks/FaqBlock'
import { FeaturesBlock } from '@/components/blocks/FeaturesBlock'
import { GalleryBlock } from '@/components/blocks/GalleryBlock'
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { LogoCloudBlock } from '@/components/blocks/LogoCloudBlock'
import { NewsletterBlock } from '@/components/blocks/NewsletterBlock'
import { PricingBlock } from '@/components/blocks/PricingBlock'
import { SplitContentBlock } from '@/components/blocks/SplitContentBlock'
import { StatsBlock } from '@/components/blocks/StatsBlock'
import { TeamBlock } from '@/components/blocks/TeamBlock'
import { TestimonialsBlock } from '@/components/blocks/TestimonialsBlock'
import { VideoEmbedBlock } from '@/components/blocks/VideoEmbedBlock'

export type RenderableBlock = {
  id?: string
  blockType: string
  templateId?: string
  appearance?: Record<string, unknown>
  [key: string]: unknown
}

export type FlowbiteBlockComponent = ComponentType<any>

const byBlockType: Record<string, FlowbiteBlockComponent> = {
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

const templateAliases: Record<string, string> = {
  // Hero
  'hero.default': 'hero',
  'hero.visual-image-heading': 'hero',
  'hero.search-datepicker': 'hero',
  'hero.email-signup-video': 'hero',
  'hero.illustration-email-signup': 'hero',
  'hero.cover-image-ctas': 'hero',
  'hero.screenshot-download': 'hero',
  'hero.search-bar': 'hero',
  'hero.video-embed-cta': 'hero',
  'hero.signup-cta': 'hero',
  'hero.app-preview-ctas': 'hero',
  'hero.background-cover-ctas': 'hero',
  'hero.crypto': 'hero',
  'hero.background-image-cards': 'hero',
  'hero.carousel': 'hero',
  'hero.book-cover': 'hero',
  'hero.blog-posts-featured': 'hero',
  'hero.phone-mockup-download': 'hero',
  'hero.storefront-default': 'hero',
  'hero.storefront-background-image': 'hero',
  'hero.storefront-full-slider': 'hero',
  'hero.storefront-grid-view': 'hero',

  // Marketing sections
  'features.default': 'features',
  'features.image-list': 'features',
  'features.cta-list': 'features',
  'features.icons-list': 'features',
  'features.icon-list-cta': 'features',
  'features.description-icon-list': 'features',
  'features.card-list': 'features',
  'features.alternate': 'features',
  'features.comparison': 'features',
  'features.rounded-icons': 'features',
  'pricing.default': 'pricing',
  'pricing.tabs-selector': 'pricing',
  'pricing.horizontal': 'pricing',
  'pricing.feature-list': 'pricing',
  'pricing.comparison-table': 'pricing',
  'pricing.highlighted-plan': 'pricing',
  'pricing.toggle': 'pricing',
  'testimonials.blockquote': 'testimonials',
  'testimonials.carousel-slider': 'testimonials',
  'testimonials.grid-layout-cards': 'testimonials',
  'testimonials.cards': 'testimonials',
  'testimonials.tabs': 'testimonials',
  'cta.default': 'cta',
  'cta.cards-icons': 'cta',
  'cta.email-signup': 'cta',
  'cta.finance-trading': 'cta',
  'cta.heading-button': 'cta',
  'cta.image-button': 'cta',
  'cta.mobile-app': 'cta',
  'cta.qr-code': 'cta',
  'cta.tabs-mobile-app': 'cta',
  'cta.two-cards': 'cta',
  'cta.banner-default': 'cta',
  'cta.banner-announcement': 'cta',
  'cta.banner-launch': 'cta',
  'faq.accordion': 'faq',
  'faq.default': 'faq',
  'faq.grid-layout': 'faq',
  'faq.help-center': 'faq',
  'faq.help-center-search': 'faq',
  'faq.customer-service': 'faq',
  'stats.default': 'stats',
  'stats.card-statistics': 'stats',
  'stats.carousel-slider': 'stats',
  'stats.heading-statistics': 'stats',
  'stats.icon-statistics': 'stats',
  'stats.illustration': 'stats',
  'stats.content-social-proof': 'stats',
  'team.default': 'team',
  'team.carousel-slider': 'team',
  'team.cta-grid': 'team',
  'team.description': 'team',
  'team.four-columns': 'team',
  'team.grid-cards': 'team',
  'team.grid-clean': 'team',
  'team.overlay-zoom': 'team',
  'logo-cloud.default': 'logo-cloud',
  'logo-cloud.4-columns': 'logo-cloud',
  'logo-cloud.cards-cta': 'logo-cloud',
  'logo-cloud.cards-description': 'logo-cloud',
  'logo-cloud.heading-grid': 'logo-cloud',
  'gallery.image-gallery': 'gallery',
  'gallery.portfolio-default': 'gallery',
  'gallery.portfolio-alternate': 'gallery',
  'gallery.portfolio-carousel': 'gallery',
  'gallery.portfolio-featured-image': 'gallery',
  'gallery.portfolio-grid-layout': 'gallery',
  'contact.default': 'contact',
  'contact.address-location': 'contact',
  'contact.background-image': 'contact',
  'contact.company-information': 'contact',
  'contact.help-center': 'contact',
  'contact.links': 'contact',
  'split-content.two-columns': 'split-content',
  'split-content.heading-description': 'split-content',
  'split-content.heading-images': 'split-content',
  'split-content.feature-list': 'split-content',
  'split-content.card-images': 'split-content',
  'split-content.table-contents': 'split-content',
  'video-embed.content-video': 'video-embed',
  'video-embed.hero-video-cta': 'video-embed',
  'video-embed.hero-email-video': 'video-embed',
  'newsletter.default': 'newsletter',
  'newsletter.banner': 'newsletter',
  'newsletter.email-signup-card': 'newsletter',
  'newsletter.modal-signup': 'newsletter',
  'newsletter.popup-email': 'newsletter',
  'blog-list.default': 'blog-list',
  'blog-list.card-with-image': 'blog-list',
  'blog-list.centered-posts': 'blog-list',
  'blog-list.featured-post': 'blog-list',
  'blog-list.list-with-heading': 'blog-list',
  'blog-list.publisher-related-default': 'blog-list',
  'blog-list.publisher-related-grid': 'blog-list',
  'blog-list.publisher-related-carousel': 'blog-list',
  'blog-list.publisher-related-horizontal': 'blog-list',
}

export function resolveBlockComponent(block: RenderableBlock) {
  if (block.templateId) {
    const aliasedType = templateAliases[block.templateId]
    if (aliasedType) return byBlockType[aliasedType]
  }

  return byBlockType[block.blockType]
}
