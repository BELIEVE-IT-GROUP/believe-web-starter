'use client'
/**
 * Bloque Diagnóstico de birdman. Port FIEL de la sección #diagnostico de
 * BirdmanLanding.tsx (markup/clases/IDs verbatim). Mismo patrón que Hero.tsx:
 *   1. markup JSX verbatim del port
 *   2. props desestructuradas (antes content.diagnostico.X → ahora X)
 *   3. fields = textos editables; defaultProps = slice de birdmanContent
 *
 * Sección INTERACTIVA: el formulario de lead (id="lead") corre validación de
 * cliente + estado de éxito vía useEffect, igual que en el port original.
 */
import { useEffect } from 'react'
import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'
import { stringList } from './fields'

// Tick (check) reutilizado en Tecnología y Diagnóstico.
function Tick() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

type DiagnosticoProps = BirdmanContent['diagnostico']

export const Diagnostico: ComponentConfig<DiagnosticoProps> = {
  label: 'Diagnostico',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    lead: { type: 'textarea' },
    ticks: stringList('garantia'),
    form: {
      type: 'object',
      objectFields: {
        empresaLabel: { type: 'text' },
        empresaPlaceholder: { type: 'text' },
        empresaError: { type: 'text' },
        industriaLabel: { type: 'text' },
        industriaPlaceholder: { type: 'text' },
        industriaOptions: stringList('industria'),
        industriaError: { type: 'text' },
        volumenLabel: { type: 'text' },
        volumenPlaceholder: { type: 'text' },
        volumenOptions: stringList('volumen'),
        volumenError: { type: 'text' },
        estadoLabel: { type: 'text' },
        estadoPlaceholder: { type: 'text' },
        estadoError: { type: 'text' },
        correoLabel: { type: 'text' },
        correoPlaceholder: { type: 'text' },
        correoError: { type: 'text' },
        telLabel: { type: 'text' },
        telPlaceholder: { type: 'text' },
        telError: { type: 'text' },
        submit: { type: 'text' },
        legal: { type: 'textarea' },
        success: {
          type: 'object',
          objectFields: {
            title: { type: 'text' },
            text: { type: 'textarea' },
          },
        },
      },
    },
  } as never,
  defaultProps: birdmanContent.diagnostico,
  render: ({ eyebrow, title, lead, ticks, form }) => {
    useEffect(() => {
      const cleanups: Array<() => void> = []

      // ── Formulario de diagnóstico: validación cliente + estado de éxito.
      {
        const form = document.getElementById('lead') as HTMLFormElement | null
        if (form) {
          const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          const onSubmit = (e: Event) => {
            e.preventDefault()
            let ok = true
            let first: HTMLInputElement | HTMLSelectElement | null = null
            form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]').forEach((el) => {
              const fld = el.closest('.fld')
              let bad = false
              if (!el.value.trim()) bad = true
              else if ((el as HTMLInputElement).type === 'email' && !email.test(el.value)) bad = true
              else if (el.id === 'f-tel' && el.value.replace(/\D/g, '').length < 10) bad = true
              fld?.classList.toggle('bad', bad)
              el.setAttribute('aria-invalid', bad ? 'true' : 'false')
              if (bad && !first) {
                first = el
                ok = false
              } else if (bad) {
                ok = false
              }
            })
            if (!ok) {
              ;(first as HTMLInputElement | HTMLSelectElement | null)?.focus()
              return
            }
            form.classList.add('sent')
            const ok2 = form.querySelector('.form__ok') as HTMLElement | null
            if (ok2) {
              ok2.setAttribute('tabindex', '-1')
              ok2.focus()
            }
          }
          form.addEventListener('submit', onSubmit)
          cleanups.push(() => form.removeEventListener('submit', onSubmit))

          // limpia el error al corregir
          const inps = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.inp')
          const onInput = (ev: Event) => {
            const el = ev.currentTarget as HTMLElement
            el.closest('.fld')?.classList.remove('bad')
            el.setAttribute('aria-invalid', 'false')
          }
          const onChange = (ev: Event) => {
            const el = ev.currentTarget as HTMLElement
            el.closest('.fld')?.classList.remove('bad')
          }
          inps.forEach((el) => {
            el.addEventListener('input', onInput)
            el.addEventListener('change', onChange)
          })
          cleanups.push(() =>
            inps.forEach((el) => {
              el.removeEventListener('input', onInput)
              el.removeEventListener('change', onChange)
            })
          )
        }
      }

      return () => cleanups.forEach((fn) => fn())
    }, [])

    return (
      <section id="diagnostico" style={{ background: 'var(--surface)' }}>
        <div className="wrap diag">
          <div className="diag__copy">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="title">{title}</h2>
            <p className="lead">{lead}</p>
            <ul className="ticks">
              {ticks.map((t) => (
                <li key={t}>
                  <Tick />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <form className="form" id="lead" noValidate>
            <div className="form__inner">
              <div className="row2">
                <div className="fld">
                  <label htmlFor="f-empresa">{form.empresaLabel}</label>
                  <input className="inp" id="f-empresa" name="empresa" required placeholder={form.empresaPlaceholder} />
                  <span className="err-msg">{form.empresaError}</span>
                </div>
                <div className="fld">
                  <label htmlFor="f-industria">{form.industriaLabel}</label>
                  <select className="inp" id="f-industria" name="industria" required defaultValue="">
                    <option value="" disabled>
                      {form.industriaPlaceholder}
                    </option>
                    {form.industriaOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <span className="err-msg">{form.industriaError}</span>
                </div>
              </div>
              <div className="row2">
                <div className="fld">
                  <label htmlFor="f-volumen">{form.volumenLabel}</label>
                  <select className="inp" id="f-volumen" name="volumen" required defaultValue="">
                    <option value="" disabled>
                      {form.volumenPlaceholder}
                    </option>
                    {form.volumenOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <span className="err-msg">{form.volumenError}</span>
                </div>
                <div className="fld">
                  <label htmlFor="f-estado">{form.estadoLabel}</label>
                  <input className="inp" id="f-estado" name="estado" required placeholder={form.estadoPlaceholder} />
                  <span className="err-msg">{form.estadoError}</span>
                </div>
              </div>
              <div className="row2">
                <div className="fld">
                  <label htmlFor="f-correo">{form.correoLabel}</label>
                  <input className="inp" id="f-correo" name="correo" type="email" required placeholder={form.correoPlaceholder} />
                  <span className="err-msg">{form.correoError}</span>
                </div>
                <div className="fld">
                  <label htmlFor="f-tel">{form.telLabel}</label>
                  <input className="inp" id="f-tel" name="telefono" type="tel" required placeholder={form.telPlaceholder} inputMode="tel" />
                  <span className="err-msg">{form.telError}</span>
                </div>
              </div>
              <button className="btn btn--primary btn--block" type="submit" style={{ marginTop: '8px' }}>
                {form.submit}
              </button>
              <p className="legal">{form.legal}</p>
            </div>
            <div className="form__ok" role="status">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3 5-6" />
              </svg>
              <h3>{form.success.title}</h3>
              <p>{form.success.text}</p>
            </div>
          </form>
        </div>
      </section>
    )
  },
}
