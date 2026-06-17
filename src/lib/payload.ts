const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://cms.believe-global.com'
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || ''
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || ''

export function getMediaUrl(media?: { url?: string } | string | null): string {
  const url = typeof media === 'string' ? media : media?.url
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `${PAYLOAD_URL}${url}`
  return url
}

// Generic fetch wrapper for Payload REST API
export async function fetchPayload<T = any>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T | null> {
  try {
    const url = `${PAYLOAD_URL}${path}`
    const res = await fetch(url, {
      ...options,
      // Payload (cms.believe-global.com) fue retirado. Timeout corto: si no
      // responde, resolvemos a null y el render usa sus fallbacks (las páginas
      // Puck no dependen de Payload). Evita colgar el render ~30s por request.
      signal: AbortSignal.timeout(2500),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      next: options?.next || { revalidate: 60 },
    })

    if (!res.ok) {
      console.warn(`[payload] ${res.status} ${url}`)
      return null
    }

    return (await res.json()) as T
  } catch (err) {
    console.error('[payload] fetch error:', err)
    return null
  }
}

// Build query string with tenant filter and extra params
function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()

  if (TENANT_ID) {
    search.set('where[tenant][equals]', TENANT_ID)
  } else if (TENANT_SLUG) {
    search.set('where[tenant][slug][equals]', TENANT_SLUG)
  }

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }

  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

// ─── Deep merge (CMS override on top of default content) ─────────────

function isPlainObject(value: unknown): value is Record<string, any> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

function isEmptyOverride(value: unknown): boolean {
  return value === undefined || value === null || value === ''
}

// Deep merge: for each field, if override brings a non-empty value it wins;
// plain objects merge recursively; arrays replace wholesale only when the
// override array is non-empty, otherwise the base array stays.
export function deepMerge<T>(base: T, override: any): T {
  if (override === undefined || override === null) return base

  if (Array.isArray(base) || Array.isArray(override)) {
    return (Array.isArray(override) && override.length > 0 ? override : base) as T
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, any> = { ...base }
    for (const key of Object.keys(override)) {
      const ov = override[key]
      const bv = (base as Record<string, any>)[key]
      if (isPlainObject(bv) && isPlainObject(ov)) {
        out[key] = deepMerge(bv, ov)
      } else if (Array.isArray(bv) || Array.isArray(ov)) {
        out[key] = Array.isArray(ov) && ov.length > 0 ? ov : bv
      } else if (!isEmptyOverride(ov)) {
        out[key] = ov
      }
    }
    return out as T
  }

  return (isEmptyOverride(override) ? base : override) as T
}

// ─── Landings ────────────────────────────────────────────────────────

// Fetch a landing doc from the CMS 'landings' collection by slug + tenant.
// Returns doc.content (or the doc) if found, or null. Never throws: a missing
// collection or failed fetch resolves to null so the render falls back to the
// default content.
//
// Normaliza la respuesta de Payload al shape de content.ts: los arrays de strings
// se guardan como [{ value, id }] (Payload no soporta arrays de strings planos) y
// cada item lleva un `id` interno. Aplana {value} -> string y limpia los `id`.
function normalizeLanding(v: any): any {
  if (Array.isArray(v)) {
    if (
      v.length &&
      v.every((x) => x && typeof x === 'object' && 'value' in x && Object.keys(x).filter((k) => k !== 'id').length === 1)
    ) {
      return v.map((x) => x.value)
    }
    return v.map(normalizeLanding)
  }
  if (v && typeof v === 'object') {
    const out: any = {}
    for (const k of Object.keys(v)) {
      if (k === 'id') continue
      out[k] = normalizeLanding(v[k])
    }
    return out
  }
  return v
}

export async function getLandingContent(slug: string): Promise<any | null> {
  try {
    const qs = buildQuery({
      'where[slug][equals]': slug,
      depth: 2,
      limit: 1,
    })

    const data = await fetchPayload<{ docs: any[] }>(`/api/landings${qs}`, {
      next: { revalidate: 60, tags: ['payload_landings'] },
    })

    const doc = data?.docs?.[0]
    if (!doc) return null
    return normalizeLanding(doc.content ?? doc)
  } catch (err) {
    console.error('[payload] getLandingContent error:', err)
    return null
  }
}

// ─── Pages ───────────────────────────────────────────────────────────

export interface Page {
  id: string
  title: string
  slug: string
  blocks?: any[]
  seo?: {
    title?: string
    description?: string
    image?: Media
  }
  tenant?: string | { id: string; name: string }
  createdAt: string
  updatedAt: string
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const qs = buildQuery({
    'where[slug][equals]': slug,
    depth: 1,
    limit: 1,
  })

  const data = await fetchPayload<{ docs: Page[] }>(`/api/pages${qs}`, {
    next: { revalidate: 60, tags: ['payload_pages'] },
  })
  return data?.docs?.[0] || null
}

export async function getAllPages(): Promise<Page[]> {
  const qs = buildQuery({
    'where[_status][equals]': 'published',
    depth: 0,
    limit: 100,
  })

  const data = await fetchPayload<{ docs: Page[] }>(`/api/pages${qs}`, {
    next: { revalidate: 60, tags: ['payload_pages'] },
  })
  return data?.docs || []
}

// ─── Posts ───────────────────────────────────────────────────────────

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: Media
  content?: any
  category?: Category
  publishedAt?: string
  readTime?: number
  seo?: {
    title?: string
    description?: string
    image?: Media
  }
  tenant?: string | { id: string; name: string }
  createdAt: string
  updatedAt: string
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const qs = buildQuery({
    'where[slug][equals]': slug,
    depth: 1,
    limit: 1,
  })

  const data = await fetchPayload<{ docs: Post[] }>(`/api/posts${qs}`, {
    next: { revalidate: 60, tags: ['payload_posts'] },
  })
  return data?.docs?.[0] || null
}

export async function getAllPosts(limit = 100): Promise<Post[]> {
  const qs = buildQuery({
    'where[_status][equals]': 'published',
    depth: 1,
    sort: '-publishedAt',
    limit,
  })

  const data = await fetchPayload<{ docs: Post[] }>(`/api/posts${qs}`, {
    next: { revalidate: 60, tags: ['payload_posts'] },
  })
  return data?.docs || []
}

// ─── Categories ──────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export async function getAllCategories(): Promise<Category[]> {
  const qs = buildQuery({
    depth: 0,
    limit: 100,
  })

  const data = await fetchPayload<{ docs: Category[] }>(`/api/categories${qs}`)
  return data?.docs || []
}

// ─── Media ───────────────────────────────────────────────────────────

export interface Media {
  id: string
  url: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  alt?: string
  createdAt: string
  updatedAt: string
}

export async function getAllMedia(limit = 100): Promise<Media[]> {
  const qs = buildQuery({
    depth: 0,
    limit,
  })

  const data = await fetchPayload<{ docs: Media[] }>(`/api/media${qs}`)
  return data?.docs || []
}

// ─── Tenant ──────────────────────────────────────────────────────────

export interface Tenant {
  id: string
  name: string
  slug: string
  domains?: { domain: string }[]
  createdAt: string
  updatedAt: string
}

export async function getTenant(): Promise<Tenant | null> {
  if (TENANT_SLUG) {
    const qs = new URLSearchParams()
    qs.set('where[slug][equals]', TENANT_SLUG)
    qs.set('depth', '1')
    qs.set('limit', '1')

    const data = await fetchPayload<{ docs: Tenant[] }>(`/api/tenants?${qs.toString()}`)
    return data?.docs?.[0] || null
  }

  if (!TENANT_ID) return null

  const data = await fetchPayload<Tenant>(`/api/tenants/${TENANT_ID}?depth=0`)
  return data || null
}

export interface SiteSettings {
  id: string
  siteName: string
  domain?: string
  previewUrl?: string
  header?: {
    templateId?: string
    logo?: Media
    navLinks?: { label: string; url: string; newTab?: boolean }[]
    cta?: { label?: string; url?: string }
  }
  footer?: {
    templateId?: string
    text?: string
    links?: { label: string; url: string; group?: string }[]
  }
  theme?: {
    // ── Colors ─────────────────────────────────────────────────────────
    primaryColor?: string
    accentColor?: string
    paperColor?: string
    inkColor?: string
    signalColor?: string
    inkMutedColor?: string
    // ── Fonts ──────────────────────────────────────────────────────────
    displayFont?: string
    bodyFont?: string
    monoFont?: string
    // ── Shape (preset keys) ────────────────────────────────────────────
    radiusBase?: string           // "none" | "soft" | "rounded" | "pill"
    shadowLevel?: 'none' | 'flat' | 'soft' | 'elevated'
    densityLevel?: 'compact' | 'default' | 'airy'
    // ── Shape (resolved values — written by cms_set_theme_from_dna) ───
    radiusButton?: string
    radiusCard?: string
    radiusInput?: string
    radiusPill?: string
    shadowCard?: string
    shadowButton?: string
    cardBorderWidth?: string
    // ── Spacing (resolved) ─────────────────────────────────────────────
    sectionPaddingY?: string
    sectionPaddingYSm?: string
    heroPaddingY?: string
    cardPadding?: string
    // ── Motion (resolved) ──────────────────────────────────────────────
    transitionDuration?: string
    transitionEasing?: string
    // ── Brand personality (resolved) ──────────────────────────────────
    grainOpacity?: string
    dividerOpacity?: string
    trackingTight?: string
    // ── Tone (metadata) ────────────────────────────────────────────────
    tone?: string
    // ── Escape hatch ───────────────────────────────────────────────────
    cssVarsRaw?: Record<string, string>
    // ── Legacy (backward compat) ───────────────────────────────────────
    defaultOgImage?: Media
  }
  socialLinks?: { platform: string; url: string }[]
  contact?: {
    defaultDestinationEmail?: string
    publicEmail?: string
    phone?: string
    address?: string
    mapUrl?: string
  }
  newsletter?: {
    listId?: string
    successMessage?: string
  }
  analytics?: {
    gaMeasurementId?: string
    googleTagManagerId?: string
    metaPixelId?: string
  }
}

export async function getSettings(): Promise<SiteSettings | null> {
  // Payload (cms.believe-global.com) fue retirado. El theme del CMS Puck vive en
  // el CSS de cada block set, no en Payload. Cortocircuito a null: sin fetch, sin
  // timeout, sin spam de logs. Se llama en el layout root en cada render.
  return null
}
