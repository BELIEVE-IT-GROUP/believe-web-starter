/**
 * ContentSplit — split-content.custom
 *
 * Text + image side by side, position toggleable via imagePosition.
 * Body richtext rendered as plain paragraphs (Lexical or string, with grace).
 * Server Component.
 */

import type { CSSProperties } from 'react'

import { Button, Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance, CtaLink, MediaRef, RichText } from './types'

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ContentSplitProps {
  eyebrow?: string
  headline?: string
  body?: RichText
  image?: MediaRef
  imagePosition?: 'left' | 'right'
  ctas?: CtaLink[]
  appearance?: BlockAppearance
  /** Tonal variant: default inherits from Section appearance; 'ink' forces dark. */
  tone?: 'paper' | 'ink'
}

// ─── Richtext extraction ─────────────────────────────────────────────────────

/**
 * Coerce a Lexical root or plain string into an array of paragraph strings.
 * Never throws — returns [] on unknown shapes.
 */
function extractParagraphs(body: RichText | undefined): string[] {
  if (!body) return []
  if (typeof body === 'string') {
    const trimmed = body.trim()
    return trimmed ? [trimmed] : []
  }
  // Lexical root object: { root: { children: [{ type, children: [{ text }] }] } }
  const root = (body as { root?: { children?: unknown[] } }).root
  if (!root?.children) return []

  const paragraphs: string[] = []
  for (const node of root.children) {
    if (!node || typeof node !== 'object') continue
    const n = node as { type?: string; children?: unknown[] }
    if (n.type !== 'paragraph' || !Array.isArray(n.children)) continue
    const text = n.children
      .map((leaf) => {
        if (typeof leaf === 'string') return leaf
        if (leaf && typeof leaf === 'object') {
          const l = leaf as { text?: unknown }
          return typeof l.text === 'string' ? l.text : ''
        }
        return ''
      })
      .join('')
      .trim()
    if (text) paragraphs.push(text)
  }
  return paragraphs
}

// ─── CTA helpers ─────────────────────────────────────────────────────────────

function ctaLabel(c: CtaLink): string {
  return c.text ?? c.label ?? ''
}

function ctaVariant(c: CtaLink, index: number): 'primary' | 'outline' | 'ghost' {
  if (c.style === 'outline') return 'outline'
  if (c.style === 'ghost') return 'ghost'
  if (c.style === 'secondary') return 'outline'
  return index === 0 ? 'primary' : 'outline'
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ImagePanel({
  image,
  tone,
}: {
  image?: MediaRef
  tone: 'paper' | 'ink'
}) {
  const frameColor =
    tone === 'ink'
      ? 'color-mix(in oklab, var(--brand-paper, #fafaf7) 8%, transparent)'
      : 'color-mix(in oklab, var(--brand-ink, #1a1a1a) 8%, transparent)'

  if (image?.url) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 'var(--radius-card, 0.5rem)',
          overflow: 'hidden',
          border: `1px solid ${frameColor}`,
          // Aspect ratio handled by inner img
          lineHeight: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.alt ?? ''}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
          }}
        />
      </div>
    )
  }

  // Graceful absent-image state: quiet branded placeholder, no broken tag.
  return (
    <div
      aria-hidden
      style={{
        width: '100%',
        minHeight: '22rem',
        borderRadius: 'var(--radius-card, 0.5rem)',
        border: `1px solid ${frameColor}`,
        background:
          'radial-gradient(130% 110% at 85% 10%, color-mix(in oklab, var(--color-primary, #0c3bb9) 14%, transparent) 0%, transparent 58%)',
      }}
    />
  )
}

function CtaRow({ ctas, on }: { ctas: CtaLink[]; on: 'paper' | 'ink' }) {
  if (!ctas.length) return null
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.875rem',
        marginTop: '2.25rem',
      }}
    >
      {ctas.map((c, i) => {
        const label = ctaLabel(c)
        if (!label) return null
        const variant = ctaVariant(c, i)
        return (
          <Button
            key={i}
            href={c.url || '#'}
            variant={variant}
            on={on}
          >
            {label}
            {variant === 'primary' ? <span aria-hidden>&rarr;</span> : null}
          </Button>
        )
      })}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const SPLIT_CLASS = 'content-split-grid'

export function ContentSplit({
  eyebrow,
  headline,
  body,
  image,
  imagePosition = 'right',
  ctas = [],
  appearance,
  tone = 'paper',
}: ContentSplitProps) {
  const paragraphs = extractParagraphs(body)
  const safeCtas = (ctas ?? []).filter((c) => ctaLabel(c))
  const isDark = tone === 'ink'
  const on: 'paper' | 'ink' = isDark ? 'ink' : 'paper'

  const bg = isDark ? 'ink' : 'paper'

  // Typography colors that adapt to tone
  const headlineColor: CSSProperties['color'] = isDark
    ? 'var(--brand-paper, #fafaf7)'
    : 'var(--brand-ink, #1a1a1a)'

  const bodyColor: CSSProperties['color'] = isDark
    ? 'color-mix(in oklab, var(--brand-paper, #fafaf7) 65%, transparent)'
    : 'color-mix(in oklab, var(--brand-ink, #1a1a1a) 68%, transparent)'

  // The image column: first when imagePosition === 'left'
  const imageCol = (
    <div className="content-split-media" style={{ minWidth: 0 }}>
      <ImagePanel image={image} tone={on} />
    </div>
  )

  const textCol = (
    <div
      className="content-split-copy"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 0,
      }}
    >
      {eyebrow ? (
        <div style={{ marginBottom: '1.375rem' }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      ) : null}

      {headline ? (
        <h2
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            lineHeight: 'var(--leading-tight, 1.06)',
            letterSpacing: 'var(--tracking-tight, -0.015em)',
            color: headlineColor,
            margin: 0,
          }}
        >
          {headline}
        </h2>
      ) : null}

      {paragraphs.length > 0 ? (
        <div
          style={{
            marginTop: headline ? '1.375rem' : 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-body, system-ui, sans-serif)',
                fontSize: 'var(--text-body, 1.0625rem)',
                lineHeight: 'var(--leading-body, 1.6)',
                color: bodyColor,
                margin: 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      ) : null}

      <CtaRow ctas={safeCtas} on={on} />
    </div>
  )

  // Accent rule below the section, subtle divider
  const dividerStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 'clamp(1.25rem, 5vw, 3rem)',
    right: 'clamp(1.25rem, 5vw, 3rem)',
    height: '1px',
    background: isDark
      ? 'color-mix(in oklab, var(--brand-paper, #fafaf7) 7%, transparent)'
      : 'color-mix(in oklab, var(--brand-ink, #1a1a1a) 12%, transparent)',
    pointerEvents: 'none',
  }

  return (
    <Section appearance={appearance} background={bg} style={{ position: 'relative' }}>
      <span aria-hidden style={dividerStyle} />
      <Container>
        <div
          className={`${SPLIT_CLASS} ${imagePosition === 'left' ? 'img-left' : 'img-right'}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(2rem, 5vw, 6rem)',
            alignItems: 'center',
          }}
        >
          {imagePosition === 'left' ? (
            <>
              {imageCol}
              {textCol}
            </>
          ) : (
            <>
              {textCol}
              {imageCol}
            </>
          )}
        </div>
      </Container>

      {/* Split layout activates at md and above (mobile-first) */}
      <style>{`
        @media (min-width: 760px) {
          .${SPLIT_CLASS} {
            grid-template-columns: 1fr 1fr;
            gap: clamp(3rem, 6vw, 6rem);
          }
        }
      `}</style>
    </Section>
  )
}
