const BLOCKED_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i,
  /dirbuster/i, /gobuster/i, /nuclei/i, /zgrab/i,
  /semrush/i, /ahref/i, /mj12bot/i, /dotbot/i,
  /bytespider/i, /petalbot/i,
  /havij/i, /acunetix/i, /netsparker/i, /w3af/i,
  /burpsuite/i, /openvas/i, /metasploit/i, /hydra/i,
  /wpscan/i, /joomscan/i, /whatweb/i, /skipfish/i,
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
  /\$\{.*\}/,
  /\bor\b\s+['"]?\s*\d+\s*=\s*\d+/i,
  /\band\b\s+['"]?\s*\d+\s*=\s*\d+/i,
  /\bsleep\s*\(\s*\d/i,
  /\bbenchmark\s*\(/i,
  /\bwaitfor\b.*\bdelay\b/i,
  /\bload_file\s*\(/i,
  /\binto\s+outfile\b/i,
  /\binto\s+dumpfile\b/i,
  /%00/,
  /\x00/,
]

const MAX_URL_LENGTH = 2048
const MAX_HEADER_SIZE = 8192

const rateLimitMap = new Map()
const RATE_WINDOW_MS = 10000
const RATE_MAX_REQUESTS = 60

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 })
    return true
  }
  entry.count++
  if (entry.count > RATE_MAX_REQUESTS) return false
  return true
}

if (typeof globalThis.__rl_cleanup === 'undefined') {
  globalThis.__rl_cleanup = setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of rateLimitMap) {
      if (now - entry.windowStart > RATE_WINDOW_MS * 2) rateLimitMap.delete(ip)
    }
  }, 30000)
}

export default function middleware(request) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''
  const path = url.pathname + url.search
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'

  if (path.length > MAX_URL_LENGTH) {
    return new Response('URI Too Long', { status: 414 })
  }

  const headerSize = [...request.headers.entries()]
    .reduce((sum, [k, v]) => sum + k.length + v.length, 0)
  if (headerSize > MAX_HEADER_SIZE) {
    return new Response('Request Header Fields Too Large', { status: 431 })
  }

  if (!ua || ua.length < 5) {
    return new Response('Forbidden', { status: 403 })
  }

  for (const pattern of BLOCKED_UA_PATTERNS) {
    if (pattern.test(ua)) {
      return new Response('Forbidden', { status: 403 })
    }
  }

  let decodedPath
  try {
    decodedPath = decodeURIComponent(path)
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(decodedPath)) {
      return new Response('Forbidden', { status: 403 })
    }
  }

  if (/[<>"'`]/.test(url.search)) {
    return new Response('Forbidden', { status: 403 })
  }

  const method = request.method.toUpperCase()
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!checkRateLimit(ip)) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '10' }
    })
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|assets/).*)'],
}
