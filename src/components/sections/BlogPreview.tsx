/**
 * BlogPreview — blog-list.custom (templateId: blog-list.custom, blockType: blog-list)
 *
 * Article cards section. Three layout modes:
 *   grid     — balanced 3-column card grid (default)
 *   list     — horizontal rows with larger image (editorial feel)
 *   featured — oversized first article, smaller cards for the rest
 *
 * Posts arrive via props. Mock data renders in the showcase when posts is empty.
 * Server Component — no interaction required.
 */

import type { CSSProperties } from 'react'

import { Button, Container, Eyebrow, Section } from './_primitives'
import type { BlockAppearance, CtaLink, MediaRef } from './types'

// ─── Re-exported so the registry can reference the shape ─────────────────────

export interface BlogPreviewPost {
  title?: string
  slug?: string
  excerpt?: string
  coverImage?: MediaRef
  category?: string
  publishedAt?: string
  readTime?: string
}

export interface BlogPreviewProps {
  headline?: string
  count?: number
  layout?: 'grid' | 'list' | 'featured'
  cta?: CtaLink
  posts?: BlogPreviewPost[]
  appearance?: BlockAppearance
  /** Eyebrow label above the headline. Optional design choice. */
  eyebrow?: string
}

// ─── Mock data for showcase / empty state ────────────────────────────────────

const MOCK_POSTS: BlogPreviewPost[] = [
  {
    title: 'El marketing que sobrevive a los algoritmos',
    slug: 'marketing-sobrevive-algoritmos',
    excerpt:
      'Los algoritmos cambian, la atención fluctúa, los formatos mueren. Lo que permanece: marcas con un punto de vista claro y audiencias que lo eligieron.',
    category: 'Estrategia',
    publishedAt: '2026-06-10',
    readTime: '6 min',
  },
  {
    title: 'Tres preguntas antes de lanzar un anuncio',
    slug: 'tres-preguntas-antes-anuncio',
    excerpt:
      'La mayoría falla antes de publicar. No por el presupuesto ni el creativo, sino por no haber respondido qué quiere la persona que lo va a ver.',
    category: 'Paid Media',
    publishedAt: '2026-06-05',
    readTime: '4 min',
  },
  {
    title: 'Marca vs. Producto: por qué confundirlos sale caro',
    slug: 'marca-vs-producto',
    excerpt:
      'Un producto se compra una vez. Una marca se elige repetidamente. La diferencia no está en el empaque, está en lo que prometes cuando nadie te está mirando.',
    category: 'Branding',
    publishedAt: '2026-05-28',
    readTime: '8 min',
  },
  {
    title: 'El error de escalar antes de entender',
    slug: 'error-escalar-antes-entender',
    excerpt:
      'Más presupuesto no cura una propuesta débil. Antes de acelerar el motor, conviene saber hacia dónde va el vehículo.',
    category: 'Estrategia',
    publishedAt: '2026-05-20',
    readTime: '5 min',
  },
  {
    title: 'Creatividad con datos: cómo reconciliar los dos mundos',
    slug: 'creatividad-con-datos',
    excerpt:
      'Los mejores equipos no eligen entre data e intuición. Usan los números para saber dónde mirar, y la intuición para saber qué crear.',
    category: 'Creatividad',
    publishedAt: '2026-05-14',
    readTime: '7 min',
  },
  {
    title: 'Cuándo una campaña "fracasada" es la más valiosa',
    slug: 'campana-fracasada-mas-valiosa',
    excerpt:
      'Las métricas que no se movieron también cuentan. A veces el aprendizaje más útil viene de la prueba que no funcionó.',
    category: 'Paid Media',
    publishedAt: '2026-05-07',
    readTime: '5 min',
  },
]

// ─── Utilities ───────────────────────────────────────────────────────────────

function formatDate(iso?: string): string {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso))
  } catch {
    return iso
  }
}

const CATEGORY_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--color-primary, #0c3bb9)',
  background: 'var(--color-primary-muted, rgba(12,59,185,0.10))',
  padding: '0.275rem 0.625rem',
  borderRadius: 'var(--radius-full, 9999px)',
}

const META_STYLE: CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '0.6875rem',
  fontWeight: 500,
  color: 'var(--brand-ink-muted, #6b6b65)',
  letterSpacing: '0.04em',
}

// ─── Cover image / placeholder ───────────────────────────────────────────────

function CoverImage({
  src,
  alt,
  aspectRatio = '16 / 9',
  style,
}: {
  src?: string
  alt?: string
  aspectRatio?: string
  style?: CSSProperties
}) {
  const base: CSSProperties = {
    width: '100%',
    aspectRatio,
    overflow: 'hidden',
    borderRadius: 'var(--radius-card, 0.5rem) var(--radius-card, 0.5rem) 0 0',
    background: 'color-mix(in oklab, var(--color-primary, #0c3bb9) 8%, var(--brand-paper, #fafaf7))',
    flexShrink: 0,
    ...style,
  }

  if (src) {
    return (
      <div style={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  // Branded placeholder (no broken img)
  return (
    <div style={base} aria-hidden>
      <svg
        viewBox="0 0 480 270"
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-hidden
      >
        <defs>
          <radialGradient id="blog-placeholder-glow" cx="70%" cy="30%" r="55%">
            <stop offset="0%" stopColor="var(--color-primary, #0c3bb9)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="480" height="270" fill="url(#blog-placeholder-glow)" />
        <rect x="184" y="115" width="112" height="40" rx="4" fill="var(--color-primary, #0c3bb9)" fillOpacity="0.12" />
        <rect x="204" y="131" width="72" height="8" rx="2" fill="var(--color-primary, #0c3bb9)" fillOpacity="0.18" />
      </svg>
    </div>
  )
}

// ─── Card shared header (category + meta row) ────────────────────────────────

function CardMeta({ post }: { post: BlogPreviewPost }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      {post.category ? <span style={CATEGORY_STYLE}>{post.category}</span> : null}
      {post.publishedAt || post.readTime ? (
        <span style={{ ...META_STYLE, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
          {post.publishedAt && post.readTime ? (
            <span aria-hidden style={{ color: 'var(--brand-ink-muted, #6b6b65)', opacity: 0.4 }}>
              &bull;
            </span>
          ) : null}
          {post.readTime ? <span>{post.readTime} de lectura</span> : null}
        </span>
      ) : null}
    </div>
  )
}

// ─── Grid card (compact, image on top) ───────────────────────────────────────

function GridCard({ post }: { post: BlogPreviewPost }) {
  const href = post.slug ? `/${post.slug}` : undefined

  const content = (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 'var(--radius-card, 0.5rem)',
        background: 'var(--brand-paper, #fafaf7)',
        border: '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)',
        overflow: 'hidden',
        transition: 'box-shadow var(--transition-fast, 150ms) ease',
      }}
      className="blog-grid-card"
    >
      <CoverImage src={post.coverImage?.url} alt={post.coverImage?.alt || post.title} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--card-padding, 1.75rem)',
          gap: '0.875rem',
        }}
      >
        <CardMeta post={post} />
        {post.title ? (
          <h3
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: 'clamp(1.125rem, 1.8vw, 1.3125rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: 'var(--tracking-tight, -0.015em)',
              color: 'var(--brand-ink, #1a1a1a)',
              margin: 0,
            }}
          >
            {post.title}
          </h3>
        ) : null}
        {post.excerpt ? (
          <p
            style={{
              fontFamily: 'var(--font-body, system-ui, sans-serif)',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--brand-ink-muted, #6b6b65)',
              margin: 0,
              flex: 1,
            }}
          >
            {post.excerpt}
          </p>
        ) : null}
        {href ? (
          <span
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--color-primary, #0c3bb9)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: 'auto',
              paddingTop: '0.5rem',
            }}
          >
            Leer artículo <span aria-hidden>&rarr;</span>
          </span>
        ) : null}
      </div>
    </article>
  )

  if (href) {
    return (
      <a href={href} className="blog-grid-link" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {content}
      </a>
    )
  }
  return content
}

// ─── List card (horizontal: image left, text right) ──────────────────────────

function ListCard({ post, index }: { post: BlogPreviewPost; index: number }) {
  const href = post.slug ? `/${post.slug}` : undefined
  const isEven = index % 2 === 0

  const content = (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '14rem 1fr',
        gap: '2rem',
        alignItems: 'center',
        padding: '2rem 0',
        borderBottom: '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)',
      }}
      className="blog-list-card"
    >
      <CoverImage
        src={post.coverImage?.url}
        alt={post.coverImage?.alt || post.title}
        aspectRatio="4 / 3"
        style={{
          borderRadius: 'var(--radius-card, 0.5rem)',
          order: isEven ? 0 : 1,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', order: isEven ? 1 : 0 }}>
        <CardMeta post={post} />
        {post.title ? (
          <h3
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: 'var(--tracking-tight, -0.015em)',
              color: 'var(--brand-ink, #1a1a1a)',
              margin: 0,
            }}
          >
            {post.title}
          </h3>
        ) : null}
        {post.excerpt ? (
          <p
            style={{
              fontFamily: 'var(--font-body, system-ui, sans-serif)',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--brand-ink-muted, #6b6b65)',
              margin: 0,
            }}
          >
            {post.excerpt}
          </p>
        ) : null}
        {href ? (
          <span
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--color-primary, #0c3bb9)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: '0.25rem',
            }}
          >
            Leer artículo <span aria-hidden>&rarr;</span>
          </span>
        ) : null}
      </div>
    </article>
  )

  if (href) {
    return (
      <a href={href} className="blog-list-link" style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </a>
    )
  }
  return content
}

// ─── Featured card (hero-scale, full-bleed image) ────────────────────────────

function FeaturedCard({ post }: { post: BlogPreviewPost }) {
  const href = post.slug ? `/${post.slug}` : undefined

  const content = (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(1.5rem, 4vw, 3.5rem)',
        alignItems: 'center',
        borderRadius: 'var(--radius-card, 0.5rem)',
        background: 'var(--brand-paper, #fafaf7)',
        border: '1px solid rgb(from var(--brand-ink, #1a1a1a) r g b / 0.08)',
        overflow: 'hidden',
        marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
      }}
      className="blog-featured-card"
    >
      <CoverImage
        src={post.coverImage?.url}
        alt={post.coverImage?.alt || post.title}
        aspectRatio="4 / 3"
        style={{ borderRadius: 0, aspectRatio: '4 / 3' }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          paddingLeft: 0,
        }}
      >
        <CardMeta post={post} />
        {post.title ? (
          <h3
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: 'clamp(1.5rem, 2.8vw, 2.125rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: 'var(--tracking-tight, -0.015em)',
              color: 'var(--brand-ink, #1a1a1a)',
              margin: 0,
            }}
          >
            {post.title}
          </h3>
        ) : null}
        {post.excerpt ? (
          <p
            style={{
              fontFamily: 'var(--font-body, system-ui, sans-serif)',
              fontSize: 'clamp(0.9375rem, 1.2vw, 1.0625rem)',
              lineHeight: 1.7,
              color: 'var(--brand-ink-muted, #6b6b65)',
              margin: 0,
            }}
          >
            {post.excerpt}
          </p>
        ) : null}
        {href ? (
          <a
            href={href}
            className="blog-featured-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: 'var(--color-on-primary, #ffffff)',
              background: 'var(--color-primary, #0c3bb9)',
              padding: '0.875rem 1.5rem',
              borderRadius: 'var(--radius-button, 0.375rem)',
              textDecoration: 'none',
              marginTop: '0.5rem',
              alignSelf: 'flex-start',
              transition: 'opacity var(--transition-fast, 150ms) ease',
            }}
          >
            Leer artículo <span aria-hidden>&rarr;</span>
          </a>
        ) : null}
      </div>
    </article>
  )

  return content
}

// ─── Section header ──────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  headline,
  cta,
}: {
  eyebrow?: string
  headline?: string
  cta?: CtaLink
}) {
  if (!eyebrow && !headline) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '2rem',
        flexWrap: 'wrap',
        marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
      }}
    >
      <div>
        {eyebrow ? (
          <div style={{ marginBottom: '1rem' }}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        ) : null}
        {headline ? (
          <h2
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: 'var(--text-h2, clamp(1.5rem, 3vw, 2.25rem))',
              fontWeight: 800,
              lineHeight: 'var(--leading-tight, 1.06)',
              letterSpacing: 'var(--tracking-tight, -0.015em)',
              color: 'var(--brand-ink, #1a1a1a)',
              margin: 0,
            }}
          >
            {headline}
          </h2>
        ) : null}
      </div>
      {cta?.url && cta?.text ? (
        <div style={{ flexShrink: 0 }}>
          <Button href={cta.url} variant="outline">
            {cta.text}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function BlogPreview({
  headline,
  count,
  layout = 'grid',
  cta,
  posts,
  appearance,
  eyebrow,
}: BlogPreviewProps) {
  // Resolve posts: use provided, fall back to mock
  const allPosts = posts && posts.length > 0 ? posts : MOCK_POSTS
  const limit = count != null && count > 0 ? count : allPosts.length
  const visible = allPosts.slice(0, limit)

  if (visible.length === 0) return null

  // ── Grid layout ────────────────────────────────────────────────────────────
  if (layout === 'grid') {
    return (
      <Section appearance={appearance} background="paper">
        <Container>
          <SectionHeader eyebrow={eyebrow} headline={headline} cta={cta} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 'clamp(1.25rem, 2.5vw, 2rem)',
              alignItems: 'stretch',
            }}
            className="blog-grid"
          >
            {visible.map((post, i) => (
              <GridCard key={post.slug || i} post={post} />
            ))}
          </div>
          {cta?.url && cta?.text && !headline ? (
            <div style={{ textAlign: 'center', marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
              <Button href={cta.url} variant="outline">
                {cta.text}
              </Button>
            </div>
          ) : null}
        </Container>

        {/* Responsive grid breakpoints */}
        <style>{`
          @media (max-width: 900px) {
            .blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          }
          @media (max-width: 560px) {
            .blog-grid { grid-template-columns: 1fr !important; }
          }
          .blog-grid-card:hover {
            box-shadow: var(--shadow-lg, 0 4px 16px rgba(0,0,0,0.10)) !important;
          }
          a.blog-grid-link:focus-visible {
            outline: 2px solid var(--color-primary, #0c3bb9);
            outline-offset: 2px;
          }
        `}</style>
      </Section>
    )
  }

  // ── List layout ────────────────────────────────────────────────────────────
  if (layout === 'list') {
    return (
      <Section appearance={appearance} background="paper">
        <Container size="lg">
          <SectionHeader eyebrow={eyebrow} headline={headline} cta={cta} />
          <div>
            {visible.map((post, i) => (
              <ListCard key={post.slug || i} post={post} index={i} />
            ))}
          </div>
          {cta?.url && cta?.text && !headline ? (
            <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
              <Button href={cta.url} variant="outline">
                {cta.text}
              </Button>
            </div>
          ) : null}
        </Container>

        <style>{`
          @media (max-width: 640px) {
            .blog-list-card {
              grid-template-columns: 1fr !important;
            }
          }
          a.blog-list-link:focus-visible {
            outline: 2px solid var(--color-primary, #0c3bb9);
            outline-offset: 2px;
          }
        `}</style>
      </Section>
    )
  }

  // ── Featured layout ────────────────────────────────────────────────────────
  // First post: large hero card. Rest: compact grid.
  const [featuredPost, ...restPosts] = visible

  return (
    <Section appearance={appearance} background="paper">
      <Container>
        <SectionHeader eyebrow={eyebrow} headline={headline} cta={cta} />

        {/* Featured hero article */}
        {featuredPost ? <FeaturedCard post={featuredPost} /> : null}

        {/* Remaining posts in a compact 2-col grid */}
        {restPosts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 'clamp(1.25rem, 2.5vw, 2rem)',
              alignItems: 'stretch',
            }}
            className="blog-rest-grid"
          >
            {restPosts.map((post, i) => (
              <GridCard key={post.slug || i} post={post} />
            ))}
          </div>
        ) : null}

        {cta?.url && cta?.text && !headline ? (
          <div style={{ textAlign: 'center', marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            <Button href={cta.url} variant="outline">
              {cta.text}
            </Button>
          </div>
        ) : null}
      </Container>

      <style>{`
        .blog-featured-card {
          transition: box-shadow var(--transition-fast, 150ms) ease;
        }
        .blog-featured-card:hover {
          box-shadow: var(--shadow-lg, 0 4px 16px rgba(0,0,0,0.10));
        }
        @media (max-width: 700px) {
          .blog-featured-card {
            grid-template-columns: 1fr !important;
          }
          .blog-featured-card > div:last-child {
            padding-left: clamp(1.5rem, 3vw, 2.5rem) !important;
          }
        }
        @media (max-width: 560px) {
          .blog-rest-grid { grid-template-columns: 1fr !important; }
        }
        .blog-grid-card:hover {
          box-shadow: var(--shadow-lg, 0 4px 16px rgba(0,0,0,0.10)) !important;
        }
        a.blog-grid-link:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
        .blog-featured-cta:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
          opacity: 0.85;
        }
      `}</style>
    </Section>
  )
}
