'use client'

import { Avatar, Tabs } from "flowbite-react";

type TabTestimonialItem = {
  quote?: string
  title?: string
  body?: string
  name?: string
  author?: string
  role?: string
  company?: string
  avatar?: { url: string }
  photo?: { url: string; alt?: string }
}

type TestimonialTabsProps = {
  headline?: string
  items?: TabTestimonialItem[]
}

const DEMO_ITEMS: TabTestimonialItem[] = [
  {
    name: 'Michael Gough',
    role: 'Web developer',
    company: 'Google',
    avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png' },
    title: 'It was a great experience!',
    quote: 'Flowbite is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application.',
    body: 'There is absolutely no doubt in my mind that without Flowbite, I would not have been able to make the jump to Ueno, a digital agency I started in 2014. The work I got through Flowbite made it possible for me to have something to build on. We now have about 45 people on our team, a lot of whom we found and recruited through Flowbite.',
  },
  {
    name: 'Bonnie Green',
    role: 'CEO',
    company: 'Facebook',
    avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png' },
    title: 'Best product!',
    quote: 'Flowbite is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application.',
    body: 'I would not have been able to make the jump to Ueno, a digital agency I started in 2014. The work I got through Flowbite made it possible for me to have something to build on. We now have about 45 people on our team, a lot of whom we found and recruited through Flowbite.',
  },
  {
    name: 'Lana Byrd',
    role: 'CTO',
    company: 'Microsoft',
    avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/lana-byrd.png' },
    title: 'Great design!',
    quote: 'Flowbite is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application.',
    body: 'There is absolutely no doubt in my mind that without Flowbite, I would not have been able to make the jump to Ueno, a digital agency I started in 2014. The work I got through Flowbite made it possible for me to have something to build on. We now have about 45 people on our team, a lot of whom we found and recruited through Flowbite.',
  },
]

const QuoteIcon = () => (
  <svg
    className="mb-3 h-8 text-gray-500 dark:text-gray-600"
    viewBox="0 0 24 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
      fill="currentColor"
    />
  </svg>
)

export function TestimonialTabs(props: TestimonialTabsProps = {}) {
  const items = props.items && props.items.length > 0 ? props.items : DEMO_ITEMS

  return (
    <Tabs
      variant="pills"
      theme={{
        base: "mx-auto max-w-screen-xl gap-16 px-4 py-8 lg:grid lg:grid-cols-[300px_1fr] lg:px-6 lg:py-16",
        tablist: {
          base: "mb-3 block space-y-4 sm:flex sm:space-y-0 lg:block lg:space-y-4",
          variant: {
            pills:
              "flex-wrap text-sm font-medium text-gray-500 dark:text-gray-400",
          },
          tabitem: {
            base: "w-full rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:text-gray-400 dark:focus:ring-gray-700 disabled:dark:text-gray-500",
            variant: {
              pills: {
                active: {
                  on: "rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800",
                  off: "rounded-lg text-gray-800 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
                },
              },
            },
          },
        },
        tabpanel: "p-4",
      }}
    >
      {items.map((item, i) => {
        const name = item.name ?? item.author ?? ''
        const role = item.role ?? ''
        const company = item.company ?? ''
        const roleLabel = company ? `${role} at ${company}` : role
        const avatarUrl = item.photo?.url ?? item.avatar?.url ?? ''
        const title = (item as any).title ?? ''
        const quote = item.quote ?? ''
        const body = (item as any).body ?? ''

        return (
          <Tabs.Item
            key={i}
            active={i === 0}
            title={
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  {avatarUrl && (
                    <Avatar img={avatarUrl} rounded size="xs" />
                  )}
                  <p className="text-xl font-bold dark:text-white">{name}</p>
                </div>
                {roleLabel && (
                  <p className="text-gray-500 dark:text-gray-400">{roleLabel}</p>
                )}
              </div>
            }
          >
            <QuoteIcon />
            {title && (
              <h3 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {quote && (
              <p className="mb-3 text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                {quote}
              </p>
            )}
            {body && (
              <p className="text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                {body}
              </p>
            )}
          </Tabs.Item>
        )
      })}
    </Tabs>
  );
}

export default TestimonialTabs
