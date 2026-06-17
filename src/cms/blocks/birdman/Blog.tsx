import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'

type BlogProps = BirdmanContent['blog']

export const Blog: ComponentConfig<BlogProps> = {
  label: 'Blog',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        type: { type: 'text' },
        title: { type: 'text' },
        desc: { type: 'textarea' },
        href: { type: 'text' },
      },
      getItemSummary: (item: { title?: string }) => item?.title || 'Blog',
    },
  } as never,
  defaultProps: birdmanContent.blog,
  render: ({ eyebrow, title, items }) => (
    <section id="blog" style={{ background: 'var(--surface)' }}>
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <div className="grid g3 reveal">
          {items.map((b) => (
            <a className="res-card" href={b.href} key={b.title}>
              <span className="type">{b.type}</span>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
              <span className="go">Leer</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  ),
}
