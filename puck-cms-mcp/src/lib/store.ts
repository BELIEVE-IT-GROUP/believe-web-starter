/**
 * Lectura/escritura del store en disco del CMS Puck (data/tenants, src/cms/blocks).
 * Reimplementa lo justo de src/cms/store.ts del repo para quedar desacoplado del
 * build de Next (que usa process.cwd()). Mantener la forma de Tenant en sync.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { blocksDir, tenantFile, tenantsDir } from "./repo.js";

export interface Tenant {
  slug: string;
  name: string;
  /** Qué set de bloques usa el tenant (subdir de src/cms/blocks/). */
  blockSet: string;
  /** Overrides de tokens CSS (:root vars) por tenant. */
  tokens?: Record<string, string>;
  settings?: Record<string, unknown>;
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export async function listTenants(): Promise<Tenant[]> {
  const files = await fs.readdir(tenantsDir).catch(() => [] as string[]);
  const out: Tenant[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const t = await readJson<Tenant>(path.join(tenantsDir, f));
    if (t) out.push(t);
  }
  return out;
}

export const getTenant = (slug: string) => readJson<Tenant>(tenantFile(slug));

export async function saveTenant(t: Tenant): Promise<void> {
  await fs.mkdir(tenantsDir, { recursive: true });
  await fs.writeFile(tenantFile(t.slug), JSON.stringify(t, null, 2) + "\n");
}

/** Borra data/tenants/<slug>.json. Devuelve true si existía. */
export async function deleteTenant(slug: string): Promise<boolean> {
  try {
    await fs.unlink(tenantFile(slug));
    return true;
  } catch {
    return false;
  }
}

/** Block sets = subdirectorios de src/cms/blocks/. */
export async function listBlockSets(): Promise<string[]> {
  const entries = await fs.readdir(blocksDir, { withFileTypes: true }).catch(() => []);
  return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
}

/**
 * Bloques de un set = componentes Puck en src/cms/blocks/<blockSet>/.
 * ponytail: un bloque Puck es un componente React PascalCase (Hero, Beneficios, Root).
 * Excluye helpers lowercase (config, seed, fields) y módulos con punto (nr.css.ts).
 * Upgrade path: si algún set nombra bloques distinto, leer los keys de su Config.
 */
export async function listBlocks(blockSet: string): Promise<string[]> {
  const dir = path.join(blocksDir, blockSet);
  const files = await fs.readdir(dir).catch(() => [] as string[]);
  return files
    .filter((f) => /\.(tsx|ts)$/.test(f))
    .map((f) => f.replace(/\.(tsx|ts)$/, ""))
    .filter((name) => /^[A-Z][A-Za-z0-9]*$/.test(name))
    .sort();
}
