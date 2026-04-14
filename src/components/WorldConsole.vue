<template>
  <transition name="console-slide">
    <div v-if="isOpen" class="world-console" :class="{ minimized: isMinimized }">
      <div class="console-header" @mousedown="startDrag">
        <div class="console-title">
          <span class="console-icon">⚡</span>
          <span>World Console</span>
          <span class="tier-badge" :class="`tier-${tier}`">Tier {{ tier }}</span>
        </div>
        <div class="console-controls">
          <button class="console-btn" @click="toggleHelp" title="API 文档">?</button>
          <button class="console-btn" @click="toggleMinimize" title="最小化">{{ isMinimized ? '□' : '─' }}</button>
          <button class="console-btn close-btn" @click="$emit('close')" title="关闭">×</button>
        </div>
      </div>

      <div v-if="!isMinimized" class="console-body">
        <div v-if="showHelp" class="help-panel">
          <div class="help-title">🌍 World API (Tier {{ tier }})</div>
          <div v-for="api in availableAPIs" :key="api.name" class="help-item" @click="insertExample(api.example)">
            <code class="help-name">{{ api.name }}</code>
            <span class="help-desc">{{ api.desc }}</span>
          </div>
          <div class="help-close" @click="showHelp = false">关闭文档</div>
        </div>

        <div ref="outputArea" class="output-area">
          <div v-for="(entry, idx) in outputHistory" :key="idx" class="output-entry" :class="entry.type">
            <div v-if="entry.type === 'input'" class="output-prompt">
              <span class="prompt-symbol">❯</span>
              <pre class="output-code">{{ entry.text }}</pre>
            </div>
            <div v-else-if="entry.type === 'output'" class="output-result">
              <pre class="output-text">{{ entry.text }}</pre>
            </div>
            <div v-else-if="entry.type === 'error'" class="output-error">
              <pre class="output-text">{{ entry.text }}</pre>
            </div>
            <div v-else-if="entry.type === 'world-change'" class="output-world-change">
              <span class="change-icon">🌍</span>
              <span>{{ entry.text }}</span>
            </div>
            <div v-else-if="entry.type === 'say'" class="output-say">
              <span class="say-icon">💬</span>
              <span class="say-char">{{ entry.character }}</span>
              <span>{{ entry.text }}</span>
            </div>
            <div v-else-if="entry.type === 'discovery'" class="output-discovery">
              <span class="discovery-icon">✨</span>
              <span>{{ entry.text }}</span>
            </div>
            <div v-else-if="entry.type === 'milestone'" class="output-milestone">
              <span class="milestone-icon">★</span>
              <span>{{ entry.text }}</span>
            </div>
          </div>
          <div v-if="isExecuting" class="executing-indicator">
            <span class="dot-pulse"></span> 运行中...
          </div>
        </div>

        <div class="input-area">
          <div class="input-mode-toggle">
            <button
              class="mode-btn"
              :class="{ active: inputMode === 'single' }"
              @click="inputMode = 'single'"
            >单行</button>
            <button
              class="mode-btn"
              :class="{ active: inputMode === 'multi' }"
              @click="inputMode = 'multi'"
            >多行</button>
          </div>
          <div class="input-row">
            <span class="input-prompt">❯</span>
            <textarea
              v-if="inputMode === 'multi'"
              ref="inputBox"
              v-model="currentInput"
              class="input-field multi"
              :rows="Math.min(8, Math.max(3, currentInput.split('\n').length))"
              @keydown="handleKeydown"
              placeholder="输入 Python 代码与世界交互..."
              spellcheck="false"
            />
            <input
              v-else
              ref="inputBox"
              v-model="currentInput"
              class="input-field"
              @keydown="handleKeydown"
              placeholder="world.sky.color = '#ff6b6b'"
              spellcheck="false"
            />
            <button class="run-btn" :disabled="isExecuting || !currentInput.trim()" @click="executeInput">
              {{ isExecuting ? '⏳' : '▶' }}
            </button>
          </div>
          <div v-if="historyPointer >= 0" class="history-hint">
            ↑↓ 浏览历史 ({{ historyPointer + 1 }}/{{ inputHistory.length }})
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, nextTick, watch, inject, onMounted, computed } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  worldVM: { type: Object, required: true },
})

const emit = defineEmits(['close', 'world-change', 'character-say', 'discovery'])

const isMinimized = ref(false)
const showHelp = ref(false)
const inputMode = ref('single')
const currentInput = ref('')
const outputHistory = reactive([])
const inputHistory = reactive([])
const historyPointer = ref(-1)
const isExecuting = ref(false)

const outputArea = ref(null)
const inputBox = ref(null)

const tier = computed(() => props.worldVM?.worldState?.unlockedTier ?? 0)

const availableAPIs = computed(() => {
  return props.worldVM?.getAPIDocumentation?.(tier.value) || []
})

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
}

function toggleHelp() {
  showHelp.value = !showHelp.value
}

function insertExample(example) {
  if (example) {
    currentInput.value = example
    showHelp.value = false
    nextTick(() => inputBox.value?.focus())
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey && inputMode.value === 'single') {
    e.preventDefault()
    executeInput()
  } else if (e.key === 'Enter' && e.ctrlKey && inputMode.value === 'multi') {
    e.preventDefault()
    executeInput()
  } else if (e.key === 'ArrowUp' && inputMode.value === 'single') {
    e.preventDefault()
    navigateHistory(-1)
  } else if (e.key === 'ArrowDown' && inputMode.value === 'single') {
    e.preventDefault()
    navigateHistory(1)
  }
}

function navigateHistory(direction) {
  const newPointer = historyPointer.value + direction
  if (newPointer >= 0 && newPointer < inputHistory.length) {
    historyPointer.value = newPointer
    currentInput.value = inputHistory[inputHistory.length - 1 - newPointer]
  } else if (newPointer < 0) {
    historyPointer.value = -1
    currentInput.value = ''
  }
}

async function executeInput() {
  const code = currentInput.value.trim()
  if (!code || isExecuting.value) return

  outputHistory.push({ type: 'input', text: code })
  inputHistory.push(code)
  if (inputHistory.length > 50) inputHistory.splice(0, inputHistory.length - 50)
  historyPointer.value = -1
  currentInput.value = ''

  isExecuting.value = true
  scrollToBottom()

  const result = await props.worldVM.executeWorldCode(code)

  isExecuting.value = false

  if (result.stdout) {
    outputHistory.push({ type: 'output', text: result.stdout })
  }
  if (result.stderr) {
    outputHistory.push({ type: 'error', text: result.stderr })
  }

  if (result.mutations) {
    for (const change of (result.mutations.changes || [])) {
      if (change.type === 'property_change') {
        outputHistory.push({
          type: 'world-change',
          text: `${change.entity_type}.${change.entity_id}.${change.property} = ${JSON.stringify(change.value)}`,
        })
        emit('world-change', change)
      }
    }

    for (const say of (result.mutations.says || [])) {
      outputHistory.push({
        type: 'say',
        character: say.character,
        text: say.text,
      })
      emit('character-say', say)
    }

    for (const disc of (result.mutations.discoveries || [])) {
      outputHistory.push({
        type: 'discovery',
        text: `发现了秘密: ${disc.secret}`,
      })
      emit('discovery', disc)
    }

    for (const learn of (result.mutations.learns || [])) {
      outputHistory.push({
        type: 'milestone',
        text: `习得能力: ${learn.ability}`,
      })
    }
  }

  if (outputHistory.length > 200) outputHistory.splice(0, outputHistory.length - 200)
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (outputArea.value) {
      outputArea.value.scrollTop = outputArea.value.scrollHeight
    }
  })
}

let dragState = null
function startDrag(e) {
  if (e.target.closest('.console-btn')) return
  dragState = { startX: e.clientX, startY: e.clientY }
}
</script>

<style scoped>
.world-console {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 520px;
  max-height: 480px;
  background: rgba(10, 12, 20, 0.95);
  border: 1px solid rgba(100, 200, 255, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  z-index: 100;
  box-shadow:
    0 0 30px rgba(100, 200, 255, 0.15),
    0 0 60px rgba(100, 200, 255, 0.05),
    inset 0 0 30px rgba(100, 200, 255, 0.03);
  backdrop-filter: blur(12px);
  overflow: hidden;
}
.world-console.minimized {
  max-height: 44px;
}
.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: rgba(100, 200, 255, 0.08);
  border-bottom: 1px solid rgba(100, 200, 255, 0.15);
  cursor: grab;
  user-select: none;
}
.console-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b8e6ff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.console-icon {
  font-size: 16px;
  animation: pulse-glow 2s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 6px rgba(100, 200, 255, 0.6); }
  50% { text-shadow: 0 0 14px rgba(100, 200, 255, 1), 0 0 24px rgba(100, 200, 255, 0.4); }
}
.tier-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(100, 200, 255, 0.15);
  color: #8ad4ff;
}
.tier-badge.tier-0 { background: rgba(120, 144, 156, 0.2); color: #90a4ae; }
.tier-badge.tier-1 { background: rgba(100, 200, 255, 0.2); color: #64c8ff; }
.tier-badge.tier-2 { background: rgba(171, 71, 188, 0.2); color: #ce93d8; }
.tier-badge.tier-3 { background: rgba(255, 167, 38, 0.2); color: #ffb74d; }
.console-controls {
  display: flex;
  gap: 4px;
}
.console-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  color: #8aa8c0;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.console-btn:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }
.close-btn:hover { background: rgba(255, 80, 80, 0.3); color: #ff6b6b; }

.console-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.help-panel {
  padding: 10px 14px;
  background: rgba(100, 200, 255, 0.05);
  border-bottom: 1px solid rgba(100, 200, 255, 0.1);
  max-height: 200px;
  overflow-y: auto;
}
.help-title { color: #b8e6ff; font-size: 12px; font-weight: 600; margin-bottom: 8px; }
.help-item {
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 2px;
}
.help-item:hover { background: rgba(100, 200, 255, 0.1); }
.help-name { color: #64c8ff; font-size: 11px; white-space: nowrap; }
.help-desc { color: #7a8a96; font-size: 11px; }
.help-close {
  text-align: center;
  color: #5a6a76;
  font-size: 11px;
  padding: 6px;
  cursor: pointer;
}
.help-close:hover { color: #8aa8c0; }

.output-area {
  flex: 1;
  overflow-y: auto;
  padding: 10px 14px;
  min-height: 120px;
  max-height: 280px;
}
.output-area::-webkit-scrollbar { width: 4px; }
.output-area::-webkit-scrollbar-thumb { background: rgba(100, 200, 255, 0.2); border-radius: 2px; }

.output-entry { margin-bottom: 6px; animation: entry-appear 0.2s ease-out; }
@keyframes entry-appear { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

.output-prompt { display: flex; gap: 6px; align-items: flex-start; }
.prompt-symbol { color: #64c8ff; font-size: 13px; flex-shrink: 0; margin-top: 1px; }
.output-code { color: #d4e6f0; font-size: 12px; margin: 0; white-space: pre-wrap; word-break: break-all; }
.output-result pre { color: #a8d8b9; font-size: 12px; margin: 0 0 0 20px; white-space: pre-wrap; }
.output-error pre { color: #ff8a80; font-size: 12px; margin: 0 0 0 20px; white-space: pre-wrap; }

.output-world-change {
  display: flex; gap: 6px; align-items: center;
  color: #64c8ff; font-size: 11px;
  padding: 3px 8px; border-radius: 4px;
  background: rgba(100, 200, 255, 0.08);
  border-left: 2px solid rgba(100, 200, 255, 0.4);
}
.output-say {
  display: flex; gap: 6px; align-items: center;
  color: #ffd54f; font-size: 12px;
  padding: 4px 8px; border-radius: 4px;
  background: rgba(255, 213, 79, 0.08);
  border-left: 2px solid rgba(255, 213, 79, 0.4);
}
.say-char { font-weight: 600; color: #ffecb3; }
.output-discovery {
  display: flex; gap: 6px; align-items: center;
  color: #e1bee7; font-size: 12px;
  padding: 4px 8px; border-radius: 4px;
  background: rgba(171, 71, 188, 0.1);
  border-left: 2px solid rgba(171, 71, 188, 0.5);
  animation: discovery-glow 1.5s ease-in-out;
}
@keyframes discovery-glow {
  0% { box-shadow: 0 0 20px rgba(171, 71, 188, 0.4); }
  100% { box-shadow: none; }
}
.output-milestone {
  display: flex; gap: 6px; align-items: center;
  color: #ffd54f; font-size: 12px;
  padding: 4px 8px; border-radius: 4px;
  background: rgba(255, 167, 38, 0.1);
  border-left: 2px solid rgba(255, 167, 38, 0.5);
}

.executing-indicator {
  display: flex; align-items: center; gap: 8px;
  color: #64c8ff; font-size: 12px; padding: 4px 0;
}
.dot-pulse {
  display: inline-block; width: 6px; height: 6px;
  background: #64c8ff; border-radius: 50%;
  animation: dot-blink 1s ease-in-out infinite;
}
@keyframes dot-blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

.input-area {
  border-top: 1px solid rgba(100, 200, 255, 0.1);
  padding: 8px 14px 10px;
  background: rgba(10, 12, 20, 0.5);
}
.input-mode-toggle {
  display: flex; gap: 4px; margin-bottom: 6px;
}
.mode-btn {
  padding: 2px 10px; border: 1px solid rgba(100, 200, 255, 0.15);
  border-radius: 4px; background: transparent;
  color: #5a6a76; font-size: 10px; cursor: pointer;
  transition: all 0.15s;
}
.mode-btn.active {
  background: rgba(100, 200, 255, 0.12);
  color: #8ad4ff;
  border-color: rgba(100, 200, 255, 0.3);
}
.input-row {
  display: flex; gap: 6px; align-items: flex-start;
}
.input-prompt {
  color: #64c8ff; font-size: 13px; margin-top: 6px; flex-shrink: 0;
}
.input-field {
  flex: 1; background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(100, 200, 255, 0.15);
  border-radius: 6px; padding: 6px 10px;
  color: #d4e6f0; font-size: 12px;
  font-family: inherit; outline: none;
  transition: border-color 0.2s;
  resize: none;
}
.input-field:focus { border-color: rgba(100, 200, 255, 0.4); }
.input-field.multi { line-height: 1.5; }
.input-field::placeholder { color: rgba(100, 200, 255, 0.25); }
.run-btn {
  width: 34px; height: 34px; border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(100, 200, 255, 0.1));
  color: #64c8ff; font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.run-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.35), rgba(100, 200, 255, 0.2));
  transform: scale(1.05);
}
.run-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.history-hint {
  font-size: 10px; color: #4a5a66; margin-top: 4px; text-align: right;
}

/* ─── Magic Particles ─── */
.world-console::before {
  content: '';
  position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
  border-radius: 14px; z-index: -1;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(100, 200, 255, 0.08) 40%,
    rgba(100, 200, 255, 0.15) 50%,
    rgba(100, 200, 255, 0.08) 60%,
    transparent 70%
  );
  background-size: 200% 200%;
  animation: magic-border 4s ease infinite;
}
@keyframes magic-border {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.output-world-change::after {
  content: '✦';
  position: absolute; right: 8px;
  opacity: 0;
  animation: sparkle-fade 0.8s ease-out forwards;
  color: rgba(100, 200, 255, 0.6);
}
@keyframes sparkle-fade {
  0% { opacity: 1; transform: scale(1.5); }
  100% { opacity: 0; transform: scale(0.5) translateY(-10px); }
}

.output-say::before {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(to bottom, rgba(255, 213, 79, 0.6), transparent);
  animation: say-glow 1s ease-out;
}
@keyframes say-glow {
  0% { box-shadow: 0 0 12px rgba(255, 213, 79, 0.4); }
  100% { box-shadow: none; }
}

.console-slide-enter-active { animation: console-in 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.console-slide-leave-active { animation: console-in 0.25s ease-in reverse; }
@keyframes console-in {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: none; }
}
</style>
