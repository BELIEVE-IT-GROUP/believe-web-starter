import { NextRequest, NextResponse } from 'next/server'
import { AwsClient } from 'aws4fetch'

const PLUNK_API = 'https://api.mailing.believe-global.com/v1/track'
const SES_URL = 'https://email.us-east-1.amazonaws.com/v2/email/outbound-emails'
const FROM = 'Jorge Beltrán <noreply@believeitgroup.com>'
const REPLY_TO = 'jorge@believe-global.com'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const email = String(body.email || '').trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: 'Email inválido' }, { status: 400 })
  }

  const sesKeyId = process.env.SES_ACCESS_KEY_ID
  const sesSecret = process.env.SES_SECRET_ACCESS_KEY
  const pdfUrl = process.env.CAPITULO1_PDF_URL

  if (!sesKeyId || !sesSecret || !pdfUrl) {
    console.error('[capitulo] Missing SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, or CAPITULO1_PDF_URL')
    return NextResponse.json({ ok: false, message: 'Servicio no configurado' }, { status: 500 })
  }

  // 1. Registrar lead en Plunk via /v1/track (public key, non-blocking)
  const plunkPublicKey = process.env.PLUNK_PUBLIC_API_KEY
  if (plunkPublicKey) {
    fetch(PLUNK_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${plunkPublicKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'lead_capitulo1', email, subscribed: true }),
    }).catch((e) => console.error('[capitulo] Plunk error:', e))
  }

  // 2. Enviar email con link al PDF via SES directo (aws4fetch)
  const aws = new AwsClient({
    accessKeyId: sesKeyId,
    secretAccessKey: sesSecret,
    region: 'us-east-1',
    service: 'ses',
  })

  const sesRes = await aws.fetch(SES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      FromEmailAddress: FROM,
      ReplyToAddresses: [REPLY_TO],
      Destination: { ToAddresses: [email] },
      Content: {
        Simple: {
          Subject: { Data: 'Tu Capítulo 1 de NeuroRealidad™ está aquí', Charset: 'UTF-8' },
          Body: { Html: { Data: buildEmail(pdfUrl), Charset: 'UTF-8' } },
        },
      },
    }),
  })

  if (!sesRes.ok) {
    const err = await sesRes.text()
    console.error('[capitulo] SES error:', err)
    return NextResponse.json({ ok: false, message: 'Error enviando el email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

function buildEmail(pdfUrl: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border-radius:12px;overflow:hidden;max-width:100%">
        <tr>
          <td style="padding:40px 40px 0;text-align:center">
            <img src="https://book.maas90d.com/neurorealidad/portada.jpg" alt="NeuroRealidad" width="120" style="border-radius:6px;margin-bottom:24px">
            <h1 style="color:#f5f5f0;font-size:24px;font-weight:700;margin:0 0 12px">Tu primer capítulo te está esperando.</h1>
            <p style="color:#888;font-size:15px;line-height:1.6;margin:0 0 32px">
              Gracias por dar este paso. El Capítulo 1 de <strong style="color:#f5f5f0">NeuroRealidad™</strong> te muestra
              por qué sabes exactamente qué hacer y aun así no lo haces.<br><br>
              Léelo cuando tengas 20 minutos sin interrupciones.
            </p>
            <a href="${pdfUrl}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;margin-bottom:32px">
              Descargar Capítulo 1 →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 40px;border-top:1px solid #222">
            <p style="color:#555;font-size:13px;text-align:center;margin:0">
              ¿Ya sabes que lo quieres completo?<br>
              <a href="https://www.amazon.com/dp/B0H1JTHK57" style="color:#7c3aed">Consíguelo en Amazon · $9.99</a>
            </p>
          </td>
        </tr>
      </table>
      <p style="color:#333;font-size:12px;margin-top:24px;text-align:center">
        Recibiste este email porque lo pediste en book.maas90d.com.
      </p>
    </td></tr>
  </table>
</body>
</html>`
}
