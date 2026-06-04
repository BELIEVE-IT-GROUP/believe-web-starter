import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const slug = request.nextUrl.searchParams.get('slug') || 'home'
  const collection = request.nextUrl.searchParams.get('collection') || 'pages'
  const expectedSecret = process.env.PREVIEW_SECRET || process.env.REVALIDATE_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid preview secret' }, { status: 401 })
  }

  draftMode().enable()

  if (collection === 'posts') {
    redirect(`/blog/${slug}`)
  }

  redirect(slug === 'home' || slug === '/' ? '/' : `/${slug}`)
}
