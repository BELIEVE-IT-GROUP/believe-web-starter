/**
 * ResourceCards: resource-cards.custom (FULL IMPLEMENTATION).
 *
 * A 3-column grid of link cards. Each card carries a type tag (brand primary),
 * a title, a description, and a "go" affordance with an arrow. On hover the card
 * lifts and its border shifts to the brand primary.
 *
 * Reference: birdman-landing.html lines 720-733.
 *
 * Server Component (no interaction). Theme tokens only, no Flowbite.
 * Theme: DARK (brand-paper is dark, brand-ink is light). All tokens are
 * used without assuming a light background.
 */

import type { CSSProperties } from 'react'

import { Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance } from './types'

export interface ResourceCardItem {
  /** Resource type tag, e.g. "Diagnostico", "Herramienta". */
  type?: string
  title?: string
  description?: string
  /** CTA label, e.g. "Descargar", "Leer". */
  ctaText?: string
  url?: string
}

export interface ResourceCardsProps {
  eyebrow?: string
  headline?: string
  items?: ResourceCardItem[]
  appearance?: BlockAppearance
  /** Optional column count override. Defaults to 3. */
  columns?: 2 | 3 | 4
}

// ─── Default content (mirrors birdman-landing.html lines 724-731) ─────────────

const DEFAULT_ITEMS: ResourceCardItem[] = [
  {
    type: 'Diagnostico',
    title: 'Diagnostico gratuito de tu operacion',
    description: 'Hallazgos accionables sobre costo, servicio y procesos.',
    ctaText: 'Solicitarlo',
    url: '#diagnostico',
  },
  {
    type: 'Herramienta',
    title: 'Calculadora de ahorro logistico',
    description: 'Estima tu potencial de ahorro anual en un minuto.',
    ctaText: 'Calcular',
    url: '#calculadora',
  },
  {
    type: 'Checklist',
    title: 'Checklist de eficiencia logistica',
    description: '15 puntos para auditar tu operacion hoy mismo.',
    ctaText: 'Descargar',
    url: '#diagnostico',
  },
  {
    type: 'Estudio',
    title: 'Estudio de benchmark del sector',
    description: 'Compara tus indicadores contra empresas similares.',
    ctaText: 'Descargar',
    url: '#diagnostico',
  },
  {
    type: 'Guia',
    title: 'Guia de optimizacion de almacenes',
    description: 'Mejores practicas para reducir tiempos y errores.',
    ctaText: 'Descargar',
    url: '#diagnostico',
  },
  {
    type: 'Whitepaper',
    title: 'Como reducir el costo logistico total',
    description: 'El marco que usamos para bajar costos de forma sostenida.',
    ctaText: 'Descargar',
    url: '#diagnostico',
  },
]

// ─── Styles ───────────────────────────────────────────────────────────────────

const SECTION_HEADER: CSSProperties = {
  marginBottom: 'clamp(2.5rem, 4vw, 3.75rem)',
}

const HEADLINE: CSSProperties = {
  fontFamily: 'var(--font-display, system-ui, sans-serif)',
  fontWeight: 800,
  fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
  lineHeight: 1.06,
  letterSpacing: 'var(--tracking-tight, -0.015em)',
  color: 'var(--brand-ink, #f5f5f0)',
  margin: '1.1rem 0 0',
}

// Card styles are injected via a <style> block so hover works server-side
// (CSS :hover, no JS required).
const CARD_GRID_CLASS = 'rc-grid'
const CARD_CLASS = 'rc-card'

// ─── Single card ─────────────────────────────────────────────────────────────

interface CardProps {
  item: ResourceCardItem
  index: number
}

function ResourceCard({ item, index }: CardProps) {
  if (!item.title && !item.type) return null

  return (
    <a
      href={item.url || '#'}
      className={CARD_CLASS}
      // data-index used for staggered animation hints via CSS
      data-index={index}
    >
      {item.type ? (
        <span className="rc-tag" aria-label={`Tipo: ${item.type}`}>
          {item.type}
        </span>
      ) : null}

      {item.title ? (
        <h3 className="rc-title">{item.title}</h3>
      ) : null}

      {item.description ? (
        <p className="rc-desc">{item.description}</p>
      ) : null}

      {item.ctaText ? (
        <span className="rc-go" aria-hidden="false">
          {item.ctaText}
          <span className="rc-arrow" aria-hidden="true">
            {/* Right arrow, rotates on hover via CSS */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M1 7h12M7 1l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      ) : null}
    </a>
  )
}

// ─── Scoped CSS (server-renderable, no JS) ───────────────────────────────────

function ResourceCardsStyles({ columns }: { columns: number }) {
  const colTemplate =
    columns === 2
      ? 'repeat(2, minmax(0, 1fr))'
      : columns === 4
        ? 'repeat(4, minmax(0, 1fr))'
        : 'repeat(3, minmax(0, 1fr))'

  return (
    <style>{`
      .${CARD_GRID_CLASS} {
        display: grid;
        grid-template-columns: ${colTemplate};
        gap: clamp(1rem, 2vw, 1.5rem);
      }

      @media (max-width: 900px) {
        .${CARD_GRID_CLASS} {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 540px) {
        .${CARD_GRID_CLASS} {
          grid-template-columns: 1fr;
        }
      }

      .${CARD_CLASS} {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        padding: clamp(1.5rem, 3vw, 2rem);
        background: color-mix(in oklab, var(--brand-paper, #18181b) 70%, var(--color-primary, #0c3bb9) 30%);
        border: 1px solid color-mix(in oklab, var(--brand-ink, #f5f5f0) 10%, transparent);
        border-radius: var(--radius-card, 0.5rem);
        text-decoration: none;
        color: inherit;
        transition:
          transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1),
          border-color 200ms ease,
          background 200ms ease;
        cursor: pointer;
        outline-offset: 3px;
      }

      .${CARD_CLASS}:focus-visible {
        outline: 2px solid var(--color-primary, #0c3bb9);
        outline-offset: 3px;
      }

      .${CARD_CLASS}:hover,
      .${CARD_CLASS}:focus-visible {
        transform: translateY(-4px);
        box-shadow: var(--shadow-card-hover, 0 16px 40px -8px rgb(0 0 0 / 0.5));
        border-color: var(--color-primary, #0c3bb9);
        background: color-mix(in oklab, var(--color-primary, #0c3bb9) 6%, var(--brand-paper, #18181b) 94%);
      }

      .rc-tag {
        display: inline-block;
        font-family: var(--font-mono, ui-monospace, monospace);
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--color-primary, #0c3bb9);
        background: color-mix(in oklab, var(--color-primary, #0c3bb9) 12%, transparent);
        padding: 0.3rem 0.65rem;
        border-radius: var(--radius-full, 9999px);
        margin-bottom: 0.5rem;
        align-self: flex-start;
        transition: background 200ms ease;
      }

      .${CARD_CLASS}:hover .rc-tag,
      .${CARD_CLASS}:focus-visible .rc-tag {
        background: color-mix(in oklab, var(--color-primary, #0c3bb9) 20%, transparent);
      }

      .rc-title {
        font-family: var(--font-display, system-ui, sans-serif);
        font-size: clamp(1rem, 1.3vw, 1.1875rem);
        font-weight: 700;
        line-height: 1.25;
        letter-spacing: var(--tracking-tight, -0.01em);
        color: var(--brand-ink, #f5f5f0);
        margin: 0;
        flex-grow: 1;
      }

      .rc-desc {
        font-family: var(--font-body, system-ui, sans-serif);
        font-size: 0.9375rem;
        line-height: 1.6;
        color: color-mix(in oklab, var(--brand-ink, #f5f5f0) 62%, transparent);
        margin: 0.25rem 0 0;
        flex-grow: 1;
      }

      .rc-go {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: var(--font-display, system-ui, sans-serif);
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--color-primary, #0c3bb9);
        margin-top: auto;
        padding-top: 1rem;
        transition: gap 180ms ease, color 180ms ease;
      }

      .${CARD_CLASS}:hover .rc-go,
      .${CARD_CLASS}:focus-visible .rc-go {
        gap: 0.75rem;
        color: color-mix(in oklab, var(--color-primary, #0c3bb9) 100%, white 15%);
      }

      .rc-arrow {
        display: inline-flex;
        align-items: center;
        transition: transform 180ms ease;
      }

      .${CARD_CLASS}:hover .rc-arrow,
      .${CARD_CLASS}:focus-visible .rc-arrow {
        transform: translateX(3px);
      }
    `}</style>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ResourceCards({
  eyebrow = 'Recursos',
  headline = 'Herramientas para decidir con datos',
  items,
  appearance,
  columns = 3,
}: ResourceCardsProps) {
  const safeItems = (items?.length ? items : DEFAULT_ITEMS).filter(
    (item) => item.title || item.type,
  )
  const safeColumns = columns ?? 3

  return (
    <>
      <ResourceCardsStyles columns={safeColumns} />
      <Section appearance={appearance} background="ink">
        <Container>
          {/* Section header */}
          <div style={SECTION_HEADER}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {headline ? <h2 style={HEADLINE}>{headline}</h2> : null}
          </div>

          {/* Card grid */}
          {safeItems.length > 0 ? (
            <div
              className={CARD_GRID_CLASS}
              role="list"
              aria-label={headline || 'Recursos'}
            >
              {safeItems.map((item, i) => (
                <div key={i} role="listitem">
                  <ResourceCard item={item} index={i} />
                </div>
              ))}
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
