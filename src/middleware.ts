import { NextResponse, type NextRequest } from 'next/server'

// Hosts del sistema (NO son dominios de cliente): no se reescriben.
const SYSTEM_HOSTS = new Set(['puck.believe-global.com', 'cms.believe-global.com', 'localhost'])

/**
 * Multi-dominio: si el request llega por un dominio custom (CNAME del cliente →
 * puck), reescribe /<path> → /s/<host>/<path>. El page /s/[tenant] resuelve ese
 * host a su tenant por `domains` (getTenantByDomain). En puck.believe-global.com
 * (host del sistema) no toca nada. /admin, /api, /_next y assets quedan fuera (matcher).
 */
export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase().split(':')[0]
  if (
    !host ||
    SYSTEM_HOSTS.has(host) ||
    host.endsWith('.sslip.io') ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host) // IP literal
  ) {
    return NextResponse.next()
  }
  const url = req.nextUrl.clone()
  url.pathname = `/s/${host}${url.pathname === '/' ? '' : url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Excluye api, admin, _next, /s ya internas, y cualquier path con extensión (assets).
  matcher: ['/((?!api|admin|_next|s/|favicon\\.ico|.*\\.).*)'],
}
