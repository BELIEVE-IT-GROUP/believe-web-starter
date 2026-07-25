/**
 * puck_publish_static_html — publica un HTML estático en el CMS sin Puck.
 *
 * Flujo: copia el archivo a public/p/<slug>.html en el repo local → rsync →
 * docker build → run-puck.sh. El HTML queda bakeado en la imagen (permanente).
 * URL resultante: https://puck.believe-global.com/p/<slug>.html
 *
 * Por qué public/p/ y no public/ raíz: la ruta (chrome)/[slug] de Next.js
 * intercepta rutas de un segmento antes de que el servidor sirva archivos
 * estáticos. Al usar el prefijo /p/ (dos segmentos) el match no aplica.
 * Archivos SVG/txt/robots sí funcionan en raíz porque Next.js los identifica
 * por content-type; .html no recibe ese trato especial.
 */
import type { Tool } from "./_types.js";
import { json, errorResult } from "./_types.js";
import { repoDir, assertSlug } from "../lib/repo.js";
import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const REMOTE_HOST = process.env.PUCK_DEPLOY_HOST || "contabo-believe";
const REMOTE_DIR = "/root/puck-cms";
const IMAGE = "puck-cms:latest";
const EXCLUDES = [
  ".git", "node_modules", ".next", ".claude", ".gstack",
  "puck-cms-mcp", "data/pages", "backups", "tsconfig.tsbuildinfo",
];

function run(cmd: string, args: string[]): Promise<{ code: number; out: string }> {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d.toString()));
    p.stderr.on("data", (d) => (out += d.toString()));
    p.on("close", (code) => resolve({ code: code ?? -1, out }));
    p.on("error", (e) => resolve({ code: -1, out: String(e) }));
  });
}

const tool: Tool = {
  name: "puck_publish_static_html",
  description:
    "Publica un HTML estático en puck.believe-global.com/p/<slug>.html. " +
    "Copia el archivo a public/p/ en el repo, hace rsync + docker build + deploy. " +
    "dryRun=true (default) muestra el plan sin tocar prod.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "Ruta absoluta al archivo HTML local. Ej: /Users/mac/Desktop/mi-propuesta.html",
      },
      slug: {
        type: "string",
        description: "Slug de la URL (solo a-z, 0-9, guión). Ej: propuesta-araujoibarra-2026",
      },
      dryRun: {
        type: "boolean",
        description: "true (default): muestra el plan. false: ejecuta y toca producción.",
        default: true,
      },
    },
    required: ["filePath", "slug"],
    additionalProperties: false,
  },
  async handler(args) {
    const filePath = String(args.filePath ?? "");
    const slug = String(args.slug ?? "");
    const dryRun = args.dryRun !== false;

    // Validaciones
    if (!filePath) return errorResult("filePath es requerido.");
    if (!existsSync(filePath)) return errorResult(`Archivo no encontrado: ${filePath}`);

    let safeSlug: string;
    try {
      safeSlug = assertSlug(slug);
    } catch (e) {
      return errorResult(String(e));
    }

    const destDir = path.join(repoDir, "public", "p");
    const destFile = path.join(destDir, `${safeSlug}.html`);
    const publicUrl = `https://puck.believe-global.com/p/${safeSlug}.html`;

    const rsyncArgs = [
      "-az", "--delete",
      ...EXCLUDES.flatMap((e) => ["--exclude", e]),
      `${repoDir}/`,
      `${REMOTE_HOST}:${REMOTE_DIR}/`,
    ];

    const steps = [
      { label: "copy",  cmd: "local",  args: [`${filePath} → ${destFile}`] },
      { label: "rsync", cmd: "rsync",  args: rsyncArgs },
      { label: "build", cmd: "ssh",    args: [REMOTE_HOST, `cd ${REMOTE_DIR} && docker build -t ${IMAGE} .`] },
      { label: "run",   cmd: "ssh",    args: [REMOTE_HOST, `bash ${REMOTE_DIR}/deploy/run-puck.sh`] },
    ];

    if (dryRun) {
      return json({
        dryRun: true,
        filePath,
        destFile,
        publicUrl,
        steps: steps.map((s) =>
          s.cmd === "local" ? `cp ${s.args[0]}` : `${s.cmd} ${s.args.join(" ")}`,
        ),
      });
    }

    // 1. Copiar HTML al repo
    try {
      await mkdir(destDir, { recursive: true });
      await copyFile(filePath, destFile);
    } catch (e) {
      return errorResult(`Error copiando archivo: ${e}`);
    }

    // 2. rsync + build + deploy
    const log: Array<Record<string, unknown>> = [];
    for (const s of steps.slice(1)) {
      const r = await run(s.cmd, s.args);
      log.push({ step: s.label, code: r.code, out: r.out.slice(-1500) });
      if (r.code !== 0) {
        return json({ ok: false, failedAt: s.label, publicUrl, log });
      }
    }

    return json({ ok: true, publicUrl, slug: safeSlug, log });
  },
};

export default tool;
