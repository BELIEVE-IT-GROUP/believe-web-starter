import type { Tool } from "./_types.js";
import { json } from "./_types.js";
import { listBlocks } from "../lib/store.js";

const tool: Tool = {
  name: "puck_list_blocks",
  description:
    "Lista los bloques de un block set (archivos .ts/.tsx en src/cms/blocks/<blockSet>/).",
  inputSchema: {
    type: "object",
    properties: {
      blockSet: { type: "string", description: 'nombre del block set, p.ej. "birdman"' },
    },
    required: ["blockSet"],
    additionalProperties: false,
  },
  async handler(args) {
    return json(await listBlocks(String(args.blockSet ?? "")));
  },
};

export default tool;
