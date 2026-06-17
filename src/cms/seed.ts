/**
 * Composición inicial de la home de birdman como Puck Data.
 *
 * Reusa birdmanContent (content.ts) como fuente de defaults → el render inicial
 * es idéntico al port validado. root.props lleva meta/nav/footer; content lleva
 * las 14 secciones en el orden original del HTML.
 */
import type { Data } from '@measured/puck'
import { birdmanContent } from '@/app/birdman/content'

export function buildBirdmanSeed(): Data {
  const c = birdmanContent
  const block = (type: string, props: object): { type: string; props: { id: string } & Record<string, unknown> } => ({
    type,
    props: { id: `${type}-1`, ...props } as { id: string } & Record<string, unknown>,
  })

  return {
    root: { props: { meta: c.meta, nav: c.nav, footer: c.footer } },
    content: [
      block('Hero', c.hero),
      block('QueHacemos', c.queHacemos),
      block('Problemas', c.problemas),
      block('Soluciones', c.soluciones),
      block('Industrias', c.industrias),
      block('Beneficios', c.beneficios),
      block('Tecnologia', c.tecnologia),
      block('Metodologia', c.metodologia),
      block('Casos', c.casos),
      block('Calculadora', c.calculadora),
      block('Diagnostico', c.diagnostico),
      block('Recursos', c.recursos),
      block('Blog', c.blog),
      block('Faq', c.faq),
    ],
  } as unknown as Data
}
