/**
 * Custom Sections registry.
 *
 * Maps `<blockType>.custom` templateIds to their custom section component.
 * BlockRenderer consults this FIRST (level 0): if resolveCustomSection returns
 * a component, it renders that and skips the 3 Flowbite levels.
 *
 * SiteHeader / SiteFooter are NOT registered here: they are site chrome
 * (Settings.header / Settings.footer), not page blocks.
 *
 * Phase 2 agents replace each component's body in its own file. They MUST NOT
 * edit this file — the mapping is frozen.
 */

import type { ComponentType } from 'react'

import { BenefitsGrid } from './BenefitsGrid'
import { BlogPreview } from './BlogPreview'
import { CaseStudies } from './CaseStudies'
import { ContactSection } from './ContactSection'
import { ContentSplit } from './ContentSplit'
import { DashboardPanel } from './DashboardPanel'
import { FaqAccordion } from './FaqAccordion'
import { FeatureGrid } from './FeatureGrid'
import { GalleryGrid } from './GalleryGrid'
import { HeroSection } from './HeroSection'
import { IndustriesPills } from './IndustriesPills'
import { LeadCTA } from './LeadCTA'
import { LogoBar } from './LogoBar'
import { MetricsPanel } from './MetricsPanel'
import { NewsletterBar } from './NewsletterBar'
import { PainSection } from './PainSection'
import { PricingTable } from './PricingTable'
import { ResourceCards } from './ResourceCards'
import { SavingsCalculator } from './SavingsCalculator'
import { SocialProof } from './SocialProof'
import { SolutionsList } from './SolutionsList'
import { StepsSection } from './StepsSection'
import { TeamGrid } from './TeamGrid'
import { VideoSection } from './VideoSection'

export const customByTemplateId: Record<string, ComponentType<any>> = {
  'hero.custom': HeroSection,
  'features.custom': FeatureGrid,
  'stats.custom': MetricsPanel,
  'testimonials.custom': SocialProof,
  'cta.custom': LeadCTA,
  'faq.custom': FaqAccordion,
  'logo-cloud.custom': LogoBar,
  'split-content.custom': ContentSplit,
  'pricing.custom': PricingTable,
  'team.custom': TeamGrid,
  'contact.custom': ContactSection,
  'gallery.custom': GalleryGrid,
  'video-embed.custom': VideoSection,
  'newsletter.custom': NewsletterBar,
  'blog-list.custom': BlogPreview,
  'pain.custom': PainSection,
  'steps.custom': StepsSection,
  'dashboard-panel.custom': DashboardPanel,
  'solutions-list.custom': SolutionsList,
  'industries-pills.custom': IndustriesPills,
  'benefits-grid.custom': BenefitsGrid,
  'case-studies.custom': CaseStudies,
  'savings-calculator.custom': SavingsCalculator,
  'resource-cards.custom': ResourceCards,
}

/** Returns the custom section component for a templateId, or undefined. */
export function resolveCustomSection(templateId?: string): ComponentType<any> | undefined {
  if (!templateId) return undefined
  return customByTemplateId[templateId]
}
