/**
 * Authenticated Payload v3 CMS client.
 *
 * Auth model: there are no REST credentials for the CMS. We log in as a Payload
 * super-admin (POST /api/users/login) and cache the returned JWT, then send
 * 'Authorization: JWT <token>' on writes. The frontend only reads; this client
 * is the only writer.
 */

import { config, requireCmsCredentials, type Config } from "./config.js";

export type Collection = "tenants" | "pages" | "settings";

export interface CmsError extends Error {
  status?: number;
  body?: unknown;
}

function makeError(message: string, status?: number, body?: unknown): CmsError {
  const err = new Error(message) as CmsError;
  err.name = "CmsError";
  if (status !== undefined) err.status = status;
  if (body !== undefined) err.body = body;
  return err;
}

export interface PayloadDoc {
  id: string;
  [key: string]: unknown;
}

export interface FindResult {
  docs: PayloadDoc[];
  totalDocs: number;
  [key: string]: unknown;
}

/** Cached JWT so we only log in once per process (until it is cleared on 401). */
let cachedToken: string | undefined;

export class CmsClient {
  private readonly cfg: Config;

  constructor(cfg: Config = config) {
    this.cfg = cfg;
  }

  private url(path: string): string {
    const suffix = path.startsWith("/") ? path : `/${path}`;
    return `${this.cfg.cmsUrl}${suffix}`;
  }

  /** Log in as super-admin and cache the JWT. Returns the token. */
  async login(force = false): Promise<string> {
    if (cachedToken && !force) return cachedToken;
    const { email, password } = requireCmsCredentials(this.cfg);
    const res = await fetch(this.url("/api/users/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await safeJson(res);
    if (!res.ok) {
      throw makeError(
        `CMS login failed (${res.status}). Check CMS_ADMIN_EMAIL / ` +
          "CMS_ADMIN_PASSWORD and that CMS_URL points at the Payload instance.",
        res.status,
        body,
      );
    }
    const token = (body as { token?: unknown })?.token;
    if (typeof token !== "string" || token.length === 0) {
      throw makeError(
        "CMS login succeeded but no token was returned.",
        res.status,
        body,
      );
    }
    cachedToken = token;
    return token;
  }

  /** Perform an authenticated request, retrying once after a fresh login on 401. */
  private async authedFetch(
    path: string,
    init: RequestInit,
    retry = true,
  ): Promise<Response> {
    const token = await this.login();
    const headers = new Headers(init.headers);
    headers.set("Authorization", `JWT ${token}`);
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const res = await fetch(this.url(path), { ...init, headers });
    if (res.status === 401 && retry) {
      cachedToken = undefined;
      await this.login(true);
      return this.authedFetch(path, init, false);
    }
    return res;
  }

  /**
   * Find documents in a collection. `where` is a Payload where-object that gets
   * flattened into bracketed query params (e.g. where[tenant][equals]=<id>).
   */
  async find(
    collection: Collection,
    options: { where?: Record<string, unknown>; limit?: number } = {},
  ): Promise<FindResult> {
    const params = new URLSearchParams();
    if (options.where) {
      for (const [key, value] of flattenWhere(options.where)) {
        params.set(key, value);
      }
    }
    if (options.limit !== undefined) params.set("limit", String(options.limit));
    const qs = params.toString();
    const path = `/api/${collection}${qs ? `?${qs}` : ""}`;
    const res = await this.authedFetch(path, { method: "GET" });
    const body = await safeJson(res);
    if (!res.ok) {
      throw makeError(
        `CMS find on '${collection}' failed (${res.status}).`,
        res.status,
        body,
      );
    }
    return body as FindResult;
  }

  /** Create a document in a collection. */
  async create(
    collection: Collection,
    data: Record<string, unknown>,
  ): Promise<PayloadDoc> {
    const res = await this.authedFetch(`/api/${collection}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const body = await safeJson(res);
    if (!res.ok) {
      throw makeError(
        `CMS create on '${collection}' failed (${res.status}).`,
        res.status,
        body,
      );
    }
    // Payload returns { doc, message } on create.
    const doc = (body as { doc?: PayloadDoc }).doc ?? (body as PayloadDoc);
    return doc;
  }

  /** Update a document by id in a collection. */
  async update(
    collection: Collection,
    id: string,
    data: Record<string, unknown>,
  ): Promise<PayloadDoc> {
    const res = await this.authedFetch(`/api/${collection}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const body = await safeJson(res);
    if (!res.ok) {
      throw makeError(
        `CMS update on '${collection}/${id}' failed (${res.status}).`,
        res.status,
        body,
      );
    }
    const doc = (body as { doc?: PayloadDoc }).doc ?? (body as PayloadDoc);
    return doc;
  }

  /** Find a tenant by its slug. Returns the doc or undefined. */
  async findTenantBySlug(slug: string): Promise<PayloadDoc | undefined> {
    const result = await this.find("tenants", {
      where: { slug: { equals: slug } },
      limit: 1,
    });
    return result.docs[0];
  }

  /** Find a page by tenant id + slug. Returns the doc or undefined. */
  async findPage(
    tenantId: string,
    slug: string,
  ): Promise<PayloadDoc | undefined> {
    const result = await this.find("pages", {
      where: { tenant: { equals: tenantId }, slug: { equals: slug } },
      limit: 1,
    });
    return result.docs[0];
  }
}

/** Flatten a nested where-object into Payload bracketed query keys. */
function flattenWhere(
  where: Record<string, unknown>,
  prefix = "where",
): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(where)) {
    const nextKey = `${prefix}[${key}]`;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      out.push(...flattenWhere(value as Record<string, unknown>, nextKey));
    } else {
      out.push([nextKey, String(value)]);
    }
  }
  return out;
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

/** Reset the cached token. Mainly for tests. */
export function resetCmsToken(): void {
  cachedToken = undefined;
}
