/**
 * cms_create_tenant — create a tenant in the CMS (idempotent).
 *
 * If a tenant with the same slug already exists, returns it instead of creating
 * a duplicate. Defaults to dryRun: true, in which case it only describes the
 * action and touches nothing.
 */

import { CmsClient } from "../cms.js";
import { errorResult, json, type Tool } from "./_types.js";

const tool: Tool = {
  name: "cms_create_tenant",
  description:
    "Create a tenant in the CMS. Idempotent: returns the existing tenant if the " +
    "slug already exists. dryRun (default true) only describes the action.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["slug", "name"],
    properties: {
      slug: {
        type: "string",
        description: "URL-safe unique tenant slug, e.g. 'believe'.",
      },
      name: { type: "string", description: "Human-readable tenant name." },
      domain: {
        type: "string",
        description: "Optional custom domain for the tenant.",
      },
      primaryColor: {
        type: "string",
        description: "Optional primary brand color (hex).",
      },
      accentColor: {
        type: "string",
        description: "Optional accent brand color (hex).",
      },
      dryRun: {
        type: "boolean",
        description:
          "When true (default), only describe what would happen; create nothing.",
        default: true,
      },
    },
  },
  async handler(args) {
    const slug = String(args.slug ?? "").trim();
    const name = String(args.name ?? "").trim();
    if (!slug || !name) {
      return errorResult("Both 'slug' and 'name' are required.");
    }
    const dryRun = args.dryRun !== false;

    const data: Record<string, unknown> = { slug, name };
    if (typeof args.domain === "string") data.domain = args.domain;
    if (typeof args.primaryColor === "string")
      data.primaryColor = args.primaryColor;
    if (typeof args.accentColor === "string")
      data.accentColor = args.accentColor;

    const cms = new CmsClient();

    // Idempotency: look up by slug first (also validates credentials early).
    const existing = await cms.findTenantBySlug(slug);
    if (existing) {
      return json({
        action: "exists",
        message: `Tenant '${slug}' already exists; returning it.`,
        tenant: { id: existing.id, slug: existing.slug, name: existing.name },
      });
    }

    if (dryRun) {
      return json({
        action: "dryRun",
        message: `Would create tenant '${slug}'. Pass dryRun:false to apply.`,
        wouldCreate: data,
      });
    }

    const created = await cms.create("tenants", data);
    return json({
      action: "created",
      message: `Created tenant '${slug}'.`,
      tenant: { id: created.id, slug: created.slug, name: created.name },
    });
  },
};

export default tool;
