import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'

export const Faq: ComponentConfig<BirdmanContent['faq']> = {
  label: 'Faq',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        q: { type: 'text' },
        a: { type: 'textarea' },
        open: {
          type: 'radio',
          options: [
            { label: 'Si', value: true },
            { label: 'No', value: false },
          ],
        },
      },
      getItemSummary: (item: { q?: string }) => item?.q || 'Faq',
    },
  } as never,
  defaultProps: birdmanContent.faq,
  render: ({ eyebrow, title, items }) => (
    <section id="faq">
      <div className="wrap" style={{ maxWidth: '840px' }}>
        <p className="eyebrow center">{eyebrow}</p>
        <h2 className="title center" style={{ maxWidth: 'none' }}>
          {title}
        </h2>
        <div className="faq" style={{ marginTop: 'var(--s7)' }}>
          {items.map((item) => (
            <details key={item.q} open={item.open}>
              <summary>
                {item.q}
                <span className="plus" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  ),
}
