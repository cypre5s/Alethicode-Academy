import { reactive } from 'vue'
import { knowledgeDomains } from '../data/learningDomains.js'

const SRS_KEY = 'alethicode_srs_data'

export function useSpacedRepetition() {
  const cards = reactive({})

  function _load() {
    try {
      const raw = localStorage.getItem(SRS_KEY)
      if (raw) Object.assign(cards, JSON.parse(raw))
    } catch { /* ignore corrupted data */ }
  }

  function _save() {
    try { localStorage.setItem(SRS_KEY, JSON.stringify(cards)) }
    catch { /* storage full */ }
  }

  _load()

  function recordOutcome(challengeId, domain, outcome) {
    if (!domain) return
    const key = `${domain}:${challengeId}`
    const now = Date.now()

    if (!cards[key]) {
      cards[key] = {
        domain,
        challengeId,
        lastReview: now,
        interval: 1,
        easeFactor: 2.5,
        streak: 0,
        nextDueChapter: 1,
      }
    }

    const card = cards[key]
    card.lastReview = now

    const passed = outcome === 'solo_pass' || outcome === 'assisted_pass' ||
                   outcome === 'excellent_teach' || outcome === 'accurate_teach'

    if (passed) {
      card.streak++
      if (outcome === 'solo_pass' || outcome === 'excellent_teach') {
        card.easeFactor = Math.min(card.easeFactor + 0.15, 3.0)
      } else {
        card.easeFactor = Math.max(card.easeFactor - 0.05, 1.3)
      }
      card.interval = Math.min(Math.round(card.interval * card.easeFactor), 16)
    } else {
      card.streak = 0
      card.interval = 1
      card.easeFactor = Math.max(card.easeFactor - 0.2, 1.3)
    }

    card.nextDueChapter = _currentChapterNum() + card.interval
    _save()
  }

  function getDueReviews(currentChapter) {
    const chapterNum = _parseChapterNum(currentChapter)
    const due = []
    for (const [key, card] of Object.entries(cards)) {
      if (card.nextDueChapter <= chapterNum) {
        const domainInfo = knowledgeDomains[card.domain]
        due.push({
          key,
          domain: card.domain,
          domainLabel: domainInfo?.label || card.domain,
          challengeId: card.challengeId,
          interval: card.interval,
          streak: card.streak,
          lastReview: card.lastReview,
        })
      }
    }
    return due.sort((a, b) => a.lastReview - b.lastReview).slice(0, 3)
  }

  function buildSRSPromptCard(characterId, dueItems) {
    if (!dueItems || dueItems.length === 0) return ''

    const styleMap = {
      nene: (item) => `记得我们一起学的「${item.domainLabel}」吗？那时候……`,
      yoshino: (item) => `顺便问一句，上次「${item.domainLabel}」的内容你还记得吗？`,
      kanna: (item) => `……${item.domainLabel}。`,
      ayase: (item) => `哦对了，上次那个「${item.domainLabel}」的问题，现在秒答了吧？`,
      murasame: (item) => `既然你觉得自己懂「${item.domainLabel}」……证明给我看。`,
    }

    const lines = dueItems.map(item => {
      const styleFn = styleMap[characterId] || ((i) => `关于「${i.domainLabel}」……`)
      return `- ${styleFn(item)}（距上次复习已 ${item.interval} 章，连续正确 ${item.streak} 次）`
    })

    return `【复习提示（低优先级，仅在话题自然相关时提及）】
以下概念玩家学过但距今较久，如果话题恰好相关可自然提及，但绝不可为了提及而忽略玩家的实际发言：
${lines.join('\n')}
比如用它做类比，或回忆你们一起学的时候。不要直接考试。玩家的问题永远最优先回答。`
  }

  function onReviewMentioned(domain) {
    for (const [, card] of Object.entries(cards)) {
      if (card.domain === domain) {
        card.lastReview = Date.now()
        card.interval = Math.min(card.interval + 1, 16)
        card.nextDueChapter = _currentChapterNum() + card.interval
      }
    }
    _save()
  }

  function getState() {
    return JSON.parse(JSON.stringify(cards))
  }

  function restoreState(saved) {
    Object.keys(cards).forEach(k => delete cards[k])
    if (saved && typeof saved === 'object') {
      Object.assign(cards, saved)
    }
  }

  let _chapterRef = null
  function setChapterRef(ref) { _chapterRef = ref }

  function _currentChapterNum() {
    return _parseChapterNum(_chapterRef?.value || '')
  }

  function _parseChapterNum(ch) {
    if (!ch) return 1
    const m = String(ch).match(/(\d+)/)
    return m ? parseInt(m[1]) : 1
  }

  return {
    cards,
    recordOutcome,
    getDueReviews,
    buildSRSPromptCard,
    onReviewMentioned,
    getState,
    restoreState,
    setChapterRef,
  }
}
