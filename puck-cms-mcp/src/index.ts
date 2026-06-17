#!/usr/bin/env node
/**
 * puck-cms-mcp — MCP stdio server (the "hands" of the Believe Puck CMS).
 *
 * Auto-loads every tool module in src/tools/ (files NOT prefixed with '_') and
 * registers them with the MCP server. Helper modules use the '_' prefix so they
 * are skipped by the loader.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type { Tool, ToolResult } from "./tools/_types.js";

const here = dirname(fileURLToPath(import.meta.url));

/** Load every non-underscore tool module from ./tools and return the tools. */
async function loadTools(): Promise<Tool[]> {
  const toolsDir = join(here, "tools");
  const entries = await readdir(toolsDir);
  const files = entries
    .filter((f) => f.endsWith(".js") && !f.startsWith("_"))
    .sort();

  const tools: Tool[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    const moduleUrl = pathToFileURL(join(toolsDir, file)).href;
    const mod = (await import(moduleUrl)) as { default?: unknown };
    const tool = mod.default as Tool | undefined;
    if (!isTool(tool)) {
      process.stderr.write(`[puck-cms-mcp] skipping ${file}: no valid tool default export\n`);
      continue;
    }
    if (seen.has(tool.name)) {
      throw new Error(`Duplicate tool name '${tool.name}' (in ${file}).`);
    }
    seen.add(tool.name);
    tools.push(tool);
  }
  return tools;
}

function isTool(value: unknown): value is Tool {
  if (value === null || typeof value !== "object") return false;
  const t = value as Partial<Tool>;
  return (
    typeof t.name === "string" &&
    typeof t.description === "string" &&
    typeof t.inputSchema === "object" &&
    t.inputSchema !== null &&
    typeof t.handler === "function"
  );
}

async function main(): Promise<void> {
  const tools = await loadTools();
  const byName = new Map(tools.map((t) => [t.name, t]));

  const server = new Server(
    { name: "puck-cms-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = byName.get(name);
    if (!tool) {
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      } satisfies CallToolResult;
    }
    try {
      const result: ToolResult = await tool.handler(
        (args ?? {}) as Record<string, unknown>,
      );
      return result satisfies ToolResult as CallToolResult;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Tool '${name}' failed: ${message}` }],
        isError: true,
      } satisfies CallToolResult;
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    `[puck-cms-mcp] ready with ${tools.length} tool(s): ` +
      `${tools.map((t) => t.name).join(", ")}\n`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`[puck-cms-mcp] fatal: ${message}\n`);
  process.exit(1);
});
