/**
 * Cliente del endpoint de servicio del CMS (/api/svc/cms/...), protegido por X-CMS-Key.
 * Usado por las tools remotas puck_get_page / puck_publish_page.
 */
import { assertSlug } from "./repo.js";

const BASE = (process.env.PUCK_CMS_BASE_URL || "https://puck.believe-global.com").replace(/\/$/, "");
const KEY = process.env.PUCK_SVC_KEY || "";

function endpoint(tenant: string, slug: string): string {
  return `${BASE}/api/svc/cms/${assertSlug(tenant)}/${assertSlug(slug)}`;
}

function requireKey(): void {
  if (!KEY) {
    throw new Error(
      "PUCK_SVC_KEY no está configurada en el entorno del MCP (debe coincidir con la del CMS).",
    );
  }
}

export async function getRemotePage(tenant: string, slug: string): Promise<unknown> {
  requireKey();
  const res = await fetch(endpoint(tenant, slug), { headers: { "x-cms-key": KEY } });
  if (!res.ok) throw new Error(`GET ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

export async function publishRemotePage(tenant: string, slug: string, data: unknown): Promise<unknown> {
  requireKey();
  if (!data || typeof data !== "object") throw new Error("data debe ser un objeto Puck Data");
  const res = await fetch(endpoint(tenant, slug), {
    method: "PUT",
    headers: { "x-cms-key": KEY, "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

export async function listRemotePages(tenant: string): Promise<string[]> {
  requireKey();
  const res = await fetch(`${BASE}/api/svc/cms/${assertSlug(tenant)}`, { headers: { "x-cms-key": KEY } });
  if (!res.ok) throw new Error(`GET ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const body = (await res.json()) as { pages?: string[] };
  return body.pages ?? [];
}

export async function seedRemotePage(tenant: string, slug: string, force = false): Promise<unknown> {
  requireKey();
  const res = await fetch(endpoint(tenant, slug), {
    method: "POST",
    headers: { "x-cms-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ force }),
  });
  if (!res.ok) throw new Error(`POST ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}
