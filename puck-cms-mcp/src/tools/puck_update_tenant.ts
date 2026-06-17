import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { getTenant, saveTenant, listBlockSets, type Tenant } from "../lib/store.js";

const tool: Tool = {
  name: "puck_update_tenant",
  description:
    "Modifica un tenant existente (merge superficial). Solo aplica los campos provistos: name, blockSet, tokens, settings. Si cambia blockSet, valida que exista.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: "slug del tenant a modificar" },
      name: { type: "string" },
      blockSet: { type: "string" },
      tokens: { type: "object", additionalProperties: { type: "string" } },
      settings: { type: "object" },
    },
    required: ["slug"],
    additionalProperties: false,
  },
  async handler(args) {
    const slug = String(args.slug ?? "");
    const t = await getTenant(slug);
    if (!t) return errorResult(`tenant '${slug}' no existe en data/tenants/`);

    const next: Tenant = { ...t };
    if (args.name !== undefined) next.name = String(args.name).trim();
    if (args.blockSet !== undefined) {
      const blockSet = String(args.blockSet);
      const sets = await listBlockSets();
      if (!sets.includes(blockSet)) {
        return errorResult(`blockSet '${blockSet}' no existe. Disponibles: ${sets.join(", ")}.`);
      }
      next.blockSet = blockSet;
    }
    if (args.tokens !== undefined) next.tokens = args.tokens as Record<string, string>;
    if (args.settings !== undefined) next.settings = args.settings as Record<string, unknown>;

    await saveTenant(next);
    return json({ ok: true, updated: next });
  },
};

export default tool;
