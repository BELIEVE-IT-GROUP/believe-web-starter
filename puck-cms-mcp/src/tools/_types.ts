/**
 * The Tool contract every tool module exports as its default export.
 *
 * inputSchema is a JSON Schema object (the shape the MCP client sees). The
 * handler receives the already-parsed args and returns MCP tool content.
 */

export interface ToolTextContent {
  type: "text";
  text: string;
}

export interface ToolResult {
  content: ToolTextContent[];
  /** Optional flag so the client knows the call represents an error. */
  isError?: boolean;
}

export interface Tool {
  /** Unique tool name, e.g. 'puck_list_tenants'. */
  name: string;
  /** One-line human description shown in list-tools. */
  description: string;
  /** JSON Schema for the tool's arguments. */
  inputSchema: Record<string, unknown>;
  /** Executes the tool. Args are whatever the client passed (already parsed). */
  handler(args: Record<string, unknown>): Promise<ToolResult>;
}

/** Helper: wrap a plain string into a text ToolResult. */
export function text(value: string): ToolResult {
  return { content: [{ type: "text", text: value }] };
}

/** Helper: wrap a JSON-serialisable value into a pretty-printed text result. */
export function json(value: unknown): ToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
  };
}

/** Helper: build an error ToolResult with a clear message. */
export function errorResult(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}
