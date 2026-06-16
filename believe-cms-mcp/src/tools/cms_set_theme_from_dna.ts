/**
 * cms_set_theme_from_dna -- apply a brand DNA object to a tenant's settings.theme.
 *
 * Reads the tenant by slug, resolves its settings document (one per tenant),
 * then PATCHes the theme sub-document with the full v2 token set: colors, fonts,
 * shape presets, shadow level, density, motion, and tone-derived personality tokens.
 * dryRun defaults to true so nothing is written unless the caller explicitly opts in.
 *
 * Token resolution order (later wins):
 *   1. tone defaults (TONE_TOKENS)
 *   2. shape.radius preset (RADIUS_PRESETS)
 *   3. shape.shadow preset (SHADOW_PRESETS)
 *   4. spacing.density preset (DENSITY_PRESETS)
 *   5. explicit color/font fields (always win)
 *   6. cssVarsRaw (derived vars applied first, caller overrides win)
 */

import { CmsClient } from "../cms.js";
import { errorResult, json, type Tool } from "./_types.js";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Full theme patch written to settings.theme in Payload. */
interface ThemePatch {
  // Colors — base
  primaryColor?: string;
  accentColor?: string;
  paperColor?: string;
  inkColor?: string;
  signalColor?: string;
  inkMutedColor?: string;
  // Fonts
  displayFont?: string;
  bodyFont?: string;
  monoFont?: string;
  // Shape — preset keys stored for reference
  radiusBase?: string;
  shadowLevel?: string;
  densityLevel?: string;
  // Shape — resolved CSS values
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  radiusButton?: string;
  radiusCard?: string;
  radiusInput?: string;
  // Shadow — resolved CSS values
  shadowCard?: string;
  shadowButton?: string;
  cardBorderWidth?: string;
  // Spacing — resolved CSS values
  sectionPaddingY?: string;
  sectionPaddingYSm?: string;
  heroPaddingY?: string;
  cardPadding?: string;
  // Motion — resolved CSS values (from tone)
  transitionDuration?: string;
  transitionEasing?: string;
  // Personality — resolved CSS values (from tone)
  grainOpacity?: string;
  dividerOpacity?: string;
  trackingTight?: string;
  // Tone metadata (stored for copy context)
  tone?: string;
  // Escape hatch + derived color vars
  cssVarsRaw?: Record<string, string>;
}

// ─── Tone lookup table ────────────────────────────────────────────────────────

type ToneTokens = Pick<
  ThemePatch,
  | "radiusButton"
  | "radiusCard"
  | "shadowCard"
  | "shadowButton"
  | "transitionDuration"
  | "transitionEasing"
  | "grainOpacity"
  | "trackingTight"
  | "cardBorderWidth"
  | "dividerOpacity"
>;

const TONE_TOKENS: Record<string, ToneTokens> = {
  professional: {
    radiusButton: "0.375rem",
    radiusCard: "0.5rem",
    shadowCard: "0 1px 3px rgba(0,0,0,0.08)",
    shadowButton: "none",
    transitionDuration: "300ms",
    transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
    grainOpacity: "0.05",
    trackingTight: "-0.015em",
    cardBorderWidth: "0px",
    dividerOpacity: "0.12",
  },
  bold: {
    radiusButton: "0.5rem",
    radiusCard: "0.75rem",
    shadowCard: "0 4px 16px rgba(0,0,0,0.12)",
    shadowButton:
      "0 2px 8px color-mix(in oklab, var(--color-primary) 100%, transparent 75%)",
    transitionDuration: "150ms",
    transitionEasing: "cubic-bezier(0.25, 0, 0, 1)",
    grainOpacity: "0.04",
    trackingTight: "-0.010em",
    cardBorderWidth: "0px",
    dividerOpacity: "0.10",
  },
  warm: {
    radiusButton: "9999px",
    radiusCard: "1rem",
    shadowCard: "0 2px 12px rgba(0,0,0,0.09)",
    shadowButton: "0 1px 4px rgba(0,0,0,0.10)",
    transitionDuration: "350ms",
    transitionEasing: "ease-in-out",
    grainOpacity: "0.07",
    trackingTight: "-0.008em",
    cardBorderWidth: "0px",
    dividerOpacity: "0.15",
  },
  minimalist: {
    radiusButton: "0rem",
    radiusCard: "0rem",
    shadowCard: "none",
    shadowButton: "none",
    transitionDuration: "400ms",
    transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
    grainOpacity: "0.03",
    trackingTight: "-0.025em",
    cardBorderWidth: "1px",
    dividerOpacity: "0.08",
  },
};

// ─── Shape preset tables ──────────────────────────────────────────────────────

const RADIUS_PRESETS: Record<
  string,
  { sm: string; md: string; lg: string; button: string; card: string; input: string }
> = {
  none:    { sm: "0rem",    md: "0rem",    lg: "0rem",    button: "0rem",     card: "0rem",    input: "0rem"     },
  soft:    { sm: "0.25rem", md: "0.5rem",  lg: "0.75rem", button: "0.375rem", card: "0.5rem",  input: "0.375rem" },
  rounded: { sm: "0.5rem",  md: "0.75rem", lg: "1rem",    button: "0.625rem", card: "1rem",    input: "0.5rem"   },
  pill:    { sm: "0.75rem", md: "1.25rem", lg: "1.5rem",  button: "9999px",   card: "1.5rem",  input: "9999px"   },
};

const SHADOW_PRESETS: Record<
  string,
  { card: string; button: string; borderWidth: string }
> = {
  none:     { card: "none",                           button: "none",                                                                     borderWidth: "1px" },
  flat:     { card: "0 1px 3px rgba(0,0,0,0.08)",    button: "none",                                                                     borderWidth: "0px" },
  soft:     { card: "0 2px 12px rgba(0,0,0,0.10)",   button: "0 1px 4px rgba(0,0,0,0.12)",                                              borderWidth: "0px" },
  elevated: { card: "0 4px 24px rgba(0,0,0,0.14)",   button: "0 2px 8px color-mix(in oklab, var(--color-primary) 100%, transparent 70%)", borderWidth: "0px" },
};

const DENSITY_PRESETS: Record<
  string,
  { sectionY: string; sectionYSm: string; heroY: string; card: string }
> = {
  compact: { sectionY: "3rem", sectionYSm: "2rem", heroY: "4rem",  card: "1.25rem" },
  default: { sectionY: "6rem", sectionYSm: "4rem", heroY: "8rem",  card: "2rem"    },
  airy:    { sectionY: "8rem", sectionYSm: "5rem", heroY: "11rem", card: "2.5rem"  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strict hex validator: # followed by exactly 3 or 6 hex chars. */
function isHex(s: string): boolean {
  return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(s);
}

/**
 * Normalize 3-char hex shorthand to 6-char.
 * '#abc' → '#aabbcc'. Prevents parseInt bugs in downstream consumers.
 */
function expandHex(hex: string): string {
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
}

/** Extract a trimmed non-empty string from args, or undefined. */
function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

/** Strip characters that could break CSS string injection. */
function sanitizeFontName(name: string): string {
  return name.trim().replace(/[^A-Za-z0-9 \-_]/g, "");
}

/** Derive the tone bucket from a free-form tone string. */
function resolveTone(tone: string | undefined): string {
  if (!tone) return "professional";
  const t = tone.toLowerCase();
  if (t.includes("bold") || t.includes("energetic") || t.includes("strong")) return "bold";
  if (t.includes("warm") || t.includes("friendly") || t.includes("playful")) return "warm";
  if (t.includes("minimal") || t.includes("clean") || t.includes("simple")) return "minimalist";
  return "professional";
}

/**
 * Derive color variants from a 6-char hex primary.
 * Pure math — zero external dependencies.
 * Returns: { dark, hover, muted } as hex / rgba strings.
 */
function deriveColorVariants(hex6: string): {
  dark: string;
  hover: string;
  muted: string;
} {
  const r = parseInt(hex6.slice(1, 3), 16);
  const g = parseInt(hex6.slice(3, 5), 16);
  const b = parseInt(hex6.slice(5, 7), 16);

  const darken = (ch: number, frac: number): number =>
    Math.max(0, Math.round(ch * (1 - frac)));
  const toHex2 = (n: number): string => n.toString(16).padStart(2, "0");
  const build = (nr: number, ng: number, nb: number): string =>
    "#" + toHex2(nr) + toHex2(ng) + toHex2(nb);

  return {
    dark:  build(darken(r, 0.15), darken(g, 0.15), darken(b, 0.15)),
    hover: build(darken(r, 0.08), darken(g, 0.08), darken(b, 0.08)),
    muted: `rgba(${r},${g},${b},0.15)`,
  };
}

// ─── Hex field parser (returns typed result, no throw) ────────────────────────

type HexResult =
  | { ok: true; value: string | undefined }
  | { ok: false; error: string };

function parseHexField(raw: unknown, label: string): HexResult {
  const v = str(raw);
  if (v === undefined) return { ok: true, value: undefined };
  if (!isHex(v)) return { ok: false, error: `'${label}' must be a hex color, got '${v}'.` };
  return { ok: true, value: expandHex(v) };
}

// ─── Tool definition ──────────────────────────────────────────────────────────

const tool: Tool = {
  name: "cms_set_theme_from_dna",
  description:
    "Apply a brand DNA object to the full v2 theme inside a tenant's CMS settings. " +
    "Resolves tone → personality tokens, shape.radius → 6 radius vars, " +
    "shape.shadow → shadow+border vars, spacing.density → 4 spacing vars, " +
    "and auto-derives primaryDark/primaryHover/primaryMuted color variants. " +
    "Writes up to 30+ structured fields + cssVarsRaw. " +
    "dryRun (default true) only previews the patch without writing.",

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
        description:
          "Brand DNA to apply. Only provided sub-fields are written; " +
          "existing unrelated theme fields are preserved.",
        properties: {
          colors: {
            type: "object",
            additionalProperties: false,
            required: ["primary"],
            description: "Brand color palette. Hex values, 3 or 6 chars both accepted.",
            properties: {
              primary: {
                type: "string",
                description: "Primary brand color (hex, e.g. '#0c3bb9'). Required.",
              },
              accent: {
                type: "string",
                description:
                  "Accent / CTA highlight color (hex). Defaults to primary if absent.",
              },
              paper: {
                type: "string",
                description:
                  "Page / card background color (hex). Default: #fafaf7.",
              },
              ink: {
                type: "string",
                description: "Body text color (hex). Default: #1a1a1a.",
              },
              signal: {
                type: "string",
                description:
                  "Data-annotation / underline / wordmark-dot color (hex). " +
                  "Semantic role separate from accent. Defaults to accent if absent.",
              },
              muted: {
                type: "string",
                description:
                  "Muted / secondary text color (hex). " +
                  "If omitted, falls back to globals.css default (#6b6b65).",
              },
            },
          },
          fonts: {
            type: "object",
            additionalProperties: false,
            description: "Optional Google Font family names.",
            properties: {
              display: {
                type: "string",
                description: "Heading / display font, e.g. 'Poppins'.",
              },
              body: {
                type: "string",
                description: "Body text font, e.g. 'Inter'.",
              },
              mono: {
                type: "string",
                description:
                  "Monospace / code font, e.g. 'JetBrains Mono'.",
              },
            },
          },
          tone: {
            type: "string",
            enum: ["professional", "bold", "warm", "minimalist"],
            description:
              "Editorial personality preset. Drives radius, shadow, motion, " +
              "grain-opacity, and letter-spacing defaults. " +
              "'professional' = Believe editorial default.",
          },
          shape: {
            type: "object",
            additionalProperties: false,
            description: "Corner radius and shadow style presets.",
            properties: {
              radius: {
                type: "string",
                enum: ["none", "soft", "rounded", "pill"],
                description:
                  "Corner radius preset. " +
                  "none=0rem | soft=0.25rem (Believe default) | rounded=0.75rem | pill=9999px. " +
                  "Overrides the radius tokens derived from tone.",
              },
              shadow: {
                type: "string",
                enum: ["none", "flat", "soft", "elevated"],
                description:
                  "Shadow depth preset. " +
                  "none=border-only | flat=1px subtle (Believe) | " +
                  "soft=diffuse | elevated=layered+primary-tinted button shadow. " +
                  "Overrides the shadow tokens derived from tone.",
              },
            },
          },
          spacing: {
            type: "object",
            additionalProperties: false,
            description: "Spatial density of sections and cards.",
            properties: {
              density: {
                type: "string",
                enum: ["compact", "default", "airy"],
                description:
                  "Layout density preset. " +
                  "compact: 48/32px sections | default: 96/64px (Believe) | airy: 128/96px.",
              },
            },
          },
          cssVarsRaw: {
            type: "object",
            description:
              "Escape hatch: additional CSS custom property overrides injected verbatim " +
              "into :root after all structured vars. " +
              "Keys must match /^--[a-z][a-z0-9-]*$/. Values are not sanitized.",
            additionalProperties: { type: "string" },
          },
        },
      },
      dryRun: {
        type: "boolean",
        description:
          "When true (default), only preview the resolved patch; write nothing to the CMS.",
        default: true,
      },
    },
  },

  async handler(args) {
    // ── Top-level ──────────────────────────────────────────────────────────
    const tenantSlug = str(args.tenantSlug);
    if (!tenantSlug)
      return errorResult("'tenantSlug' is required and must be a non-empty string.");

    const dryRun = args.dryRun !== false;

    const dna = args.dna;
    if (dna === null || typeof dna !== "object" || Array.isArray(dna))
      return errorResult("'dna' must be an object.");
    const dnaObj = dna as Record<string, unknown>;

    // ── Colors ─────────────────────────────────────────────────────────────
    const colorsRaw = dnaObj.colors;
    if (colorsRaw === null || typeof colorsRaw !== "object" || Array.isArray(colorsRaw))
      return errorResult("'dna.colors' must be an object.");
    const colorsObj = colorsRaw as Record<string, unknown>;

    const primaryRaw = str(colorsObj.primary);
    if (!primaryRaw) return errorResult("'dna.colors.primary' is required.");
    if (!isHex(primaryRaw))
      return errorResult(
        `'dna.colors.primary' must be a hex color (e.g. '#0c3bb9'), got '${primaryRaw}'.`
      );
    const primary = expandHex(primaryRaw);

    const accentRes = parseHexField(colorsObj.accent, "dna.colors.accent");
    if (!accentRes.ok) return errorResult(accentRes.error);
    const accent = accentRes.value;

    const paperRes = parseHexField(colorsObj.paper, "dna.colors.paper");
    if (!paperRes.ok) return errorResult(paperRes.error);
    const paper = paperRes.value;

    const inkRes = parseHexField(colorsObj.ink, "dna.colors.ink");
    if (!inkRes.ok) return errorResult(inkRes.error);
    const ink = inkRes.value;

    const signalRes = parseHexField(colorsObj.signal, "dna.colors.signal");
    if (!signalRes.ok) return errorResult(signalRes.error);
    const signal = signalRes.value;

    const mutedRes = parseHexField(colorsObj.muted, "dna.colors.muted");
    if (!mutedRes.ok) return errorResult(mutedRes.error);
    const muted = mutedRes.value;

    // ── Fonts ──────────────────────────────────────────────────────────────
    let displayFont: string | undefined;
    let bodyFont: string | undefined;
    let monoFont: string | undefined;

    const fontsRaw = dnaObj.fonts;
    if (fontsRaw !== null && fontsRaw !== undefined) {
      if (typeof fontsRaw !== "object" || Array.isArray(fontsRaw))
        return errorResult("'dna.fonts' must be an object if provided.");
      const fontsObj = fontsRaw as Record<string, unknown>;
      const rd = str(fontsObj.display);
      const rb = str(fontsObj.body);
      const rm = str(fontsObj.mono);
      if (rd) displayFont = sanitizeFontName(rd);
      if (rb) bodyFont = sanitizeFontName(rb);
      if (rm) monoFont = sanitizeFontName(rm);
    }

    // ── Tone ───────────────────────────────────────────────────────────────
    const tone = str(dnaObj.tone);

    // ── Shape ──────────────────────────────────────────────────────────────
    let radiusPreset: string | undefined;
    let shadowPreset: string | undefined;

    const shapeRaw = dnaObj.shape;
    if (shapeRaw !== null && shapeRaw !== undefined) {
      if (typeof shapeRaw !== "object" || Array.isArray(shapeRaw))
        return errorResult("'dna.shape' must be an object if provided.");
      const shapeObj = shapeRaw as Record<string, unknown>;

      const r = str(shapeObj.radius);
      if (r !== undefined) {
        if (!RADIUS_PRESETS[r])
          return errorResult(
            `'dna.shape.radius' must be one of: ${Object.keys(RADIUS_PRESETS).join(", ")}. Got '${r}'.`
          );
        radiusPreset = r;
      }

      const s = str(shapeObj.shadow);
      if (s !== undefined) {
        if (!SHADOW_PRESETS[s])
          return errorResult(
            `'dna.shape.shadow' must be one of: ${Object.keys(SHADOW_PRESETS).join(", ")}. Got '${s}'.`
          );
        shadowPreset = s;
      }
    }

    // ── Spacing ────────────────────────────────────────────────────────────
    let densityPreset: string | undefined;

    const spacingRaw = dnaObj.spacing;
    if (spacingRaw !== null && spacingRaw !== undefined) {
      if (typeof spacingRaw !== "object" || Array.isArray(spacingRaw))
        return errorResult("'dna.spacing' must be an object if provided.");
      const spacingObj = spacingRaw as Record<string, unknown>;

      const d = str(spacingObj.density);
      if (d !== undefined) {
        if (!DENSITY_PRESETS[d])
          return errorResult(
            `'dna.spacing.density' must be one of: ${Object.keys(DENSITY_PRESETS).join(", ")}. Got '${d}'.`
          );
        densityPreset = d;
      }
    }

    // ── cssVarsRaw ─────────────────────────────────────────────────────────
    let callerCssVarsRaw: Record<string, string> | undefined;
    const rawCssVars = dnaObj.cssVarsRaw;
    if (rawCssVars !== null && rawCssVars !== undefined) {
      if (typeof rawCssVars !== "object" || Array.isArray(rawCssVars))
        return errorResult("'dna.cssVarsRaw' must be an object if provided.");
      const rawObj = rawCssVars as Record<string, unknown>;
      const safe: Record<string, string> = {};
      const cssVarPattern = /^--[a-z][a-z0-9-]*$/;
      for (const [k, v] of Object.entries(rawObj)) {
        if (!cssVarPattern.test(k))
          return errorResult(
            `'dna.cssVarsRaw' key '${k}' is invalid. Keys must match /^--[a-z][a-z0-9-]*$/`
          );
        if (typeof v !== "string")
          return errorResult(`'dna.cssVarsRaw["${k}"]' must be a string.`);
        safe[k] = v;
      }
      if (Object.keys(safe).length > 0) callerCssVarsRaw = safe;
    }

    // ── Build theme patch ──────────────────────────────────────────────────
    // Resolution priority (later wins):
    //   tone defaults → radius preset → shadow preset → density preset
    //   → explicit color/font fields → derived color vars + caller cssVarsRaw

    const themePatch: ThemePatch = {};

    // 1. Tone defaults
    const toneKey = resolveTone(tone);
    Object.assign(themePatch, TONE_TOKENS[toneKey]);
    if (tone) themePatch.tone = tone;

    // 2. Radius preset
    if (radiusPreset) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const rp = RADIUS_PRESETS[radiusPreset]!;
      themePatch.radiusBase   = radiusPreset;
      themePatch.radiusSm     = rp.sm;
      themePatch.radiusMd     = rp.md;
      themePatch.radiusLg     = rp.lg;
      themePatch.radiusButton = rp.button;
      themePatch.radiusCard   = rp.card;
      themePatch.radiusInput  = rp.input;
    }

    // 3. Shadow preset
    if (shadowPreset) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const sp = SHADOW_PRESETS[shadowPreset]!;
      themePatch.shadowLevel      = shadowPreset;
      themePatch.shadowCard       = sp.card;
      themePatch.shadowButton     = sp.button;
      themePatch.cardBorderWidth  = sp.borderWidth;
    }

    // 4. Density preset
    if (densityPreset) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dp = DENSITY_PRESETS[densityPreset]!;
      themePatch.densityLevel      = densityPreset;
      themePatch.sectionPaddingY   = dp.sectionY;
      themePatch.sectionPaddingYSm = dp.sectionYSm;
      themePatch.heroPaddingY      = dp.heroY;
      themePatch.cardPadding       = dp.card;
    }

    // 5. Colors (explicit wins over all presets)
    themePatch.primaryColor = primary;
    if (accent !== undefined)  themePatch.accentColor   = accent;
    if (paper  !== undefined)  themePatch.paperColor    = paper;
    if (ink    !== undefined)  themePatch.inkColor      = ink;
    if (signal !== undefined)  themePatch.signalColor   = signal;
    if (muted  !== undefined)  themePatch.inkMutedColor = muted;

    // 6. Fonts (explicit wins)
    if (displayFont) themePatch.displayFont = displayFont;
    if (bodyFont)    themePatch.bodyFont    = bodyFont;
    if (monoFont)    themePatch.monoFont    = monoFont;

    // 7. Derived color variants + caller cssVarsRaw
    //    Derived vars are applied first so callerCssVarsRaw can override any of them.
    const variants = deriveColorVariants(primary);
    const derivedVars: Record<string, string> = {
      "--color-primary-dark":  variants.dark,
      "--color-primary-hover": variants.hover,
      "--color-primary-muted": variants.muted,
    };
    themePatch.cssVarsRaw = { ...derivedVars, ...(callerCssVarsRaw ?? {}) };

    // ── Count for reporting ────────────────────────────────────────────────
    const appliedFields = (Object.keys(themePatch) as (keyof ThemePatch)[]).filter(
      (k) => k !== "cssVarsRaw" && themePatch[k] !== undefined
    );
    const cssVarCount = Object.keys(themePatch.cssVarsRaw).length;
    const totalVars   = appliedFields.length + cssVarCount;

    // ── dryRun short-circuit ───────────────────────────────────────────────
    if (dryRun) {
      return json({
        action: "dryRun",
        message:
          `Would update settings.theme for tenant '${tenantSlug}'. ` +
          `${totalVars} vars resolved (${appliedFields.length} structured + ` +
          `${cssVarCount} cssVarsRaw). Pass dryRun:false to apply.`,
        tenantSlug,
        resolvedTone: toneKey,
        colorVariants: variants,
        wouldPatch: { theme: themePatch },
        appliedFields,
      });
    }

    // ── Resolve tenant ─────────────────────────────────────────────────────
    const cms = new CmsClient();
    const tenant = await cms.findTenantBySlug(tenantSlug);
    if (!tenant)
      return errorResult(
        `Tenant '${tenantSlug}' not found in the CMS. ` +
          "Create it first with cms_create_tenant."
      );
    const tenantId = tenant.id;

    // ── Resolve settings document ──────────────────────────────────────────
    const settingsResult = await cms.find("settings", {
      where: { tenant: { equals: tenantId } },
      limit: 1,
    });

    const existing = settingsResult.docs[0];
    if (!existing)
      return errorResult(
        `No settings document found for tenant '${tenantSlug}' (id: ${tenantId}). ` +
          "Create one in the CMS admin or via cms_seed_content before setting a theme."
      );

    // ── Merge (preserve unrelated theme fields) ────────────────────────────
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

    // ── Apply patch ────────────────────────────────────────────────────────
    const updated = await cms.update("settings", existing.id, {
      theme: mergedTheme,
    });

    return json({
      action: "updated",
      message:
        `Theme updated for tenant '${tenantSlug}'. ` +
        `${totalVars} vars applied (${appliedFields.length} structured + ` +
        `${cssVarCount} cssVarsRaw). Tone resolved to '${toneKey}'.`,
      tenantSlug,
      tenantId,
      settingsId: existing.id,
      resolvedTone: toneKey,
      colorVariants: variants,
      appliedFields,
      theme: (updated as { theme?: unknown }).theme ?? mergedTheme,
    });
  },
};

export default tool;
