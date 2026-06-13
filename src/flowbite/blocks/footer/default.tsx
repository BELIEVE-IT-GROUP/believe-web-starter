import { Footer } from "flowbite-react";

export interface DefaultFooterProps {
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  links?: { label: string; url: string }[];
  copyright?: string;
}

const DEMO_LINKS = [
  { label: 'About', url: '#' },
  { label: 'Premium', url: '#' },
  { label: 'Campaigns', url: '#' },
  { label: 'Blog', url: '#' },
  { label: 'Affiliate Program', url: '#' },
  { label: 'FAQs', url: '#' },
  { label: 'Contact', url: '#' },
];

export function DefaultFooterSection({
  brandName = 'Flowbite',
  logoUrl = 'https://flowbite.com/docs/images/logo.svg',
  logoAlt = 'Flowbite logo',
  links = DEMO_LINKS,
  copyright = 'Flowbite. All Rights Reserved.',
}: DefaultFooterProps = {}) {
  return (
    <Footer className="rounded-none">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center p-4 text-center md:p-8 lg:p-10 [&>div]:w-fit">
        <Footer.Brand
          alt={logoAlt}
          href="/"
          name={brandName}
          src={logoUrl}
        />
        <Footer.LinkGroup className="mb-6 flex flex-wrap items-center justify-center text-base text-gray-900 dark:text-white">
          {links.map((link) => (
            <Footer.Link key={link.label} href={link.url} className="mr-4 hover:underline md:mr-6">
              {link.label}
            </Footer.Link>
          ))}
        </Footer.LinkGroup>
        <Footer.Copyright
          by={copyright}
          href="/"
          year={new Date().getFullYear()}
        />
      </div>
    </Footer>
  );
}

export default DefaultFooterSection
