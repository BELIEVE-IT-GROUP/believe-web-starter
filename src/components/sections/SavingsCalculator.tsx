'use client'

/**
 * SavingsCalculator (savings-calculator.custom, client component).
 *
 * Interactive savings calculator: inputs on the left (shipments/month, cost per
 * shipment, operators) and a result panel on the right. Annual cost =
 * shipments * 12 * cost; saving = annual * rate; monthly = saving / 12. Money
 * formatted es-MX (MXN, no decimals), recalculated live on every input change.
 * CTA at the foot of the result panel.
 *
 * Reference: birdman-landing.html lines 633-664 (markup) and 831-850 (logic).
 * Replicates that design and copy, but every string and number is a prop with
 * the HTML values as defaults.
 *
 * Client component by necessity (useState drives the live recalculation).
 * Theme tokens only, no Flowbite. Theme-aware: built for the DARK theme via
 * tokens (brand-paper background, brand-ink text), surfaces derived with
 * color-mix so it also reads on a light theme.
 */

import { useId, useMemo, useState, type CSSProperties } from 'react'

import { Button, Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

export interface SavingsCalculatorField {
  id?: string
  label?: string
  /** Optional input prefix, e.g. "$". */
  prefix?: string
  defaultValue?: number
  hint?: string
}

export interface SavingsCalculatorProps {
  eyebrow?: string
  headline?: string
  lead?: string
  /** Inputs: shipments/month, cost per shipment, operators. */
  fields?: SavingsCalculatorField[]
  /** Optimization rate applied to annual cost (default 0.14). */
  rate?: number
  outputAnnualLabel?: string
  outputSaveLabel?: string
  /** Optional template for the recovered-per-month line. {value} is replaced. */
  outputMonthlyLabel?: string
  ctaText?: string
  ctaUrl?: string
  /** Footnote explaining the assumption behind the estimate. */
  assumptionNote?: string
  appearance?: BlockAppearance
}

// ─── Defaults (mirror the HTML reference) ─────────────────────────────────────

const DEFAULT_FIELDS: SavingsCalculatorField[] = [
  { id: 'shipments', label: 'Envios por mes', defaultValue: 5000 },
  { id: 'cost', label: 'Costo promedio por envio (MXN)', prefix: '$', defaultValue: 85 },
  {
    id: 'operators',
    label: 'Operadores dedicados a logistica',
    defaultValue: 6,
    hint: 'Nos ayuda a dimensionar el potencial de automatizacion de procesos.',
  },
]

const DEFAULTS = {
  eyebrow: 'Calculadora de ahorro',
  headline: 'Cuanto podrias ahorrar en logistica este ano?',
  lead: 'Ingresa tres datos de tu operacion y obten una estimacion inmediata de tu potencial de ahorro anual.',
  rate: 0.14,
  outputAnnualLabel: 'Costo logistico anual estimado',
  outputSaveLabel: 'Ahorro potencial anual',
  outputMonthlyLabel: 'aprox. {value} al mes recuperados.',
  ctaText: 'Quiero mi ahorro real',
  ctaUrl: '#diagnostico',
  assumptionNote:
    'Estimacion basada en una optimizacion del 14% del costo logistico, el punto medio de los resultados tipicos de nuestros proyectos (12% a 18%). El ahorro real se define en tu diagnostico.',
} as const

// ─── Derived surface tokens (theme-aware, dark-first) ─────────────────────────
// Surfaces are mixed from the ink token so a dark paper still gets a lifted
// card, and a light theme gets a subtle tint. No raw hex outside var() fallbacks.

const SURFACE = 'color-mix(in oklab, var(--brand-ink, #0a0a0a) 5%, var(--brand-paper, #11131a))'
const SURFACE_LIFTED = 'color-mix(in oklab, var(--color-primary, #0c3bb9) 7%, var(--brand-paper, #11131a))'
const BORDER = 'color-mix(in oklab, var(--brand-ink, #0a0a0a) 16%, transparent)'
const BORDER_STRONG = 'color-mix(in oklab, var(--color-primary, #0c3bb9) 28%, transparent)'

// Text tiers reference theme tokens directly (var(--token, #fallback)), never a
// bare computed color string. MUTED maps to the muted-ink token; FAINT reuses it
// for hints (hierarchy comes from size/weight, not a second color).
const MUTED = 'var(--brand-ink-muted, #6b6b65)'
const FAINT = 'var(--brand-ink-muted, #6b6b65)'

// ─── Static style fragments ───────────────────────────────────────────────────

const HEADLINE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
  lineHeight: 1.08,
  letterSpacing: 'var(--tracking-tight, -0.02em)',
  color: 'var(--brand-ink, #1a1a1a)',
  textWrap: 'balance',
  maxWidth: '22ch',
  margin: '1.1rem 0 0',
}

const LEAD: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: 'clamp(1rem, 1.3vw, 1.1875rem)',
  lineHeight: 1.65,
  color: FAINT,
  maxWidth: '52ch',
  margin: '1rem 0 0',
}

const LABEL: CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '0.78125rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: MUTED,
}

const HINT: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: '0.75rem',
  lineHeight: 1.5,
  color: FAINT,
}

const OUT_KICKER: CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '0.78125rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  margin: 0,
}

// ─── Number formatting (es-MX, MXN, no decimals) ─────────────────────────────

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

/** Coerce a raw input value to a non-negative finite number. */
function toAmount(raw: string): number {
  const v = parseFloat(raw)
  return Number.isFinite(v) && v > 0 ? v : 0
}

// ─── Single field row ─────────────────────────────────────────────────────────

function CalcField({
  field,
  value,
  inputId,
  onChange,
}: {
  field: SavingsCalculatorField
  value: string
  inputId: string
  onChange: (next: string) => void
}) {
  const hintId = field.hint ? `${inputId}-hint` : undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label htmlFor={inputId} style={LABEL}>
        {field.label}
      </label>
      <div
        className="sc-control"
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--brand-paper, #0a0a0a)',
          border: `1px solid ${BORDER}`,
          borderRadius: 'var(--radius-button, 0.5rem)',
          transition: 'border-color var(--transition-fast, 150ms) ease',
        }}
      >
        {field.prefix ? (
          <span
            aria-hidden
            style={{
              paddingLeft: '0.875rem',
              color: FAINT,
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
              fontWeight: 600,
            }}
          >
            {field.prefix}
          </span>
        ) : null}
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={0}
          value={value}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
          style={{
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--brand-ink, #1a1a1a)',
            background: 'transparent',
            border: 0,
            outline: 'none',
            padding: '0.8125rem 0.875rem',
            width: '100%',
            minWidth: 0,
          }}
        />
      </div>
      {field.hint ? (
        <span id={hintId} style={HINT}>
          {field.hint}
        </span>
      ) : null}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SavingsCalculator({
  eyebrow,
  headline,
  lead,
  fields,
  rate,
  outputAnnualLabel,
  outputSaveLabel,
  outputMonthlyLabel,
  ctaText,
  ctaUrl,
  assumptionNote,
  appearance,
}: SavingsCalculatorProps) {
  const baseId = useId()

  // Resolve copy + config from props with reference defaults, gracefully.
  const eyebrowText = eyebrow ?? DEFAULTS.eyebrow
  const headlineText = headline ?? DEFAULTS.headline
  const leadText = lead ?? DEFAULTS.lead
  const activeRate = typeof rate === 'number' && rate > 0 ? rate : DEFAULTS.rate
  const annualLabel = outputAnnualLabel ?? DEFAULTS.outputAnnualLabel
  const saveLabel = outputSaveLabel ?? DEFAULTS.outputSaveLabel
  const monthlyTpl = outputMonthlyLabel ?? DEFAULTS.outputMonthlyLabel
  const cta = ctaText ?? DEFAULTS.ctaText
  const ctaHref = ctaUrl ?? DEFAULTS.ctaUrl
  const note = assumptionNote ?? DEFAULTS.assumptionNote

  const activeFields = fields && fields.length ? fields : DEFAULT_FIELDS

  // Seed live state from each field's default value. The first two fields drive
  // the math (shipments, cost); extra fields are captured but not multiplied in.
  const [values, setValues] = useState<string[]>(() =>
    activeFields.map((f) => String(f.defaultValue ?? 0)),
  )

  const setValueAt = (idx: number, next: string) => {
    setValues((prev) => {
      const copy = prev.slice()
      copy[idx] = next
      return copy
    })
  }

  const { annual, save, monthly } = useMemo(() => {
    const shipments = toAmount(values[0] ?? '0')
    const cost = toAmount(values[1] ?? '0')
    const annualCost = shipments * 12 * cost
    const saving = annualCost * activeRate
    return { annual: annualCost, save: saving, monthly: saving / 12 }
  }, [values, activeRate])

  const monthlyText = monthlyTpl.includes('{value}')
    ? monthlyTpl.replace('{value}', currency.format(monthly))
    : `${monthlyTpl} ${currency.format(monthly)}`

  const numericStyle: CSSProperties = {
    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <Section appearance={appearance} background="paper">
      <Container size="lg">
        {/* Heading block */}
        <div style={{ maxWidth: '40rem' }}>
          {eyebrowText ? <Eyebrow>{eyebrowText}</Eyebrow> : null}
          {headlineText ? <h2 style={HEADLINE}>{headlineText}</h2> : null}
          {leadText ? <p style={LEAD}>{leadText}</p> : null}
        </div>

        {/* Calculator grid: form left, result right. */}
        <div
          className="sc-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(1.25rem, 3vw, 2.5rem)',
            alignItems: 'stretch',
            marginTop: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          {/* ── Form ── */}
          <form
            noValidate
            aria-label={annualLabel}
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.125rem',
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 'var(--radius-card, 1rem)',
              padding: 'clamp(1.5rem, 3vw, 1.875rem)',
            }}
          >
            {activeFields.map((field, i) => (
              <CalcField
                key={field.id ?? i}
                field={field}
                value={values[i] ?? ''}
                inputId={`${baseId}-f${i}`}
                onChange={(next) => setValueAt(i, next)}
              />
            ))}
          </form>

          {/* ── Result panel ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: SURFACE_LIFTED,
              border: `1px solid ${BORDER_STRONG}`,
              borderRadius: 'var(--radius-card, 1rem)',
              padding: 'clamp(1.5rem, 3vw, 1.875rem)',
            }}
          >
            <p style={{ ...OUT_KICKER, color: MUTED }}>{annualLabel}</p>
            <p
              aria-live="polite"
              style={{
                ...numericStyle,
                fontSize: 'clamp(1.4rem, 2.4vw, 1.6rem)',
                fontWeight: 700,
                color: 'var(--brand-ink, #1a1a1a)',
                margin: '0.4rem 0 1.5rem',
              }}
            >
              {currency.format(annual)}
            </p>

            <p style={{ ...OUT_KICKER, color: 'var(--color-accent, #00aaff)' }}>{saveLabel}</p>
            <p
              aria-live="polite"
              style={{
                ...numericStyle,
                fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: 'var(--color-accent, #00aaff)',
                margin: '0.5rem 0 0.25rem',
              }}
            >
              {currency.format(save)}
            </p>
            <p
              aria-live="polite"
              style={{
                fontFamily: 'var(--font-body, system-ui, sans-serif)',
                fontSize: '0.875rem',
                color: FAINT,
                margin: '0 0 auto',
              }}
            >
              {monthlyText}
            </p>

            {note ? (
              <p
                style={{
                  fontFamily: 'var(--font-body, system-ui, sans-serif)',
                  fontSize: '0.75rem',
                  lineHeight: 1.55,
                  color: FAINT,
                  borderTop: `1px solid ${BORDER}`,
                  paddingTop: '0.875rem',
                  margin: '1.5rem 0 1.25rem',
                }}
              >
                {note}
              </p>
            ) : null}

            {cta ? (
              <Button href={ctaHref} variant="primary" style={{ width: '100%' }}>
                {cta}
                <span aria-hidden>&rarr;</span>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>

      {/* Focus-visible ring + single-column collapse on small screens. */}
      <style>{`
        .sc-control:focus-within {
          border-color: var(--color-primary, #0c3bb9) !important;
        }
        .sc-control input:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
          border-radius: var(--radius-button, 0.5rem);
        }
        @media (max-width: 760px) {
          .sc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Section>
  )
}
