/**
 * Config Puck del CMS Believe. Un set de bloques por marca.
 *
 * El workflow agrega aquí los 13 bloques restantes de birdman (imports +
 * components + categories). Patrón de cada bloque: ver blocks/birdman/Hero.tsx.
 */
import type { Config } from '@measured/puck'
import { Root } from './blocks/birdman/Root'
import { Hero } from './blocks/birdman/Hero'
import { QueHacemos } from './blocks/birdman/QueHacemos'
import { Problemas } from './blocks/birdman/Problemas'
import { Soluciones } from './blocks/birdman/Soluciones'
import { Industrias } from './blocks/birdman/Industrias'
import { Beneficios } from './blocks/birdman/Beneficios'
import { Tecnologia } from './blocks/birdman/Tecnologia'
import { Metodologia } from './blocks/birdman/Metodologia'
import { Casos } from './blocks/birdman/Casos'
import { Calculadora } from './blocks/birdman/Calculadora'
import { Diagnostico } from './blocks/birdman/Diagnostico'
import { Recursos } from './blocks/birdman/Recursos'
import { Blog } from './blocks/birdman/Blog'
import { Faq } from './blocks/birdman/Faq'

export const config = {
  root: Root,
  components: {
    Hero,
    QueHacemos,
    Problemas,
    Soluciones,
    Industrias,
    Beneficios,
    Tecnologia,
    Metodologia,
    Casos,
    Calculadora,
    Diagnostico,
    Recursos,
    Blog,
    Faq,
  },
  categories: {
    birdman: {
      title: 'Secciones birdman',
      components: [
        'Hero',
        'QueHacemos',
        'Problemas',
        'Soluciones',
        'Industrias',
        'Beneficios',
        'Tecnologia',
        'Metodologia',
        'Casos',
        'Calculadora',
        'Diagnostico',
        'Recursos',
        'Blog',
        'Faq',
      ],
    },
  },
} as unknown as Config
