/**
 * Shared block normalisation/validation used by page-creating tools.
 *
 * Each Payload page block is { blockType, templateId, ...fields }. We validate
 * that blockType + templateId are present and that the templateId exists in the
 * catalog (and matches the declared blockType prefix when given).
 */

import { getTemplate } from "../catalog.js";

export interface NormalizedBlock {
  blockType: string;
  templateId: string;
  [key: string]: unknown;
}

export interface BlockValidation {
  blocks: NormalizedBlock[];
  errors: string[];
}

/**
 * Validate and normalise an array of raw block inputs. Unknown extra fields are
 * preserved verbatim so callers can pass through arbitrary block content.
 */
export function validateBlocks(raw: unknown, where: string): BlockValidation {
  const errors: string[] = [];
  const blocks: NormalizedBlock[] = [];

  if (!Array.isArray(raw)) {
    return { blocks, errors: [`${where}: 'blocks' must be an array.`] };
  }

  raw.forEach((item, index) => {
    const at = `${where}: block[${index}]`;
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`${at} must be an object.`);
      return;
    }
    const obj = item as Record<string, unknown>;
    const templateId =
      typeof obj.templateId === "string" ? obj.templateId : undefined;
    if (!templateId) {
      errors.push(`${at} is missing 'templateId'.`);
      return;
    }
    const template = getTemplate(templateId);
    if (!template) {
      errors.push(`${at} has unknown templateId '${templateId}'.`);
      return;
    }
    // blockType is derived from the catalog if omitted; if present it must match.
    const declared =
      typeof obj.blockType === "string" ? obj.blockType : undefined;
    if (declared && declared !== template.blockType) {
      errors.push(
        `${at} blockType '${declared}' does not match templateId '${templateId}' ` +
          `(expected '${template.blockType}').`,
      );
      return;
    }
    blocks.push({
      ...obj,
      blockType: template.blockType,
      templateId,
    });
  });

  return { blocks, errors };
}
