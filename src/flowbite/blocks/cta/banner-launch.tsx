'use client'

import { Banner } from "flowbite-react";
import { HiExternalLink, HiX } from "react-icons/hi";

type LaunchBannerProps = {
  brandName?: string
  brandHref?: string
  brandLogoSrc?: string
  linkLabel?: string
  linkHref?: string
}

export function LaunchBanner(props: LaunchBannerProps = {}) {
  return (
    <Banner>
      <div className="flex w-full justify-between border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800 lg:py-4">
        <div className="flex items-center md:mx-auto">
          <a
            href={props.brandHref ?? "#"}
            className="mr-3 hidden items-center text-xl font-semibold text-gray-900 dark:text-white sm:flex"
          >
            <img
              alt=""
              src={props.brandLogoSrc ?? "https://flowbite.com/docs/images/logo.svg"}
              className="mr-3"
            />
            {props.brandName ?? "Flowbite"}
          </a>
          <a
            href={props.linkHref ?? "#"}
            className="flex items-center text-sm text-primary-600 hover:underline dark:text-primary-500"
          >
            {props.linkLabel ?? "We launched Marketing UI Blocks"}
            <HiExternalLink className="ml-2" />
          </a>
        </div>
        <Banner.CollapseButton
          color="gray"
          className="border-0 bg-transparent px-0 text-gray-400 enabled:hover:bg-gray-200 enabled:hover:text-gray-900 dark:enabled:hover:bg-gray-600 dark:enabled:hover:text-white [&>span]:px-2"
        >
          <HiX className="h-5 w-5" />
        </Banner.CollapseButton>
      </div>
    </Banner>
  );
}

export default LaunchBanner
