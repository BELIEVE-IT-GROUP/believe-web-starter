/**
 * Birdman — landing /birdman cableada al CMS de Payload con fallback.
 *
 * Server component (async): fetchea el contenido de la collection 'landings'
 * del CMS por slug + tenant, y lo mergea encima del default (content.ts) con
 * deepMerge. En dev el CMS no trae datos de birdman, asi que getLandingContent
 * devuelve null → deepMerge(birdmanContent, {}) = birdmanContent y la pagina
 * queda pixel-idéntica. Todo el render (CSS verbatim, JSX, scripts) vive en el
 * client component BirdmanLanding, que recibe el contenido ya resuelto por prop.
 */

import type { Metadata } from 'next'

import { birdmanContent } from './content'
import { getLandingContent, deepMerge } from '@/lib/payload'
import { BirdmanLanding } from './BirdmanLanding'

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getLandingContent('birdman')
  const content = deepMerge(birdmanContent, cms ?? {})
  return {
    title: content.meta.title,
    description: content.meta.description,
  }
}

export default async function BirdmanPage() {
  const cms = await getLandingContent('birdman')
  const content = deepMerge(birdmanContent, cms ?? {})
  return <BirdmanLanding content={content} />
}
