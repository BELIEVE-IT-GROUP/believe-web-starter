import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { getRemotePage } from "../lib/cms-api.js";

const tool: Tool = {
  name: "puck_get_page",
  description:
    "Lee el Puck Data (contenido editable) de una página del CMS live vía el endpoint de servicio (X-CMS-Key). Devuelve el JSON o null si no existe.",
  inputSchema: {
    type: "object",
    properties: {
      tenant: { type: "string", description: "slug del tenant, p.ej. 'birdman'" },
      slug: { type: "string", description: "slug de la página, p.ej. 'home'" },
    },
    required: ["tenant", "slug"],
    additionalProperties: false,
  },
  async handler(args) {
    try {
      const data = await getRemotePage(String(args.tenant ?? ""), String(args.slug ?? ""));
      return json(data);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
};

export default tool;
