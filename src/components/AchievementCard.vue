<template>
  <transition name="card-fade">
    <div v-if="isOpen" class="achievement-overlay" @click.self="$emit('close')">
      <div class="achievement-panel">
        <div class="ach-header">
          <h2>🏆 成就卡片</h2>
          <button class="ach-close" @click="$emit('close')">✕</button>
        </div>

        <div ref="cardRef" class="ach-card" :style="cardStyle">
          <div class="ach-card-bg" />
          <div class="ach-card-content">
            <div class="ach-logo">Alethicode Academy</div>
            <div class="ach-name">{{ playerName }}</div>
            <div class="ach-title">{{ playerTitle }}</div>

            <div class="ach-stats">
              <div class="ach-stat">
                <span class="stat-val">{{ totalChallenges }}</span>
                <span class="stat-label">挑战完成</span>
              </div>
              <div class="ach-stat">
                <span class="stat-val">{{ totalPlayTime }}</span>
                <span class="stat-label">学习时长</span>
              </div>
              <div class="ach-stat">
                <span class="stat-val">{{ conceptsMastered }}</span>
                <span class="stat-label">概念掌握</span>
              </div>
            </div>

            <div class="ach-characters">
              <div v-for="c in charStats" :key="c.id" class="ach-char" :style="{ '--c': c.color }">
                <span class="char-heart" :style="{ width: c.percent + '%' }" />
                <span class="char-name">{{ c.name }}</span>
                <span class="char-aff">{{ c.affection }}</span>
              </div>
            </div>

            <div class="ach-badges">
              <span v-for="b in badges" :key="b" class="ach-badge">{{ b }}</span>
            </div>

            <div class="ach-date">{{ dateStr }}</div>
          </div>
        </div>

        <div class="ach-actions">
          <button class="ach-btn" @click="captureCard">📷 保存为图片</button>
          <button class="ach-btn" @click="cycleTheme">🎨 切换主题</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { characters } from '../data/characters.js'
import html2canvas from 'html2canvas'

defineProps({ isOpen: Boolean })
defineEmits(['close'])

const engine = inject('engine')
const cardRef = ref(null)
const themeIdx = ref(0)

const THEMES = [
  { bg: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #0d0d2b 100%)', accent: '#c4b5fd' },
  { bg: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0a1628 100%)', accent: '#7BA7C9' },
  { bg: 'linear-gradient(135deg, #2b0a1e 0%, #3d1232 50%, #1a0714 100%)', accent: '#F4C2D0' },
  { bg: 'linear-gradient(135deg, #1a2a0a 0%, #2d3b12 50%, #0d1606 100%)', accent: '#66BB6A' },
]

const cardStyle = computed(() => ({
  background: THEMES[themeIdx.value].bg,
  '--accent': THEMES[themeIdx.value].accent,
}))

const playerName = computed(() => engine?.playerName?.value || '学员')
const playerTitle = computed(() => engine?.worldVM?.worldState?.player?.title || 'Novice Coder')
const totalChallenges = computed(() => Object.keys(engine?.challengeResults || {}).length)
const conceptsMastered = computed(() => {
  const cg = engine?.cognitiveGraph
  if (!cg?.getAllConceptStates) return 0
  const states = cg.getAllConceptStates()
  return Object.values(states).filter(s => s === 'lit' || s === 'blazing').length
})
const totalPlayTime = computed(() => {
  const ms = engine?.behaviorProfiler?.rawSignals?.sessionDurations?.reduce?.((a, b) => a + b, 0) || 0
  const hours = Math.floor(ms / 3600000)
  const mins = Math.floor((ms % 3600000) / 60000)
  return hours > 0 ? `${hours}h${mins}m` : `${mins}m`
})

const charStats = computed(() => {
  const chars = ['nene', 'yoshino', 'ayase', 'kanna', 'murasame']
  return chars.map(id => {
    const rel = engine?.relationship?.[id]
    const avg = rel ? Math.round((rel.affection + rel.trust + rel.comfort) / 3) : 0
    return {
      id,
      name: characters[id]?.nameShort || id,
      color: characters[id]?.color || '#ccc',
      affection: avg,
      percent: Math.min(avg, 100),
    }
  })
})

const badges = computed(() => {
  const b = []
  if (totalChallenges.value >= 1) b.push('🌱 初学者')
  if (totalChallenges.value >= 5) b.push('📝 勤学')
  if (totalChallenges.value >= 15) b.push('⭐ 精通')
  if (conceptsMastered.value >= 5) b.push('🧠 概念大师')
  if (conceptsMastered.value >= 15) b.push('🔥 全知')
  const maxAff = Math.max(...charStats.value.map(c => c.affection))
  if (maxAff >= 50) b.push('💕 心意相通')
  if (maxAff >= 80) b.push('💖 真爱')
  if (engine?.worldVM?.worldState?.unlockedTier >= 3) b.push('⚡ 世界掌控者')
  return b.length ? b : ['🌱 旅途开始']
})

const dateStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
})

function cycleTheme() {
  themeIdx.value = (themeIdx.value + 1) % THEMES.length
}

async function captureCard() {
  if (!cardRef.value) return
  try {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    const canvas = await html2canvas(cardRef.value, { backgroundColor: null, scale: isMobile ? 1 : 2, useCORS: true })
    const link = document.createElement('a')
    link.download = `alethicode-achievement-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.warn('[AchievementCard] capture failed:', err)
  }
}
</script>

<style scoped>
.achievement-overlay { position: fixed; inset: 0; z-index: 130; background: rgba(10,8,20,0.85); display: flex; align-items: center; justify-content: center; }
.achievement-panel { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.ach-header { display: flex; align-items: center; gap: 12px; }
.ach-header h2 { color: #e0d6f0; margin: 0; font-size: 20px; }
.ach-close { background: none; border: none; color: #a89cc8; font-size: 20px; cursor: pointer; }

.ach-card {
  width: 400px; min-height: 520px; border-radius: 20px; overflow: hidden; position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
}
.ach-card-bg { position: absolute; inset: 0; opacity: 0.1; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
.ach-card-content { position: relative; padding: 30px 28px; display: flex; flex-direction: column; gap: 16px; }
.ach-logo { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); opacity: 0.8; }
.ach-name { font-size: 28px; font-weight: 700; color: #fff; }
.ach-title { font-size: 14px; color: var(--accent); border: 1px solid var(--accent); display: inline-block; padding: 2px 12px; border-radius: 20px; align-self: flex-start; opacity: 0.8; }

.ach-stats { display: flex; gap: 20px; margin: 8px 0; }
.ach-stat { display: flex; flex-direction: column; align-items: center; }
.stat-val { font-size: 24px; font-weight: 700; color: #fff; }
.stat-label { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }

.ach-characters { display: flex; flex-direction: column; gap: 6px; }
.ach-char { display: flex; align-items: center; gap: 8px; position: relative; background: rgba(255,255,255,0.04); border-radius: 6px; padding: 4px 10px; overflow: hidden; }
.char-heart { position: absolute; left: 0; top: 0; bottom: 0; background: var(--c); opacity: 0.15; border-radius: 6px; transition: width 0.5s; }
.char-name { font-size: 12px; color: rgba(255,255,255,0.7); z-index: 1; min-width: 60px; }
.char-aff { font-size: 12px; color: var(--c); font-weight: 600; z-index: 1; margin-left: auto; }

.ach-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.ach-badge { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); padding: 3px 10px; border-radius: 12px; font-size: 11px; color: rgba(255,255,255,0.7); }
.ach-date { font-size: 11px; color: rgba(255,255,255,0.3); text-align: right; }

.ach-actions { display: flex; gap: 10px; }
.ach-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #c0b8d8; padding: 8px 18px; border-radius: 10px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
.ach-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

.card-fade-enter-active, .card-fade-leave-active { transition: opacity 0.3s; }
.card-fade-enter-from, .card-fade-leave-to { opacity: 0; }

@media (max-width: 480px) { .ach-card { width: 90vw; min-height: auto; } }
</style>
