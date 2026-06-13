#!/usr/bin/env node
/**
 * A1 — Test de contrato del catálogo generado.
 * Falla (exit 1) si: el JSON no existe, faltan sourceFiles, o el shape es inválido.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const CAT = join(REPO_ROOT, 'src', 'flowbite', 'catalog.generated.json')

let failed = 0
const assert = (cond, msg) => {
  if (cond) {
    console.log('  ✓', msg)
  } else {
    console.error('  ✖', msg)
    failed++
  }
}

if (!existsSync(CAT)) {
  console.error('✖ Falta catalog.generated.json — corré: node scripts/extract-flowbite-catalog.mjs')
  process.exit(1)
}
const cat = JSON.parse(readFileSync(CAT, 'utf8'))

console.log('A1 · Validación de catálogo')
assert(Array.isArray(cat.templates) && cat.templates.length === 133, `templates = 133 (got ${cat.templates?.length})`)
assert(Array.isArray(cat.inventory) && cat.inventory.length === 355, `inventory = 355 (got ${cat.inventory?.length})`)
assert(cat.counts.missingTemplateSourceFiles === 0, `0 sourceFiles de templates faltantes (got ${cat.counts.missingTemplateSourceFiles})`)
assert(cat.counts.missingInventorySourceFiles === 0, `0 sourceFiles de inventario faltantes (got ${cat.counts.missingInventorySourceFiles})`)

const badShape = cat.templates.filter((t) => !t.templateId || !t.blockType || !t.sourceFile || t.exists !== true)
assert(badShape.length === 0, `todos los templates tienen templateId+blockType+sourceFile y exists=true (malos: ${badShape.length})`)

const ids = new Set(cat.templates.map((t) => t.templateId))
assert(ids.size === cat.templates.length, `templateId únicos (${ids.size}/${cat.templates.length})`)

const badFormat = cat.templates.filter((t) => !t.templateId.startsWith(t.blockType + '.'))
assert(badFormat.length === 0, `templateId con formato <blockType>.<variant> (malos: ${badFormat.length})`)

if (failed) {
  console.error(`\n✖ ${failed} aserción(es) fallaron\n`)
  process.exit(1)
}
console.log('\n✓ Catálogo válido: 133 templateIds CMS + 355 inventario, todos resuelven a un .tsx existente.\n')
