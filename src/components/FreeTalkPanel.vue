<template>
  <transition name="panel-slide">
    <div v-if="engine.isFreeTalk.value" class="freetalk-panel" @click.stop>
      <div class="freetalk-header">
        <div class="freetalk-char-info">
          <span class="char-indicator" :style="{ background: charColor }"></span>
          <span class="char-name">{{ charName }}</span>
          <span class="turn-counter">对话 {{ currentTurn }} / {{ maxTurns }}</span>
          <span v-if="freeTalkMode === 'semi_preset'" class="mode-tag semi">半预设</span>
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
          <div v-if="msg.role === 'assistant' && msg.relationshipSummary" class="msg-rel-delta">
            {{ msg.relationshipSummary }}
          </div>
        </div>

        <div v-if="llm.isGenerating.value" class="generating">
          <span class="dot-pulse">{{ charName }} 正在思考</span>
          <span class="dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
      </div>

      <div v-if="wrapUpMode" class="freetalk-wrapup">
        <div class="wrapup-farewell">
          <p class="wrapup-line" :style="{ color: charColor }">{{ farewellLine }}</p>
        </div>
        <div v-if="sessionSummary.length" class="wrapup-summary">
          <div v-for="(item, i) in sessionSummary" :key="i" class="wrapup-delta">
            <span class="wrapup-label">{{ item.label }}</span>
            <span class="wrapup-val" :class="item.val > 0 ? 'positive' : item.val < 0 ? 'negative' : ''">
              {{ item.val > 0 ? '+' : '' }}{{ item.val }}
            </span>
          </div>
        </div>
        <button class="wrapup-btn" @click="confirmEndFreeTalk">结束对话</button>
      </div>

      <div v-else class="freetalk-input-area">
        <div v-if="showOptions && playerOptions.length" class="option-buttons">
          <button v-for="(opt, i) in playerOptions" :key="i"
                  class="option-btn" :class="'option-' + opt.type"
                  @click="sendMessage(opt.text)">
            <span v-if="opt.type === 'spicy'" class="option-icon">✦</span>
            <span v-if="opt.type === 'warm'" class="option-icon">♡</span>
            {{ opt.text }}
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
import { getRelationshipStage } from '../data/relationshipRules.js'
import { getRevisitDialogue, matchRevisitCondition } from '../data/revisitDialogues.js'

const engine = inject('engine')
const audio = inject('audio')
const live2dRef = inject('live2d', null)
const llm = useLLMManager()

const messages = ref([])
const inputText = ref('')
const showOptions = ref(true)
const playerOptions = ref([])
const currentTurn = ref(0)
const messagesRef = ref(null)
const lastNpcLine = ref('')
const wrapUpMode = ref(false)
const farewellLine = ref('')
const sessionSummary = ref([])

const charId = computed(() => engine.freeTalkData.value?.character)
const charName = computed(() => characters[charId.value]?.name || '???')
const charColor = computed(() => characters[charId.value]?.color || '#999')
const maxTurns = computed(() => engine.freeTalkData.value?.maxTurns || 5)
const freeTalkMode = computed(() => engine.freeTalkData.value?.mode || 'free')

let _initSessionId = 0
let _isInitializing = false

watch(() => engine.isFreeTalk.value, async (val) => {
  if (!val || _isInitializing) return
  _isInitializing = true
  const sessionId = ++_initSessionId

  try {
    messages.value = []
    currentTurn.value = 0
    inputText.value = ''
    lastNpcLine.value = ''
    wrapUpMode.value = false
    llm.loadApiKey()

    const firstLine = await resolveFirstLine()
    if (sessionId !== _initSessionId) return

    messages.value = [{
      role: 'assistant',
      text: firstLine.text,
      expression: firstLine.expression,
      action: firstLine.action,
    }]
    lastNpcLine.value = firstLine.text

    if (firstLine.expression && engine.visibleCharacters[charId.value]) {
      engine.visibleCharacters[charId.value].expression = firstLine.expression
    }

    if (firstLine.microAction && engine.visibleCharacters[charId.value]) {
      engine.visibleCharacters[charId.value].microAction = firstLine.microAction
      setTimeout(() => {
        if (engine.visibleCharacters[charId.value]?.microAction === firstLine.microAction) {
          engine.visibleCharacters[charId.value].microAction = null
        }
      }, 1200)
    }

    await loadOptions()
  } finally {
    _isInitializing = false
  }
})

async function resolveFirstLine() {
  const state = getGameState()
  const cid = charId.value

  const conditionKey = matchRevisitCondition(cid, state)
  if (conditionKey) {
    const preset = getRevisitDialogue(cid, conditionKey)
    if (preset) return preset
  }

  const visitCount = engine.visitLog[cid]?.totalVisits || 0
  if (visitCount > 1 && llm.apiKey.value && !llm.offlineMode.value) {
    const dynamic = await llm.generateRevisitGreeting(cid, state)
    if (dynamic && dynamic.text) return dynamic
  }

  return llm.getFallbackDialogue(cid, state)
}

function getGameState() {
  const state = {
    playerName: engine.playerName.value,
    affection: { ...engine.affection },
    relationship: JSON.parse(JSON.stringify(engine.relationship)),
    flags: { ...engine.flags },
    currentChapter: engine.currentChapter.value,
    currentTimeSlot: engine.currentTimeSlot.value,
    currentBg: engine.currentBg.value,
    conversationHistory: engine.conversationHistory,
    freeTalkSummaries: engine.freeTalkSummaries,
    memories: engine.memories,
    freeTalkData: engine.freeTalkData.value,
    _lastNpcLine: lastNpcLine.value,
  }

  if (engine.persistentMemory) {
    state._persistentMemoryCard = engine.persistentMemory.buildMemoryPromptCard()
  }
  if (engine.behaviorProfiler) {
    state._playerInsightCard = engine.behaviorProfiler.buildPlayerInsightCard()
  }
  if (engine.characterAutonomy && charId.value) {
    state._autonomyCard = engine.characterAutonomy.buildAutonomyPromptCard(charId.value, state)
  }
  if (engine.affectiveResonance) {
    state._emotionCard = engine.affectiveResonance.buildEmotionPromptCard()
  }

  if (engine.spacedRepetition && charId.value) {
    const dueItems = engine.spacedRepetition.getDueReviews(engine.currentChapter.value)
    if (dueItems.length > 0) {
      state._srsCard = engine.spacedRepetition.buildSRSPromptCard(charId.value, dueItems)
    }
  }

  if (engine.worldVM) {
    state._worldStateCard = engine.worldVM.buildWorldPromptCard()
  }
  if (engine.cognitiveGraph) {
    state._cognitiveCard = engine.cognitiveGraph.buildCognitivePromptCard(charId.value)
  }
  if (engine.temporalCodeDB) {
    state._temporalCodeCard = engine.temporalCodeDB.buildTemporalPromptCard(charId.value)
  }
  if (engine.symbioticCodeDNA) {
    state._symbioticDNACard = engine.symbioticCodeDNA.buildSymbioticPromptCard(charId.value)
  }
  if (engine.realityBridge) {
    state._realityBridgeCard = engine.realityBridge.buildRealityPromptCard()
  }
  if (engine.pedagogyKernel) {
    state._pedagogyCard = engine.pedagogyKernel.buildPedagogyPromptCard({
      chapter: engine.currentChapter.value,
      location: engine.currentBg.value,
      character: charId.value,
      timeSlot: engine.currentTimeSlot.value,
    })
  }

  return state
}

async function loadOptions() {
  const context = engine.freeTalkData.value?.context || ''
  playerOptions.value = await llm.generatePlayerOptions(charId.value, getGameState(), context)
}

function formatRelDelta(aff, trust, comfort) {
  const parts = []
  if (aff > 0) parts.push(`好感+${aff}`)
  else if (aff < 0) parts.push(`好感${aff}`)
  if (trust > 0) parts.push(`信任+${trust}`)
  else if (trust < 0) parts.push(`信任${trust}`)
  if (comfort > 0) parts.push(`安心+${comfort}`)
  else if (comfort < 0) parts.push(`安心${comfort}`)
  return parts.length ? parts.join(' ') : null
}

async function sendMessage(text) {
  if (!text || !text.trim() || llm.isGenerating.value) return

  audio.playSfx('click')
  const playerMsg = text.trim()
  inputText.value = ''

  messages.value.push({ role: 'user', text: playerMsg })
  currentTurn.value++

  engine.conversationHistory[charId.value].push({ role: 'user', content: playerMsg })

  if (engine.behaviorProfiler) {
    engine.behaviorProfiler.onFreeTalkMessage(playerMsg)
  }
  if (engine.affectiveResonance) {
    engine.affectiveResonance.onFreeTalkSentiment(playerMsg)
    engine.affectiveResonance.onPlayerActivity('typing_active')
  }
  if (engine.characterAutonomy) {
    engine.characterAutonomy.onInteraction(charId.value)
  }

  await nextTick()
  scrollToBottom()

  const response = await llm.generateCharacterDialogue(charId.value, playerMsg, getGameState())

  const relSummary = formatRelDelta(response.affectionDelta, response.trustDelta, response.comfortDelta)

  messages.value.push({
    role: 'assistant',
    text: response.text,
    expression: response.expression,
    action: response.action,
    affectionDelta: response.affectionDelta || 0,
    trustDelta: response.trustDelta || 0,
    comfortDelta: response.comfortDelta || 0,
    relationshipSummary: relSummary,
    topicTags: response.topic_tags || [],
  })
  lastNpcLine.value = response.text

  engine.conversationHistory[charId.value].push({ role: 'assistant', content: response.text })

  if (response.expression && engine.visibleCharacters[charId.value]) {
    engine.visibleCharacters[charId.value].expression = response.expression
  }

  if (live2dRef && response.live2d_hints) {
    live2dRef.applyLLMHints(charId.value, response.live2d_hints)
  } else if (live2dRef && response.expression) {
    live2dRef.setExpression(charId.value, response.expression)
    live2dRef.startSpeaking(charId.value, response.text || '')
  }

  const deltas = {
    affection: response.affectionDelta || 0,
    trust: response.trustDelta || 0,
    comfort: response.comfortDelta || 0,
  }
  const hasChange = deltas.affection !== 0 || deltas.trust !== 0 || deltas.comfort !== 0
  if (hasChange) {
    engine.applyRelationshipDelta(charId.value, deltas)
    const netChange = Math.round((deltas.affection + deltas.trust + deltas.comfort) / 3)
    if (netChange !== 0) {
      engine.showAffectionToast(charId.value, netChange, true)
    }
  }

  if (engine.persistentMemory && response.memoryCandidate && response.memoryCandidate.trim()) {
    const rel = engine.relationship[charId.value]
    const avg = rel ? Math.round((rel.affection + rel.trust + rel.comfort) / 3) : 0
    if (avg >= 30 || response.memoryEmotion === 'romantic') {
      engine.persistentMemory.recordPeakMoment(charId.value, {
        text: response.memoryCandidate,
        emotion: response.memoryEmotion || 'warm',
        affection: avg,
        chapter: engine.currentChapter?.value || '',
      })
    }
  }

  if (response.memoryCandidate && response.memoryCandidate.trim()) {
    const mem = engine.memories[charId.value]
    if (mem) {
      const bgId = engine.currentBg?.value || ''
      const stage = getRelationshipStage(
        engine.relationship[charId.value] || { affection: 0, trust: 0, comfort: 0 }
      )
      mem.push({
        id: `mem_${charId.value}_${Date.now()}`,
        text: response.memoryCandidate.trim(),
        context: `自由对话`,
        chapter: engine.currentChapter?.value || '',
        timestamp: Date.now(),
        emotion: response.memoryEmotion || 'warm',
        relStageAtTime: stage,
        source: 'free_talk',
      })
      if (mem.length > 20) mem.splice(0, mem.length - 20)
    }
  }

  await nextTick()
  scrollToBottom()

  if (currentTurn.value >= maxTurns.value) {
    beginWrapUp()
    return
  }

  await loadOptions()
}

const FAREWELL_LINES = {
  nene: '「今天和你聊天很开心，期待下次再见哦。」',
  yoshino: '「……行了，该去做正事了。」',
  ayase: '「下次再来切磋吧，我会更强的！」',
  kanna: '「……嗯，下次见。」',
  murasame: '「有趣的对话，期待你的进步。」',
}

function beginWrapUp() {
  const cid = charId.value
  farewellLine.value = FAREWELL_LINES[cid] || '「那就先这样吧。」'

  const totals = { affection: 0, trust: 0, comfort: 0 }
  messages.value
    .filter(m => m.role === 'assistant')
    .forEach(m => {
      totals.affection += (m.affectionDelta || 0)
      totals.trust += (m.trustDelta || 0)
      totals.comfort += (m.comfortDelta || 0)
    })

  const summary = []
  if (totals.affection !== 0) summary.push({ label: '好感', val: totals.affection })
  if (totals.trust !== 0) summary.push({ label: '信任', val: totals.trust })
  if (totals.comfort !== 0) summary.push({ label: '安心', val: totals.comfort })
  sessionSummary.value = summary

  wrapUpMode.value = true
}

function endFreeTalk() {
  beginWrapUp()
}

function confirmEndFreeTalk() {
  saveSessionSummary()
  wrapUpMode.value = false
  engine.resolveFreeTalk(null)
}

function saveSessionSummary() {
  const cid = charId.value
  if (!cid || messages.value.length < 2) return

  const playerMsgs = messages.value.filter(m => m.role === 'user').map(m => m.text)
  const npcMsgs = messages.value.filter(m => m.role === 'assistant').map(m => m.text)

  const topics = []
  const topicTags = messages.value
    .filter(m => m.role === 'assistant' && m.topicTags)
    .flatMap(m => m.topicTags)
  if (topicTags.length > 0) {
    topics.push(...[...new Set(topicTags)].slice(0, 4))
  }

  const playerSample = playerMsgs.slice(0, 3).map(t => t.slice(0, 30)).join('；')
  const npcSample = npcMsgs.slice(0, 2).map(t => t.slice(0, 40)).join('；')

  const summary = {
    chapter: engine.currentChapter.value,
    timeSlot: engine.currentTimeSlot.value,
    promptId: engine.freeTalkData.value?.promptId || null,
    topics,
    playerSaid: playerSample,
    npcSaid: npcSample,
    turns: currentTurn.value,
    timestamp: Date.now(),
  }

  if (!engine.freeTalkSummaries[cid]) engine.freeTalkSummaries[cid] = []
  engine.freeTalkSummaries[cid].push(summary)
  if (engine.freeTalkSummaries[cid].length > 8) {
    engine.freeTalkSummaries[cid] = engine.freeTalkSummaries[cid].slice(-8)
  }
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

.mode-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
}

.mode-tag.semi {
  color: #5a7a55;
  background: rgba(114, 200, 114, 0.12);
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

.msg-rel-delta {
  font-size: 11px;
  color: #8a7a6a;
  margin-top: 4px;
  padding-left: 4px;
  opacity: 0.7;
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
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.option-icon {
  font-size: 11px;
  opacity: 0.7;
}

.option-safe {
  border-color: rgba(160, 170, 180, 0.35);
}
.option-safe:hover {
  border-color: rgba(160, 170, 180, 0.6);
  background: rgba(240, 245, 250, 0.6);
}

.option-warm {
  border-color: rgba(232, 160, 191, 0.35);
  color: #7a4a5a;
}
.option-warm:hover {
  border-color: rgba(232, 160, 191, 0.65);
  background: rgba(255, 230, 240, 0.4);
}

.option-spicy {
  border-color: rgba(255, 170, 80, 0.35);
  color: #8a5a2a;
}
.option-spicy:hover {
  border-color: rgba(255, 170, 80, 0.65);
  background: rgba(255, 240, 220, 0.4);
}

.option-btn:hover {
  transform: translateY(-1px);
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

.freetalk-wrapup {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-top: 1px solid rgba(216, 177, 110, 0.2);
}

.wrapup-farewell {
  text-align: center;
}

.wrapup-line {
  font-size: 16px;
  font-style: italic;
  line-height: 1.6;
}

.wrapup-summary {
  display: flex;
  gap: 20px;
  padding: 10px 0;
}

.wrapup-delta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.wrapup-label {
  font-size: 11px;
  color: var(--vn-text-dim);
}

.wrapup-val {
  font-size: 18px;
  font-weight: 700;
}

.wrapup-val.positive { color: #5a8a5a; }
.wrapup-val.negative { color: #a05555; }

.wrapup-btn {
  padding: 10px 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(224, 145, 171, 0.92), rgba(198, 154, 78, 0.92));
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.wrapup-btn:hover {
  filter: brightness(1.08);
}

.panel-slide-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.panel-slide-leave-active { transition: all 0.3s ease; }
.panel-slide-enter-from { transform: translateY(100%); opacity: 0; }
.panel-slide-leave-to { transform: translateY(100%); opacity: 0; }
</style>
