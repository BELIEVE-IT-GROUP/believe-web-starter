/**
 * Backup/restore del contenido de páginas de un tenant (CMS live <-> archivos locales).
 * El contenido vive en el volumen del CMS, no en el repo: esto baja/sube vía el endpoint.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { repoDir, assertSlug } from "./repo.js";
import { listRemotePages, getRemotePage, publishRemotePage } from "./cms-api.js";

function defaultDir(tenant: string): string {
  return path.join(repoDir, "backups", assertSlug(tenant));
}

export async function backupPages(tenant: string, dir?: string): Promise<{ dir: string; files: string[] }> {
  const target = dir ? path.resolve(dir) : defaultDir(tenant);
  await fs.mkdir(target, { recursive: true });
  const slugs = await listRemotePages(tenant);
  const files: string[] = [];
  for (const slug of slugs) {
    const data = await getRemotePage(tenant, slug);
    const file = path.join(target, `${slug}.json`);
    await fs.writeFile(file, JSON.stringify(data, null, 2));
    files.push(file);
  }
  return { dir: target, files };
}

export async function restorePages(tenant: string, dir?: string): Promise<{ dir: string; restored: string[] }> {
  const source = dir ? path.resolve(dir) : defaultDir(tenant);
  const entries = await fs.readdir(source).catch(() => [] as string[]);
  const restored: string[] = [];
  for (const f of entries) {
    if (!f.endsWith(".json")) continue;
    const slug = f.replace(/\.json$/, "");
    const data = JSON.parse(await fs.readFile(path.join(source, f), "utf8"));
    await publishRemotePage(tenant, slug, data);
    restored.push(slug);
  }
  return { dir: source, restored };
}
