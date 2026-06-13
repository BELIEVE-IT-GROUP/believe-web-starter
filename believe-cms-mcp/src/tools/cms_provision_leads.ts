/**
 * cms_provision_leads -- configure the lead-capture destination for a tenant.
 *
 * Decision tree:
 *   1. If MAASY_URL + MAASY_API_KEY are set, ask Maasy if the tenant is a brand
 *      client (maasyListBrands). If yes, wire settings.leads to maasy_crm with
 *      a per-tenant HMAC key. If no (or Maasy creds absent), fall through.
 *   2. Otherwise create an Appwrite collection leads_<tenant> and wire
 *      settings.leads to appwrite.
 *   3. Optionally configure the email delivery channel (useSend or Plunk).
 *   4. dryRun (default true): describe the plan, create nothing.
 *
 * Required env (via ~/.believe/bin/infra or Infisical):
 *   CMS_ADMIN_EMAIL, CMS_ADMIN_PASSWORD           -- always required
 *   MAASY_URL, MAASY_API_KEY                      -- optional; enables Maasy path
 *   APPWRITE_ENDPOINT, APPWRITE_PROJECT,
 *   APPWRITE_API_KEY                              -- required for Appwrite path
 *   USESEND_API_KEY                               -- required when email=usesend
 *   PLUNK_API_KEY                                 -- required when email=plunk
 *
 * Email FROM address for useSend: besend.somosbelieve.com (verified SES domain).
 */

import { CmsClient } from "../cms.js";
import { config } from "../config.js";
import { errorResult, json, type Tool } from "./_types.js";

// ---------------------------------------------------------------------------
// Maasy helper
// ---------------------------------------------------------------------------

interface MaasyBrand {
  id: string;
  slug?: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * Call GET {maasyUrl}/api/brands (or /brands) and return the list.
 * Returns null when credentials are absent so the caller can skip the check.
 */
async function maasyListBrands(): Promise<MaasyBrand[] | null> {
  const { maasyUrl, maasyApiKey } = config;
  if (!maasyUrl || !maasyApiKey) return null;

  const base = maasyUrl.replace(/\/+$/, "");
  // Try the standard REST path; fall back gracefully on any non-ok response.
  const res = await fetch(`${base}/api/brands`, {
    headers: {
      Authorization: `Bearer ${maasyApiKey}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as unknown;
  if (Array.isArray(body)) return body as MaasyBrand[];
  // Some wrappers return { data: [...] }
  const wrapped = body as { data?: unknown };
  if (Array.isArray(wrapped.data)) return wrapped.data as MaasyBrand[];
  return null;
}

/** Return true when the tenant slug appears in Maasy's brand list. */
async function isMaasyClient(tenantSlug: string): Promise<boolean> {
  const brands = await maasyListBrands();
  if (!brands) return false;
  return brands.some(
    (b) =>
      b.slug === tenantSlug ||
      String(b.name ?? "").toLowerCase() === tenantSlug.toLowerCase(),
  );
}

// ---------------------------------------------------------------------------
// Appwrite helper -- create a collection inside an existing database
// ---------------------------------------------------------------------------

interface AppwriteCollection {
  $id: string;
  name: string;
  [key: string]: unknown;
}

/**
 * Create the Appwrite collection leads_<tenantSlug> with the minimal attribute
 * set needed for a web lead form (name, email, phone, message, createdAt).
 * Returns the collection id.
 *
 * Uses the Appwrite REST API directly (no SDK dependency) to keep the package
 * lean. The database must already exist (APPWRITE_PROJECT is used as DB id).
 */
async function createAppwriteLeadsCollection(
  tenantSlug: string,
): Promise<AppwriteCollection> {
  const { appwriteEndpoint, appwriteProject, appwriteApiKey } = config;
  if (!appwriteEndpoint || !appwriteProject || !appwriteApiKey) {
    throw new Error(
      "Missing Appwrite credentials. Set APPWRITE_ENDPOINT, APPWRITE_PROJECT, " +
        "and APPWRITE_API_KEY in your secret store and run via " +
        "'~/.believe/bin/infra'.",
    );
  }

  const base = appwriteEndpoint.replace(/\/+$/, "");
  const dbId = appwriteProject; // use project id as database id by convention
  const collectionId = `leads_${tenantSlug}`.replace(/[^a-zA-Z0-9_]/g, "_");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Appwrite-Project": appwriteProject,
    "X-Appwrite-Key": appwriteApiKey,
  };

  // Check if collection already exists.
  const checkRes = await fetch(
    `${base}/v1/databases/${dbId}/collections/${collectionId}`,
    { method: "GET", headers },
  );
  if (checkRes.ok) {
    const existing = (await checkRes.json()) as AppwriteCollection;
    return existing;
  }

  // Create the collection.
  const createRes = await fetch(
    `${base}/v1/databases/${dbId}/collections`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        collectionId,
        name: `Leads - ${tenantSlug}`,
        permissions: [],
        documentSecurity: false,
      }),
    },
  );
  if (!createRes.ok) {
    const errBody = await createRes.text();
    throw new Error(
      `Appwrite create collection failed (${createRes.status}): ${errBody}`,
    );
  }
  const collection = (await createRes.json()) as AppwriteCollection;

  // Add attributes sequentially (Appwrite does not support bulk create on REST).
  const attributes: Array<{ key: string; size: number; required: boolean }> = [
    { key: "name", size: 256, required: false },
    { key: "email", size: 256, required: true },
    { key: "phone", size: 64, required: false },
    { key: "message", size: 2048, required: false },
    { key: "createdAt", size: 64, required: false },
  ];
  for (const attr of attributes) {
    const attrRes = await fetch(
      `${base}/v1/databases/${dbId}/collections/${collectionId}/attributes/string`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(attr),
      },
    );
    // Non-fatal: attribute may already exist or be pending; continue.
    if (!attrRes.ok) {
      const attrBody = await attrRes.text();
      process.stderr.write(
        `[cms_provision_leads] attr '${attr.key}' warning (${attrRes.status}): ${attrBody}\n`,
      );
    }
  }

  return collection;
}

// ---------------------------------------------------------------------------
// HMAC key generator (Node-compatible, no external deps)
// ---------------------------------------------------------------------------

/** Generate a hex-encoded 32-byte random HMAC key. */
function randomHmacKey(): string {
  const arr = new Uint8Array(32);
  // crypto.getRandomValues is available in modern Node (>= 19) and in the
  // Web Crypto API. We use globalThis.crypto for forward compatibility.
  (globalThis.crypto as { getRandomValues(a: Uint8Array): Uint8Array })
    .getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------------------------------------------------------------
// Tool definition
// ---------------------------------------------------------------------------

type EmailSink = "usesend" | "plunk";

const tool: Tool = {
  name: "cms_provision_leads",
  description:
    "Configure the lead-capture destination for a tenant. " +
    "Checks if the tenant is a Maasy brand client (Maasy CRM path) or creates " +
    "an Appwrite collection (Appwrite path). Optionally sets up an email " +
    "delivery channel (usesend or plunk). dryRun (default true) describes the " +
    "plan without creating anything.",

  inputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["tenantSlug", "tenantId"],
    properties: {
      tenantSlug: {
        type: "string",
        description: "Slug of the tenant to provision (e.g. 'acme').",
      },
      tenantId: {
        type: "string",
        description: "Payload CMS id of the tenant document.",
      },
      email: {
        type: "string",
        enum: ["usesend", "plunk"],
        description:
          "Optional email channel to configure. " +
          "'usesend' requires USESEND_API_KEY; 'plunk' requires PLUNK_API_KEY. " +
          "Omit to skip email configuration.",
      },
      dryRun: {
        type: "boolean",
        description:
          "When true (default), describe the plan and return required env vars; " +
          "create no resources.",
        default: true,
      },
    },
  },

  async handler(args) {
    const tenantSlug = String(args.tenantSlug ?? "").trim();
    const tenantId = String(args.tenantId ?? "").trim();
    if (!tenantSlug) return errorResult("'tenantSlug' is required.");
    if (!tenantId) return errorResult("'tenantId' is required.");

    const dryRun = args.dryRun !== false;
    const emailSink =
      typeof args.email === "string"
        ? (args.email as EmailSink)
        : undefined;

    // ------------------------------------------------------------------
    // 1. Determine lead sink: Maasy CRM or Appwrite
    // ------------------------------------------------------------------

    const hasMaasyCreds = !!(config.maasyUrl && config.maasyApiKey);
    const hasAppwriteCreds = !!(
      config.appwriteEndpoint &&
      config.appwriteProject &&
      config.appwriteApiKey
    );

    let leadSink: "maasy_crm" | "appwrite" | null = null;
    let isMaasy = false;

    if (hasMaasyCreds) {
      try {
        isMaasy = await isMaasyClient(tenantSlug);
      } catch {
        // Non-fatal: treat as non-Maasy client.
        isMaasy = false;
      }
      if (isMaasy) leadSink = "maasy_crm";
    }

    if (!leadSink) {
      if (!hasAppwriteCreds) {
        // Neither path is available -- return a plan with the needed vars.
        const needsVars = [
          "MAASY_URL",
          "MAASY_API_KEY",
          "APPWRITE_ENDPOINT",
          "APPWRITE_PROJECT",
          "APPWRITE_API_KEY",
        ];
        return json({
          action: "needsCreds",
          message:
            `Cannot provision leads for '${tenantSlug}': no Maasy or Appwrite ` +
            "credentials are configured. Set at least one set of credentials " +
            "in Infisical (believe-infra/prod) and re-run via " +
            "'~/.believe/bin/infra'.",
          needsCreds: true,
          requiredEnvVars: needsVars,
          plan:
            "Option A (Maasy CRM): set MAASY_URL + MAASY_API_KEY. " +
            "The tenant must exist as a brand in Maasy. " +
            "Option B (Appwrite): set APPWRITE_ENDPOINT + APPWRITE_PROJECT + " +
            "APPWRITE_API_KEY. A collection leads_<tenant> will be created.",
        });
      }
      leadSink = "appwrite";
    }

    // ------------------------------------------------------------------
    // 2. Validate email channel credentials
    // ------------------------------------------------------------------

    const emailMissing: string[] = [];
    if (emailSink === "usesend" && !process.env.USESEND_API_KEY) {
      emailMissing.push("USESEND_API_KEY");
    }
    if (emailSink === "plunk" && !process.env.PLUNK_API_KEY) {
      emailMissing.push("PLUNK_API_KEY");
    }

    if (emailMissing.length > 0 && !dryRun) {
      return errorResult(
        `Email sink '${emailSink}' requires ${emailMissing.join(", ")} to be set ` +
          "in your secret store. Add it to Infisical (believe-infra/prod) and " +
          "re-run via '~/.believe/bin/infra'.",
      );
    }

    // ------------------------------------------------------------------
    // 3. Build the leads config object that will go into CMS settings
    // ------------------------------------------------------------------

    type LeadsConfig = Record<string, unknown>;
    let leadsConfig: LeadsConfig;
    let appwriteCollectionId: string | undefined;

    if (leadSink === "maasy_crm") {
      const maasyBase = config.maasyUrl!.replace(/\/+$/, "");
      const endpoint = `${maasyBase}/api/brands/${tenantSlug}/leads`;
      const hmacKey = dryRun ? "<generated-on-apply>" : randomHmacKey();
      leadsConfig = {
        sink: "maasy_crm",
        endpoint,
        hmac: hmacKey,
      };
    } else {
      // Appwrite path.
      const collectionId = `leads_${tenantSlug}`.replace(/[^a-zA-Z0-9_]/g, "_");
      appwriteCollectionId = collectionId;
      leadsConfig = {
        sink: "appwrite",
        dbId: config.appwriteProject!,
        collectionId,
        endpoint: `${config.appwriteEndpoint!.replace(/\/+$/, "")}/v1/databases/${config.appwriteProject!}/collections/${collectionId}/documents`,
        apiKey: dryRun ? "<appwrite-api-key-from-env>" : config.appwriteApiKey!,
      };
    }

    // ------------------------------------------------------------------
    // 4. Build the email config object
    // ------------------------------------------------------------------

    type EmailConfig = Record<string, unknown> | undefined;
    let emailConfig: EmailConfig;

    if (emailSink === "usesend") {
      emailConfig = {
        provider: "usesend",
        from: "noreply@besend.somosbelieve.com",
        apiKey: dryRun
          ? "<usesend-api-key-from-env>"
          : (process.env.USESEND_API_KEY ?? ""),
        endpoint: "https://besend.believe-global.com/api/email/send",
      };
    } else if (emailSink === "plunk") {
      emailConfig = {
        provider: "plunk",
        from: "noreply@besend.somosbelieve.com",
        apiKey: dryRun
          ? "<plunk-api-key-from-env>"
          : (process.env.PLUNK_API_KEY ?? ""),
        endpoint: "https://api.mailing.believe-global.com/v1/send",
      };
    }

    // ------------------------------------------------------------------
    // 5. dryRun: return the plan without side effects
    // ------------------------------------------------------------------

    if (dryRun) {
      const plan: Record<string, unknown> = {
        action: "dryRun",
        message:
          `Would configure leads for tenant '${tenantSlug}' ` +
          `(id=${tenantId}) using sink '${leadSink}'. ` +
          "Pass dryRun:false to apply.",
        leadSink,
        leadsConfig,
      };
      if (emailConfig) plan.emailConfig = emailConfig;
      if (leadSink === "appwrite") {
        plan.willCreate = {
          appwriteCollection: appwriteCollectionId,
          attributes: ["name", "email", "phone", "message", "createdAt"],
        };
      }
      if (emailMissing.length > 0) {
        plan.warnings = [
          `Email sink '${emailSink}' will need ${emailMissing.join(", ")} ` +
            "when dryRun:false is applied.",
        ];
      }
      return json(plan);
    }

    // ------------------------------------------------------------------
    // 6. Apply: create Appwrite collection if needed, then patch CMS settings
    // ------------------------------------------------------------------

    if (leadSink === "appwrite") {
      const collection = await createAppwriteLeadsCollection(tenantSlug);
      // Use the real id Appwrite assigned (may differ from our computed id on
      // first creation depending on the Appwrite version).
      const realId = collection.$id ?? appwriteCollectionId!;
      leadsConfig.collectionId = realId;
      leadsConfig.endpoint =
        `${config.appwriteEndpoint!.replace(/\/+$/, "")}/v1/databases/` +
        `${config.appwriteProject!}/collections/${realId}/documents`;
    }

    // Find or create the settings document for this tenant.
    const cms = new CmsClient();
    const settingsResult = await cms.find("settings", {
      where: { tenant: { equals: tenantId } },
      limit: 1,
    });

    const settingsPayload: Record<string, unknown> = {
      leads: leadsConfig,
    };
    if (emailConfig) settingsPayload.email = emailConfig;

    let settingsDoc;
    if (settingsResult.docs.length > 0) {
      const existing = settingsResult.docs[0]!;
      settingsDoc = await cms.update("settings", String(existing.id), settingsPayload);
    } else {
      // Create a minimal settings doc if none exists yet.
      settingsDoc = await cms.create("settings", {
        tenant: tenantId,
        ...settingsPayload,
      });
    }

    const result: Record<string, unknown> = {
      action: "provisioned",
      message: `Leads provisioned for tenant '${tenantSlug}'.`,
      tenantId,
      leadSink,
      settingsId: settingsDoc.id,
      leadsConfig,
    };
    if (emailConfig) {
      // Mask the API key in the success output.
      result.emailConfig = { ...emailConfig, apiKey: "***" };
    }
    if (leadSink === "appwrite") {
      result.appwriteCollectionId = leadsConfig.collectionId;
    }
    return json(result);
  },
};

export default tool;
