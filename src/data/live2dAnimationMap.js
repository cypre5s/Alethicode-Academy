// ═══════════════════════════════════════════════════════════════════
//  Live2D Animation Map — Engine Event → Animation Mapping
//  "有灵魂的动画" 七原则的数据驱动层
// ═══════════════════════════════════════════════════════════════════

// ─── Gaze Targets (Principle 4: 视线是灵魂的窗口) ─────────────────
export const GAZE_TARGETS = {
  player:      { eyeBallX: 0, eyeBallY: 0 },
  mouse:       { eyeBallX: 0, eyeBallY: 0 },  // computed dynamically
  other_char:  { eyeBallX: 0.3, eyeBallY: 0 },
  code_area:   { eyeBallX: -0.3, eyeBallY: 0.2 },
  sky:         { eyeBallX: 0.1, eyeBallY: -0.3 },
  memory:      { eyeBallX: -0.2, eyeBallY: -0.15 },
  away:        { eyeBallX: 0.4, eyeBallY: 0.1 },
  wander:      { eyeBallX: 0, eyeBallY: 0 },  // computed dynamically
}

// ─── BGM Mood → Breath Modulation (Principle 6: 音乐塑造身体) ─────
export const BGM_MOOD_TO_BREATH = {
  tension:       { periodScale: 0.7, amplitudeScale: 1.3 },
  peaceful:      { periodScale: 1.2, amplitudeScale: 0.8 },
  peaceful_b:    { periodScale: 1.2, amplitudeScale: 0.8 },
  romantic:      { periodScale: 1.1, amplitudeScale: 1.0 },
  battle:        { periodScale: 0.6, amplitudeScale: 1.5 },
  sad:           { periodScale: 1.3, amplitudeScale: 1.1 },
  mystery:       { periodScale: 0.9, amplitudeScale: 0.9 },
  festival:      { periodScale: 0.8, amplitudeScale: 1.2 },
  daily:         { periodScale: 1.0, amplitudeScale: 1.0 },
  daily_b:       { periodScale: 1.0, amplitudeScale: 1.0 },
  morning_fresh: { periodScale: 1.05, amplitudeScale: 0.9 },
  evening_calm:  { periodScale: 1.15, amplitudeScale: 0.85 },
  nostalgia:     { periodScale: 1.2, amplitudeScale: 0.95 },
  gentle_rain:   { periodScale: 1.25, amplitudeScale: 0.8 },
  determination: { periodScale: 0.75, amplitudeScale: 1.25 },
  playful:       { periodScale: 0.85, amplitudeScale: 1.15 },
  study:         { periodScale: 1.1, amplitudeScale: 0.85 },
  confession:    { periodScale: 0.9, amplitudeScale: 1.1 },
  comedy:        { periodScale: 0.85, amplitudeScale: 1.1 },
  heartache:     { periodScale: 1.3, amplitudeScale: 1.15 },
  victory:       { periodScale: 0.7, amplitudeScale: 1.4 },
  night_walk:    { periodScale: 1.15, amplitudeScale: 0.9 },
  spring_breeze: { periodScale: 1.1, amplitudeScale: 0.9 },
  summer_sun:    { periodScale: 0.9, amplitudeScale: 1.05 },
  autumn_leaves: { periodScale: 1.15, amplitudeScale: 0.9 },
  winter_cold:   { periodScale: 1.2, amplitudeScale: 0.85 },
  club_activity: { periodScale: 0.85, amplitudeScale: 1.1 },
  warmth:        { periodScale: 1.1, amplitudeScale: 0.95 },
  anxiety:       { periodScale: 0.7, amplitudeScale: 1.35 },
  hope:          { periodScale: 1.0, amplitudeScale: 1.05 },
  together:      { periodScale: 1.05, amplitudeScale: 1.0 },
  starry_night:  { periodScale: 1.15, amplitudeScale: 0.9 },
}

// ─── Emotion → Live2D (4.3 AffectiveResonance) ───────────────────
export const EMOTION_TO_LIVE2D = {
  mirror_happiness: {
    expression: 'smile', motion: 'happy_idle',
    breathMod: { periodScale: 0.9, amplitudeScale: 1.1 },
    gazeBias: 'player', physicsWind: 0.3,
  },
  comfort_mode: {
    expression: 'gentle_smile', motion: 'lean_forward',
    breathMod: { periodScale: 1.1, amplitudeScale: 0.9 },
    gazeBias: 'player', physicsWind: 0.1,
  },
  careful_approach: {
    expression: 'normal', motion: 'step_back',
    breathMod: { periodScale: 0.85, amplitudeScale: 1.0 },
    gazeBias: 'wander', physicsWind: 0.0,
  },
  attention_call: {
    expression: 'pout', motion: 'wave_hand',
    breathMod: { periodScale: 0.8, amplitudeScale: 1.2 },
    gazeBias: 'player', physicsWind: 0.4,
  },
  engaged: {
    expression: 'focused', motion: null,
    breathMod: { periodScale: 0.85, amplitudeScale: 0.9 },
    gazeBias: 'player', physicsWind: 0.2,
  },
  distracted: {
    expression: 'thinking', motion: 'wave_hand',
    breathMod: { periodScale: 0.9, amplitudeScale: 1.0 },
    gazeBias: 'player', physicsWind: 0.3,
  },
  // Mood mappings (from WorldVM)
  embarrassed: {
    expression: 'blush', motion: null,
    breathMod: { periodScale: 0.85, amplitudeScale: 1.1 },
    gazeBias: 'away',
  },
  happy: {
    expression: 'smile', motion: 'happy_idle',
    breathMod: { periodScale: 0.9, amplitudeScale: 1.05 },
    gazeBias: 'player',
  },
  sad: {
    expression: 'sad', motion: null,
    breathMod: { periodScale: 1.3, amplitudeScale: 1.1 },
    gazeBias: 'memory',
  },
  angry: {
    expression: 'angry', motion: null,
    breathMod: { periodScale: 0.7, amplitudeScale: 1.3 },
    gazeBias: 'player',
  },
  surprised: {
    expression: 'surprised', motion: 'react_surprise',
    breathMod: { periodScale: 0.6, amplitudeScale: 1.4 },
    gazeBias: 'player',
  },
  thinking: {
    expression: 'thinking', motion: null,
    breathMod: { periodScale: 1.0, amplitudeScale: 0.85 },
    gazeBias: 'sky',
  },
  proud: {
    expression: 'proud', motion: null,
    breathMod: { periodScale: 1.0, amplitudeScale: 1.0 },
    gazeBias: 'player',
  },
  vulnerable: {
    expression: 'vulnerable', motion: null,
    breathMod: { periodScale: 1.2, amplitudeScale: 1.1 },
    gazeBias: 'away',
  },
}

// ─── Teaching States (4.6 PedagogyKernel) ─────────────────────────
export const TEACHING_STATES = {
  explaining: {
    motion: 'teaching_explain',
    gazePattern: ['player', 'code_area', 'player'],
    gazeInterval: 2000,
    breathMod: { periodScale: 0.9 },
    handGesture: true,
  },
  waiting_for_think: {
    motion: 'teaching_patient',
    gazePattern: ['player'],
    expression: 'warm',
    breathMod: { periodScale: 1.1 },
    idleVariant: 'slight_nod',
  },
  player_struggling: {
    motion: 'teaching_encourage',
    gazePattern: ['player'],
    expression: 'gentle_smile',
    breathMod: { periodScale: 1.0 },
    positionOffset: 20,
  },
  eureka_moment: {
    motion: 'react_celebration',
    expression: 'proud',
    gazePattern: ['player'],
    breathMod: { periodScale: 0.8, amplitudeScale: 1.3 },
  },
  review_prompt: {
    motion: 'teaching_recall',
    expression: 'thinking',
    gazePattern: ['memory', 'player'],
  },
}

// ─── Symbiosis Tiers (4.5 SymbioticCodeDNA) ──────────────────────
export const SYMBIOSIS_ANIMATION_TIERS = {
  tier0: {
    idleMotion: 'idle_formal',
    positionOffset: 0,
    gazeAtPlayer: 0.2,
    microActionPool: [],
    breathSync: 0,
    speakingAmplitude: 0.6,
  },
  tier1: {
    idleMotion: 'idle_relaxed',
    positionOffset: 15,
    gazeAtPlayer: 0.4,
    microActionPool: ['hair_touch', 'look_window'],
    breathSync: 0.1,
    speakingAmplitude: 0.75,
  },
  tier2: {
    idleMotion: 'idle_comfortable',
    positionOffset: 35,
    gazeAtPlayer: 0.6,
    microActionPool: ['hair_touch', 'chin_rest', 'lean_forward', 'peek_at_player'],
    breathSync: 0.3,
    speakingAmplitude: 0.9,
  },
  tier3: {
    idleMotion: 'idle_intimate',
    positionOffset: 55,
    gazeAtPlayer: 0.8,
    microActionPool: ['hair_touch', 'lean_close', 'peek_shy', 'mimic_player_habit',
                      'content_sigh', 'reach_toward_screen'],
    breathSync: 0.6,
    speakingAmplitude: 1.0,
    exclusiveMotion: true,
  },
}

// ─── Cognitive Transition Reactions (4.2) ──────────────────────────
const COGNITIVE_TRANSITIONS = {
  flickering: {
    expression: 'normal',
    duration: 500,
    gaze: 'player',
    browLift: 0.15,
  },
  lit: {
    expression: 'smile',
    motion: 'teaching_success',
    duration: 1500,
    gaze: 'player',
    sfx: 'correct',
  },
  blazing: {
    duration: 3000,
    sfx: 'level_up',
    perCharacter: {
      nene: [
        { expression: 'gentle_smile', motion: 'react_celebration', duration: 1000 },
        { expression: 'teary', gaze: 'player', duration: 1000 },
        { expression: 'warm', duration: 1000 },
      ],
      ayase: [
        { expression: 'competitive', duration: 500 },
        { expression: 'grin', motion: 'react_celebration', duration: 1500 },
        { expression: 'soft_smile', gaze: 'player', duration: 1000 },
      ],
      kanna: [
        { expression: 'surprised', duration: 600 },
        { expression: 'absorbed', motion: 'react_celebration', duration: 1200 },
        { expression: 'warm_smile', gaze: 'player', duration: 1200 },
      ],
      murasame: [
        { expression: 'impressed', duration: 800 },
        { expression: 'genuine_smile', gaze: 'player', duration: 2200 },
      ],
      yoshino: [
        { expression: 'glasses_adjust', duration: 600 },
        { expression: 'slight_smile', gaze: 'player', duration: 1200 },
        { expression: 'rare_gentle', duration: 1200 },
      ],
    },
  },
}

// ─── Autonomy Animation Map (4.4) ─────────────────────────────────
const AUTONOMY_MAP = {
  proactive_contact: {
    sequence: [
      { motion: 'autonomy_hesitate', duration: 1500 },
      { expression: 'normal', gaze: 'player', duration: 500 },
    ],
  },
  absence: {
    sequence: [
      { expression: 'sad', gaze: 'memory', duration: 1000 },
      { expression: 'thinking', gaze: 'wander', duration: 1500 },
    ],
  },
  return: {
    sequence: [
      { expression: 'normal', gaze: 'wander', duration: 1000 },
      { expression: 'smile', gaze: 'player', duration: 1500 },
    ],
  },
  departure: {
    sequence: [
      { gaze: 'player', duration: 1000 },
      { expression: 'sad', duration: 1000 },
      { motion: 'autonomy_farewell', gaze: 'away', duration: 3000 },
    ],
  },
}

// ─── Master Animation Map ─────────────────────────────────────────
export const LIVE2D_ANIMATION_MAP = {
  cognitive_transitions: COGNITIVE_TRANSITIONS,
  autonomy: AUTONOMY_MAP,
}
