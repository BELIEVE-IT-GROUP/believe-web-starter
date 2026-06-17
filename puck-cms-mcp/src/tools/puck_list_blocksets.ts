import type { Tool } from "./_types.js";
import { json } from "./_types.js";
import { listBlockSets } from "../lib/store.js";

const tool: Tool = {
  name: "puck_list_blocksets",
  description:
    "Lista los block sets disponibles (subdirectorios de src/cms/blocks/). Cada tenant usa uno.",
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  async handler() {
    return json(await listBlockSets());
  },
};

export default tool;
