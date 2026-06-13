'use client'

import { Dropdown, Navbar } from "flowbite-react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export interface SubNavbarHeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  brandName?: string;
  brandHref?: string;
  navLinks?: { label: string; href: string }[];
  phone?: string;
  contactLabel?: string;
  contactHref?: string;
  loginLabel?: string;
  loginHref?: string;
}

const DEMO_NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Company', href: '#' },
  { label: 'Team', href: '#' },
  { label: 'Features', href: '#' },
  { label: 'Marketplace', href: '#' },
  { label: 'Resources', href: '#' },
  { label: 'Forum', href: '#' },
  { label: 'Support', href: '#' },
];

const MOBILE_VISIBLE = 4;

export function HeaderWithSubNavbar({
  logoUrl = 'https://flowbite.com/docs/images/logo.svg',
  logoAlt = 'Logo',
  brandName = 'Flowbite',
  brandHref = '#',
  navLinks = DEMO_NAV_LINKS,
  phone = 'tel:5541251234',
  contactLabel = 'Contact us',
  contactHref = '#',
  loginLabel = 'Login',
  loginHref = '#',
}: SubNavbarHeaderProps = {}) {
  const mobileVisible = navLinks.slice(0, MOBILE_VISIBLE);
  const mobileOverflow = navLinks.slice(MOBILE_VISIBLE);

  return (
    <header>
      <Navbar className="dark:bg-gray-800">
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
        <div className="flex items-center">
          <a
            href={phone}
            className="mr-6 hidden text-sm font-medium text-gray-900 hover:underline dark:text-white sm:inline"
          >
            {phone.replace('tel:', '')}
          </a>
          <a
            href={contactHref}
            className="text-sm font-medium text-primary-600 hover:underline dark:text-white sm:mr-6"
          >
            {contactLabel}
          </a>
          <a
            href={loginHref}
            className="hidden text-sm font-medium text-primary-600 hover:underline dark:text-white sm:inline"
          >
            {loginLabel}
          </a>
        </div>
      </Navbar>
      <Navbar className="bg-gray-50 py-3 dark:bg-gray-700">
        <Navbar.Collapse>
          {navLinks.map((link, i) => (
            <Navbar.Link
              key={link.href + i}
              href={link.href}
              className="hover:text-gray-900 hover:underline dark:text-white md:hover:text-gray-900"
            >
              {link.label}
            </Navbar.Link>
          ))}
        </Navbar.Collapse>
        <div className="flex items-center gap-5 lg:hidden">
          {mobileVisible.map((link, i) => (
            <a
              key={link.href + i}
              href={link.href}
              className="text-sm hover:underline focus:underline dark:text-white"
            >
              {link.label}
            </a>
          ))}
          {mobileOverflow.length > 0 && (
            <Dropdown
              arrowIcon={false}
              color="none"
              label={<HiOutlineDotsHorizontal className="h-5 w-5" />}
              theme={{
                floating: {
                  target: "w-fit items-center p-0 dark:text-white [&>span]:p-1",
                },
              }}
              className="[&_span]:py-0"
            >
              {mobileOverflow.map((link, i) => (
                <Dropdown.Item key={link.href + i}>{link.label}</Dropdown.Item>
              ))}
            </Dropdown>
          )}
        </div>
      </Navbar>
    </header>
  );
}

export default HeaderWithSubNavbar
