export const knowledgeDomains = {
  basics:      { label: '基础语法',   primaryChar: 'nene',     primaryDim: 'comfort' },
  strings:     { label: '字符串处理', primaryChar: 'nene',     primaryDim: 'comfort' },
  conventions: { label: '代码规范',   primaryChar: 'yoshino',  primaryDim: 'trust' },
  debug:       { label: '调试排错',   primaryChar: 'ayase',    primaryDim: 'comfort' },
  loops:       { label: '循环分支',   primaryChar: 'yoshino',  primaryDim: 'trust' },
  algorithms:  { label: '算法优化',   primaryChar: 'kanna',    primaryDim: 'trust' },
  functions:   { label: '函数模块化', primaryChar: 'nene',     primaryDim: 'trust' },
  advanced:    { label: '进阶综合',   primaryChar: 'murasame', primaryDim: 'affection' },
}

export const outcomeTypes = ['solo_pass', 'assisted_pass', 'thoughtful_fail', 'careless_fail', 'excellent_teach', 'accurate_teach', 'warm_but_wrong', 'poor_teach']

export const outcomeDeltas = {
  solo_pass:       { affection: 1, trust: 2, comfort: 1 },
  assisted_pass:   { affection: 0, trust: 1, comfort: 2 },
  thoughtful_fail: { affection: 0, trust: 1, comfort: 0 },
  careless_fail:   { affection: 0, trust: -1, comfort: -1 },
  excellent_teach: { affection: 2, trust: 2, comfort: 2 },
  accurate_teach:  { affection: 0, trust: 2, comfort: 0 },
  warm_but_wrong:  { affection: 1, trust: -1, comfort: 2 },
  poor_teach:      { affection: 0, trust: 0, comfort: -1 },
}

export const characterDeltaModifiers = {
  nene: {
    comfort: 1.5,
    trust: 1.0,
    affection: 1.0,
    solo_pass_bonus:       { comfort: 1 },
    assisted_pass_bonus:   { comfort: 1 },
    thoughtful_fail_bonus: { comfort: 1 },
    careless_fail_bonus:   {},
  },
  yoshino: {
    comfort: 0.8,
    trust: 1.5,
    affection: 0.8,
    solo_pass_bonus:       { trust: 1 },
    assisted_pass_bonus:   {},
    thoughtful_fail_bonus: {},
    careless_fail_bonus:   { trust: -1 },
  },
  ayase: {
    comfort: 1.2,
    trust: 1.2,
    affection: 1.0,
    solo_pass_bonus:       { affection: 1 },
    assisted_pass_bonus:   { comfort: 1 },
    thoughtful_fail_bonus: { comfort: 1 },
    careless_fail_bonus:   {},
  },
  kanna: {
    comfort: 0.8,
    trust: 1.5,
    affection: 0.8,
    solo_pass_bonus:       { trust: 1 },
    assisted_pass_bonus:   {},
    thoughtful_fail_bonus: { trust: 1 },
    careless_fail_bonus:   {},
  },
  murasame: {
    comfort: 0.5,
    trust: 1.0,
    affection: 1.5,
    solo_pass_bonus:       { affection: 1, trust: 1 },
    assisted_pass_bonus:   {},
    thoughtful_fail_bonus: {},
    careless_fail_bonus:   { affection: -1 },
  },
}

export function classifyChallengeOutcome(success, hintsUsed, challengeId, challengeResults, challenges) {
  if (success && hintsUsed === 0) return 'solo_pass'
  if (success && hintsUsed > 0) return 'assisted_pass'

  const currentDomain = challenges[challengeId]?.knowledge_domain
  if (!success && currentDomain) {
    const hasPriorSameDomainFail = Object.entries(challengeResults).some(([id, result]) => {
      if (id === challengeId) return false
      return !result.passed && challenges[id]?.knowledge_domain === currentDomain
    })
    if (hasPriorSameDomainFail) return 'careless_fail'
  }

  return 'thoughtful_fail'
}

export function calculateRelationshipDelta(outcome, characterId, domain) {
  const base = outcomeDeltas[outcome]
  if (!base) return { affection: 0, trust: 0, comfort: 0 }

  const mod = characterDeltaModifiers[characterId]
  if (!mod) return { ...base }

  const domainInfo = knowledgeDomains[domain]
  const isPrimaryChar = domainInfo?.primaryChar === characterId
  const primaryDim = domainInfo?.primaryDim

  let delta = {
    affection: Math.round(base.affection * (mod.affection || 1)),
    trust:     Math.round(base.trust * (mod.trust || 1)),
    comfort:   Math.round(base.comfort * (mod.comfort || 1)),
  }

  if (isPrimaryChar && primaryDim && delta[primaryDim] > 0) {
    delta[primaryDim] += 1
  }

  const bonus = mod[`${outcome}_bonus`]
  if (bonus) {
    for (const [dim, val] of Object.entries(bonus)) {
      delta[dim] = (delta[dim] || 0) + val
    }
  }

  delta.affection = Math.max(-3, Math.min(3, delta.affection))
  delta.trust     = Math.max(-3, Math.min(3, delta.trust))
  delta.comfort   = Math.max(-3, Math.min(3, delta.comfort))

  return delta
}
