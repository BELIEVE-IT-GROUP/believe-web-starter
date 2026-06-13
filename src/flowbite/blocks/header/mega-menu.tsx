'use client'

import { Dropdown, Label, MegaMenu, Navbar, TextInput } from "flowbite-react";

export interface MegaMenuHeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  brandName?: string;
  brandHref?: string;
  navLinks?: { label: string; href: string }[];
  loginLabel?: string;
  loginHref?: string;
  socialLinks?: { platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok'; url: string }[];
}

const DEMO_NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Company', href: '#' },
  { label: 'Marketplace', href: '#' },
  { label: 'Resources', href: '#' },
  { label: 'Contact', href: '#' },
];

const DEMO_SOCIAL: NonNullable<MegaMenuHeaderProps['socialLinks']> = [
  { platform: 'facebook', url: '#' },
  { platform: 'instagram', url: '#' },
  { platform: 'twitter', url: '#' },
  { platform: 'tiktok', url: '#' },
];

function SocialIcon({ platform }: { platform: string }) {
  if (platform === 'facebook') {
    return (
      <svg className="h-4 w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
      </svg>
    );
  }
  if (platform === 'instagram') {
    return (
      <svg className="h-4 w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
      </svg>
    );
  }
  if (platform === 'twitter') {
    return (
      <svg className="h-4 w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
      </svg>
    );
  }
  // tiktok
  return (
    <svg className="h-4 w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  );
}

export function MegaMenuHeader({
  logoUrl = 'https://flowbite.com/docs/images/logo.svg',
  logoAlt = 'Logo',
  brandName = 'Flowbite',
  brandHref = '#',
  navLinks = DEMO_NAV_LINKS,
  loginLabel = 'Login',
  loginHref = '#',
  socialLinks = DEMO_SOCIAL,
}: MegaMenuHeaderProps = {}) {
  const simpleLinks = navLinks.slice(0, 1);
  const extraLinks = navLinks.slice(1);

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
          <Dropdown
            color="gray"
            theme={{
              arrowIcon: "ml-2 hidden h-4 w-4 md:inline",
              floating: {
                target:
                  "w-fit border-0 ring-0 [&_span]:px-2 [&_span]:text-gray-900 [&_span]:hover:text-gray-900 [&_span]:dark:text-gray-300 [&_span]:dark:hover:text-gray-300",
              },
            }}
            className="[&_span]:hover:text-gray-900"
            label={
              <span className="flex items-center px-0 dark:text-gray-300">
                English
              </span>
            }
          >
            <Dropdown.Item>
              <a href="#" className="block text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                <div className="inline-flex items-center">English (US)</div>
              </a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a href="#" className="block text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                <div className="inline-flex items-center">Deutsch</div>
              </a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a href="#" className="block text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                <div className="inline-flex items-center">Italiano</div>
              </a>
            </Dropdown.Item>
          </Dropdown>
          <a
            href={loginHref}
            className="ml-3 text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            {loginLabel}
          </a>
          <span className="ml-2 mr-0 h-5 w-px bg-gray-200 dark:bg-gray-600 lg:ml-5 lg:mr-3 lg:inline"></span>
          {socialLinks.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <span className="sr-only">{s.platform}</span>
              <SocialIcon platform={s.platform} />
            </a>
          ))}
        </div>
      </Navbar>
      <MegaMenu className="border-y border-gray-200 p-0 dark:border-gray-600 dark:bg-gray-800 sm:p-0">
        <div className="w-full px-2 dark:bg-gray-700">
          <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center justify-between py-3 sm:px-6 md:grid-cols-2 md:px-4 xl:px-0">
            <Navbar.Collapse>
              {simpleLinks.map((link, i) => (
                <Navbar.Link
                  key={link.href + i}
                  active={i === 0}
                  href={link.href}
                  className="dark:text-white md:dark:hover:text-primary-500"
                >
                  {link.label}
                </Navbar.Link>
              ))}
              {extraLinks.length > 0 && (
                <Navbar.Link className="[&_span]:hover:text-primary-600 [&_span]:dark:hover:text-primary-500">
                  <MegaMenu.DropdownToggle>
                    {extraLinks[0].label}
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </MegaMenu.DropdownToggle>
                </Navbar.Link>
              )}
              {extraLinks.slice(1).map((link, i) => (
                <Navbar.Link
                  key={link.href + i}
                  href={link.href}
                  className="dark:text-white dark:hover:text-primary-500"
                >
                  {link.label}
                </Navbar.Link>
              ))}
            </Navbar.Collapse>
            <form className="mb-4 flex md:order-2 md:mb-0">
              <Label
                htmlFor="search-dropdown"
                className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Your Email
              </Label>
              <Dropdown
                label="All categories"
                className="[&>span]:items-center"
                theme={{
                  floating: {
                    target:
                      "hidden w-44 flex-shrink-0 justify-center rounded-r-none border border-r-0 border-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 md:block [&>span]:justify-center",
                  },
                  content: "py-1 focus:outline-none",
                }}
              >
                <Dropdown.Item>Mockups</Dropdown.Item>
                <Dropdown.Item>Templates</Dropdown.Item>
                <Dropdown.Item>Design</Dropdown.Item>
                <Dropdown.Item>Logos</Dropdown.Item>
              </Dropdown>
              <div className="relative w-full">
                <TextInput
                  type="search"
                  id="search-dropdown"
                  placeholder="Search anything..."
                  required
                  className="[&_input]:dark:bg-gray-800 md:[&_input]:rounded-l-none"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 rounded-r-lg border-0 border-primary-700 bg-primary-700 p-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </form>
            <div className="flex items-center gap-5 md:hidden">
              {simpleLinks.map((link, i) => (
                <a
                  key={link.href + i}
                  href={link.href}
                  className="text-sm hover:underline focus:underline dark:text-white"
                >
                  {link.label}
                </a>
              ))}
              {extraLinks.length > 0 && (
                <a className="hover:underline focus:underline dark:text-white">
                  <MegaMenu.DropdownToggle className="dark:!text-white">
                    {extraLinks[0].label}
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </MegaMenu.DropdownToggle>
                </a>
              )}
              {extraLinks.length > 1 && (
                <a
                  href={extraLinks[1].href}
                  className="text-sm hover:underline focus:underline dark:text-white"
                >
                  {extraLinks[1].label}
                </a>
              )}
            </div>
          </div>
        </div>
        <MegaMenu.Dropdown>
          <div className="mx-auto grid border-t px-0 py-4 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white md:grid-cols-2 md:px-2 lg:grid-cols-4 lg:px-4 xl:px-20">
            <ul className="col-span-2 md:col-span-1">
              {[
                { title: 'Online Stores', desc: "Connect with third-party tools that you're already using." },
                { title: 'Segmentation', desc: "Connect with third-party tools that you're already using." },
                { title: 'Marketing CRM', desc: "Connect with third-party tools that you're already using." },
              ].map((item) => (
                <li key={item.title}>
                  <a
                    href="#"
                    className="flex rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="mr-2 h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="col-span-2 md:col-span-1">
              {[
                { title: 'Audience Management', desc: "Connect with third-party tools that you're already using." },
                { title: 'Creative Tools', desc: "Connect with third-party tools that you're already using." },
                { title: 'Marketing Automation', desc: "Connect with third-party tools that you're already using." },
              ].map((item) => (
                <li key={item.title}>
                  <a
                    href="#"
                    className="flex rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="mr-2 h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="hidden lg:block">
              {[
                { title: 'Dynamic Content', desc: "Connect with third-party tools that you're already using." },
                { title: 'Integrations', desc: "Connect with third-party tools that you're already using." },
                { title: 'Careers', desc: "Connect with third-party tools that you're already using." },
              ].map((item) => (
                <li key={item.title}>
                  <a
                    href="#"
                    className="flex rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="mr-2 h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <div className="col-span-2 p-4 lg:col-span-1">
              <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Our brands
              </h2>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                At {brandName}, we pride ourselves on a portfolio of brands that
                cater to a variety of preferences.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-400"
              >
                Explore our brands{" "}
                <svg
                  className="ml-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </MegaMenu.Dropdown>
      </MegaMenu>
    </header>
  );
}

export default MegaMenuHeader
