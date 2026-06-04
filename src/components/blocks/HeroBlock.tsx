import Link from 'next/link'
import { Button, Badge } from 'flowbite-react'
import Image from 'next/image'

import { getMediaUrl } from '@/lib/payload'

import {
  getAlignmentClassName,
  getContainerClassName,
  getSectionProps,
  type BlockAppearance,
} from './appearance'

export function HeroBlock(props: {
  variant?: string
  headline?: string
  subheadline?: string
  ctas?: { text: string; url: string; style: string }[]
  image?: { url: string; alt?: string }
  videoUrl?: string
  badge?: string
  appearance?: BlockAppearance
}) {
  const { headline, subheadline, ctas, image, badge, appearance } = props
  const imageUrl = getMediaUrl(image)
  const sectionProps = getSectionProps(appearance, { background: 'bg-white dark:bg-gray-900' })
  const alignment = getAlignmentClassName(appearance, 'text-center')

  return (
    <section {...sectionProps}>
      <div className={getContainerClassName(appearance, alignment)}>
        {badge && (
          <Badge color="blue" size="sm" className="mx-auto mb-4 w-fit">
            {badge}
          </Badge>
        )}
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          {headline || 'Bienvenido'}
        </h1>
        {subheadline && (
          <p className="mx-auto mb-8 max-w-2xl text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-xl">
            {subheadline}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {ctas.map((cta, i) => (
              <Button
                key={i}
                href={cta.url || '#'}
                color={cta.style === 'primary' ? 'blue' : 'light'}
                size="lg"
                as={Link}
              >
                {cta.text}
              </Button>
            ))}
          </div>
        )}
        {imageUrl && (
          <div className="mt-12">
            <Image
              src={imageUrl}
              width={1200}
              height={600}
              alt={image?.alt || ''}
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  )
}
