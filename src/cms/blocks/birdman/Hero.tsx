/**
 * Bloque Hero de birdman. PATRÓN DE REFERENCIA para las demás secciones:
 *   1. markup JSX verbatim del port (BirdmanLanding.tsx), clases/IDs idénticos
 *   2. props desestructuradas (antes content.hero.X → ahora X)
 *   3. fields = textos editables; defaultProps = slice de birdmanContent (fidelidad)
 */
import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'

type HeroProps = BirdmanContent['hero']

export const Hero: ComponentConfig<HeroProps> = {
  label: 'Hero',
  fields: {
    tag: { type: 'text' },
    headlineBefore: { type: 'text' },
    headlineEm: { type: 'text' },
    headlineAfter: { type: 'text' },
    sub: { type: 'textarea' },
    ctas: {
      type: 'array',
      arrayFields: {
        label: { type: 'text' },
        href: { type: 'text' },
        style: {
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      },
      getItemSummary: (item: { label?: string }) => item?.label || 'CTA',
    },
    note: { type: 'text' },
    noteStrong: { type: 'text' },
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
  defaultProps: birdmanContent.hero,
  render: ({ tag, headlineBefore, headlineEm, headlineAfter, sub, ctas, note, noteStrong, panel }) => (
    <section className="hero">
      <div className="wrap hero__grid">
        <div>
          <span className="tag">
            <span className="dot" />
            {tag}
          </span>
          <h1>
            {headlineBefore}
            <em>{headlineEm}</em>
            {headlineAfter}
          </h1>
          <p className="sub">{sub}</p>
          <div className="hero__cta">
            {ctas.map((c) => (
              <a key={c.label} className={`btn ${c.style === 'ghost' ? 'btn--ghost' : 'btn--primary'}`} href={c.href}>
                {c.label}
              </a>
            ))}
          </div>
          <p className="hero__note">
            {note}
            <strong>{noteStrong}</strong>
          </p>
        </div>

        {/* Centro de monitoreo */}
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
                <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff8400" stopOpacity=".34" />
                  <stop offset="1" stopColor="#ff8400" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,26 L46,30 L92,22 L138,40 L184,48 L230,58 L276,66 L320,78 L320,96 L0,96 Z" fill="url(#ar)" />
              <path
                d="M0,26 L46,30 L92,22 L138,40 L184,48 L230,58 L276,66 L320,78"
                fill="none"
                stroke="#ff8400"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="320" cy="78" r="4" fill="#ff8400" />
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
    </section>
  ),
}
