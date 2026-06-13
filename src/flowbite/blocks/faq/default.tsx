type FaqDefaultItem = {
  question: string
  answer: string
}

type FaqDefaultProps = {
  headline?: string
  items?: FaqDefaultItem[]
}

const DEFAULT_ITEMS: FaqDefaultItem[] = [
  { question: 'What do you mean by "Figma assets"?', answer: 'You will have access to download the full Figma project including all of the pages, the components, responsive pages, and also the icons, illustrations, and images included in the screens.' },
  { question: 'What does "lifetime access" exactly mean?', answer: 'Once you have purchased either the design, code, or both packages, you will have access to all of the future updates based on the roadmap, free of charge.' },
  { question: 'How does support work?', answer: "We're aware of the importance of well qualified support, that is why we decided that support will only be provided by the authors that actually worked on this project." },
  { question: 'I want to build more than one project. Is that allowed?', answer: "You can use Windster for an unlimited amount of projects, whether it's a personal website, a SaaS app, or a website for a client." },
  { question: 'What does "free updates" include?', answer: 'The free updates that will be provided is based on the roadmap that we have laid out for this project.' },
  { question: 'What does the free version include?', answer: 'The free version of Windster includes a minimal style guidelines, component variants, and a dashboard page with the mobile version alongside it.' },
  { question: 'What is the difference between Windster and Tailwind UI?', answer: 'Although both Windster and Tailwind UI are built for integration with Tailwind CSS, the main difference is in the design, the pages, the extra components and UI elements that Windster includes.' },
  { question: 'Can I use Windster in open-source projects?', answer: 'Generally, it is accepted to use Windster in open-source projects, as long as it is not a UI library, a theme, a template, a page-builder that would be considered as an alternative to Windster itself.' },
]

export function DefaultFAQSection(props: FaqDefaultProps = {}) {
  const headline = props.headline ?? 'Frequently asked questions'
  const allItems = props.items ?? DEFAULT_ITEMS
  const half = Math.ceil(allItems.length / 2)
  const itemsLeft = allItems.slice(0, half)
  const itemsRight = allItems.slice(half)

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {headline}
        </h2>
        <div className="grid border-t border-gray-200 pt-8 text-left dark:border-gray-700 md:grid-cols-2 md:gap-16">
          <div>
            {itemsLeft.map((item, i) => (
              <div key={i} className="mb-10">
                <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                  <svg
                    aria-hidden
                    className="mr-2 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item.question}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
          <div>
            {itemsRight.map((item, i) => (
              <div key={i} className="mb-10">
                <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                  <svg
                    aria-hidden
                    className="mr-2 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item.question}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DefaultFAQSection
