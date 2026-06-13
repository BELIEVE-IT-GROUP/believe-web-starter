type FeaturesAlternatePanel = {
  headline?: string
  description?: string
  footerText?: string
  image?: string
  items?: string[]
}

type FeaturesAlternateProps = {
  panelA?: FeaturesAlternatePanel
  panelB?: FeaturesAlternatePanel
}

const CHECKMARK_PATH = (
  <path
    fillRule="evenodd"
    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
    clipRule="evenodd"
  />
)

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="my-7 space-y-5 border-t border-gray-200 pt-8 dark:border-gray-700">
      {items.map((item, i) => (
        <li key={i} className="flex space-x-3">
          <svg className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            {CHECKMARK_PATH}
          </svg>
          <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function AlternateImageWithFeatureListSection(props: FeaturesAlternateProps = {}) {
  const panelA = props.panelA ?? {}
  const panelB = props.panelB ?? {}

  const aHeadline = panelA.headline ?? 'Work with tools you already use'
  const aDescription = panelA.description ?? 'Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease.'
  const aFooter = panelA.footerText ?? 'Deliver great service experiences fast - without the complexity of traditional ITSM solutions.'
  const aImage = panelA.image ?? 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/features/feature-office-1.png'
  const aItems = panelA.items ?? ['Continuous integration and deployment', 'Development workflow', 'Knowledge management']

  const bHeadline = panelB.headline ?? "We invest in the world's potential"
  const bDescription = panelB.description ?? 'Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease.'
  const bFooter = panelB.footerText ?? 'Deliver great service experiences fast - without the complexity of traditional ITSM solutions.'
  const bImage = panelB.image ?? 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/features/feature-office-2.png'
  const bItems = panelB.items ?? ['Dynamic reports and dashboards', 'Templates for everyone', 'Development workflow', 'Limitless business automation', 'Knowledge management']

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl space-y-12 px-4 py-8 sm:py-16 lg:space-y-20 lg:px-6">
        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
          <div className="text-gray-500 dark:text-gray-400 sm:text-lg">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {aHeadline}
            </h2>
            <p className="mb-8 lg:text-xl">{aDescription}</p>
            <CheckList items={aItems} />
            <p className="mb-8 lg:text-xl">{aFooter}</p>
          </div>
          <img
            alt=""
            src={aImage}
            className="mb-4 hidden w-full rounded-lg lg:mb-0 lg:flex"
          />
        </div>

        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
          <img
            alt=""
            src={bImage}
            className="mb-4 hidden w-full rounded-lg lg:mb-0 lg:flex"
          />
          <div className="text-gray-500 dark:text-gray-400 sm:text-lg">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {bHeadline}
            </h2>
            <p className="mb-8 lg:text-xl">{bDescription}</p>
            <CheckList items={bItems} />
            <p className="lg:text-xl">{bFooter}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AlternateImageWithFeatureListSection
