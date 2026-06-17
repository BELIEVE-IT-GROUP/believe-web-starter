import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { getTenant } from "../lib/store.js";

const tool: Tool = {
  name: "puck_get_tenant",
  description:
    "Devuelve el tenant completo (slug, name, blockSet, tokens, settings) o error si no existe.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: 'slug del tenant, p.ej. "birdman"' },
    },
    required: ["slug"],
    additionalProperties: false,
  },
  async handler(args) {
    const slug = String(args.slug ?? "");
    const t = await getTenant(slug);
    if (!t) return errorResult(`tenant '${slug}' no existe en data/tenants/`);
    return json(t);
  },
};

export default tool;
