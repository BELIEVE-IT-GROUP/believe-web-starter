'use client'

import { Badge, Button, Carousel } from "flowbite-react";
import { ArrowRight, MapPin } from "flowbite-react-icons/outline";
import { Play } from "flowbite-react-icons/solid";

type StorefrontSlide = {
  bgImage: string
  badgeLabel: string
  headline: string
  description: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}

type FullSliderStorefrontHeroSectionProps = {
  slides?: StorefrontSlide[]
}

export default function FullSliderStorefrontHeroSection(props: FullSliderStorefrontHeroSectionProps = {}) {
  const {
    slides = [
      {
        bgImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-image.jpg",
        badgeLabel: "Sale",
        headline: "Save today on your new iMac computer.",
        description: "Reserve your new Apple iMac 27\" today and enjoy exclusive savings. Pre-order now to secure your discount.",
        ctaLabel: "Pre-order now",
        ctaHref: "#",
      },
      {
        bgImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/fashion-image.jpg",
        badgeLabel: "New arrival",
        headline: "New arrivals picked just for you",
        description: "Less is more never out of date.",
        ctaLabel: "Discover more",
        ctaHref: "#",
        secondaryCtaLabel: "View catalog",
        secondaryCtaHref: "#",
      },
      {
        bgImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/gaming-image.jpg",
        badgeLabel: "Offer",
        headline: "Gamers' Favorites. Best Sellers.",
        description: "The world's largest retail gaming and trade-in destination for Xbox, PlayStation, and Nintendo games, systems, consoles & accessories.",
        ctaLabel: "Find a store",
        ctaHref: "#",
      },
    ],
  } = props

  const [slide0, slide1, slide2] = slides

  return (
    <section className="bg-white antialiased">
      <div className="mx-auto max-w-screen-2xl">
        <Carousel indicators className="h-[512px] w-full [&>div]:rounded-none">
          {slide0 && (
            <div className="absolute left-1/2 top-1/2 block h-full w-full -translate-x-1/2 -translate-y-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${slide0.bgImage}')` }}>
              <div className="absolute top-1/2 z-10 w-full max-w-[512px] -translate-y-1/2 px-4 sm:left-1/2 sm:-translate-x-1/2 lg:-translate-x-8 lg:px-0">
                <a
                  href={slide0.ctaHref}
                  className="mb-5 inline-flex items-center justify-between rounded-full bg-white/10 px-1 py-1 pr-4 text-sm text-white hover:bg-white/20"
                  role="alert"
                >
                  <span className="mr-3 rounded-xl bg-white/30 px-4 py-1 text-xs font-medium">
                    {slide0.badgeLabel}
                  </span>
                  <span className="mr-1 text-sm font-medium">
                    Up to 30% OFF if you order today
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </a>
                <h2 className="mb-3 text-3xl font-extrabold leading-none text-white lg:text-5xl">
                  {slide0.headline}
                </h2>
                <p className="mb-5 text-gray-200">
                  {slide0.description}
                </p>
                <Button
                  href={slide0.ctaHref}
                  className="inline-flex [&>span]:px-5 [&>span]:py-3 [&>span]:text-base"
                >
                  {slide0.ctaLabel}
                </Button>
              </div>
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          )}
          {slide1 && (
            <div className="absolute left-1/2 top-1/2 block h-full w-full -translate-x-1/2 -translate-y-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${slide1.bgImage}')` }}>
              <div className="absolute top-1/2 z-10 w-full max-w-[512px] -translate-y-1/2 px-4 sm:right-1/2 sm:translate-x-1/2 lg:translate-x-8 lg:px-0">
                <Badge color="yellow" className="mb-5 inline-block">
                  {slide1.badgeLabel}
                </Badge>
                <h2 className="mb-3 text-3xl font-extrabold leading-none text-white lg:text-5xl">
                  {slide1.headline}
                </h2>
                <p className="mb-5 text-gray-200">
                  {slide1.description}
                </p>
                <div className="flex items-center">
                  <a
                    href={slide1.ctaHref}
                    className="me-3 inline-flex rounded-lg bg-primary-700 px-5 py-3 text-base font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                  >
                    {slide1.ctaLabel}
                  </a>
                  {slide1.secondaryCtaLabel && (
                    <a
                      href={slide1.secondaryCtaHref ?? "#"}
                      className="inline-flex items-center rounded-lg bg-white/40 px-5 py-3 text-base font-medium text-white hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-gray-300"
                    >
                      <Play className="me-1 h-6" />
                      {slide1.secondaryCtaLabel}
                    </a>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          )}
          {slide2 && (
            <div className="absolute left-1/2 top-1/2 block h-full w-full -translate-x-1/2 -translate-y-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${slide2.bgImage}')` }}>
              <div className="absolute top-1/2 z-10 w-full max-w-[512px] -translate-y-1/2 px-4 sm:left-1/2 sm:-translate-x-1/2 lg:-translate-x-8 lg:px-0">
                <a
                  href={slide2.ctaHref}
                  className="mb-5 inline-flex items-center justify-between rounded-full bg-white/10 px-1 py-1 pr-4 text-sm text-white hover:bg-white/20"
                  role="alert"
                >
                  <span className="mr-3 rounded-xl bg-white/30 px-4 py-1 text-xs font-medium">
                    {slide2.badgeLabel}
                  </span>
                  <span className="mr-1 text-sm font-medium">
                    Save $25 when you spend $250 In-Store or Online
                  </span>
                  <svg
                    className="h-5 w-5"
                    aria-hidden
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                  </svg>
                </a>
                <h2 className="mb-3 text-3xl font-extrabold leading-none text-white lg:text-5xl">
                  {slide2.headline}
                </h2>
                <p className="mb-5 text-gray-200">
                  {slide2.description}
                </p>
                <Button
                  href={slide2.ctaHref}
                  className="inline-flex [&>span]:items-center [&>span]:px-5 [&>span]:py-3 [&>span]:text-base"
                >
                  <MapPin className="me-2 h-5 w-5" />
                  {slide2.ctaLabel}
                </Button>
              </div>
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          )}
        </Carousel>
      </div>
    </section>
  );
}
