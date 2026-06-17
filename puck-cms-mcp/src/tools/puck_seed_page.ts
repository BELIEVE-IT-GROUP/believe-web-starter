import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { seedRemotePage } from "../lib/cms-api.js";

const tool: Tool = {
  name: "puck_seed_page",
  description:
    "Crea una página nueva en el CMS live ya rellena con el seed del block set del tenant (lista para editar). Falla si la página ya existe salvo force:true. Útil para sumar páginas a un tenant existente sin redeploy.",
  inputSchema: {
    type: "object",
    properties: {
      tenant: { type: "string", description: "slug del tenant" },
      slug: { type: "string", description: "slug de la página nueva, p.ej. 'home'" },
      force: { type: "boolean", description: "true para sobrescribir una página existente con el seed", default: false },
    },
    required: ["tenant", "slug"],
    additionalProperties: false,
  },
  async handler(args) {
    try {
      const res = await seedRemotePage(
        String(args.tenant ?? ""),
        String(args.slug ?? ""),
        args.force === true,
      );
      return json(res);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
};

export default tool;
