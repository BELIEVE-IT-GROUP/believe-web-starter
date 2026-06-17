/**
 * Mapa server-safe blockSet -> builder de seed. Aislado de registry.ts a propósito:
 * registry importa los Config de Puck (client modules) y arrastrarlos a un endpoint
 * server dispara "cannot dot into client module". Los builders devuelven data pura.
 * Mantener en sync con SEEDS de registry.ts (1 entrada por tenant).
 */
import type { Data } from '@measured/puck'
import { buildBirdmanSeed } from './seed'
import { buildNeurorealidadSeed } from './blocks/neurorealidad/seed'

const BUILDERS: Record<string, () => Data> = {
  birdman: buildBirdmanSeed,
  neurorealidad: buildNeurorealidadSeed,
}

export function seedFor(blockSet: string): Data | null {
  const f = BUILDERS[blockSet]
  return f ? f() : null
}
