<template>
  <transition name="pp-slide">
    <div v-if="isOpen" class="pair-programming" @click.stop>
      <div class="pp-header">
        <div class="pp-title">
          <span class="pp-icon">👩‍💻</span>
          <span>Pair Programming</span>
          <span class="pp-partner" :style="{ color: partnerColor }">with {{ partnerName }}</span>
        </div>
        <div class="pp-controls">
          <button class="pp-btn" @click="requestHint" :disabled="hintCooldown > 0" title="请求提示">
            💡{{ hintCooldown > 0 ? ` ${hintCooldown}s` : '' }}
          </button>
          <button class="pp-btn" @click="requestReview" :disabled="!code.trim()" title="代码审查">🔍 Review</button>
          <button class="pp-btn close" @click="$emit('close')">✕</button>
        </div>
      </div>

      <div class="pp-body">
        <div class="pp-editor-pane">
          <div class="pp-editor-toolbar">
            <span class="pp-file-tab">main.py</span>
            <button class="pp-run-btn" @click="runCode" :disabled="isRunning">
              {{ isRunning ? '⏳ 运行中...' : '▶ 运行' }}
            </button>
            <button class="pp-clear-btn" @click="code = ''; output = ''">🗑</button>
          </div>
          <textarea
            ref="editorRef"
            v-model="code"
            class="pp-code-editor"
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            placeholder="# 在这里写代码，你的搭档会实时陪伴你……"
            @keydown="handleKeydown"
            @input="onCodeChange"
          />
          <div v-if="output" class="pp-output">
            <div class="pp-output-header">输出</div>
            <pre class="pp-output-text" :class="{ 'pp-error': hasError }">{{ output }}</pre>
          </div>
        </div>

        <div class="pp-chat-pane">
          <div class="pp-chat-messages" ref="chatRef">
            <div v-for="(msg, i) in chatMessages" :key="i" class="pp-msg" :class="'pp-msg-' + msg.role">
              <div v-if="msg.role === 'partner'" class="pp-msg-avatar" :style="{ borderColor: partnerColor }">
                {{ partnerName[0] }}
              </div>
              <div class="pp-msg-bubble" :class="{ 'pp-system': msg.role === 'system' }">
                <span v-if="msg.role === 'partner'" class="pp-msg-name" :style="{ color: partnerColor }">{{ partnerName }}</span>
                {{ msg.text }}
              </div>
            </div>
            <div v-if="isThinking" class="pp-msg pp-msg-partner">
              <div class="pp-msg-avatar" :style="{ borderColor: partnerColor }">{{ partnerName[0] }}</div>
              <div class="pp-msg-bubble pp-thinking">
                <span class="dot-pulse">思考中</span>
                <span class="dots"><span>.</span><span>.</span><span>.</span></span>
              </div>
            </div>
          </div>

          <div class="pp-suggestion-bar" v-if="suggestions.length">
            <button v-for="(s, i) in suggestions" :key="i" class="pp-suggestion" @click="applySuggestion(s)">
              {{ s.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, inject, computed, watch, nextTick, onMounted } from 'vue'
import { characters } from '../data/characters.js'
import { useLLMManager } from '../engine/LLMManager.js'

defineProps({ isOpen: Boolean })
defineEmits(['close'])

const engine = inject('engine')
const audio = inject('audio')
const llm = useLLMManager()

const code = ref('')
const output = ref('')
const hasError = ref(false)
const isRunning = ref(false)
const isThinking = ref(false)
const hintCooldown = ref(0)
const chatMessages = ref([])
const suggestions = ref([])
const editorRef = ref(null)
const chatRef = ref(null)

let _codeChangeTimer = null
let _hintTimer = null

const currentPartner = computed(() => {
  const bg = engine?.currentBg?.value || ''
  if (bg.includes('library')) return 'kanna'
  if (bg.includes('classroom')) return 'yoshino'
  if (bg.includes('rooftop')) return 'ayase'
  if (bg.includes('computer_room') && bg.includes('night')) return 'murasame'
  if (bg.includes('computer_room')) return 'nene'
  return 'nene'
})

const partnerName = computed(() => characters[currentPartner.value]?.name || currentPartner.value)
const partnerColor = computed(() => characters[currentPartner.value]?.color || '#ccc')

function addMessage(role, text) {
  chatMessages.value.push({ role, text, time: Date.now() })
  if (chatMessages.value.length > 100) chatMessages.value.splice(0, chatMessages.value.length - 80)
  nextTick(() => {
    if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
  })
}

onMounted(() => {
  addMessage('system', `Pair Programming 模式已启动。${partnerName.value} 将作为你的编程搭档。`)
  addMessage('partner', getGreeting())
})

function getGreeting() {
  const greetings = {
    nene: '来一起写代码吧～有什么不懂的随时问我哦！',
    yoshino: '……代码写好了给我看。我会指出所有问题。',
    ayase: '哈！来吧来吧！看谁先写完！',
    kanna: '……嗯。一起写。',
    murasame: '别浪费时间。开始吧。',
  }
  return greetings[currentPartner.value] || '开始吧。'
}

function onCodeChange() {
  if (_codeChangeTimer) clearTimeout(_codeChangeTimer)
  _codeChangeTimer = setTimeout(() => {
    if (code.value.trim().length > 10) {
      checkForReaction()
    }
  }, 3000)
}

function checkForReaction() {
  const c = code.value
  if (/SyntaxError|IndentationError/.test(output.value) && hasError.value) {
    const reactions = {
      nene: '嗯……这里有个小错误呢。别着急，我们慢慢看～',
      yoshino: '语法错误。第一步：检查缩进。第二步：检查括号。',
      ayase: '哈？这都能写错？……开玩笑的啦，我也经常犯这个错',
      kanna: '……indent。',
      murasame: '基础不牢。回去重写。',
    }
    addMessage('partner', reactions[currentPartner.value] || '这里有个错误。')
    return
  }

  if (/def\s+\w+/.test(c) && !chatMessages.value.some(m => m.text.includes('函数'))) {
    const reactions = {
      nene: '哇，你开始写函数了！函数就像一个小魔法盒子，放进去材料就能变出结果～',
      yoshino: '函数定义。注意命名规范和文档字符串。',
      ayase: '函数！不错嘛，开始用高级技术了！',
      kanna: '……抽象。很好。',
      murasame: '函数写对了。但要想想——它的职责单一吗？',
    }
    addMessage('partner', reactions[currentPartner.value])
  } else if (/for\s+\w+\s+in/.test(c) && !chatMessages.value.some(m => m.text.includes('循环'))) {
    const reactions = {
      nene: '循环！就像每天的日常——重复但每次都有小变化呢。',
      yoshino: '循环结构。确保终止条件正确。',
      ayase: '循环！来看看能跑多快！',
      kanna: '……迭代。',
      murasame: '循环。别写成死循环就行。',
    }
    addMessage('partner', reactions[currentPartner.value])
  }
}

async function runCode() {
  if (!code.value.trim() || isRunning.value) return
  isRunning.value = true
  output.value = ''
  hasError.value = false

  try {
    if (engine?.worldVM?.isReady?.value) {
      const result = await engine.worldVM.executeWorldCode(code.value, { timeout: 10000 })
      output.value = result.stdout || ''
      if (result.stderr) {
        output.value += (output.value ? '\n' : '') + result.stderr
        hasError.value = true
      }
      if (result.success && !hasError.value) {
        const reactions = {
          nene: '运行成功了！太棒了！✨',
          yoshino: '通过。',
          ayase: '成功！速度还行嘛！',
          kanna: '……嗯。✓',
          murasame: '过了。',
        }
        addMessage('partner', reactions[currentPartner.value])
        audio?.playSfx?.('correct')
      }
    } else {
      output.value = '[WorldVM 尚未初始化，请在游戏中进入场景后使用]'
      hasError.value = true
    }
  } catch (e) {
    output.value = `Error: ${e.message}`
    hasError.value = true
  }
  isRunning.value = false
}

async function requestHint() {
  if (hintCooldown.value > 0) return
  isThinking.value = true

  hintCooldown.value = 15
  _hintTimer = setInterval(() => {
    hintCooldown.value--
    if (hintCooldown.value <= 0) clearInterval(_hintTimer)
  }, 1000)

  const charData = characters[currentPartner.value]
  const prompt = `你是${charData?.name}，正在和学生一起做 pair programming。
学生当前的代码：
\`\`\`python
${code.value || '(还没写代码)'}
\`\`\`
${output.value ? `运行结果：${output.value}` : ''}
请根据你的性格给一个简短的编程提示（2-3句话）。${charData?.llmStyle?.tone ? `语气：${charData.llmStyle.tone}` : ''}`

  try {
    const response = await llm.chat([{ role: 'user', content: prompt }], { maxTokens: 150 })
    if (response) addMessage('partner', response)
    else addMessage('partner', '嗯……让我想想。试试把问题分解成更小的步骤？')
  } catch {
    addMessage('partner', '嗯……让我想想。试试把问题分解成更小的步骤？')
  }
  isThinking.value = false
}

async function requestReview() {
  if (!code.value.trim()) return
  isThinking.value = true
  const charData = characters[currentPartner.value]
  const prompt = `你是${charData?.name}，正在审查学生的 Python 代码。
代码：
\`\`\`python
${code.value}
\`\`\`
${output.value ? `运行结果：${output.value}` : ''}
请用你的性格进行简短的代码审查（3-4句话），指出优点和可改进的地方。${charData?.llmStyle?.tone ? `语气：${charData.llmStyle.tone}` : ''}`

  try {
    const response = await llm.chat([{ role: 'user', content: prompt }], { maxTokens: 200 })
    if (response) addMessage('partner', response)
    else addMessage('partner', '代码看起来还行。继续加油。')
  } catch {
    addMessage('partner', '代码看起来还行。继续加油。')
  }
  isThinking.value = false
}

function applySuggestion(s) {
  code.value += '\n' + s.code
  suggestions.value = []
}

function handleKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const el = editorRef.value
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    code.value = code.value.substring(0, start) + '    ' + code.value.substring(end)
    nextTick(() => { el.selectionStart = el.selectionEnd = start + 4 })
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    runCode()
  }
}
</script>

<style scoped>
.pair-programming {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(10, 8, 20, 0.97);
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans SC', sans-serif;
}

.pp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(30, 20, 50, 0.9);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.pp-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #e0d6f0;
}
.pp-icon { font-size: 18px; }
.pp-partner { font-weight: 600; }

.pp-controls { display: flex; gap: 8px; }
.pp-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #c0b8d8;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.pp-btn:hover:not(:disabled) { background: rgba(255,255,255,0.12); color: #fff; }
.pp-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pp-btn.close { background: rgba(255,60,60,0.15); border-color: rgba(255,60,60,0.2); }
.pp-btn.close:hover { background: rgba(255,60,60,0.3); }

.pp-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.pp-editor-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.06);
}

.pp-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(20, 15, 35, 0.8);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.pp-file-tab {
  background: rgba(255,255,255,0.08);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #a89cc8;
  font-family: 'Fira Code', monospace;
}
.pp-run-btn {
  margin-left: auto;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.4);
  color: #81C784;
  padding: 5px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.pp-run-btn:hover:not(:disabled) { background: rgba(76, 175, 80, 0.35); }
.pp-run-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.pp-clear-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  color: #888;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
}

.pp-code-editor {
  flex: 1;
  background: rgba(15, 12, 28, 0.9);
  color: #E0D6F0;
  border: none;
  padding: 16px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  tab-size: 4;
}
.pp-code-editor::placeholder { color: rgba(160, 140, 200, 0.3); }

.pp-output {
  border-top: 1px solid rgba(255,255,255,0.06);
  max-height: 180px;
  overflow-y: auto;
}
.pp-output-header {
  padding: 6px 12px;
  font-size: 11px;
  color: #888;
  background: rgba(20, 15, 35, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.pp-output-text {
  margin: 0;
  padding: 10px 16px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  color: #A5D6A7;
  white-space: pre-wrap;
  word-break: break-word;
}
.pp-error { color: #EF9A9A; }

.pp-chat-pane {
  width: 360px;
  display: flex;
  flex-direction: column;
  background: rgba(18, 14, 30, 0.8);
}

.pp-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pp-msg {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.pp-msg-partner { flex-direction: row; }
.pp-msg-system { justify-content: center; }

.pp-msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #fff;
  background: rgba(255,255,255,0.05);
  flex-shrink: 0;
}

.pp-msg-bubble {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 13px;
  color: #d0c8e8;
  line-height: 1.5;
  max-width: 280px;
}
.pp-msg-bubble.pp-system {
  background: rgba(100, 80, 180, 0.1);
  border: 1px solid rgba(100, 80, 180, 0.15);
  font-size: 11px;
  color: #a89cc8;
  text-align: center;
  max-width: 100%;
}
.pp-msg-name {
  display: block;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 2px;
}

.pp-thinking .dot-pulse { color: #a89cc8; }
.pp-thinking .dots span {
  animation: dotBlink 1.4s infinite;
  font-size: 18px;
  color: #a89cc8;
}
.pp-thinking .dots span:nth-child(2) { animation-delay: 0.2s; }
.pp-thinking .dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotBlink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }

.pp-suggestion-bar {
  padding: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.pp-suggestion {
  background: rgba(100, 80, 180, 0.15);
  border: 1px solid rgba(100, 80, 180, 0.25);
  color: #c4b5fd;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.pp-suggestion:hover { background: rgba(100, 80, 180, 0.3); }

.pp-slide-enter-active, .pp-slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.pp-slide-enter-from, .pp-slide-leave-to { opacity: 0; transform: translateY(20px); }

@media (max-width: 768px) {
  .pp-body { flex-direction: column; }
  .pp-chat-pane { width: 100%; max-height: 250px; border-top: 1px solid rgba(255,255,255,0.06); }
  .pp-editor-pane { border-right: none; }
}
</style>
