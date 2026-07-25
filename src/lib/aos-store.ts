import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * brand.json (Agent-Readable Brand Profile) por landing.
 *
 * Viene del AOS de Maasy (perfil de marca por project_id), no es auto-derivable
 * del HTML — se versiona en git como data/aos/<slug>-brand.json y se deploya.
 * Para actualizarlo: descargar el brand.json del AOS y reemplazar el archivo.
 */
export async function loadBrandJson(slug: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'aos', `${slug}-brand.json`), 'utf8')
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}
