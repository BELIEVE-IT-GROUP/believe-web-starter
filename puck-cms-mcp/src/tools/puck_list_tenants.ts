import type { Tool } from "./_types.js";
import { json } from "./_types.js";
import { listTenants } from "../lib/store.js";

const tool: Tool = {
  name: "puck_list_tenants",
  description:
    "Lista los tenants del CMS Puck (lee data/tenants/). Devuelve slug, name, blockSet y tokens de cada uno.",
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  async handler() {
    const tenants = await listTenants();
    return json(
      tenants.map((t) => ({
        slug: t.slug,
        name: t.name,
        blockSet: t.blockSet,
        tokens: t.tokens ?? {},
      })),
    );
  },
};

export default tool;
