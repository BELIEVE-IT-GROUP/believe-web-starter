'use client'

import { useEffect, useState } from 'react'

export function TenantStyleInjector() {
  const [css, setCss] = useState('')

  useEffect(() => {
    // In production, fetch tenant colors from CMS or env
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#0ea5e9'
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#6366f1'

    // Generate Tailwind-compatible color scale
    setCss(`
      :root {
        --color-primary-50: ${tint(primary, 0.95)};
        --color-primary-100: ${tint(primary, 0.9)};
        --color-primary-200: ${tint(primary, 0.75)};
        --color-primary-300: ${tint(primary, 0.5)};
        --color-primary-400: ${tint(primary, 0.25)};
        --color-primary-500: ${primary};
        --color-primary-600: ${shade(primary, 0.2)};
        --color-primary-700: ${shade(primary, 0.4)};
        --color-primary-800: ${shade(primary, 0.6)};
        --color-primary-900: ${shade(primary, 0.8)};
      }
    `)
  }, [])

  return css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null
}

function tint(hex: string, amount: number) {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) + (255 - parseInt(hex.slice(1, 3), 16)) * amount)
  const g = Math.round(parseInt(hex.slice(3, 5), 16) + (255 - parseInt(hex.slice(3, 5), 16)) * amount)
  const b = Math.round(parseInt(hex.slice(5, 7), 16) + (255 - parseInt(hex.slice(5, 7), 16)) * amount)
  return `rgb(${r}, ${g}, ${b})`
}

function shade(hex: string, amount: number) {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * (1 - amount))
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * (1 - amount))
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * (1 - amount))
  return `rgb(${r}, ${g}, ${b})`
}
