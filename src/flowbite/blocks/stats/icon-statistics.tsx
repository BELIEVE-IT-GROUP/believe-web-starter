// Icon SVG paths are kept as fixed structural elements (decorative icons).
// Items map value+label to stat cards; links map label+href to CTA links.
type StatsIconItem = { value: string; label: string; description?: string }
type StatsIconLink = { label: string; href: string }

type StatsIconStatisticsProps = {
  eyebrow?: string
  headline?: string
  subheadline?: string
  links?: StatsIconLink[]
  items?: StatsIconItem[]
}

const DEFAULT_ITEMS: StatsIconItem[] = [
  { value: '99.99% uptime', label: 'For Flowbite, with zero maintenance downtime' },
  { value: '600M+ Users', label: 'Trusted by over 600 milion users around the world' },
  { value: '100+ countries', label: 'Have used Flowbite to create functional websites' },
  { value: '5+ Million', label: 'Transactions per day' },
]

const DEFAULT_LINKS: StatsIconLink[] = [
  { label: 'Explore Legality Guide', href: '#' },
  { label: 'Visit the Trust Center', href: '#' },
]

const ARROW_SVG = (
  <svg aria-hidden className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

// Fixed icon set (structural decoration) — one per item slot, cycling if more items provided
const ICON_PATHS = [
  <path key="0" fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />,
  <path key="1" d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />,
  <path key="2" fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />,
  <path key="3" d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
]

export function StatisticsWithIconsAndCTASocialProof(props: StatsIconStatisticsProps = {}) {
  const eyebrow = props.eyebrow ?? 'Trusted Worldwide'
  const headline = props.headline ?? 'Trusted by over 600 million users and 10,000 teams'
  const subheadline = props.subheadline ?? 'Our rigorous security and compliance standards are at the heart of all we do. We work tirelessly to protect you and your customers.'
  const links = props.links ?? DEFAULT_LINKS
  const items = props.items ?? DEFAULT_ITEMS
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl items-center px-4 py-8 lg:grid lg:grid-cols-4 lg:gap-16 lg:px-6 lg:py-16 xl:gap-24">
        <div className="col-span-2 mb-8">
          <p className="text-lg font-medium text-primary-600 dark:text-primary-500">
            {eyebrow}
          </p>
          <h2 className="mb-4 mt-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            {headline}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
            {subheadline}
          </p>
          <div className="mt-6 space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            {links.map((link, i) => (
              <div key={i}>
                <a href={link.href} className="inline-flex items-center text-base font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">
                  {link.label}
                  {ARROW_SVG}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
          {items.map((item, i) => (
            <div key={i}>
              <svg aria-hidden className="mb-2 h-10 w-10 text-primary-600 dark:text-primary-500 md:h-12 md:w-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                {ICON_PATHS[i % ICON_PATHS.length]}
              </svg>
              <h3 className="mb-2 text-2xl font-bold dark:text-white">
                {item.value}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatisticsWithIconsAndCTASocialProof
