import { Avatar, Button, Rating } from "flowbite-react";

type HeroSectionWithBookCoverProps = {
  headline?: string
  headlineSpan?: string
  description?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  ratingText?: string
  ratingCount?: string
  coverImage?: string
  coverImageAlt?: string
}

export function HeroSectionWithBookCover(props: HeroSectionWithBookCoverProps = {}) {
  const {
    headline = "Designing Interfaces:",
    headlineSpan = "A User-Centered Approach",
    description = "This book covers the latest design principles and techniques, including responsive design, mobile interface design, and user research methodologies.",
    primaryCta = { label: "Buy now for $99", href: "#" },
    secondaryCta = { label: "Free preview", href: "#" },
    ratingText = "5.0",
    ratingCount = "15.7k",
    coverImage = "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/book.png",
    coverImageAlt = "Book cover",
  } = props
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="flex flex-col items-center gap-8 lg:flex-row xl:gap-16">
          <div className="text-center md:max-w-3xl lg:text-left xl:shrink-0">
            <div>
              <h2 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {headline}
                <span className="lg:block">{headlineSpan}</span>
              </h2>
              <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl md:mx-auto md:max-w-3xl">
                {description}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
              <Button size="lg" href={primaryCta.href}>{primaryCta.label}</Button>
              <Button
                size="lg"
                color="gray"
                className="[&>span]:items-center"
                outline
                href={secondaryCta.href}
              >
                {secondaryCta.label}
                <svg
                  aria-hidden="true"
                  className="-mr-1 ml-2 h-5 w-5"
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
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-5 sm:gap-6 lg:justify-start">
              <Avatar.Group className="-space-x-3">
                <Avatar
                  img="https://flowbite-react.com/images/people/profile-picture-1.jpg"
                  size="sm"
                  rounded
                />
                <Avatar
                  img="https://flowbite-react.com/images/people/profile-picture-2.jpg"
                  size="sm"
                  rounded
                />
                <Avatar
                  img="https://flowbite-react.com/images/people/profile-picture-3.jpg"
                  size="sm"
                  rounded
                />
                <Avatar
                  img="https://flowbite-react.com/images/people/profile-picture-4.jpg"
                  size="sm"
                  rounded
                />
              </Avatar.Group>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div>
                <Rating>
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <p className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                    {ratingText}
                  </p>
                </Rating>
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Rated Best Over&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {ratingCount}
                  </span>
                  &nbsp;Reviews
                </p>
              </div>
            </div>
          </div>
          <div className="max-w-md">
            <img
              className="w-auto rounded-2xl object-contain shadow-2xl"
              src={coverImage}
              alt={coverImageAlt}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSectionWithBookCover
