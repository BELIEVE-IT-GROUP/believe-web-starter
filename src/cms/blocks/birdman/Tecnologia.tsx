/**
 * Bloque Tecnología de birdman. Port FIEL de la sección #tecnologia de
 * BirdmanLanding.tsx (markup/clases/IDs verbatim). Mismo patrón que Hero.tsx:
 *   1. markup JSX verbatim del port
 *   2. props desestructuradas (antes content.tecnologia.X → ahora X)
 *   3. fields = textos editables; defaultProps = slice de birdmanContent
 */
import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'
import { stringList } from './fields'

// Tick (check) reutilizado en Tecnología y Diagnóstico.
function Tick() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

type TecnologiaProps = BirdmanContent['tecnologia']

export const Tecnologia: ComponentConfig<TecnologiaProps> = {
  label: 'Tecnologia',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    lead: { type: 'textarea' },
    ticks: stringList('indicador'),
    panel: {
      type: 'object',
      objectFields: {
        ttl: { type: 'text' },
        live: { type: 'text' },
        kpis: {
          type: 'array',
          arrayFields: {
            k: { type: 'text' },
            v: { type: 'text' },
            d: { type: 'text' },
            warn: {
              type: 'radio',
              options: [
                { label: 'Si', value: true },
                { label: 'No', value: false },
              ],
            },
          },
          getItemSummary: (item: { k?: string }) => item?.k || 'KPI',
        },
        chart: {
          type: 'object',
          objectFields: {
            label: { type: 'text' },
            delta: { type: 'text' },
          },
        },
        tracking: {
          type: 'array',
          arrayFields: {
            id: { type: 'text' },
            dest: { type: 'text' },
            status: { type: 'text' },
            type: {
              type: 'select',
              options: [
                { label: 'OK (verde)', value: 'ok' },
                { label: 'Go (naranja)', value: 'go' },
              ],
            },
          },
          getItemSummary: (item: { id?: string }) => item?.id || 'Tracking',
        },
      },
    },
  } as never,
  defaultProps: birdmanContent.tecnologia,
  render: ({ eyebrow, title, lead, ticks, panel }) => (
    <section id="tecnologia" style={{ background: 'var(--surface)' }}>
      <div className="wrap">
        <div className="hero__grid">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="title">{title}</h2>
            <p className="lead">{lead}</p>
            <ul className="ticks">
              {ticks.map((t) => (
                <li key={t}>
                  <Tick />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel reveal" aria-hidden="true">
            <div className="panel__bar">
              <div className="lights">
                <i />
                <i />
                <i />
              </div>
              <span className="ttl">{panel.ttl}</span>
              <span className="live">{panel.live}</span>
            </div>
            <div className="kpis">
              {panel.kpis.map((kpi) => (
                <div className="kpi" key={kpi.k}>
                  <p className="k">{kpi.k}</p>
                  <p className="v num">{kpi.v}</p>
                  <p className={kpi.warn ? 'd warn' : 'd'}>{kpi.d}</p>
                </div>
              ))}
            </div>
            <div className="chartcard">
              <div className="ch-h">
                <span>{panel.chart.label}</span>
                <b>{panel.chart.delta}</b>
              </div>
              <svg viewBox="0 0 320 96" preserveAspectRatio="none" style={{ width: '100%', height: '96px' }}>
                <defs>
                  <linearGradient id="ar2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#25d366" stopOpacity=".30" />
                    <stop offset="1" stopColor="#25d366" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,70 L46,62 L92,64 L138,50 L184,44 L230,34 L276,28 L320,20 L320,96 L0,96 Z" fill="url(#ar2)" />
                <path d="M0,70 L46,62 L92,64 L138,50 L184,44 L230,34 L276,28 L320,20" fill="none" stroke="#25d366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="320" cy="20" r="4" fill="#25d366" />
              </svg>
            </div>
            <div className="track">
              {panel.tracking.map((row) => (
                <div className="row" key={row.id}>
                  <span className="id">{row.id}</span>
                  <span className="dest">{row.dest}</span>
                  <span className={`pill-s ${row.type}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
}
