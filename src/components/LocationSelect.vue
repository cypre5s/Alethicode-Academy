<template>
  <transition name="loc-appear">
    <div v-if="engine.isLocationSelect.value" class="location-overlay" @click.stop>
      <div class="location-panel">
        <div class="panel-header">
          <div>
            <span class="loc-kicker">Free Time</span>
            <h3 class="loc-title">选择想去的地方</h3>
            <p class="loc-subtitle">{{ timeSlotLabel }}</p>
          </div>
        </div>

        <div class="location-grid">
          <button
            v-for="loc in decoratedLocations"
            :key="loc.id"
            class="loc-card"
            @click="handleSelect(loc.id)"
          >
            <div class="loc-bg">
              <img class="loc-thumb" :src="loc.thumbnail" :alt="loc.name" loading="lazy" decoding="async" />
              <div class="loc-overlay"></div>
              <div class="loc-char-indicator" v-if="loc.character">
                <span class="char-dot" :style="{ background: getCharColor(loc.character) }"></span>
                <span class="char-label">{{ getCharName(loc.character) }}</span>
              </div>
            </div>
            <div class="loc-info">
              <span class="loc-name">{{ loc.name }}</span>
              <span class="loc-desc">{{ loc.description }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, inject } from 'vue'
import { characters } from '../data/characters.js'
import { getLocationCard } from '../data/locations.js'

const engine = inject('engine')
const audio = inject('audio')

const timeSlotLabel = computed(() => {
  const slot = engine.currentTimeSlot.value
  const labels = {
    morning: '课间的春光很短，别错过想见的人。',
    noon: '午休时间刚好适合一段轻松的小事件。',
    evening: '放学后的选择往往最容易改写气氛。',
  }
  return labels[slot] || '自由时段'
})

const decoratedLocations = computed(() => (
  engine.locationOptions.value.map((loc) => {
    const card = getLocationCard(loc.id, engine.currentTimeSlot.value)
    return {
      ...loc,
      name: card?.name || loc.name,
      thumbnail: card?.thumbnail || '',
      description: card?.description || loc.description || '',
    }
  })
))

function getCharColor(charId) {
  return characters[charId]?.color || '#999'
}

function getCharName(charId) {
  return characters[charId]?.nameShort || characters[charId]?.name || charId
}

function handleSelect(locId) {
  audio.playSfx('select')
  engine.selectLocation(locId)
}
</script>

<style scoped>
.location-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(33, 22, 15, 0.42);
  backdrop-filter: blur(10px);
}

.location-panel {
  width: min(1100px, 100%);
  padding: 32px;
  border-radius: 30px;
  border: 1px solid rgba(221, 181, 116, 0.36);
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.92), rgba(255, 244, 235, 0.88));
  box-shadow: 0 28px 80px rgba(48, 29, 12, 0.22);
}

.panel-header {
  margin-bottom: 24px;
}

.loc-kicker {
  display: block;
  margin-bottom: 10px;
  color: var(--vn-gold);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.loc-title {
  font-family: var(--vn-font-title);
  font-size: clamp(28px, 3vw, 40px);
  color: var(--vn-text);
}

.loc-subtitle {
  margin-top: 10px;
  color: var(--vn-text-dim);
  font-size: 14px;
}

.location-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.loc-card {
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid rgba(224, 189, 130, 0.34);
  background: rgba(255, 253, 250, 0.78);
  text-align: left;
  box-shadow: 0 16px 36px rgba(69, 45, 24, 0.12);
}

.loc-card:hover {
  transform: translateY(-4px);
  border-color: rgba(224, 145, 171, 0.4);
  box-shadow: 0 20px 42px rgba(214, 157, 124, 0.18);
}

.loc-bg {
  position: relative;
  aspect-ratio: 16 / 10;
}

.loc-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.loc-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 28%, rgba(36, 24, 17, 0.45) 100%);
}

.loc-char-indicator {
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 250, 244, 0.84);
  border: 1px solid rgba(233, 214, 186, 0.72);
  backdrop-filter: blur(8px);
}

.char-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.char-label {
  color: var(--vn-text);
  font-size: 12px;
}

.loc-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px 18px;
}

.loc-name {
  color: var(--vn-text);
  font-size: 17px;
  font-weight: 600;
}

.loc-desc {
  color: var(--vn-text-dim);
  font-size: 13px;
  line-height: 1.7;
}

.loc-appear-enter-active,
.loc-appear-leave-active {
  transition: opacity 0.34s ease, transform 0.34s ease;
}

.loc-appear-enter-from,
.loc-appear-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@media (max-width: 768px) {
  .location-overlay {
    padding: 14px;
  }

  .location-panel {
    padding: 22px 16px 18px;
    border-radius: 22px;
  }

  .location-grid {
    grid-template-columns: 1fr;
  }
}
</style>
