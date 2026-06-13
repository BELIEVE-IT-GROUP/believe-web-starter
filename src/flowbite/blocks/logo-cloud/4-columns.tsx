'use client'

import { Button } from "flowbite-react";

type ClientsLogoGrid4ColumnsItem = {
  image?: { url: string }
  alt?: string
  url?: string
  description?: string
}

type ClientsLogoGrid4ColumnsProps = {
  headline?: string
  description?: string
  primaryCta?: { label?: string; href?: string }
  items?: ClientsLogoGrid4ColumnsItem[]
}

export function ClientsLogoGrid4Columns(props: ClientsLogoGrid4ColumnsProps = {}) {
  const defaultItems: ClientsLogoGrid4ColumnsItem[] = [
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/stripe.svg" }, alt: "Stripe logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/spotify.svg" }, alt: "Spotify logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/tesla.svg" }, alt: "Tesla logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/twitch.svg" }, alt: "Twitch logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/intel.svg" }, alt: "Intel logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/shell.svg" }, alt: "Shell logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/netflix.svg" }, alt: "Netflix logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/nestle.svg" }, alt: "Nestle logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/fedex.svg" }, alt: "Fedex logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/disney.svg" }, alt: "Disney logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/bmw.svg" }, alt: "BMW logo", url: "#", description: "Partner since 2015" },
    { image: { url: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/coca-cola.svg" }, alt: "Coca Cola logo", url: "#", description: "Partner since 2015" },
  ]
  const items = props.items ?? defaultItems

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {props.headline ?? "Donors, Partners & Sponsors"}
          </h2>
          <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.description ?? "Here at flowbite we focus on markets where technology, innovation, and capital can unlock long-term value."}
          </p>
          <div className="mt-4">
            <a
              href={props.primaryCta?.href ?? "#"}
              title=""
              className="inline-flex items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              {props.primaryCta?.label ?? "Become a sponsor"}
              <svg
                aria-hidden="true"
                className="ml-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 text-center sm:grid-cols-3 sm:gap-8 lg:mt-16 lg:grid-cols-4">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              {item.image?.url && (
                <img
                  className="mx-auto h-12 w-auto object-contain"
                  src={item.image.url}
                  alt={item.alt ?? "Logo"}
                />
              )}
              <p className="mt-2.5 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                {item.description ?? "Partner since 2015"}
              </p>
              <div className="mt-5">
                <Button
                  color="gray"
                  outline
                  className="dark:border-gray-600 dark:[&>span]:bg-gray-800 dark:[&>span]:text-gray-300"
                  onClick={() => item.url && window.open(item.url, "_blank")}
                >
                  <svg
                    aria-hidden="true"
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Visit website
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientsLogoGrid4Columns
