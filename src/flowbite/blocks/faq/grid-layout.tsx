type FaqGridItem = {
  question: string
  answer: string
}

type FaqGridLayoutProps = {
  headline?: string
  subheadline?: string
  items?: FaqGridItem[]
}

const DEFAULT_ITEMS: FaqGridItem[] = [
  { question: 'What do you mean by "Figma assets"?', answer: 'You will have access to download the full Figma project including all of the pages, the components, responsive pages, and also the icons, illustrations, and images included in the screens.' },
  { question: 'What does "lifetime access" exactly mean?', answer: 'Once you have purchased either the design, code, or both packages, you will have access to all of the future updates based on the roadmap, free of charge.' },
  { question: 'How does support work?', answer: "We're aware of the importance of well qualified support, that is why we decided that support will only be provided by the authors that actually worked on this project." },
  { question: 'I want to build more than one project with Flowbite. Is that allowed?', answer: "You can use Flowbite for an unlimited amount of projects, whether it's a personal website, a SaaS app, or a website for a client." },
  { question: 'What does "free updates" include?', answer: 'The free updates that will be provided is based on the roadmap that we have laid out for this project.' },
  { question: 'What does the free version include?', answer: 'The free version of Flowbite includes a minimal style guidelines, component variants, and a dashboard page with the mobile version alongside it.' },
  { question: 'What is the difference between Flowbite and Tailwind UI?', answer: 'Although both Flowbite and Tailwind UI are built for integration with Tailwind CSS, the main difference is in the design, the pages, the extra components and UI elements that Flowbite includes.' },
  { question: 'Can I use Flowbite in open-source projects?', answer: 'Generally, it is accepted to use Flowbite in open-source projects, as long as it is not a UI library, a theme, a template, a page-builder that would be considered as an alternative to Flowbite itself.' },
  { question: 'When will I get access to the Tailwind CSS code if I pre-ordered it?', answer: 'The official date that we have set out to release the code version of Flowbite is the 25th of September, 2021.' },
  { question: 'What is your refund policy?', answer: 'If you are unhappy with your purchase, just contact us within 30 days and we\'ll issue a full refund.' },
  { question: 'Is it allowed to use the design assets, such as the fonts, icons, and illustrations?', answer: 'What you see is what you get. Which means that all icons, fonts, and illustrations can be used based on the licensing that we researched or purchased.' },
  { question: 'Where can I access my download files?', answer: 'After you purchased one of the plans, you will get two emails: one for the invoice, and another one with the download files.' },
]

export function FAQSectionWithThreeColumns(props: FaqGridLayoutProps = {}) {
  const headline = props.headline ?? 'Frequently asked questions'
  const subheadline = props.subheadline ?? 'Ask us anything about our brand and products, and get factual responses.'
  const allItems = props.items ?? DEFAULT_ITEMS
  const third = Math.ceil(allItems.length / 3)
  const col1 = allItems.slice(0, third)
  const col2 = allItems.slice(third, third * 2)
  const col3 = allItems.slice(third * 2)

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-lg text-center">
          <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {headline}
          </h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400 lg:text-lg">
            {subheadline}
          </p>
        </div>
        <div className="grid border-t border-gray-200 pt-8 text-left dark:border-gray-700 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-16">
          <div>
            {col1.map((item, i) => (
              <div key={i} className="mb-10">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  {item.question}
                </h3>
                <p className="mb-4 text-gray-500 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
          <div>
            {col2.map((item, i) => (
              <div key={i} className="mb-10">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  {item.question}
                </h3>
                <p className="mb-4 text-gray-500 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
          <div>
            {col3.map((item, i) => (
              <div key={i} className="mb-10">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  {item.question}
                </h3>
                <p className="mb-4 text-gray-500 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSectionWithThreeColumns
