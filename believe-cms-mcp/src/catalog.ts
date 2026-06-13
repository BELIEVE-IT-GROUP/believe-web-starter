/**
 * Flowbite block catalog reader.
 *
 * Reads flowbite-catalog.json (133 templateId entries of the form
 * '<blockType>.<variant>') and exposes a flat, typed listing. The JSON is read
 * from disk at runtime (not imported) so the compiled output does not need to
 * carry the file inside dist/.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export interface CatalogTemplate {
  templateId: string;
  blockType: string;
  label: string;
}

interface RawTemplate {
  templateId: string;
  blockType: string;
  label?: string;
  sourceFile?: string;
  exists?: boolean;
}

interface RawCatalog {
  templates?: RawTemplate[];
}

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Candidate locations for the catalog JSON, in priority order:
 * 1. next to the compiled file (dist/) if it was copied there,
 * 2. the source location one level up (src/) which always holds the committed
 *    copy, both when running from dist/ and when running ts directly.
 */
const CANDIDATES = [
  join(here, "flowbite-catalog.json"),
  join(here, "..", "src", "flowbite-catalog.json"),
];

let cache: CatalogTemplate[] | undefined;

function readCatalog(): CatalogTemplate[] {
  if (cache) return cache;
  let lastError: unknown;
  for (const path of CANDIDATES) {
    try {
      const raw = JSON.parse(readFileSync(path, "utf8")) as RawCatalog;
      const templates = Array.isArray(raw.templates) ? raw.templates : [];
      cache = templates
        .filter((t): t is RawTemplate => typeof t?.templateId === "string")
        .map((t) => ({
          templateId: t.templateId,
          blockType: t.blockType,
          label: t.label ?? t.templateId,
        }));
      return cache;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `Could not load flowbite-catalog.json. Looked in: ${CANDIDATES.join(
      ", ",
    )}. Last error: ${String(lastError)}`,
  );
}

/**
 * List catalog templates, optionally filtered by block type.
 * Returns [{ templateId, label, blockType }].
 */
export function listTemplates(blockType?: string): CatalogTemplate[] {
  const all = readCatalog();
  if (!blockType) return all;
  const wanted = blockType.toLowerCase();
  return all.filter((t) => t.blockType.toLowerCase() === wanted);
}

/** Return the distinct block types present in the catalog, sorted. */
export function listBlockTypes(): string[] {
  const set = new Set(readCatalog().map((t) => t.blockType));
  return [...set].sort();
}

/** Look up a single template by its templateId. */
export function getTemplate(templateId: string): CatalogTemplate | undefined {
  return readCatalog().find((t) => t.templateId === templateId);
}

/** Whether a templateId exists in the catalog. */
export function hasTemplate(templateId: string): boolean {
  return getTemplate(templateId) !== undefined;
}
