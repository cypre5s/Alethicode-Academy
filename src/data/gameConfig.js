export const GAME_CONFIG = {
  VERSION: '3.0.0',
  TITLE: 'Alethicode Academy —— 编程学园恋物语',
  DEFAULT_PLAYER_NAME: '藤堂 和真',
  MAX_AFFECTION: 100,
  MAX_SAVE_SLOTS: 6,
  SAVE_PREFIX: 'alethicode_save_',
  AUTO_SAVE_KEY: 'alethicode_save_auto',
  API_KEY_STORAGE: 'alethicode_api_key',

  TEXT_SPEED: { slow: 50, medium: 30, fast: 15 },
  AUTO_PLAY_DELAY: { slow: 4000, medium: 3000, fast: 2000 },
  FONT_SIZES: { small: 14, medium: 17, large: 20 },

  AFFECTION_LEVELS: {
    STRANGER: { min: 0, max: 14, label: '初识' },
    ACQUAINTANCE: { min: 15, max: 29, label: '熟悉' },
    FRIEND: { min: 30, max: 49, label: '亲近' },
    CRUSH: { min: 50, max: 74, label: '暧昧' },
    LOVE: { min: 75, max: 100, label: '恋慕' }
  },

  MURASAME_UNLOCK: {
    minAffectionAll: 30,
    minAffectionMurasame: 50,
    requiredFlag: 'murasame_gate_passed'
  },

  TRUE_END_UNLOCK: {
    requiredEndings: [
      'ending_nene_good', 'ending_yoshino_good', 'ending_ayase_good',
      'ending_kanna_good', 'ending_murasame_good'
    ]
  },

  TIME_SLOTS: [
    { id: 'morning', label: '课间', icon: '☀️' },
    { id: 'noon', label: '午休', icon: '🌤' },
    { id: 'evening', label: '放学后', icon: '🌅' }
  ],

  CHAPTERS: [
    { id: 'prologue', title: '序章「转入 Alethicode 学园」', subtitle: '—— 初识编程 ——' },
    { id: 'chapter1', title: '第一章「Hello, World!」', subtitle: '—— 初识 Python ——' },
    { id: 'chapter2', title: '第二章「循环的旋律」', subtitle: '—— for/while 与列表 ——' },
    { id: 'chapter3', title: '第三章「函数之约」', subtitle: '—— 函数与模块化 ——' }
  ],

  ROUTES: [
    { id: 'nene', title: 'AI 的心跳', character: 'nene', endings: ['good', 'normal'] },
    { id: 'yoshino', title: '完美代码的裂痕', character: 'yoshino', endings: ['good', 'normal'] },
    { id: 'ayase', title: 'Bug 与 Butterfly', character: 'ayase', endings: ['good', 'normal'] },
    { id: 'kanna', title: '递归的星空', character: 'kanna', endings: ['good', 'normal'] },
    { id: 'murasame', title: '最后的竞赛', character: 'murasame', endings: ['good', 'normal', 'true'] }
  ],

  CG_LIST: [
    'prologue_school_gate', 'ch1_nene_teaching', 'ch1_night_shadow',
    'ch2_competition', 'ch2_kanna_fractal',
    'ch3_festival', 'ch3_firework',
    'nene_heart_module', 'nene_good_end',
    'yoshino_imperfect_code', 'yoshino_good_end',
    'ayase_final_match', 'ayase_good_end',
    'kanna_starry_program', 'kanna_good_end',
    'murasame_championship', 'murasame_good_end', 'murasame_true_end'
  ]
}
