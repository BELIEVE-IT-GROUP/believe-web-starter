const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL!
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG!

export async function fetchPayload<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = new URL(`${PAYLOAD_URL}/api/${path}`)
  url.searchParams.set('depth', '2')
  url.searchParams.set('where[tenant][slug][equals]', TENANT_SLUG)

  const res = await fetch(url.toString(), {
    ...options,
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    console.error(`Payload fetch error: ${res.status} ${url}`)
    throw new Error(`Payload API returned ${res.status}`)
  }

  return res.json()
}

export async function getPageBySlug(slug: string) {
  try {
    const { docs } = await fetchPayload<{ docs: any[] }>(`pages?where[slug][equals]=${encodeURIComponent(slug)}`)
    return docs[0] || null
  } catch {
    return null
  }
}

export async function getTenant() {
  try {
    const { docs } = await fetchPayload<{ docs: any[] }>('tenants')
    return docs.find((t: any) => t.slug === TENANT_SLUG) || null
  } catch {
    return null
  }
}
