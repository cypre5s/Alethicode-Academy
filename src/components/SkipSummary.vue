<template>
  <div v-if="engine.showSkipSummary.value" class="skip-overlay" @click.stop>
    <div class="skip-panel">
      <div class="skip-header">—— 剧情概要 ——</div>
      <div class="skip-body">
        <div
          v-for="(line, idx) in engine.skipSummary.value"
          :key="idx"
          class="skip-line"
          :class="'skip-' + line.type"
        >
          <span v-if="line.speaker" class="skip-speaker">{{ line.speaker }}：</span>
          <span class="skip-text">{{ line.text }}</span>
        </div>
      </div>
      <button class="skip-continue" @click="handleDismiss">
        <span class="skip-key">Space</span>
        <span>继续</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, onUnmounted } from 'vue'

const engine = inject('engine')

function handleDismiss() {
  engine.dismissSkipSummary()
}

function onKeydown(e) {
  if (!engine.showSkipSummary.value) return
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    handleDismiss()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.skip-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 20, 12, 0.55);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.skip-panel {
  width: min(640px, 90vw);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: var(--vn-radius, 20px);
  border: 1px solid rgba(216, 177, 110, 0.4);
  background: linear-gradient(180deg, rgba(255, 252, 248, 0.95), rgba(255, 244, 234, 0.92));
  box-shadow: 0 28px 80px rgba(58, 36, 17, 0.25);
  animation: slideUp 0.35s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.skip-header {
  padding: 18px 24px 12px;
  text-align: center;
  font-family: var(--vn-font-title, serif);
  font-size: 18px;
  font-weight: 600;
  color: var(--vn-gold, #c69b4e);
  letter-spacing: 0.15em;
  border-bottom: 1px solid rgba(216, 177, 110, 0.2);
}

.skip-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skip-line {
  font-size: 15px;
  line-height: 1.7;
  color: var(--vn-text, #34261f);
}

.skip-monologue {
  color: #725e63;
  font-style: italic;
}

.skip-narration {
  color: #6f6257;
}

.skip-speaker {
  font-weight: 600;
  color: var(--vn-primary-dark, #b56b83);
  margin-right: 2px;
}

.skip-continue {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 12px 24px 18px;
  padding: 12px 0;
  border-radius: 999px;
  border: 1px solid rgba(220, 140, 166, 0.35);
  background: linear-gradient(135deg, rgba(247, 221, 230, 0.8), rgba(255, 244, 234, 0.8));
  color: var(--vn-primary-dark, #b56b83);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.skip-continue:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(220, 140, 166, 0.2);
}

.skip-key {
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(205, 170, 109, 0.15);
  color: var(--vn-gold, #c69b4e);
  font-size: 11px;
  letter-spacing: 0.08em;
}

@media (max-width: 768px) {
  .skip-panel {
    width: 94vw;
    max-height: 75vh;
  }

  .skip-body {
    padding: 12px 16px;
  }

  .skip-line {
    font-size: 14px;
  }
}
</style>
