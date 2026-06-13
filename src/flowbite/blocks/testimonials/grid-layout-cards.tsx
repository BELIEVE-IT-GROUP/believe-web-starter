import { Avatar } from "flowbite-react";

type GridTestimonialItem = {
  quote?: string
  title?: string
  name?: string
  author?: string
  role?: string
  company?: string
  avatar?: { url: string }
  photo?: { url: string; alt?: string }
}

type GridLayoutTestimonialCardsProps = {
  headline?: string
  subheadline?: string
  description?: string
  items?: GridTestimonialItem[]
}

const DEMO_ITEMS: GridTestimonialItem[] = [
  { title: 'Solid foundation for any project', quote: '"This is a very complex and beautiful set of elements. Under the hood it comes with the best things from 2 different worlds: Figma and Tailwind."', name: 'Bonnie Green', role: 'CTO', company: 'Open AI', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png' } },
  { title: 'A must-have for designers', quote: '"This is a very complex and beautiful set of elements. Under the hood it comes with the best things from 2 different worlds: Figma and Tailwind."', name: 'Lana Byrd', role: 'Software Engineer', company: 'Tesla', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png' } },
  { title: 'Speechless with how easy this was to integrate', quote: '"I recently got my hands on Flowbite Pro, and holy crap, I\'m speechless with how easy this was to integrate within my application. Most templates are a pain, code is scattered, and near impossible to theme."', name: 'Jese Leos', role: 'CEO', company: 'Oracle', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png' } },
  { title: 'Efficient Collaborating', quote: '"Flowbite is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application."', name: 'Joseph McFall', role: 'Junior Designer', company: 'Adobe', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png' } },
  { title: 'Mindblowing workflow and variants', quote: '"Flowbite provides a robust set of design tokens and components based on the popular Tailwind CSS framework. From the most used UI components like forms and navigation bars to the whole app screens designed both for desktop and mobile, this UI kit provides a solid foundation for any project."', name: 'Helene Engels', role: 'CFO', company: 'Microsoft', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png' } },
  { title: 'Perfect choice for a SaaS application', quote: '"Flowbite provides a robust set of design tokens and components based on the popular Tailwind CSS framework. From the most used UI components like forms and navigation bars to the whole app screens designed both for desktop and mobile, this UI kit provides a solid foundation for any project."', name: 'Leslie Livingston', role: 'Creative Director', company: 'Apple', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png' } },
  { title: 'Solid foundation for any project', quote: '"I recently got my hands on Flowbite Pro, and holy crap, I\'m speechless with how easy this was to integrate within my application. Most templates are a pain, code is scattered, and near impossible to theme."', name: 'Michael Gough', role: 'Front-end engineer', company: 'Meta', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png' } },
  { title: 'Mindblowing workflow and variants', quote: '"Flowbite is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application."', name: 'Neil Sims', role: 'Software architect', company: 'Amazon', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png' } },
  { title: 'Speechless with how easy this was to integrate', quote: '"This is a very complex and beautiful set of elements. Under the hood it comes with the best things from 2 different worlds: Figma and Tailwind."', name: 'Robert Brown', role: 'Junior developer', company: 'SAP', avatar: { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/robert-brown.png' } },
]

function TestimonialFigure({ item }: { item: GridTestimonialItem }) {
  const name = item.name ?? item.author ?? ''
  const role = item.role ?? ''
  const company = item.company ?? ''
  const roleLabel = company ? `${role} at ${company}` : role
  const avatarUrl = item.photo?.url ?? item.avatar?.url ?? ''
  const title = (item as any).title ?? ''
  const quote = item.quote ?? ''

  return (
    <figure className="rounded bg-gray-50 p-6 dark:bg-gray-800">
      <blockquote className="text-sm text-gray-500 dark:text-gray-400">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        <p className="my-4">{quote}</p>
      </blockquote>
      <figcaption className="flex items-center space-x-3">
        <Avatar img={avatarUrl} rounded size="sm">
          <div className="space-y-0.5 font-medium dark:text-white">
            <div>{name}</div>
            {roleLabel && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {roleLabel}
              </div>
            )}
          </div>
        </Avatar>
      </figcaption>
    </figure>
  )
}

export function GridLayoutTestimonialCards(props: GridLayoutTestimonialCardsProps = {}) {
  const headline = props.headline ?? 'Testimonials'
  const description = props.description ?? props.subheadline ?? 'Explore the whole collection of open-source web components and elements built with the utility classes from Tailwind'
  const items = props.items && props.items.length > 0 ? props.items : DEMO_ITEMS

  // Distribute items across 3 columns in round-robin order
  const col1 = items.filter((_, i) => i % 3 === 0)
  const col2 = items.filter((_, i) => i % 3 === 1)
  const col3 = items.filter((_, i) => i % 3 === 2)

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-md text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {headline}
          </h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
            {description}
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            {col1.map((item, i) => <TestimonialFigure key={i} item={item} />)}
          </div>
          <div className="space-y-6">
            {col2.map((item, i) => <TestimonialFigure key={i} item={item} />)}
          </div>
          <div className="space-y-6">
            {col3.map((item, i) => <TestimonialFigure key={i} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GridLayoutTestimonialCards
