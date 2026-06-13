import { Button } from "flowbite-react";

type VisualImageWithHeadingHeroProps = {
  headline?: string
  description?: string
  primaryCta?: string
  primaryCtaHref?: string
  secondaryCta?: string
  mockupImage?: string
  mockupImageAlt?: string
}

export function VisualImageWithHeadingHero(props: VisualImageWithHeadingHeroProps = {}) {
  const {
    headline = "Payments tool for software companies",
    description = "From checkout to global sales tax compliance, companies around the world use Flowbite to simplify their payment stack.",
    primaryCta = "Get started",
    primaryCtaHref = "#",
    secondaryCta = "Speak to Sales",
    mockupImage = "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png",
    mockupImageAlt = "mockup",
  } = props
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
            {headline}
          </h1>
          <p className="mb-6 max-w-2xl text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
            {description}
          </p>
          <div className="flex w-fit items-center gap-5">
            <Button
              color="info"
              href={primaryCtaHref}
              size="lg"
              className="[&>span]:items-center"
            >
              {primaryCta}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button color="gray" outline size="lg">
              {secondaryCta}
            </Button>
          </div>
        </div>
        <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
          <img
            src={mockupImage}
            alt={mockupImageAlt}
          />
        </div>
      </div>
    </section>
  );
}

export default VisualImageWithHeadingHero
