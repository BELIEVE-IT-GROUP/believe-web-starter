import { Button } from "flowbite-react";

type HeadingWithCTAButtonSectionProps = {
  headline?: string
  description?: string
  primaryCta?: { label?: string; href?: string }
}

export function HeadingWithCTAButtonSection(props: HeadingWithCTAButtonSectionProps = {}) {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="mx-auto flex max-w-screen-sm flex-col items-center text-center">
          <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? "Start your free trial today"}
          </h2>
          <p className="mb-6 text-gray-500 dark:text-gray-400 md:text-lg">
            {props.description ?? "Try Flowbite Platform for 30 days. No credit card required."}
          </p>
          <Button color="info" href={props.primaryCta?.href ?? "#"} className="w-fit">
            {props.primaryCta?.label ?? "Free trial for 30 days"}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeadingWithCTAButtonSection
