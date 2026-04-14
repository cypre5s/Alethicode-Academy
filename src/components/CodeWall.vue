<template>
  <transition name="wall-fade">
    <div v-if="isOpen" class="code-wall-overlay" @click.self="$emit('close')">
      <div class="code-wall-panel">
        <div class="wall-header">
          <h2 class="wall-title">📋 代码展示墙</h2>
          <div class="wall-actions">
            <button class="wall-btn export-btn" @click="exportCode" :disabled="!hasCode">导出代码片段</button>
            <button class="wall-btn import-btn" @click="showImport = true">导入代码</button>
            <button class="wall-btn close-btn" @click="$emit('close')">✕</button>
          </div>
        </div>

        <div class="wall-body">
          <div v-if="wallPosts.length === 0" class="wall-empty">
            <span class="empty-icon">🧱</span>
            <p>代码墙还是空的。运行一段代码，然后点击「导出」分享给朋友吧！</p>
            <p class="empty-hint">或者点击「导入」粘贴朋友分享的代码片段。</p>
          </div>

          <div class="wall-grid">
            <div v-for="post in wallPosts" :key="post.id" class="wall-card" :style="{ '--accent': post.accent || '#c4b5fd' }">
              <div class="card-header">
                <span class="card-author">{{ post.author || '匿名学员' }}</span>
                <span class="card-date">{{ formatDate(post.timestamp) }}</span>
              </div>
              <pre class="card-code"><code>{{ post.code }}</code></pre>
              <div v-if="post.output" class="card-output">
                <span class="output-label">输出</span>
                <pre>{{ post.output }}</pre>
              </div>
              <div class="card-footer">
                <button class="card-btn" @click="copyCode(post.code)">📋 复制</button>
                <button class="card-btn" @click="runImported(post.code)">▶ 运行</button>
                <button class="card-btn del" @click="removePost(post.id)">🗑</button>
              </div>
            </div>
          </div>
        </div>

        <transition name="modal-fade">
          <div v-if="showImport" class="import-modal" @click.self="showImport = false">
            <div class="import-box">
              <h3>导入代码片段</h3>
              <textarea v-model="importData" class="import-input" placeholder="粘贴从朋友那里复制的代码片段 JSON……" rows="6" />
              <div class="import-actions">
                <button class="wall-btn" @click="doImport">导入</button>
                <button class="wall-btn" @click="showImport = false">取消</button>
              </div>
              <p v-if="importError" class="import-error">{{ importError }}</p>
            </div>
          </div>
        </transition>

        <div v-if="toast" class="wall-toast">{{ toast }}</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, inject, computed } from 'vue'

defineProps({ isOpen: Boolean })
defineEmits(['close'])

const engine = inject('engine')
const WALL_KEY = 'alethicode_code_wall'

const wallPosts = reactive(loadPosts())
const showImport = ref(false)
const importData = ref('')
const importError = ref('')
const toast = ref('')

const hasCode = computed(() => {
  const history = engine?.worldVM?.executionHistory
  return history?.length > 0
})

function loadPosts() {
  try {
    const raw = localStorage.getItem(WALL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePosts() {
  try {
    localStorage.setItem(WALL_KEY, JSON.stringify(wallPosts.slice(0, 50)))
  } catch {}
}

function exportCode() {
  const history = engine?.worldVM?.executionHistory
  if (!history?.length) return
  const last = history[history.length - 1]
  const snippet = {
    v: 1,
    code: last.code,
    output: (last.stdout || '').slice(0, 500),
    author: engine?.playerName?.value || '匿名学员',
    timestamp: Date.now(),
  }
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(snippet))))
  navigator.clipboard?.writeText(`ALETHICODE:${encoded}`).then(() => {
    showToast('代码片段已复制到剪贴板！分享给朋友吧 ✨')
  }).catch(() => {
    showToast('复制失败，请手动复制')
  })

  const post = { id: `local_${Date.now()}`, ...snippet, accent: getRandomAccent() }
  wallPosts.unshift(post)
  savePosts()
}

function doImport() {
  importError.value = ''
  try {
    let raw = importData.value.trim()
    if (raw.startsWith('ALETHICODE:')) raw = raw.slice(11)
    const decoded = JSON.parse(decodeURIComponent(escape(atob(raw))))
    if (!decoded.code) throw new Error('无效的代码片段')
    const post = {
      id: `import_${Date.now()}`,
      code: decoded.code.slice(0, 2000),
      output: (decoded.output || '').slice(0, 500),
      author: (decoded.author || '匿名学员').slice(0, 30),
      timestamp: decoded.timestamp || Date.now(),
      accent: getRandomAccent(),
    }
    wallPosts.unshift(post)
    savePosts()
    showImport.value = false
    importData.value = ''
    showToast('代码片段导入成功！')
  } catch (e) {
    importError.value = '导入失败：格式不正确。请确认粘贴了完整的代码片段。'
  }
}

function removePost(id) {
  const idx = wallPosts.findIndex(p => p.id === id)
  if (idx >= 0) { wallPosts.splice(idx, 1); savePosts() }
}

function copyCode(code) {
  navigator.clipboard?.writeText(code)
  showToast('代码已复制')
}

async function runImported(code) {
  if (engine?.worldVM?.isReady?.value) {
    await engine.worldVM.executeWorldCode(code, { timeout: 8000 })
    showToast('代码已执行')
  }
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

const ACCENTS = ['#c4b5fd', '#F4C2D0', '#FF8C42', '#7BA7C9', '#DC3545', '#66BB6A', '#FFD54F']
function getRandomAccent() { return ACCENTS[Math.floor(Math.random() * ACCENTS.length)] }

let _toastTimer
function showToast(msg) {
  toast.value = msg
  clearTimeout(_toastTimer)
  _toastTimer = setTimeout(() => { toast.value = '' }, 2500)
}
</script>

<style scoped>
.code-wall-overlay { position: fixed; inset: 0; z-index: 130; background: rgba(10,8,20,0.85); display: flex; align-items: center; justify-content: center; }
.code-wall-panel { width: 90vw; max-width: 900px; max-height: 85vh; background: rgba(20,16,35,0.98); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; }
.wall-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.wall-title { font-size: 18px; color: #e0d6f0; margin: 0; }
.wall-actions { display: flex; gap: 8px; }
.wall-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #c0b8d8; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.wall-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
.export-btn { background: rgba(100,80,180,0.15); border-color: rgba(100,80,180,0.3); }
.import-btn { background: rgba(76,175,80,0.12); border-color: rgba(76,175,80,0.25); }
.close-btn { background: rgba(255,60,60,0.1); border-color: rgba(255,60,60,0.2); }
.wall-body { flex: 1; overflow-y: auto; padding: 16px; }
.wall-empty { text-align: center; padding: 60px 20px; color: #a89cc8; }
.empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
.empty-hint { font-size: 13px; color: #7a6f9a; margin-top: 8px; }
.wall-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.wall-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px; border-left: 3px solid var(--accent); transition: transform 0.2s; }
.wall-card:hover { transform: translateY(-2px); }
.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; }
.card-author { color: var(--accent); font-weight: 600; }
.card-date { color: #7a6f9a; }
.card-code { margin: 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 12px; color: #d0c8e8; overflow-x: auto; max-height: 120px; white-space: pre-wrap; word-break: break-all; }
.card-output { margin-top: 8px; padding: 6px 10px; background: rgba(76,175,80,0.08); border-radius: 4px; font-size: 11px; color: #A5D6A7; }
.card-output pre { margin: 4px 0 0; font-family: monospace; white-space: pre-wrap; }
.output-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #81C784; }
.card-footer { display: flex; gap: 6px; margin-top: 10px; }
.card-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); color: #a89cc8; padding: 4px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; }
.card-btn:hover { background: rgba(255,255,255,0.1); }
.card-btn.del { color: #EF9A9A; }
.import-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 140; }
.import-box { background: rgba(25,20,40,0.98); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; width: 90vw; max-width: 500px; }
.import-box h3 { color: #e0d6f0; margin: 0 0 14px; }
.import-input { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #d0c8e8; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; }
.import-actions { display: flex; gap: 8px; margin-top: 12px; }
.import-error { color: #EF9A9A; font-size: 12px; margin-top: 8px; }
.wall-toast { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(100,80,180,0.9); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 13px; animation: toastIn 0.3s ease; }
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } }
.wall-fade-enter-active, .wall-fade-leave-active { transition: opacity 0.3s; }
.wall-fade-enter-from, .wall-fade-leave-to { opacity: 0; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
