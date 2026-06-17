/**
 * Resolución de rutas del repo believe-web-starter que el MCP opera localmente.
 *
 * ponytail: la raíz del repo sale de PUCK_REPO_DIR; si no está, se resuelve
 * desde la ubicación del binario asumiendo que el MCP vive en <repo>/puck-cms-mcp/.
 * Upgrade path: si el MCP se instala fuera del repo, setear PUCK_REPO_DIR sí o sí.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)); // <repo>/puck-cms-mcp/dist/lib

export const repoDir = process.env.PUCK_REPO_DIR
  ? path.resolve(process.env.PUCK_REPO_DIR)
  : path.resolve(here, "..", "..", ".."); // dist/lib -> dist -> puck-cms-mcp -> <repo>

export const tenantsDir = path.join(repoDir, "data", "tenants");
export const pagesDir = path.join(repoDir, "data", "pages");
export const blocksDir = path.join(repoDir, "src", "cms", "blocks");

export const tenantFile = (slug: string) => path.join(tenantsDir, `${assertSlug(slug)}.json`);
export const pageFile = (tenant: string, slug: string) =>
  path.join(pagesDir, assertSlug(tenant), `${assertSlug(slug)}.json`);

/** Frontera de confianza: los slugs vienen del cliente MCP. Bloquea path traversal. */
export function assertSlug(slug: string): string {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`slug inválido: '${slug}' (permitido: a-z, 0-9, '-')`);
  }
  return slug;
}
