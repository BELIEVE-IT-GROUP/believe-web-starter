import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { restorePages } from "../lib/backup.js";

const tool: Tool = {
  name: "puck_restore_pages",
  description:
    "Sube las páginas (Puck Data) de un backup local al CMS live (sobrescribe). Default: <repo>/backups/<tenant>/. Pasá 'dir' para otra ruta. Pareja de puck_backup_pages.",
  inputSchema: {
    type: "object",
    properties: {
      tenant: { type: "string", description: "slug del tenant destino" },
      dir: { type: "string", description: "directorio origen del backup (opcional)" },
    },
    required: ["tenant"],
    additionalProperties: false,
  },
  async handler(args) {
    try {
      const res = await restorePages(
        String(args.tenant ?? ""),
        args.dir ? String(args.dir) : undefined,
      );
      return json({ ok: true, ...res });
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
};

export default tool;
