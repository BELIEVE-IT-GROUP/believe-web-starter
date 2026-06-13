'use client'

import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Label,
  Radio,
  theme,
} from "flowbite-react";
import { twMerge } from "tailwind-merge";

type CustomerServiceFaqItem = {
  question: string
  author?: string
  date?: string
  answer: string
  yesCount?: number
  noCount?: number
}

type CustomerServiceFaqProps = {
  headline?: string
  items?: CustomerServiceFaqItem[]
  ctaText?: string
  ctaHref?: string
}

const DEFAULT_ITEMS: CustomerServiceFaqItem[] = [
  {
    question: 'What is an iMac, and how does it differ from other computers?',
    author: 'Flowbite Shop',
    date: 'November 20 2023 - 12:45',
    answer: 'The iMac is a line of all-in-one desktop computers designed and produced by Apple Inc. It sets itself apart by integrating the display, processing unit, and other components into a single sleek enclosure, minimizing cable clutter and providing a seamless user experience.',
    yesCount: 9,
    noCount: 0,
  },
  {
    question: 'What are the key features of the latest iMac models?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'Apple has transitioned its Mac lineup from Intel processors to custom-designed Apple Silicon chips. The latest iMac models might feature the latest iterations of these chips, offering improved performance and efficiency.',
    yesCount: 16,
    noCount: 3,
  },
  {
    question: 'What is the Retina display on an iMac, and why is it significant?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'iMacs typically feature high-resolution Retina displays with vibrant colors and excellent contrast. The latest models might offer improvements in display technology for even better image quality.',
    yesCount: 16,
    noCount: 3,
  },
  {
    question: 'How is the performance of an iMac for tasks like video editing, graphic design, and gaming?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'Apple has transitioned its Mac lineup from Intel processors to custom-designed Apple Silicon chips, offering improved performance and efficiency for demanding workloads.',
    yesCount: 16,
    noCount: 3,
  },
  {
    question: 'Can I upgrade the components of my iMac, such as RAM or storage?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'Apple often focuses on making its products thinner and lighter. Recent iMac models might feature a slimmer profile compared to their predecessors.',
    yesCount: 16,
    noCount: 3,
  },
  {
    question: 'What is the role of Thunderbolt ports on an iMac?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'iMacs typically feature high-resolution Retina displays with vibrant colors and excellent contrast. The latest models might offer improvements in display technology for even better image quality.',
    yesCount: 16,
    noCount: 3,
  },
  {
    question: 'How does the macOS operating system differ from Windows?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'Apple has transitioned its Mac lineup from Intel processors to custom-designed Apple Silicon chips. The latest iMac models might feature the latest iterations of these chips, offering improved performance and efficiency.',
    yesCount: 16,
    noCount: 3,
  },
  {
    question: 'What security features does the iMac offer?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'Apple often focuses on making its products thinner and lighter. Recent iMac models might feature a slimmer profile compared to their predecessors.',
    yesCount: 16,
    noCount: 3,
  },
  {
    question: 'Can I use my iMac with other Apple devices, such as iPhone and iPad?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'iMacs typically feature high-resolution Retina displays with vibrant colors and excellent contrast. The latest models might offer improvements in display technology for even better image quality.',
    yesCount: 16,
    noCount: 3,
  },
  {
    question: 'What support options are available for iMac users?',
    author: 'Flowbite Experts',
    date: 'November 20 2023 - 12:45',
    answer: 'Apple has transitioned its Mac lineup from Intel processors to custom-designed Apple Silicon chips. The latest iMac models might feature the latest iterations of these chips, offering improved performance and efficiency.',
    yesCount: 16,
    noCount: 3,
  },
]

const titleTheme = {
  base: twMerge(theme.accordion.title.base, "px-0 text-lg font-bold"),
  open: {
    on: twMerge(theme.accordion.title.open.on, "bg-transparent dark:bg-transparent"),
  },
}

export default function CustomerServiceAccordionWithFAQ(props: CustomerServiceFaqProps = {}) {
  const headline = props.headline ?? 'General questions'
  const items = props.items ?? DEFAULT_ITEMS
  const ctaText = props.ctaText ?? "Didn't find the answer?"
  const ctaHref = props.ctaHref ?? '#'

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl space-y-6 px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          {headline}
        </h2>
        <Accordion flush className="mt-6">
          {items.map((item, i) => (
            <AccordionPanel key={i}>
              <AccordionTitle theme={titleTheme}>
                {item.question}
              </AccordionTitle>
              <AccordionContent className="space-y-3 px-0">
                {(item.author || item.date) && (
                  <div className="flex items-center gap-3">
                    {item.author && (
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {item.author}
                      </h3>
                    )}
                    {item.date && (
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {item.date}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  {item.answer}
                </p>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Was it helpful to you?
                  </p>
                  <div className="flex items-center">
                    <Radio id={`faq-yes-${i}`} name={`faq-radio-${i}`} />
                    <Label
                      htmlFor={`faq-yes-${i}`}
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Yes{item.yesCount !== undefined ? `: ${item.yesCount}` : ''}
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Radio id={`faq-no-${i}`} name={`faq-radio-${i}`} />
                    <Label
                      htmlFor={`faq-no-${i}`}
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      No{item.noCount !== undefined ? `: ${item.noCount}` : ''}
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>
          ))}
        </Accordion>
        <div className="mt-6 sm:mt-8">
          <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
            {ctaText}&nbsp;
            <a
              href={ctaHref}
              className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
            >
              Ask a question
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
