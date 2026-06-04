import { twMerge } from 'tailwind-merge'

export type BlockAppearance = {
  background?: 'default' | 'white' | 'gray' | 'primary' | 'dark' | 'image'
  container?: 'default' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  spacingTop?: 'default' | 'none' | 'sm' | 'md' | 'lg'
  spacingBottom?: 'default' | 'none' | 'sm' | 'md' | 'lg'
  alignment?: 'default' | 'left' | 'center' | 'right'
  sectionId?: string
  customClassName?: string
}

const backgroundClasses: Record<NonNullable<BlockAppearance['background']>, string> = {
  default: '',
  white: 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white',
  gray: 'bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white',
  primary: 'bg-primary-600 text-white',
  dark: 'bg-gray-900 text-white',
  image: 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white',
}

const containerClasses: Record<NonNullable<BlockAppearance['container']>, string> = {
  default: 'mx-auto max-w-screen-xl px-4',
  md: 'mx-auto max-w-screen-md px-4',
  lg: 'mx-auto max-w-screen-lg px-4',
  xl: 'mx-auto max-w-screen-xl px-4',
  '2xl': 'mx-auto max-w-screen-2xl px-4',
  full: 'w-full px-4',
}

const spacingTopClasses: Record<NonNullable<BlockAppearance['spacingTop']>, string> = {
  default: 'pt-16 lg:pt-24',
  none: 'pt-0',
  sm: 'pt-8 lg:pt-10',
  md: 'pt-12 lg:pt-16',
  lg: 'pt-20 lg:pt-28',
}

const spacingBottomClasses: Record<NonNullable<BlockAppearance['spacingBottom']>, string> = {
  default: 'pb-16 lg:pb-24',
  none: 'pb-0',
  sm: 'pb-8 lg:pb-10',
  md: 'pb-12 lg:pb-16',
  lg: 'pb-20 lg:pb-28',
}

export function getSectionProps(
  appearance?: BlockAppearance,
  defaults?: {
    background?: string
    spacingTop?: string
    spacingBottom?: string
    className?: string
  },
) {
  const background =
    appearance?.background && appearance.background !== 'default'
      ? backgroundClasses[appearance.background]
      : defaults?.background || backgroundClasses.white

  const spacingTop =
    appearance?.spacingTop && appearance.spacingTop !== 'default'
      ? spacingTopClasses[appearance.spacingTop]
      : defaults?.spacingTop || spacingTopClasses.default

  const spacingBottom =
    appearance?.spacingBottom && appearance.spacingBottom !== 'default'
      ? spacingBottomClasses[appearance.spacingBottom]
      : defaults?.spacingBottom || spacingBottomClasses.default

  return {
    id: appearance?.sectionId || undefined,
    className: twMerge(background, spacingTop, spacingBottom, defaults?.className, appearance?.customClassName),
  }
}

export function getContainerClassName(appearance?: BlockAppearance, className?: string) {
  const container =
    appearance?.container && appearance.container !== 'default'
      ? containerClasses[appearance.container]
      : containerClasses.default

  return twMerge(container, className)
}

export function getAlignmentClassName(appearance?: BlockAppearance, fallback = '') {
  if (appearance?.alignment === 'left') return 'text-left'
  if (appearance?.alignment === 'center') return 'text-center'
  if (appearance?.alignment === 'right') return 'text-right'
  return fallback
}
