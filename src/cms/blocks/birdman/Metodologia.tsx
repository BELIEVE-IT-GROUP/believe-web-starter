import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'
import { stringList } from './fields'

type MetodologiaProps = BirdmanContent['metodologia']

export const Metodologia: ComponentConfig<MetodologiaProps> = {
  label: 'Metodologia',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    steps: stringList('paso'),
  } as never,
  defaultProps: birdmanContent.metodologia,
  render: ({ eyebrow, title, steps }) => (
    <section id="metodologia">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="title">{title}</h2>
        <div className="method-wrap reveal">
          <div className="method">
            {steps.map((step) => (
              <div className="step" key={step}>
                <div className="node" />
                <h4>{step}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
}
