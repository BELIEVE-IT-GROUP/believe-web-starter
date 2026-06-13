import Link from 'next/link'
import catalog from '@/flowbite/catalog.generated.json'
import { flowbiteRegistry } from '@/flowbite/registry.generated'
import { getThemeVars, getGoogleFontsHref, DEMO_THEMES } from '@/lib/theme'

export const metadata = {
  title: 'Catálogo Flowbite · Believe Web Factory',
  description: 'Las 133 variantes Flowbite conectadas al CMS, themeables por marca.',
}

type Template = { templateId: string; blockType: string; label: string; sourceFile: string }

const templates = (catalog as { templates: Template[] }).templates

function groupByBlockType(list: Template[]) {
  const groups: Record<string, Template[]> = {}
  for (const t of list) (groups[t.blockType] ??= []).push(t)
  return groups
}

export default function CatalogPage({ searchParams }: { searchParams: { brand?: string } }) {
  const brand = searchParams.brand && DEMO_THEMES[searchParams.brand] ? searchParams.brand : 'believe'
  const demoSettings = { theme: DEMO_THEMES[brand] }
  const themeVars = getThemeVars(demoSettings)
  const fontsHref = getGoogleFontsHref(demoSettings)
  const groups = groupByBlockType(templates)
  const blockTypes = Object.keys(groups)

  return (
    <div data-brand={brand} className="bg-paper text-ink-900">
      {/* A2 — el catálogo se re-themea según ?brand= (evidencia: Believe vs Trust). */}
      {themeVars ? <style dangerouslySetInnerHTML={{ __html: `[data-brand="${brand}"]{${themeVars}}` }} /> : null}
      {fontsHref ? <link rel="stylesheet" href={fontsHref} /> : null}

      <header className="border-b border-ink-500/15 bg-paper/95 px-6 py-8 backdrop-blur">
        <p className="eyebrow mb-2">Believe Web Factory · Fase 2.1</p>
        <h1 className="font-display text-4xl">Catálogo Flowbite · {templates.length} variantes</h1>
        <p className="mt-2 max-w-2xl text-ink-700">
          Las {templates.length} variantes conectadas al CMS por <code>templateId</code>, renderizadas
          con la identidad de la marca activa. Cambiá la marca para ver el theming dinámico (A2):
        </p>
        <nav className="mt-4 flex flex-wrap gap-2">
          {Object.keys(DEMO_THEMES).map((b) => (
            <Link
              key={b}
              href={`/catalog?brand=${b}`}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize ${
                b === brand
                  ? 'border-primary-700 bg-primary-700 text-white'
                  : 'border-ink-500/30 text-ink-700 hover:border-primary-700'
              }`}
            >
              {b}
            </Link>
          ))}
        </nav>
        <nav className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
          {blockTypes.map((bt) => (
            <a key={bt} href={`#${bt}`} className="hover:text-primary-700">
              {bt} ({groups[bt].length})
            </a>
          ))}
        </nav>
      </header>

      {blockTypes.map((bt) => (
        <section key={bt} id={bt} className="scroll-mt-4">
          <h2 className="sticky top-0 z-10 border-y border-ink-500/15 bg-ink-900 px-6 py-2 font-display text-xl text-paper">
            {bt} · {groups[bt].length}
          </h2>
          <div className="divide-y divide-ink-500/10">
            {groups[bt].map((t) => {
              const Component = flowbiteRegistry[t.templateId]
              return (
                <article key={t.templateId} className="relative">
                  <div className="flex items-center gap-3 bg-paper-100 px-6 py-2">
                    <code className="rounded bg-primary-700 px-2 py-0.5 text-xs text-white">{t.templateId}</code>
                    <span className="text-sm text-ink-500">{t.label}</span>
                  </div>
                  <div className="overflow-hidden">
                    {Component ? <Component /> : <div className="p-6 text-red-600">no resuelve: {t.templateId}</div>}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}

      <footer className="border-t border-ink-500/15 px-6 py-10 text-sm text-ink-500">
        {templates.length} / 133 templateIds CMS renderizados · marca activa: <strong className="capitalize">{brand}</strong>
      </footer>
    </div>
  )
}
