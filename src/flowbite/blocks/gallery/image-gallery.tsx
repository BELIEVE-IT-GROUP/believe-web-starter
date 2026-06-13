type ImageGalleryProps = {
  headline?: string
  description?: string
  images?: { url: string; alt?: string; caption?: string }[]
}

const DEMO_IMAGES = [
  { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-1.png', alt: '' },
  { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-2.png', alt: '' },
  { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png', alt: '' },
  { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-4.png', alt: '' },
  { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-5.png', alt: '' },
  { url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-6.png', alt: '' },
]

export function ImageGalleryContentSection(props: ImageGalleryProps = {}) {
  const imgs = props.images ?? DEMO_IMAGES
  const [img1, img2, img3, img4, img5, img6] = imgs
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:text-center lg:px-12 lg:py-16">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {props.headline ?? "We didn't reinvent the wheel"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 sm:text-lg md:px-20 lg:px-36 xl:px-48">
          {props.description ?? 'We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.'}
        </p>
        <div className="mt-8 gap-4 sm:mt-12 sm:grid sm:grid-cols-4">
          <img
            className="col-span-2 mb-4 rounded-lg sm:mb-0"
            src={(img1 ?? DEMO_IMAGES[0]).url}
            alt={(img1 ?? DEMO_IMAGES[0]).alt ?? ''}
          />
          <img
            alt={(img2 ?? DEMO_IMAGES[1]).alt ?? ''}
            src={(img2 ?? DEMO_IMAGES[1]).url}
            className="col-span-1 hidden rounded-lg sm:block"
          />
          <img
            alt={(img3 ?? DEMO_IMAGES[2]).alt ?? ''}
            src={(img3 ?? DEMO_IMAGES[2]).url}
            className="col-span-1 hidden rounded-lg sm:block"
          />
          <img
            alt={(img4 ?? DEMO_IMAGES[3]).alt ?? ''}
            src={(img4 ?? DEMO_IMAGES[3]).url}
            className="col-span-1 hidden rounded-lg sm:block"
          />
          <img
            alt={(img5 ?? DEMO_IMAGES[4]).alt ?? ''}
            src={(img5 ?? DEMO_IMAGES[4]).url}
            className="col-span-2 rounded-lg"
          />
          <img
            alt={(img6 ?? DEMO_IMAGES[5]).alt ?? ''}
            src={(img6 ?? DEMO_IMAGES[5]).url}
            className="col-span-1 hidden rounded-lg sm:block"
          />
        </div>
      </div>
    </section>
  );
}

export default ImageGalleryContentSection
