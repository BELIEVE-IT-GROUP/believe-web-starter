/**
 * Allowlist de templateIds "deep-portados": variantes Flowbite que ya aceptan props del CMS
 * (contenido real, tokens de theme) y por lo tanto pueden REEMPLAZAR al componente legacy.
 *
 * Hasta que una variante esté acá, el BlockRenderer (A4) usa el componente legacy de Fase 1
 * para esa blockType — así la home believe nunca se rompe. Cada lote de deep-port (A5..A12)
 * suma sus templateIds acá, migrando la home progresivamente y con verificación.
 */
export const portedTemplates = new Set<string>([
  // A5 — marketing lote 1 (hero / feature / pricing / cta). Se llena al portar cada variante.
])

export function isPorted(templateId?: string): boolean {
  return !!templateId && portedTemplates.has(templateId)
}
