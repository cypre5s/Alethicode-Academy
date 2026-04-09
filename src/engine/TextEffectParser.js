const TAG_REGEX = /\{(\/?)(\w+)(?::([^}]*))?\}/g

const VALID_WRAP_TAGS = new Set(['em', 'shake', 'fade', 'breath'])
const VALID_SELF_CLOSING = new Set(['pause', 'speed'])

export function parseTextEffects(raw) {
  if (!raw || typeof raw !== 'string') return [{ type: 'text', content: '', effects: [] }]

  const tokens = []
  const activeEffects = []
  let lastIndex = 0

  TAG_REGEX.lastIndex = 0
  let match
  while ((match = TAG_REGEX.exec(raw)) !== null) {
    const [full, isClosing, tagName, param] = match
    const before = raw.slice(lastIndex, match.index)

    if (before.length > 0) {
      tokens.push({ type: 'text', content: before, effects: [...activeEffects] })
    }

    if (VALID_SELF_CLOSING.has(tagName) && !isClosing) {
      if (tagName === 'pause') {
        tokens.push({ type: 'pause', duration: Math.min(parseInt(param) || 300, 3000) })
      } else if (tagName === 'speed') {
        const valid = ['slow', 'fast', 'normal']
        tokens.push({ type: 'speed', value: valid.includes(param) ? param : 'normal' })
      }
    } else if (VALID_WRAP_TAGS.has(tagName)) {
      if (isClosing) {
        const idx = activeEffects.lastIndexOf(tagName)
        if (idx !== -1) activeEffects.splice(idx, 1)
      } else {
        activeEffects.push(tagName)
      }
    }

    lastIndex = match.index + full.length
  }

  const tail = raw.slice(lastIndex)
  if (tail.length > 0) {
    tokens.push({ type: 'text', content: tail, effects: [...activeEffects] })
  }

  if (tokens.length === 0) {
    tokens.push({ type: 'text', content: '', effects: [] })
  }

  return tokens
}

export function stripTags(raw) {
  if (!raw || typeof raw !== 'string') return ''
  return raw.replace(TAG_REGEX, '')
}

const PUNCTUATION_PAUSE = {
  '，': 'comma', '、': 'comma', ',': 'comma',
  '。': 'period', '.': 'period', '！': 'period', '!': 'period',
  '？': 'period', '?': 'period',
  '……': 'ellipsis', '…': 'ellipsis',
  '——': 'dash', '—': 'dash',
}

export function getCharPause(char, prevChar, rhythm) {
  if (!rhythm) return 0

  if (prevChar === '…' && char === '…') return 0
  const combo = prevChar ? prevChar + char : char

  if (combo === '……') {
    return rhythm.pauseAfterEllipsis || 0
  }

  const kind = PUNCTUATION_PAUSE[char]
  if (kind === 'ellipsis') return rhythm.pauseAfterEllipsis || 0
  if (kind === 'period') return rhythm.pauseAfterPeriod || 0
  if (kind === 'comma') return rhythm.pauseAfterComma || 0
  if (kind === 'dash') return rhythm.pauseAfterComma || 0

  return 0
}

export const SPEED_MULTIPLIERS = {
  slow: 2.0,
  normal: 1.0,
  fast: 0.4,
}
