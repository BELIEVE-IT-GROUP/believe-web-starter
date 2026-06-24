import type { Config } from '@measured/puck'
import { RootRaw } from './RootRaw'
import { RawSection } from './RawSection'
import { EditableSection } from './EditableSection'

/**
 * blockSet 'raw': el genérico para las landings de Maasy. Se registra UNA sola vez
 * en el CMS. Toda landing nueva es DATOS sobre este config (RawSection x N + el CSS
 * global en el Root), sin generar código a medida ni recompilar el CMS.
 *
 * Es el reemplazo prolijo del modelo "un .tsx por sección por marca" (birdman/
 * neurorealidad), que obliga a un docker build por cada landing.
 */
export const rawConfig = {
  root: RootRaw,
  components: { EditableSection, RawSection },
  categories: { raw: { title: 'Secciones', components: ['EditableSection', 'RawSection'] } },
} as unknown as Config
