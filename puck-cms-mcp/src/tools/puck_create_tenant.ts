import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { getTenant, saveTenant, listBlockSets, type Tenant } from "../lib/store.js";
import { assertSlug } from "../lib/repo.js";

const tool: Tool = {
  name: "puck_create_tenant",
  description:
    "Crea un tenant nuevo escribiendo data/tenants/<slug>.json. El blockSet debe existir ya en src/cms/blocks/ (crear bloques a medida es trabajo del skill /believe-web, no del MCP). Falla si el tenant ya existe.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: "slug url-safe único (a-z, 0-9, '-')" },
      name: { type: "string", description: "nombre legible del tenant" },
      blockSet: { type: "string", description: "block set existente, p.ej. 'birdman'" },
      tokens: {
        type: "object",
        description: "overrides de tokens CSS (:root vars) por tenant",
        additionalProperties: { type: "string" },
      },
      settings: { type: "object", description: "ajustes libres del tenant" },
    },
    required: ["slug", "name", "blockSet"],
    additionalProperties: false,
  },
  async handler(args) {
    const slug = String(args.slug ?? "");
    const name = String(args.name ?? "").trim();
    const blockSet = String(args.blockSet ?? "");
    if (!name) return errorResult("name es obligatorio");
    try {
      assertSlug(slug);
    } catch (e) {
      return errorResult((e as Error).message);
    }
    if (await getTenant(slug)) {
      return errorResult(`tenant '${slug}' ya existe. Usá puck_update_tenant para modificarlo.`);
    }
    const sets = await listBlockSets();
    if (!sets.includes(blockSet)) {
      return errorResult(
        `blockSet '${blockSet}' no existe. Disponibles: ${sets.join(", ") || "(ninguno)"}. ` +
          "Para una marca nueva, generá los bloques con el skill /believe-web primero.",
      );
    }
    const tenant: Tenant = {
      slug,
      name,
      blockSet,
      tokens: (args.tokens as Record<string, string>) ?? {},
      settings: (args.settings as Record<string, unknown>) ?? {},
    };
    await saveTenant(tenant);
    return json({ ok: true, created: tenant, file: `data/tenants/${slug}.json` });
  },
};

export default tool;
