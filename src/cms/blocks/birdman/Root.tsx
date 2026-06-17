'use client'
/**
 * Root del set de bloques birdman. Envuelve los bloques arrastrables.
 * Inyecta el CSS verbatim, define el logo SVG (reusado por nav y footer),
 * corre la interactividad GLOBAL (anchor-scroll con offset + reveal-on-scroll),
 * y renderiza header (nav) + main{children} + footer + botón flotante WA.
 *
 * Fidelidad: header/main/footer en el mismo orden y markup que el HTML original.
 */
import { useEffect } from 'react'
import type { RootConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { BIRDMAN_CSS } from './birdman.css'

type RootProps = {
  meta: BirdmanContent['meta']
  nav: BirdmanContent['nav']
  footer: BirdmanContent['footer']
}

import { birdmanContent } from '@/app/birdman/content'
import { stringList } from './fields'

export const Root: RootConfig<RootProps> = {
  fields: {
    meta: {
      type: 'object',
      objectFields: {
        title: { type: 'text' },
        description: { type: 'textarea' },
      },
    },
    nav: {
      type: 'object',
      objectFields: {
        brand: { type: 'text' },
        cta: {
          type: 'object',
          objectFields: {
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
        },
        links: {
          type: 'array',
          arrayFields: { label: { type: 'text' }, href: { type: 'text' } },
          getItemSummary: (item: { label?: string }) => item?.label || 'Link',
        },
      },
    },
    footer: {
      type: 'object',
      objectFields: {
        brandText: { type: 'textarea' },
        columns: {
          type: 'array',
          arrayFields: {
            title: { type: 'text' },
            links: {
              type: 'array',
              arrayFields: { label: { type: 'text' }, href: { type: 'text' } },
              getItemSummary: (item: { label?: string }) => item?.label || 'Link',
            },
          },
          getItemSummary: (item: { title?: string }) => item?.title || 'Columna',
        },
        brands: stringList('marca'),
        copyright: { type: 'text' },
        waLabel: { type: 'text' },
        waHref: { type: 'text' },
      },
    },
  } as never,
  defaultProps: {
    meta: birdmanContent.meta,
    nav: birdmanContent.nav,
    footer: birdmanContent.footer,
  },
  render: ({ nav, footer, children, puck }) => {
    useEffect(() => {
      const cleanups: Array<() => void> = []

      // Anchor links internos: scroll con offset por el nav sticky.
      {
        const NAV = 68
        const onClick = (e: MouseEvent) => {
          const a = (e.target as Element | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null
          if (!a) return
          const id = a.getAttribute('href')
          if (!id) return
          if (id === '#') {
            e.preventDefault()
            return
          }
          const t = id === '#top' ? document.body : document.querySelector(id)
          if (!t) return
          e.preventDefault()
          const y = id === '#top' ? 0 : (t as HTMLElement).getBoundingClientRect().top + window.scrollY - NAV
          window.scrollTo({ top: y, behavior: 'smooth' })
          history.replaceState(null, '', id)
        }
        document.addEventListener('click', onClick)
        cleanups.push(() => document.removeEventListener('click', onClick))
      }

      // Reveal on scroll.
      {
        const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches
        const els = document.querySelectorAll('.reveal')
        if (rm || !('IntersectionObserver' in window)) {
          els.forEach((el) => el.classList.add('in'))
        } else {
          const io = new IntersectionObserver(
            (ent) => {
              ent.forEach((en) => {
                if (en.isIntersecting) {
                  en.target.classList.add('in')
                  io.unobserve(en.target)
                }
              })
            },
            { rootMargin: '0px 0px -10% 0px' }
          )
          els.forEach((el) => io.observe(el))
          cleanups.push(() => io.disconnect())
        }
      }

      return () => cleanups.forEach((fn) => fn())
    }, [])

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: BIRDMAN_CSS }} />

        {/* En el editor de Puck (iframe) el IntersectionObserver no dispara, asi que
            el contenido .reveal quedaria invisible. Forzamos visible solo al editar. */}
        {puck?.isEditing && (
          <style dangerouslySetInnerHTML={{ __html: '.reveal{opacity:1 !important;transform:none !important}' }} />
        )}

        {/* Logo real Birdman, definido una vez, reusado vía <use>. */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
          <symbol id="birdman-logo" viewBox="28 344 708 124">
            <path fill="#ff8400" d="M 162.804688 391.695312 C 166.480469 380.578125 165.113281 370.769531 157.753906 362.125 C 150.109375 353.144531 140.113281 349.050781 128.429688 349.066406 C 96.59375 349.09375 71.148438 349.148438 39.3125 349.226562 C 38.015625 349.226562 36.734375 349.417969 34.625 349.566406 C 36.773438 352.535156 38.691406 354.859375 40.257812 357.398438 C 47.320312 368.867188 57.707031 374.984375 70.90625 374.730469 C 91.664062 374.324219 106.050781 374.554688 126.824219 374.554688 C 135.683594 374.554688 138.480469 375.242188 139.261719 383.765625 C 143.207031 384.667969 147.257812 385.292969 151.09375 386.574219 C 154.917969 387.84375 158.511719 389.789062 162.804688 391.707031 Z M 162.804688 391.695312 " />
            <path fill="#ff8400" d="M 173.976562 436.386719 C 176.785156 422.785156 173.21875 408.96875 164.074219 400.363281 C 155.078125 391.894531 144.125 389.25 132.160156 389.277344 C 109.007812 389.316406 91.339844 389.328125 68.191406 389.382812 C 66.757812 389.382812 65.328125 389.289062 63.8125 389.382812 C 63.988281 390.152344 63.976562 390.695312 64.152344 390.9375 C 65.421875 392.746094 66.839844 397.203125 68 399.082031 C 75.589844 411.25 86.613281 417.074219 100.808594 416.585938 C 114.921875 416.113281 123.582031 416.546875 137.710938 416.453125 C 153.335938 416.355469 166.722656 419.355469 173.976562 436.386719 Z M 173.976562 436.386719 " />
            <path fill="#ff8400" d="M 95.5 433.902344 C 99.40625 439.101562 102.417969 447.058594 105.710938 451.125 C 110.074219 456.511719 115.9375 460.117188 122.703125 460.523438 C 131.132812 461.023438 137.089844 461.117188 145.300781 459.496094 C 151.351562 458.308594 157.269531 454.730469 162.453125 451.082031 C 170.328125 443.101562 169.410156 438.535156 164.859375 431.011719 C 161.144531 425.433594 155.242188 422.828125 148.476562 421.828125 C 152.957031 429.417969 144.746094 433.753906 132.238281 433.78125 C 119.503906 433.808594 109.519531 433.863281 95.515625 433.890625 Z M 95.5 433.902344 " />
            <path fill="#ffffff" d="M 276.234375 382.320312 C 276.222656 371.3125 267.292969 365.152344 250.75 365.179688 L 213.660156 365.246094 L 213.589844 365.585938 C 196.574219 365.585938 213.984375 365.585938 195.695312 365.625 C 194.9375 365.625 194.183594 365.734375 192.953125 365.828125 C 194.207031 367.570312 195.328125 368.921875 196.25 370.40625 C 199.734375 376.066406 204.59375 379.484375 210.671875 380.335938 L 199.113281 438.644531 L 239.457031 438.574219 C 258.324219 438.546875 273.089844 431.1875 273.0625 415.25 C 273.0625 408.441406 269.484375 403.417969 263.1875 400.703125 C 271.144531 397.339844 276.277344 391.140625 276.261719 382.347656 Z M 240.578125 423.554688 L 222.558594 423.582031 L 225.464844 408.699219 L 243.804688 408.671875 C 248.832031 408.671875 252.410156 410.441406 252.410156 414.84375 C 252.410156 420.707031 247.816406 423.542969 240.578125 423.554688 Z M 243.253906 394.3125 L 228.367188 394.339844 L 231.175781 380.183594 L 245.84375 380.160156 C 251.289062 380.160156 254.542969 381.929688 254.558594 385.914062 C 254.558594 391.355469 250.585938 394.300781 243.253906 394.3125 Z M 243.253906 394.3125 " />
            <path fill="#ffffff" d="M 291.621094 365.113281 L 277.074219 438.480469 L 297.820312 438.453125 L 312.367188 365.070312 Z M 291.621094 365.113281 " />
            <path fill="#ffffff" d="M 385.453125 388.316406 C 385.425781 373.648438 374.621094 364.964844 355.859375 365.003906 L 324.523438 365.058594 L 309.976562 438.441406 L 330.722656 438.398438 L 334.570312 418.910156 L 345.054688 418.910156 C 345.054688 418.910156 355.980469 438.359375 355.980469 438.359375 L 377.671875 438.320312 L 365.164062 416.328125 C 377.941406 411.914062 385.464844 401.835938 385.453125 388.316406 Z M 350.050781 402.835938 L 337.679688 402.835938 C 337.679688 402.835938 342.042969 381.375 342.042969 381.375 L 352.941406 381.375 C 360.074219 381.347656 364.476562 384.171875 364.488281 390.34375 C 364.488281 398.40625 359.167969 402.824219 350.050781 402.835938 Z M 350.050781 402.835938 " />
            <path fill="#ffffff" d="M 431.308594 364.867188 L 399.445312 364.921875 L 384.898438 438.304688 L 422.421875 438.238281 C 449.351562 438.199219 468.183594 421.609375 468.140625 395.609375 C 468.113281 376.648438 454.148438 364.828125 431.308594 364.867188 Z M 423.027344 421.679688 L 408.980469 421.707031 L 416.882812 381.457031 L 429.039062 381.457031 C 440.980469 381.414062 447.179688 387.167969 447.191406 396.921875 C 447.21875 410.96875 438.535156 421.664062 423.027344 421.691406 Z M 423.027344 421.679688 " />
            <path fill="#ffffff" d="M 550.777344 364.679688 L 517.523438 407.171875 L 500.273438 364.761719 L 483.402344 364.789062 L 468.84375 438.171875 L 487.929688 438.128906 L 495.613281 399.445312 L 508.972656 430.863281 L 518.089844 430.851562 L 542.457031 399.378906 L 534.972656 438.046875 L 554.152344 438.023438 L 568.484375 364.640625 Z M 550.777344 364.679688 " />
            <path fill="#ffffff" d="M 604.332031 364.585938 L 557.394531 438.023438 L 579.300781 437.980469 L 587.769531 423.71875 L 619 423.664062 L 621.957031 437.914062 L 642.59375 437.875 L 624.765625 364.542969 L 604.332031 364.570312 Z M 596.863281 408.402344 L 610.867188 384.589844 L 615.839844 408.375 L 596.875 408.402344 Z M 596.863281 408.402344 " />
            <path fill="#ffffff" d="M 709.859375 364.410156 L 701.972656 404.550781 L 677.589844 364.464844 L 660.503906 364.492188 L 645.957031 437.875 L 666.285156 437.832031 L 674.296875 397.582031 L 698.566406 437.777344 L 715.640625 437.75 L 730.1875 364.367188 Z M 709.859375 364.410156 " />
          </symbol>
        </svg>

        {/* NAV */}
        <header className="nav">
          <div className="wrap nav__row">
            <a className="brand" href="#top" aria-label="Birdman, inicio">
              <svg className="logo" viewBox="0 0 708 124" aria-hidden="true">
                <use href="#birdman-logo" />
              </svg>
              <small>{nav.brand}</small>
            </a>
            <nav className="nav__links" aria-label="Principal">
              {nav.links.map((l) => (
                <a key={l.href + l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
            <a
              className="btn btn--primary nav__cta"
              href={nav.cta.href}
              style={{ minHeight: '42px', padding: '0 20px', fontSize: '15px' }}
            >
              {nav.cta.label}
            </a>
          </div>
        </header>

        <main id="top">{children}</main>

        {/* FOOTER */}
        <footer>
          <div className="wrap">
            <div className="foot">
              <div>
                <a className="brand" href="#top" aria-label="Birdman">
                  <svg className="logo" viewBox="0 0 708 124" aria-hidden="true">
                    <use href="#birdman-logo" />
                  </svg>
                </a>
                <p className="orvia">{footer.brandText}</p>
              </div>
              {footer.columns.map((col) => (
                <div key={col.title}>
                  <h5>{col.title}</h5>
                  {col.links.map((l) => {
                    const external = l.href.startsWith('http')
                    return external ? (
                      <a key={l.label} href={l.href} target="_blank" rel="noopener">
                        {l.label}
                      </a>
                    ) : (
                      <a key={l.label} href={l.href}>
                        {l.label}
                      </a>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="foot-bottom">
              <div className="brands">
                {footer.brands.map((b, i) => (
                  <span className={i === 0 ? 'me' : undefined} key={b}>
                    {b}
                  </span>
                ))}
              </div>
              <small>{footer.copyright}</small>
            </div>
          </div>
        </footer>

        <a className="wa" href={footer.waHref} target="_blank" rel="noopener" aria-label={footer.waLabel}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c1.9.8 1.9.6 2.3.5a2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z" />
          </svg>
        </a>
      </>
    )
  },
}
