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
            <label>自动播放</label>
            <button class="toggle-btn" :class="{ on: engine.autoPlay.value }" @click="engine.autoPlay.value = !engine.autoPlay.value">
              {{ engine.autoPlay.value ? '开启' : '关闭' }}
            </button>
          </div>

          <div class="setting-section">角色好感度</div>
          <div class="affection-grid">
            <div v-for="(val, key) in engine.affection" :key="key" class="aff-item">
              <span class="aff-name" :style="{ color: charColor(key) }">{{ charName(key) }}</span>
              <div class="aff-bar">
                <div class="aff-fill" :style="{ width: Math.min(val, 100) + '%', background: charColor(key) }"></div>
              </div>
              <span class="aff-val">{{ val }}</span>
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
          <p class="llm-hint endpoint-examples">常用端点：DeepSeek <code>https://api.deepseek.com</code> · OpenAI <code>https://api.openai.com</code> · 通义千问 <code>https://dashscope.aliyuncs.com/compatible-mode</code> · 本地 Ollama <code>http://localhost:11434</code></p>

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
import { inject, ref, onMounted, onUnmounted } from 'vue'
import { characters } from '../data/characters.js'
import { useLLMManager } from '../engine/LLMManager.js'

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

const fontSizes = [
  { id: 'small', label: '小' },
  { id: 'medium', label: '中' },
  { id: 'large', label: '大' },
]

function charColor(id) {
  return characters[id]?.color || '#999'
}

function charName(id) {
  return characters[id]?.nameShort || id
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
  grid-template-columns: 86px 1fr 32px;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.aff-name {
  font-size: 13px;
  font-weight: 600;
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
  font-size: 12px;
  text-align: right;
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
