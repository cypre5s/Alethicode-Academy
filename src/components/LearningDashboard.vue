<template>
  <transition name="dash-fade">
    <div v-if="isOpen" class="dashboard-overlay" @click.self="$emit('close')">
      <div class="dashboard-panel">
        <div class="dash-header">
          <h2 class="dash-title">📊 学习报告</h2>
          <button class="dash-close" @click="$emit('close')">✕</button>
        </div>

        <div class="dash-grid">
          <div class="dash-card stat-card">
            <div class="stat-value">{{ totalPlayTime }}</div>
            <div class="stat-label">学习时长</div>
          </div>
          <div class="dash-card stat-card">
            <div class="stat-value">{{ totalChallenges }}</div>
            <div class="stat-label">完成挑战</div>
          </div>
          <div class="dash-card stat-card">
            <div class="stat-value">{{ successRate }}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="dash-card stat-card">
            <div class="stat-value">{{ codeLines }}</div>
            <div class="stat-label">写过的代码行</div>
          </div>

          <div class="dash-card wide">
            <h3 class="card-title">🧠 概念掌握度</h3>
            <div class="concept-bars">
              <div v-for="concept in conceptMastery" :key="concept.id" class="concept-row">
                <span class="concept-name">{{ concept.name }}</span>
                <div class="concept-bar-bg">
                  <div class="concept-bar-fill" :style="{ width: concept.mastery + '%', background: concept.color }"></div>
                </div>
                <span class="concept-pct">{{ concept.mastery }}%</span>
              </div>
            </div>
          </div>

          <div class="dash-card wide">
            <h3 class="card-title">📈 代码质量趋势</h3>
            <div class="trend-chart">
              <svg :viewBox="`0 0 ${trendData.length * 40} 100`" class="trend-svg" preserveAspectRatio="none">
                <polyline :points="trendPoints" class="trend-line" fill="none" stroke="var(--vn-primary)" stroke-width="2" />
                <circle v-for="(p, i) in trendDots" :key="i" :cx="p.x" :cy="p.y" r="3" fill="var(--vn-primary)" />
              </svg>
              <div class="trend-labels">
                <span v-for="(d, i) in trendData" :key="i" class="trend-label">{{ d.label }}</span>
              </div>
            </div>
          </div>

          <div class="dash-card">
            <h3 class="card-title">💻 代码风格</h3>
            <div class="style-tag" v-for="tag in styleTags" :key="tag">{{ tag }}</div>
          </div>

          <div class="dash-card">
            <h3 class="card-title">❤️ 角色好感度</h3>
            <div v-for="char in charAffection" :key="char.id" class="affection-row">
              <span class="aff-name" :style="{ color: char.color }">{{ char.name }}</span>
              <div class="aff-bar-bg">
                <div class="aff-bar-fill" :style="{ width: char.value + '%', background: char.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="dash-footer">
          <button class="dash-btn" @click="captureReport">📸 截图保存</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, inject } from 'vue'
import { characters } from '../data/characters.js'
import html2canvas from 'html2canvas'

defineProps({ isOpen: Boolean })
defineEmits(['close'])

const engine = inject('engine')

const totalChallenges = computed(() => Object.keys(engine.challengeResults).length)

const successRate = computed(() => {
  const results = Object.values(engine.challengeResults)
  if (results.length === 0) return 0
  return Math.round(results.filter(r => r.passed).length / results.length * 100)
})

const totalPlayTime = computed(() => {
  const ms = engine.behaviorProfiler?.getProfileSnapshot?.()?.totalSessionTime || 0
  const mins = Math.round(ms / 60000)
  return mins < 60 ? `${mins}分钟` : `${Math.floor(mins / 60)}时${mins % 60}分`
})

const codeLines = computed(() => {
  return engine.temporalCodeDB?.getMilestonesList?.()?.length || 0
})

const conceptMastery = computed(() => {
  const graph = engine.cognitiveGraph
  if (!graph?.getState) return []
  const state = graph.getState()
  if (!state?.nodes) return []

  const conceptNames = {
    variables: '变量', strings: '字符串', loops: '循环', conditionals: '条件判断',
    functions: '函数', lists: '列表', basics: '基础', debugging: '调试',
  }
  const colors = ['#F4C2D0', '#c4b5fd', '#FF8C42', '#7BA7C9', '#DC3545', '#4ade80', '#fbbf24', '#60a5fa']

  return Object.entries(state.nodes || {}).slice(0, 8).map(([id, node], i) => ({
    id,
    name: conceptNames[id] || id,
    mastery: Math.min(100, Math.round((node.strength || 0) * 100)),
    color: colors[i % colors.length],
  }))
})

const trendData = computed(() => {
  const arc = engine.narrativeCodeBridge?.codeStoryArc
  if (!arc?.storyMoments) return []
  return arc.storyMoments.slice(-10).map((m, i) => ({
    value: m.quality || 50,
    label: `#${i + 1}`,
  }))
})

const trendPoints = computed(() => {
  if (trendData.value.length === 0) return ''
  const w = trendData.value.length * 40
  return trendData.value.map((d, i) => `${i * 40 + 20},${100 - d.value}`).join(' ')
})

const trendDots = computed(() => {
  return trendData.value.map((d, i) => ({ x: i * 40 + 20, y: 100 - d.value }))
})

const styleTags = computed(() => {
  const personality = engine.narrativeCodeBridge?.getCodePersonality?.()
  const tags = []
  if (personality) {
    const styleMap = { creative: '🎨 创意型', meticulous: '🔍 严谨型', expressive: '💝 表达型', reliable: '🛡️ 稳定型', beginner: '🌱 成长中' }
    tags.push(styleMap[personality.style] || personality.style)
    if (personality.successRate > 80) tags.push('✅ 高正确率')
    if (personality.creativity > 60) tags.push('🌟 高创造力')
  }
  const dna = engine.symbioticCodeDNA?.getState?.()
  if (dna?.playerDNA?.dominantStyle) tags.push(`📝 ${dna.playerDNA.dominantStyle}`)
  return tags.length > 0 ? tags : ['🌱 数据收集中...']
})

const charAffection = computed(() => {
  return ['nene', 'yoshino', 'ayase', 'kanna', 'murasame'].map(id => {
    const r = engine.relationship[id]
    const avg = r ? Math.round((r.affection + r.trust + r.comfort) / 3) : 0
    return { id, name: characters[id]?.nameShort || id, value: avg, color: characters[id]?.color || '#999' }
  })
})

async function captureReport() {
  try {
    const el = document.querySelector('.dashboard-panel')
    if (!el) return
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    const canvas = await html2canvas(el, { backgroundColor: '#1a1228', scale: isMobile ? 1 : 2 })
    const link = document.createElement('a')
    link.download = `alethicode-report-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch {
    const data = JSON.stringify({
      challenges: totalChallenges.value,
      successRate: successRate.value,
      playTime: totalPlayTime.value,
      concepts: conceptMastery.value,
    }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = `alethicode-report-${Date.now()}.json`
    link.href = URL.createObjectURL(blob)
    link.click()
  }
}
</script>

<style scoped>
.dashboard-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  background: rgba(10, 8, 20, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  contain: layout style paint;
}

.dashboard-panel {
  width: min(92vw, 800px);
  max-height: 88vh;
  overflow-y: auto;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 252, 248, 0.95), rgba(255, 245, 236, 0.92));
  border: 1px solid rgba(216, 177, 110, 0.3);
  box-shadow: 0 24px 60px rgba(30, 18, 8, 0.3);
}

.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dash-title { font-family: var(--vn-font-title); font-size: 24px; color: var(--vn-text); }
.dash-close { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--vn-text-dim); padding: 8px; }

.dash-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.dash-card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(216, 177, 110, 0.2);
}

.dash-card.wide { grid-column: span 4; }
.dash-card.stat-card { text-align: center; }
.stat-value { font-size: 28px; font-weight: 700; color: var(--vn-primary-dark); font-family: var(--vn-font-title); }
.stat-label { font-size: 12px; color: var(--vn-text-dim); margin-top: 4px; }
.card-title { font-size: 15px; color: var(--vn-text); margin-bottom: 12px; }

.concept-bars { display: flex; flex-direction: column; gap: 8px; }
.concept-row { display: flex; align-items: center; gap: 8px; }
.concept-name { width: 64px; font-size: 12px; color: var(--vn-text-dim); text-align: right; }
.concept-bar-bg { flex: 1; height: 8px; background: rgba(0,0,0,0.06); border-radius: 4px; overflow: hidden; }
.concept-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
.concept-pct { width: 36px; font-size: 11px; color: var(--vn-text-dim); }

.trend-chart { position: relative; }
.trend-svg { width: 100%; height: 80px; }
.trend-line { stroke-linecap: round; stroke-linejoin: round; }
.trend-labels { display: flex; justify-content: space-around; font-size: 10px; color: var(--vn-text-dim); }

.style-tag {
  display: inline-block;
  padding: 4px 12px;
  margin: 4px;
  border-radius: 999px;
  background: rgba(232, 160, 191, 0.15);
  color: var(--vn-primary-dark);
  font-size: 13px;
}

.affection-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.aff-name { width: 64px; font-size: 12px; text-align: right; font-weight: 600; }
.aff-bar-bg { flex: 1; height: 6px; background: rgba(0,0,0,0.06); border-radius: 3px; overflow: hidden; }
.aff-bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }

.dash-footer { margin-top: 20px; text-align: center; }
.dash-btn {
  padding: 10px 24px;
  border-radius: 999px;
  border: 1px solid rgba(216, 177, 110, 0.4);
  background: linear-gradient(135deg, rgba(224, 145, 171, 0.9), rgba(201, 156, 76, 0.92));
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.dash-fade-enter-active { transition: opacity 0.3s; }
.dash-fade-leave-active { transition: opacity 0.2s; }
.dash-fade-enter-from, .dash-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .dash-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-card.wide { grid-column: span 2; }
  .dashboard-panel { padding: 20px; }
}
</style>
