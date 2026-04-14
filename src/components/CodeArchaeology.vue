<template>
  <transition name="arch-fade">
    <div v-if="isOpen" class="archaeology-overlay" @click.self="$emit('close')">
      <div class="archaeology-panel">
        <div class="arch-header">
          <div class="arch-title">
            <span class="arch-icon">🏛️</span>
            <span>代码考古</span>
            <span class="total-badge">{{ totalEntries }} 份代码</span>
          </div>
          <div class="arch-tabs">
            <button class="tab-btn" :class="{ active: activeTab === 'timeline' }" @click="activeTab = 'timeline'">地质层</button>
            <button class="tab-btn" :class="{ active: activeTab === 'milestones' }" @click="activeTab = 'milestones'">里程碑</button>
            <button class="tab-btn" :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">统计</button>
          </div>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>

        <div class="arch-body">
          <!-- Timeline / Geological Layers -->
          <div v-if="activeTab === 'timeline'" class="timeline-view">
            <div class="strata-container" ref="strataContainer">
              <div v-for="(stratum, idx) in strata" :key="stratum.id"
                   class="stratum-layer"
                   :class="{ success: stratum.success, fail: !stratum.success, selected: selectedStratum?.id === stratum.id }"
                   :style="{ '--depth': idx, '--complexity': stratum.complexity }"
                   @click="selectStratum(stratum)">
                <div class="stratum-left">
                  <div class="stratum-depth-line" :style="{ height: Math.min(40, stratum.complexity * 0.8) + 'px' }" />
                  <span class="stratum-icon">{{ stratum.success ? '◆' : '◇' }}</span>
                </div>
                <div class="stratum-content">
                  <div class="stratum-meta">
                    <span class="stratum-time">{{ formatTime(stratum.timestamp) }}</span>
                    <span v-if="stratum.chapter" class="stratum-chapter">{{ stratum.chapter }}</span>
                    <span v-if="stratum.character" class="stratum-char">{{ stratum.character }}</span>
                  </div>
                  <pre class="stratum-code">{{ stratum.codeSummary }}</pre>
                  <div class="stratum-bar" :style="{ width: Math.min(100, stratum.complexity * 2) + '%' }" />
                </div>
                <div class="stratum-complexity">
                  <span class="complexity-num">{{ stratum.complexity }}</span>
                  <span class="complexity-label">复杂度</span>
                </div>
              </div>

              <div v-if="strata.length === 0" class="empty-state">
                <div class="empty-icon">🏜️</div>
                <div class="empty-text">尚无代码地层</div>
                <div class="empty-hint">完成编程挑战后，你的代码将沉淀为地质层</div>
              </div>
            </div>

            <!-- Milestone Markers on Timeline -->
            <div class="milestone-markers">
              <div v-for="m in milestoneMarkers" :key="m.id" class="milestone-marker"
                   :style="{ top: getMilestonePosition(m) + 'px' }">
                <span class="marker-star">★</span>
                <span class="marker-label">{{ m.label }}</span>
              </div>
            </div>
          </div>

          <!-- Milestones Tab -->
          <div v-if="activeTab === 'milestones'" class="milestones-view">
            <div v-for="(milestone, idx) in milestonesList" :key="milestone.id" class="milestone-card"
                 :style="{ '--delay': idx * 0.05 + 's' }">
              <div class="milestone-star-container">
                <span class="milestone-star">★</span>
                <div class="milestone-connector" v-if="idx < milestonesList.length - 1" />
              </div>
              <div class="milestone-info">
                <div class="milestone-label">{{ milestone.label }}</div>
                <div class="milestone-time">{{ formatTime(milestone.timestamp) }}</div>
                <pre v-if="milestone.code" class="milestone-code">{{ truncateCode(milestone.code) }}</pre>
              </div>
            </div>
            <div v-if="milestonesList.length === 0" class="empty-state">
              <div class="empty-icon">🌟</div>
              <div class="empty-text">里程碑等你书写</div>
            </div>
          </div>

          <!-- Stats Tab -->
          <div v-if="activeTab === 'stats'" class="stats-view">
            <div class="stat-card">
              <div class="stat-value">{{ totalEntries }}</div>
              <div class="stat-label">总代码量</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ Math.round(stats.successRate * 100) }}%</div>
              <div class="stat-label">成功率</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.peakComplexity }}</div>
              <div class="stat-label">最高复杂度</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.avgComplexity }}</div>
              <div class="stat-label">平均复杂度</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ milestonesList.length }}</div>
              <div class="stat-label">里程碑</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ formatDuration(stats.totalExecutionTime) }}</div>
              <div class="stat-label">总执行时间</div>
            </div>
          </div>
        </div>

        <!-- Detail Panel -->
        <transition name="detail-slide">
          <div v-if="selectedStratum" class="detail-panel">
            <div class="detail-close" @click="selectedStratum = null">×</div>
            <div class="detail-title">代码化石 #{{ selectedStratum.id?.slice(-6) }}</div>
            <div class="detail-meta">
              <span>{{ formatTime(selectedStratum.timestamp) }}</span>
              <span v-if="selectedStratum.chapter">{{ selectedStratum.chapter }}</span>
              <span :class="selectedStratum.success ? 'success-tag' : 'fail-tag'">
                {{ selectedStratum.success ? '✓ 成功' : '✗ 失败' }}
              </span>
            </div>
            <pre class="detail-code">{{ selectedStratum.fullCode || selectedStratum.codeSummary }}</pre>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  temporalDB: { type: Object, required: true },
})

const emit = defineEmits(['close'])

const activeTab = ref('timeline')
const selectedStratum = ref(null)
const strata = ref([])
const milestoneMarkers = ref([])

const totalEntries = computed(() => props.temporalDB?.totalEntries?.value || 0)
const stats = computed(() => props.temporalDB?.strataStats || {})
const milestonesList = computed(() => props.temporalDB?.getMilestonesList?.() || [])

watch(() => props.isOpen, async (open) => {
  if (open) {
    await loadData()
  } else {
    selectedStratum.value = null
  }
})

async function loadData() {
  const data = await props.temporalDB?.getTimelineData?.({ limit: 100 })
  if (data) {
    strata.value = data.strata || []
    milestoneMarkers.value = data.milestoneMarkers || []
  }
}

function selectStratum(stratum) {
  if (selectedStratum.value?.id === stratum.id) {
    selectedStratum.value = null
  } else {
    selectedStratum.value = stratum
    loadFullCode(stratum)
  }
}

async function loadFullCode(stratum) {
  const entry = await props.temporalDB?.getCodeEntry?.(stratum.id)
  if (entry && selectedStratum.value?.id === stratum.id) {
    selectedStratum.value = { ...stratum, fullCode: entry.code }
  }
}

function getMilestonePosition(milestone) {
  const idx = strata.value.findIndex(s => s.id === milestone.codeEntryId)
  return idx >= 0 ? idx * 70 + 20 : 0
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDuration(ms) {
  if (!ms) return '0s'
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.round(ms / 60000)}min`
}

function truncateCode(code) {
  if (!code) return ''
  const lines = code.split('\n')
  if (lines.length <= 5) return code
  return lines.slice(0, 4).join('\n') + `\n... (${lines.length} lines)`
}
</script>

<style scoped>
.archaeology-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; backdrop-filter: blur(4px);
}
.archaeology-panel {
  width: 90vw; max-width: 850px; height: 80vh; max-height: 650px;
  background: rgba(14, 12, 10, 0.98);
  border: 1px solid rgba(180, 140, 80, 0.2);
  border-radius: 16px;
  display: flex; flex-direction: column;
  overflow: hidden; position: relative;
  box-shadow: 0 0 50px rgba(180, 140, 80, 0.08);
}

.arch-header {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 20px;
  background: rgba(180, 140, 80, 0.05);
  border-bottom: 1px solid rgba(180, 140, 80, 0.12);
}
.arch-title {
  display: flex; align-items: center; gap: 8px;
  color: #d4b896; font-size: 15px; font-weight: 600;
}
.arch-icon { font-size: 20px; }
.total-badge {
  font-size: 11px; padding: 2px 8px; border-radius: 10px;
  background: rgba(180, 140, 80, 0.12); color: #b89860;
}
.arch-tabs {
  display: flex; gap: 4px; margin-left: auto;
}
.tab-btn {
  padding: 5px 14px; border: 1px solid rgba(180, 140, 80, 0.15);
  border-radius: 6px; background: transparent;
  color: #7a6a56; font-size: 12px; cursor: pointer;
  transition: all 0.15s;
}
.tab-btn.active {
  background: rgba(180, 140, 80, 0.15);
  color: #d4b896; border-color: rgba(180, 140, 80, 0.3);
}
.close-btn {
  width: 32px; height: 32px; border: none; border-radius: 8px;
  background: rgba(255, 255, 255, 0.06); color: #8a7a6a;
  font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.close-btn:hover { background: rgba(255, 80, 80, 0.2); color: #ff6b6b; }

.arch-body {
  flex: 1; overflow-y: auto; position: relative; min-height: 0;
}

.timeline-view { display: flex; position: relative; height: 100%; }
.strata-container {
  flex: 1; padding: 16px 20px; overflow-y: auto;
}
.stratum-layer {
  display: flex; gap: 12px; align-items: stretch;
  padding: 10px 12px; margin-bottom: 4px;
  border-radius: 8px; cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  animation: stratum-appear 0.3s ease-out;
  animation-delay: calc(var(--depth) * 0.03s);
  animation-fill-mode: backwards;
}
@keyframes stratum-appear {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: none; }
}
.stratum-layer:hover { background: rgba(180, 140, 80, 0.06); }
.stratum-layer.selected { background: rgba(180, 140, 80, 0.1); border-left-color: #b89860; }
.stratum-layer.success { border-left-color: rgba(102, 187, 106, 0.4); }
.stratum-layer.fail { border-left-color: rgba(239, 83, 80, 0.3); }

.stratum-left {
  display: flex; flex-direction: column; align-items: center;
  width: 20px; flex-shrink: 0;
}
.stratum-depth-line {
  width: 2px; background: linear-gradient(to bottom, rgba(180, 140, 80, 0.3), rgba(180, 140, 80, 0.05));
  border-radius: 1px;
}
.stratum-icon { font-size: 10px; color: #8a7a6a; margin-top: 4px; }
.stratum-layer.success .stratum-icon { color: #66bb6a; }
.stratum-layer.fail .stratum-icon { color: #ef5350; }

.stratum-content { flex: 1; min-width: 0; }
.stratum-meta {
  display: flex; gap: 8px; align-items: center;
  margin-bottom: 4px;
}
.stratum-time { color: #7a6a56; font-size: 11px; }
.stratum-chapter { color: #8a7a6a; font-size: 10px; background: rgba(180, 140, 80, 0.1); padding: 1px 6px; border-radius: 3px; }
.stratum-char { color: #9a8a7a; font-size: 10px; }
.stratum-code {
  font-family: 'Fira Code', monospace; font-size: 11px;
  color: #a09080; margin: 0; white-space: pre-wrap;
  overflow: hidden; max-height: 36px;
}
.stratum-bar {
  height: 2px; border-radius: 1px; margin-top: 6px;
  background: linear-gradient(90deg, rgba(180, 140, 80, 0.3), rgba(180, 140, 80, 0.08));
}

.stratum-complexity {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; width: 50px; flex-shrink: 0;
}
.complexity-num { color: #b89860; font-size: 16px; font-weight: 700; }
.complexity-label { color: #5a4a3a; font-size: 9px; }

.milestone-markers {
  width: 120px; flex-shrink: 0; position: relative;
  border-left: 1px solid rgba(180, 140, 80, 0.1);
  overflow: hidden;
}
.milestone-marker {
  position: absolute; left: 10px; right: 10px;
  display: flex; align-items: center; gap: 4px;
  padding: 3px 6px; border-radius: 4px;
  background: rgba(255, 213, 79, 0.08);
}
.marker-star { color: #ffd54f; font-size: 12px; }
.marker-label { color: #b89860; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.milestones-view { padding: 20px; }
.milestone-card {
  display: flex; gap: 16px; margin-bottom: 20px;
  animation: milestone-appear 0.4s ease-out;
  animation-delay: var(--delay, 0s);
  animation-fill-mode: backwards;
}
@keyframes milestone-appear {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}
.milestone-star-container {
  display: flex; flex-direction: column; align-items: center;
  width: 24px; flex-shrink: 0;
}
.milestone-star { font-size: 18px; color: #ffd54f; text-shadow: 0 0 10px rgba(255, 213, 79, 0.4); }
.milestone-connector {
  width: 2px; flex: 1; margin-top: 4px;
  background: linear-gradient(to bottom, rgba(255, 213, 79, 0.3), rgba(255, 213, 79, 0.05));
}
.milestone-info { flex: 1; }
.milestone-label { color: #d4b896; font-size: 14px; font-weight: 600; }
.milestone-time { color: #7a6a56; font-size: 11px; margin-top: 2px; }
.milestone-code {
  font-family: 'Fira Code', monospace; font-size: 11px;
  color: #8a7a6a; margin: 8px 0 0; padding: 8px;
  background: rgba(180, 140, 80, 0.05); border-radius: 6px;
  white-space: pre-wrap; max-height: 80px; overflow: hidden;
}

.stats-view {
  padding: 24px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
.stat-card {
  text-align: center; padding: 20px;
  background: rgba(180, 140, 80, 0.05);
  border: 1px solid rgba(180, 140, 80, 0.1);
  border-radius: 12px;
}
.stat-value { color: #d4b896; font-size: 28px; font-weight: 700; }
.stat-label { color: #7a6a56; font-size: 12px; margin-top: 4px; }

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 60px 20px; text-align: center;
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-text { color: #8a7a6a; font-size: 16px; font-weight: 500; }
.empty-hint { color: #5a4a3a; font-size: 13px; margin-top: 8px; }

.detail-panel {
  position: absolute; right: 0; top: 0; bottom: 0; width: 320px;
  background: rgba(18, 16, 12, 0.98);
  border-left: 1px solid rgba(180, 140, 80, 0.15);
  padding: 20px; overflow-y: auto; z-index: 10;
}
.detail-close {
  position: absolute; top: 12px; right: 12px;
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 6px; cursor: pointer;
  color: #7a6a56; font-size: 16px;
}
.detail-close:hover { background: rgba(255, 80, 80, 0.15); color: #ff6b6b; }
.detail-title { color: #d4b896; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
.detail-meta {
  display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;
}
.detail-meta span { color: #7a6a56; font-size: 11px; }
.success-tag { color: #66bb6a !important; }
.fail-tag { color: #ef5350 !important; }
.detail-code {
  font-family: 'Fira Code', monospace; font-size: 11px;
  color: #a09080; margin: 0; padding: 12px;
  background: rgba(180, 140, 80, 0.05);
  border-radius: 8px; white-space: pre-wrap;
  border: 1px solid rgba(180, 140, 80, 0.08);
}

.detail-slide-enter-active { animation: detail-in 0.25s ease-out; }
.detail-slide-leave-active { animation: detail-in 0.2s ease-in reverse; }
@keyframes detail-in {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: none; }
}

.arch-fade-enter-active { animation: arch-in 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.arch-fade-leave-active { animation: arch-in 0.25s ease-in reverse; }
@keyframes arch-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: none; }
}
</style>
