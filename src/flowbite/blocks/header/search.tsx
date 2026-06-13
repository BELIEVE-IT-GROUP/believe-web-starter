'use client'

import { Button, Dropdown, Label, Navbar, TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

export interface SearchHeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  brandName?: string;
  brandHref?: string;
  navLinks?: { label: string; href: string }[];
  searchPlaceholder?: string;
}

const DEMO_NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Company', href: '#' },
  { label: 'Features', href: '#' },
  { label: 'Team', href: '#' },
  { label: 'Contact', href: '#' },
];

export function HeaderWithSearchBar({
  logoUrl = 'https://flowbite.com/docs/images/logo.svg',
  logoAlt = 'Logo',
  brandName = 'Flowbite',
  brandHref = '#',
  navLinks = DEMO_NAV_LINKS,
  searchPlaceholder = 'Search',
}: SearchHeaderProps = {}) {
  return (
    <header>
      <Navbar>
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
        <div className="flex items-center lg:order-2">
          <form className="hidden md:block">
            <Label htmlFor="search-bar" className="sr-only">
              Search
            </Label>
            <TextInput
              icon={HiSearch}
              id="search-bar"
              placeholder={searchPlaceholder}
              type="search"
              className="mr-2 block [&_input]:py-2"
            />
          </form>
          <span className="pr-2">
            <Navbar.Toggle
              barIcon={HiSearch}
              theme={{
                icon: "h-5 w-5 text-gray-900 dark:text-gray-400 md:hidden",
              }}
            />
          </span>
          <span className="mx-3 hidden h-5 w-px bg-gray-200 dark:bg-gray-600 lg:ml-3 lg:inline" />
          <Dropdown
            color="gray"
            label={
              <span className="flex items-center px-0 dark:text-gray-300">
                <svg
                  aria-hidden
                  className="mr-2.5 h-4 w-4 rounded-full"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 3900 3900"
                >
                  <path fill="#b22234" d="M0 0h7410v3900H0z" />
                  <path
                    d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
                    stroke="#fff"
                    strokeWidth="300"
                  />
                  <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
                  <g fill="#fff">
                    <g id="sd">
                      <g id="sc">
                        <g id="se">
                          <g id="sb">
                            <path
                              id="sa"
                              d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
                            />
                            <use xlinkHref="#sa" y="420" />
                            <use xlinkHref="#sa" y="840" />
                            <use xlinkHref="#sa" y="1260" />
                          </g>
                          <use xlinkHref="#sa" y="1680" />
                        </g>
                        <use xlinkHref="#sb" x="247" y="210" />
                      </g>
                      <use xlinkHref="#sc" x="494" />
                    </g>
                    <use xlinkHref="#sd" x="988" />
                    <use xlinkHref="#sc" x="1976" />
                    <use xlinkHref="#se" x="2470" />
                  </g>
                </svg>
                English
              </span>
            }
            theme={{
              floating: {
                target:
                  "w-fit border-0 ring-0 [&_span]:px-2 [&_span]:text-gray-900 [&_span]:hover:text-gray-900 [&_span]:dark:text-gray-300 [&_span]:dark:hover:text-gray-300",
              },
            }}
          >
            <Dropdown.Item>
              <a
                href="#"
                className="block text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <div className="inline-flex items-center">
                  English (US)
                </div>
              </a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a
                href="#"
                className="block text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <div className="inline-flex items-center">
                  Deutsch
                </div>
              </a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a
                href="#"
                className="block text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <div className="inline-flex items-center">
                  Italiano
                </div>
              </a>
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle
            theme={{ icon: "h-5 w-5 shrink-0" }}
            className="ml-1"
          />
        </div>
        <Navbar.Collapse
          theme={{
            list: "mt-4 flex flex-col lg:mt-0 lg:flex-row lg:space-x-8 lg:text-base lg:font-medium",
          }}
          className="lg:order-1"
        >
          <form className="mb-3 flex w-full items-center gap-3 md:hidden">
            <div className="flex-1">
              <Label htmlFor="search-bar-mobile" className="sr-only">
                Search
              </Label>
              <TextInput
                icon={HiSearch}
                id="search-bar-mobile"
                placeholder="Search for anything..."
                type="search"
                className="py-1.5"
              />
            </div>
            <Button type="submit">
              <HiSearch className="mr-2 h-5 w-5 text-gray-100" />
              Search
            </Button>
          </form>
          {navLinks.map((link, i) => (
            <Navbar.Link
              key={link.href + i}
              active={i === 0}
              href={link.href}
              className="border-b border-gray-100 bg-transparent text-primary-700 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 md:border-0"
            >
              {link.label}
            </Navbar.Link>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default HeaderWithSearchBar
