/**
 * Registry multi-tenant del CMS Puck. Mapea blockSet (del tenant) → su Config y su seed.
 * Cada tenant tiene su propio set de bloques a medida bajo blocks/<blockSet>/.
 */
import type { Config, Data } from '@measured/puck'
import { config as birdmanConfig } from './puck.config'
import { buildBirdmanSeed } from './seed'
import { neurorealidadConfig } from './blocks/neurorealidad/config'
import { buildNeurorealidadSeed } from './blocks/neurorealidad/seed'

const CONFIGS: Record<string, Config> = {
  birdman: birdmanConfig,
  neurorealidad: neurorealidadConfig,
}

const SEEDS: Record<string, () => Data> = {
  birdman: buildBirdmanSeed,
  neurorealidad: buildNeurorealidadSeed,
}

export function getConfig(blockSet: string): Config {
  return CONFIGS[blockSet] || birdmanConfig
}

export function getSeed(blockSet: string): Data | null {
  const f = SEEDS[blockSet]
  return f ? f() : null
}

/**
 * Puck <Render> NO aplica defaultProps (solo el editor al agregar un bloque).
 * Mergeamos los defaultProps de cada componente/root sobre los props guardados,
 * así un seed con solo { id } igual renderiza el contenido completo. Llamar SOLO
 * desde componentes client (PublicRender/Editor), nunca desde el server.
 */
export function withDefaults(config: Config, data: Data): Data {
  const c = config as any
  const d = (data || {}) as any
  const root = { ...(d.root || {}), props: { ...(c.root?.defaultProps || {}), ...((d.root && d.root.props) || {}) } }
  const content = (d.content || []).map((it: any) => ({
    ...it,
    props: { ...(c.components?.[it.type]?.defaultProps || {}), ...(it.props || {}) },
  }))
  return { ...d, root, content } as Data
}
