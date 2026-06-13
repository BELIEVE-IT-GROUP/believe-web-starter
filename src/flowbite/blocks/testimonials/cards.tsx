import { Avatar, Button, Card } from "flowbite-react";

type TestimonialItem = {
  rating?: number
  quote?: string
  title?: string
  name?: string
  author?: string
  role?: string
  company?: string
  avatar?: { url: string }
  photo?: { url: string; alt?: string }
}

type TestimonialCardsProps = {
  headline?: string
  subheadline?: string
  description?: string
  primaryCta?: { label?: string; href?: string }
  items?: TestimonialItem[]
}

const DEMO_ITEMS: Required<TestimonialItem>[] = [
  {
    title: 'Speechless with how easy this was to integrate',
    quote: "I recently got my hands on Flowbite Pro, and holy crap, I'm speechless with how easy this was to integrate within my application. Most templates are a pain, code is scattered, and near impossible to theme. Flowbite has code in one place and I'm not joking when I say it took me a matter of minutes to copy the code, customise it and integrate within a Laravel + Vue application. If you care for your time, I hands down would go with this.",
    name: 'Bonnie Green',
    author: 'Bonnie Green',
    role: 'Developer',
    company: 'Open AI',
    avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png' },
    photo: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png', alt: 'Bonnie Green' },
    rating: 0,
  },
  {
    title: 'Solid foundation for any project',
    quote: "Flowbite provides a robust set of design tokens and components based on the popular Tailwind CSS framework. From the most used UI components like forms and navigation bars to the whole app screens designed both for desktop and mobile, this UI kit provides a solid foundation for any project. Designing with Figma components that can be easily translated to the utility classes of Tailwind CSS is a huge timesaver!",
    name: 'Roberta Casas',
    author: 'Roberta Casas',
    role: 'Lead designer',
    company: 'Dropbox',
    avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png' },
    photo: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png', alt: 'Roberta Casas' },
    rating: 0,
  },
  {
    title: 'Mindblowing workflow and variants',
    quote: "As someone who mainly designs in the browser, I've been a casual user of Figma, but as soon as I saw and started playing with Flowbite my mind was blown. Everything is so well structured and simple to use (I've learnt so much about Figma by just using the toolkit). Aesthetically, the well designed components are beautiful and will undoubtedly level up your next application.",
    name: 'Jese Leos',
    author: 'Jese Leos',
    role: 'Software Engineer',
    company: 'Facebook',
    avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png' },
    photo: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png', alt: 'Jese Leos' },
    rating: 0,
  },
  {
    title: 'Efficient Collaborating',
    quote: "This is a very complex and beautiful set of elements. Under the hood it comes with the best things from 2 different worlds: Figma and Tailwind. You have many examples that can be used to create a fast prototype for your team.",
    name: 'Joseph McFall',
    author: 'Joseph McFall',
    role: 'CTO',
    company: 'Google',
    avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png' },
    photo: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png', alt: 'Joseph McFall' },
    rating: 0,
  },
]

const CARD_CLASSES = [
  "flex flex-col items-center justify-center rounded-none border-0 border-b border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-800 md:border-r md:p-8",
  "flex flex-col items-center justify-center rounded-none border-0 border-b border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-800 md:p-8",
  "flex flex-col items-center justify-center rounded-none border-0 border-b border-gray-200 bg-gray-50 p-3 text-center shadow-none dark:border-gray-700 dark:bg-gray-800 md:border-b-0 md:border-r md:p-8",
  "flex flex-col items-center justify-center rounded-none border-0 border-gray-200 bg-gray-50 p-3 text-center shadow-none dark:border-gray-700 dark:bg-gray-800 md:p-8",
]

export function TestimonialCards(props: TestimonialCardsProps = {}) {
  const headline = props.headline ?? 'Testimonials'
  const description = props.description ?? props.subheadline ?? 'Explore the whole collection of open-source web components and elements built with the utility classes from Tailwind'
  const ctaLabel = props.primaryCta?.label ?? 'Show more...'
  const items = props.items && props.items.length > 0 ? props.items : DEMO_ITEMS

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {headline}
          </h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
            {description}
          </p>
        </div>
        <div className="mb-8 grid lg:mb-12 lg:grid-cols-2">
          {items.slice(0, 4).map((item, i) => {
            const name = item.name ?? item.author ?? DEMO_ITEMS[i]?.name ?? 'Cliente'
            const role = item.role ?? DEMO_ITEMS[i]?.role ?? ''
            const company = item.company ?? DEMO_ITEMS[i]?.company ?? ''
            const roleLabel = company ? `${role} at ${company}` : role
            const avatarUrl = item.photo?.url ?? item.avatar?.url ?? DEMO_ITEMS[i]?.avatar?.url ?? ''
            const title = (item as any).title ?? DEMO_ITEMS[i]?.title ?? ''
            const quote = item.quote ?? DEMO_ITEMS[i]?.quote ?? ''
            const cardClass = CARD_CLASSES[i] ?? CARD_CLASSES[3]

            return (
              <Card key={i} className={cardClass}>
                <blockquote className="mx-auto mb-8 max-w-2xl text-gray-500 dark:text-gray-400">
                  {title && (
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h3>
                  )}
                  <p className="my-4">&ldquo;{quote}&rdquo;</p>
                </blockquote>
                <Avatar img={avatarUrl} rounded>
                  <div className="space-y-0.5 text-left font-medium dark:text-white">
                    <div>{name}</div>
                    {roleLabel && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {roleLabel}
                      </div>
                    )}
                  </div>
                </Avatar>
              </Card>
            )
          })}
        </div>
        <div className="flex w-full justify-center">
          <Button color="gray" outline>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TestimonialCards
