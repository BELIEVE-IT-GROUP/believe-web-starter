/**
 * Composición inicial de la home de NeuroRealidad como Puck Data.
 * El workflow expande `content` con los bloques restantes en orden.
 * Los defaults de cada bloque (defaultProps) proveen el copy → render fiel.
 */
import type { Data } from '@measured/puck'

export function buildNeurorealidadSeed(): Data {
  return {
    root: { props: { ctaLabel: 'Conseguir el libro' } },
    content: [
      { type: 'Hero', props: { id: 'Hero-1' } },
      { type: 'Cerebro', props: { id: 'Cerebro-1' } },
      { type: 'Reconoces', props: { id: 'Reconoces-1' } },
      { type: 'Camino', props: { id: 'Camino-1' } },
      { type: 'Promesa', props: { id: 'Promesa-1' } },
      { type: 'Dentro', props: { id: 'Dentro-1' } },
      { type: 'Autor', props: { id: 'Autor-1' } },
      { type: 'Voces', props: { id: 'Voces-1' } },
      { type: 'Oferta', props: { id: 'Oferta-1' } },
      { type: 'Faq', props: { id: 'Faq-1' } },
      { type: 'Final', props: { id: 'Final-1' } },
    ],
  } as unknown as Data
}
