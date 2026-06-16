/**
 * CaseStudies (case-studies.custom).
 *
 * A responsive grid of case cards. Each case carries an industry tag (brand
 * primary), a Problema block, a Solucion block, and a footer row of results
 * (big green number + label). A small disclaimer sits at the foot of the
 * section.
 *
 * Reference: birdman-landing.html lines 592-629. Ports that section's design
 * and default copy, but every string/datum is an editable prop.
 *
 * Server Component (no interaction). Theme tokens only, no Flowbite. Built
 * theme aware for a DARK target: surfaces derive from --brand-ink, text from
 * --brand-paper, accents from the brand primary, result figures green.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

export interface CaseStudyResult {
  /** Big result number, e.g. "-18%". */
  value?: string
  label?: string
}

export interface CaseStudyItem {
  industry?: string
  problem?: string
  solution?: string
  results?: CaseStudyResult[]
  /** Optional labels so the Problema/Solucion captions stay editable. */
  problemLabel?: string
  solutionLabel?: string
}

export interface CaseStudiesProps {
  eyebrow?: string
  headline?: string
  cases?: CaseStudyItem[]
  /** Small print at the foot of the section. */
  disclaimer?: string
  appearance?: BlockAppearance
}

// ─── Theme-aware color helpers (DARK target) ──────────────────────────────────
// On a dark theme, --brand-paper is the light ink. We tint it for surfaces,
// borders and muted text so the component reads correctly without assuming a
// light background. The rgb(from ...) channel split keeps it token-driven.

const SURFACE = 'color-mix(in oklab, var(--brand-paper, #fafaf7) 4%, transparent)'
const SURFACE_HOVER = 'color-mix(in oklab, var(--brand-paper, #fafaf7) 7%, transparent)'
const BORDER = 'rgb(from var(--brand-paper, #fafaf7) r g b / 0.12)'
const TEXT = 'var(--brand-ink, #f5f5f0)'
const MUTED = 'var(--brand-ink-muted, rgb(from var(--brand-paper, #fafaf7) r g b / 0.7))'
const FAINT = 'rgb(from var(--brand-paper, #fafaf7) r g b / 0.5)'
const PRIMARY = 'var(--color-primary, #00aaff)'
// Result figures are green per spec. Fall back through accent so a brand that
// defines a green accent still wins, then to a neutral green.
const SUCCESS = 'var(--color-success, var(--color-accent, #34d399))'

// ─── Static style atoms ───────────────────────────────────────────────────────

const HEADLINE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
  lineHeight: 1.06,
  letterSpacing: 'var(--tracking-tight, -0.015em)',
  color: TEXT,
  margin: '1.1rem 0 0',
  maxWidth: '20ch',
}

const CARD: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: 'var(--radius-card, 1rem)',
  padding: 'clamp(1.5rem, 3vw, 1.85rem)',
  height: '100%',
}

const IND_TAG: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: PRIMARY,
  background: 'color-mix(in oklab, var(--color-primary, #00aaff) 12%, transparent)',
  border: '1px solid color-mix(in oklab, var(--color-primary, #00aaff) 28%, transparent)',
  borderRadius: 'var(--radius-full, 9999px)',
  padding: '0.35rem 0.8rem',
}

const QA_LABEL: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: TEXT,
  marginBottom: '0.35rem',
}

const QA_BODY: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: '0.9375rem',
  lineHeight: 1.55,
  color: MUTED,
}

const RES_ROW: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '0.625rem',
  marginTop: 'auto',
  paddingTop: '1.1rem',
  borderTop: `1px solid ${BORDER}`,
}

const RES_NUM: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontSize: 'clamp(1.4rem, 2.4vw, 1.7rem)',
  fontWeight: 800,
  lineHeight: 1,
  color: SUCCESS,
  fontVariantNumeric: 'tabular-nums',
}

const RES_LABEL: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: '0.6875rem',
  lineHeight: 1.3,
  color: FAINT,
  marginTop: '0.4rem',
}

const DISCLAIMER: CSSProperties = {
  fontFamily: 'var(--font-body, system-ui, sans-serif)',
  fontSize: '0.75rem',
  lineHeight: 1.5,
  color: FAINT,
  margin: '1.75rem 0 0',
  maxWidth: '54rem',
}

// ─── Defaults (ported verbatim from the reference HTML) ───────────────────────

const DEFAULT_EYEBROW = 'Casos de éxito'
const DEFAULT_HEADLINE = 'Resultados que un director firma con confianza'
const DEFAULT_DISCLAIMER =
  'Cifras ilustrativas para esta propuesta de diseño. Se reemplazan por resultados verificados de clientes reales antes de publicar.'

const DEFAULT_CASES: CaseStudyItem[] = [
  {
    industry: 'Retail',
    problem: 'Múltiples carriers sin control central y costo creciente.',
    solution: 'Administración multi-carrier, dashboard único de KPIs.',
    results: [
      { value: '−18%', label: 'Costo logístico' },
      { value: '−35%', label: 'Incidencias' },
      { value: '+20%', label: 'Productividad' },
    ],
  },
  {
    industry: 'Manufactura',
    problem: 'Procesos manuales y cero visibilidad de planta a cliente.',
    solution: 'Operación inplant, trazabilidad end to end en tiempo real.',
    results: [
      { value: '+22%', label: 'On-time' },
      { value: '−27%', label: 'Tiempos muertos' },
      { value: '100%', label: 'Visibilidad' },
    ],
  },
  {
    industry: 'Ecommerce',
    problem: 'Picos de volumen y última milla sin estandarizar.',
    solution: 'Red de aliados coordinada, alertas automáticas de desviación.',
    results: [
      { value: '−15%', label: 'Costo / envío' },
      { value: '+30%', label: 'Capacidad pico' },
      { value: '−40%', label: 'Reclamos' },
    ],
  },
]

// ─── Card ─────────────────────────────────────────────────────────────────────

function CaseCard({ item }: { item: CaseStudyItem }) {
  const problemLabel = item.problemLabel || 'Problema'
  const solutionLabel = item.solutionLabel || 'Solución'
  const results = (item.results ?? []).filter((r) => r.value || r.label)

  return (
    <article style={CARD} className="cs-card">
      {item.industry ? <span style={IND_TAG}>{item.industry}</span> : null}

      {item.problem ? (
        <p style={QA_BODY}>
          <strong style={QA_LABEL}>{problemLabel}</strong>
          {item.problem}
        </p>
      ) : null}

      {item.solution ? (
        <p style={QA_BODY}>
          <strong style={QA_LABEL}>{solutionLabel}</strong>
          {item.solution}
        </p>
      ) : null}

      {results.length ? (
        <div style={RES_ROW}>
          {results.slice(0, 3).map((r, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              {r.value ? <div style={RES_NUM}>{r.value}</div> : null}
              {r.label ? <div style={RES_LABEL}>{r.label}</div> : null}
            </div>
          ))}
        </div>
      ) : null}
    </article>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CaseStudies({
  eyebrow,
  headline,
  cases,
  disclaimer,
  appearance,
}: CaseStudiesProps) {
  const resolvedEyebrow = eyebrow ?? DEFAULT_EYEBROW
  const resolvedHeadline = headline ?? DEFAULT_HEADLINE
  const resolvedDisclaimer = disclaimer ?? DEFAULT_DISCLAIMER
  const resolvedCases = (cases && cases.length ? cases : DEFAULT_CASES).filter(
    (c) => c.industry || c.problem || c.solution || (c.results && c.results.length),
  )

  return (
    <Section appearance={appearance} background="ink">
      <Container>
        {resolvedEyebrow ? <Eyebrow>{resolvedEyebrow}</Eyebrow> : null}
        {resolvedHeadline ? <h2 style={HEADLINE}>{resolvedHeadline}</h2> : null}

        {resolvedCases.length ? (
          <div
            className="cs-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 'clamp(1rem, 2vw, 1.25rem)',
              marginTop: 'clamp(2.25rem, 4vw, 3rem)',
            }}
          >
            {resolvedCases.map((item, i) => (
              <CaseCard key={i} item={item} />
            ))}
          </div>
        ) : null}

        {resolvedDisclaimer ? <p style={DISCLAIMER}>{resolvedDisclaimer}</p> : null}
      </Container>

      {/* Responsive: 3 → 2 → 1 columns. Card hover lift (no JS). */}
      <style>{`
        .cs-card { transition: border-color 200ms ease, background-color 200ms ease, transform 200ms ease; }
        @media (hover: hover) {
          .cs-card:hover {
            border-color: ${BORDER.replace('0.12', '0.24')};
            background: ${SURFACE_HOVER};
            transform: translateY(-2px);
          }
        }
        @media (max-width: 900px) {
          .cs-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 600px) {
          .cs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Section>
  )
}
