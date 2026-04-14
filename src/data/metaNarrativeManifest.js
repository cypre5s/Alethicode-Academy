export const META_UNLOCKS = {
  second_sight: {
    id: 'second_sight',
    name: '既视感',
    description: '二周目时，角色偶尔会说出暗示"记得你"的台词',
    condition: { minPlaythroughs: 2 },
    effect: 'deja_vu_dialogues',
  },
  ghost_of_deletion: {
    id: 'ghost_of_deletion',
    name: '消失的记忆',
    description: '删除存档后重新开始，角色会感到"有什么重要的东西不见了"',
    condition: { saveDeletionDetected: true },
    effect: 'deletion_awareness',
  },
  parallel_hearts: {
    id: 'parallel_hearts',
    name: '平行心跳',
    description: '在不同周目攻略不同角色后，她们会隐约提起"另一个世界的你"',
    condition: { minDistinctRoutes: 2 },
    effect: 'parallel_world_hints',
  },
  true_name: {
    id: 'true_name',
    name: '真名',
    description: '用相同名字多次通关，Nene 会在序章直接叫出你的名字',
    condition: { sameNamePlaythroughs: 3 },
    effect: 'nene_remembers_name',
  },
  code_archaeologist: {
    id: 'code_archaeologist',
    name: '代码考古学家',
    description: '上一周目写过的代码会作为"遗迹"出现在 World Console 中',
    condition: { minPlaythroughs: 2, hasCodeHistory: true },
    effect: 'code_ruins',
  },
  confession_collector: {
    id: 'confession_collector',
    name: '全员告白',
    description: '集齐所有角色的 Good Ending 后，解锁特殊后日谈',
    condition: { allGoodEndings: true },
    effect: 'unlock_epilogue',
  },
  murasame_true: {
    id: 'murasame_true',
    name: 'Murasame True Ending',
    description: '所有角色好感度高 + Murasame 通关条件 → 真结局路线',
    condition: { allGoodEndings: true, murasameGoodSeen: true },
    effect: 'unlock_true_route',
  },
  recursive_love: {
    id: 'recursive_love',
    name: '递归的爱',
    description: '在代码中写递归并且同时攻略 Kanna，触发特殊 CG',
    condition: { flag: 'mastered_recursion', route: 'kanna' },
    effect: 'special_cg_recursive_love',
  },
  coder_confession: {
    id: 'coder_confession',
    name: '代码告白',
    description: '在代码中输出爱心/告白内容时触发特殊对话',
    condition: { flag: 'code_confession_seen' },
    effect: 'code_confession_memory',
  },
  persistence_reward: {
    id: 'persistence_reward',
    name: '锲而不舍',
    description: '一道题失败3次以上最终成功，解锁特殊鼓励对话',
    condition: { challengeRetrySuccess: true },
    effect: 'perseverance_dialogue',
  },
}

export const CHARACTER_EMOTIONAL_DEPTH = {
  nene: {
    baseTemperament: 'warm',
    emotionalInertia: 0.8,
    memoryWeight: {
      recent: 1.5,
      emotional: 2.0,
      challenge: 1.2,
      confession: 3.0,
    },
    autonomousBehaviors: {
      lowAffection: ['worry_about_studies', 'formal_greeting'],
      midAffection: ['remember_preference', 'proactive_help', 'share_discovery'],
      highAffection: ['blush_on_meeting', 'protective_warning', 'personal_confession'],
    },
    moodDecayRates: {
      happy: 0.02,
      sad: 0.05,
      embarrassed: 0.08,
      worried: 0.03,
      touched: 0.01,
    },
    deepMemoryTriggers: [
      { condition: 'first_success', text: '记得你第一次答对题目的样子', emotion: 'warm', weight: 2.5 },
      { condition: 'helped_with_bug', text: '那次你帮我调试心模块', emotion: 'grateful', weight: 3.0 },
      { condition: 'stayed_late', text: '你为了帮我在计算机教室待到很晚', emotion: 'touched', weight: 2.8 },
    ],
  },
  yoshino: {
    baseTemperament: 'reserved',
    emotionalInertia: 0.5,
    memoryWeight: {
      recent: 1.0,
      emotional: 1.5,
      challenge: 2.0,
      confession: 2.5,
    },
    autonomousBehaviors: {
      lowAffection: ['code_review_criticism', 'ignore_greeting'],
      midAffection: ['subtle_help', 'shared_reference', 'tsundere_concern'],
      highAffection: ['rare_praise', 'glasses_off_moment', 'vulnerable_code_review'],
    },
    moodDecayRates: {
      happy: 0.04,
      sad: 0.02,
      embarrassed: 0.12,
      annoyed: 0.06,
      impressed: 0.03,
    },
    deepMemoryTriggers: [
      { condition: 'clean_code', text: '代码写得不错……不是夸你', emotion: 'impressed', weight: 2.5 },
      { condition: 'code_pair', text: '协作编程的那天下午', emotion: 'warm', weight: 3.0 },
    ],
  },
  ayase: {
    baseTemperament: 'energetic',
    emotionalInertia: 0.9,
    memoryWeight: {
      recent: 2.0,
      emotional: 1.5,
      challenge: 2.5,
      confession: 2.0,
    },
    autonomousBehaviors: {
      lowAffection: ['challenge_to_battle', 'competitive_taunt'],
      midAffection: ['practice_partner', 'share_snack', 'race_to_class'],
      highAffection: ['quiet_moment', 'admit_loss_gracefully', 'genuine_encouragement'],
    },
    moodDecayRates: {
      happy: 0.06,
      sad: 0.08,
      excited: 0.05,
      frustrated: 0.07,
      competitive: 0.03,
    },
    deepMemoryTriggers: [
      { condition: 'beat_in_race', text: '被你超过的那一刻', emotion: 'competitive', weight: 2.0 },
      { condition: 'debug_together', text: '一起 debug 到深夜', emotion: 'warm', weight: 3.0 },
    ],
  },
  kanna: {
    baseTemperament: 'contemplative',
    emotionalInertia: 0.3,
    memoryWeight: {
      recent: 0.8,
      emotional: 3.0,
      challenge: 1.5,
      confession: 4.0,
    },
    autonomousBehaviors: {
      lowAffection: ['silent_presence', 'book_recommendation'],
      midAffection: ['save_seat', 'share_algorithm', 'star_pointing'],
      highAffection: ['write_poem_in_code', 'hold_hand_silently', 'stargazing_invitation'],
    },
    moodDecayRates: {
      happy: 0.01,
      sad: 0.015,
      absorbed: 0.005,
      lonely: 0.02,
      connected: 0.008,
    },
    deepMemoryTriggers: [
      { condition: 'library_silence', text: '图书馆里安静的午后', emotion: 'peaceful', weight: 3.5 },
      { condition: 'recursive_code', text: '你理解了递归的那一刻', emotion: 'connected', weight: 4.0 },
    ],
  },
  murasame: {
    baseTemperament: 'guarded',
    emotionalInertia: 0.2,
    memoryWeight: {
      recent: 0.5,
      emotional: 1.0,
      challenge: 3.0,
      confession: 5.0,
    },
    autonomousBehaviors: {
      lowAffection: ['complete_ignore', 'leave_cryptic_hint'],
      midAffection: ['difficult_challenge', 'backhanded_compliment', 'night_encounter'],
      highAffection: ['reveal_vulnerability', 'true_praise', 'code_as_bridge'],
    },
    moodDecayRates: {
      happy: 0.01,
      sad: 0.01,
      impressed: 0.015,
      guarded: 0.005,
      genuine: 0.008,
    },
    deepMemoryTriggers: [
      { condition: 'solved_hard', text: '通过了我出的题', emotion: 'impressed', weight: 3.0 },
      { condition: 'came_back', text: '你又来了', emotion: 'genuine', weight: 4.0 },
    ],
  },
}

export function evaluateMetaUnlocks(soul, flags, codeStoryArc) {
  const unlocked = []
  const chars = ['nene', 'yoshino', 'ayase', 'kanna', 'murasame']

  for (const [id, meta] of Object.entries(META_UNLOCKS)) {
    const c = meta.condition

    if (c.minPlaythroughs && soul.playthroughCount < c.minPlaythroughs) continue
    if (c.saveDeletionDetected && soul.deletionEvents.length === 0) continue

    if (c.minDistinctRoutes) {
      const distinctRoutes = new Set()
      for (const entry of soul.crossPlaythroughJournal) {
        if (entry.type === 'ending' && entry.character) distinctRoutes.add(entry.character)
      }
      if (distinctRoutes.size < c.minDistinctRoutes) continue
    }

    if (c.sameNamePlaythroughs) {
      const nameCounts = {}
      for (const name of soul.playerIdentity.namesUsed) {
        nameCounts[name] = (nameCounts[name] || 0) + 1
      }
      if (!Object.values(nameCounts).some(count => count >= c.sameNamePlaythroughs)) continue
    }

    if (c.allGoodEndings) {
      const goodChars = chars.filter(ch =>
        soul.characterMemories[ch]?.endingsReached?.includes('good')
      )
      if (goodChars.length < 4) continue
    }

    if (c.murasameGoodSeen) {
      if (!soul.characterMemories.murasame?.endingsReached?.includes('good')) continue
    }

    if (c.flag && !flags[c.flag]) continue
    if (c.hasCodeHistory && (!codeStoryArc || codeStoryArc.totalExecutions < 5)) continue

    unlocked.push(meta)
  }

  return unlocked
}
