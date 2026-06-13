/**
 * Coolify (Hetzner) v1 API client for provisioning landing apps.
 *
 * Bearer-token auth. Used by later epics to create the per-tenant landing app,
 * set its env vars and trigger a deploy. Kept minimal: only the operations the
 * factory needs.
 */

import { config, requireCoolifyToken, type Config } from "./config.js";

export interface CoolifyError extends Error {
  status?: number;
  body?: unknown;
}

function makeError(
  message: string,
  status?: number,
  body?: unknown,
): CoolifyError {
  const err = new Error(message) as CoolifyError;
  err.name = "CoolifyError";
  if (status !== undefined) err.status = status;
  if (body !== undefined) err.body = body;
  return err;
}

export interface CoolifyApp {
  uuid: string;
  [key: string]: unknown;
}

export interface CreateAppInput {
  /** Human-readable name for the app. */
  name: string;
  /** Git repository (e.g. owner/repo or full URL), per Coolify source config. */
  gitRepository?: string;
  gitBranch?: string;
  /** Domain(s) to attach (FQDN). */
  domains?: string;
  /** Build pack, e.g. 'nixpacks' | 'dockerfile'. */
  buildPack?: string;
  /** Extra fields passed through verbatim to the Coolify API. */
  extra?: Record<string, unknown>;
}

export class CoolifyClient {
  private readonly cfg: Config;

  constructor(cfg: Config = config) {
    this.cfg = cfg;
  }

  private url(path: string): string {
    const suffix = path.startsWith("/") ? path : `/${path}`;
    return `${this.cfg.coolifyUrl}/api/v1${suffix}`;
  }

  private async request(
    path: string,
    init: RequestInit = {},
  ): Promise<unknown> {
    const token = requireCoolifyToken(this.cfg);
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const res = await fetch(this.url(path), { ...init, headers });
    const body = await safeJson(res);
    if (!res.ok) {
      throw makeError(
        `Coolify request ${init.method ?? "GET"} ${path} failed (${res.status}).`,
        res.status,
        body,
      );
    }
    return body;
  }

  /** Get an app by uuid. */
  async getApp(uuid: string): Promise<CoolifyApp> {
    const body = await this.request(`/applications/${uuid}`, { method: "GET" });
    return body as CoolifyApp;
  }

  /** List applications. */
  async listApps(): Promise<CoolifyApp[]> {
    const body = await this.request("/applications", { method: "GET" });
    return Array.isArray(body) ? (body as CoolifyApp[]) : [];
  }

  /**
   * Create a public (git-based) application in the configured landings project
   * on the configured server. Returns the created app (with its uuid).
   */
  async createApp(input: CreateAppInput): Promise<CoolifyApp> {
    const payload: Record<string, unknown> = {
      project_uuid: this.cfg.coolifyProject,
      server_uuid: this.cfg.coolifyServer,
      name: input.name,
      build_pack: input.buildPack ?? "nixpacks",
      ...(input.gitRepository ? { git_repository: input.gitRepository } : {}),
      ...(input.gitBranch ? { git_branch: input.gitBranch } : {}),
      ...(input.domains ? { domains: input.domains } : {}),
      ...(input.extra ?? {}),
    };
    const body = await this.request("/applications/public", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return body as CoolifyApp;
  }

  /**
   * Set (upsert) environment variables on an app. Coolify exposes a bulk
   * endpoint; we send one entry per key.
   */
  async setEnvs(
    uuid: string,
    envs: Record<string, string>,
  ): Promise<unknown> {
    const data = Object.entries(envs).map(([key, value]) => ({
      key,
      value,
    }));
    return this.request(`/applications/${uuid}/envs/bulk`, {
      method: "PATCH",
      body: JSON.stringify({ data }),
    });
  }

  /** Trigger a deploy for an app uuid. */
  async deploy(uuid: string): Promise<unknown> {
    return this.request(
      `/deploy?uuid=${encodeURIComponent(uuid)}`,
      { method: "GET" },
    );
  }
}

async function safeJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (text.length === 0) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
