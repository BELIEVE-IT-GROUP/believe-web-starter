import { Button } from "flowbite-react";

type BackgroundImageCardsHeroProps = {
  cards?: { image: string; headline: string; href: string; ctaLabel: string }[]
}

export function BackgroundImageCardsHero(props: BackgroundImageCardsHeroProps = {}) {
  const {
    cards = [
      { image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/bmw-ix.png", headline: "Enjoy nature sustainable travel in the BMW iX", href: "#", ctaLabel: "Show more" },
      { image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/bmw-m4.png", headline: "Enjoy nature sustainable travel in the BMW iX", href: "#", ctaLabel: "Show more" },
      { image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/bmw-m6.png", headline: "Enjoy nature sustainable travel in the BMW iX", href: "#", ctaLabel: "Show more" },
    ],
  } = props
  const [card0, card1, card2] = cards
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={card0?.href ?? "#"}
            className="col-span-2 h-96 bg-gray-500 bg-cover bg-center bg-no-repeat p-8 text-left bg-blend-multiply hover:bg-blend-normal"
            style={{ backgroundImage: `url('${card0?.image ?? "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/bmw-ix.png"}')` }}
          >
            <h2 className="mb-5 max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-white">
              {card0?.headline ?? "Enjoy nature sustainable travel in the BMW iX"}
            </h2>
            <Button className="border border-white bg-transparent text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-gray-700 dark:bg-transparent dark:hover:bg-white">
              {card0?.ctaLabel ?? "Show more"}
            </Button>
          </a>
          <a
            href={card1?.href ?? "#"}
            className="col-span-2 h-96 bg-gray-500 bg-cover bg-center bg-no-repeat p-8 text-left bg-blend-multiply hover:bg-blend-normal md:col-span-1"
            style={{ backgroundImage: `url('${card1?.image ?? "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/bmw-m4.png"}')` }}
          >
            <h2 className="mb-5 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-white">
              {card1?.headline ?? "Enjoy nature sustainable travel in the BMW iX"}
            </h2>
            <Button className="border border-white bg-transparent text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-gray-700 dark:bg-transparent dark:hover:bg-white">
              {card1?.ctaLabel ?? "Show more"}
            </Button>
          </a>
          <a
            href={card2?.href ?? "#"}
            className="col-span-2 h-96 bg-gray-500 bg-cover bg-center bg-no-repeat p-8 text-left bg-blend-multiply hover:bg-blend-normal md:col-span-1"
            style={{ backgroundImage: `url('${card2?.image ?? "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/bmw-m6.png"}')` }}
          >
            <h2 className="mb-5 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-white">
              {card2?.headline ?? "Enjoy nature sustainable travel in the BMW iX"}
            </h2>
            <Button className="border border-white bg-transparent text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-gray-700 dark:bg-transparent dark:hover:bg-white">
              {card2?.ctaLabel ?? "Show more"}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default BackgroundImageCardsHero
