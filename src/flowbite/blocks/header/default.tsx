'use client'

import { Button, Navbar } from "flowbite-react";

export interface DefaultHeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  brandName?: string;
  brandHref?: string;
  navLinks?: { label: string; href: string }[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const DEMO_NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Company', href: '#' },
  { label: 'Marketplace', href: '#' },
  { label: 'Features', href: '#' },
  { label: 'Team', href: '#' },
  { label: 'Contact', href: '#' },
];

export function DefaultHeaderNavigation({
  logoUrl = 'https://flowbite.com/docs/images/logo.svg',
  logoAlt = 'Logo',
  brandName = 'Flowbite',
  brandHref = '#',
  navLinks = DEMO_NAV_LINKS,
  primaryCta = { label: 'Get started', href: '#' },
  secondaryCta = { label: 'Log in', href: '#' },
}: DefaultHeaderProps = {}) {
  return (
    <header>
      <Navbar fluid>
        <Navbar.Brand href={brandHref}>
          <img
            src={logoUrl}
            className="mr-3 h-6 sm:h-9"
            alt={logoAlt}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            {brandName}
          </span>
        </Navbar.Brand>
        <div className="flex items-center gap-3 lg:order-2">
          <Button
            color="gray"
            href={secondaryCta.href}
            className="border-0 hover:bg-gray-50 focus:outline-none focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            {secondaryCta.label}
          </Button>
          <Button color="info" href={primaryCta.href}>
            {primaryCta.label}
          </Button>
          <Navbar.Toggle theme={{ icon: "h-5 w-5 shrink-0" }} />
        </div>
        <Navbar.Collapse
          theme={{
            list: "mt-4 flex flex-col lg:mt-0 lg:flex-row lg:space-x-8 lg:text-base lg:font-medium",
          }}
          className="lg:order-1"
        >
          {navLinks.map((link, i) => (
            <Navbar.Link
              key={link.href + i}
              active={i === 0}
              href={link.href}
              className="rounded-lg"
            >
              {link.label}
            </Navbar.Link>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default DefaultHeaderNavigation
