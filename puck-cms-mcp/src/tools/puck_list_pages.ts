import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { listRemotePages } from "../lib/cms-api.js";

const tool: Tool = {
  name: "puck_list_pages",
  description:
    "Lista las páginas de un tenant en el CMS live (vía endpoint de servicio). El contenido vive en el volumen del CMS, no en el repo, por eso es remoto.",
  inputSchema: {
    type: "object",
    properties: {
      tenant: { type: "string", description: "slug del tenant, p.ej. 'birdman'" },
    },
    required: ["tenant"],
    additionalProperties: false,
  },
  async handler(args) {
    try {
      const pages = await listRemotePages(String(args.tenant ?? ""));
      return json({ tenant: args.tenant, pages });
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
};

export default tool;
