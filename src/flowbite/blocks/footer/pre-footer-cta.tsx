'use client'

import { Dropdown } from "flowbite-react";

export interface PreFooterCTAProps {
  headline?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  columns?: { title: string; links: { label: string; url: string }[] }[];
  brandName?: string;
  copyright?: string;
  copyrightUrl?: string;
}

const DEMO_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About', url: '#' },
      { label: 'Careers', url: '#' },
      { label: 'Brand Center', url: '#' },
      { label: 'Blog', url: '#' },
    ],
  },
  {
    title: 'Help center',
    links: [
      { label: 'Discord Server', url: '#' },
      { label: 'Twitter', url: '#' },
      { label: 'Facebook', url: '#' },
      { label: 'Contact Us', url: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', url: '#' },
      { label: 'Licensing', url: '#' },
      { label: 'Terms', url: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', url: '#' },
      { label: 'Careers', url: '#' },
      { label: 'Brand Center', url: '#' },
      { label: 'Blog', url: '#' },
    ],
  },
  {
    title: 'Download',
    links: [
      { label: 'iOS', url: '#' },
      { label: 'Android', url: '#' },
      { label: 'Windows', url: '#' },
      { label: 'MacOS', url: '#' },
    ],
  },
];

export function PreFooterCTASection({
  headline = 'Feel connected anytime, anywhere.',
  primaryCtaLabel = 'Receive News',
  primaryCtaUrl = '#',
  secondaryCtaLabel = 'Contact us',
  secondaryCtaUrl = '#',
  columns = DEMO_COLUMNS,
  brandName = 'Flowbite',
  copyright = 'Flowbite',
  copyrightUrl = '#',
}: PreFooterCTAProps = {}) {
  return (
    <footer className="rounded-none bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl p-4 sm:p-8 lg:p-10">
        <p className="text-center text-3xl font-bold leading-tight dark:text-white">
          {headline}
        </p>
        <div className="my-6 flex items-center justify-center">
          <a
            href={primaryCtaUrl}
            className="mb-2 mr-2 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            {primaryCtaLabel}
          </a>
          <a
            href={secondaryCtaUrl}
            className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            {secondaryCtaLabel}
          </a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:mt-16 sm:grid-cols-3 sm:space-y-0 lg:grid-cols-5">
          {columns.map((col, idx) => (
            <div key={col.title + idx}>
              <h3 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                {col.title}
              </h3>
              <ul className="text-gray-500 dark:text-gray-400">
                {col.links.map((link) => (
                  <li key={link.label} className="mb-4">
                    <a href={link.url} className="hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <div className="flex flex-col items-center justify-between text-center lg:flex-row">
          <a
            href="/"
            className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white lg:mb-0"
          >
            {brandName}
          </a>
          <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400 lg:mb-0">
            &copy; {new Date().getFullYear()}&nbsp;
            <a href={copyrightUrl} className="hover:underline">
              {copyright}
            </a>
            . All Rights Reserved.
          </span>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <span className="inline-flex cursor-pointer items-center justify-center rounded p-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 21 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="0.75" y="0.466187" width="20" height="13.3137" rx="2" fill="white" />
                  <mask id="mask0_pf_cta" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="14">
                    <rect x="0.75" y="0.466187" width="20" height="13.3137" rx="2" fill="white" />
                  </mask>
                  <g mask="url(#mask0_pf_cta)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20.75 0.466187H0.75V1.35377H20.75V0.466187ZM20.75 2.24134H0.75V3.12892H20.75V2.24134ZM0.75 4.0165H20.75V4.90408H0.75V4.0165ZM20.75 5.79166H0.75V6.67924H20.75V5.79166ZM0.75 7.56682H20.75V8.4544H0.75V7.56682ZM20.75 9.34198H0.75V10.2296H20.75V9.34198ZM0.75 11.1171H20.75V12.0047H0.75V11.1171ZM20.75 12.8923H0.75V13.7799H20.75V12.8923Z"
                      fill="#D02F44"
                    />
                    <rect x="0.75" y="0.466187" width="8.57143" height="6.21305" fill="#46467F" />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_pf_flag"
                      x1="1.70239"
                      y1="1.35376"
                      x2="1.70239"
                      y2="5.79166"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#F0F0F0" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>English (US)</span>
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            }
          >
            <Dropdown.Item>English</Dropdown.Item>
            <Dropdown.Item>German</Dropdown.Item>
            <Dropdown.Item>Italian</Dropdown.Item>
            <Dropdown.Item>Spanish</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </footer>
  );
}

export default PreFooterCTASection
