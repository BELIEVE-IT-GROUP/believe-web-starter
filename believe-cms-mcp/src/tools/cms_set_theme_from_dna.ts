/**
 * cms_set_theme_from_dna -- apply a brand DNA object to a tenant's settings.theme.
 *
 * Reads the tenant by slug, resolves its settings document (one per tenant),
 * then PATCHes the theme sub-document with colors and optional font/tone fields
 * derived from the DNA. dryRun defaults to true so nothing is written unless
 * the caller explicitly opts in.
 */

import { CmsClient } from "../cms.js";
import { errorResult, json, type Tool } from "./_types.js";

/** Loose hex validator: # followed by 3 or 6 hex chars. */
function isHex(s: string): boolean {
  return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(s);
}

/** Extract a trimmed non-empty string from args, or undefined. */
function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

const tool: Tool = {
  name: "cms_set_theme_from_dna",
  description:
    "Apply a brand DNA object to the theme inside a tenant's CMS settings. " +
    "Maps colors (primary, accent, paper, ink), optional fonts (display, body), " +
    "and an optional tone string. dryRun (default true) only previews the patch.",

  inputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["tenantSlug", "dna"],
    properties: {
      tenantSlug: {
        type: "string",
        description: "Slug of the target tenant, e.g. 'believe'.",
      },
      dna: {
        type: "object",
        additionalProperties: false,
        required: ["colors"],
        description: "Brand DNA to apply. Only provided sub-fields are written.",
        properties: {
          colors: {
            type: "object",
            additionalProperties: false,
            required: ["primary"],
            properties: {
              primary: {
                type: "string",
                description: "Primary brand color (hex, e.g. '#0c3bb9').",
              },
              accent: {
                type: "string",
                description: "Accent color (hex). Maps to settings.theme.accentColor.",
              },
              paper: {
                type: "string",
                description: "Background/paper color (hex). Stored as paperColor.",
              },
              ink: {
                type: "string",
                description: "Foreground/ink color (hex). Stored as inkColor.",
              },
            },
          },
          fonts: {
            type: "object",
            additionalProperties: false,
            description: "Optional font family names.",
            properties: {
              display: {
                type: "string",
                description: "Display / heading font, e.g. 'Fraunces'.",
              },
              body: {
                type: "string",
                description: "Body font, e.g. 'Inter'.",
              },
            },
          },
          tone: {
            type: "string",
            description: "Editorial tone descriptor, e.g. 'calm, authoritative'.",
          },
        },
      },
      dryRun: {
        type: "boolean",
        description:
          "When true (default), only describe the patch; write nothing.",
        default: true,
      },
    },
  },

  async handler(args) {
    // -- Parse top-level inputs -----------------------------------------------
    const tenantSlug = str(args.tenantSlug);
    if (!tenantSlug) {
      return errorResult("'tenantSlug' is required and must be a non-empty string.");
    }

    const dryRun = args.dryRun !== false;

    const dna = args.dna;
    if (dna === null || typeof dna !== "object" || Array.isArray(dna)) {
      return errorResult("'dna' must be an object.");
    }
    const dnaObj = dna as Record<string, unknown>;

    // -- Parse colors ---------------------------------------------------------
    const colors = dnaObj.colors;
    if (colors === null || typeof colors !== "object" || Array.isArray(colors)) {
      return errorResult("'dna.colors' must be an object.");
    }
    const colorsObj = colors as Record<string, unknown>;

    const primary = str(colorsObj.primary);
    if (!primary) {
      return errorResult("'dna.colors.primary' is required.");
    }
    if (!isHex(primary)) {
      return errorResult(
        `'dna.colors.primary' must be a hex color (e.g. '#0c3bb9'), got '${primary}'.`,
      );
    }

    const accent = str(colorsObj.accent);
    if (accent !== undefined && !isHex(accent)) {
      return errorResult(
        `'dna.colors.accent' must be a hex color, got '${accent}'.`,
      );
    }
    const paper = str(colorsObj.paper);
    if (paper !== undefined && !isHex(paper)) {
      return errorResult(
        `'dna.colors.paper' must be a hex color, got '${paper}'.`,
      );
    }
    const ink = str(colorsObj.ink);
    if (ink !== undefined && !isHex(ink)) {
      return errorResult(
        `'dna.colors.ink' must be a hex color, got '${ink}'.`,
      );
    }

    // -- Parse optional fonts -------------------------------------------------
    let displayFont: string | undefined;
    let bodyFont: string | undefined;
    const fontsRaw = dnaObj.fonts;
    if (fontsRaw !== null && fontsRaw !== undefined) {
      if (typeof fontsRaw !== "object" || Array.isArray(fontsRaw)) {
        return errorResult("'dna.fonts' must be an object if provided.");
      }
      const fontsObj = fontsRaw as Record<string, unknown>;
      displayFont = str(fontsObj.display);
      bodyFont = str(fontsObj.body);
    }

    // -- Parse optional tone --------------------------------------------------
    const tone = str(dnaObj.tone);

    // -- Build the theme patch object -----------------------------------------
    const themePatch: Record<string, unknown> = {
      primaryColor: primary,
    };
    if (accent !== undefined) themePatch.accentColor = accent;
    if (paper !== undefined) themePatch.paperColor = paper;
    if (ink !== undefined) themePatch.inkColor = ink;
    if (displayFont !== undefined) themePatch.displayFont = displayFont;
    if (bodyFont !== undefined) themePatch.bodyFont = bodyFont;
    if (tone !== undefined) themePatch.tone = tone;

    // -- dryRun short-circuit (no credentials needed) -------------------------
    if (dryRun) {
      return json({
        action: "dryRun",
        message:
          `Would update settings.theme for tenant '${tenantSlug}'. ` +
          "Pass dryRun:false to apply.",
        tenantSlug,
        wouldPatch: { theme: themePatch },
      });
    }

    // -- Resolve tenant -------------------------------------------------------
    const cms = new CmsClient();
    const tenant = await cms.findTenantBySlug(tenantSlug);
    if (!tenant) {
      return errorResult(
        `Tenant '${tenantSlug}' not found in the CMS. ` +
          "Create it first with cms_create_tenant.",
      );
    }
    const tenantId = tenant.id;

    // -- Resolve settings document for this tenant ----------------------------
    const settingsResult = await cms.find("settings", {
      where: { tenant: { equals: tenantId } },
      limit: 1,
    });

    const existing = settingsResult.docs[0];
    if (!existing) {
      return errorResult(
        `No settings document found for tenant '${tenantSlug}' (id: ${tenantId}). ` +
          "Create one in the CMS admin or via cms_seed_content before setting a theme.",
      );
    }

    // -- Merge with existing theme to avoid wiping unrelated theme fields -----
    const existingTheme =
      existing.theme !== null &&
      typeof existing.theme === "object" &&
      !Array.isArray(existing.theme)
        ? (existing.theme as Record<string, unknown>)
        : {};

    const mergedTheme: Record<string, unknown> = {
      ...existingTheme,
      ...themePatch,
    };

    // -- Apply the patch ------------------------------------------------------
    const updated = await cms.update("settings", existing.id, {
      theme: mergedTheme,
    });

    return json({
      action: "updated",
      message: `Theme updated for tenant '${tenantSlug}'.`,
      tenantSlug,
      tenantId,
      settingsId: existing.id,
      theme: (updated as { theme?: unknown }).theme ?? mergedTheme,
    });
  },
};

export default tool;
