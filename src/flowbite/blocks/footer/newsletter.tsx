'use client'

import { Dropdown, Footer } from "flowbite-react";

export interface NewsletterOfficeAddress {
  city: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface NewsletterSignUpFooterProps {
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  offices?: NewsletterOfficeAddress[];
  copyright?: string;
  newsletterLabel?: string;
  newsletterPlaceholder?: string;
  newsletterButtonLabel?: string;
  onNewsletterSubmit?: (email: string) => void;
}

const DEMO_OFFICES: NewsletterOfficeAddress[] = [
  {
    city: 'New York',
    address: 'Huntersville, 957 Hill Hills Suite 491, United States',
    phone: '+12(3) 456 7890 1234',
    email: 'company@name.com',
  },
  {
    city: 'Rome',
    address: 'Piazza di Spagna, 00187 Roma RM, Italy',
    phone: '+12(3) 456 7890 1234',
    email: 'company@name.it',
  },
  {
    city: 'London',
    address: 'Fulham Rd, London SW6 1HS, United Kingdom',
    phone: '+12(3) 456 7890 1234',
    email: 'company@name.co.uk',
  },
];

export function NewsletterSignUpFooterSection({
  brandName = 'Flowbite',
  logoUrl = 'https://flowbite.com/docs/images/logo.svg',
  logoAlt = 'Flowbite logo',
  offices = DEMO_OFFICES,
  copyright = 'Flowbite. All Rights Reserved.',
  newsletterLabel = 'Sign up to our newsletter',
  newsletterPlaceholder = 'Your email',
  newsletterButtonLabel = 'Subscribe',
  onNewsletterSubmit,
}: NewsletterSignUpFooterProps = {}) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email-subscribe') as HTMLInputElement;
    if (onNewsletterSubmit && emailInput) {
      onNewsletterSubmit(emailInput.value);
    }
  }

  return (
    <Footer className="rounded-none">
      <div className="mx-auto max-w-screen-xl p-4 py-6 md:p-8 lg:p-10">
        <div className="gap-8 space-y-12 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3">
          {offices.map((office) => (
            <address key={office.city} className="not-italic">
              <p className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                {office.city}
              </p>
              <p className="mb-3 text-gray-500 dark:text-gray-400">
                {office.address}
              </p>
              <ul className="space-y-3 text-gray-500 dark:text-gray-400">
                {office.phone && (
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Office: {office.phone}
                  </li>
                )}
                {office.email && (
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Support:&nbsp;
                    <a href={'mailto:' + office.email} className="ml-2 hover:underline">
                      {office.email}
                    </a>
                  </li>
                )}
              </ul>
            </address>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-screen-md items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700 sm:flex lg:mt-16">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {newsletterLabel}
          </p>
          <form className="ml-0 mt-4 flex w-full sm:ml-5 sm:mt-0" onSubmit={handleSubmit}>
            <div className="relative w-full">
              <label
                htmlFor="email-subscribe"
                className="mb-2 hidden text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                id="email-subscribe"
                name="email-subscribe"
                className="block w-full rounded-l-lg border border-gray-300 bg-white p-3 pl-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder={newsletterPlaceholder}
                required
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer rounded-r-lg border border-primary-600 bg-primary-600 px-5 py-3 text-center text-sm text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {newsletterButtonLabel}
            </button>
          </form>
        </div>
        <Footer.Divider />
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <Footer.Brand
            alt={logoAlt}
            href="/"
            name={brandName}
            src={logoUrl}
            className="mb-4 sm:mb-4 lg:mb-0"
          />
          <Footer.Copyright
            by={copyright}
            href="/"
            year={new Date().getFullYear()}
            className="mb-2 lg:mb-0"
          />
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
                  <mask id="mask0_nl_footer" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="14">
                    <rect x="0.75" y="0.466187" width="20" height="13.3137" rx="2" fill="white" />
                  </mask>
                  <g mask="url(#mask0_nl_footer)">
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
                      id="paint0_nl_flag"
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
    </Footer>
  );
}

export default NewsletterSignUpFooterSection
