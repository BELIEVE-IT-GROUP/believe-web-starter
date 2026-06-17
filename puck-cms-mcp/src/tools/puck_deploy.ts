import type { Tool } from "./_types.js";
import { json } from "./_types.js";
import { repoDir } from "../lib/repo.js";
import { spawn, execFile } from "node:child_process";

const REMOTE_HOST = process.env.PUCK_DEPLOY_HOST || "contabo-believe";
const REMOTE_DIR = "/root/puck-cms";
const IMAGE = "puck-cms:latest";
// data/pages vive en el volumen Docker puck-cms-pages (no en el código); puck-cms-mcp
// no es parte del build del CMS. Excluirlos evita que --delete toque nada raro.
const EXCLUDES = [".git", "node_modules", ".next", ".claude", "puck-cms-mcp", "data/pages"];

const rsyncArgs = [
  "-az",
  "--delete",
  ...EXCLUDES.flatMap((e) => ["--exclude", e]),
  `${repoDir}/`,
  `${REMOTE_HOST}:${REMOTE_DIR}/`,
];

const steps = [
  { label: "rsync", cmd: "rsync", args: rsyncArgs },
  { label: "build", cmd: "ssh", args: [REMOTE_HOST, `cd ${REMOTE_DIR} && docker build -t ${IMAGE} .`] },
  { label: "run", cmd: "ssh", args: [REMOTE_HOST, `bash ${REMOTE_DIR}/deploy/run-puck.sh`] },
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

function currentBranch(): Promise<string> {
  return new Promise((resolve) => {
    execFile("git", ["-C", repoDir, "branch", "--show-current"], (e, stdout) =>
      resolve(e ? "?" : stdout.trim()),
    );
  });
}

const tool: Tool = {
  name: "puck_deploy",
  description:
    "Deploya el CMS Puck a Contabo: rsync del repo -> contabo:/root/puck-cms, docker build y run-puck.sh (recrea el container tras Traefik). dryRun=true (default) solo muestra los comandos y la rama; dryRun=false ejecuta de verdad (TOCA PRODUCCIÓN).",
  inputSchema: {
    type: "object",
    properties: {
      dryRun: {
        type: "boolean",
        description: "true (default): solo muestra qué haría. false: ejecuta el deploy real.",
        default: true,
      },
    },
    additionalProperties: false,
  },
  async handler(args) {
    const dryRun = args.dryRun !== false; // default true
    const branch = await currentBranch();
    const plan = steps.map(
      (s) => `${s.cmd} ${s.args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(" ")}`,
    );

    if (dryRun) {
      const warn =
        branch !== "feat/puck-cms" && branch !== "main"
          ? `OJO: deployarías la rama '${branch}' (el código Puck vive en feat/puck-cms).`
          : undefined;
      return json({ dryRun: true, repoDir, branch, host: REMOTE_HOST, remoteDir: REMOTE_DIR, commands: plan, warn });
    }

    const log: Array<Record<string, unknown>> = [];
    for (const s of steps) {
      const r = await run(s.cmd, s.args);
      log.push({ step: s.label, code: r.code, out: r.out.slice(-1500) });
      if (r.code !== 0) return json({ dryRun: false, branch, ok: false, failedAt: s.label, log });
    }
    return json({ dryRun: false, branch, ok: true, log });
  },
};

export default tool;
