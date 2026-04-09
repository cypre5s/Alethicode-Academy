<template>
  <transition name="choice-appear">
    <div v-if="engine.isChoosing.value" class="choice-overlay" @click.stop>
      <div class="choice-container">
        <div v-if="engine.choicePrompt.value" class="choice-prompt">
          {{ engine.choicePrompt.value }}
        </div>
        <div class="choice-options">
          <button v-for="(option, i) in engine.choiceOptions.value" :key="i"
                  class="choice-btn"
                  :style="{ animationDelay: (i * 0.1) + 's' }"
                  @click="handleSelect(i)">
            <span class="choice-marker">{{ ['❖','◆','◇','✦'][i] || '◆' }}</span>
            <span class="choice-text">{{ option.text }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject } from 'vue'

const engine = inject('engine')
const audio = inject('audio')

function handleSelect(index) {
  audio.playSfx('select')
  engine.selectChoice(index)
}
</script>

<style scoped>
.choice-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(40, 24, 14, 0.28);
  backdrop-filter: blur(6px);
}

.choice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 90%;
  max-width: 600px;
}

.choice-prompt {
  font-size: 18px;
  color: var(--vn-text);
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.choice-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.choice-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(180deg, rgba(255, 252, 248, 0.9), rgba(255, 245, 237, 0.86));
  border: 1px solid rgba(216, 177, 110, 0.34);
  border-radius: 12px;
  color: #2e2018;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 14px;
  backdrop-filter: blur(8px);
  animation: choice-slide-in 0.4s ease both;
  font-size: 16px;
  transition: all 0.2s ease;
}

.choice-btn:hover {
  border-color: rgba(220, 140, 166, 0.58);
  background: linear-gradient(135deg, rgba(255, 236, 244, 0.96), rgba(255, 245, 223, 0.92));
  transform: translateX(6px);
  box-shadow: 0 16px 38px rgba(182, 121, 90, 0.22);
}

.choice-marker {
  color: var(--vn-primary-dark);
  font-size: 14px;
  flex-shrink: 0;
}

.choice-text {
  line-height: 1.5;
  color: #2f2118;
}

@keyframes choice-slide-in {
  0% { opacity: 0; transform: translateY(20px) scaleY(0.8); }
  100% { opacity: 1; transform: translateY(0) scaleY(1); }
}

.choice-appear-enter-active { transition: opacity 0.3s ease; }
.choice-appear-leave-active { transition: opacity 0.2s ease; }
.choice-appear-enter-from, .choice-appear-leave-to { opacity: 0; }
</style>
