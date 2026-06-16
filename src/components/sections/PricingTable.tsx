'use client'

/**
 * PricingTable (pricing.custom): world-class craft.
 *
 * Ports the approved trust-demo / HeroSection quality bar to a pricing block:
 * eyebrow-style headline with an em-highlight in the brand color, an optional
 * monthly/annual billing toggle (only shown when an annual price exists), an
 * asymmetric plan grid where the highlighted plan is lifted and solid (not a
 * side-stripe border), and a feature checklist with check / dash glyphs.
 *
 * Client component because the billing toggle is real interaction (useState).
 * Everything is theme-token driven so each tenant re-skins it via the CSS vars
 * injected in <head>. No flowbite, no hardcoded hex outside var() fallbacks.
 */

import type { CSSProperties } from 'react'
import { useId, useMemo, useState } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

export interface PricingPlan {
  name?: string
  price?: string
  /** Optional annual price. When present on any plan, the billing toggle shows. */
  annualPrice?: string
  /** Cadence suffix shown after the price, e.g. "/mes". Defaults sensibly. */
  priceSuffix?: string
  /** Cadence suffix for the annual price, e.g. "/año". */
  annualPriceSuffix?: string
  description?: string
  features?: string[]
  notIncluded?: string[]
  ctaText?: string
  ctaUrl?: string
  highlighted?: boolean
  badge?: string
}

export interface PricingTableProps {
  eyebrow?: string
  headline?: string
  /** Optional emphasized tail rendered in the brand color (Trust-style em). */
  headlineEmphasis?: string
  subheadline?: string
  plans?: PricingPlan[]
  /** Label for the monthly billing option. Defaults to "Mensual". */
  monthlyLabel?: string
  /** Label for the annual billing option. Defaults to "Anual". */
  annualLabel?: string
  /** Small note rendered next to the toggle, e.g. "2 meses gratis". */
  annualNote?: string
  appearance?: BlockAppearance
}

// ─── Tokens shared across the block ───────────────────────────────────────────

const INK = 'var(--brand-ink, #1a1a1a)'
const INK_SOFT = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.62)'
const INK_FAINT = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.42)'
const HAIRLINE = 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.12)'
const PRIMARY = 'var(--color-primary, #0c3bb9)'
const ON_PRIMARY = 'var(--color-on-primary, #ffffff)'

const DISPLAY = 'var(--font-display, system-ui, sans-serif)'
const BODY = 'var(--font-body, system-ui, sans-serif)'
const MONO = 'var(--font-mono, ui-monospace, monospace)'

// ─── Glyphs ───────────────────────────────────────────────────────────────────

function Check({ on }: { on: 'card' | 'primary' }) {
  const color = on === 'primary' ? ON_PRIMARY : PRIMARY
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="16"
      height="16"
      style={{ flexShrink: 0, marginTop: '0.18rem' }}
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Dash({ on }: { on: 'card' | 'primary' }) {
  const color =
    on === 'primary' ? 'rgb(255 255 255 / 0.45)' : INK_FAINT
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="16"
      height="16"
      style={{ flexShrink: 0, marginTop: '0.18rem' }}
    >
      <path d="M4 8h8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Headline ─────────────────────────────────────────────────────────────────

function Headline({ text, emphasis }: { text?: string; emphasis?: string }) {
  if (!text && !emphasis) return null
  return (
    <h2
      style={{
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        lineHeight: 1.05,
        letterSpacing: 'var(--tracking-tight, -0.02em)',
        color: INK,
        margin: '0 0 1rem',
        maxWidth: '28ch',
      }}
    >
      {text}
      {emphasis ? (
        <>
          {text ? ' ' : null}
          <em style={{ fontStyle: 'normal', color: PRIMARY }}>{emphasis}</em>
        </>
      ) : null}
    </h2>
  )
}

// ─── Billing toggle ───────────────────────────────────────────────────────────

function BillingToggle({
  billing,
  setBilling,
  monthlyLabel,
  annualLabel,
  annualNote,
  groupId,
}: {
  billing: 'monthly' | 'annual'
  setBilling: (b: 'monthly' | 'annual') => void
  monthlyLabel: string
  annualLabel: string
  annualNote?: string
  groupId: string
}) {
  const options: Array<{ key: 'monthly' | 'annual'; label: string }> = [
    { key: 'monthly', label: monthlyLabel },
    { key: 'annual', label: annualLabel },
  ]

  const segBase: CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: '0.875rem',
    fontWeight: 700,
    padding: '0.6rem 1.25rem',
    borderRadius: 'var(--radius-full, 9999px)',
    border: 'none',
    cursor: 'pointer',
    transition: 'color var(--transition-fast, 150ms) ease, background-color 150ms ease',
    background: 'transparent',
    color: INK_SOFT,
    lineHeight: 1,
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '2.25rem',
      }}
    >
      <div
        role="radiogroup"
        aria-label="Periodo de facturación"
        style={{
          display: 'inline-flex',
          padding: '0.3rem',
          borderRadius: 'var(--radius-full, 9999px)',
          border: `1px solid ${HAIRLINE}`,
          background: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 4%, transparent)',
        }}
      >
        {options.map((opt) => {
          const active = billing === opt.key
          return (
            <button
              key={opt.key}
              id={`${groupId}-${opt.key}`}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setBilling(opt.key)}
              onKeyDown={(e) => {
                let next: 'monthly' | 'annual' | null = null
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  next = options[(options.indexOf(opt) + 1) % options.length].key
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  next = options[(options.indexOf(opt) + options.length - 1) % options.length].key
                }
                if (next) {
                  e.preventDefault()
                  setBilling(next)
                  document.getElementById(`${groupId}-${next}`)?.focus()
                }
              }}
              style={{
                ...segBase,
                background: active ? PRIMARY : 'transparent',
                color: active ? ON_PRIMARY : INK_SOFT,
                boxShadow: active ? 'var(--shadow-button, none)' : 'none',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      {annualNote ? (
        <span
          style={{
            fontFamily: MONO,
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: PRIMARY,
          }}
        >
          {annualNote}
        </span>
      ) : null}
    </div>
  )
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  billing,
}: {
  plan: PricingPlan
  billing: 'monthly' | 'annual'
}) {
  const highlighted = Boolean(plan.highlighted)
  const on: 'card' | 'primary' = highlighted ? 'primary' : 'card'

  const showAnnual = billing === 'annual' && Boolean(plan.annualPrice)
  const price = showAnnual ? plan.annualPrice : plan.price
  const suffix = showAnnual
    ? plan.annualPriceSuffix ?? plan.priceSuffix
    : plan.priceSuffix

  const features = (plan.features ?? []).filter(Boolean)
  const notIncluded = (plan.notIncluded ?? []).filter(Boolean)

  const titleColor = highlighted ? ON_PRIMARY : INK
  const descColor = highlighted ? 'rgb(255 255 255 / 0.72)' : INK_SOFT
  const featColor = highlighted ? 'rgb(255 255 255 / 0.9)' : INK
  const featOffColor = highlighted ? 'rgb(255 255 255 / 0.55)' : INK_FAINT
  const dividerColor = highlighted ? 'rgb(255 255 255 / 0.16)' : HAIRLINE

  const card: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: highlighted ? '2.75rem 2.25rem' : '2.5rem 2.25rem',
    borderRadius: 'var(--radius-card, 0.5rem)',
    background: highlighted ? PRIMARY : 'var(--brand-paper, #ffffff)',
    color: highlighted ? ON_PRIMARY : INK,
    border: highlighted ? '1px solid transparent' : `1px solid ${HAIRLINE}`,
    boxShadow: highlighted
      ? 'var(--shadow-xl, 0 10px 40px rgba(0,0,0,0.12))'
      : 'var(--shadow-card, 0 1px 3px rgba(0,0,0,0.08))',
  }

  return (
    <div style={card} className={highlighted ? 'pricing-card-featured' : 'pricing-card'}>
      {plan.badge ? (
        <span
          style={{
            position: 'absolute',
            top: '-0.75rem',
            left: '2.25rem',
            display: 'inline-block',
            fontFamily: MONO,
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-full, 9999px)',
            color: highlighted ? PRIMARY : ON_PRIMARY,
            background: highlighted ? ON_PRIMARY : PRIMARY,
            boxShadow: 'var(--shadow-md, 0 1px 3px rgba(0,0,0,0.08))',
          }}
        >
          {plan.badge}
        </span>
      ) : null}

      {plan.name ? (
        <h3
          style={{
            fontFamily: DISPLAY,
            fontSize: '1.25rem',
            fontWeight: 700,
            color: titleColor,
            margin: '0 0 0.5rem',
            letterSpacing: '-0.01em',
          }}
        >
          {plan.name}
        </h3>
      ) : null}

      {plan.description ? (
        <p
          style={{
            fontFamily: BODY,
            fontSize: '0.9375rem',
            lineHeight: 1.55,
            color: descColor,
            margin: '0 0 1.75rem',
            minHeight: '2.9rem',
          }}
        >
          {plan.description}
        </p>
      ) : null}

      {price ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <span
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(2.5rem, 4vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: titleColor,
            }}
          >
            {price}
          </span>
          {suffix ? (
            <span
              style={{
                fontFamily: BODY,
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: highlighted ? 'rgb(255 255 255 / 0.7)' : INK_SOFT,
              }}
            >
              {suffix}
            </span>
          ) : null}
        </div>
      ) : null}

      {plan.ctaText ? (
        <a
          href={plan.ctaUrl || '#'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1.75rem',
            fontFamily: DISPLAY,
            fontSize: '0.9375rem',
            fontWeight: 700,
            padding: '0.9rem 1.5rem',
            borderRadius: 'var(--radius-button, 0.375rem)',
            textDecoration: 'none',
            transition: 'opacity var(--transition-fast, 150ms) ease, border-color 150ms ease, background-color 150ms ease',
            background: highlighted ? ON_PRIMARY : PRIMARY,
            color: highlighted ? PRIMARY : ON_PRIMARY,
            border: '2px solid transparent',
            boxShadow: highlighted ? 'var(--shadow-button, none)' : 'var(--shadow-button, none)',
          }}
        >
          {plan.ctaText}
          <span aria-hidden>&rarr;</span>
        </a>
      ) : null}

      {(features.length > 0 || notIncluded.length > 0) ? (
        <ul
          style={{
            listStyle: 'none',
            margin: '2rem 0 0',
            padding: '1.75rem 0 0',
            borderTop: `1px solid ${dividerColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {features.map((f, i) => (
            <li
              key={`f-${i}`}
              style={{
                display: 'flex',
                gap: '0.65rem',
                fontFamily: BODY,
                fontSize: '0.9375rem',
                lineHeight: 1.45,
                color: featColor,
              }}
            >
              <Check on={on} />
              <span>{f}</span>
            </li>
          ))}
          {notIncluded.map((f, i) => (
            <li
              key={`n-${i}`}
              style={{
                display: 'flex',
                gap: '0.65rem',
                fontFamily: BODY,
                fontSize: '0.9375rem',
                lineHeight: 1.45,
                color: featOffColor,
              }}
            >
              <Dash on={on} />
              <span style={{ textDecoration: 'line-through', textDecorationColor: featOffColor }}>{f}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PricingTable({
  eyebrow,
  headline,
  headlineEmphasis,
  subheadline,
  plans,
  monthlyLabel = 'Mensual',
  annualLabel = 'Anual',
  annualNote,
  appearance,
}: PricingTableProps) {
  const safePlans = useMemo(
    () => (plans ?? []).filter((p) => p && (p.name || p.price || (p.features?.length ?? 0) > 0)),
    [plans],
  )
  const hasAnnual = useMemo(() => safePlans.some((p) => Boolean(p.annualPrice)), [safePlans])

  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const groupId = useId()

  if (safePlans.length === 0) return null

  // Asymmetric tracks: keep cards comfortable, let the grid breathe under 3.
  const count = safePlans.length
  const minCol = count >= 4 ? '15rem' : '17rem'

  return (
    <Section appearance={appearance} background="paper">
      <Container size="xl">
        {(eyebrow || headline || headlineEmphasis || subheadline) ? (
          <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto' }}>
            {eyebrow ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Eyebrow rule={false}>{eyebrow}</Eyebrow>
              </div>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Headline text={headline} emphasis={headlineEmphasis} />
            </div>
            {subheadline ? (
              <p
                style={{
                  fontFamily: BODY,
                  fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
                  lineHeight: 1.65,
                  color: INK_SOFT,
                  margin: '0 auto',
                  maxWidth: '40rem',
                }}
              >
                {subheadline}
              </p>
            ) : null}
          </div>
        ) : null}

        {hasAnnual ? (
          <BillingToggle
            billing={billing}
            setBilling={setBilling}
            monthlyLabel={monthlyLabel}
            annualLabel={annualLabel}
            annualNote={annualNote}
            groupId={groupId}
          />
        ) : null}

        <div
          className="pricing-grid"
          style={{
            display: 'grid',
            gap: '1.5rem',
            marginTop: '3.5rem',
            alignItems: 'center',
          }}
        >
          {safePlans.map((plan, i) => (
            <PlanCard key={plan.name ?? i} plan={plan} billing={billing} />
          ))}
        </div>
      </Container>

      {/* Responsive collapse: tighten to two-up, then single column on phones. */}
      <style>{`
        .pricing-grid {
          --pricing-min: ${minCol};
          grid-template-columns: repeat(${count}, minmax(0, 1fr));
        }
        @media (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: repeat(auto-fit, minmax(var(--pricing-min), 1fr));
          }
        }
        @media (max-width: 680px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
        .pricing-card-featured:hover,
        .pricing-card:hover { box-shadow: var(--shadow-xl, 0 10px 40px rgba(0,0,0,0.12)); }
        .pricing-grid a:focus-visible,
        .pricing-grid button:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 3px;
        }
      `}</style>
    </Section>
  )
}
