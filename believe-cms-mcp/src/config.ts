/**
 * Environment configuration for the believe-cms-mcp server.
 *
 * Everything is read from process.env. Nothing is hardcoded and nothing is
 * prompted for. Missing values do NOT crash the process at startup; instead the
 * helpers below throw a clear, actionable error only when a tool actually needs
 * the value. This keeps read-only tools (e.g. listing the block catalog) usable
 * even when no secrets are present.
 */

const DEFAULT_CMS_URL = "https://cms.believe-global.com";
const DEFAULT_COOLIFY_URL = "https://coolify.backends.believe-global.com";
const DEFAULT_COOLIFY_PROJECT = "sy6mbsp3b73r6f5k7jq9d6en";
const DEFAULT_COOLIFY_SERVER = "o5de31aovlrol4bvhvy9wtk2";

function clean(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export interface Config {
  cmsUrl: string;
  cmsAdminEmail: string | undefined;
  cmsAdminPassword: string | undefined;
  coolifyUrl: string;
  coolifyToken: string | undefined;
  coolifyProject: string;
  coolifyServer: string;
  appwriteEndpoint: string | undefined;
  appwriteProject: string | undefined;
  appwriteApiKey: string | undefined;
  maasyUrl: string | undefined;
  maasyApiKey: string | undefined;
}

export function loadConfig(): Config {
  return {
    cmsUrl: stripTrailingSlash(clean(process.env.CMS_URL) ?? DEFAULT_CMS_URL),
    cmsAdminEmail: clean(process.env.CMS_ADMIN_EMAIL),
    cmsAdminPassword: clean(process.env.CMS_ADMIN_PASSWORD),
    coolifyUrl: stripTrailingSlash(
      clean(process.env.COOLIFY_HETZNER_URL) ?? DEFAULT_COOLIFY_URL,
    ),
    coolifyToken: clean(process.env.COOLIFY_HETZNER_TOKEN),
    coolifyProject:
      clean(process.env.COOLIFY_LANDINGS_PROJECT) ?? DEFAULT_COOLIFY_PROJECT,
    coolifyServer:
      clean(process.env.COOLIFY_HETZNER_SERVER) ?? DEFAULT_COOLIFY_SERVER,
    appwriteEndpoint: clean(process.env.APPWRITE_ENDPOINT),
    appwriteProject: clean(process.env.APPWRITE_PROJECT),
    appwriteApiKey: clean(process.env.APPWRITE_API_KEY),
    maasyUrl: clean(process.env.MAASY_URL),
    maasyApiKey: clean(process.env.MAASY_API_KEY),
  };
}

/** A singleton config snapshot read once at module load. */
export const config: Config = loadConfig();

/**
 * Error thrown when a tool needs a secret that was not provided in the env.
 * The message names the exact variable(s) and how the operator supplies them.
 */
export class MissingConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingConfigError";
  }
}

/** Ensure CMS admin credentials are present, or throw a clear error. */
export function requireCmsCredentials(cfg: Config = config): {
  email: string;
  password: string;
} {
  const missing: string[] = [];
  if (!cfg.cmsAdminEmail) missing.push("CMS_ADMIN_EMAIL");
  if (!cfg.cmsAdminPassword) missing.push("CMS_ADMIN_PASSWORD");
  if (missing.length > 0) {
    throw new MissingConfigError(
      `Missing ${missing.join(" and ")}. These are the one-time Payload ` +
        "super-admin credentials. Set them in your secret store (Infisical) " +
        "and run the server through '~/.believe/bin/infra' so they reach the " +
        "process environment. They are never hardcoded or requested in chat.",
    );
  }
  return { email: cfg.cmsAdminEmail!, password: cfg.cmsAdminPassword! };
}

/** Ensure the Coolify Hetzner token is present, or throw a clear error. */
export function requireCoolifyToken(cfg: Config = config): string {
  if (!cfg.coolifyToken) {
    throw new MissingConfigError(
      "Missing COOLIFY_HETZNER_TOKEN. Provide it via your secret store " +
        "(Infisical) and run through '~/.believe/bin/infra'.",
    );
  }
  return cfg.coolifyToken;
}
