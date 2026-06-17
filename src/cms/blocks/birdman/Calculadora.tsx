'use client'
/**
 * Bloque Calculadora de birdman. Port fiel de BirdmanLanding.tsx (sección #calculadora).
 * Sección INTERACTIVA: la lógica de cálculo vive en un useEffect que lee/escribe el DOM
 * por id (#c-envios, #c-costo, #c-ops → #out-annual, #out-save, #out-month), igual que el original.
 */
import { useEffect } from 'react'
import type { ComponentConfig } from '@measured/puck'
import type { BirdmanContent } from '@/app/birdman/content'
import { birdmanContent } from '@/app/birdman/content'

type CalculadoraProps = BirdmanContent['calculadora']

export const Calculadora: ComponentConfig<CalculadoraProps> = {
  label: 'Calculadora',
  fields: {
    eyebrow: { type: 'text' },
    title: { type: 'text' },
    lead: { type: 'textarea' },
    fields: {
      type: 'object',
      objectFields: {
        enviosLabel: { type: 'text' },
        enviosDefault: { type: 'text' },
        costoLabel: { type: 'text' },
        costoDefault: { type: 'text' },
        opsLabel: { type: 'text' },
        opsDefault: { type: 'text' },
        opsHint: { type: 'textarea' },
      },
    },
    rate: { type: 'number' },
    labels: {
      type: 'object',
      objectFields: {
        annualK: { type: 'text' },
        saveK: { type: 'text' },
        perBefore: { type: 'text' },
        perAfter: { type: 'text' },
      },
    },
    assume: { type: 'textarea' },
    cta: {
      type: 'object',
      objectFields: {
        label: { type: 'text' },
        href: { type: 'text' },
      },
    },
  } as never,
  defaultProps: birdmanContent.calculadora,
  render: ({ eyebrow, title, lead, fields, rate, labels, assume, cta }) => {
    useEffect(() => {
      const cleanups: Array<() => void> = []
      // ── Calculadora de ahorro.
      {
        const fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
        const RATE = rate // punto medio del rango 12-18% de casos típicos
        const envios = document.getElementById('c-envios') as HTMLInputElement | null
        const costo = document.getElementById('c-costo') as HTMLInputElement | null
        const ops = document.getElementById('c-ops') as HTMLInputElement | null
        const oA = document.getElementById('out-annual')
        const oS = document.getElementById('out-save')
        const oM = document.getElementById('out-month')
        if (envios && costo && ops && oA && oS && oM) {
          const n = (el: HTMLInputElement) => {
            const v = parseFloat(el.value)
            return isFinite(v) && v > 0 ? v : 0
          }
          const calc = () => {
            const annual = n(envios) * 12 * n(costo)
            const save = annual * RATE
            oA.textContent = fmt.format(annual)
            oS.textContent = fmt.format(save)
            oM.textContent = fmt.format(save / 12)
          }
          const inputs = [envios, costo, ops]
          inputs.forEach((el) => el.addEventListener('input', calc))
          calc()
          cleanups.push(() => inputs.forEach((el) => el.removeEventListener('input', calc)))
        }
      }
      return () => cleanups.forEach((fn) => fn())
    }, [rate])

    return (
      <section id="calculadora">
        <div className="wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="title">{title}</h2>
          <p className="lead">{lead}</p>
          <div className="calc reveal">
            <form className="calc__form" id="calc" noValidate>
              <div className="field">
                <label htmlFor="c-envios">{fields.enviosLabel}</label>
                <div className="control">
                  <input id="c-envios" type="number" inputMode="numeric" min="0" defaultValue={fields.enviosDefault} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-costo">{fields.costoLabel}</label>
                <div className="control">
                  <span className="pre">$</span>
                  <input id="c-costo" type="number" inputMode="numeric" min="0" defaultValue={fields.costoDefault} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-ops">{fields.opsLabel}</label>
                <div className="control">
                  <input id="c-ops" type="number" inputMode="numeric" min="0" defaultValue={fields.opsDefault} />
                </div>
                <span className="hint">{fields.opsHint}</span>
              </div>
            </form>
            <div className="calc__out">
              <p className="k">{labels.annualK}</p>
              <p className="annual num" id="out-annual">
                $5,100,000
              </p>
              <p className="save-k">{labels.saveK}</p>
              <p className="save num" id="out-save">
                $714,000
              </p>
              <p className="per">
                {labels.perBefore}
                <span className="num" id="out-month">
                  $59,500
                </span>
                {labels.perAfter}
              </p>
              <p className="assume" dangerouslySetInnerHTML={{ __html: assume }} />
              <a className="btn btn--primary btn--block" href={cta.href}>
                {cta.label}
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  },
}
