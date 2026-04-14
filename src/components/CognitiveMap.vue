<template>
  <transition name="cogmap-fade">
    <div v-if="isOpen" class="cognitive-map-overlay" @click.self="$emit('close')">
      <div class="cognitive-map-panel">
        <div class="cogmap-header">
          <div class="cogmap-title">
            <span class="cogmap-icon">🧠</span>
            <span>认知图谱</span>
            <span class="progress-badge">掌握度 {{ overallProgress.mastery }}%</span>
          </div>
          <div class="cogmap-stats">
            <span class="stat" title="完全掌握"><span class="dot blazing"></span>{{ overallProgress.blazing }}</span>
            <span class="stat" title="已点亮"><span class="dot lit"></span>{{ overallProgress.lit }}</span>
            <span class="stat" title="闪烁中"><span class="dot flickering"></span>{{ overallProgress.flickering }}</span>
            <span class="stat" title="未激活"><span class="dot dark"></span>{{ overallProgress.dark }}</span>
          </div>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>

        <div class="cogmap-body">
          <div class="canvas-container" ref="canvasContainer">
            <canvas ref="canvas" @mousemove="onMouseMove" @click="onCanvasClick" />
          </div>

          <div v-if="selectedNode" class="node-detail">
            <div class="detail-header" :style="{ borderColor: selectedNode.color }">
              <span class="detail-state-dot" :class="selectedNode.state"></span>
              <span class="detail-name">{{ selectedNode.label }}</span>
              <span class="detail-domain">{{ selectedNode.domain }}</span>
            </div>
            <div class="detail-metrics">
              <div class="metric">
                <span class="metric-label">接触次数</span>
                <span class="metric-value">{{ selectedNode.metrics.exposure }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">独立通过率</span>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: (selectedNode.metrics.soloPassRate * 100) + '%' }" />
                </div>
                <span class="metric-pct">{{ Math.round(selectedNode.metrics.soloPassRate * 100) }}%</span>
              </div>
              <div class="metric">
                <span class="metric-label">迁移得分</span>
                <div class="metric-bar transfer">
                  <div class="metric-fill" :style="{ width: (selectedNode.metrics.transferScore * 100) + '%' }" />
                </div>
                <span class="metric-pct">{{ Math.round(selectedNode.metrics.transferScore * 100) }}%</span>
              </div>
            </div>
            <div v-if="selectedNode.hasSpark" class="detail-spark">
              ✨ 曾经发生过顿悟时刻
            </div>
          </div>
        </div>

        <div class="cogmap-domains">
          <div v-for="(mastery, domain) in domainMastery" :key="domain" class="domain-chip"
               :style="{ '--domain-color': mastery.color }">
            <span class="domain-name">{{ domain }}</span>
            <span class="domain-pct">{{ Math.round(mastery.mastery * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  cognitiveGraph: { type: Object, required: true },
})

const emit = defineEmits(['close'])

const canvas = ref(null)
const canvasContainer = ref(null)
const selectedNode = ref(null)
const hoveredNode = ref(null)

let animFrame = null
let vizData = { nodes: [], edges: [] }
let nodePositions = {}
let time = 0

const overallProgress = computed(() => props.cognitiveGraph?.getOverallProgress?.() || { total: 0, dark: 0, flickering: 0, lit: 0, blazing: 0, mastery: 0 })
const domainMastery = computed(() => props.cognitiveGraph?.getDomainMastery?.() || {})

const TIER_Y_OFFSETS = { 0: 0.15, 1: 0.38, 2: 0.62, 3: 0.85 }
const DOMAIN_X_SPREAD = {
  basics: 0.15, control: 0.3, loops: 0.45, strings: 0.2,
  data_structures: 0.55, functions: 0.65, advanced: 0.8,
  oop: 0.9, algorithms: 0.75, meta: 0.5,
}

function layoutNodes(nodes, width, height) {
  const positions = {}
  const tierCounts = {}

  for (const node of nodes) {
    const tier = node.tier ?? 0
    tierCounts[tier] = (tierCounts[tier] || 0) + 1
  }

  const tierIndices = {}
  for (const node of nodes) {
    const tier = node.tier ?? 0
    tierIndices[tier] = (tierIndices[tier] || 0)
    const count = tierCounts[tier]
    const idx = tierIndices[tier]

    const yBase = TIER_Y_OFFSETS[tier] ?? 0.5
    const xBase = DOMAIN_X_SPREAD[node.domain] ?? 0.5

    const spacing = 1 / (count + 1)
    const xOffset = (idx - count / 2) * spacing * 0.3

    positions[node.id] = {
      x: (xBase + xOffset) * width * 0.85 + width * 0.075,
      y: yBase * height * 0.85 + height * 0.075,
      vx: 0, vy: 0,
      radius: node.state === 'blazing' ? 18 : node.state === 'lit' ? 14 : node.state === 'flickering' ? 12 : 8,
    }

    tierIndices[tier]++
  }

  for (let iter = 0; iter < 60; iter++) {
    const ids = Object.keys(positions)
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = positions[ids[i]]
        const b = positions[ids[j]]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.max(1, Math.hypot(dx, dy))
        const minDist = a.radius + b.radius + 28
        if (dist < minDist) {
          const force = (minDist - dist) * 0.15
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          a.x -= fx; a.y -= fy
          b.x += fx; b.y += fy
        }
      }
    }

    for (const edge of vizData.edges) {
      const a = positions[edge.source]
      const b = positions[edge.target]
      if (!a || !b) continue
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      const idealDist = 80
      if (dist > idealDist) {
        const force = (dist - idealDist) * 0.01
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        a.x += fx; a.y += fy
        b.x -= fx; b.y -= fy
      }
    }

    const margin = 30
    for (const pos of Object.values(positions)) {
      pos.x = Math.max(margin, Math.min(width - margin, pos.x))
      pos.y = Math.max(margin, Math.min(height - margin, pos.y))
    }
  }

  return positions
}

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  const w = canvas.value.width
  const h = canvas.value.height
  time += 0.016

  ctx.clearRect(0, 0, w, h)

  ctx.fillStyle = 'rgba(8, 10, 18, 0.98)'
  ctx.fillRect(0, 0, w, h)

  drawGrid(ctx, w, h)

  for (const edge of vizData.edges) {
    const from = nodePositions[edge.source]
    const to = nodePositions[edge.target]
    if (!from || !to) continue

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)

    if (edge.active) {
      const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y)
      gradient.addColorStop(0, `rgba(100, 200, 255, ${0.4 + Math.sin(time * 2) * 0.15})`)
      gradient.addColorStop(1, `rgba(100, 200, 255, ${0.4 + Math.sin(time * 2 + 1) * 0.15})`)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
    } else {
      ctx.strokeStyle = `rgba(60, 80, 100, ${edge.strength * 0.4})`
      ctx.lineWidth = 0.8
    }
    ctx.stroke()

    if (edge.active) {
      for (let p = 0; p < 3; p++) {
        const t = ((time * 0.3) + p * 0.33) % 1
        const px = from.x + (to.x - from.x) * t
        const py = from.y + (to.y - from.y) * t
        const size = 2.5 - p * 0.5
        const alpha = 0.8 - p * 0.2
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 220, 255, ${alpha})`
        ctx.fill()
      }
    }
  }

  for (const node of vizData.nodes) {
    const pos = nodePositions[node.id]
    if (!pos) continue

    const isHovered = hoveredNode.value === node.id
    const isSelected = selectedNode.value?.id === node.id
    const r = pos.radius + (isHovered ? 4 : 0) + (isSelected ? 3 : 0)

    if (node.state === 'blazing') {
      const outerGlow = ctx.createRadialGradient(pos.x, pos.y, r, pos.x, pos.y, r * 3)
      outerGlow.addColorStop(0, `${node.color}40`)
      outerGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, r * 3, 0, Math.PI * 2)
      ctx.fill()
    }

    if (node.state === 'flickering') {
      const flicker = 0.3 + Math.sin(time * 3 + node.id.length) * 0.25
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, r + 4, 0, Math.PI * 2)
      ctx.fillStyle = `${node.color}${Math.round(flicker * 30).toString(16).padStart(2, '0')}`
      ctx.fill()
    }

    ctx.beginPath()
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)

    let alpha
    switch (node.state) {
      case 'blazing': alpha = 1.0; break
      case 'lit': alpha = 0.75; break
      case 'flickering': alpha = 0.3 + Math.sin(time * 3 + node.id.length * 0.7) * 0.2; break
      default: alpha = 0.12; break
    }

    const grad = ctx.createRadialGradient(pos.x - r * 0.3, pos.y - r * 0.3, 0, pos.x, pos.y, r)
    grad.addColorStop(0, adjustAlpha(node.color, Math.min(1, alpha + 0.2)))
    grad.addColorStop(1, adjustAlpha(node.color, alpha))
    ctx.fillStyle = grad
    ctx.fill()

    if (node.state !== 'dark') {
      ctx.strokeStyle = adjustAlpha(node.color, alpha * 0.8)
      ctx.lineWidth = isSelected ? 2.5 : 1.2
      ctx.stroke()
    }

    if (node.state !== 'dark' || isHovered) {
      ctx.font = `${isHovered ? 12 : 10}px "Noto Sans SC", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = adjustAlpha('#e0e8f0', node.state === 'dark' ? 0.35 : 0.9)
      ctx.fillText(node.label, pos.x, pos.y + r + 14)
    }

    if (node.hasSpark && node.state === 'blazing') {
      const sparkAlpha = 0.5 + Math.sin(time * 4) * 0.3
      ctx.font = '12px sans-serif'
      ctx.fillStyle = `rgba(255, 230, 100, ${sparkAlpha})`
      ctx.fillText('✦', pos.x + r + 4, pos.y - r)

      for (let p = 0; p < 4; p++) {
        const angle = time * 1.5 + p * Math.PI / 2
        const dist = r + 6 + Math.sin(time * 3 + p) * 4
        const px = pos.x + Math.cos(angle) * dist
        const py = pos.y + Math.sin(angle) * dist
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 230, 100, ${0.4 + Math.sin(time * 5 + p) * 0.3})`
        ctx.fill()
      }
    }
  }

  animFrame = requestAnimationFrame(draw)
}

function drawGrid(ctx, w, h) {
  ctx.strokeStyle = 'rgba(40, 60, 80, 0.15)'
  ctx.lineWidth = 0.5
  const step = 40
  for (let x = 0; x < w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
  }
}

function adjustAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function onMouseMove(e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  let found = null
  for (const node of vizData.nodes) {
    const pos = nodePositions[node.id]
    if (!pos) continue
    const dist = Math.hypot(x - pos.x, y - pos.y)
    if (dist < pos.radius + 8) {
      found = node.id
      break
    }
  }
  hoveredNode.value = found
  canvas.value.style.cursor = found ? 'pointer' : 'default'
}

function onCanvasClick(e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  for (const node of vizData.nodes) {
    const pos = nodePositions[node.id]
    if (!pos) continue
    if (Math.hypot(x - pos.x, y - pos.y) < pos.radius + 8) {
      selectedNode.value = node
      return
    }
  }
  selectedNode.value = null
}

function refreshData() {
  vizData = props.cognitiveGraph?.getGraphVisualizationData?.() || { nodes: [], edges: [] }
  if (canvas.value) {
    nodePositions = layoutNodes(vizData.nodes, canvas.value.width, canvas.value.height)
  }
}

function resize() {
  if (!canvas.value || !canvasContainer.value) return
  const rect = canvasContainer.value.getBoundingClientRect()
  canvas.value.width = rect.width * window.devicePixelRatio
  canvas.value.height = rect.height * window.devicePixelRatio
  canvas.value.style.width = rect.width + 'px'
  canvas.value.style.height = rect.height + 'px'
  const ctx = canvas.value.getContext('2d')
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  canvas.value.width = rect.width
  canvas.value.height = rect.height
  refreshData()
}

watch(() => props.isOpen, (open) => {
  if (open) {
    nextTick(() => {
      resize()
      refreshData()
      animFrame = requestAnimationFrame(draw)
    })
  } else {
    if (animFrame) cancelAnimationFrame(animFrame)
    selectedNode.value = null
  }
})

onMounted(() => {
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.cognitive-map-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; backdrop-filter: blur(4px);
}
.cognitive-map-panel {
  width: 90vw; max-width: 900px; height: 80vh; max-height: 700px;
  background: rgba(12, 14, 22, 0.98);
  border: 1px solid rgba(100, 200, 255, 0.2);
  border-radius: 16px;
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(100, 200, 255, 0.1);
}
.cogmap-header {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 20px;
  background: rgba(100, 200, 255, 0.05);
  border-bottom: 1px solid rgba(100, 200, 255, 0.1);
}
.cogmap-title {
  display: flex; align-items: center; gap: 8px;
  color: #b8e6ff; font-size: 15px; font-weight: 600;
}
.cogmap-icon { font-size: 20px; }
.progress-badge {
  font-size: 11px; padding: 2px 8px; border-radius: 10px;
  background: rgba(100, 200, 255, 0.12); color: #8ad4ff;
}
.cogmap-stats {
  display: flex; gap: 12px; margin-left: auto;
}
.stat {
  display: flex; align-items: center; gap: 4px;
  color: #7a8a96; font-size: 12px;
}
.dot {
  width: 8px; height: 8px; border-radius: 50%;
}
.dot.blazing { background: #ffd54f; box-shadow: 0 0 8px rgba(255, 213, 79, 0.6); }
.dot.lit { background: #64c8ff; box-shadow: 0 0 6px rgba(100, 200, 255, 0.4); }
.dot.flickering { background: #ffb74d; animation: stat-flicker 1.5s ease-in-out infinite; }
@keyframes stat-flicker { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
.dot.dark { background: #37474f; }
.close-btn {
  width: 32px; height: 32px; border: none; border-radius: 8px;
  background: rgba(255, 255, 255, 0.06); color: #8aa8c0;
  font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.close-btn:hover { background: rgba(255, 80, 80, 0.2); color: #ff6b6b; }

.cogmap-body {
  flex: 1; display: flex; min-height: 0; position: relative;
}
.canvas-container {
  flex: 1; min-width: 0;
}
canvas { display: block; width: 100%; height: 100%; }

.node-detail {
  width: 220px; padding: 16px;
  background: rgba(20, 24, 36, 0.9);
  border-left: 1px solid rgba(100, 200, 255, 0.1);
  overflow-y: auto;
}
.detail-header {
  display: flex; align-items: center; gap: 8px;
  padding-bottom: 10px; margin-bottom: 10px;
  border-bottom: 2px solid;
}
.detail-state-dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
.detail-state-dot.blazing { background: #ffd54f; box-shadow: 0 0 8px rgba(255, 213, 79, 0.6); }
.detail-state-dot.lit { background: #64c8ff; }
.detail-state-dot.flickering { background: #ffb74d; animation: stat-flicker 1.5s infinite; }
.detail-state-dot.dark { background: #37474f; }
.detail-name { color: #e0e8f0; font-size: 14px; font-weight: 600; }
.detail-domain { color: #5a6a76; font-size: 11px; margin-left: auto; }

.detail-metrics { display: flex; flex-direction: column; gap: 10px; }
.metric { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.metric-label { color: #7a8a96; font-size: 11px; width: 100%; }
.metric-value { color: #b8e6ff; font-size: 18px; font-weight: 700; }
.metric-bar {
  flex: 1; height: 6px; border-radius: 3px;
  background: rgba(100, 200, 255, 0.1);
  overflow: hidden;
}
.metric-bar .metric-fill {
  height: 100%; border-radius: 3px;
  background: linear-gradient(90deg, #64c8ff, #00e5ff);
  transition: width 0.5s ease;
}
.metric-bar.transfer .metric-fill {
  background: linear-gradient(90deg, #ab47bc, #e040fb);
}
.metric-pct { color: #8aa8c0; font-size: 11px; width: 36px; text-align: right; }

.detail-spark {
  margin-top: 12px; padding: 8px; border-radius: 6px;
  background: rgba(255, 213, 79, 0.08);
  color: #ffd54f; font-size: 12px; text-align: center;
}

.cogmap-domains {
  display: flex; gap: 8px; padding: 10px 20px;
  border-top: 1px solid rgba(100, 200, 255, 0.08);
  overflow-x: auto; flex-shrink: 0;
}
.domain-chip {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 12px;
  background: color-mix(in srgb, var(--domain-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--domain-color) 25%, transparent);
  flex-shrink: 0;
}
.domain-name { color: #a0b0c0; font-size: 11px; }
.domain-pct { color: var(--domain-color, #64c8ff); font-size: 11px; font-weight: 600; }

.cogmap-fade-enter-active { animation: cogmap-in 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.cogmap-fade-leave-active { animation: cogmap-in 0.25s ease-in reverse; }
@keyframes cogmap-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: none; }
}
</style>
