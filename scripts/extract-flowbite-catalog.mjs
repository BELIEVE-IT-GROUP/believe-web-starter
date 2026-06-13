#!/usr/bin/env node
/**
 * A1 — Extrae el catálogo Flowbite Pro a un JSON máquina-legible para el frontend.
 *
 * Fuente de verdad: el CMS believe-agency-cms ya mantiene el contrato canónico en
 *   src/flowbite/registry.ts  -> `flowbiteTemplates` (los templateId que el page-builder ofrece)
 *   src/flowbite/catalog.ts   -> `flowbiteCatalog`   (inventario completo de variantes .tsx)
 *
 * Este script los parsea, valida que cada sourceFile exista en el árbol Flowbite,
 * y emite src/flowbite/catalog.generated.json. NO reinventa el catálogo: lo deriva
 * para que los templateId del frontend matcheen exactamente lo que el CMS guarda.
 *
 * Override de rutas vía env: CMS_REPO (default ../believe-cms-multitenant).
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const CMS_REPO = resolve(REPO_ROOT, process.env.CMS_REPO || '../believe-cms-multitenant')
const FLOWBITE_SRC = join(CMS_REPO, 'flowbite-react-blocks-1.8.0-beta', 'app')
const REGISTRY_TS = join(CMS_REPO, 'src', 'flowbite', 'registry.ts')
const CATALOG_TS = join(CMS_REPO, 'src', 'flowbite', 'catalog.ts')
const OUT = join(REPO_ROOT, 'src', 'flowbite', 'catalog.generated.json')

function fail(msg) {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

for (const [label, p] of [['flowbite source', FLOWBITE_SRC], ['CMS registry.ts', REGISTRY_TS], ['CMS catalog.ts', CATALOG_TS]]) {
  if (!existsSync(p)) fail(`No encuentro ${label}: ${p}\n  Ajustá CMS_REPO (actual: ${CMS_REPO}).`)
}

const field = (block, name) => {
  const m = block.match(new RegExp(`${name}:\\s*'([^']+)'`))
  return m ? m[1] : undefined
}

// --- Parse flowbiteTemplates (los 133 templateId del page-builder CMS) ---
const registrySrc = readFileSync(REGISTRY_TS, 'utf8')
const templatesArr = registrySrc.slice(
  registrySrc.indexOf('export const flowbiteTemplates'),
  registrySrc.indexOf('] as const satisfies'),
)
const templates = [...templatesArr.matchAll(/\{\s*id:\s*'[^']+'[^}]*\}/g)]
  .map((m) => m[0])
  .map((b) => ({
    templateId: field(b, 'id'),
    blockType: field(b, 'blockType'),
    label: field(b, 'label'),
    sourceFile: field(b, 'sourceFile'),
  }))
  .filter((t) => t.templateId && t.sourceFile)

// --- Parse flowbiteCatalog (inventario completo 355) ---
const catalogSrc = readFileSync(CATALOG_TS, 'utf8')
const inventory = [...catalogSrc.matchAll(/\{\s*id:\s*'[^']+'[^}]*\}/g)]
  .map((m) => m[0])
  .map((b) => ({
    id: field(b, 'id'),
    family: field(b, 'family'),
    group: field(b, 'group'),
    label: field(b, 'label'),
    sourceFile: field(b, 'sourceFile'),
    cmsBlockType: field(b, 'cmsBlockType'),
    cmsTemplateId: field(b, 'cmsTemplateId'),
  }))
  .filter((e) => e.id && e.sourceFile)

// --- Validar existencia de sourceFiles ---
const checkExists = (sourceFile) => existsSync(join(FLOWBITE_SRC, sourceFile))
const missingTemplates = []
for (const t of templates) {
  t.exists = checkExists(t.sourceFile)
  if (!t.exists) missingTemplates.push(t.templateId + ' -> ' + t.sourceFile)
}
const missingInventory = []
for (const e of inventory) {
  e.exists = checkExists(e.sourceFile)
  if (!e.exists) missingInventory.push(e.id + ' -> ' + e.sourceFile)
}

const byBlockType = {}
for (const t of templates) byBlockType[t.blockType] = (byBlockType[t.blockType] || 0) + 1

const out = {
  generatedFrom: 'believe-agency-cms/src/flowbite/{registry,catalog}.ts',
  counts: {
    templates: templates.length,
    inventory: inventory.length,
    missingTemplateSourceFiles: missingTemplates.length,
    missingInventorySourceFiles: missingInventory.length,
  },
  byBlockType,
  missingTemplates,
  templates,
  inventory,
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')

console.log('A1 · Catálogo Flowbite extraído')
console.log('  templateIds CMS (page-builder):', templates.length)
console.log('  inventario total de variantes :', inventory.length)
console.log('  por blockType                 :', JSON.stringify(byBlockType))
console.log('  sourceFiles faltantes (tpl)   :', missingTemplates.length)
console.log('  sourceFiles faltantes (inv)   :', missingInventory.length)
if (missingTemplates.length) {
  console.log('\n  ⚠ Drift en templateIds (sourceFile no existe):')
  for (const m of missingTemplates) console.log('    -', m)
}
console.log('\n  → escrito', OUT.replace(REPO_ROOT + '/', ''))
