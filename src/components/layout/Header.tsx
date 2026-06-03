import Link from 'next/link'
import { getTenant, getAllPages } from '@/lib/payload'

export async function Header() {
  const tenant = await getTenant()
  const pages = await getAllPages()

  const navPages = pages
    .filter((p: any) => p.slug !== 'home')
    .slice(0, 4)

  const defaultNav = [
    { slug: 'blog', title: 'Blog' },
    { slug: 'contacto', title: 'Contacto' },
  ]

  const navItems = navPages.length > 0
    ? navPages.map((p: any) => ({ slug: p.slug, title: p.title }))
    : defaultNav

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-primary-600">
          {tenant?.name || 'Believe'}
        </Link>
        <div className="hidden items-center gap-6 font-medium text-gray-600 md:flex">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          {navItems.map((item) => (
            <Link key={item.slug} href={`/${item.slug}`} className="hover:text-primary-600">
              {item.title}
            </Link>
          ))}
        </div>
        <Link
          href="/contacto"
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Contacto
        </Link>
      </nav>
    </header>
  )
}
