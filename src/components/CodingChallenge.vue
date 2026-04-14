<template>
  <transition name="challenge-slide">
    <div v-if="engine.isChallenge.value && challenge" class="challenge-overlay" @click.stop>
      <div class="challenge-panel">
        <div class="challenge-header">
          <span class="challenge-icon">{{ isCompetition ? '⚔' : isWorldChallenge ? '⚡' : isDynamicChallenge ? '🎯' : '📝' }}</span>
          <h3 class="challenge-title">{{ isCompetition ? competitionTitle : isWorldChallenge ? ('World Challenge · ' + (challenge.title || 'Unknown')) : ('编程挑战 · ' + (activeChallenge?.title || challenge.title || challenge.id)) }}</h3>
          <span v-if="(activeChallenge || challenge).difficulty" class="difficulty">
            {{ '★'.repeat((activeChallenge || challenge).difficulty || 1) }}{{ '☆'.repeat(Math.max(0, 4 - ((activeChallenge || challenge).difficulty || 1))) }}
          </span>
        </div>

        <div v-if="isCompetition" class="competition-bar">
          <div class="comp-opponent">
            <span class="comp-dot" :style="{ background: opponentColor }"></span>
            <span class="comp-opponent-name">VS {{ opponentName }}</span>
          </div>
          <span class="comp-round">Round {{ currentCompRound + 1 }} / {{ totalCompRounds }}</span>
          <div class="comp-scores">
            <span>你 {{ compScores.player }}</span>
            <span>—</span>
            <span>{{ opponentName }} {{ compScores.opponent }}</span>
          </div>
        </div>

        <div v-if="contextBefore && !answered" class="context-dialogue">
          <span class="ctx-speaker" :style="{ color: contextSpeakerColor }">
            {{ contextSpeakerName }}
          </span>
          <span class="ctx-text">{{ contextBefore.text }}</span>
        </div>

        <div class="challenge-question">{{ challenge.question || challenge.description }}</div>

        <div v-if="codeDisplay" class="code-block">
          <pre><code v-html="highlightPython(codeDisplay)"></code></pre>
        </div>

        <!-- 选择题 -->
        <div v-if="challengeType === 'multiple_choice' || challengeType === 'choice'" class="options-area">
          <button v-for="(opt, i) in displayOptions" :key="i"
                  class="option-btn"
                  :class="{
                    selected: selectedOption === i,
                    correct: answered && isCorrectOption(i),
                    wrong: answered && selectedOption === i && !isCorrectOption(i)
                  }"
                  :disabled="answered"
                  @click="selectOption(i)">
            <span class="option-letter">{{ ['A','B','C','D'][i] }}</span>
            <span class="option-text">{{ typeof opt === 'string' ? opt : opt.text }}</span>
          </button>
        </div>

        <!-- 填空题 -->
        <div v-if="challengeType === 'fill_blank' || challengeType === 'fill'" class="fill-area">
          <div class="fill-code">
            <template v-for="(part, i) in codeParts" :key="i">
              <span v-if="part !== '___BLANK___'" class="code-part">{{ part }}</span>
              <input v-else v-model="fillAnswer" class="fill-input"
                     :class="{ correct: answered && fillCorrect, wrong: answered && !fillCorrect }"
                     placeholder="在此输入"
                     :disabled="answered"
                     @keydown.enter="submitFill" />
            </template>
          </div>
        </div>

        <!-- 排序题 -->
        <div v-if="challengeType === 'code_order' || challengeType === 'sort'" class="sort-area">
          <div class="sort-lines">
            <div v-for="(line, i) in sortedLines" :key="line.id || i"
                 class="sort-line"
                 :class="{ 'drag-over': dragOverIndex === i }"
                 draggable="true"
                 @dragstart="dragStart(i)"
                 @dragover.prevent="dragOver(i)"
                 @dragend="dragEnd"
                 @drop="drop(i)"
                 @touchstart.passive="touchDragStart(i, $event)"
                 @touchmove.prevent="touchDragMove(i, $event)"
                 @touchend="touchDragEnd(i)">
              <span class="sort-handle">⠿</span>
              <span class="sort-number">{{ i + 1 }}</span>
              <code class="sort-code">{{ typeof line === 'string' ? line : line.text }}</code>
              <div class="sort-buttons">
                <button v-if="i > 0" class="sort-btn" @click="moveUp(i)" :disabled="answered">↑</button>
                <button v-if="i < sortedLines.length - 1" class="sort-btn" @click="moveDown(i)" :disabled="answered">↓</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 教学反转 teach_back -->
        <div v-if="challengeType === 'teach_back'" class="teach-back-area">
          <div class="teach-prompt">
            <span class="teach-char-name" :style="{ color: teachCharColor }">{{ teachCharName }}</span>
            <span class="teach-ask">{{ challenge.prompt_text }}</span>
          </div>
          <textarea v-model="teachBackText"
                    class="teach-textarea"
                    :placeholder="`用你自己的话解释「${challenge.concept}」（至少 ${challenge.evaluation_rubric?.min_length || 20} 字）`"
                    :disabled="answered"
                    rows="5"></textarea>
          <div class="teach-counter">{{ teachBackText.length }} 字</div>
        </div>

        <!-- 配对调试 pair_debug -->
        <div v-if="challengeType === 'pair_debug'" class="pair-debug-area">
          <div class="debug-setup">
            <span class="teach-char-name" :style="{ color: teachCharColor }">{{ teachCharName }}</span>
            <span class="debug-dialogue">{{ challenge.setup_dialogue }}</span>
          </div>
          <div class="code-block">
            <pre><code v-html="highlightPython(challenge.buggy_code)"></code></pre>
          </div>
          <textarea v-model="pairDebugText"
                    class="teach-textarea"
                    placeholder="分析这段代码的问题，并说说怎么修复……"
                    :disabled="answered"
                    rows="4"></textarea>
        </div>

        <!-- 创意编程 creative_code -->
        <div v-if="challengeType === 'creative_code'" class="creative-code-area">
          <div class="creative-prompt">{{ challenge.prompt }}</div>
          <div class="creative-split">
            <div class="creative-editor">
              <div class="creative-editor-header">代码编辑器</div>
              <textarea v-model="creativeCode"
                        class="creative-textarea"
                        :disabled="answered"
                        spellcheck="false"
                        rows="10"></textarea>
            </div>
            <div class="creative-preview">
              <div class="creative-preview-header">
                运行结果
                <button v-if="!answered" class="run-btn" @click="runCreativeCode" :disabled="creativeRunning">
                  {{ creativeRunning ? '⏳ 运行中...' : '▶ 运行' }}
                </button>
              </div>
              <pre class="creative-output">{{ creativeOutput || '（点击运行查看输出）' }}</pre>
            </div>
          </div>
        </div>

        <!-- LLM 评估中 -->
        <div v-if="llmEvaluating" class="llm-evaluating">
          <div class="eval-spinner"></div>
          <span>{{ teachCharName }}正在思考……</span>
        </div>

        <!-- LLM 反馈（替代传统结果区） -->
        <div v-if="answered && llmFeedback" class="llm-feedback-area">
          <div class="llm-feedback-header" :class="isCorrect ? 'success' : 'needs-work'">
            {{ isCorrect ? '✨ ' : '💭 ' }}{{ isCorrect ? '很好！' : '还可以更好' }}
          </div>
          <div class="llm-feedback-body">
            <span class="teach-char-name" :style="{ color: teachCharColor }">{{ teachCharName }}</span>
            <span class="llm-feedback-text">{{ llmFeedback.feedback_text }}</span>
          </div>
          <div v-if="llmFeedback.clarity !== undefined" class="llm-scores">
            <span class="score-tag">清晰 {{ llmFeedback.clarity }}/5</span>
            <span class="score-tag">准确 {{ llmFeedback.accuracy }}/5</span>
            <span class="score-tag">共情 {{ llmFeedback.empathy }}/5</span>
          </div>
          <div v-if="llmFeedback.technical_score !== undefined" class="llm-scores">
            <span class="score-tag">技术 {{ llmFeedback.technical_score }}/5</span>
            <span class="score-tag">语气 {{ llmFeedback.tone_score }}/5</span>
            <span v-if="llmFeedback.found_bug !== undefined" class="score-tag" :class="llmFeedback.found_bug ? 'tag-ok' : 'tag-miss'">{{ llmFeedback.found_bug ? '✓ 找到Bug' : '✗ 未找到' }}</span>
          </div>
          <div v-if="llmFeedback.elegance !== undefined" class="llm-scores">
            <span class="score-tag">优雅 {{ llmFeedback.elegance }}/5</span>
            <span class="score-tag">创意 {{ llmFeedback.creativity }}/5</span>
            <span class="score-tag" :class="llmFeedback.runs ? 'tag-ok' : 'tag-miss'">{{ llmFeedback.runs ? '✓ 运行成功' : '✗ 运行失败' }}</span>
          </div>
        </div>

        <div v-if="showConfetti" class="confetti-container">
          <span v-for="i in 30" :key="'c'+i" class="confetti-piece" :style="confettiStyle(i)"></span>
        </div>

        <div v-if="answered" class="result-area">
          <div class="result-text" :class="isCorrect ? 'success' : 'fail'">
            {{ isCorrect ? '✨ 正确！' : '❌ 再想想...' }}
          </div>
          <p class="explanation">{{ resultExplanation }}</p>

          <div v-if="contextAfter" class="context-dialogue result-context">
            <span class="ctx-speaker" :style="{ color: contextSpeakerColor }">
              {{ contextAfterSpeaker }}
            </span>
            <span class="ctx-text">{{ contextAfter.text }}</span>
          </div>
        </div>

        <div class="challenge-actions">
          <button v-if="!answered && hintsUsed < totalHints" class="hint-btn" @click="useHint">
            💡 提示（剩余 {{ totalHints - hintsUsed }} 次）
          </button>
          <div v-if="currentHint" class="hint-text">💡 {{ currentHint }}</div>

          <button v-if="!answered" class="submit-btn" @click="submitAnswer"
                  :disabled="!canSubmit">
            ✅ 提交答案
          </button>
          <template v-else>
            <button v-if="!isCorrect && canRetry" class="retry-btn" @click="retryChallenge">
              🔄 再试一次（剩余 {{ maxAttempts - attempts }} 次）
            </button>
            <button class="continue-btn" @click="continueGame">
              {{ isCorrect || !canRetry ? '继续 ▶' : '跳过 ▶' }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue'
import { characters } from '../data/characters.js'

const engine = inject('engine')
const audio = inject('audio')

const challenge = computed(() => engine.challengeData.value)
const isCompetition = computed(() => challenge.value?.isCompetition === true)
const isWorldChallenge = computed(() => challenge.value?.isWorldChallenge === true)
const isDynamicChallenge = computed(() => challenge.value?.isDynamic === true)
const isCodeNarrative = computed(() => challenge.value?.isCodeNarrative === true)
const currentCompRound = computed(() => challenge.value?.currentRound || 0)
const totalCompRounds = computed(() => challenge.value?.rounds?.length || 0)
const compScores = computed(() => challenge.value?.scores || { player: 0, opponent: 0 })
const activeRound = computed(() => {
  if (!isCompetition.value) return null
  return challenge.value?.rounds?.[currentCompRound.value] || null
})
const activeChallenge = computed(() => {
  if (!isCompetition.value) return null
  return activeRound.value?.challengeData || null
})
const opponentName = computed(() => {
  const oppId = activeRound.value?.opponent
  return characters[oppId]?.nameShort || oppId || '???'
})
const opponentColor = computed(() => {
  const oppId = activeRound.value?.opponent
  return characters[oppId]?.color || '#999'
})
const competitionTitle = computed(() => challenge.value?.title || '编程竞赛')
const compReaction = ref(null)

const challengeType = computed(() => {
  const src = activeChallenge.value || challenge.value
  const t = src?.type
  if (t === 'multiple_choice' || t === 'choice') return 'multiple_choice'
  if (t === 'fill_blank' || t === 'fill') return 'fill_blank'
  if (t === 'code_order' || t === 'sort') return 'code_order'
  if (t === 'teach_back') return 'teach_back'
  if (t === 'pair_debug') return 'pair_debug'
  if (t === 'creative_code') return 'creative_code'
  return t
})

const selectedOption = ref(-1)
const fillAnswer = ref('')
const sortedLines = ref([])
const showConfetti = ref(false)

const teachBackText = ref('')
const pairDebugText = ref('')
const creativeCode = ref('')
const creativeOutput = ref('')
const creativeRunning = ref(false)
const llmEvaluating = ref(false)
const llmFeedback = ref(null)
const llmExpression = ref('normal')

const llm = inject('llm', null)

function confettiStyle(i) {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#F472B6', '#34D399', '#60A5FA', '#FBBF24']
  return {
    left: (Math.random() * 100) + '%',
    background: colors[i % colors.length],
    animationDelay: (Math.random() * 0.5) + 's',
    animationDuration: (1 + Math.random() * 1.5) + 's',
    width: (4 + Math.random() * 6) + 'px',
    height: (4 + Math.random() * 6) + 'px',
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    transform: `rotate(${Math.random() * 360}deg)`
  }
}
const dragOverIndex = ref(-1)
const draggingIndex = ref(-1)
const answered = ref(false)
const isCorrect = ref(false)
const hintsUsed = ref(0)
const currentHint = ref('')
const attempts = ref(0)
const maxAttempts = 2
const canRetry = computed(() => !isCorrect.value && attempts.value < maxAttempts)

watch(() => engine.isChallenge.value, (val) => {
  if (val && challenge.value) {
    selectedOption.value = -1
    fillAnswer.value = ''
    answered.value = false
    isCorrect.value = false
    hintsUsed.value = 0
    currentHint.value = ''
    attempts.value = 0
    teachBackText.value = ''
    pairDebugText.value = ''
    creativeCode.value = challenge.value?.starter_code || ''
    creativeOutput.value = ''
    creativeRunning.value = false
    llmEvaluating.value = false
    llmFeedback.value = null
    llmExpression.value = 'normal'
    if (challengeType.value === 'code_order') {
      const lines = challenge.value.lines || []
      sortedLines.value = [...lines].sort(() => Math.random() - 0.5)
    }
  }
})

const teachCharColor = computed(() => {
  const charId = challenge.value?.related_character
  return characters[charId]?.color || '#aaa'
})
const teachCharName = computed(() => {
  const charId = challenge.value?.related_character
  return characters[charId]?.nameShort || characters[charId]?.name || charId || ''
})

const codeDisplay = computed(() => {
  const c = activeChallenge.value || challenge.value
  return c?.code_display || c?.code || null
})

function highlightPython(code) {
  if (!code) return ''
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(#[^\n]*)/g, '<span style="color:#6A9955">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span style="color:#CE9178">$1</span>')
    .replace(/\b(def|return|if|elif|else|for|while|in|not|and|or|True|False|None|import|from|class|try|except|print|range|len|int|str|input|set|sorted|sum|max|min|chr|ord)\b/g, '<span style="color:#C586C0">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#B5CEA8">$1</span>')
}

const displayOptions = computed(() => {
  const c = activeChallenge.value || challenge.value
  return c?.options || []
})

const codeParts = computed(() => {
  const template = challenge.value?.codeTemplate || challenge.value?.code_template || ''
  return template.split(/(_____|___BLANK___|\[________\])/).map(p =>
    p === '_____' || p === '___BLANK___' || p === '[________]' ? '___BLANK___' : p
  )
})

const totalHints = computed(() => {
  const hints = challenge.value?.hints
  if (Array.isArray(hints)) return hints.length
  return challenge.value?.hint ? 1 : 0
})

const contextBefore = computed(() => {
  const ctx = challenge.value?.contextDialogue || challenge.value?.context_dialogue
  return ctx?.before || null
})

const contextAfter = computed(() => {
  const ctx = challenge.value?.contextDialogue || challenge.value?.context_dialogue
  return isCorrect.value ? (ctx?.success || null) : (ctx?.fail || null)
})

const contextSpeakerColor = computed(() => {
  const s = contextBefore.value?.speaker
  return characters[s]?.color || '#aaa'
})

const contextSpeakerName = computed(() => {
  const s = contextBefore.value?.speaker
  return characters[s]?.name || s || ''
})

const contextAfterSpeaker = computed(() => {
  const ctx = contextAfter.value
  return characters[ctx?.speaker]?.name || ctx?.speaker || ''
})

const resultExplanation = computed(() => {
  if (isCorrect.value) return challenge.value?.successText || challenge.value?.explanation || '回答正确！'
  return challenge.value?.failText || challenge.value?.explanation || '再仔细想想吧~'
})

const canSubmit = computed(() => {
  if (llmEvaluating.value) return false
  if (challengeType.value === 'multiple_choice') return selectedOption.value >= 0
  if (challengeType.value === 'fill_blank') return fillAnswer.value.trim().length > 0
  if (challengeType.value === 'code_order') return true
  if (challengeType.value === 'teach_back') return teachBackText.value.trim().length >= (challenge.value?.evaluation_rubric?.min_length || 10)
  if (challengeType.value === 'pair_debug') return pairDebugText.value.trim().length >= 5
  if (challengeType.value === 'creative_code') return creativeCode.value.trim().length > 0
  return false
})

const fillCorrect = computed(() => {
  const ans = challenge.value?.answer || challenge.value?.blank_answer || ''
  const alts = challenge.value?.accept_alternatives || []
  const input = fillAnswer.value.trim()
  return input === ans || alts.includes(input)
})

function isCorrectOption(idx) {
  const c = challenge.value
  if (c?.correct !== undefined) return idx === c.correct
  const opts = c?.options || []
  return opts[idx]?.correct === true
}

function selectOption(idx) {
  if (answered.value) return
  selectedOption.value = idx
  audio.playSfx('click')
}

function useHint() {
  const hints = challenge.value?.hints
  if (Array.isArray(hints) && hintsUsed.value < hints.length) {
    currentHint.value = hints[hintsUsed.value]
  } else if (challenge.value?.hint) {
    currentHint.value = challenge.value.hint
  }
  hintsUsed.value++
}

async function submitAnswer() {
  if (!canSubmit.value) return

  attempts.value++

  if (challengeType.value === 'teach_back') {
    await submitTeachBack()
    return
  }
  if (challengeType.value === 'pair_debug') {
    await submitPairDebug()
    return
  }
  if (challengeType.value === 'creative_code') {
    await submitCreativeCode()
    return
  }

  if (challengeType.value === 'multiple_choice') {
    isCorrect.value = isCorrectOption(selectedOption.value)
  } else if (challengeType.value === 'fill_blank') {
    isCorrect.value = fillCorrect.value
  } else if (challengeType.value === 'code_order') {
    isCorrect.value = checkSortOrder()
  }

  answered.value = true
  audio.playSfx(isCorrect.value ? 'correct' : 'wrong')

  if (isCorrect.value) {
    showConfetti.value = true
    setTimeout(() => { showConfetti.value = false }, 2500)
  }
}

function _getGameState() {
  return {
    playerName: engine.playerName?.value || '',
    relationship: JSON.parse(JSON.stringify(engine.relationship)),
    flags: { ...engine.flags },
    currentChapter: engine.currentChapter?.value || '',
    currentTimeSlot: engine.currentTimeSlot?.value || '',
    currentBg: engine.currentBg?.value || '',
    conversationHistory: engine.conversationHistory || {},
    memories: engine.memories || {},
  }
}

async function submitTeachBack() {
  llmEvaluating.value = true
  const ch = challenge.value
  const charId = ch.related_character
  const gs = _getGameState()
  let result
  if (llm?.evaluateTeachBack) {
    result = await llm.evaluateTeachBack(charId, ch.concept, teachBackText.value, ch.evaluation_rubric, gs)
  } else {
    result = { clarity: 3, accuracy: 3, empathy: 3, feedback_text: '嗯，你说的有道理。', expression: 'normal', memory_candidate: '', outcome: 'accurate_teach', success: true }
  }
  llmEvaluating.value = false
  llmFeedback.value = result
  llmExpression.value = result.expression || 'normal'
  isCorrect.value = result.success
  answered.value = true
  audio.playSfx(isCorrect.value ? 'correct' : 'wrong')
  if (isCorrect.value) {
    showConfetti.value = true
    setTimeout(() => { showConfetti.value = false }, 2500)
  }
}

async function submitPairDebug() {
  llmEvaluating.value = true
  const ch = challenge.value
  const charId = ch.related_character
  const gs = _getGameState()
  let result
  if (llm?.evaluatePairDebug) {
    result = await llm.evaluatePairDebug(charId, ch.buggy_code, ch.bug_description, pairDebugText.value, ch.evaluation_rubric, gs)
  } else {
    result = { found_bug: true, technical_score: 3, tone_score: 3, feedback_text: '嗯，你找到了。', expression: 'normal', relationship_hint: '', outcome: 'solo_pass', success: true }
  }
  llmEvaluating.value = false
  llmFeedback.value = result
  llmExpression.value = result.expression || 'normal'
  isCorrect.value = result.success
  answered.value = true
  audio.playSfx(isCorrect.value ? 'correct' : 'wrong')
  if (isCorrect.value) {
    showConfetti.value = true
    setTimeout(() => { showConfetti.value = false }, 2500)
  }
}

async function runCreativeCode() {
  creativeRunning.value = true
  creativeOutput.value = ''
  let execResult = null
  try {
    if (isWorldChallenge.value && engine.worldVM?.isReady?.value) {
      const result = await engine.worldVM.executeWorldCode(creativeCode.value, {
        tier: challenge.value?.tier,
        timeout: 8000,
      })
      creativeOutput.value = result.success
        ? (result.stdout || '(世界状态已更新)')
        : `错误：${result.stderr}`
      execResult = result
    } else {
      if (!window._pyodide) {
        const { usePythonRunner } = await import('../engine/PythonRunner.js')
        window._pyodideRunner = usePythonRunner()
        await window._pyodideRunner.initialize()
      }
      const runner = window._pyodideRunner
      const result = await runner.runCode(creativeCode.value, 5000)
      creativeOutput.value = result.success ? result.stdout : `错误：${result.stderr}`
      execResult = result
    }
  } catch (e) {
    creativeOutput.value = `运行失败：${e.message}`
    execResult = { success: false, stdout: '', stderr: e.message }
  }

  if (engine.narrativeCodeBridge && execResult) {
    engine.narrativeCodeBridge.evaluateCode(creativeCode.value, execResult, {
      chapter: engine.currentChapter?.value,
      character: challenge.value?.related_character,
    })
  }

  creativeRunning.value = false
}

async function submitCreativeCode() {
  if (!creativeOutput.value) {
    await runCreativeCode()
  }
  llmEvaluating.value = true
  const ch = challenge.value
  const charId = ch.related_character
  const gs = _getGameState()
  let result
  if (llm?.evaluateCreativeCode) {
    result = await llm.evaluateCreativeCode(charId, creativeCode.value, creativeOutput.value, ch.evaluation, gs)
  } else {
    const ran = creativeOutput.value && !creativeOutput.value.startsWith('错误') && !creativeOutput.value.startsWith('运行失败')
    result = { runs: ran, elegance: 3, creativity: 3, feedback_text: ran ? '跑起来了！' : '好像有问题……', expression: ran ? 'smile' : 'confused', memory_candidate: '', outcome: ran ? 'assisted_pass' : 'thoughtful_fail', success: ran }
  }
  llmEvaluating.value = false
  llmFeedback.value = result
  llmExpression.value = result.expression || 'normal'
  isCorrect.value = result.success
  answered.value = true
  audio.playSfx(isCorrect.value ? 'correct' : 'wrong')
  if (isCorrect.value) {
    showConfetti.value = true
    setTimeout(() => { showConfetti.value = false }, 2500)
  }
}

function retryChallenge() {
  answered.value = false
  isCorrect.value = false
  selectedOption.value = -1
  fillAnswer.value = ''
  if (challengeType.value === 'code_order') {
    const lines = (activeChallenge.value || challenge.value).lines || []
    sortedLines.value = [...lines].sort(() => Math.random() - 0.5)
  }
}

function submitFill() {
  if (fillAnswer.value.trim()) submitAnswer()
}

function checkSortOrder() {
  const c = challenge.value
  if (c?.correct_order) {
    const original = c.lines || []
    return c.correct_order.every((origIdx, i) => {
      const expectedLine = original[origIdx]
      const actualLine = sortedLines.value[i]
      const expected = typeof expectedLine === 'string' ? expectedLine : expectedLine?.text
      const actual = typeof actualLine === 'string' ? actualLine : actualLine?.text
      return expected === actual
    })
  }
  const lines = sortedLines.value
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (typeof line === 'object' && line.order !== undefined && line.order !== i + 1) return false
  }
  return true
}

function moveUp(i) {
  if (i <= 0 || answered.value) return
  const arr = [...sortedLines.value]
  ;[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
  sortedLines.value = arr
}

function moveDown(i) {
  if (i >= sortedLines.value.length - 1 || answered.value) return
  const arr = [...sortedLines.value]
  ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
  sortedLines.value = arr
}

function dragStart(i) { draggingIndex.value = i }
function dragOver(i) { dragOverIndex.value = i }
function dragEnd() { dragOverIndex.value = -1; draggingIndex.value = -1 }

function drop(i) {
  if (draggingIndex.value < 0 || answered.value) return
  const arr = [...sortedLines.value]
  const [item] = arr.splice(draggingIndex.value, 1)
  arr.splice(i, 0, item)
  sortedLines.value = arr
  dragOverIndex.value = -1
  draggingIndex.value = -1
}

let touchStartIdx = -1
let touchStartY = 0
function touchDragStart(i, e) {
  if (answered.value) return
  touchStartIdx = i
  touchStartY = e.touches[0].clientY
}
function touchDragMove(i, e) {
  if (touchStartIdx < 0) return
  const dy = e.touches[0].clientY - touchStartY
  const lineHeight = 50
  const offset = Math.round(dy / lineHeight)
  if (offset !== 0) {
    const target = Math.max(0, Math.min(sortedLines.value.length - 1, touchStartIdx + offset))
    if (target !== touchStartIdx) {
      const arr = [...sortedLines.value]
      const [item] = arr.splice(touchStartIdx, 1)
      arr.splice(target, 0, item)
      sortedLines.value = arr
      touchStartIdx = target
      touchStartY = e.touches[0].clientY
    }
  }
}
function touchDragEnd() {
  touchStartIdx = -1
}

function continueGame() {
  if (isCompetition.value) {
    const data = challenge.value
    const round = activeRound.value
    if (isCorrect.value) {
      data.scores.player++
      compReaction.value = round?.opponent_reaction_win || null
    } else {
      data.scores.opponent++
      compReaction.value = round?.opponent_reaction_lose || null
    }

    if (currentCompRound.value + 1 < totalCompRounds.value) {
      data.currentRound++
      selectedOption.value = -1
      fillAnswer.value = ''
      answered.value = false
      isCorrect.value = false
      hintsUsed.value = 0
      currentHint.value = ''
      compReaction.value = null
      if (challengeType.value === 'code_order') {
        const lines = (activeChallenge.value || challenge.value).lines || []
        sortedLines.value = [...lines].sort(() => Math.random() - 0.5)
      }
      return
    }

    const finalEffects = data.final_ranking_effects || {}
    const rank = data.scores.player > data.scores.opponent ? 'first'
      : data.scores.player === data.scores.opponent ? 'second' : 'third'
    const effects = finalEffects[rank] || {}
    Object.entries(effects).forEach(([k, v]) => {
      engine.showAffectionToast(k, v)
    })
  }
  const cType = challengeType.value
  const challengeId = (activeChallenge.value || challenge.value)?.id

  const codeForRecording = cType === 'creative_code' ? creativeCode.value
    : cType === 'teach_back' ? teachBackText.value
    : cType === 'pair_debug' ? pairDebugText.value
    : fillAnswer.value || ''

  if (codeForRecording && engine.temporalCodeDB) {
    engine.temporalCodeDB.recordCode(codeForRecording, {
      chapter: engine.currentChapter.value,
      challenge: challengeId,
      character: (activeChallenge.value || challenge.value)?.related_character || '',
      location: engine.currentBg.value,
      challengeType: cType,
    }, {
      success: isCorrect.value,
      output: cType === 'creative_code' ? creativeOutput.value : '',
      attempts: attempts.value,
    })
  }

  if (codeForRecording && engine.symbioticCodeDNA) {
    engine.symbioticCodeDNA.analyzePlayerCode(codeForRecording)
  }

  if (isCodeNarrative.value && engine.resolveCodeNarrative) {
    engine.resolveCodeNarrative(codeForRecording || '', {
      success: isCorrect.value,
      stdout: creativeOutput.value || '',
      stderr: '',
    })
  } else if ((cType === 'teach_back' || cType === 'pair_debug' || cType === 'creative_code') && llmFeedback.value) {
    const fb = llmFeedback.value
    engine.resolveLLMChallenge(challengeId, {
      success: isCorrect.value,
      outcome: fb.outcome,
      memoryText: fb.memory_candidate || fb.feedback_text || '',
      relationshipDelta: null,
    })
  } else {
    engine.resolveChallenge(isCorrect.value, challengeId, {
      hintsUsed: hintsUsed.value,
      totalHints: totalHints.value,
    })
  }
}
</script>

<style scoped>
.challenge-overlay {
  position: absolute;
  inset: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(43, 26, 16, 0.34);
  backdrop-filter: blur(6px);
}

.challenge-panel {
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(255, 251, 247, 0.96), rgba(255, 245, 236, 0.94));
  border: 1px solid rgba(219, 182, 123, 0.44);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 26px 64px rgba(58, 36, 17, 0.22);
}

.challenge-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.challenge-icon { font-size: 24px; }

.challenge-title {
  font-size: 18px;
  color: var(--vn-text);
  font-weight: 600;
  flex: 1;
}

.difficulty {
  color: var(--vn-gold);
  font-size: 14px;
  letter-spacing: 2px;
}

.context-dialogue {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(216, 177, 110, 0.24);
  border-radius: 8px;
  margin-bottom: 16px;
}

.ctx-speaker { font-weight: 600; margin-right: 8px; }
.ctx-text { color: var(--vn-text); font-size: 14px; }

.challenge-question {
  font-size: 16px;
  color: #2d2018;
  font-weight: 500;
  line-height: 1.8;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

.code-block {
  background: rgba(14, 20, 36, 0.98);
  border: 1px solid rgba(150, 177, 219, 0.28);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Fira Code', 'Source Code Pro', monospace;
  font-size: 14px;
  color: #a5d6ff;
  white-space: pre;
  line-height: 1.6;
}

.options-area { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(216, 177, 110, 0.24);
  border-radius: 10px;
  color: var(--vn-text);
  text-align: left;
  transition: all 0.2s;
}

.option-btn:hover:not(:disabled) { border-color: var(--vn-primary); background: rgba(232, 160, 191, 0.08); }
.option-btn.selected { border-color: var(--vn-primary); background: rgba(232, 160, 191, 0.15); }
.option-btn.correct { border-color: var(--vn-green); background: rgba(52, 211, 153, 0.15); }
.option-btn.wrong { border-color: var(--vn-red); background: rgba(248, 113, 113, 0.15); }

.option-letter {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(214, 182, 136, 0.16);
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.option-text { font-size: 14px; font-family: 'Fira Code', monospace; }

.fill-area { margin-bottom: 20px; }

.fill-code {
  background: rgba(14, 20, 36, 0.98);
  border: 1px solid rgba(150, 177, 219, 0.28);
  border-radius: 8px;
  padding: 16px;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  color: #a5d6ff;
  white-space: pre-wrap;
  line-height: 1.8;
}

.fill-input {
  display: inline-block;
  width: 120px;
  padding: 4px 8px;
  background: rgba(255, 208, 224, 0.2);
  border: 1px dashed rgba(238, 152, 183, 0.9);
  border-radius: 4px;
  color: #ffda8d;
  text-shadow: 0 0 12px rgba(255, 212, 122, 0.58);
  font-weight: 700;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  outline: none;
  text-align: center;
  caret-color: #ffd57d;
}

.fill-input.correct { border-color: var(--vn-green); background: rgba(52, 211, 153, 0.2); }
.fill-input.wrong { border-color: var(--vn-red); background: rgba(248, 113, 113, 0.2); }
.fill-input::placeholder { color: rgba(253, 227, 170, 0.62); }
.fill-input:focus {
  box-shadow: 0 0 0 2px rgba(255, 212, 138, 0.32);
}

.sort-area { margin-bottom: 20px; }

.sort-lines { display: flex; flex-direction: column; gap: 6px; }

.sort-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(216, 177, 110, 0.24);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
}

.sort-line:hover { border-color: var(--vn-primary); }
.sort-line.drag-over { border-color: var(--vn-accent); background: rgba(167, 139, 250, 0.1); }
.sort-line:active { cursor: grabbing; }

.sort-handle { color: var(--vn-text-dim); font-size: 16px; cursor: grab; }

.sort-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(214, 182, 136, 0.16);
  border-radius: 50%;
  font-size: 12px;
  color: var(--vn-text-dim);
  flex-shrink: 0;
}

.sort-code {
  flex: 1;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  color: #a5d6ff;
}

.sort-buttons { display: flex; gap: 4px; }

.sort-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  color: var(--vn-text-dim);
  font-size: 12px;
  padding: 0;
}

.sort-btn:hover:not(:disabled) { color: var(--vn-primary); border-color: var(--vn-primary); }

.result-area {
  text-align: center;
  padding: 16px;
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(216, 177, 110, 0.2);
  border-radius: 10px;
  margin-bottom: 16px;
}

.result-text { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.result-text.success { color: var(--vn-green); }
.result-text.fail { color: var(--vn-red); }

.explanation { font-size: 14px; color: #4f4137; line-height: 1.6; }

.result-context { margin-top: 12px; text-align: left; }

.challenge-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.hint-btn {
  padding: 8px 20px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: var(--vn-gold);
  border-radius: 8px;
  font-size: 14px;
}

.hint-text {
  font-size: 13px;
  color: #7a5a1c;
  background: rgba(251, 191, 36, 0.2);
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  border-left: 3px solid var(--vn-gold);
}

.submit-btn {
  padding: 12px 40px;
  background: var(--vn-primary);
  color: var(--vn-bg-dark);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
}

.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.continue-btn {
  padding: 12px 40px;
  background: transparent;
  border: 1px solid var(--vn-primary);
  color: var(--vn-primary);
  border-radius: 10px;
  font-size: 16px;
}

.continue-btn:hover { background: var(--vn-primary); color: var(--vn-bg-dark); }

.retry-btn {
  padding: 12px 40px;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.5);
  color: #8b6914;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
}
.retry-btn:hover { background: rgba(251, 191, 36, 0.3); }

.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 100;
}

.confetti-piece {
  position: absolute;
  top: -10px;
  animation: confetti-fall ease-out forwards;
  opacity: 0.9;
}

@keyframes confetti-fall {
  0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  50% { opacity: 0.8; }
  100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
}

.competition-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(216, 177, 110, 0.2);
  border-radius: 10px;
}

.comp-opponent {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vn-text);
}

.comp-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.comp-round {
  font-size: 12px;
  color: var(--vn-text-dim);
  background: rgba(214, 182, 136, 0.16);
  padding: 2px 10px;
  border-radius: 8px;
}

.comp-scores {
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: var(--vn-text);
  font-weight: 600;
}

/* teach_back */
.teach-back-area, .pair-debug-area { margin-bottom: 20px; }

.teach-prompt, .debug-setup {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(216, 177, 110, 0.24);
  border-radius: 8px;
  margin-bottom: 12px;
  line-height: 1.7;
}

.teach-char-name { font-weight: 700; margin-right: 8px; }
.teach-ask, .debug-dialogue { color: var(--vn-text); font-size: 15px; }

.teach-textarea {
  width: 100%;
  min-height: 100px;
  padding: 14px;
  background: rgba(14, 20, 36, 0.96);
  border: 1px solid rgba(150, 177, 219, 0.28);
  border-radius: 8px;
  color: #e0d6cb;
  font-family: 'Noto Serif SC', serif;
  font-size: 15px;
  line-height: 1.8;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
}
.teach-textarea:focus { border-color: var(--vn-primary); box-shadow: 0 0 0 2px rgba(232, 160, 191, 0.2); }
.teach-textarea:disabled { opacity: 0.6; }

.teach-counter { text-align: right; font-size: 12px; color: var(--vn-text-dim); margin-top: 4px; }

/* creative_code */
.creative-code-area { margin-bottom: 20px; }

.creative-prompt {
  font-size: 15px;
  color: #2d2018;
  line-height: 1.7;
  margin-bottom: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(216, 177, 110, 0.2);
  border-radius: 8px;
}

.creative-split { display: flex; gap: 12px; }
@media (max-width: 600px) { .creative-split { flex-direction: column; } }

.creative-editor, .creative-preview { flex: 1; min-width: 0; }

.creative-editor-header, .creative-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: rgba(14, 20, 36, 0.8);
  border: 1px solid rgba(150, 177, 219, 0.2);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  font-size: 12px;
  color: #8899aa;
  font-family: 'Fira Code', monospace;
}

.creative-textarea {
  width: 100%;
  min-height: 180px;
  padding: 12px;
  background: rgba(14, 20, 36, 0.98);
  border: 1px solid rgba(150, 177, 219, 0.28);
  border-radius: 0 0 8px 8px;
  color: #a5d6ff;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  tab-size: 4;
  box-sizing: border-box;
}
.creative-textarea:focus { border-color: rgba(150, 177, 219, 0.5); }

.creative-output {
  width: 100%;
  min-height: 180px;
  padding: 12px;
  background: rgba(14, 20, 36, 0.98);
  border: 1px solid rgba(150, 177, 219, 0.28);
  border-radius: 0 0 8px 8px;
  color: #34D399;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  overflow-x: auto;
  white-space: pre-wrap;
  box-sizing: border-box;
}

.run-btn {
  padding: 2px 10px;
  background: rgba(52, 211, 153, 0.15);
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #34D399;
  border-radius: 4px;
  font-size: 11px;
  font-family: 'Fira Code', monospace;
}
.run-btn:hover:not(:disabled) { background: rgba(52, 211, 153, 0.3); }
.run-btn:disabled { opacity: 0.5; }

/* LLM evaluating */
.llm-evaluating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: var(--vn-text-dim);
  font-size: 14px;
}

.eval-spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(216, 177, 110, 0.2);
  border-top-color: var(--vn-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* LLM feedback */
.llm-feedback-area {
  padding: 16px;
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(216, 177, 110, 0.2);
  border-radius: 10px;
  margin-bottom: 16px;
}

.llm-feedback-header {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}
.llm-feedback-header.success { color: var(--vn-green); }
.llm-feedback-header.needs-work { color: var(--vn-gold); }

.llm-feedback-body {
  line-height: 1.7;
  margin-bottom: 10px;
}
.llm-feedback-text { color: var(--vn-text); font-size: 15px; }

.llm-scores { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }

.score-tag {
  padding: 3px 10px;
  background: rgba(214, 182, 136, 0.12);
  border: 1px solid rgba(214, 182, 136, 0.2);
  border-radius: 12px;
  font-size: 12px;
  color: var(--vn-text-dim);
  font-family: 'Fira Code', monospace;
}
.score-tag.tag-ok { background: rgba(52, 211, 153, 0.12); border-color: rgba(52, 211, 153, 0.3); color: #34D399; }
.score-tag.tag-miss { background: rgba(248, 113, 113, 0.12); border-color: rgba(248, 113, 113, 0.3); color: #F87171; }

.challenge-slide-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.challenge-slide-leave-active { transition: all 0.3s ease; }
.challenge-slide-enter-from { opacity: 0; transform: scale(0.9); }
.challenge-slide-leave-to { opacity: 0; transform: scale(0.95); }
</style>
