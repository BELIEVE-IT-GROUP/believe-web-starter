'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from 'flowbite-react'
import type { SiteSettings } from '@/lib/payload'

export function Header({ settings }: { settings?: SiteSettings | null }) {
  const navLinks = settings?.header?.navLinks?.length
    ? settings.header.navLinks
    : [
        { label: 'Home', url: '/' },
        { label: 'Blog', url: '/blog' },
      ]
  const cta = settings?.header?.cta
  const logo = settings?.header?.logo
  const siteName = settings?.siteName || 'Believe'

  return (
    <Navbar fluid rounded={false} className="sticky top-0 z-50 border-b border-ink-900/10 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 py-1">
        <Navbar.Brand as={Link} href="/">
          {logo?.url ? (
            <Image src={logo.url} alt={logo.alt || siteName} width={132} height={40} className="mr-3 h-8 w-auto object-contain" />
          ) : (
            <span
              className="self-center whitespace-nowrap text-xl font-semibold tracking-tight"
              style={{ color: 'var(--color-primary, #0c3bb9)', fontFamily: 'var(--font-display)' }}
              aria-label={siteName}
            >
              {siteName}
            </span>
          )}
        </Navbar.Brand>
        <div className="flex items-center gap-2 md:order-2">
          {cta?.label && cta?.url && (
            <Link
              href={cta.url}
              className="rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-primary, #0c3bb9)', color: 'var(--brand-paper, #fff)' }}
            >
              {cta.label}
            </Link>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          {navLinks.map((link) => (
            <Navbar.Link
              key={`${link.label}-${link.url}`}
              as={Link}
              href={link.url}
              target={link.newTab ? '_blank' : undefined}
              className="text-ink-700 md:text-[15px]"
            >
              {link.label}
            </Navbar.Link>
          ))}
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}
