import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Captura de leads de las landings (Grupo ORVIA y demás tenants).
 *
 * Los forms de las landings 'raw' postean aquí de forma NATIVA (sin JS):
 * application/x-www-form-urlencoded, y el navegador navega a la respuesta.
 * Por eso el flujo nativo responde una página de "gracias" on-brand (HTML).
 *
 * Qué hace, en orden y sin romper si falta config:
 *   1. Persiste el lead como respaldo en el volumen (data/pages/_leads/<tenant>/).
 *   2. Si LEADS_WEBHOOK_URL está seteada, reenvía el lead (fire-and-forget).
 *   3. Si PLUNK_API_KEY + email destino, notifica por correo (opcional).
 *
 * Webhook y email son OPT-IN: sin esas envs, el lead igual queda guardado.
 * Peticiones JSON (content-type application/json) siguen devolviendo JSON.
 */

const CAMPOS = ['nombre', 'empresa', 'cargo', 'correo', 'telefono', 'volumen', 'envios', 'servicio', 'mensaje']

function safeTenant(v: string): string {
  return /^[a-z0-9][a-z0-9-]*$/.test(v) ? v : '_desconocido'
}

async function persistLead(tenant: string, lead: Record<string, unknown>): Promise<void> {
  const dir = path.join(process.cwd(), 'data', 'pages', '_leads', safeTenant(tenant))
  await fs.mkdir(dir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const rand = Math.random().toString(36).slice(2, 8)
  await fs.writeFile(path.join(dir, `${stamp}-${rand}.json`), JSON.stringify(lead, null, 2))
}

async function forwardWebhook(lead: Record<string, unknown>): Promise<void> {
  const url = process.env.LEADS_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
  } catch {
    /* fire-and-forget: el lead ya quedó persistido como respaldo */
  }
}

async function notifyEmail(tenant: string, subject: string, lead: Record<string, unknown>): Promise<void> {
  const apiKey = process.env.PLUNK_API_KEY
  const to = process.env.LEADS_NOTIFY_EMAIL || process.env.DEFAULT_CONTACT_EMAIL
  if (!apiKey || !to) return
  const cuerpo = Object.entries(lead)
    .filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  const base = (process.env.PLUNK_API_BASE || 'https://api.useplunk.com').replace(/\/$/, '')
  try {
    await fetch(`${base}/v1/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject: subject || `Nuevo lead · ${tenant}`, body: cuerpo }),
    })
  } catch {
    /* opcional */
  }
}

// Tenants de la familia Grupo ORVIA: conservan su página de gracias (naranja).
// Todo lo demás (becall, agents y cualquier landing Believe futura) usa la de Believe.
const ORVIA_TENANTS = new Set(['envia-ya', 'trust-logistics', 'orvia', 'birdman', 'pawers-test'])

function orviaGracias(): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Gracias</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#000;color:#fff;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;text-align:center;padding:24px}
.card{max-width:460px}.mk{width:64px;height:64px;border-radius:50%;background:rgba(255,132,0,.12);border:1px solid #ff8400;display:grid;place-items:center;margin:0 auto 24px}
.mk svg{width:32px;height:32px;color:#ff8400}h1{font-size:28px;font-weight:800;letter-spacing:-.02em;margin:0 0 12px}
p{color:#b7b7b7;font-size:16px;line-height:1.6;margin:0 0 28px}a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 26px;background:#ff8400;color:#000;font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:14px;border-radius:4px;text-decoration:none}</style></head>
<body><div class="card"><div class="mk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg></div>
<h1>¡Gracias! Recibimos tu solicitud</h1><p>Un especialista de Grupo ORVIA te contactará muy pronto. Revisa tu correo y WhatsApp.</p>
<a href="/" onclick="history.back();return false;">Volver</a></div></body></html>`
}

// Página de gracias en sistema Believe v.2026 (Paper 50, azul, cian señal, Fraunces + mono, papel granulado).
function believeGracias(): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Gracias &middot; Believe</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>:root{--paper:#fafaf7;--blue:#0c3bb9;--blue900:#062778;--cyan:#00aaff;--ink:#1a1a1a;--mute:#6b6b65;--line:#e4e4dc}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--paper);color:var(--ink);font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;padding:24px;position:relative;-webkit-font-smoothing:antialiased}
body::before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")}
.card{max-width:480px;position:relative}
.mk{width:60px;height:60px;border-radius:50%;background:rgba(12,59,185,.07);border:1px solid var(--blue);display:grid;place-items:center;margin:0 auto 28px}
.mk svg{width:28px;height:28px;color:var(--blue)}
.eyebrow{font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:12px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--mute);margin:0 0 16px}
h1{font-family:'Fraunces',Georgia,serif;font-weight:400;font-size:34px;letter-spacing:-.02em;line-height:1.06;margin:0 0 14px}h1 .sig{color:var(--cyan)}
p{color:var(--mute);font-size:16px;line-height:1.6;margin:0 0 28px}
a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 26px;background:var(--blue);color:#fff;font-weight:600;font-size:15px;border-radius:4px;text-decoration:none;transition:background .2s}a:hover{background:var(--blue900)}
.mark{margin-top:36px;font-family:'Fraunces',Georgia,serif;font-weight:500;font-size:20px;letter-spacing:-.025em;color:var(--blue)}
.mark .dot{display:inline-block;width:.2em;height:.2em;border-radius:50%;background:var(--cyan);margin-left:.06em}</style></head>
<body><div class="card">
<div class="mk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg></div>
<p class="eyebrow">Solicitud recibida</p>
<h1>Gracias. Tu mensaje ya est&aacute; con nosotros<span class="sig">.</span></h1>
<p>El equipo de Believe lo revisa y te contacta en menos de 24 horas. Mientras tanto, revisa tu correo.</p>
<a href="/" onclick="history.back();return false;">Volver</a>
<div class="mark">Believe<span class="dot"></span></div>
</div></body></html>`
}

function graciasPage(tenant: string): string {
  return ORVIA_TENANTS.has(tenant) ? orviaGracias() : believeGracias()
}

export async function POST(request: NextRequest) {
  const ct = request.headers.get('content-type') || ''

  // ── Flujo JSON (compat): { name, email, message, destinationEmail }
  if (ct.includes('application/json')) {
    const body = await request.json().catch(() => ({}))
    const tenant = String(body._tenant || 'json')
    const lead = { ...body, _tenant: tenant, _ts: new Date().toISOString(), _source: 'json' }
    await persistLead(tenant, lead)
    await Promise.all([forwardWebhook(lead), notifyEmail(tenant, String(body._subject || ''), lead)])
    return NextResponse.json({ ok: true })
  }

  // ── Flujo nativo (form sin JS): urlencoded / multipart → página de gracias
  const form = await request.formData().catch(() => null)
  if (!form) return NextResponse.json({ ok: false, message: 'Bad request' }, { status: 400 })

  const tenant = safeTenant(String(form.get('_tenant') || '_desconocido'))
  const subject = String(form.get('_subject') || '')
  const lead: Record<string, unknown> = { _tenant: tenant, _subject: subject, _ts: new Date().toISOString(), _source: 'form' }
  for (const k of CAMPOS) {
    const v = form.get(k)
    if (v != null && String(v).trim()) lead[k] = String(v).trim()
  }
  // atribución de campaña/UTM (inyectada en el form por el cliente desde la URL del anuncio)
  for (const k of ['_campaign', '_utm_source', '_utm_medium', '_utm_content', '_utm_term']) {
    const v = form.get(k)
    if (v != null && String(v).trim()) lead[k] = String(v).trim()
  }

  await persistLead(tenant, lead)
  await Promise.all([forwardWebhook(lead), notifyEmail(tenant, subject, lead)])

  return new NextResponse(graciasPage(tenant), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
