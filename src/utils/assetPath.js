const RUNTIME_BASE = import.meta.env?.BASE_URL || '/'

export function assetPath(inputPath) {
  if (!inputPath) return inputPath
  if (/^(https?:|data:|blob:)/.test(inputPath)) return inputPath
  const normalized = String(inputPath).replace(/^\/+/, '')
  return `${RUNTIME_BASE}${normalized}`
}
