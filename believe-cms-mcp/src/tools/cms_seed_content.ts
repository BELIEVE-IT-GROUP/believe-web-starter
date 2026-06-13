/**
 * cms_seed_content — create several pages (each with blocks) from a structure.
 *
 * structure = { pages: [{ slug, title, blocks[], seo? }, ...] }.
 * Validates every block up front; only writes if all validate. Idempotent per
 * page on (tenant, slug). Defaults to dryRun: true.
 */

import { CmsClient } from "../cms.js";
import { validateBlocks, type NormalizedBlock } from "./_blocks.js";
import { errorResult, json, type Tool } from "./_types.js";

interface PlannedPage {
  slug: string;
  title: string;
  blocks: NormalizedBlock[];
  seo?: unknown;
}

const tool: Tool = {
  name: "cms_seed_content",
  description:
    "Seed a tenant with several pages at once from a structure " +
    "{ pages: [{ slug, title, blocks[], seo? }] }. Validates all blocks before " +
    "writing. Idempotent per page. dryRun (default true) validates only.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["tenantSlug", "structure"],
    properties: {
      tenantSlug: {
        type: "string",
        description: "Slug of the tenant to seed.",
      },
      structure: {
        type: "object",
        required: ["pages"],
        description: "{ pages: [{ slug, title, blocks[], seo? }] }.",
        properties: {
          pages: {
            type: "array",
            items: {
              type: "object",
              required: ["slug", "title", "blocks"],
              properties: {
                slug: { type: "string" },
                title: { type: "string" },
                blocks: { type: "array" },
                seo: { type: "object" },
              },
            },
          },
        },
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
    if (!tenantSlug) return errorResult("'tenantSlug' is required.");
    const dryRun = args.dryRun !== false;

    const structure = args.structure as { pages?: unknown } | undefined;
    const rawPages = structure?.pages;
    if (!Array.isArray(rawPages) || rawPages.length === 0) {
      return errorResult("'structure.pages' must be a non-empty array.");
    }

    // Validate every page + its blocks up front. Fail the whole call on any error.
    const planned: PlannedPage[] = [];
    const errors: string[] = [];
    rawPages.forEach((p, i) => {
      const page = p as Record<string, unknown>;
      const slug = typeof page.slug === "string" ? page.slug.trim() : "";
      const title = typeof page.title === "string" ? page.title.trim() : "";
      if (!slug) errors.push(`pages[${i}]: missing 'slug'.`);
      if (!title) errors.push(`pages[${i}]: missing 'title'.`);
      const { blocks, errors: blockErrors } = validateBlocks(
        page.blocks,
        `pages[${i}]`,
      );
      errors.push(...blockErrors);
      if (slug && title && blockErrors.length === 0) {
        planned.push({ slug, title, blocks, seo: page.seo });
      }
    });

    if (errors.length > 0) {
      return errorResult(
        `Validation failed (nothing written):\n- ${errors.join("\n- ")}`,
      );
    }

    const cms = new CmsClient();
    const tenant = await cms.findTenantBySlug(tenantSlug);
    if (!tenant) {
      return errorResult(
        `Tenant '${tenantSlug}' not found. Create it first with ` +
          "cms_create_tenant.",
      );
    }
    const tenantId = String(tenant.id);

    if (dryRun) {
      return json({
        action: "dryRun",
        message:
          `Would seed ${planned.length} page(s) for tenant '${tenantSlug}'. ` +
          "Pass dryRun:false to apply.",
        wouldCreate: planned.map((p) => ({
          slug: p.slug,
          title: p.title,
          blockCount: p.blocks.length,
          blockTemplateIds: p.blocks.map((b) => b.templateId),
        })),
      });
    }

    const results: Array<Record<string, unknown>> = [];
    for (const p of planned) {
      const existing = await cms.findPage(tenantId, p.slug);
      if (existing) {
        results.push({ slug: p.slug, action: "exists", id: existing.id });
        continue;
      }
      const data: Record<string, unknown> = {
        title: p.title,
        slug: p.slug,
        tenant: tenant.id,
        blocks: p.blocks,
      };
      if (p.seo && typeof p.seo === "object") data.seo = p.seo;
      const created = await cms.create("pages", data);
      results.push({ slug: p.slug, action: "created", id: created.id });
    }

    return json({
      action: "seeded",
      message: `Seeded tenant '${tenantSlug}'.`,
      tenant: tenantId,
      results,
    });
  },
};

export default tool;
