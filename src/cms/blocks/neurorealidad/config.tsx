/**
 * Config Puck del tenant NeuroRealidad. El workflow agrega aquí los bloques
 * restantes (imports + components + categories). Patrón: ver Hero.tsx.
 */
import type { Config } from '@measured/puck'
import { Root } from './Root'
import { Hero } from './Hero'
import { Cerebro } from './Cerebro'
import { Reconoces } from './Reconoces'
import { Camino } from './Camino'
import { Promesa } from './Promesa'
import { Dentro } from './Dentro'
import { Autor } from './Autor'
import { Voces } from './Voces'
import { Oferta } from './Oferta'
import { Faq } from './Faq'
import { Final } from './Final'

export const neurorealidadConfig = {
  root: Root,
  components: {
    Hero,
    Cerebro,
    Reconoces,
    Camino,
    Promesa,
    Dentro,
    Autor,
    Voces,
    Oferta,
    Faq,
    Final,
  },
  categories: {
    neurorealidad: {
      title: 'Secciones NeuroRealidad',
      components: [
        'Hero',
        'Cerebro',
        'Reconoces',
        'Camino',
        'Promesa',
        'Dentro',
        'Autor',
        'Voces',
        'Oferta',
        'Faq',
        'Final',
      ],
    },
  },
} as unknown as Config
