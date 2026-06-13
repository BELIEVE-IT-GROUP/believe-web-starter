import { Button, Card, Progress } from "flowbite-react";

type FundraisingCard = {
  imageSrc?: string
  imageAlt?: string
  amountRaised?: string
  goal?: string
  donors?: string
  progress?: number
  title?: string
  description?: string
  donateCta?: { label?: string; href?: string }
  shareCta?: { label?: string; href?: string }
}

type TwoCardsAndImagesCTASectionProps = {
  headline?: string
  description?: string
  viewAllLabel?: string
  viewAllHref?: string
  card1?: FundraisingCard
  card2?: FundraisingCard
}

export function TwoCardsAndImagesCTASection(props: TwoCardsAndImagesCTASectionProps = {}) {
  const c1 = props.card1 ?? {}
  const c2 = props.card2 ?? {}
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {props.headline ?? "Fundraising events"}
          </h2>
          <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            {props.description ?? "Flowbite helps you connect with friends, family and communities of people who share your interests."}
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-12">
          <Card>
            <img
              alt={c1.imageAlt ?? ""}
              src={c1.imageSrc ?? "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/fundraising-1.png"}
              className="w-full rounded-lg object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {c1.amountRaised ?? "$376,856"}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {c1.goal ?? "of 400k goal"}
                  </span>
                </div>
                <span className="text-right text-xs font-normal text-gray-500 dark:text-gray-400">
                  {c1.donors ?? "2,756 donors"}
                </span>
              </div>
              <Progress progress={c1.progress ?? 85} className="mt-1" />
            </div>
            <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
              {c1.title ?? "Thank you for supporting in planting trees work."}
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              {c1.description ?? "Our fundraisers are a creative bunch when it comes to taking on challenges, from beard shaves and bake sales to stand-up comedy and streaming marathons. There is something for everyone."}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row lg:items-center">
              <Button
                color="info"
                href={c1.donateCta?.href ?? "#"}
                className="[&>span]:px-5 [&>span]:py-2.5"
              >
                {c1.donateCta?.label ?? "Donate now"}
              </Button>
              <Button
                color="gray"
                href={c1.shareCta?.href ?? "#"}
                className="border-gray-300 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-white [&>span]:px-5 [&>span]:py-2.5"
              >
                <svg
                  aria-hidden="true"
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                {c1.shareCta?.label ?? "Share this Fundraiser"}
              </Button>
            </div>
          </Card>
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800 lg:p-8">
            <img
              className="w-full rounded-lg object-cover shadow-lg"
              src={c2.imageSrc ?? "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/fundraising-2.png"}
              alt={c2.imageAlt ?? ""}
            />
            <div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {c2.amountRaised ?? "$75,856"}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {c2.goal ?? "of 150k goal"}
                  </span>
                </div>
                <span className="text-right text-xs font-normal text-gray-500 dark:text-gray-400">
                  {c2.donors ?? "568 donors"}
                </span>
              </div>
              <Progress progress={c2.progress ?? 50} className="mt-1" />
            </div>
            <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
              {c2.title ?? "Thank you for supporting our lifesaving work."}
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              {c2.description ?? "Our fundraisers are a creative bunch when it comes to taking on challenges, from beard shaves and bake sales to stand-up comedy and streaming marathons. There is something for everyone."}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row lg:items-center">
              <Button
                color="info"
                href={c2.donateCta?.href ?? "#"}
                className="[&>span]:px-5 [&>span]:py-2.5"
              >
                {c2.donateCta?.label ?? "Donate now"}
              </Button>
              <Button
                color="gray"
                href={c2.shareCta?.href ?? "#"}
                className="border-gray-300 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-white [&>span]:px-5 [&>span]:py-2.5"
              >
                <svg
                  aria-hidden="true"
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                {c2.shareCta?.label ?? "Share this Fundraiser"}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <a
            href={props.viewAllHref ?? "#"}
            title=""
            className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            {props.viewAllLabel ?? "View all fundraising events"}
            <svg
              aria-hidden="true"
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default TwoCardsAndImagesCTASection
