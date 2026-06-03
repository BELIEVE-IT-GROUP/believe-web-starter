import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * ISR Revalidation Webhook
 *
 * Recibe POST desde Payload CMS para invalidar cache.
 * IMPORTANTE: dynamic = 'force-dynamic' evita pre-renderizado estático
 * que causaba error con revalidatePath en Next.js 14 Route Handlers.
 */

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, paths, tags } = body

    const expectedSecret = process.env.REVALIDATE_SECRET
    if (!expectedSecret) {
      return NextResponse.json(
        { revalidated: false, message: 'REVALIDATE_SECRET no configurado' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { revalidated: false, message: 'Secret inválido' },
        { status: 401 }
      )
    }

    const hasPaths = Array.isArray(paths) && paths.length > 0
    const hasTags = Array.isArray(tags) && tags.length > 0

    if (!hasPaths && !hasTags) {
      return NextResponse.json(
        { revalidated: false, message: 'Se requiere "paths" o "tags"' },
        { status: 400 }
      )
    }

    const results: {
      paths?: { path: string; success: boolean; error?: string }[]
      tags?: { tag: string; success: boolean; error?: string }[]
    } = {}

    if (hasPaths) {
      results.paths = paths.map((path: string) => {
        try {
          revalidatePath(path)
          return { path, success: true }
        } catch (err: any) {
          return { path, success: false, error: err.message }
        }
      })
    }

    if (hasTags) {
      results.tags = tags.map((tag: string) => {
        try {
          revalidateTag(tag)
          return { tag, success: true }
        } catch (err: any) {
          return { tag, success: false, error: err.message }
        }
      })
    }

    const allSucceeded =
      (!results.paths || results.paths.every((r) => r.success)) &&
      (!results.tags || results.tags.every((r) => r.success))

    return NextResponse.json(
      {
        revalidated: allSucceeded,
        message: allSucceeded ? 'Revalidación exitosa' : 'Algunas fallaron',
        ...results,
      },
      { status: allSucceeded ? 200 : 207 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { revalidated: false, message: 'Error interno', error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Método no permitido. Usar POST.' },
    { status: 405 }
  )
}
