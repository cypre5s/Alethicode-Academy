// ═══════════════════════════════════════════════════════════════════
//  Emergent Animation Rules
//  当多个引擎信号罕见地同时激活时，创造不可预见的独特动画
//  这些涌现动画是游戏中"活着"感的终极体现
// ═══════════════════════════════════════════════════════════════════

export const EMERGENT_RULES = [
  // ─── 心灵共鸣 ───────────────────────────────────────────────
  // 深度共生 + 顿悟 + 玩家开心 → 角色与玩家的心灵共鸣时刻
  {
    id: 'shared_eureka',
    condition: (s) =>
      s.cognitive === 'blazing' &&
      s.symbiosis >= 0.7 &&
      s.affective === 'mirror_happiness',
    animation: 'shared_eureka',
    description: '深度共生 + 顿悟 + 玩家开心 → 心灵共鸣',
    sequence: [
      { expression: 'surprised', duration: 400 },
      { expression: 'blush', motion: 'react_celebration', duration: 1200 },
      { expression: 'gentle_smile', gaze: 'player', duration: 2000 },
    ],
  },

  // ─── 忧心触达 ───────────────────────────────────────────────
  // 角色主动找你 + 检测到你难过 + 有共同记忆
  {
    id: 'concerned_reach',
    condition: (s) =>
      s.autonomy === 'proactive_contact' &&
      s.affective === 'comfort_mode' &&
      s.memory_recent,
    animation: 'concerned_reach',
    description: '角色主动找你 + 你难过 + 共同记忆 → 引用记忆安慰',
    sequence: [
      { expression: 'thinking', gaze: 'memory', duration: 800 },
      { expression: 'gentle_smile', gaze: 'player', motion: 'lean_forward', duration: 1500 },
      { expression: 'warm', duration: 1500 },
    ],
  },

  // ─── 教学心流 ───────────────────────────────────────────────
  // 教学中 + 顿悟 + 高好奇心玩家
  {
    id: 'teaching_flow',
    condition: (s) =>
      s.teaching === 'explaining' &&
      s.cognitive === 'blazing' &&
      s.behavior_curiosity > 0.8,
    animation: 'teaching_flow',
    description: '教学 + 顿悟 + 好奇心旺盛 → 教学心流超兴奋',
    sequence: [
      { expression: 'surprised', duration: 300 },
      { expression: 'proud', motion: 'react_celebration', duration: 1000 },
      { expression: 'smile', gaze: 'player', duration: 1500 },
      { expression: 'focused', gaze: 'code_area', duration: 1000 },
    ],
  },

  // ─── 沉默的守护 ───────────────────────────────────────────────
  // 高共生度 + 玩家挣扎 + 教学安慰模式
  {
    id: 'silent_guardian',
    condition: (s) =>
      s.symbiosis >= 0.6 &&
      s.teaching === 'player_struggling' &&
      s.affective === 'comfort_mode',
    animation: 'silent_guardian',
    description: '高共生 + 玩家挣扎 + 安慰 → 无声守护',
    sequence: [
      { expression: 'gentle_smile', gaze: 'player', duration: 2000 },
      { expression: 'warm', motion: 'lean_forward', duration: 2000 },
    ],
  },

  // ─── 代码共鸣 ───────────────────────────────────────────────
  // 认知跃迁 + 高共生 + 专注(非散漫)
  {
    id: 'code_resonance',
    condition: (s) =>
      (s.cognitive === 'lit' || s.cognitive === 'blazing') &&
      s.symbiosis >= 0.5 &&
      s.affective === 'engaged',
    animation: 'code_resonance',
    description: '认知跃迁 + 高共生 + 专注 → 代码共鸣',
    sequence: [
      { expression: 'focused', gaze: 'code_area', duration: 800 },
      { expression: 'smile', gaze: 'player', duration: 1200 },
      { expression: 'warm', duration: 1000 },
    ],
  },

  // ─── 暗涌回忆 ───────────────────────────────────────────────
  // 记忆触发 + 高共生度 + 悲伤情绪
  {
    id: 'memory_undercurrent',
    condition: (s) =>
      s.memory_recent &&
      s.symbiosis >= 0.5 &&
      s.affective === 'careful_approach',
    animation: 'memory_undercurrent',
    description: '记忆触发 + 高共生 + 小心翼翼 → 暗涌回忆',
    sequence: [
      { expression: 'thinking', gaze: 'memory', duration: 1000 },
      { expression: 'vulnerable', duration: 800 },
      { expression: 'gentle_smile', gaze: 'player', duration: 1500 },
    ],
  },

  // ─── 离别前的温柔 ─────────────────────────────────────────────
  // 角色即将离去 + 高共生 + 有记忆
  {
    id: 'farewell_tenderness',
    condition: (s) =>
      s.autonomy === 'departure' &&
      s.symbiosis >= 0.6 &&
      s.memory_recent,
    animation: 'farewell_tenderness',
    description: '离去 + 高共生 + 记忆 → 离别的特殊温柔',
    sequence: [
      { expression: 'sad', gaze: 'player', duration: 1500 },
      { expression: 'gentle_smile', duration: 1000 },
      { expression: 'blush', gaze: 'away', duration: 800 },
      { expression: 'warm', gaze: 'player', duration: 1500 },
    ],
  },

  // ─── 竞争中的尊重 ─────────────────────────────────────────────
  // 顿悟 + 注意力呼唤(竞争角色) + 教学中
  {
    id: 'competitive_respect',
    condition: (s) =>
      s.cognitive === 'blazing' &&
      s.affective === 'attention_call' &&
      s.teaching,
    animation: 'competitive_respect',
    description: '顿悟 + 竞争呼唤 + 教学中 → 对手的敬意',
    sequence: [
      { expression: 'surprised', duration: 400 },
      { expression: 'impressed', duration: 800 },
      { expression: 'competitive', gaze: 'player', duration: 1500 },
    ],
  },
]
