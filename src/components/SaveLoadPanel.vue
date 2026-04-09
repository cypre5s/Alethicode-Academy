<template>
  <transition name="fade">
    <div v-if="visible" class="panel-overlay" @click.self="close">
      <div class="panel-box">
        <div class="panel-header">
          <div class="panel-copy">
            <span class="panel-kicker">Record</span>
            <h3>{{ mode === 'save' ? '保存当前进度' : '读取已有进度' }}</h3>
          </div>
          <div class="panel-tabs">
            <button :class="{ active: mode === 'save' }" @click="mode = 'save'">存档</button>
            <button :class="{ active: mode === 'load' }" @click="mode = 'load'">读档</button>
          </div>
          <button class="close-btn" @click="close" aria-label="关闭">✕</button>
        </div>

        <div class="slot-grid">
          <div class="slot-card auto-slot">
            <div class="slot-preview" :style="slotPreviewStyle(autoSave)">
              <span class="slot-mask">AUTO</span>
            </div>
            <div class="slot-info">
              <span class="slot-label">自动存档</span>
              <span class="slot-date" v-if="autoSave">{{ autoSave.dateStr }}</span>
              <span class="slot-date" v-else>空</span>
            </div>
            <button v-if="mode === 'load' && autoSave" class="slot-action load" @click="loadAuto">读取</button>
          </div>

          <div v-for="i in saveManager.MAX_SLOTS" :key="i" class="slot-card">
            <div class="slot-preview" :style="slotPreviewStyle(saves[i - 1])">
              <span v-if="!saves[i - 1]" class="slot-mask empty">Empty</span>
              <span v-else class="slot-mask">{{ chapterLabel(saves[i - 1]) }}</span>
            </div>
            <div class="slot-info">
              <span class="slot-label">存档 {{ i }}</span>
              <span class="slot-date" v-if="saves[i - 1]">{{ saves[i - 1].dateStr }}</span>
              <span class="slot-date" v-else>未使用</span>
            </div>
            <div class="slot-actions">
              <button v-if="mode === 'save'" class="slot-action save" @click="saveSlot(i - 1)">保存</button>
              <button v-if="mode === 'load' && saves[i - 1]" class="slot-action load" @click="loadSlot(i - 1)">读取</button>
              <button v-if="saves[i - 1]" class="slot-action delete" @click="deleteSlot(i - 1)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { getBackgroundEntry } from '../data/locations.js'

const props = defineProps({ visible: Boolean, initialMode: { type: String, default: 'save' } })
const emit = defineEmits(['close'])

const engine = inject('engine')
const saveManager = inject('saveManager')
const audio = inject('audio')

const mode = ref(props.initialMode)
const saves = computed(() => saveManager.saves.value)
const autoSave = computed(() => saveManager.loadAuto())

function close() {
  emit('close')
}

function saveSlot(idx) {
  if (saves.value[idx] && !confirm('该存档位已有数据，确定要覆盖吗？')) return
  const state = engine.getState()
  saveManager.saveToSlot(idx, state)
  saveManager.refresh()
  audio.playSfx('save')
}

function loadSlot(idx) {
  const state = saveManager.loadFromSlot(idx)
  if (!state) return
  engine.restoreState(state)
  close()
}

function loadAuto() {
  const state = saveManager.loadAuto()
  if (!state) return
  engine.restoreState(state)
  close()
}

function deleteSlot(idx) {
  if (!confirm('确定要删除该存档吗？')) return
  saveManager.deleteSlot(idx)
  saveManager.refresh()
}

function slotPreviewStyle(save) {
  if (!save?.currentBg) return {}
  const entry = getBackgroundEntry(save.currentBg)
  if (!entry?.thumbnail) return {}
  return { backgroundImage: `url(${entry.thumbnail})` }
}

function chapterLabel(save) {
  return save.chapterTitle || save.currentChapter || '剧情中'
}
</script>

<style scoped>
.panel-overlay {
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

.panel-box {
  width: min(920px, 100%);
  max-height: 84vh;
  overflow-y: auto;
  border-radius: 30px;
  border: 1px solid rgba(219, 182, 123, 0.38);
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.95), rgba(255, 244, 234, 0.9));
  box-shadow: 0 30px 80px rgba(49, 30, 12, 0.22);
}

.panel-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 18px;
  padding: 24px 26px 18px;
  border-bottom: 1px solid rgba(222, 190, 139, 0.22);
}

.panel-copy h3 {
  font-family: var(--vn-font-title);
  font-size: 30px;
  color: var(--vn-text);
}

.panel-kicker {
  display: block;
  margin-bottom: 8px;
  color: var(--vn-gold);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.panel-tabs {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(224, 200, 162, 0.5);
}

.panel-tabs button {
  min-width: 76px;
  padding: 10px 18px;
  border-radius: 999px;
  color: var(--vn-text-dim);
  font-size: 13px;
}

.panel-tabs button.active {
  color: #fff;
  background: linear-gradient(135deg, rgba(224, 145, 171, 0.92), rgba(198, 154, 78, 0.92));
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(224, 199, 160, 0.58);
  background: rgba(255, 255, 255, 0.7);
  color: var(--vn-text-dim);
}

.slot-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 24px 24px;
}

.slot-card {
  display: grid;
  grid-template-columns: 132px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 22px;
  border: 1px solid rgba(229, 205, 170, 0.44);
  background: rgba(255, 254, 252, 0.74);
}

.slot-card:hover {
  border-color: rgba(224, 145, 171, 0.32);
}

.slot-preview {
  position: relative;
  overflow: hidden;
  width: 132px;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
}

.slot-preview::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(31, 21, 13, 0.38));
}

.slot-mask {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 1;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 250, 244, 0.82);
  color: var(--vn-text);
  font-size: 11px;
  line-height: 1.5;
  text-align: center;
  backdrop-filter: blur(6px);
}

.slot-mask.empty {
  top: 50%;
  bottom: auto;
  transform: translateY(-50%);
  color: var(--vn-text-dim);
}

.slot-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slot-label {
  color: var(--vn-text);
  font-size: 15px;
  font-weight: 600;
}

.slot-date {
  color: var(--vn-text-dim);
  font-size: 12px;
}

.slot-actions {
  display: flex;
  gap: 8px;
}

.slot-action {
  min-width: 72px;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 12px;
}

.slot-action.save {
  background: linear-gradient(135deg, rgba(222, 145, 170, 0.9), rgba(196, 150, 78, 0.88));
  color: #fff;
}

.slot-action.load {
  background: rgba(124, 165, 126, 0.14);
  border: 1px solid rgba(124, 165, 126, 0.3);
  color: #53775c;
}

.slot-action.delete {
  background: rgba(214, 112, 112, 0.1);
  border: 1px solid rgba(214, 112, 112, 0.24);
  color: #b45d5d;
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
  .panel-overlay {
    padding: 12px;
  }

  .panel-header {
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 18px 18px 14px;
  }

  .panel-tabs {
    order: 3;
    grid-column: 1 / -1;
  }

  .slot-grid {
    padding: 14px 16px 18px;
  }

  .slot-card {
    grid-template-columns: 1fr;
  }

  .slot-preview {
    width: 100%;
  }

  .slot-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
