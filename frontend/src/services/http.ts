export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:9000'
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export async function ensureCsrf(baseUrl: string = getBaseUrl()) {
  if (!getCookie('XSRF-TOKEN')) {
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' })
  }
}

export async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl()
  await ensureCsrf(baseUrl)
  const res = await fetch(`${baseUrl}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  })
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }
  return res.json()
}
