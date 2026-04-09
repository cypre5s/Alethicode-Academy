<template>
  <transition name="toast-pop">
    <div v-if="engine.affectionToast.value" class="status-toast"
         :class="{ 'toast-negative': isNegative }"
         :style="{ '--toast-color': isNegative ? '#c97070' : engine.affectionToast.value.color }">
      <div class="toast-hearts">
        <span v-for="i in symbolCount" :key="i" class="heart"
              :style="{ animationDelay: (i * 0.1) + 's' }">{{ isNegative ? '♡' : '♥' }}</span>
      </div>
      <div class="toast-name">{{ engine.affectionToast.value.name }}</div>
    </div>
  </transition>
</template>

<script setup>
import { inject, computed } from 'vue'

const engine = inject('engine')

const isNegative = computed(() => (engine.affectionToast.value?.change || 0) < 0)

const symbolCount = computed(() => {
  const change = Math.abs(engine.affectionToast.value?.change || 0)
  return Math.min(Math.max(change, 1), 5)
})
</script>

<style scoped>
.status-toast {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(10, 10, 20, 0.8);
  border: 1px solid var(--toast-color, #e8a0bf);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  pointer-events: none;
}

.toast-hearts {
  display: flex;
  gap: 2px;
}

.heart {
  color: var(--toast-color, #e8a0bf);
  font-size: 16px;
  animation: heart-bounce 0.6s ease both;
  text-shadow: 0 0 8px var(--toast-color, #e8a0bf);
}

@keyframes heart-bounce {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); opacity: 1; }
}

.toast-name {
  font-size: 13px;
  color: var(--toast-color, #e8a0bf);
  font-weight: 500;
}

.toast-pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-pop-leave-active {
  transition: all 0.6s ease;
}
.toast-pop-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
.toast-pop-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-negative .heart {
  opacity: 0.7;
}
</style>
