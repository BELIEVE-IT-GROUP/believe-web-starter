const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://cms.believe-global.com'
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || ''

// Generic fetch wrapper for Payload REST API
export async function fetchPayload<T = any>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const url = `${PAYLOAD_URL}${path}`
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      next: { revalidate: 60 },
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

  // Add tenant filter if configured
  if (TENANT_ID) {
    search.set('where[tenant][equals]', TENANT_ID)
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

  const data = await fetchPayload<{ docs: Page[] }>(`/api/pages${qs}`)
  return data?.docs?.[0] || null
}

export async function getAllPages(): Promise<Page[]> {
  const qs = buildQuery({
    'where[_status][equals]': 'published',
    depth: 0,
    limit: 100,
  })

  const data = await fetchPayload<{ docs: Page[] }>(`/api/pages${qs}`)
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

  const data = await fetchPayload<{ docs: Post[] }>(`/api/posts${qs}`)
  return data?.docs?.[0] || null
}

export async function getAllPosts(limit = 100): Promise<Post[]> {
  const qs = buildQuery({
    'where[_status][equals]': 'published',
    depth: 1,
    sort: '-publishedAt',
    limit,
  })

  const data = await fetchPayload<{ docs: Post[] }>(`/api/posts${qs}`)
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
  if (!TENANT_ID) return null

  const data = await fetchPayload<Tenant>(`/api/tenants/${TENANT_ID}?depth=0`)
  return data || null
}
