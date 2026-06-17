/**
 * Smoke test E2E del contrato MCP: spawnea el server por stdio y ejerce
 * tools/list + tools/call (camino feliz y de error). Sin framework.
 * Uso: npm run build && npm run smoke   (o PUCK_REPO_DIR=/ruta/al/repo npm run smoke)
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoDir = process.env.PUCK_REPO_DIR || path.resolve(here, ".."); // el MCP vive en <repo>/puck-cms-mcp

const transport = new StdioClientTransport({
  command: "node",
  args: [path.join(here, "dist/index.js")],
  env: { ...process.env, PUCK_REPO_DIR: repoDir },
});
const client = new Client({ name: "puck-cms-mcp-smoke", version: "0.0.0" }, { capabilities: {} });
await client.connect(transport);

const { tools } = await client.listTools();
const names = tools.map((t) => t.name).sort();
console.log("tools:", names.join(", "));
assert(names.includes("puck_list_tenants"), "falta puck_list_tenants");
assert(names.includes("puck_get_tenant"), "falta puck_get_tenant");

const res = await client.callTool({ name: "puck_list_tenants", arguments: {} });
const tenants = JSON.parse(res.content[0].text);
assert(Array.isArray(tenants) && tenants.length >= 1, "esperaba >=1 tenant");
console.log("list_tenants:", tenants.map((t) => t.slug).join(", "));

const got = await client.callTool({ name: "puck_get_tenant", arguments: { slug: tenants[0].slug } });
assert(JSON.parse(got.content[0].text).slug === tenants[0].slug, "get_tenant no coincide");

const miss = await client.callTool({ name: "puck_get_tenant", arguments: { slug: "definitely-not-a-tenant" } });
assert(miss.isError, "esperaba isError para tenant inexistente");

await client.close();
console.log("SMOKE OK");
