import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const name = String(body.name || '')
  const email = String(body.email || '')
  const message = String(body.message || '')
  const to = String(body.destinationEmail || process.env.DEFAULT_CONTACT_EMAIL || '')

  if (!name || !email || !message || !to) {
    return NextResponse.json({ sent: false, message: 'Missing required fields' }, { status: 400 })
  }

  const apiKey = process.env.PLUNK_API_KEY
  if (!apiKey) {
    return NextResponse.json({ sent: false, message: 'PLUNK_API_KEY not configured' }, { status: 500 })
  }

  const res = await fetch('https://api.useplunk.com/v1/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      subject: `Contacto desde web: ${name}`,
      body: `De: ${name} <${email}>\n\n${message}`,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ sent: false, message: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ sent: true })
}
