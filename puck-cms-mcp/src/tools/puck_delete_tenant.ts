import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { getTenant, deleteTenant } from "../lib/store.js";

const tool: Tool = {
  name: "puck_delete_tenant",
  description:
    "Borra el registro de un tenant (data/tenants/<slug>.json). Requiere confirm:true. NO borra las páginas en el volumen del CMS ni los bloques del block set; solo da de baja el tenant.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: "slug del tenant a borrar" },
      confirm: { type: "boolean", description: "debe ser true para confirmar el borrado" },
    },
    required: ["slug", "confirm"],
    additionalProperties: false,
  },
  async handler(args) {
    const slug = String(args.slug ?? "");
    if (args.confirm !== true) {
      return errorResult("borrado no confirmado: pasá confirm:true para borrar el tenant");
    }
    const t = await getTenant(slug);
    if (!t) return errorResult(`tenant '${slug}' no existe en data/tenants/`);
    const ok = await deleteTenant(slug);
    return json({
      ok,
      deleted: slug,
      note: "las páginas en el volumen del CMS (data/pages) NO se borraron; bajalas antes con puck_backup_pages si las necesitás.",
    });
  },
};

export default tool;
