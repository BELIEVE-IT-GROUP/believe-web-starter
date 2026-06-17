import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { getTenant, saveTenant } from "../lib/store.js";

const tool: Tool = {
  name: "puck_set_tokens",
  description:
    "Reemplaza el objeto de tokens CSS (:root vars) de un tenant. Atajo del caso común 'cambiar la paleta/marca'. Para merge parcial de otros campos usá puck_update_tenant.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: "slug del tenant" },
      tokens: {
        type: "object",
        description: "objeto token->valor, p.ej. { '--brand': '#0c3bb9' }",
        additionalProperties: { type: "string" },
      },
    },
    required: ["slug", "tokens"],
    additionalProperties: false,
  },
  async handler(args) {
    const slug = String(args.slug ?? "");
    const t = await getTenant(slug);
    if (!t) return errorResult(`tenant '${slug}' no existe en data/tenants/`);
    t.tokens = (args.tokens as Record<string, string>) ?? {};
    await saveTenant(t);
    return json({ ok: true, slug, tokens: t.tokens });
  },
};

export default tool;
