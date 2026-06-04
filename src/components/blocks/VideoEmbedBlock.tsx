import { getContainerClassName, getSectionProps, type BlockAppearance } from './appearance'

export function VideoEmbedBlock(props: {
  headline?: string
  videoUrl?: string
  caption?: string
  autoplay?: boolean
  appearance?: BlockAppearance
}) {
  const { headline, videoUrl, caption, appearance } = props

  const embedUrl = videoUrl?.includes('youtube.com/watch?v=')
    ? videoUrl.replace('watch?v=', 'embed/')
    : videoUrl?.includes('youtu.be/')
    ? videoUrl.replace('youtu.be/', 'youtube.com/embed/')
    : videoUrl

  return (
    <section {...getSectionProps(appearance, { background: 'bg-white' })}>
      <div className={getContainerClassName(appearance)}>
        {headline && (
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {headline}
          </h2>
        )}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white">
              No video URL configured
            </div>
          )}
        </div>
        {caption && <p className="mt-4 text-center text-gray-500">{caption}</p>}
      </div>
    </section>
  )
}
