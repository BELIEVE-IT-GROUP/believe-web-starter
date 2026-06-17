import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { publishRemotePage } from "../lib/cms-api.js";

const tool: Tool = {
  name: "puck_publish_page",
  description:
    "Publica (guarda) el Puck Data de una página en el CMS live vía el endpoint de servicio (X-CMS-Key). Sobrescribe el contenido actual de esa página. NO genera bloques: 'data' debe ser un Puck Data válido del block set del tenant.",
  inputSchema: {
    type: "object",
    properties: {
      tenant: { type: "string", description: "slug del tenant" },
      slug: { type: "string", description: "slug de la página, p.ej. 'home'" },
      data: {
        type: "object",
        description: "Puck Data completo { root, content, zones? } a guardar",
      },
    },
    required: ["tenant", "slug", "data"],
    additionalProperties: false,
  },
  async handler(args) {
    try {
      const res = await publishRemotePage(
        String(args.tenant ?? ""),
        String(args.slug ?? ""),
        args.data,
      );
      return json(res);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
};

export default tool;
