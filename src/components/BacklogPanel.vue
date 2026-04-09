<template>
  <transition name="fade">
    <div v-if="visible" class="backlog-overlay" @click.self="$emit('close')">
      <div class="backlog-box">
        <div class="backlog-header">
          <div>
            <span class="panel-kicker">History</span>
            <h3>对话记录</h3>
          </div>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>

        <div class="backlog-list" ref="listRef">
          <div v-for="(entry, idx) in engine.history" :key="idx" class="backlog-entry" :class="entry.type">
            <template v-if="entry.type === 'dialogue'">
              <span class="bl-speaker" v-if="entry.speaker" :style="{ color: entry.speakerColor || 'var(--vn-primary-dark)' }">
                {{ entry.speaker }}
              </span>
              <span class="bl-text">{{ entry.text }}</span>
            </template>
            <template v-else-if="entry.type === 'monologue'">
              <span class="bl-text monologue">{{ entry.text }}</span>
            </template>
            <template v-else-if="entry.type === 'narration'">
              <span class="bl-text narration">{{ entry.text }}</span>
            </template>
            <template v-else-if="entry.type === 'choice'">
              <span class="bl-choice">{{ entry.text }}</span>
            </template>
            <template v-else-if="entry.type === 'ending'">
              <span class="bl-ending">{{ entry.text }}</span>
            </template>
          </div>
          <div v-if="engine.history.length === 0" class="backlog-empty">暂无记录</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject, nextTick, ref, watch } from 'vue'

defineProps({ visible: Boolean })
defineEmits(['close'])

const engine = inject('engine')
const listRef = ref(null)

watch(() => engine.history.length, async () => {
  await nextTick()
  if (listRef.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight
  }
})
</script>

<style scoped>
.backlog-overlay {
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

.backlog-box {
  width: min(820px, 100%);
  max-height: 84vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  border: 1px solid rgba(219, 182, 123, 0.38);
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.95), rgba(255, 244, 234, 0.9));
  box-shadow: 0 30px 80px rgba(49, 30, 12, 0.22);
}

.backlog-header {
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

.backlog-header h3 {
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

.backlog-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 26px 22px;
}

.backlog-entry {
  padding: 14px 0;
  border-bottom: 1px solid rgba(209, 170, 108, 0.12);
  line-height: 1.8;
}

.bl-speaker {
  margin-right: 8px;
  font-size: 14px;
  font-weight: 600;
}

.bl-speaker::after {
  content: '：';
}

.bl-text {
  color: var(--vn-text);
  font-size: var(--vn-dialogue-font-size, 17px);
}

.bl-text.narration,
.bl-text.monologue {
  color: var(--vn-text-dim);
  font-style: italic;
}

.bl-choice {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(136, 168, 216, 0.14);
  color: #5a7096;
  font-size: 13px;
}

.bl-ending {
  color: var(--vn-primary-dark);
  font-size: 14px;
  font-weight: 600;
}

.backlog-empty {
  padding: 56px 0;
  color: var(--vn-text-dim);
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
  .backlog-overlay {
    padding: 12px;
  }

  .backlog-header,
  .backlog-list {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
