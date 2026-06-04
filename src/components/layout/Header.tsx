'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button, Navbar } from 'flowbite-react'
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
    <Navbar fluid rounded={false} className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4">
        <Navbar.Brand as={Link} href="/">
          {logo?.url ? (
            <Image src={logo.url} alt={logo.alt || siteName} width={132} height={40} className="mr-3 h-8 w-auto object-contain" />
          ) : (
            <span className="self-center whitespace-nowrap text-xl font-bold text-primary-600">
              {siteName}
            </span>
          )}
        </Navbar.Brand>
        <div className="flex md:order-2">
          {cta?.label && cta?.url && (
            <Button as={Link} href={cta.url} color="info" size="sm">
              {cta.label}
            </Button>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          {navLinks.map((link) => (
            <Navbar.Link key={`${link.label}-${link.url}`} as={Link} href={link.url} target={link.newTab ? '_blank' : undefined}>
              {link.label}
            </Navbar.Link>
          ))}
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}
