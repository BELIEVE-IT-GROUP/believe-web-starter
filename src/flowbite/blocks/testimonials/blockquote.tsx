import { Avatar } from "flowbite-react";

type BlockquoteTestimonialProps = {
  headline?: string
  items?: Array<{
    quote?: string
    name?: string
    author?: string
    role?: string
    company?: string
    avatar?: { url: string }
    photo?: { url: string; alt?: string }
  }>
}

export function BlockquoteTestimonial(props: BlockquoteTestimonialProps = {}) {
  const item = props.items?.[0]
  const quote = item?.quote ?? 'Flowbite is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application.'
  const name = item?.name ?? item?.author ?? 'Micheal Gough'
  const role = item?.role ?? 'CEO'
  const company = item?.company ?? 'Google'
  const roleLabel = company ? `${role} at ${company}` : role
  const avatarUrl = item?.photo?.url ?? item?.avatar?.url ?? 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png'

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-6 lg:py-16">
        <svg
          className="mx-auto mb-3 h-12 text-gray-400 dark:text-gray-600"
          viewBox="0 0 24 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
            fill="currentColor"
          />
        </svg>
        <blockquote>
          <p className="mb-6 text-2xl font-medium text-gray-900 dark:text-white">
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>
        <Avatar
          img={avatarUrl}
          rounded
          size="xs"
        >
          <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
            <div className="pr-3 font-medium text-gray-900 dark:text-white">
              {name}
            </div>
            <div className="pl-3 text-sm text-gray-500 dark:text-gray-400">
              {roleLabel}
            </div>
          </div>
        </Avatar>
      </div>
    </section>
  );
}

export default BlockquoteTestimonial
