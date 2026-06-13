type FeaturesImageListItem = {
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  accentClasses?: string
}

type FeaturesImageListProps = {
  headline?: string
  description?: string
  image?: string
  footerText?: string
  items?: FeaturesImageListItem[]
}

const DEFAULT_IMAGE_LIST_ITEMS: FeaturesImageListItem[] = [
  { title: 'Private repos', description: "Host code that you don't want to share with the world in private GitHub repos only accessible to you and people you share them with.", ctaLabel: 'Learn more', ctaHref: '#', accentClasses: 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 link-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-600' },
  { title: 'Dependency graph', description: 'See the packages your project depends on, the repositories that depend on them, and any vulnerabilities detected.', ctaLabel: 'Learn more', ctaHref: '#', accentClasses: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 link-purple-600 hover:text-purple-800 dark:text-purple-500 dark:hover:text-purple-600' },
  { title: 'Code scanning', description: 'Find vulnerabilities in custom code using static analysis. Prevent new vulnerabilities from being introduced by scanning every pull request.', ctaLabel: 'Learn more', ctaHref: '#', accentClasses: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 link-teal-600 hover:text-teal-800 dark:text-teal-500 dark:hover:text-teal-600' },
]

const IMAGE_LIST_ICON_PATHS = [
  <path key="0" fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />,
  <path key="1" fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />,
  <path key="2" fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />,
]

// accent token extraction helper
function extractBgColor(accentClasses: string) {
  return accentClasses.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('dark:bg-')).join(' ')
}
function extractIconColor(accentClasses: string) {
  const parts = accentClasses.split(' ')
  // first text-* and dark:text-* classes
  const textClasses = parts.filter(c => (c.startsWith('text-') || c.startsWith('dark:text-')) && !c.includes('primary-5') && !c.includes('purple-5') && !c.includes('teal-5'))
  return textClasses.slice(0, 2).join(' ')
}
function extractLinkColor(accentClasses: string) {
  return accentClasses.split(' ').filter(c => c.startsWith('link-') || c.startsWith('hover:') || (c.startsWith('dark:') && c.includes('hover'))).join(' ').replace(/link-/g, 'text-')
}

export function ImageWithFeatureListAndCTAsSection(props: FeaturesImageListProps = {}) {
  const headline = props.headline ?? 'Designed for business teams'
  const description = props.description ?? 'Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease.'
  const image = props.image ?? 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/features/feature-office-long.png'
  const footerText = props.footerText ?? 'Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease.'
  const items = props.items ?? DEFAULT_IMAGE_LIST_ITEMS

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl items-center gap-8 px-4 py-8 sm:py-16 lg:grid lg:grid-cols-2 lg:px-6 xl:gap-16 ">
        <img
          alt=""
          src={image}
          className="mb-4 w-full rounded-lg lg:mb-0"
        />
        <div className="text-gray-500 dark:text-gray-400 sm:text-lg">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {headline}
          </h2>
          <p className="mb-8 lg:text-xl">{description}</p>
          <div className="mb-6 border-y border-gray-200 py-8 dark:border-gray-700">
            {items.map((item, i) => {
              const accent = item.accentClasses ?? DEFAULT_IMAGE_LIST_ITEMS[i % DEFAULT_IMAGE_LIST_ITEMS.length].accentClasses ?? ''
              const bgColor = extractBgColor(accent)
              const iconColor = extractIconColor(accent)
              const linkColor = extractLinkColor(accent)
              return (
                <div key={i} className={i > 0 ? 'flex pt-8' : 'flex'}>
                  <div className={`mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bgColor}`}>
                    <svg
                      className={`h-5 w-5 ${iconColor}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {IMAGE_LIST_ICON_PATHS[i % IMAGE_LIST_ICON_PATHS.length]}
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                    {item.ctaLabel && (
                      <a
                        href={item.ctaHref ?? '#'}
                        className={`inline-flex items-center ${linkColor}`}
                      >
                        {item.ctaLabel}
                        <svg
                          className="ml-1 h-6 w-6"
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
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-sm">{footerText}</p>
        </div>
      </div>
    </section>
  );
}

export default ImageWithFeatureListAndCTAsSection
