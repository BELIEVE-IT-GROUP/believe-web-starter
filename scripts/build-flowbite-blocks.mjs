#!/usr/bin/env node
/**
 * A3 — Copia las 133 variantes Flowbite (templateIds CMS) al frontend y genera el registry.
 *
 * Por cada templateId del catálogo:
 *   - copia el .tsx fuente a src/flowbite/blocks/<blockType>/<variant>.tsx
 *   - reescribe el único helper local (~/components/flowbite-logo)
 *   - agrega 'use client' si el componente usa hooks/handlers (SSR-safe)
 *   - normaliza el export a `export default` (124 named + 9 default → uniforme)
 *
 * Genera src/flowbite/registry.generated.ts con un mapa templateId -> next/dynamic(import),
 * que da code-splitting + SSR y mantiene el BlockRenderer síncrono.
 *
 * Idempotente: limpia blocks/ y regenera. Fuente veritas: catalog.generated.json (A1).
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
// El repo canónico (no el worktree) para resolver el sibling believe-cms-multitenant.
const CANONICAL_ROOT = REPO_ROOT.replace(/\/\.claude\/worktrees\/[^/]+$/, '')
const CMS_REPO = process.env.CMS_REPO
  ? resolve(process.env.CMS_REPO)
  : resolve(CANONICAL_ROOT, '..', 'believe-cms-multitenant')
const FLOWBITE_SRC = join(CMS_REPO, 'flowbite-react-blocks-1.8.0-beta', 'app')
const FLOWBITE_ROOT = join(CMS_REPO, 'flowbite-react-blocks-1.8.0-beta')
const CAT = join(REPO_ROOT, 'src', 'flowbite', 'catalog.generated.json')
const BLOCKS_DIR = join(REPO_ROOT, 'src', 'flowbite', 'blocks')
const HELPERS_DIR = join(REPO_ROOT, 'src', 'flowbite', '_helpers')
const REGISTRY_OUT = join(REPO_ROOT, 'src', 'flowbite', 'registry.generated.ts')

const cat = JSON.parse(readFileSync(CAT, 'utf8'))

// --- helper flowbite-logo ---
mkdirSync(HELPERS_DIR, { recursive: true })
const logoSrc = join(FLOWBITE_ROOT, 'components', 'flowbite-logo.tsx')
if (existsSync(logoSrc)) {
  writeFileSync(join(HELPERS_DIR, 'flowbite-logo.tsx'), readFileSync(logoSrc, 'utf8'))
}

// --- transforms ---
const INTERACTIVE =
  /\b(useState|useEffect|useRef|useReducer|useCallback|useMemo|useContext)\b|on(Click|Change|Submit|Focus|Blur|KeyDown|KeyUp|MouseEnter|MouseLeave|Scroll)\s*=\s*\{/

function detectExportName(src) {
  let m = src.match(/export\s+default\s+function\s+(\w+)/)
  if (m) return { name: m[1], isDefault: true }
  m = src.match(/export\s+function\s+(\w+)/)
  if (m) return { name: m[1], isDefault: false }
  m = src.match(/export\s+default\s+(\w+)\s*;?/)
  if (m) return { name: m[1], isDefault: true }
  return null
}

/**
 * Patches de compatibilidad por templateId: la fuente Flowbite fue escrita para una versión
 * distinta de flowbite-react; bajo strict + la versión instalada (0.10.x) algunos tipos driftan.
 * Cada patch es [regex, replacement]. Se aplican tras la transformación genérica.
 */
const PATCHES = {
  // El Datepicker de flowbite-react instalado (0.10.x) driftó su API (value:Date, sin
  // onSelectedDateChanged). Es contenido demo → lo dejamos uncontrolled (typechea siempre;
  // el deep-port lo reemplaza por un search real parametrizado).
  'hero.search-datepicker': [
    [/\n\s*const \[checkIn, setCheckIn\] = useState\("Check in"\);/, ''],
    [/\n\s*const \[checkOut, setCheckOut\] = useState\("Check out"\);/, ''],
    [
      /<div className="grid grid-cols-2 gap-x-4 lg:col-span-3">[\s\S]*?<\/div>/,
      '<div className="grid grid-cols-2 gap-x-4 lg:col-span-3">\n            <Datepicker />\n            <Datepicker />\n          </div>',
    ],
  ],
}

function transform(src, templateId) {
  let out = src
  // reescribir el único helper local
  out = out.replace(/(['"])~\/components\/flowbite-logo\1/g, "'@/flowbite/_helpers/flowbite-logo'")

  for (const [re, rep] of PATCHES[templateId] || []) out = out.replace(re, rep)

  const hasUseClient = /^\s*['"]use client['"]/.test(out)
  const needsClient = INTERACTIVE.test(out)

  const exp = detectExportName(out)
  if (exp && !exp.isDefault) {
    out = out.trimEnd() + `\n\nexport default ${exp.name}\n`
  }

  if (needsClient && !hasUseClient) {
    out = `'use client'\n\n` + out
  }
  return { code: out, exportName: exp?.name, needsClient }
}

// --- copiar las 133 ---
rmSync(BLOCKS_DIR, { recursive: true, force: true })
const entries = []
let clientCount = 0
const missing = []
for (const t of cat.templates) {
  const srcPath = join(FLOWBITE_SRC, t.sourceFile)
  if (!existsSync(srcPath)) {
    missing.push(t.templateId)
    continue
  }
  const [blockType, ...rest] = t.templateId.split('.')
  const variant = rest.join('.')
  const relOut = join(blockType, `${variant}.tsx`)
  const absOut = join(BLOCKS_DIR, relOut)
  const { code, exportName, needsClient } = transform(readFileSync(srcPath, 'utf8'), t.templateId)
  if (!exportName) {
    missing.push(t.templateId + ' (sin export detectable)')
    continue
  }
  mkdirSync(dirname(absOut), { recursive: true })
  writeFileSync(absOut, code)
  if (needsClient) clientCount++
  entries.push({ templateId: t.templateId, blockType, importPath: `./blocks/${blockType}/${variant}` })
}

// --- generar registry.generated.ts ---
const lines = entries
  .map((e) => `  '${e.templateId}': dynamic(() => import('${e.importPath}')),`)
  .join('\n')

const registry = `/* AUTO-GENERADO por scripts/build-flowbite-blocks.mjs — NO editar a mano. */
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

/**
 * Mapa templateId (\`<blockType>.<variant>\`) -> componente Flowbite via next/dynamic.
 * ${entries.length} variantes. Code-split + SSR. Resuelto por el BlockRenderer (A4).
 */
export const flowbiteRegistry: Record<string, ComponentType<any>> = {
${lines}
}

export const flowbiteTemplateIds = Object.keys(flowbiteRegistry)

export function resolveFlowbiteTemplate(templateId?: string): ComponentType<any> | undefined {
  if (!templateId) return undefined
  return flowbiteRegistry[templateId]
}
`
writeFileSync(REGISTRY_OUT, registry)

console.log('A3 · Bloques Flowbite copiados + registry generado')
console.log('  variantes copiadas      :', entries.length)
console.log('  con "use client"        :', clientCount)
console.log('  faltantes/sin export    :', missing.length, missing.length ? JSON.stringify(missing) : '')
console.log('  → src/flowbite/blocks/<blockType>/<variant>.tsx')
console.log('  → src/flowbite/registry.generated.ts (' + entries.length + ' entries)')
