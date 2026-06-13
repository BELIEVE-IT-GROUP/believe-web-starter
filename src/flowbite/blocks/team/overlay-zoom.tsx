import { Button } from "flowbite-react";

type TeamMember = {
  name: string
  role?: string
  photo?: string
}

type OverlayZoomTeamProps = {
  headline?: string
  description?: string
  descriptionExtra?: string
  primaryCta?: { label: string; href: string }
  members?: TeamMember[]
}

const DEMO_MEMBERS: TeamMember[] = [
  { name: 'Robert Brown', role: 'CEO & Co-Founder', photo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/team/member-1.png' },
  { name: 'Leslie Livingston', role: 'CTO & Co-Founder', photo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/team/member-2.png' },
  { name: 'Joseph McFall', role: 'Front-end Developer', photo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/team/member-3.png' },
  { name: 'Thom Belly', role: 'Front-end Developer', photo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/team/member-5.png' },
  { name: 'Bonnie Green', role: 'React Developer', photo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/team/member-6.png' },
  { name: 'Lana Byrd', role: 'Marketing', photo: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/team/member-7.png' },
]

export function OverlayCardsWithZoomEffectTeamSection(props: OverlayZoomTeamProps = {}) {
  const members = props.members ?? DEMO_MEMBERS
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div className="flex flex-col gap-8 sm:gap-12 xl:flex-row xl:items-start xl:gap-16">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {props.headline ?? 'Our people make us great'}
            </h2>
            <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
              {props.description ?? 'Here we focus on markets where technology, innovation, can unlock long-term value.'}
            </p>
            <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
              {props.descriptionExtra ?? "You'll interact with talented professionals, will be challenged to solve difficult problems and think in new and creative ways."}
            </p>
            <div className="mt-4">
              <Button href={props.primaryCta?.href ?? '#'} className="w-fit [&>span]:items-center">
                {props.primaryCta?.label ?? 'View more'}
                <svg
                  aria-hidden="true"
                  className="-mr-1 ml-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          </div>
          <div className="grid w-full shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:max-w-3xl">
            {members.map((m, i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg">
                <img
                  className="h-[320px] w-full scale-100 object-cover duration-300 ease-in group-hover:scale-125 lg:h-auto"
                  src={m.photo ?? `https://flowbite.s3.amazonaws.com/blocks/marketing-ui/team/member-${(i % 12) + 1}.png`}
                  alt=""
                />
                <div className="absolute inset-0 grid items-end justify-center bg-gradient-to-b from-transparent to-black/60 p-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{m.name}</p>
                    <p className="text-base font-medium text-gray-300">
                      {m.role ?? ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OverlayCardsWithZoomEffectTeamSection
