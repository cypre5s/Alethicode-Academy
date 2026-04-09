const BLOCKED_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i,
  /dirbuster/i, /gobuster/i, /nuclei/i, /zgrab/i,
  /semrush/i, /ahref/i, /mj12bot/i, /dotbot/i,
  /bytespider/i, /petalbot/i,
]

const BLOCKED_PATH_PATTERNS = [
  /\.\.\//,
  /\/etc\/passwd/,
  /\/proc\/self/,
  /<script/i,
  /\bunion\b.*\bselect\b/i,
  /\bexec\b.*\bxp_/i,
  /\bdrop\b.*\btable\b/i,
  /eval\s*\(/i,
  /\$\{.*jndi/i,
]

const MAX_URL_LENGTH = 2048
const MAX_HEADER_SIZE = 8192

export default function middleware(request) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''
  const path = url.pathname + url.search

  if (path.length > MAX_URL_LENGTH) {
    return new Response('URI Too Long', { status: 414 })
  }

  const headerSize = [...request.headers.entries()]
    .reduce((sum, [k, v]) => sum + k.length + v.length, 0)
  if (headerSize > MAX_HEADER_SIZE) {
    return new Response('Request Header Fields Too Large', { status: 431 })
  }

  for (const pattern of BLOCKED_UA_PATTERNS) {
    if (pattern.test(ua)) {
      return new Response('Forbidden', { status: 403 })
    }
  }

  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(decodeURIComponent(path))) {
      return new Response('Forbidden', { status: 403 })
    }
  }

  const method = request.method.toUpperCase()
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return new Response('Method Not Allowed', { status: 405 })
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|assets/).*)'],
}
