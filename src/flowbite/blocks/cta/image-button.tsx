import { Button } from "flowbite-react";

type ImageWithCTAButtonSectionProps = {
  headline?: string
  description?: string
  primaryCta?: { label?: string; href?: string }
  image?: { src?: string; srcDark?: string; alt?: string }
}

export function ImageWithCTAButtonSection(props: ImageWithCTAButtonSectionProps = {}) {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl items-center gap-8 px-4 py-8 sm:py-16 md:grid md:grid-cols-2 lg:px-6 xl:gap-16">
        <img
          alt={props.image?.alt ?? ""}
          src={props.image?.src ?? "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"}
          className="w-full dark:hidden"
        />
        <img
          alt={props.image?.alt ?? ""}
          src={props.image?.srcDark ?? "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg"}
          className="hidden w-full dark:block"
        />
        <div className="mt-4 md:mt-0">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? "Let's create more tools and ideas that brings us together."}
          </h2>
          <p className="mb-6 text-gray-500 dark:text-gray-400 md:text-lg">
            {props.description ?? "Flowbite helps you connect with friends and communities of people who share your interests. Connecting with your friends and family as well as discovering new ones is easy with features like Groups."}
          </p>
          <Button
            color="info"
            href={props.primaryCta?.href ?? "#"}
            size="lg"
            className="w-fit [&>span]:items-center"
          >
            {props.primaryCta?.label ?? "Get started"}
            <svg
              className="-mr-1 ml-2 h-4 w-4"
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
        </div>
      </div>
    </section>
  );
}

export default ImageWithCTAButtonSection
