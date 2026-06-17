import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { backupPages } from "../lib/backup.js";

const tool: Tool = {
  name: "puck_backup_pages",
  description:
    "Baja todas las páginas (Puck Data) de un tenant del CMS live a archivos JSON locales. Default: <repo>/backups/<tenant>/. Pasá 'dir' para otra ruta.",
  inputSchema: {
    type: "object",
    properties: {
      tenant: { type: "string", description: "slug del tenant" },
      dir: { type: "string", description: "directorio destino (opcional)" },
    },
    required: ["tenant"],
    additionalProperties: false,
  },
  async handler(args) {
    try {
      const res = await backupPages(
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
