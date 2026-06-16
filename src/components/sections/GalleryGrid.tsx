'use client'

/**
 * GalleryGrid — gallery.custom
 *
 * Three layouts: masonry | grid | carousel
 * Lightbox on click (useState overlay, Escape to close, accessible).
 * Lazy loading via loading="lazy".
 * Zero hex hardcodes (all via CSS tokens). Zero Flowbite imports.
 */

import { useState, useEffect, useCallback, useRef, type CSSProperties } from 'react'

import type { BlockAppearance, MediaRef } from './types'
import { Container, Eyebrow, Section } from './_primitives'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GalleryGridImage {
  image?: MediaRef
  caption?: string
}

export interface GalleryGridProps {
  headline?: string
  layout?: 'masonry' | 'grid' | 'carousel'
  images?: GalleryGridImage[]
  appearance?: BlockAppearance
  /** Optional eyebrow label shown above headline. */
  eyebrow?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FRAME: CSSProperties = {
  borderRadius: 'var(--radius-card, 0.5rem)',
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
  cursor: 'zoom-in',
  background: 'var(--brand-ink-alpha-05, rgba(26,26,26,0.05))',
}

const IMG_BASE: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform var(--transition-duration, 300ms) var(--transition-easing, cubic-bezier(0.4,0,0.2,1))',
}

// Placeholder when image is absent or broken
function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '12rem',
        background: 'var(--brand-ink-alpha-05, rgba(26,26,26,0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        style={{ color: 'var(--brand-ink-muted, #6b6b65)', opacity: 0.4 }}
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: GalleryGridImage[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const current = images[index]
  const total = images.length
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Save previously focused element so we can restore focus on close
    previousFocusRef.current = document.activeElement as HTMLElement | null
    // Move focus into the lightbox on mount
    closeBtnRef.current?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      // Restore focus to the trigger that opened the lightbox
      previousFocusRef.current?.focus()
    }
  }, [onClose, onPrev, onNext])

  const captionId = `lb-caption-${index}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      aria-describedby={current?.caption ? captionId : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'var(--lightbox-backdrop, rgba(0,0,0,0.92))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 3vw, 2.5rem)',
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        ref={closeBtnRef}
        type="button"
        aria-label="Close image viewer"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'var(--lightbox-btn-bg, rgba(255,255,255,0.10))',
          border: '1px solid var(--lightbox-btn-border, rgba(255,255,255,0.18))',
          borderRadius: 'var(--radius-full, 9999px)',
          width: '2.75rem',
          height: '2.75rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--lightbox-btn-color, rgba(255,255,255,0.85))',
          transition: 'background var(--transition-fast, 150ms)',
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Nav prev */}
      {total > 1 ? (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          style={{
            position: 'absolute',
            left: 'clamp(0.75rem, 2vw, 2rem)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--lightbox-btn-bg, rgba(255,255,255,0.10))',
            border: '1px solid var(--lightbox-btn-border, rgba(255,255,255,0.18))',
            borderRadius: 'var(--radius-full, 9999px)',
            width: '3rem',
            height: '3rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--lightbox-btn-color, rgba(255,255,255,0.85))',
            transition: 'background var(--transition-fast, 150ms)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : null}

      {/* Nav next */}
      {total > 1 ? (
        <button
          type="button"
          aria-label="Next image"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          style={{
            position: 'absolute',
            right: 'clamp(0.75rem, 2vw, 2rem)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--lightbox-btn-bg, rgba(255,255,255,0.10))',
            border: '1px solid var(--lightbox-btn-border, rgba(255,255,255,0.18))',
            borderRadius: 'var(--radius-full, 9999px)',
            width: '3rem',
            height: '3rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--lightbox-btn-color, rgba(255,255,255,0.85))',
            transition: 'background var(--transition-fast, 150ms)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      ) : null}

      {/* Image area — click on img does NOT close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 'min(90vw, 64rem)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {current?.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.image.url}
            alt={current.image.alt || current.caption || ''}
            style={{
              maxWidth: '100%',
              maxHeight: '72vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-card, 0.5rem)',
              boxShadow: 'var(--shadow-xl, 0 10px 40px rgba(0,0,0,0.5))',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            width: '40rem',
            height: '28rem',
            maxWidth: '85vw',
            background: 'var(--brand-paper-alpha-05, rgba(255,255,255,0.05))',
            borderRadius: 'var(--radius-card, 0.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ImagePlaceholder />
          </div>
        )}

        {/* Caption + counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {current?.caption ? (
            <p
              id={captionId}
              style={{
                fontFamily: 'var(--font-body, system-ui, sans-serif)',
                fontSize: '0.875rem',
                color: 'var(--lightbox-caption-color, rgba(255,255,255,0.62))',
                margin: 0,
                lineHeight: 1.5,
                textAlign: 'center',
              }}
            >
              {current.caption}
            </p>
          ) : null}
          {total > 1 ? (
            <span
              aria-live="polite"
              style={{
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                fontSize: '0.75rem',
                color: 'var(--lightbox-counter-color, rgba(255,255,255,0.35))',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {index + 1} / {total}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// ─── Grid layout ──────────────────────────────────────────────────────────────

function GridLayout({ images, onOpen }: { images: GalleryGridImage[]; onOpen: (i: number) => void }) {
  if (!images.length) return null
  return (
    <>
      <div className="gallery-grid-uniform">
        {images.map((item, i) => (
          <button
            key={i}
            type="button"
            aria-label={item.caption || `Open image ${i + 1}`}
            onClick={() => onOpen(i)}
            className="gallery-item-btn"
            style={{ ...FRAME, border: 'none', padding: 0, aspectRatio: '4 / 3', width: '100%' }}
          >
            {item.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image.url}
                alt={item.image.alt || item.caption || ''}
                loading="lazy"
                className="gallery-img"
                style={{ ...IMG_BASE, position: 'absolute', inset: 0 }}
              />
            ) : (
              <ImagePlaceholder />
            )}
            {item.caption ? (
              <div
                aria-hidden
                className="gallery-caption-overlay"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '0.75rem 1rem',
                  background: 'var(--gallery-scrim, linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%))',
                  fontFamily: 'var(--font-body, system-ui, sans-serif)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-on-primary, #ffffff)',
                  lineHeight: 1.4,
                  textAlign: 'left',
                  opacity: 0,
                  transition: 'opacity var(--transition-fast, 150ms)',
                }}
              >
                {item.caption}
              </div>
            ) : null}
          </button>
        ))}
      </div>
      <style>{`
        .gallery-grid-uniform {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(0.5rem, 1.5vw, 1rem);
        }
        @media (max-width: 720px) {
          .gallery-grid-uniform { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 440px) {
          .gallery-grid-uniform { grid-template-columns: 1fr; }
        }
        .gallery-item-btn:hover .gallery-img { transform: scale(1.04); }
        .gallery-item-btn:hover .gallery-caption-overlay { opacity: 1 !important; }
        .gallery-item-btn:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
      `}</style>
    </>
  )
}

// ─── Masonry layout ───────────────────────────────────────────────────────────

function MasonryLayout({ images, onOpen }: { images: GalleryGridImage[]; onOpen: (i: number) => void }) {
  if (!images.length) return null

  // Distribute into 3 columns (left-to-right fill for consistent SSR).
  const cols = 3
  const columns: Array<Array<{ item: GalleryGridImage; originalIndex: number }>> = Array.from({ length: cols }, () => [])
  images.forEach((item, i) => {
    columns[i % cols].push({ item, originalIndex: i })
  })

  return (
    <>
      <div className="gallery-masonry">
        {columns.map((col, ci) => (
          <div key={ci} className="gallery-masonry-col">
            {col.map(({ item, originalIndex }) => (
              <button
                key={originalIndex}
                type="button"
                aria-label={item.caption || `Open image ${originalIndex + 1}`}
                onClick={() => onOpen(originalIndex)}
                className="gallery-item-btn gallery-masonry-item"
                style={{
                  ...FRAME,
                  border: 'none',
                  padding: 0,
                  width: '100%',
                  // Vary aspect ratio so masonry feels organic
                  aspectRatio: originalIndex % 3 === 0 ? '3 / 4' : originalIndex % 3 === 1 ? '4 / 3' : '1 / 1',
                }}
              >
                {item.image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image.url}
                    alt={item.image.alt || item.caption || ''}
                    loading="lazy"
                    className="gallery-img"
                    style={{ ...IMG_BASE, position: 'absolute', inset: 0 }}
                  />
                ) : (
                  <ImagePlaceholder />
                )}
                {item.caption ? (
                  <div
                    aria-hidden
                    className="gallery-caption-overlay"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '0.75rem 1rem',
                      background: 'var(--gallery-scrim, linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 100%))',
                      fontFamily: 'var(--font-body, system-ui, sans-serif)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-on-primary, #ffffff)',
                      lineHeight: 1.4,
                      textAlign: 'left',
                      opacity: 0,
                      transition: 'opacity var(--transition-fast, 150ms)',
                    }}
                  >
                    {item.caption}
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        .gallery-masonry {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(0.5rem, 1.5vw, 1rem);
          align-items: start;
        }
        .gallery-masonry-col {
          display: flex;
          flex-direction: column;
          gap: clamp(0.5rem, 1.5vw, 1rem);
        }
        @media (max-width: 640px) {
          .gallery-masonry { grid-template-columns: repeat(2, 1fr); }
        }
        .gallery-item-btn:hover .gallery-img { transform: scale(1.04); }
        .gallery-item-btn:hover .gallery-caption-overlay { opacity: 1 !important; }
        .gallery-item-btn:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
      `}</style>
    </>
  )
}

// ─── Carousel layout ──────────────────────────────────────────────────────────

function CarouselLayout({ images, onOpen }: { images: GalleryGridImage[]; onOpen: (i: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const startX = useRef<number | null>(null)

  const total = images.length
  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total])

  // Keyboard support when carousel is focused
  function onCarouselKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }

  // Touch swipe
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    startX.current = null
  }

  if (!total) return null

  const current = images[activeIndex]

  return (
    <>
      <div
        className="gallery-carousel"
        role="region"
        aria-label="Image carousel"
        aria-roledescription="carousel"
      >
        {/* Main slide */}
        <div
          ref={trackRef}
          className="gallery-carousel-track"
          onKeyDown={onCarouselKey}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-live="polite"
        >
          <button
            type="button"
            aria-label={`Open image ${activeIndex + 1}: ${current?.caption || ''}`}
            onClick={() => onOpen(activeIndex)}
            className="gallery-carousel-slide gallery-item-btn"
          >
            {current?.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.image.url}
                alt={current.image.alt || current.caption || ''}
                loading="lazy"
                className="gallery-img"
                style={{
                  ...IMG_BASE,
                  position: 'absolute',
                  inset: 0,
                  cursor: 'zoom-in',
                }}
              />
            ) : (
              <ImagePlaceholder />
            )}

            {/* Caption overlay */}
            {current?.caption ? (
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1.25rem 1.5rem',
                  background: 'var(--gallery-scrim-heavy, linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%))',
                  fontFamily: 'var(--font-body, system-ui, sans-serif)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-on-primary, #ffffff)',
                  lineHeight: 1.5,
                  textAlign: 'left',
                }}
              >
                {current.caption}
              </div>
            ) : null}
          </button>
        </div>

        {/* Controls row */}
        <div className="gallery-carousel-controls">
          {/* Prev */}
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="gallery-carousel-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div role="tablist" aria-label="Slide indicators" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: i === activeIndex ? '1.5rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: 'var(--radius-full, 9999px)',
                  background: i === activeIndex
                    ? 'var(--color-primary, #0c3bb9)'
                    : 'var(--brand-ink-alpha-18, rgba(26,26,26,0.18))',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width var(--transition-fast, 150ms), background var(--transition-fast, 150ms)',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="gallery-carousel-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Thumbnail strip (hidden on mobile) */}
        {total > 1 ? (
          <div className="gallery-carousel-thumbs" aria-label="Image thumbnails" role="list">
            {images.map((item, i) => (
              <button
                key={i}
                type="button"
                role="listitem"
                aria-label={item.caption || `Thumbnail ${i + 1}`}
                aria-current={i === activeIndex}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: '4rem',
                  height: '3rem',
                  flexShrink: 0,
                  borderRadius: 'var(--radius-sm, 0.25rem)',
                  overflow: 'hidden',
                  border: i === activeIndex
                    ? '2px solid var(--color-primary, #0c3bb9)'
                    : '2px solid transparent',
                  padding: 0,
                  cursor: 'pointer',
                  opacity: i === activeIndex ? 1 : 0.48,
                  transition: 'opacity var(--transition-fast, 150ms), border-color var(--transition-fast, 150ms)',
                  background: 'var(--brand-ink-alpha-05, rgba(26,26,26,0.05))',
                }}
              >
                {item.image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image.url}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <style>{`
        .gallery-carousel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .gallery-carousel-track {
          position: relative;
          width: 100%;
          border-radius: var(--radius-card, 0.5rem);
          overflow: hidden;
        }
        .gallery-carousel-slide {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          display: block;
          border: none;
          padding: 0;
          background: var(--brand-ink-alpha-05, rgba(26,26,26,0.05));
          cursor: pointer;
          border-radius: var(--radius-card, 0.5rem);
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .gallery-carousel-slide { aspect-ratio: 4 / 3; }
        }
        .gallery-carousel-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
        }
        .gallery-carousel-btn {
          background: transparent;
          border: 1px solid var(--brand-ink-alpha-15, rgba(26,26,26,0.15));
          border-radius: var(--radius-full, 9999px);
          width: 2.5rem;
          height: 2.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-ink, #1a1a1a);
          transition: border-color var(--transition-fast, 150ms), background var(--transition-fast, 150ms);
          flex-shrink: 0;
        }
        .gallery-carousel-btn:hover {
          border-color: var(--color-primary, #0c3bb9);
          background: var(--color-primary-muted, rgba(12,59,185,0.08));
        }
        .gallery-carousel-btn:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
        .gallery-carousel-thumbs {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .gallery-carousel-thumbs button:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
        @media (max-width: 480px) {
          .gallery-carousel-thumbs { display: none; }
        }
        .gallery-carousel-slide:focus-visible {
          outline: 2px solid var(--color-primary, #0c3bb9);
          outline-offset: 2px;
        }
        .gallery-item-btn:hover .gallery-img { transform: scale(1.04); }
      `}</style>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function GalleryGrid({
  headline,
  layout = 'grid',
  images = [],
  appearance,
  eyebrow,
}: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const safeImages = (images ?? []).filter(Boolean)
  const total = safeImages.length

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + total) % total))
  }, [total])
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % total))
  }, [total])

  return (
    <>
      <Section appearance={appearance} background="paper">
        <Container size="xl">
          {/* Header */}
          {(eyebrow || headline) ? (
            <div
              style={{
                marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}
            >
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              {headline ? (
                <h2
                  style={{
                    fontFamily: 'var(--font-display, system-ui, sans-serif)',
                    fontWeight: 800,
                    fontSize: 'var(--text-h2, clamp(1.5rem, 3vw, 2.25rem))',
                    lineHeight: 'var(--leading-tight, 1.06)',
                    letterSpacing: 'var(--tracking-tight, -0.015em)',
                    color: 'var(--brand-ink, #1a1a1a)',
                    margin: 0,
                    maxWidth: '32rem',
                  }}
                >
                  {headline}
                </h2>
              ) : null}
            </div>
          ) : null}

          {/* Empty state */}
          {!safeImages.length ? (
            <div
              style={{
                minHeight: '16rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed var(--brand-ink-alpha-14, rgba(26,26,26,0.14))',
                borderRadius: 'var(--radius-card, 0.5rem)',
              }}
              aria-label="No images in gallery"
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  fontSize: '0.8125rem',
                  color: 'var(--brand-ink-muted, #6b6b65)',
                  margin: 0,
                }}
              >
                No images yet
              </p>
            </div>
          ) : layout === 'masonry' ? (
            <MasonryLayout images={safeImages} onOpen={openLightbox} />
          ) : layout === 'carousel' ? (
            <CarouselLayout images={safeImages} onOpen={openLightbox} />
          ) : (
            <GridLayout images={safeImages} onOpen={openLightbox} />
          )}
        </Container>
      </Section>

      {/* Lightbox portal */}
      {lightboxIndex !== null ? (
        <Lightbox
          images={safeImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      ) : null}
    </>
  )
}
