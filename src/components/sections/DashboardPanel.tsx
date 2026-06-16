/**
 * DashboardPanel (dashboard-panel.custom).
 *
 * Decorative monitoring-panel mock (logistics control center): a top bar with
 * status lights + title + "live" pulse, a grid of KPI cards, an inline SVG
 * sparkline with a soft gradient fill, and tracking rows with status pills.
 * Purely visual (aria-hidden), driven entirely by props so each tenant skins it
 * via theme tokens.
 *
 * Ported from birdman-landing.html (hero panel lines 368-395, tech panel
 * 541-567) but theme-aware and DARK by default: it builds its own elevated
 * surfaces from var(--brand-paper) (page background) and var(--brand-ink)
 * (text), so it reads well on a dark paper without assuming a light background.
 *
 * Server Component (no interaction). Theme tokens only, no Flowbite, no raw hex
 * except as var(--token, #fallback).
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

export interface DashboardKpi {
  label?: string
  value?: string
  delta?: string
  /** Direction of the delta marker: up (positive), down (negative), warn (alert). */
  deltaDir?: 'up' | 'down' | 'warn'
}

export interface DashboardTrackingRow {
  id?: string
  dest?: string
  status?: string
  /** ok = settled (accent/green pill), go = in progress (primary pill). */
  statusType?: 'ok' | 'go'
}

export interface DashboardPanelProps {
  /** Optional eyebrow above the panel (kept short, mono). */
  eyebrow?: string
  /** Optional section heading rendered as an h2 beside/above the panel. */
  heading?: string
  /** Panel title, e.g. "birdman . centro de monitoreo". */
  title?: string
  /** Label for the live pill, defaults to "En vivo". */
  liveLabel?: string
  /** When true, show the live pulse indicator. */
  live?: boolean
  kpis?: DashboardKpi[]
  chartLabel?: string
  /** Trend caption, e.g. "-18% acumulado". */
  chartDelta?: string
  /** cost = primary (orange) tint, delivery = accent (green) tint. */
  chartTone?: 'cost' | 'delivery'
  tracking?: DashboardTrackingRow[]
  appearance?: BlockAppearance
}

// ─── Token shorthands ─────────────────────────────────────────────────────────
// In a DARK theme, --brand-ink is the light text color and --brand-paper is the
// dark page background. We derive elevated surfaces and hairline borders by
// mixing those two so the panel stays correct in either polarity.

const INK = 'var(--brand-ink, #f2f2ed)'
const PAPER = 'var(--brand-paper, #0b0d10)'
const PRIMARY = 'var(--color-primary, #ff8400)'
const ACCENT = 'var(--color-accent, #25d366)'
const MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, monospace)'
const DISPLAY = 'var(--font-display, system-ui, sans-serif)'
const BODY = 'var(--font-body, system-ui, sans-serif)'
const CARD_RADIUS = 'var(--radius-card, 12px)'

/** Text at a given opacity (muted / faint), polarity-safe via rgb(from …). */
function inkAlpha(a: number): string {
  return `rgb(from ${INK} r g b / ${a})`
}
/** A surface raised slightly above the page background. */
function surface(mix: number): string {
  return `color-mix(in oklab, ${INK} ${mix}%, ${PAPER})`
}
function tone(kind: 'cost' | 'delivery'): string {
  return kind === 'cost' ? PRIMARY : ACCENT
}

// ─── Defaults (mirror the reference HTML content) ─────────────────────────────

const DEFAULT_KPIS: DashboardKpi[] = [
  { label: 'Envios activos', value: '8,412', delta: '6% semana', deltaDir: 'up' },
  { label: 'A tiempo', value: '98.2%', delta: '1.4 pts', deltaDir: 'up' },
  { label: 'Costo / envio', value: '$71', delta: '14% mes', deltaDir: 'down' },
]

const DEFAULT_TRACKING: DashboardTrackingRow[] = [
  { id: 'BRD-48120', dest: 'CDMX, Monterrey', status: 'Entregado', statusType: 'ok' },
  { id: 'BRD-48121', dest: 'Guadalajara, Tijuana', status: 'En ruta', statusType: 'go' },
  { id: 'BRD-48122', dest: 'Bajio, Laredo TX', status: 'En ruta', statusType: 'go' },
]

// Sparkline geometry mirrors the reference paths. The "cost" line trends down
// (good, cost falling), the "delivery" line trends up (good, fulfilment rising).
const SPARK: Record<'cost' | 'delivery', { line: string; point: { x: number; y: number } }> = {
  cost: { line: 'M0,26 L46,30 L92,22 L138,40 L184,48 L230,58 L276,66 L320,78', point: { x: 320, y: 78 } },
  delivery: { line: 'M0,70 L46,62 L92,64 L138,50 L184,44 L230,34 L276,28 L320,20', point: { x: 320, y: 20 } },
}

// ─── Delta marker (arrow + color, no em dashes) ───────────────────────────────

function deltaColor(dir: DashboardKpi['deltaDir']): string {
  if (dir === 'warn') return PRIMARY
  return ACCENT
}
function deltaArrow(dir: DashboardKpi['deltaDir']): string {
  if (dir === 'down') return '▼' // ▼
  if (dir === 'warn') return '⚠' // ⚠
  return '▲' // ▲
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: DashboardKpi }) {
  return (
    <div
      style={{
        background: surface(4),
        border: `1px solid ${inkAlpha(0.1)}`,
        borderRadius: CARD_RADIUS,
        padding: '0.875rem 0.9rem',
      }}
    >
      {kpi.label ? (
        <p
          style={{
            fontFamily: MONO,
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: inkAlpha(0.5),
            margin: '0 0 0.5rem',
          }}
        >
          {kpi.label}
        </p>
      ) : null}
      {kpi.value ? (
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(1.35rem, 2.4vw, 1.6rem)',
            fontWeight: 800,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            color: INK,
            margin: 0,
          }}
        >
          {kpi.value}
        </p>
      ) : null}
      {kpi.delta ? (
        <p
          style={{
            fontFamily: MONO,
            fontSize: '0.6875rem',
            color: deltaColor(kpi.deltaDir),
            margin: '0.5rem 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span aria-hidden>{deltaArrow(kpi.deltaDir)}</span>
          {kpi.delta}
        </p>
      ) : null}
    </div>
  )
}

// ─── Sparkline chart card ─────────────────────────────────────────────────────

function ChartCard({
  label,
  delta,
  toneKind,
  gradientId,
}: {
  label?: string
  delta?: string
  toneKind: 'cost' | 'delivery'
  gradientId: string
}) {
  const stroke = tone(toneKind)
  const geom = SPARK[toneKind]
  const areaPath = `${geom.line} L${geom.point.x},96 L0,96 Z`

  return (
    <div
      style={{
        background: surface(4),
        border: `1px solid ${inkAlpha(0.1)}`,
        borderRadius: CARD_RADIUS,
        padding: '0.875rem 0.875rem 0.5rem',
      }}
    >
      {label || delta ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          {label ? <span style={{ fontFamily: BODY, fontSize: '0.75rem', color: inkAlpha(0.5) }}>{label}</span> : null}
          {delta ? (
            <b style={{ fontFamily: MONO, fontSize: '0.75rem', fontWeight: 700, color: stroke, whiteSpace: 'nowrap' }}>
              {delta}
            </b>
          ) : null}
        </div>
      ) : null}
      <svg viewBox="0 0 320 96" preserveAspectRatio="none" role="presentation" style={{ width: '100%', height: '96px', display: 'block' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={stroke} stopOpacity="0.32" />
            <stop offset="1" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={geom.line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={geom.point.x} cy={geom.point.y} r="4" fill={stroke} />
      </svg>
    </div>
  )
}

// ─── Tracking row + status pill ───────────────────────────────────────────────

function StatusPill({ status, statusType }: { status: string; statusType: 'ok' | 'go' }) {
  const color = statusType === 'ok' ? ACCENT : PRIMARY
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: '0.6875rem',
        fontWeight: 700,
        padding: '0.15rem 0.6rem',
        borderRadius: 'var(--radius-full, 9999px)',
        border: `1px solid color-mix(in oklab, ${color} 40%, transparent)`,
        color,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {status}
    </span>
  )
}

function TrackingRow({ row }: { row: DashboardTrackingRow }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.75rem', minWidth: 0 }}>
      {row.id ? (
        <span style={{ fontFamily: MONO, color: inkAlpha(0.72), flexShrink: 0, minWidth: '5rem' }}>{row.id}</span>
      ) : null}
      {row.dest ? (
        <span style={{ fontFamily: BODY, color: inkAlpha(0.72), flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.dest}
        </span>
      ) : null}
      {row.status ? <StatusPill status={row.status} statusType={row.statusType ?? 'go'} /> : null}
    </div>
  )
}

// ─── The decorative panel ─────────────────────────────────────────────────────

function MonitoringPanel({
  title,
  live,
  liveLabel,
  kpis,
  chartLabel,
  chartDelta,
  chartTone,
  tracking,
  gradientId,
}: {
  title?: string
  live: boolean
  liveLabel: string
  kpis: DashboardKpi[]
  chartLabel?: string
  chartDelta?: string
  chartTone: 'cost' | 'delivery'
  tracking: DashboardTrackingRow[]
  gradientId: string
}) {
  return (
    <div
      aria-hidden
      className="dashboard-panel-card"
      style={{
        background: `linear-gradient(180deg, ${surface(6)}, ${surface(2)})`,
        border: `1px solid ${inkAlpha(0.14)}`,
        borderRadius: 'var(--radius-card, 16px)',
        padding: '1.125rem',
        boxShadow: 'var(--shadow-card, 0 30px 80px -40px rgb(0 0 0 / 0.6))',
      }}
    >
      {/* Top bar: lights + title + live pulse */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              style={{
                width: '0.625rem',
                height: '0.625rem',
                borderRadius: '50%',
                background: surface(22),
                display: 'inline-block',
              }}
            />
          ))}
        </div>
        {title ? (
          <span style={{ fontFamily: MONO, fontSize: '0.75rem', color: inkAlpha(0.5), marginLeft: '0.375rem', letterSpacing: '0.04em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
        ) : null}
        {live ? (
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: MONO,
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: ACCENT,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              flexShrink: 0,
            }}
          >
            <span style={{ width: '0.4375rem', height: '0.4375rem', borderRadius: '50%', background: ACCENT, display: 'inline-block' }} />
            {liveLabel}
          </span>
        ) : null}
      </div>

      {/* KPI grid */}
      {kpis.length ? (
        <div className="dashboard-panel-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.625rem', marginBottom: '0.75rem' }}>
          {kpis.slice(0, 6).map((kpi, i) => (
            <KpiCard key={i} kpi={kpi} />
          ))}
        </div>
      ) : null}

      {/* Sparkline */}
      {chartLabel || chartDelta ? (
        <ChartCard label={chartLabel} delta={chartDelta} toneKind={chartTone} gradientId={gradientId} />
      ) : null}

      {/* Tracking rows */}
      {tracking.length ? (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tracking.slice(0, 6).map((row, i) => (
            <TrackingRow key={i} row={row} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function DashboardPanel({
  eyebrow,
  heading,
  title,
  liveLabel = 'En vivo',
  live = true,
  kpis,
  chartLabel = 'Costo logistico mensual',
  chartDelta = '-18% acumulado',
  chartTone = 'cost',
  tracking,
  appearance,
}: DashboardPanelProps) {
  const safeKpis = (kpis ?? DEFAULT_KPIS).filter((k) => k.label || k.value || k.delta)
  const safeTracking = (tracking ?? DEFAULT_TRACKING).filter((t) => t.id || t.dest || t.status)
  // Stable, unique gradient id so multiple panels on one page do not clash.
  const gradientId = `dash-spark-${(appearance?.sectionId || title || chartTone || 'panel')
    .toString()
    .replace(/[^a-zA-Z0-9_-]/g, '-')}`

  const panel = (
    <MonitoringPanel
      title={title}
      live={live}
      liveLabel={liveLabel}
      kpis={safeKpis}
      chartLabel={chartLabel}
      chartDelta={chartDelta}
      chartTone={chartTone}
      tracking={safeTracking}
      gradientId={gradientId}
    />
  )

  // With a heading/eyebrow: a two-column intro layout (copy left, panel right),
  // collapsing to a single column on small screens. Without copy: just the panel,
  // centered and constrained so it never stretches edge to edge.
  if (eyebrow || heading) {
    return (
      <Section appearance={appearance} background="paper">
        <Container
          size="xl"
          className="dashboard-panel-grid"
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: 'clamp(2rem, 4.5vw, 4rem)', alignItems: 'center' }}
        >
          <div>
            {eyebrow ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            ) : null}
            {heading ? (
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 3.6vw, 2.75rem)',
                  lineHeight: 1.08,
                  letterSpacing: 'var(--tracking-tight, -0.015em)',
                  color: INK,
                  margin: 0,
                }}
              >
                {heading}
              </h2>
            ) : null}
          </div>
          <div>{panel}</div>
        </Container>
        <ResponsiveStyles />
      </Section>
    )
  }

  return (
    <Section appearance={appearance} background="paper">
      <Container size="md">
        {panel}
      </Container>
      <ResponsiveStyles />
    </Section>
  )
}

// Collapse the two-column intro and tighten the KPI grid on narrow screens.
function ResponsiveStyles() {
  return (
    <style>{`
      @media (max-width: 860px) {
        .dashboard-panel-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 420px) {
        .dashboard-panel-kpis { grid-template-columns: 1fr !important; }
      }
    `}</style>
  )
}
