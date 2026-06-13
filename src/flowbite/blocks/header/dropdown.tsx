'use client'

import { Button, Dropdown, Navbar, theme } from "flowbite-react";
import { twMerge } from "tailwind-merge";

export interface DropdownHeaderProps {
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
  { label: 'Features', href: '#' },
  { label: 'Marketplace', href: '#' },
  { label: 'Team', href: '#' },
  { label: 'Contact', href: '#' },
];

export function HeaderWithDropdownMenu({
  logoUrl = 'https://flowbite.com/docs/images/logo.svg',
  logoAlt = 'Logo',
  brandName = 'Flowbite',
  brandHref = '#',
  navLinks = DEMO_NAV_LINKS,
  primaryCta = { label: 'Sign up', href: '#' },
  secondaryCta = { label: 'Login', href: '#' },
}: DropdownHeaderProps = {}) {
  const simpleLinks = navLinks.slice(0, 3);
  const extraLinks = navLinks.slice(3);

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
          {simpleLinks.map((link, i) => (
            <Navbar.Link
              key={link.href + i}
              active={i === 0}
              href={link.href}
              className="flex h-full items-center border-b bg-transparent dark:border-gray-700 md:border-0"
            >
              {link.label}
            </Navbar.Link>
          ))}
          {extraLinks.length > 0 && (
            <Navbar.Link className="-mx-4 [&_span]:items-center">
              <Dropdown
                color="none"
                label="More"
                theme={{
                  floating: {
                    target: twMerge(
                      theme.dropdown.floating.target,
                      "w-full justify-start text-left font-normal focus:ring-0 md:font-medium [&>span]:text-base [&_span]:py-0",
                    ),
                  },
                }}
              >
                {extraLinks.map((link, i) => (
                  <a
                    key={link.href + i}
                    href={link.href}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </Dropdown>
            </Navbar.Link>
          )}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default HeaderWithDropdownMenu
