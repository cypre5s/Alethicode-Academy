<template>
  <transition name="panel-slide">
    <div v-if="engine.isFreeTalk.value" class="freetalk-panel" @click.stop>
      <div class="freetalk-header">
        <div class="freetalk-char-info">
          <span class="char-indicator" :style="{ background: charColor }"></span>
          <span class="char-name">{{ charName }}</span>
          <span class="turn-counter">对话 {{ currentTurn }} / {{ maxTurns }}</span>
          <span v-if="llm.offlineMode.value" class="offline-tag">离线模式</span>
        </div>
        <button class="freetalk-close" @click="endFreeTalk">结束对话</button>
      </div>

      <div class="freetalk-messages" ref="messagesRef">
        <div v-if="!llm.apiKey.value" class="no-api-hint">
          <span class="hint-icon">💡</span>
          <span>当前未配置 LLM API，对话将使用预设内容。前往「设置 → AI 对话设置」配置后可解锁自由对话。</span>
        </div>
        <div v-for="(msg, i) in messages" :key="i"
             class="message" :class="msg.role === 'user' ? 'msg-player' : 'msg-character'">
          <div v-if="msg.role === 'assistant' && msg.action" class="msg-action">
            {{ msg.action }}
          </div>
          <div class="msg-bubble" :style="msg.role === 'assistant' ? { borderColor: charColor } : {}">
            {{ msg.text }}
          </div>
          <div v-if="msg.role === 'assistant' && msg.innerThought" class="msg-inner-thought">
            （{{ msg.innerThought }}）
          </div>
        </div>

        <div v-if="llm.isGenerating.value" class="generating">
          <span class="dot-pulse">{{ charName }} 正在思考</span>
          <span class="dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
      </div>

      <div class="freetalk-input-area">
        <div v-if="showOptions" class="option-buttons">
          <button v-for="(opt, i) in playerOptions" :key="i"
                  class="option-btn" @click="sendMessage(opt)">
            {{ opt }}
          </button>
        </div>

        <div class="input-row">
          <input v-model="inputText" class="text-input"
                 placeholder="输入你想说的话..."
                 maxlength="500"
                 @keydown.enter="sendMessage(inputText)"
                 :disabled="llm.isGenerating.value" />
          <button class="send-btn" @click="sendMessage(inputText)"
                  :disabled="!inputText.trim() || llm.isGenerating.value">
            发送
          </button>
        </div>

        <div class="input-mode-toggle">
          <button class="mode-btn" :class="{ active: showOptions }"
                  @click="showOptions = !showOptions">
            {{ showOptions ? '隐藏选项' : '显示选项' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, inject, computed, watch, nextTick } from 'vue'
import { characters } from '../data/characters.js'
import { useLLMManager } from '../engine/LLMManager.js'

const engine = inject('engine')
const audio = inject('audio')
const llm = useLLMManager()

const messages = ref([])
const inputText = ref('')
const showOptions = ref(true)
const playerOptions = ref([])
const currentTurn = ref(0)
const messagesRef = ref(null)

const charId = computed(() => engine.freeTalkData.value?.character)
const charName = computed(() => characters[charId.value]?.name || '???')
const charColor = computed(() => characters[charId.value]?.color || '#999')
const maxTurns = computed(() => engine.freeTalkData.value?.maxTurns || 5)

watch(() => engine.isFreeTalk.value, async (val) => {
  if (val) {
    messages.value = []
    currentTurn.value = 0
    inputText.value = ''
    llm.loadApiKey()

    const firstLine = llm.getFallbackDialogue(charId.value, getGameState())
    messages.value.push({
      role: 'assistant',
      text: firstLine.text,
      expression: firstLine.expression,
      action: firstLine.action,
      innerThought: firstLine.innerThought
    })

    if (firstLine.expression && engine.visibleCharacters[charId.value]) {
      engine.visibleCharacters[charId.value].expression = firstLine.expression
    }

    await loadOptions()
  }
})

function getGameState() {
  return {
    playerName: engine.playerName.value,
    affection: { ...engine.affection },
    flags: { ...engine.flags },
    currentChapter: engine.currentChapter.value,
    currentTimeSlot: engine.currentTimeSlot.value,
    conversationHistory: engine.conversationHistory
  }
}

async function loadOptions() {
  const context = engine.freeTalkData.value?.context || ''
  playerOptions.value = await llm.generatePlayerOptions(charId.value, getGameState(), context)
}

async function sendMessage(text) {
  if (!text || !text.trim() || llm.isGenerating.value) return

  audio.playSfx('click')
  const playerMsg = text.trim()
  inputText.value = ''

  messages.value.push({ role: 'user', text: playerMsg })
  currentTurn.value++

  engine.conversationHistory[charId.value].push({ role: 'user', content: playerMsg })

  await nextTick()
  scrollToBottom()

  const response = await llm.generateCharacterDialogue(charId.value, playerMsg, getGameState())

  messages.value.push({
    role: 'assistant',
    text: response.text,
    expression: response.expression,
    action: response.action,
    innerThought: response.innerThought,
    affectionChange: response.affectionChange || 0
  })

  engine.conversationHistory[charId.value].push({ role: 'assistant', content: response.text })

  if (response.expression && engine.visibleCharacters[charId.value]) {
    engine.visibleCharacters[charId.value].expression = response.expression
  }

  if (response.affectionChange > 0) {
    engine.affection[charId.value] = Math.min(
      (engine.affection[charId.value] || 0) + response.affectionChange, 100
    )
    engine.showAffectionToast(charId.value, response.affectionChange)
  }

  await nextTick()
  scrollToBottom()

  if (currentTurn.value >= maxTurns.value) {
    setTimeout(() => endFreeTalk(), 2000)
    return
  }

  await loadOptions()
}

function endFreeTalk() {
  const totalAffection = {}
  messages.value
    .filter(m => m.role === 'assistant')
    .forEach(m => {
      if (m.affectionChange) {
        totalAffection[charId.value] = (totalAffection[charId.value] || 0) + m.affectionChange
      }
    })
  engine.resolveFreeTalk(totalAffection)
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}
</script>

<style scoped>
.freetalk-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  height: 65%;
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.96), rgba(255, 245, 236, 0.94));
  border-top: 1px solid rgba(219, 182, 123, 0.44);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  border-radius: 16px 16px 0 0;
}

.freetalk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(216, 177, 110, 0.22);
}

.freetalk-char-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.char-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.char-name { font-size: 15px; font-weight: 600; color: var(--vn-text); }

.turn-counter {
  font-size: 12px;
  color: #6f5f52;
  background: rgba(214, 182, 136, 0.18);
  padding: 2px 10px;
  border-radius: 10px;
}

.offline-tag {
  font-size: 11px;
  color: #a05555;
  background: rgba(200, 114, 114, 0.12);
  padding: 2px 8px;
  border-radius: 8px;
}

.freetalk-close {
  padding: 6px 16px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(216, 177, 110, 0.24);
  color: #6a5a4e;
  border-radius: 6px;
  font-size: 13px;
}

.freetalk-close:hover { color: var(--vn-text); border-color: var(--vn-primary); }

.freetalk-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-api-hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(198, 155, 78, 0.1);
  border: 1px solid rgba(198, 155, 78, 0.24);
  color: #7a5a1c;
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 4px;
}

.hint-icon { flex-shrink: 0; }

.message { max-width: 80%; }
.msg-player { align-self: flex-end; }
.msg-character { align-self: flex-start; }

.msg-bubble {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: var(--vn-dialogue-font-size, 17px);
  line-height: 1.6;
  color: var(--vn-text);
}

.msg-player .msg-bubble {
  background: rgba(221, 144, 170, 0.18);
  border: 1px solid rgba(221, 144, 170, 0.42);
  border-radius: 12px 12px 4px 12px;
}

.msg-character .msg-bubble {
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(216, 177, 110, 0.2);
  border-radius: 12px 12px 12px 4px;
}

.msg-action {
  font-size: 13px;
  color: var(--vn-text-dim);
  font-style: italic;
  margin-bottom: 4px;
  padding-left: 4px;
}

.msg-inner-thought {
  font-size: 13px;
  color: #866f65;
  font-style: italic;
  margin-top: 4px;
  padding-left: 4px;
}

.generating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--vn-text-dim);
  font-size: 14px;
}

.dots span {
  animation: dot-blink 1.4s ease-in-out infinite;
}
.dots span:nth-child(2) { animation-delay: 0.2s; }
.dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-blink {
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}

.freetalk-input-area {
  padding: 12px 20px 16px;
  border-top: 1px solid rgba(216, 177, 110, 0.2);
}

.option-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.option-btn {
  padding: 8px 16px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(216, 177, 110, 0.24);
  border-radius: 20px;
  color: var(--vn-text);
  font-size: 13px;
  white-space: nowrap;
}

.option-btn:hover {
  border-color: var(--vn-primary);
  background: rgba(232, 160, 191, 0.1);
}

.input-row {
  display: flex;
  gap: 8px;
}

.text-input {
  flex: 1;
  padding: 10px 16px;
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(216, 177, 110, 0.24);
  border-radius: 8px;
  color: var(--vn-text);
  font-size: 14px;
  font-family: var(--vn-font);
  outline: none;
}

.text-input:focus { border-color: var(--vn-primary); }
.text-input::placeholder { color: var(--vn-text-dim); }

.send-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, rgba(224, 145, 171, 0.95), rgba(198, 154, 78, 0.92));
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.send-btn:hover:not(:disabled) { filter: brightness(1.1); }

.input-mode-toggle {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.mode-btn {
  padding: 4px 12px;
  background: transparent;
  border: none;
  color: var(--vn-text-dim);
  font-size: 12px;
}

.mode-btn.active { color: var(--vn-primary); }

.panel-slide-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.panel-slide-leave-active { transition: all 0.3s ease; }
.panel-slide-enter-from { transform: translateY(100%); opacity: 0; }
.panel-slide-leave-to { transform: translateY(100%); opacity: 0; }
</style>
