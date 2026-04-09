<template>
  <div class="title-screen" @click="handleFirstClick">
    <div class="title-bg">
      <img class="title-hero" :src="titleHero" alt="Alethicode Academy 主视觉" decoding="async" />
      <div class="title-veil"></div>
    </div>

    <div class="sakura-container" aria-hidden="true">
      <span v-for="petal in petals" :key="petal.id" class="sakura-petal" :style="petal.style"></span>
    </div>

    <div class="title-content">
      <div class="title-copy">
        <span class="title-kicker">Visual Novel x Python x Romance</span>
        <h1 class="game-title">
          <span class="title-main">Alethicode Academy</span>
          <span class="title-sub">编程学园恋物语</span>
        </h1>
        <p class="title-desc">在春日校园里，一边学会写下第一行 Python，一边学会认真对待自己的心意。</p>
      </div>

      <div class="title-menu" v-if="interacted">
        <div v-if="showNameInput" class="name-input-area">
          <label class="name-label">请输入你的名字</label>
          <input
            v-model="playerName"
            class="name-input"
            placeholder="藤堂 和真"
            maxlength="12"
            @keydown.enter="confirmStart"
          />
          <div class="quiz-check">
            <p class="quiz-question">校验问题：学校的湖叫什么？</p>
            <input
              v-model="verificationAnswer"
              class="quiz-input"
              placeholder="请输入答案"
              maxlength="12"
              @keydown.enter="confirmStart"
            />
            <p v-if="verificationError" class="quiz-error">{{ verificationError }}</p>
          </div>
          <div class="name-actions">
            <button class="menu-btn primary" @click.stop="confirmStart">开始游戏</button>
            <button class="menu-btn secondary" @click.stop="closeNameInput">返回</button>
          </div>
        </div>

        <template v-else>
          <button class="menu-btn primary" @click.stop="openNewStory">新的故事</button>
          <button class="menu-btn secondary" @click.stop="$emit('continue-game')" :disabled="!hasSave">继续游戏</button>
          <button class="menu-btn secondary" @click.stop="$emit('load')">读取存档</button>
          <button class="menu-btn secondary" @click.stop="$emit('gallery')">鉴赏</button>
          <button class="menu-btn secondary" @click.stop="$emit('settings')">设定</button>
        </template>
      </div>

      <p v-else class="click-hint">点击任意位置开始</p>
    </div>

    <div class="title-footer">
      <span>Alethicode Academy</span>
      <span>Developed by dhu_cypress, assisted with opus</span>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { assetPath } from '../utils/assetPath.js'

const emit = defineEmits(['start', 'continue-game', 'load', 'gallery', 'settings'])
const audio = inject('audio')

const interacted = ref(false)
const hasSave = ref(false)
const showNameInput = ref(false)
const playerName = ref('')
const verificationAnswer = ref('')
const verificationError = ref('')
const titleHero = assetPath('assets/ui/title-hero.webp')

const petals = Array.from({ length: 20 }, (_, index) => ({
  id: `petal-${index}`,
  style: {
    left: `${(index * 11 + 7) % 100}%`,
    animationDelay: `${(index % 8) * 0.6}s`,
    animationDuration: `${8 + (index % 5) * 1.4}s`,
    width: `${14 + (index % 4) * 4}px`,
    height: `${10 + (index % 4) * 3}px`,
  },
}))

function confirmStart() {
  const answer = verificationAnswer.value.trim().replace(/\s+/g, '')
  if (answer !== '镜月湖') {
    verificationError.value = '回答错误，请重新输入。'
    verificationAnswer.value = ''
    return
  }
  verificationError.value = ''
  emit('start', playerName.value.trim() || undefined)
  closeNameInput()
}

function openNewStory() {
  showNameInput.value = true
  verificationAnswer.value = ''
  verificationError.value = ''
}

function closeNameInput() {
  showNameInput.value = false
  verificationAnswer.value = ''
  verificationError.value = ''
}

function handleFirstClick() {
  if (interacted.value) return
  interacted.value = true
  audio.ensureContext()
  audio.playBgm('title')
}

onMounted(() => {
  try {
    hasSave.value = !!localStorage.getItem('alethicode_save_auto')
  } catch {
    hasSave.value = false
  }
})
</script>

<style scoped>
.title-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.title-bg,
.title-hero,
.title-veil {
  position: absolute;
  inset: 0;
}

.title-hero {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.03);
}

.title-veil {
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 244, 226, 0.36), transparent 26%),
    linear-gradient(180deg, rgba(255, 250, 244, 0.12), rgba(37, 22, 13, 0.32));
}

.sakura-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.sakura-petal {
  position: absolute;
  top: -40px;
  display: block;
  border-radius: 70% 35% 70% 35%;
  background: linear-gradient(135deg, rgba(255, 224, 234, 0.95), rgba(244, 189, 212, 0.88));
  box-shadow: 0 0 18px rgba(255, 214, 231, 0.18);
  animation: petal-fall linear infinite;
}

.title-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: end;
  gap: 34px;
  height: 100%;
  padding: clamp(26px, 5vw, 64px);
}

.title-copy {
  align-self: center;
  max-width: 720px;
  padding: 38px 42px;
  border-radius: 34px;
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.76), rgba(255, 245, 236, 0.7));
  border: 1px solid rgba(216, 177, 110, 0.34);
  box-shadow: 0 28px 90px rgba(45, 25, 8, 0.18);
  backdrop-filter: blur(14px);
}

.title-kicker {
  display: inline-block;
  margin-bottom: 14px;
  color: var(--vn-gold);
  font-family: var(--vn-font-title);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  text-shadow: 0 1px 6px rgba(198, 155, 78, 0.18);
}

.game-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-main {
  font-family: var(--vn-font-title);
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 600;
  font-style: italic;
  line-height: 1;
  color: var(--vn-text);
  text-shadow:
    0 2px 12px rgba(198, 155, 78, 0.15),
    0 0 40px rgba(220, 140, 166, 0.08);
}

.title-sub {
  font-family: var(--vn-font-display);
  color: var(--vn-primary-dark);
  font-size: clamp(22px, 2.4vw, 32px);
  letter-spacing: 0.36em;
  text-shadow: 0 1px 8px rgba(181, 107, 131, 0.12);
}

.title-desc {
  max-width: 28em;
  margin-top: 18px;
  color: var(--vn-text-dim);
  font-family: var(--vn-font-display);
  font-size: 16px;
  line-height: 2;
}

.title-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-self: center;
  padding: 22px;
  border-radius: 30px;
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.86), rgba(255, 245, 236, 0.84));
  border: 1px solid rgba(216, 177, 110, 0.3);
  box-shadow: 0 24px 56px rgba(45, 25, 8, 0.18);
  backdrop-filter: blur(12px);
}

.name-input-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name-label {
  color: var(--vn-text-dim);
  font-size: 13px;
}

.name-input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 18px;
  border: 1px solid rgba(216, 177, 110, 0.26);
  background: rgba(255, 255, 255, 0.8);
  color: var(--vn-text);
  font-size: 18px;
}

.name-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.quiz-check {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(216, 177, 110, 0.2);
  background: rgba(255, 255, 255, 0.64);
}

.quiz-question {
  color: #5b4b41;
  font-size: 13px;
}

.quiz-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(216, 177, 110, 0.28);
  background: rgba(255, 255, 255, 0.88);
  color: var(--vn-text);
  font-size: 14px;
}

.quiz-error {
  color: #b45d5d;
  font-size: 12px;
}

.menu-btn {
  width: 100%;
  padding: 15px 18px;
  border-radius: 999px;
  font-family: var(--vn-font-display);
  font-size: 15px;
  letter-spacing: 0.12em;
}

.menu-btn.primary {
  background: linear-gradient(135deg, rgba(224, 145, 171, 0.95), rgba(198, 154, 78, 0.92));
  color: #fff;
  text-shadow: 0 1px 3px rgba(120, 60, 40, 0.18);
  box-shadow:
    0 18px 32px rgba(213, 153, 121, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.menu-btn.secondary {
  border: 1px solid rgba(216, 177, 110, 0.22);
  background: rgba(255, 255, 255, 0.76);
  color: var(--vn-text);
}

.menu-btn:hover:not(:disabled) {
  box-shadow:
    0 20px 40px rgba(213, 153, 121, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.menu-btn:disabled {
  opacity: 0.45;
}

.click-hint {
  align-self: end;
  justify-self: start;
  padding: 12px 22px;
  border-radius: 999px;
  background: rgba(255, 251, 246, 0.66);
  color: var(--vn-text-dim);
  font-family: var(--vn-font-display);
  font-size: 14px;
  letter-spacing: 0.16em;
  backdrop-filter: blur(8px);
  animation: hint-pulse 2.4s ease-in-out infinite;
}

@keyframes hint-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.title-footer {
  position: absolute;
  right: 24px;
  bottom: 20px;
  z-index: 1;
  display: inline-flex;
  gap: 16px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 251, 246, 0.54);
  color: rgba(52, 38, 31, 0.72);
  font-size: 11px;
  backdrop-filter: blur(8px);
}

@keyframes petal-fall {
  0% {
    transform: translate3d(0, -20px, 0) rotate(0deg);
    opacity: 0;
  }
  12% {
    opacity: 0.86;
  }
  100% {
    transform: translate3d(72px, 118vh, 0) rotate(320deg);
    opacity: 0;
  }
}

@media (max-width: 960px) {
  .title-content {
    grid-template-columns: 1fr;
    align-items: end;
  }

  .title-copy,
  .title-menu {
    width: min(100%, 640px);
  }

  .title-copy {
    align-self: end;
  }

  .click-hint {
    justify-self: center;
  }
}

@media (max-width: 768px) {
  .title-content {
    padding: 18px 14px 18px;
    gap: 14px;
  }

  .title-copy,
  .title-menu {
    padding: 20px 18px;
    border-radius: 22px;
  }

  .title-footer {
    left: 14px;
    right: 14px;
    justify-content: space-between;
    bottom: 12px;
  }

  .name-actions {
    grid-template-columns: 1fr;
  }
}
</style>
