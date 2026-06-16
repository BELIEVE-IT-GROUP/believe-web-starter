/**
 * Custom Sections — shared base types.
 *
 * Only cross-cutting types live here. Each section declares and EXPORTS its own
 * props interface in its own file (e.g. HeroSectionProps in HeroSection.tsx).
 */

export type { BlockAppearance } from '../blocks/appearance'

/** Image reference as it arrives from Payload (media relation or plain url). */
export interface MediaRef {
  url?: string
  alt?: string
  width?: number
  height?: number
}

/** A single call-to-action link. `style` mirrors the CMS select. */
export interface CtaLink {
  text?: string
  /** Some blocks use `label` instead of `text` — both accepted by consumers. */
  label?: string
  url?: string
  style?: 'primary' | 'secondary' | 'outline' | 'ghost' | string
  newTab?: boolean
}

/** Richtext can be a Lexical object or a plain string. */
export type RichText = string | { root?: { children?: unknown[] } } | Record<string, unknown>
