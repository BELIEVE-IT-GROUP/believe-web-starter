/**
 * cms_list_block_templates — read-only listing of the Flowbite block catalog.
 *
 * Safe: touches no remote resources. Optionally filtered by blockType.
 */

import { listBlockTypes, listTemplates } from "../catalog.js";
import { errorResult, json, type Tool } from "./_types.js";

const tool: Tool = {
  name: "cms_list_block_templates",
  description:
    "List available Flowbite block templates (templateId, label, blockType). " +
    "Read-only and safe. Optionally filter by blockType (e.g. 'hero').",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      blockType: {
        type: "string",
        description:
          "Optional block type to filter by, e.g. 'hero', 'features', 'cta'. " +
          "Omit to list all templates.",
      },
    },
  },
  async handler(args) {
    const blockType =
      typeof args.blockType === "string" ? args.blockType : undefined;
    const templates = listTemplates(blockType);
    if (blockType && templates.length === 0) {
      return errorResult(
        `No templates for blockType '${blockType}'. Known block types: ` +
          listBlockTypes().join(", "),
      );
    }
    return json({
      blockType: blockType ?? "(all)",
      count: templates.length,
      templates,
    });
  },
};

export default tool;
