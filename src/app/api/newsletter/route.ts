import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const email = String(body.email || '')
  const listId = String(body.listId || process.env.PLUNK_NEWSLETTER_LIST_ID || '')
  const destinationEmail = String(body.destinationEmail || '')

  if (!email) {
    return NextResponse.json({ subscribed: false, message: 'Missing email' }, { status: 400 })
  }

  const apiKey = process.env.PLUNK_API_KEY
  if (!apiKey) {
    return NextResponse.json({ subscribed: false, message: 'PLUNK_API_KEY not configured' }, { status: 500 })
  }

  const res = await fetch('https://api.useplunk.com/v1/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      subscribed: true,
      ...(listId ? { listId } : {}),
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ subscribed: false, message: 'Failed to subscribe' }, { status: 500 })
  }

  if (destinationEmail) {
    await fetch('https://api.useplunk.com/v1/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: destinationEmail,
        subject: 'Nueva suscripción al newsletter',
        body: `Email: ${email}`,
      }),
    })
  }

  return NextResponse.json({ subscribed: true })
}
