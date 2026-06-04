import { Footer as FlowbiteFooter } from 'flowbite-react'
import type { SiteSettings } from '@/lib/payload'

export function Footer({ settings }: { settings?: SiteSettings | null }) {
  const links = settings?.footer?.links || []
  const groups = links.reduce<Record<string, typeof links>>((acc, link) => {
    const group = link.group || 'Links'
    acc[group] ||= []
    acc[group].push(link)
    return acc
  }, {})

  return (
    <FlowbiteFooter container className="rounded-none border-t border-gray-200 bg-gray-900 text-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="/" className="text-2xl font-bold text-white">
              {settings?.siteName || 'Believe'}
            </a>
            <p className="mt-4 max-w-md text-sm text-gray-400">
              {settings?.footer?.text || 'Construido con believe-web-starter y Flowbite Pro.'}
            </p>
          </div>
          {Object.entries(groups).map(([group, groupLinks]) => (
            <div key={group}>
              <FlowbiteFooter.Title title={group} className="text-white" />
              <FlowbiteFooter.LinkGroup col>
                {groupLinks.map((link) => (
                  <FlowbiteFooter.Link key={`${link.label}-${link.url}`} href={link.url} className="text-gray-400 hover:text-white">
                    {link.label}
                  </FlowbiteFooter.Link>
                ))}
              </FlowbiteFooter.LinkGroup>
            </div>
          ))}
        </div>
        <FlowbiteFooter.Divider />
        <FlowbiteFooter.Copyright by={settings?.siteName || 'Believe Global'} year={new Date().getFullYear()} className="text-gray-500" />
      </div>
    </FlowbiteFooter>
  )
}
