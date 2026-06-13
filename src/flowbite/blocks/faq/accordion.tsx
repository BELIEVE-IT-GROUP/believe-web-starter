'use client'

import { Accordion } from "flowbite-react";

type FaqAccordionItem = {
  question: string
  answer: string
}

type FaqAccordionProps = {
  headline?: string
  items?: FaqAccordionItem[]
}

export function FAQSectionAsAccordion(props: FaqAccordionProps = {}) {
  const defaultItems: FaqAccordionItem[] = [
    {
      question: 'Can I use Flowbite in open-source projects?',
      answer: 'Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.',
    },
    {
      question: 'Is there a Figma file available?',
      answer: 'Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.',
    },
    {
      question: 'What are the differences between Flowbite and Tailwind UI?',
      answer: 'The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product.',
    },
    {
      question: 'What about browser support?',
      answer: 'The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product.',
    },
  ]
  const headline = props.headline ?? 'Frequently asked questions'
  const items = props.items ?? defaultItems
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:mb-8 lg:text-4xl">
          {headline}
        </h2>
        <div className="mx-auto max-w-screen-md">
          <Accordion flush>
            {items.map((item, i) => (
              <Accordion.Panel key={i}>
                <Accordion.Title className="bg-transparent dark:bg-transparent">
                  {item.question}
                </Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    {item.answer}
                  </p>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQSectionAsAccordion
