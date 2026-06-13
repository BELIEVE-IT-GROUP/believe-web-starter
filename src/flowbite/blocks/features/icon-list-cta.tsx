type FeaturesIconCtaItem = { title: string; description: string }

type FeaturesIconListCtaProps = {
  headline?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  items?: FeaturesIconCtaItem[]
}

const DEFAULT_ICON_CTA_ITEMS: FeaturesIconCtaItem[] = [
  { title: 'Just the right balance for growth', description: 'Enterprise tools cost more, are difficult to use, and take longer to implement. According to G2, Flowbite is the easiest-to-use tool, with the fastest time to ROI.' },
  { title: 'Just the right balance for growth', description: 'Enterprise tools cost more, are difficult to use, and take longer to implement. According to G2, Flowbite is the easiest-to-use tool, with the fastest time to ROI.' },
]

const ICON_CTA_SVGS = [
  { bg: 'bg-primary-100 dark:bg-primary-900', color: 'text-primary-600 dark:text-primary-500', path: <><path key="a" d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path key="b" d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></> },
  { bg: 'bg-purple-100 dark:bg-purple-900', color: 'text-purple-600 dark:text-purple-500', path: <path key="c" fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" /> },
]

export function FeatureIconsAndCTASection(props: FeaturesIconListCtaProps = {}) {
  const headline = props.headline ?? 'Designed for business teams like yours'
  const description = props.description ?? 'Here we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.'
  const ctaLabel = props.ctaLabel ?? 'Learn what makes Flowbite different'
  const ctaHref = props.ctaHref ?? '#'
  const items = props.items ?? DEFAULT_ICON_CTA_ITEMS

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center sm:py-16 lg:px-6">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {headline}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 sm:text-xl lg:px-48">
          {description}
        </p>
        <div className="my-8 space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:mt-16">
          {items.map((item, i) => {
            const icon = ICON_CTA_SVGS[i % ICON_CTA_SVGS.length]
            return (
              <div key={i}>
                <div className={`mb-6 inline-flex h-24 w-24 items-center justify-center rounded-lg ${icon.bg}`}>
                  <svg
                    className={`mx-auto h-16 w-16 ${icon.color}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {icon.path}
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold dark:text-white">
                  {item.title}
                </h3>
                <p className="mb-4 text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
        <p className="text-center">
          <a
            href={ctaHref}
            className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
          >
            {ctaLabel}&nbsp;
            <svg
              className="ml-1 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </p>
      </div>
    </section>
  );
}

export default FeatureIconsAndCTASection
