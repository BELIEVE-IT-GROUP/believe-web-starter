import { Label, TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

type HelpCenterLink = {
  label: string
  href: string
}

type HelpCenterCategory = {
  title: string
  links: HelpCenterLink[]
}

type HelpCenterSearchProps = {
  headline?: string
  subheadline?: string
  searchPlaceholder?: string
  searchNote?: string
  categories?: HelpCenterCategory[]
}

const DEFAULT_CATEGORIES: HelpCenterCategory[] = [
  {
    title: 'General',
    links: [
      { label: 'How to update', href: '#' },
      { label: 'How to change the language', href: '#' },
      { label: 'About forwarding limits', href: '#' },
      { label: 'How to update Flowbite', href: '#' },
    ],
  },
  {
    title: 'Android',
    links: [
      { label: 'Verifying your number', href: '#' },
      { label: 'How to restore your chat history', href: '#' },
      { label: 'How to manage your notifications', href: '#' },
      { label: 'Account & Profile', href: '#' },
    ],
  },
  {
    title: 'Iphone',
    links: [
      { label: 'How to restore your chat history', href: '#' },
      { label: 'How to use status', href: '#' },
      { label: 'How to manage your notifications', href: '#' },
      { label: "Can't log out", href: '#' },
    ],
  },
  {
    title: 'Web & Desktop',
    links: [
      { label: 'About WhatsApp Web and Desktop', href: '#' },
      { label: 'How to log in or out', href: '#' },
      { label: 'How to manage your notifications', href: '#' },
      { label: 'How to update Flowbite', href: '#' },
    ],
  },
]

export function SearchBarWithLinksFAQSection(props: HelpCenterSearchProps = {}) {
  const headline = props.headline ?? 'How can we help you?'
  const subheadline = props.subheadline ?? "Here are a few of the questions we get the most. If you don't see what's on your mind, reach out to us anytime on phone, chat, or email."
  const searchPlaceholder = props.searchPlaceholder ?? 'Type keywords to find answers'
  const searchNote = props.searchNote ?? 'You can also browse the topics below to find what you are looking for.'
  const categories = props.categories ?? DEFAULT_CATEGORIES

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {headline}
          </h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400 sm:text-xl">
            {subheadline}
          </p>
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <TextInput
            icon={HiSearch}
            id="search"
            placeholder={searchPlaceholder}
            className="[&_input]:py-4 [&_input]:text-base [&_svg]:h-6 [&_svg]:w-6"
          />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {searchNote}
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, i) => (
            <div key={i}>
              <h3 className="mb-4 text-xl font-bold dark:text-white">{cat.title}</h3>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                {cat.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href} className="hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SearchBarWithLinksFAQSection
