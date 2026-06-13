import { Card } from "flowbite-react";

type GridCard = {
  imageLight: string
  imageDark: string
  imageAlt: string
  headline: string
  href: string
}

type WideCard = {
  imageLight: string
  imageDark: string
  imageAlt: string
  headline: string
  href: string
  ctaLabel: string
  imageLeft?: boolean
}

type StorefrontHeroSectionCategoriesGridViewProps = {
  topCards?: GridCard[]
  wideCards?: WideCard[]
}

export default function StorefrontHeroSectionCategoriesGridView(props: StorefrontHeroSectionCategoriesGridViewProps = {}) {
  const {
    topCards = [
      {
        imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-back.svg",
        imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-back-dark.svg",
        imageAlt: "imac",
        headline: "Enhance your study habits with iMac",
        href: "#",
      },
      {
        imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/xbox-controller.svg",
        imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/xbox-controller-dark.svg",
        imageAlt: "xbox controller",
        headline: "Mind-blowing savings on gaming",
        href: "#",
      },
      {
        imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-components.svg",
        imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-components-dark.svg",
        imageAlt: "pc components",
        headline: "Computer Peripherals for your upgrade",
        href: "#",
      },
      {
        imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-keyboard.svg",
        imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-keyboard-dark.svg",
        imageAlt: "ipad",
        headline: "Discover the best Echo devices",
        href: "#",
      },
    ],
    wideCards = [
      {
        imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg",
        imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-dark.svg",
        imageAlt: "iphone",
        headline: "Trending gadgets to make it feel like home",
        href: "#",
        ctaLabel: "See more gaming",
        imageLeft: true,
      },
      {
        imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-side.svg",
        imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-side-dark.svg",
        imageAlt: "ps5 console",
        headline: "Browse our Consoles range for best deals",
        href: "#",
        ctaLabel: "Shop gadgets",
        imageLeft: false,
      },
      {
        imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg",
        imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg",
        imageAlt: "watch",
        headline: "Watches you've never seen before",
        href: "#",
        ctaLabel: "See more watches",
        imageLeft: true,
      },
      {
        imageLight: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-light.svg",
        imageDark: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-dark.svg",
        imageAlt: "ipad",
        headline: "Your guide to the top tablets on the market",
        href: "#",
        ctaLabel: "See tablets deals",
        imageLeft: false,
      },
    ],
  } = props
  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto grid max-w-screen-xl gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-0">
        {topCards.map((card, i) => (
          <Card key={i} className="shadow-none">
            <a href={card.href}>
              <img
                className="mx-auto mb-4 h-44 dark:hidden md:mb-6"
                src={card.imageLight}
                alt={card.imageAlt}
              />
              <img
                className="mx-auto mb-4 hidden h-44 dark:block md:mb-6"
                src={card.imageDark}
                alt={`${card.imageAlt} dark`}
              />
            </a>
            <h2 className="mt-2 text-center text-xl font-bold leading-tight text-gray-900 hover:underline dark:text-white lg:mt-0 lg:text-left lg:text-2xl">
              <a href={card.href}>{card.headline}</a>
            </h2>
          </Card>
        ))}
        {wideCards.map((card, i) => (
          <Card key={i} className="shadow-none lg:col-span-2 [&>div]:items-center [&>div]:gap-8 lg:[&>div]:flex-row">
            {card.imageLeft ? (
              <>
                <a className="w-full" href={card.href}>
                  <img className="mx-auto h-56 dark:hidden lg:mt-0" src={card.imageLight} alt={card.imageAlt} />
                  <img className="mx-auto mt-6 hidden h-56 dark:block lg:mt-0" src={card.imageDark} alt={`${card.imageAlt} dark`} />
                </a>
                <div className="w-full text-center lg:text-left">
                  <h2 className="text-center text-xl font-bold leading-tight text-gray-900 hover:underline dark:text-white lg:mt-0 lg:text-left lg:text-2xl">
                    <a href={card.href}>{card.headline}</a>
                  </h2>
                  <a href={card.href} type="button" className="mt-4 inline-block rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                    {card.ctaLabel}
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="order-2 w-full text-center lg:order-1 lg:text-left">
                  <h2 className="text-center text-xl font-bold leading-tight text-gray-900 hover:underline dark:text-white lg:mt-0 lg:text-left lg:text-2xl">
                    <a href={card.href}>{card.headline}</a>
                  </h2>
                  <a href={card.href} type="button" className="mt-4 inline-block rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                    {card.ctaLabel}
                  </a>
                </div>
                <a className="order-1 w-full lg:order-2" href={card.href}>
                  <img className="mx-auto h-56 dark:hidden lg:mb-0" src={card.imageLight} alt={card.imageAlt} />
                  <img className="mx-auto mb-6 hidden h-56 dark:block lg:mb-0" src={card.imageDark} alt={`${card.imageAlt} dark`} />
                </a>
              </>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
