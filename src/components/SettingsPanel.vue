<template>
  <transition name="fade">
    <div v-if="visible" class="settings-overlay" @click.self="$emit('close')">
      <div class="settings-box">
        <div class="settings-header">
          <div>
            <span class="panel-kicker">Settings</span>
            <h3>游戏设置</h3>
          </div>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>

        <div class="settings-body">
          <div class="setting-row">
            <label>文字速度</label>
            <div class="setting-control">
              <input type="range" min="10" max="80" :value="engine.textSpeed.value" @input="e => engine.textSpeed.value = +e.target.value" />
              <span class="setting-val">{{ engine.textSpeed.value }}ms</span>
            </div>
          </div>

          <div class="setting-row">
            <label>自动播放延迟</label>
            <div class="setting-control">
              <input type="range" min="500" max="5000" step="250" :value="engine.autoPlayDelay.value" @input="e => engine.autoPlayDelay.value = +e.target.value" />
              <span class="setting-val">{{ (engine.autoPlayDelay.value / 1000).toFixed(1) }}s</span>
            </div>
          </div>

          <div class="setting-row">
            <label>字体大小</label>
            <div class="setting-control chips">
              <button
                v-for="size in fontSizes"
                :key="size.id"
                class="size-btn"
                :class="{ active: engine.fontSize.value === size.id }"
                @click="setFontSize(size.id)"
              >
                {{ size.label }}
              </button>
            </div>
          </div>
          <div class="font-preview" :style="{ fontSize: fontPreviewSize }">
            「今日のコードは、昨日より美しく。」—— 预览文字
          </div>

          <div class="setting-row">
            <label>画质等级</label>
            <div class="setting-control chips">
              <button
                v-for="q in qualityLevels"
                :key="q.id"
                class="size-btn"
                :class="{ active: graphicsQuality === q.id }"
                @click="setGraphicsQuality(q.id)"
              >
                {{ q.label }}
              </button>
            </div>
          </div>

          <div class="setting-row">
            <label>自动播放</label>
            <button class="toggle-btn" :class="{ on: engine.autoPlay.value }" @click="engine.autoPlay.value = !engine.autoPlay.value">
              {{ engine.autoPlay.value ? '开启' : '关闭' }}
            </button>
          </div>

          <div class="setting-section">角色关系</div>
          <div class="affection-grid">
            <div v-for="(rel, key) in engine.relationship" :key="key" class="aff-item">
              <div class="aff-name-group">
                <span class="aff-name" :style="{ color: charColor(key) }">{{ charName(key) }}</span>
                <span class="aff-stage-badge">{{ charStage(key) }}</span>
              </div>
              <div class="aff-bars-3d">
                <div class="aff-bar-row">
                  <span class="aff-dim-label">好感</span>
                  <div class="aff-bar"><div class="aff-fill" :style="{ width: Math.min(rel.affection, 100) + '%', background: charColor(key) }"></div></div>
                  <span class="aff-val">{{ rel.affection }}</span>
                </div>
                <div class="aff-bar-row">
                  <span class="aff-dim-label">信任</span>
                  <div class="aff-bar"><div class="aff-fill" :style="{ width: Math.min(rel.trust, 100) + '%', background: charColor(key), opacity: 0.7 }"></div></div>
                  <span class="aff-val">{{ rel.trust }}</span>
                </div>
                <div class="aff-bar-row">
                  <span class="aff-dim-label">安心</span>
                  <div class="aff-bar"><div class="aff-fill" :style="{ width: Math.min(rel.comfort, 100) + '%', background: charColor(key), opacity: 0.5 }"></div></div>
                  <span class="aff-val">{{ rel.comfort }}</span>
                </div>
              </div>
              <div class="stage-progress">
                <div class="stage-track">
                  <span v-for="stage in stageOrder" :key="stage"
                    class="stage-dot"
                    :class="{ reached: stageOrder.indexOf(charStage(key)) >= stageOrder.indexOf(stage) }"
                    :style="{ borderColor: stageOrder.indexOf(charStage(key)) >= stageOrder.indexOf(stage) ? charColor(key) : undefined,
                              background: stageOrder.indexOf(charStage(key)) >= stageOrder.indexOf(stage) ? charColor(key) : undefined }"
                    :title="stage"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-section">音量设置</div>
          <div class="setting-row">
            <label>主音量</label>
            <div class="setting-control">
              <input type="range" min="0" max="100" :value="audio.masterVol.value * 100" @input="e => audio.setMasterVolume(e.target.value / 100)" />
              <span class="setting-val">{{ Math.round(audio.masterVol.value * 100) }}%</span>
            </div>
          </div>

          <div class="setting-row">
            <label>BGM 音量</label>
            <div class="setting-control">
              <input type="range" min="0" max="100" :value="audio.bgmVolume.value * 100" @input="e => { audio.bgmVolume.value = e.target.value / 100; audio.setBgmVolume(e.target.value / 100) }" />
              <span class="setting-val">{{ Math.round(audio.bgmVolume.value * 100) }}%</span>
            </div>
          </div>

          <div class="setting-row">
            <label>音效音量</label>
            <div class="setting-control">
              <input type="range" min="0" max="100" :value="audio.sfxVolume.value * 100" @input="e => { audio.sfxVolume.value = e.target.value / 100; audio.setSfxVolume(e.target.value / 100) }" />
              <span class="setting-val">{{ Math.round(audio.sfxVolume.value * 100) }}%</span>
            </div>
          </div>

          <div class="setting-section">AI 对话设置</div>
          <p class="llm-hint">配置任意 OpenAI 兼容 API 以启用自由对话功能（DeepSeek / OpenAI / Claude / 通义千问 / 本地 Ollama 等均可）。无 API Key 时将使用预设对话，不影响主线体验。</p>

          <div class="setting-row">
            <label>API Key</label>
            <div class="setting-control">
              <input
                :type="showApiKey ? 'text' : 'password'"
                class="llm-input"
                :value="llm.apiKey.value"
                placeholder="sk-... 你的 API 密钥"
                @change="e => llm.setApiKey(e.target.value)"
              />
              <button class="eye-btn" @click="showApiKey = !showApiKey">{{ showApiKey ? '隐' : '显' }}</button>
            </div>
          </div>

          <div class="setting-row">
            <label>API 端点</label>
            <div class="setting-control">
              <input
                type="text"
                class="llm-input"
                :value="llm.baseUrl.value"
                placeholder="https://api.deepseek.com"
                @change="e => llm.setBaseUrl(e.target.value)"
              />
            </div>
          </div>
          <p class="llm-hint endpoint-examples">常用端点：MiniMax <code>https://api.minimaxi.com/v1</code> · DeepSeek <code>https://api.deepseek.com</code> · OpenAI <code>https://api.openai.com</code> · 通义千问 <code>https://dashscope.aliyuncs.com/compatible-mode</code> · 本地 Ollama <code>http://localhost:11434</code></p>

          <div class="setting-row">
            <label>模型名称</label>
            <div class="setting-control">
              <input
                type="text"
                class="llm-input"
                :value="llm.model.value"
                placeholder="deepseek-chat / gpt-4o / qwen-turbo ..."
                @change="e => llm.setModel(e.target.value)"
              />
            </div>
          </div>

          <div class="setting-row">
            <label>连线测试</label>
            <div class="setting-control">
              <button class="test-btn" :disabled="testingConnection" @click="runTestConnection">
                {{ testingConnection ? '测试中...' : '测试连线' }}
              </button>
              <span v-if="connectionResult" class="test-result" :class="connectionResult.ok ? 'ok' : 'fail'">
                {{ connectionResult.ok ? `连线成功 (${connectionResult.latency}ms)` : connectionResult.error }}
              </span>
            </div>
          </div>

          <div v-if="llm.offlineMode.value" class="offline-badge">离线模式 — 使用预设对话</div>

          <div class="setting-section">AI 意识系统</div>
          <p class="llm-hint">六重意识栈为角色赋予跨存档记忆、心理洞察、自主行为等能力。</p>

          <div class="setting-row">
            <label>情感共鸣</label>
            <button class="toggle-btn" :class="{ on: affectiveEnabled }" @click="toggleAffective">
              {{ affectiveEnabled ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint">开启后角色将根据你的互动模式感应情绪，调整对话语气和场景氛围。</p>

          <div class="setting-row">
            <label>行为画像</label>
            <div class="setting-control">
              <span v-if="profileConfidence > 0" class="test-result ok">
                置信度 {{ Math.round(profileConfidence * 100) }}%
              </span>
              <span v-else class="test-result">尚未收集足够数据</span>
            </div>
          </div>

          <div class="setting-row">
            <label>跨周目记忆</label>
            <div class="setting-control">
              <span class="test-result ok" v-if="playthroughCount > 1">
                第 {{ playthroughCount }} 周目
              </span>
              <span class="test-result" v-else>首次游玩</span>
            </div>
          </div>

          <div class="setting-section">沉浸式体验</div>
          <p class="llm-hint">以下功能需要桌面端 (Electron) 或特定硬件支持。</p>

          <div class="setting-row">
            <label>本地 AI 模式</label>
            <button class="toggle-btn" :class="{ on: localModeOn }" @click="toggleLocalMode" :disabled="!isElectron">
              {{ !isElectron ? '仅桌面端' : localModeOn ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint" v-if="isElectron">使用本地 Ollama 运行 LLM 角色对话，完全离线。需要先安装 <code>Ollama</code> 并下载模型。</p>

          <div class="setting-row" v-if="localModeOn">
            <label>本地模型</label>
            <div class="setting-control">
              <input type="text" class="llm-input" :value="llm.localModel.value" placeholder="qwen2.5:7b-instruct-q4_K_M" @change="e => llm.setLocalModel(e.target.value)" />
            </div>
          </div>

          <div class="setting-row" v-if="localModeOn">
            <label>本地 LLM 状态</label>
            <div class="setting-control">
              <span class="test-result" :class="llm.localStatus.value === 'connected' ? 'ok' : 'fail'">
                {{ localStatusText }}
              </span>
              <button class="test-btn" @click="checkLocalLLM">检测</button>
            </div>
          </div>

          <div class="setting-row">
            <label>语音合成</label>
            <button class="toggle-btn" :class="{ on: voiceEnabled }" @click="toggleVoice" :disabled="!isElectron">
              {{ !isElectron ? '仅桌面端' : voiceEnabled ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint" v-if="isElectron">为角色台词实时生成中文语音。需要本地 TTS 服务运行。</p>

          <div class="setting-row" v-if="voiceEnabled">
            <label>语音音量</label>
            <div class="setting-control">
              <input type="range" min="0" max="100" :value="voiceVolume * 100" @input="e => setVoiceVolume(e.target.value / 100)" />
              <span class="setting-val">{{ Math.round(voiceVolume * 100) }}%</span>
            </div>
          </div>

          <div class="setting-row" v-if="voiceEnabled">
            <label>自动朗读</label>
            <button class="toggle-btn" :class="{ on: voiceAutoSpeak }" @click="toggleAutoSpeak">
              {{ voiceAutoSpeak ? '开启' : '关闭' }}
            </button>
          </div>

          <div class="setting-row">
            <label>表情追踪</label>
            <button class="toggle-btn" :class="{ on: faceTrackOn }" @click="toggleFaceTracking">
              {{ faceTrackOn ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint">通过摄像头检测你的表情，角色会做出相应反应。所有数据仅在本地处理。</p>

          <div class="setting-row" v-if="faceTrackOn">
            <label>追踪状态</label>
            <div class="setting-control">
              <span class="test-result" :class="faceTrackStatus">
                {{ faceTrackStatusText }}
              </span>
            </div>
          </div>

          <div class="setting-row">
            <label>WebGPU 粒子</label>
            <button class="toggle-btn" :class="{ on: particlesOn }" @click="toggleParticles">
              {{ particlesOn ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint">GPU 加速的万级粒子效果（樱花、萤火虫、代码雨等）。需要 WebGPU 支持。</p>

          <div class="setting-row">
            <label>后处理特效</label>
            <button class="toggle-btn" :class="{ on: postFXOn }" @click="togglePostFX">
              {{ postFXOn ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint">电影级视觉效果（景深、光晕、色彩分级、暗角等）。</p>

          <div class="setting-row" v-if="isElectron">
            <label>桌宠模式</label>
            <button class="toggle-btn" :class="{ on: deskpetOn }" @click="toggleDeskpet">
              {{ deskpetOn ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint" v-if="isElectron">角色会出现在你的桌面上，独立于游戏窗口运行。</p>

          <div class="setting-row" v-if="isElectron && deskpetOn">
            <label>桌宠角色</label>
            <div class="setting-control chips">
              <button v-for="(name, id) in deskpetCharacters" :key="id" class="size-btn" :class="{ active: deskpetChar === id }" @click="setDeskpetCharacter(id)">
                {{ name }}
              </button>
            </div>
          </div>

          <div class="setting-row">
            <label>动态天气</label>
            <button class="toggle-btn" :class="{ on: weatherOn }" @click="toggleWeather">
              {{ weatherOn ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint">场景天气会根据剧情情绪动态变化（雨天/雪天/夕阳/雾天等）。</p>

          <div class="setting-row">
            <label>角色光环</label>
            <button class="toggle-btn" :class="{ on: auraOn }" @click="toggleAura">
              {{ auraOn ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint">角色根据情绪和好感度发出动态光环效果。</p>

          <div class="setting-row">
            <label>性能监视器</label>
            <button class="toggle-btn" :class="{ on: profilerOn }" @click="toggleProfiler">
              {{ profilerOn ? '开启' : '关闭' }}
            </button>
          </div>
          <p class="llm-hint">实时显示 FPS、各子系统耗时和优化建议。</p>

          <div class="setting-section">显示</div>
          <div class="setting-row">
            <label>全屏模式</label>
            <button class="toggle-btn" :class="{ on: isFullscreen }" @click="toggleFullscreen">
              {{ isFullscreen ? '退出全屏' : '进入全屏' }}
            </button>
          </div>

          <div class="setting-section">游戏操作</div>
          <div class="action-row">
            <button class="action-btn danger" @click="confirmTitle">回到标题</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'

import { characters } from '../data/characters.js'
import { useLLMManager } from '../engine/LLMManager.js'
import { getRelationshipStage, relationshipStages } from '../data/relationshipRules.js'

defineProps({ visible: Boolean })
const emit = defineEmits(['close', 'title'])

function confirmTitle() {
  if (confirm('确定要返回标题画面吗？未保存的进度将丢失。')) emit('title')
}

const engine = inject('engine')
const audio = inject('audio')
const llm = useLLMManager()

const isFullscreen = ref(!!document.fullscreenElement)

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen?.()
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => document.addEventListener('fullscreenchange', onFullscreenChange))
onUnmounted(() => document.removeEventListener('fullscreenchange', onFullscreenChange))

const showApiKey = ref(false)
const testingConnection = ref(false)
const connectionResult = ref(null)

const affectiveEnabled = computed(() => engine.affectiveResonance?.enabled?.value ?? false)
const profileConfidence = computed(() => engine.behaviorProfiler?.confidence?.value ?? 0)
const playthroughCount = computed(() => engine.persistentMemory?.soul?.playthroughCount ?? 1)

function toggleAffective() {
  if (engine.affectiveResonance) {
    if (engine.affectiveResonance.enabled.value) {
      engine.affectiveResonance.disable()
    } else {
      engine.affectiveResonance.enable()
    }
  }
}

const isElectron = typeof window !== 'undefined' && !!window.electronAPI

const localModeOn = computed(() => llm.localMode?.value ?? false)
const localStatusText = computed(() => {
  const st = llm.localStatus?.value
  if (st === 'connected') return '已连接'
  if (st === 'no-models') return '已连接但无模型'
  return '未连接'
})

function toggleLocalMode() {
  if (!isElectron) return
  llm.setLocalMode?.(!llm.localMode.value)
}

async function checkLocalLLM() {
  await llm.checkLocalAvailability?.()
}

const immersive = computed(() => engine.immersiveBridge || null)
const voiceSynth = computed(() => immersive.value?.voiceSynth || null)
const faceTracker = computed(() => immersive.value?.faceTracker || null)
const particleEngine = computed(() => immersive.value?.particles || null)
const postFXEngine = computed(() => immersive.value?.postFX || null)

const voiceEnabled = computed(() => voiceSynth.value?.enabled?.value ?? false)
const voiceVolume = computed(() => voiceSynth.value?.volume?.value ?? 0.8)
const voiceAutoSpeak = computed(() => voiceSynth.value?.autoSpeak?.value ?? true)

function toggleVoice() {
  if (!isElectron || !voiceSynth.value) return
  voiceSynth.value.setEnabled(!voiceSynth.value.enabled.value)
}

function setVoiceVolume(val) {
  voiceSynth.value?.setVolume(val)
}

function toggleAutoSpeak() {
  voiceSynth.value?.setAutoSpeak(!voiceSynth.value.autoSpeak.value)
}

const faceTrackOn = computed(() => faceTracker.value?.isTracking?.value ?? false)
const faceTrackStatus = computed(() => faceTrackOn.value ? 'ok' : '')
const faceTrackStatusText = computed(() => {
  if (faceTracker.value?.isTracking?.value) {
    const emotion = faceTracker.value.playerEmotion?.value || 'neutral'
    return `追踪中 — 当前表情: ${emotion}`
  }
  return '未启动'
})

async function toggleFaceTracking() {
  if (!faceTracker.value) return
  if (faceTracker.value.isTracking.value) {
    faceTracker.value.stop()
  } else {
    await faceTracker.value.initialize()
    await faceTracker.value.start()
  }
}

const IMMERSIVE_KEY = 'alethicode_immersive_settings'
const particlesOn = ref(false)
const postFXOn = ref(true)
const deskpetOn = ref(false)
const deskpetChar = ref('nene')

try {
  const saved = JSON.parse(localStorage.getItem(IMMERSIVE_KEY) || '{}')
  if (typeof saved.particles === 'boolean') particlesOn.value = saved.particles
  if (typeof saved.postFX === 'boolean') postFXOn.value = saved.postFX
  if (typeof saved.deskpet === 'boolean') deskpetOn.value = saved.deskpet
  if (typeof saved.deskpetChar === 'string') deskpetChar.value = saved.deskpetChar
} catch {}

function _saveImmersiveSettings() {
  try {
    localStorage.setItem(IMMERSIVE_KEY, JSON.stringify({
      particles: particlesOn.value,
      postFX: postFXOn.value,
      deskpet: deskpetOn.value,
      deskpetChar: deskpetChar.value,
    }))
  } catch {}
}

function toggleParticles() {
  particlesOn.value = !particlesOn.value
  if (!particlesOn.value) particleEngine.value?.stopEffect?.()
  _saveImmersiveSettings()
}

function togglePostFX() {
  postFXOn.value = !postFXOn.value
  postFXEngine.value?.enableColorGrading?.(postFXOn.value)
  _saveImmersiveSettings()
}

async function toggleDeskpet() {
  if (!isElectron) return
  deskpetOn.value = !deskpetOn.value
  if (deskpetOn.value) {
    await window.electronAPI.invoke('deskpet:spawn', { characterId: deskpetChar.value })
  } else {
    await window.electronAPI.invoke('deskpet:despawn')
  }
  _saveImmersiveSettings()
}

const deskpetCharacters = { nene: '寧々', yoshino: '芳乃', ayase: 'あやせ', kanna: '栞那', murasame: 'ムラサメ' }

const weatherEngine = computed(() => immersive.value?.weather || null)
const auraEngine = computed(() => immersive.value?.aura || null)
const profilerEngine = computed(() => immersive.value?.profiler || null)

const weatherOn = computed(() => weatherEngine.value?.weatherConfig?.enabled ?? false)
const auraOn = computed(() => auraEngine.value?.enabled?.value ?? true)
const profilerOn = computed(() => profilerEngine.value?.isProfilerVisible?.value ?? false)

function toggleWeather() {
  if (weatherEngine.value) {
    weatherEngine.value.weatherConfig.enabled = !weatherEngine.value.weatherConfig.enabled
  }
}

function toggleAura() {
  auraEngine.value?.setEnabled?.(!auraEngine.value.enabled.value)
}

function toggleProfiler() {
  if (!profilerEngine.value) return
  profilerEngine.value.toggleVisibility()
  if (profilerEngine.value.isProfilerVisible.value) {
    profilerEngine.value.startProfiling()
  } else {
    profilerEngine.value.stopProfiling()
  }
}

async function setDeskpetCharacter(id) {
  deskpetChar.value = id
  if (isElectron && deskpetOn.value) {
    await window.electronAPI.invoke('deskpet:set-character', { characterId: id })
  }
  _saveImmersiveSettings()
}

const fontSizes = [
  { id: 'small', label: '小' },
  { id: 'medium', label: '中' },
  { id: 'large', label: '大' },
]

const qualityLevels = [
  { id: 'low', label: '流畅' },
  { id: 'medium', label: '普通' },
  { id: 'high', label: '极致' },
]

const QUALITY_KEY = 'alethicode_graphics_quality'
const graphicsQuality = ref(localStorage.getItem(QUALITY_KEY) || 'medium')

function setGraphicsQuality(level) {
  graphicsQuality.value = level
  localStorage.setItem(QUALITY_KEY, level)
  document.documentElement.dataset.quality = level
  window.dispatchEvent(new CustomEvent('quality-change', { detail: { quality: level } }))
}

const stageOrder = ['初识', '熟悉', '亲近', '暧昧', '恋慕']

function charColor(id) {
  return characters[id]?.color || '#999'
}

function charName(id) {
  return characters[id]?.nameShort || id
}

function charStage(id) {
  const rel = engine.relationship[id]
  if (!rel) return '初识'
  return getRelationshipStage(rel)
}

function stageProgress(id) {
  const rel = engine.relationship[id]
  if (!rel) return 0
  const avg = (rel.affection + rel.trust + rel.comfort) / 3
  return Math.min(Math.round(avg), 100)
}

const fontSizeMap = { small: '14px', medium: '17px', large: '22px' }

const fontPreviewSize = ref(fontSizeMap[engine.fontSize.value] || '17px')

function setFontSize(sizeId) {
  engine.fontSize.value = sizeId
  const px = fontSizeMap[sizeId] || '17px'
  fontPreviewSize.value = px
  document.documentElement.style.setProperty('--vn-dialogue-font-size', px)
}

async function runTestConnection() {
  testingConnection.value = true
  connectionResult.value = null
  connectionResult.value = await llm.testConnection()
  testingConnection.value = false
}
</script>

<style scoped>
.settings-overlay {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  contain: layout style paint;
  justify-content: center;
  padding: 24px;
  background: rgba(33, 22, 15, 0.42);
  backdrop-filter: blur(10px);
}

.settings-box {
  width: min(760px, 100%);
  max-height: 84vh;
  overflow-y: auto;
  border-radius: 30px;
  border: 1px solid rgba(219, 182, 123, 0.38);
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.95), rgba(255, 244, 234, 0.9));
  box-shadow: 0 30px 80px rgba(49, 30, 12, 0.22);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 26px 18px;
  border-bottom: 1px solid rgba(222, 190, 139, 0.22);
}

.panel-kicker {
  display: block;
  margin-bottom: 8px;
  color: var(--vn-gold);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.settings-header h3 {
  font-family: var(--vn-font-title);
  font-size: 30px;
  color: var(--vn-text);
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(224, 199, 160, 0.58);
  background: rgba(255, 255, 255, 0.7);
  color: var(--vn-text-dim);
}

.settings-body {
  padding: 18px 26px 24px;
}

.setting-section {
  margin-top: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(209, 170, 108, 0.16);
  color: var(--vn-gold);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.setting-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: 18px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(209, 170, 108, 0.1);
}

.setting-row label {
  color: var(--vn-text);
  font-size: 14px;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-control input[type='range'] {
  flex: 1;
  accent-color: var(--vn-primary);
}

.setting-control.chips {
  flex-wrap: wrap;
}

.setting-val {
  min-width: 50px;
  color: var(--vn-text-dim);
  font-size: 12px;
  text-align: right;
}

.size-btn,
.toggle-btn {
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid rgba(216, 177, 110, 0.22);
  background: rgba(255, 255, 255, 0.7);
  color: var(--vn-text-dim);
  font-size: 12px;
}

.size-btn.active,
.toggle-btn.on {
  color: var(--vn-primary-dark);
  border-color: rgba(220, 140, 166, 0.28);
  background: rgba(247, 221, 230, 0.78);
}

.affection-grid {
  padding-top: 12px;
}

.aff-item {
  display: grid;
  grid-template-columns: 86px 1fr;
  align-items: start;
  gap: 8px;
  padding: 10px 0;
}

.aff-name-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.aff-name {
  font-size: 13px;
  font-weight: 600;
}

.aff-stage-badge {
  font-size: 10px;
  color: var(--vn-text-dim);
  opacity: 0.7;
}

.stage-progress {
  grid-column: 1 / -1;
  padding: 4px 0 2px;
}

.stage-track {
  display: flex;
  align-items: center;
  gap: 0;
  justify-content: space-between;
  position: relative;
  padding: 0 4px;
}

.stage-track::before {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  top: 50%;
  height: 2px;
  background: rgba(216, 177, 110, 0.15);
  transform: translateY(-50%);
}

.stage-dot {
  position: relative;
  z-index: 1;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid rgba(216, 177, 110, 0.2);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.stage-dot.reached {
  transform: scale(1.15);
}

.aff-bar {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(216, 177, 110, 0.12);
}

.aff-fill {
  height: 100%;
  border-radius: 999px;
}

.aff-val {
  color: var(--vn-text-dim);
  font-size: 11px;
  text-align: right;
  min-width: 24px;
}

.aff-bars-3d {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.aff-bar-row {
  display: grid;
  grid-template-columns: 28px 1fr 24px;
  align-items: center;
  gap: 6px;
}

.aff-dim-label {
  font-size: 10px;
  color: var(--vn-text-dim);
  opacity: 0.7;
}

.action-row {
  padding-top: 16px;
}

.action-btn {
  min-width: 180px;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 13px;
}

.action-btn.danger {
  background: rgba(214, 112, 112, 0.1);
  border: 1px solid rgba(214, 112, 112, 0.24);
  color: #b45d5d;
}

.font-preview {
  margin: 8px 0 4px;
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(40, 28, 18, 0.78);
  color: rgba(255, 252, 245, 0.95);
  line-height: 2.0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  transition: font-size 0.2s ease;
}

.llm-hint {
  padding: 8px 0 4px;
  color: var(--vn-text-dim);
  font-size: 12px;
  line-height: 1.6;
}

.llm-hint.endpoint-examples {
  padding: 2px 0 6px;
  font-size: 11px;
  line-height: 1.8;
}

.llm-hint code {
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(216, 177, 110, 0.12);
  font-family: var(--vn-font-code);
  font-size: 10.5px;
}

.llm-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(216, 177, 110, 0.24);
  background: rgba(255, 255, 255, 0.78);
  color: var(--vn-text);
  font-size: 13px;
  font-family: var(--vn-font-code);
}

.llm-input:focus {
  border-color: var(--vn-primary);
}

.eye-btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(216, 177, 110, 0.22);
  background: rgba(255, 255, 255, 0.6);
  color: var(--vn-text-dim);
  font-size: 11px;
  flex-shrink: 0;
}

.test-btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid rgba(216, 177, 110, 0.26);
  background: rgba(255, 255, 255, 0.72);
  color: var(--vn-text);
  font-size: 12px;
  flex-shrink: 0;
}

.test-btn:disabled {
  opacity: 0.5;
}

.test-result {
  font-size: 12px;
  flex-shrink: 0;
}

.test-result.ok {
  color: var(--vn-green);
}

.test-result.fail {
  color: var(--vn-red);
}

.offline-badge {
  margin-top: 10px;
  padding: 8px 14px;
  border-radius: 8px;
  background: rgba(200, 114, 114, 0.1);
  border: 1px solid rgba(200, 114, 114, 0.2);
  color: #a05555;
  font-size: 12px;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .settings-overlay {
    padding: 12px;
  }

  .settings-header,
  .settings-body {
    padding-left: 16px;
    padding-right: 16px;
  }

  .setting-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
