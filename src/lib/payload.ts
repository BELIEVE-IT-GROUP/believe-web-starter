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
    primaryColor?: string
    accentColor?: string
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
  const qs = buildQuery({
    depth: 2,
    limit: 1,
  })

  const data = await fetchPayload<{ docs: SiteSettings[] }>(`/api/settings${qs}`, {
    next: { revalidate: 60, tags: ['payload_settings'] },
  })

  return data?.docs?.[0] || null
}
