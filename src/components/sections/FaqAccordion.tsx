'use client'

/**
 * FaqAccordion — faq.custom (blockType: faq, templateId: faq.custom).
 *
 * Accessible accordion: each item is a <button> with aria-expanded controlling
 * a <div role="region"> answer panel. Smooth height animation via max-height
 * CSS transition. No side-stripe borders. No gradient text. No glassmorphism.
 *
 * Layout: constrained center column (md) with a generous left-margin eyebrow
 * block, then the accordion list below. Asymmetric spacing gives rhythm.
 */

import { useState } from 'react'

import type { BlockAppearance, RichText } from './types'
import { Container, Eyebrow, Section } from './_primitives'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FaqAccordionItem {
  question?: string
  answer?: RichText
}

export interface FaqAccordionProps {
  eyebrow?: string
  headline?: string
  subheadline?: string
  items?: FaqAccordionItem[]
  appearance?: BlockAppearance
}

// ─── Rich-text → plain string ─────────────────────────────────────────────────

function extractText(rt: RichText | undefined): string {
  if (!rt) return ''
  if (typeof rt === 'string') return rt
  // Lexical root extraction: walk children recursively
  function walk(node: unknown): string {
    if (!node || typeof node !== 'object') return ''
    const n = node as Record<string, unknown>
    if (typeof n.text === 'string') return n.text
    if (Array.isArray(n.children)) {
      return (n.children as unknown[]).map(walk).join(' ')
    }
    if (n.root && typeof n.root === 'object') return walk(n.root)
    return ''
  }
  return walk(rt).replace(/\s+/g, ' ').trim()
}

// ─── ChevronIcon ──────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        flexShrink: 0,
        transition: `transform var(--transition-duration, 300ms) var(--transition-easing, cubic-bezier(0.4,0,0.2,1))`,
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        color: 'var(--color-primary, #0c3bb9)',
      }}
    >
      <path
        d="M4 6.5L9 11.5L14 6.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── AccordionItem ────────────────────────────────────────────────────────────

function AccordionItem({
  question,
  answer,
  index,
  open,
  onToggle,
  total,
}: {
  question: string
  answer: string
  index: number
  open: boolean
  onToggle: () => void
  total: number
}) {
  const isLast = index === total - 1
  const itemId = `faq-item-${index}`
  const answerId = `faq-answer-${index}`

  return (
    <div
      style={{
        borderBottom: isLast
          ? 'none'
          : `1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.10)`,
      }}
    >
      {/* Trigger */}
      <button
        id={itemId}
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          padding: 'clamp(1.25rem, 2.5vw, 1.625rem) 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-display, system-ui, sans-serif)',
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: 'var(--tracking-tight, -0.015em)',
          color: open
            ? 'var(--color-primary, #0c3bb9)'
            : 'var(--brand-ink, #1a1a1a)',
          transition: `color var(--transition-fast, 150ms) ease`,
          outline: 'none',
        }}
        className="faq-trigger"
      >
        <span>{question}</span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2rem',
            height: '2rem',
            flexShrink: 0,
            borderRadius: 'var(--radius-full, 9999px)',
            background: open
              ? 'var(--color-primary-muted, rgba(12,59,185,0.12))'
              : 'rgb(from var(--brand-ink, #1a1a1a) r g b / 0.05)',
            transition: `background var(--transition-fast, 150ms) ease`,
          }}
        >
          <ChevronIcon open={open} />
        </span>
      </button>

      {/* Answer panel: max-height transition animates open/close smoothly */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={itemId}
        style={{
          overflow: 'hidden',
          maxHeight: open ? '600px' : '0',
          transition: `max-height var(--transition-duration, 300ms) var(--transition-easing, cubic-bezier(0.4,0,0.2,1))`,
        }}
      >
        <div
          style={{
            paddingBottom: 'clamp(1.25rem, 2.5vw, 1.625rem)',
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
            fontSize: 'var(--text-body, 1.0625rem)',
            lineHeight: 'var(--leading-body, 1.6)',
            color: 'var(--brand-ink-muted, #6b6b65)',
            maxWidth: '54ch',
          }}
        >
          {answer}
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function FaqAccordion({
  eyebrow,
  headline,
  subheadline,
  items = [],
  appearance,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const safeItems = (items ?? []).filter((it) => it.question)

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i))
  }

  return (
    <Section appearance={appearance} background="paper">
      {/* Focus-visible ring for keyboard nav */}
      <style>{`
        .faq-trigger:focus-visible {
          box-shadow: 0 0 0 3px var(--color-primary-muted, rgba(12,59,185,0.22));
          border-radius: var(--radius-sm, 0.25rem);
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
      `}</style>

      <Container size="md">
        {/* Header block — left-anchored, breathing room below */}
        <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          {eyebrow ? (
            <div style={{ marginBottom: '1.25rem' }}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          ) : null}

          {headline ? (
            <h2
              style={{
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.625rem)',
                fontWeight: 800,
                lineHeight: 'var(--leading-tight, 1.06)',
                letterSpacing: 'var(--tracking-tight, -0.015em)',
                color: 'var(--brand-ink, #1a1a1a)',
                margin: '0 0 1rem',
                maxWidth: '22ch',
              }}
            >
              {headline}
            </h2>
          ) : null}

          {subheadline ? (
            <p
              style={{
                fontFamily: 'var(--font-body, system-ui, sans-serif)',
                fontSize: 'clamp(1rem, 1.4vw, 1.0625rem)',
                lineHeight: 'var(--leading-body, 1.6)',
                color: 'var(--brand-ink-muted, #6b6b65)',
                margin: 0,
                maxWidth: '44ch',
              }}
            >
              {subheadline}
            </p>
          ) : null}
        </div>

        {/* Accordion list */}
        {safeItems.length > 0 ? (
          <div
            role="list"
            style={{
              borderTop: `1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.10)`,
            }}
          >
            {safeItems.map((item, i) => (
              <div key={i} role="listitem">
                <AccordionItem
                  question={item.question!}
                  answer={extractText(item.answer)}
                  index={i}
                  open={openIndex === i}
                  onToggle={() => toggle(i)}
                  total={safeItems.length}
                />
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
