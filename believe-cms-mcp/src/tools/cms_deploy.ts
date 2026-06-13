/**
 * cms_deploy — create and deploy the frontend landing app in Coolify Hetzner
 * for a given tenant.
 *
 * Steps:
 *  1. createApp  — public git app (believe-web-starter, dockerfile build pack)
 *  2. setEnvs    — inject tenant-specific env vars
 *  3. deploy     — trigger the first build
 *
 * The generated URL follows Coolify's sslip.io pattern:
 *   http://<uuid-hex-prefix>.<server-ip>.sslip.io
 *
 * dryRun (default true): describes every step without touching Coolify.
 * domain (optional): if provided, it is passed as the FQDN for the app.
 */

import { CoolifyClient } from "../coolify.js";
import { config } from "../config.js";
import { errorResult, json, type Tool } from "./_types.js";

/** Coolify Hetzner server IP (used to derive the sslip fallback URL). */
const HETZNER_SERVER_IP = "5.78.214.173";

/** Git source for the shared frontend. */
const GIT_REPOSITORY =
  "https://github.com/BELIEVE-IT-GROUP/believe-web-starter.git";
const GIT_BRANCH = "main";

function sslipUrl(uuid: string, ip: string): string {
  // Coolify uses the first 8 hex chars of the uuid as the subdomain.
  const prefix = uuid.replace(/-/g, "").slice(0, 8);
  return `http://${prefix}.${ip}.sslip.io`;
}

const tool: Tool = {
  name: "cms_deploy",
  description:
    "Create and deploy the believe-web-starter frontend app in Coolify Hetzner " +
    "for a tenant. Steps: createApp, setEnvs, deploy. dryRun (default true) " +
    "describes the actions without touching Coolify.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    required: ["tenantSlug", "tenantId"],
    properties: {
      tenantSlug: {
        type: "string",
        description: "URL-safe tenant slug, e.g. 'acme'. Used as the app name suffix.",
      },
      tenantId: {
        type: "string",
        description:
          "Payload CMS tenant document id. Passed as NEXT_PUBLIC_TENANT_ID to the app.",
      },
      domain: {
        type: "string",
        description:
          "Optional custom FQDN (e.g. 'acme.com'). When omitted the Coolify " +
          "sslip.io fallback URL is used.",
      },
      dryRun: {
        type: "boolean",
        description:
          "When true (default), only describe what would happen; create nothing in Coolify.",
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
    const domain =
      typeof args.domain === "string" && args.domain.trim().length > 0
        ? args.domain.trim()
        : undefined;

    const appName = `web-${tenantSlug}`;

    // The env vars the frontend reads at build/runtime.
    const envVars: Record<string, string> = {
      NEXT_PUBLIC_TENANT_ID: tenantId,
      NEXT_PUBLIC_PAYLOAD_URL: config.cmsUrl,
      NEXT_PUBLIC_TENANT_SLUG: tenantSlug,
    };

    if (dryRun) {
      const fallbackUrl = `http://<uuid-prefix>.${HETZNER_SERVER_IP}.sslip.io`;
      return json({
        action: "dryRun",
        message:
          `Would create Coolify app '${appName}' in project '${config.coolifyProject}' ` +
          `on server '${config.coolifyServer}', then set env vars and deploy. ` +
          "Pass dryRun:false to apply.",
        wouldCreate: {
          name: appName,
          gitRepository: GIT_REPOSITORY,
          gitBranch: GIT_BRANCH,
          buildPack: "dockerfile",
          portsExposes: "3000",
          domain: domain ?? null,
          projectUuid: config.coolifyProject,
          serverUuid: config.coolifyServer,
          instantDeploy: false,
        },
        wouldSetEnvs: envVars,
        wouldDeployTo: domain ? `https://${domain}` : fallbackUrl,
      });
    }

    const coolify = new CoolifyClient();

    // Step 1: create the app.
    const app = await coolify.createApp({
      name: appName,
      gitRepository: GIT_REPOSITORY,
      gitBranch: GIT_BRANCH,
      buildPack: "dockerfile",
      domains: domain,
      extra: {
        ports_exposes: "3000",
        instant_deploy: false,
      },
    });

    const uuid = String(app.uuid ?? "");
    if (!uuid) {
      return errorResult(
        "Coolify createApp succeeded but returned no uuid. Cannot continue.",
      );
    }

    // Step 2: set env vars.
    await coolify.setEnvs(uuid, envVars);

    // Step 3: trigger the deploy.
    await coolify.deploy(uuid);

    const appUrl = domain
      ? `https://${domain}`
      : sslipUrl(uuid, HETZNER_SERVER_IP);

    return json({
      action: "deployed",
      message:
        `Created Coolify app '${appName}' (uuid: ${uuid}) and triggered the ` +
        "first deploy. The build may take a few minutes.",
      app: {
        uuid,
        name: appName,
        url: appUrl,
        domain: domain ?? null,
        gitRepository: GIT_REPOSITORY,
        gitBranch: GIT_BRANCH,
      },
      envs: Object.keys(envVars),
    });
  },
};

export default tool;
