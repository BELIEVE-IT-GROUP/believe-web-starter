# believe-cms-mcp

MCP server that acts as **"the hands"** of the Believe Web Factory. The Next.js
frontend only *reads* from the Payload CMS; this MCP server *writes*: it creates
tenants, pages and blocks in the CMS, lists the Flowbite block catalog, and
(later epics) provisions Coolify landings.

It speaks the [Model Context Protocol](https://modelcontextprotocol.io) over
stdio, so any MCP client (Claude Code, Claude Desktop, etc.) can drive it.

## What it does

- `cms_list_block_templates` — read-only listing of the 133 Flowbite block
  templates (`<blockType>.<variant>`), optionally filtered by block type.
- `cms_create_tenant` — create a tenant (idempotent: returns the existing one if
  the slug already exists).
- `cms_create_page` — create a page for a tenant with an ordered list of blocks.
- `cms_seed_content` — create several pages/blocks at once from a structure.

Every tool that creates real resources accepts a `dryRun` flag (default `true`):
when `dryRun` is on, the tool *describes* what it would do and touches nothing.

## Architecture / access model

- The CMS is **Payload v3** at `https://cms.believe-global.com`. There are no
  REST credentials for the CMS in the secret vault. Authentication is a Payload
  **super-admin login**:

  ```
  POST {CMS_URL}/api/users/login
  { "email": CMS_ADMIN_EMAIL, "password": CMS_ADMIN_PASSWORD }
  -> { "token": "<jwt>" }
  ```

  The server caches that JWT and sends `Authorization: JWT <token>` on writes.

- Coolify (Hetzner) is used for landing provisioning via its v1 API with a
  Bearer token. Project `believe-landings` and a fixed server are referenced by
  id (see env below).

## Secrets (env vars)

The server reads everything from `process.env`. It never hardcodes secrets and
never prompts for them. Missing values do not crash the server at startup; the
relevant tool fails with a clear message only when it actually needs the value.

### One-time setup secrets (you must provide these once)

| Var                  | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `CMS_ADMIN_EMAIL`    | Payload super-admin email used to log in.      |
| `CMS_ADMIN_PASSWORD` | Payload super-admin password used to log in.   |

These two are a one-time setup. Add them to your secret store (Infisical) — **do
not** paste them in chat or commit them.

### Already-in-vault secrets (injected by `infra`)

| Var                        | Default                                          |
| -------------------------- | ------------------------------------------------ |
| `CMS_URL`                  | `https://cms.believe-global.com`                 |
| `COOLIFY_HETZNER_TOKEN`    | (Coolify Hetzner Bearer token)                   |
| `COOLIFY_HETZNER_URL`      | `https://coolify.backends.believe-global.com`    |
| `COOLIFY_LANDINGS_PROJECT` | `sy6mbsp3b73r6f5k7jq9d6en`                        |
| `COOLIFY_HETZNER_SERVER`   | `o5de31aovlrol4bvhvy9wtk2`                        |
| `APPWRITE_*`               | (reserved for later epics)                       |
| `MAASY_*`                  | (reserved for later epics)                       |

## Install

```bash
npm install
npm run build
```

## Run

The operator runs the server through the `infra` helper, which injects all the
vault secrets as env vars. You only need to provide the two one-time CMS admin
secrets in your store first.

```bash
~/.believe/bin/infra node dist/index.js
```

Or wire it into an MCP client (`claude_desktop_config.json` / Claude Code MCP
config) pointing `command` at the same `infra node dist/index.js` invocation so
the secrets are present in the process environment.

## Safety

This server can create real resources. Tools default to `dryRun: true`. Only
pass `dryRun: false` when you intend to write to production. Read-only tools
(`cms_list_block_templates`) are always safe.
