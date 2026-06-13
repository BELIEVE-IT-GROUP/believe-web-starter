type FeaturesIconsListGroup = { title: string; subItems: string[] }

type FeaturesIconsListProps = {
  headline?: string
  description?: string
  groups?: FeaturesIconsListGroup[]
}

const DEFAULT_ICONS_LIST_GROUPS: FeaturesIconsListGroup[] = [
  { title: 'Project Management', subItems: ['Unified Contribution Graph', 'Org activity graph', 'Org dependency insights', 'Milestones', 'Repo insights'] },
  { title: 'Collaborative Coding', subItems: ['Dynamic reports and dashboards', 'Code review assignments', 'Team discussions', 'Protected branches', 'Draft pull requests'] },
  { title: 'Enterprise Security', subItems: ['Required reviews', 'Dependabot security and', 'Dependency graph', 'GitHub Advisory Database', 'GPG commit signing verification'] },
]

const ICONS_LIST_GROUP_ICONS = [
  { iconColor: 'text-primary-600 dark:text-primary-300', bulletColor: 'text-primary-600 dark:text-primary-500', bgColor: 'bg-purple-100 dark:bg-purple-900', path: <path key="0" fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" /> },
  { iconColor: 'text-purple-600 dark:text-purple-300', bulletColor: 'text-purple-600 dark:text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900', path: <path key="1" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /> },
  { iconColor: 'text-teal-600 dark:text-teal-300', bulletColor: 'text-teal-500 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900', path: <><path key="2a" fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path key="2b" d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></> },
]

const CHECKMARK_ICONS_LIST = (
  <path
    fillRule="evenodd"
    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
    clipRule="evenodd"
  />
)

export function FeatureListWithIconsSection(props: FeaturesIconsListProps = {}) {
  const headline = props.headline ?? 'Secure platform, secure data'
  const description = props.description ?? 'Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.'
  const groups = props.groups ?? DEFAULT_ICONS_LIST_GROUPS

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="mb-8 max-w-screen-md lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {headline}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
            {description}
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 lg:grid-cols-3 xl:gap-12">
          {groups.map((group, gi) => {
            const icon = ICONS_LIST_GROUP_ICONS[gi % ICONS_LIST_GROUP_ICONS.length]
            return (
              <div key={gi}>
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded ${icon.bgColor} lg:h-16 lg:w-16`}>
                  <svg
                    className={`h-5 w-5 ${icon.iconColor} lg:h-8 lg:w-8`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {icon.path}
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  {group.title}
                </h3>
                <ul className="my-6 space-y-4 lg:mb-0">
                  {group.subItems.map((sub, si) => (
                    <li key={si} className="flex space-x-2.5">
                      <svg
                        className={`h-5 w-5 shrink-0 ${icon.bulletColor}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {CHECKMARK_ICONS_LIST}
                      </svg>
                      <span className="leading-tight text-gray-500 dark:text-gray-400">
                        {sub}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default FeatureListWithIconsSection
