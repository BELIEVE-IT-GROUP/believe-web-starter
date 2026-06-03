const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://cms.believe-global.com'
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || 'believe'

// CMS requires authentication. For now, return null to use demo/fallback data.
// TODO: Configure CMS public read access or add API key auth
export async function fetchPayload<T = any>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  return null as T | null
}

export async function getPageBySlug(slug: string): Promise<any | null> {
  return null
}

export async function getAllPages(): Promise<any[]> {
  return []
}

export async function getPostBySlug(slug: string): Promise<any | null> {
  return null
}

export async function getAllPosts(limit = 100): Promise<any[]> {
  return []
}

export async function getTenant(): Promise<any | null> {
  return null
}
