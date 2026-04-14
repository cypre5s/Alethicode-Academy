<template>
  <transition name="console-slide">
    <div v-if="visible" class="debug-console" @click.stop>
      <div class="console-header">
        <span class="console-title">// developer_console.exe</span>
        <div class="console-tabs">
          <button v-for="tab in tabs" :key="tab.id"
                  class="tab-btn" :class="{ active: activeTab === tab.id }"
                  @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="console-body">
        <!-- Variables Panel -->
        <div v-if="activeTab === 'vars'" class="panel-vars">
          <div v-for="char in charList" :key="char.id" class="var-block">
            <div class="var-header" :style="{ color: char.color }">{{ char.id }}</div>
            <div class="var-line">
              <span class="var-name">.affection</span>
              <span class="var-eq">=</span>
              <span class="var-val">{{ rel[char.id]?.affection || 0 }}</span>
              <span v-if="lastDelta(char.id, 'affection')" class="var-delta" :class="lastDelta(char.id, 'affection') > 0 ? 'up' : 'down'">
                {{ lastDelta(char.id, 'affection') > 0 ? '↑' : '↓' }}{{ Math.abs(lastDelta(char.id, 'affection')) }}
              </span>
            </div>
            <div class="var-line">
              <span class="var-name">.trust</span>
              <span class="var-eq">=</span>
              <span class="var-val">{{ rel[char.id]?.trust || 0 }}</span>
              <span v-if="lastDelta(char.id, 'trust')" class="var-delta" :class="lastDelta(char.id, 'trust') > 0 ? 'up' : 'down'">
                {{ lastDelta(char.id, 'trust') > 0 ? '↑' : '↓' }}{{ Math.abs(lastDelta(char.id, 'trust')) }}
              </span>
            </div>
            <div class="var-line">
              <span class="var-name">.comfort</span>
              <span class="var-eq">=</span>
              <span class="var-val">{{ rel[char.id]?.comfort || 0 }}</span>
              <span v-if="lastDelta(char.id, 'comfort')" class="var-delta" :class="lastDelta(char.id, 'comfort') > 0 ? 'up' : 'down'">
                {{ lastDelta(char.id, 'comfort') > 0 ? '↑' : '↓' }}{{ Math.abs(lastDelta(char.id, 'comfort')) }}
              </span>
            </div>
            <div class="var-stage">stage: {{ getStage(char.id) }}</div>
          </div>
        </div>

        <!-- Stack Trace Panel -->
        <div v-if="activeTab === 'stack'" class="panel-stack">
          <div v-if="logs.length === 0" class="stack-empty">// no relationship changes recorded</div>
          <div v-for="(log, i) in reversedLogs" :key="i" class="stack-entry">
            <div class="stack-header">
              <span class="stack-char" :style="{ color: getCharColor(log.character) }">{{ log.character }}</span>
              <span class="stack-dims">
                <span v-if="log.delta.affection" :class="log.delta.affection > 0 ? 'dim-up' : 'dim-down'">aff{{ log.delta.affection > 0 ? '+' : '' }}{{ log.delta.affection }}</span>
                <span v-if="log.delta.trust" :class="log.delta.trust > 0 ? 'dim-up' : 'dim-down'">trust{{ log.delta.trust > 0 ? '+' : '' }}{{ log.delta.trust }}</span>
                <span v-if="log.delta.comfort" :class="log.delta.comfort > 0 ? 'dim-up' : 'dim-down'">comf{{ log.delta.comfort > 0 ? '+' : '' }}{{ log.delta.comfort }}</span>
              </span>
              <span class="stack-time">{{ formatTime(log.timestamp) }}</span>
            </div>
            <div class="stack-trace">
              <div class="trace-line">└─ {{ log.source || 'unknown' }}</div>
              <div v-if="log.trigger" class="trace-line">   └─ {{ log.trigger }}</div>
              <div class="trace-line">   └─ @ {{ log.chapter }}</div>
            </div>
          </div>
        </div>

        <!-- State Machine Panel -->
        <div v-if="activeTab === 'state'" class="panel-state">
          <div v-for="char in charList" :key="char.id" class="state-block">
            <div class="state-header" :style="{ color: char.color }">{{ char.name }}</div>
            <div class="state-current">
              <span class="state-label">current_stage:</span>
              <span class="state-value">{{ getStage(char.id) }}</span>
            </div>
            <div class="state-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: stageProgress(char.id) + '%', background: char.color }"></div>
              </div>
              <span class="progress-text">{{ stageProgress(char.id) }}%</span>
            </div>
            <div class="state-next">
              <span class="state-label">next_stage_at:</span>
              <span class="state-value">avg ≥ {{ nextThreshold(char.id) }}</span>
            </div>
          </div>
        </div>

        <!-- Live2D Debug Panel -->
        <div v-if="activeTab === 'live2d'" class="panel-live2d">
          <div class="l2d-info">
            <div class="var-line">
              <span class="var-name">tier:</span>
              <span class="var-val">{{ live2dTier }}</span>
            </div>
            <div class="var-line">
              <span class="var-name">enabled:</span>
              <span class="var-val">{{ live2dIsEnabled }}</span>
            </div>
            <div class="var-line">
              <span class="var-name">active_models:</span>
              <span class="var-val">{{ live2dActiveCount }}</span>
            </div>
          </div>

          <div class="l2d-section-title">// signals</div>
          <div class="l2d-signals" v-if="live2dSignals">
            <div v-for="(val, key) in live2dSignals" :key="key" class="var-line">
              <span class="var-name">{{ key }}:</span>
              <span class="var-val">{{ val ?? '—' }}</span>
            </div>
          </div>

          <div class="l2d-section-title">// state_machines</div>
          <div v-for="(sm, charId) in live2dStateMachines" :key="charId" class="l2d-sm-entry">
            <span class="stack-char" :style="{ color: getCharColor(charId) }">{{ charId }}</span>
            <span class="var-val">→ {{ sm.current }}</span>
          </div>

          <div class="l2d-section-title">// event_log (last 20)</div>
          <div class="l2d-log-scroll">
            <div v-for="(log, i) in live2dDebugLog" :key="i" class="l2d-log-entry">
              <span class="l2d-log-source">[{{ log.source }}]</span>
              <span class="l2d-log-msg">{{ log.message }}</span>
              <span class="stack-time">{{ formatTime(log.timestamp) }}</span>
            </div>
          </div>

          <div class="l2d-section-title">// test_controls</div>
          <div class="l2d-controls">
            <select v-model="l2dTestChar" class="l2d-select">
              <option v-for="char in charList" :key="char.id" :value="char.id">{{ char.name }}</option>
            </select>
            <select v-model="l2dTestExpr" class="l2d-select">
              <option v-for="expr in testExpressions" :key="expr" :value="expr">{{ expr }}</option>
            </select>
            <button class="l2d-test-btn" @click="testExpression">apply</button>
            <select v-model="l2dTestGaze" class="l2d-select">
              <option v-for="g in gazeTargets" :key="g" :value="g">{{ g }}</option>
            </select>
            <button class="l2d-test-btn" @click="testGaze">look</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { characters } from '../data/characters.js'
import { getRelationshipStage } from '../data/relationshipRules.js'

defineProps({ visible: Boolean })
defineEmits(['close'])

const engine = inject('engine')

const live2d = inject('live2d', null)

const activeTab = ref('vars')
const tabs = [
  { id: 'vars', label: 'Variables' },
  { id: 'stack', label: 'Stack Trace' },
  { id: 'state', label: 'State Machine' },
  { id: 'live2d', label: 'Live2D' },
]

const l2dTestChar = ref('nene')
const l2dTestExpr = ref('normal')
const l2dTestGaze = ref('player')
const testExpressions = ['normal', 'smile', 'gentle_smile', 'blush', 'surprised', 'sad', 'thinking', 'focused', 'proud', 'warm', 'pout', 'vulnerable']
const gazeTargets = ['player', 'mouse', 'code_area', 'sky', 'memory', 'away', 'wander', 'other_char']

const live2dTier = computed(() => live2d?.performanceTier || 'N/A')
const live2dIsEnabled = computed(() => live2d?.live2dEnabled?.value ?? false)
const live2dActiveCount = computed(() => Object.keys(live2d?.activeCharacters || {}).length)
const live2dSignals = computed(() => live2d?._currentSignals || {})
const live2dStateMachines = computed(() => live2d?._stateMachines || {})
const live2dDebugLog = computed(() => (live2d?.debugLog || []).slice(-20).reverse())

function testExpression() {
  if (live2d) live2d.setExpression(l2dTestChar.value, l2dTestExpr.value)
}

function testGaze() {
  if (live2d?._gazeController) live2d._gazeController.setTarget(l2dTestChar.value, l2dTestGaze.value, 3000)
}

const charList = computed(() => {
  return ['nene', 'yoshino', 'ayase', 'kanna', 'murasame'].map(id => ({
    id,
    name: characters[id]?.name || id,
    color: characters[id]?.color || '#aaa',
  }))
})

const rel = computed(() => engine.relationship)
const logs = computed(() => engine.relationshipChangeLog || [])
const reversedLogs = computed(() => [...logs.value].reverse().slice(0, 50))

function lastDelta(charId, dim) {
  for (let i = logs.value.length - 1; i >= 0; i--) {
    if (logs.value[i].character === charId && logs.value[i].delta[dim]) {
      return logs.value[i].delta[dim]
    }
  }
  return 0
}

function getStage(charId) {
  const r = rel.value[charId]
  return r ? getRelationshipStage(r) : '初识'
}

function getCharColor(charId) {
  return characters[charId]?.color || '#aaa'
}

function formatTime(ts) {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

const stageThresholds = [0, 15, 30, 50, 75, 100]

function _avg(charId) {
  const r = rel.value[charId]
  if (!r) return 0
  return Math.round((r.affection + r.trust + r.comfort) / 3)
}

function stageProgress(charId) {
  const avg = _avg(charId)
  const idx = stageThresholds.findIndex((t, i) => i < stageThresholds.length - 1 && avg >= t && avg < stageThresholds[i + 1])
  if (idx < 0) return 100
  const lo = stageThresholds[idx]
  const hi = stageThresholds[idx + 1]
  return Math.round(((avg - lo) / (hi - lo)) * 100)
}

function nextThreshold(charId) {
  const avg = _avg(charId)
  for (const t of stageThresholds) {
    if (t > avg) return t
  }
  return 100
}
</script>

<style scoped>
.debug-console {
  position: absolute;
  inset: 0;
  z-index: 40;
  background: rgba(10, 14, 20, 0.96);
  display: flex;
  flex-direction: column;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  color: #8dc891;
  overflow: hidden;
}

.console-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: rgba(20, 26, 36, 0.95);
  border-bottom: 1px solid rgba(80, 100, 120, 0.25);
  flex-shrink: 0;
}

.console-title {
  font-size: 13px;
  color: #5a6a7a;
  white-space: nowrap;
}

.console-tabs {
  display: flex;
  gap: 4px;
  flex: 1;
}

.tab-btn {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid rgba(80, 100, 120, 0.2);
  color: #5a6a7a;
  border-radius: 4px;
  font-family: inherit;
  font-size: 12px;
}
.tab-btn:hover { color: #8dc891; border-color: rgba(141, 200, 145, 0.3); }
.tab-btn.active { color: #8dc891; border-color: #8dc891; background: rgba(141, 200, 145, 0.08); }

.close-btn {
  background: transparent;
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #f87171;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover { background: rgba(248, 113, 113, 0.15); }

.console-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* Variables */
.panel-vars { display: flex; flex-wrap: wrap; gap: 16px; }

.var-block {
  background: rgba(20, 28, 40, 0.6);
  border: 1px solid rgba(80, 100, 120, 0.15);
  border-radius: 6px;
  padding: 12px 16px;
  min-width: 200px;
  flex: 1;
}

.var-header {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.var-line {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  font-size: 13px;
}

.var-name { color: #79b8ff; }
.var-eq { color: #5a6a7a; }
.var-val { color: #b5cea8; font-weight: 600; }
.var-delta { font-size: 11px; margin-left: 4px; }
.var-delta.up { color: #34d399; }
.var-delta.down { color: #f87171; }
.var-stage { font-size: 11px; color: #5a6a7a; margin-top: 6px; border-top: 1px solid rgba(80, 100, 120, 0.15); padding-top: 4px; }

/* Stack */
.panel-stack { display: flex; flex-direction: column; gap: 8px; }

.stack-empty { color: #5a6a7a; font-size: 13px; padding: 20px; text-align: center; }

.stack-entry {
  background: rgba(20, 28, 40, 0.4);
  border: 1px solid rgba(80, 100, 120, 0.1);
  border-radius: 4px;
  padding: 8px 12px;
}

.stack-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.stack-char { font-weight: 700; }
.stack-dims { display: flex; gap: 8px; font-size: 12px; }
.dim-up { color: #34d399; }
.dim-down { color: #f87171; }
.stack-time { margin-left: auto; color: #5a6a7a; font-size: 11px; }

.stack-trace { padding-left: 8px; margin-top: 4px; }
.trace-line { font-size: 11px; color: #5a6a7a; line-height: 1.6; white-space: pre; }

/* State */
.panel-state { display: flex; flex-wrap: wrap; gap: 16px; }

.state-block {
  background: rgba(20, 28, 40, 0.6);
  border: 1px solid rgba(80, 100, 120, 0.15);
  border-radius: 6px;
  padding: 12px 16px;
  min-width: 200px;
  flex: 1;
}

.state-header { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
.state-current, .state-next { font-size: 12px; margin-bottom: 6px; }
.state-label { color: #79b8ff; }
.state-value { color: #b5cea8; margin-left: 6px; }

.state-progress { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
.progress-bar { flex: 1; height: 6px; background: rgba(80, 100, 120, 0.2); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.progress-text { font-size: 11px; color: #5a6a7a; min-width: 30px; }

/* Live2D Debug */
.panel-live2d { display: flex; flex-direction: column; gap: 8px; }
.l2d-info { background: rgba(20, 28, 40, 0.6); border-radius: 6px; padding: 10px 14px; }
.l2d-section-title { color: #5a6a7a; font-size: 11px; margin-top: 8px; font-style: italic; }
.l2d-signals { background: rgba(20, 28, 40, 0.4); border-radius: 4px; padding: 8px 12px; }
.l2d-sm-entry { display: flex; align-items: center; gap: 8px; padding: 3px 12px; font-size: 12px; }
.l2d-log-scroll { max-height: 160px; overflow-y: auto; background: rgba(10, 14, 22, 0.6); border-radius: 4px; padding: 6px 10px; }
.l2d-log-entry { display: flex; gap: 6px; font-size: 11px; line-height: 1.6; }
.l2d-log-source { color: #79b8ff; min-width: 60px; }
.l2d-log-msg { color: #d4d4d4; flex: 1; }
.l2d-controls { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; padding: 6px 0; }
.l2d-select { background: rgba(20, 28, 40, 0.8); border: 1px solid rgba(80, 100, 120, 0.3); border-radius: 4px; color: #d4d4d4; font-size: 11px; padding: 4px 6px; }
.l2d-test-btn { background: rgba(79, 168, 255, 0.15); border: 1px solid rgba(79, 168, 255, 0.3); border-radius: 4px; color: #79b8ff; font-size: 11px; padding: 4px 10px; cursor: pointer; }
.l2d-test-btn:hover { background: rgba(79, 168, 255, 0.3); }

.console-slide-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.console-slide-leave-active { transition: all 0.2s ease; }
.console-slide-enter-from { opacity: 0; transform: translateY(20px); }
.console-slide-leave-to { opacity: 0; transform: translateY(20px); }
</style>
