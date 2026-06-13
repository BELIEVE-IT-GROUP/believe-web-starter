import { Badge } from "flowbite-react";

type BlogPost = { badge: string; title: string; titleHref: string; description: string; readMoreHref: string }
type FeaturedPost = { image: string; badge: string; title: string; titleHref: string; authorAvatar: string; authorName: string; postedOn: string; description: string; readMoreHref: string }

type BlogPostsWithFeaturedImageHeroProps = {
  featuredPost?: FeaturedPost
  sidePosts?: BlogPost[]
}

export function BlogPostsWithFeaturedImageHero(props: BlogPostsWithFeaturedImageHeroProps = {}) {
  const {
    featuredPost = {
      image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/blog-featured.png",
      badge: "Programming",
      title: "Releasing code in large corporations is slow - and there is a good reason for it",
      titleHref: "#",
      authorAvatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png",
      authorName: "Michael Gough",
      postedOn: "Posted on Jan 31",
      description: "One of the things I always loved about the web is its immediacy. You write a piece of code, publish it somewhere and people can access it.",
      readMoreHref: "#",
    },
    sidePosts = [
      { badge: "Tutorial", title: "How to rank higher on Google (6 easy steps)", titleHref: "#", description: "Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.", readMoreHref: "#" },
      { badge: "Interview", title: "How to schedule your tweets to send later", titleHref: "#", description: "Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even.", readMoreHref: "#" },
      { badge: "Marketing", title: "12 SEO best practices that everyone should follow", titleHref: "#", description: "Static websites are now used to bootstrap lots of websites and are becoming the basis.", readMoreHref: "#" },
    ],
  } = props
  const sidePostColors = ["indigo", "failure", "success"] as const
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
          <article>
            <a href={featuredPost.titleHref} title="">
              <img
                className="w-full rounded-lg object-cover"
                src={featuredPost.image}
                alt=""
              />
            </a>
            <div className="mt-5 space-y-3">
              <Badge className="w-fit px-3">
                <svg
                  aria-hidden="true"
                  className="mr-1 h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {featuredPost.badge}
              </Badge>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                <a href={featuredPost.titleHref} className="hover:underline" title="">
                  {featuredPost.title}
                </a>
              </h2>
              <div className="flex items-center gap-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={featuredPost.authorAvatar}
                  alt=""
                />
                <div className="font-medium leading-tight text-gray-900 dark:text-white">
                  <div>{featuredPost.authorName}</div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {featuredPost.postedOn}
                  </div>
                </div>
              </div>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                {featuredPost.description}
              </p>
              <a
                href={featuredPost.readMoreHref}
                title=""
                className="inline-flex items-center text-base font-semibold leading-tight text-primary-600 hover:underline dark:text-primary-500"
              >
                Read more
                <svg
                  aria-hidden="true"
                  className="ml-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </article>
          <div className="space-y-8">
            {sidePosts.map((post, i) => (
              <article key={i}>
                <div className="space-y-3">
                  <Badge color={sidePostColors[i % sidePostColors.length]} className="w-fit px-3">
                    {post.badge}
                  </Badge>
                  <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    <a href={post.titleHref} className="hover:underline" title="">
                      {post.title}
                    </a>
                  </h2>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {post.description}
                  </p>
                  <a
                    href={post.readMoreHref}
                    title=""
                    className="inline-flex items-center text-base font-semibold leading-tight text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Read more
                    <svg
                      aria-hidden="true"
                      className="ml-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogPostsWithFeaturedImageHero
