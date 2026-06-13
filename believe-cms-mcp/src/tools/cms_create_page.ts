/**
 * cms_create_page — create a page for a tenant with an ordered list of blocks.
 *
 * Resolves the tenant by slug, validates each block against the Flowbite
 * catalog, and creates the page. Defaults to dryRun: true. Idempotent on
 * (tenant, slug): if the page already exists it is returned, not duplicated.
 */

import { CmsClient } from "../cms.js";
import { validateBlocks } from "./_blocks.js";
import { errorResult, json, type Tool } from "./_types.js";

const tool: Tool = {
  name: "cms_create_page",
  description:
    "Create a page for a tenant with an ordered list of blocks. Each block is " +
    "{ blockType, templateId, ...fields }; templateId must exist in the catalog. " +
    "dryRun (default true) validates and describes without writing.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["tenantSlug", "slug", "title", "blocks"],
    properties: {
      tenantSlug: {
        type: "string",
        description: "Slug of the tenant that owns the page.",
      },
      slug: { type: "string", description: "URL-safe page slug." },
      title: { type: "string", description: "Page title." },
      blocks: {
        type: "array",
        description:
          "Ordered blocks. Each: { templateId, blockType?, ...fields }.",
        items: {
          type: "object",
          required: ["templateId"],
          properties: {
            templateId: { type: "string" },
            blockType: { type: "string" },
          },
        },
      },
      seo: {
        type: "object",
        description: "Optional SEO object passed through verbatim.",
      },
      dryRun: {
        type: "boolean",
        description:
          "When true (default), validate and describe only; write nothing.",
        default: true,
      },
    },
  },
  async handler(args) {
    const tenantSlug = String(args.tenantSlug ?? "").trim();
    const slug = String(args.slug ?? "").trim();
    const title = String(args.title ?? "").trim();
    if (!tenantSlug || !slug || !title) {
      return errorResult(
        "'tenantSlug', 'slug' and 'title' are all required.",
      );
    }
    const dryRun = args.dryRun !== false;

    const { blocks, errors } = validateBlocks(args.blocks, "page");
    if (errors.length > 0) {
      return errorResult(`Block validation failed:\n- ${errors.join("\n- ")}`);
    }

    const cms = new CmsClient();
    const tenant = await cms.findTenantBySlug(tenantSlug);
    if (!tenant) {
      return errorResult(
        `Tenant '${tenantSlug}' not found. Create it first with ` +
          "cms_create_tenant.",
      );
    }

    const existing = await cms.findPage(String(tenant.id), slug);
    if (existing) {
      return json({
        action: "exists",
        message: `Page '${slug}' already exists for tenant '${tenantSlug}'.`,
        page: { id: existing.id, slug: existing.slug, title: existing.title },
      });
    }

    const data: Record<string, unknown> = {
      title,
      slug,
      tenant: tenant.id,
      blocks,
    };
    if (args.seo && typeof args.seo === "object") data.seo = args.seo;

    if (dryRun) {
      return json({
        action: "dryRun",
        message:
          `Would create page '${slug}' for tenant '${tenantSlug}' with ` +
          `${blocks.length} block(s). Pass dryRun:false to apply.`,
        wouldCreate: {
          title,
          slug,
          tenant: tenant.id,
          blockCount: blocks.length,
          blockTemplateIds: blocks.map((b) => b.templateId),
        },
      });
    }

    const created = await cms.create("pages", data);
    return json({
      action: "created",
      message: `Created page '${slug}' for tenant '${tenantSlug}'.`,
      page: {
        id: created.id,
        slug: created.slug,
        title: created.title,
        blockCount: blocks.length,
      },
    });
  },
};

export default tool;
