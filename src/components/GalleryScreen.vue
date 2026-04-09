<template>
  <div class="gallery-screen">
    <div class="gallery-hero">
      <img class="gallery-hero-image" :src="titleHero" alt="鉴赏主视觉" decoding="async" />
      <div class="gallery-hero-overlay"></div>
    </div>

    <div class="gallery-shell">
      <div class="gallery-header">
        <div>
          <span class="panel-kicker">Collection</span>
          <h2>鉴赏</h2>
        </div>
        <div class="gallery-tabs">
          <button :class="{ active: tab === 'cg' }" @click="tab = 'cg'">CG 鉴赏</button>
          <button :class="{ active: tab === 'music' }" @click="tab = 'music'">音乐鉴赏</button>
          <button :class="{ active: tab === 'chars' }" @click="tab = 'chars'">角色</button>
        </div>
        <button class="back-btn" @click="$emit('back')">返回标题</button>
      </div>

      <div v-if="tab === 'cg'" class="gallery-grid">
        <button
          v-for="cg in cgList"
          :key="cg.id"
          class="cg-card"
          :class="{ locked: !isUnlocked(cg.id) }"
          @click="openCg(cg)"
        >
          <div class="cg-preview">
            <img v-if="isUnlocked(cg.id)" :src="cg.thumbnail" :alt="cg.title" loading="lazy" decoding="async" />
            <div v-else class="cg-locked-mask">Locked</div>
          </div>
          <div class="cg-info">
            <span class="cg-title">{{ isUnlocked(cg.id) ? cg.title : '???' }}</span>
            <span class="cg-route">{{ isUnlocked(cg.id) ? cg.route : '未解锁' }}</span>
          </div>
        </button>
      </div>

      <div v-if="tab === 'music'" class="music-gallery">
        <div
          v-for="bgm in bgmList"
          :key="bgm.id"
          class="music-card"
          :class="{ locked: !isBgmUnlocked(bgm.id), playing: currentPlaying === bgm.id }"
        >
          <button class="music-play-btn" @click="toggleBgm(bgm)" :disabled="!isBgmUnlocked(bgm.id)">
            <span v-if="currentPlaying === bgm.id">暂停</span>
            <span v-else-if="isBgmUnlocked(bgm.id)">播放</span>
            <span v-else>锁定</span>
          </button>
          <div class="music-info">
            <span class="music-title">{{ isBgmUnlocked(bgm.id) ? bgm.title : '???' }}</span>
            <span class="music-scene">{{ isBgmUnlocked(bgm.id) ? bgm.scene : '未解锁' }}</span>
          </div>
          <div v-if="currentPlaying === bgm.id" class="music-visualizer">
            <span v-for="i in 5" :key="i" class="viz-bar" :style="{ animationDelay: (i * 0.1) + 's' }"></span>
          </div>
        </div>
      </div>

      <div v-if="tab === 'chars'" class="char-gallery">
        <div v-for="char in charList" :key="char.id"
             class="char-card" :class="{ expanded: expandedChar === char.id }"
             @click="toggleCharExpand(char.id)">
          <div class="char-portrait" :style="{ borderColor: char.color }">
            <img
              class="char-portrait-image"
              :src="getPortrait(char.id)"
              :alt="char.name"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="char-detail">
            <h3 :style="{ color: char.color }">{{ char.name }}</h3>
            <p class="char-role">{{ char.role }}</p>
            <p class="char-origin">— {{ char.origin }} —</p>
            <p class="char-desc">{{ char.description }}</p>
            <div v-if="char.catchphrases" class="char-catchphrases">
              <p v-for="(cp, i) in char.catchphrases" :key="i" class="catchphrase">「{{ cp }}」</p>
            </div>

            <div v-if="expandedChar === char.id" class="char-expanded-info" @click.stop>
              <div class="char-section">
                <h4 class="section-title">关系进度</h4>
                <div class="rel-bars">
                  <div class="rel-bar-row">
                    <span class="rel-label">好感</span>
                    <div class="rel-track">
                      <div class="rel-fill" :style="{ width: getRelPercent(char.id, 'affection') + '%', background: char.color }"></div>
                    </div>
                    <span class="rel-value">{{ getRelValue(char.id, 'affection') }}</span>
                  </div>
                  <div class="rel-bar-row">
                    <span class="rel-label">信任</span>
                    <div class="rel-track">
                      <div class="rel-fill" :style="{ width: getRelPercent(char.id, 'trust') + '%', background: char.color + 'cc' }"></div>
                    </div>
                    <span class="rel-value">{{ getRelValue(char.id, 'trust') }}</span>
                  </div>
                  <div class="rel-bar-row">
                    <span class="rel-label">安心</span>
                    <div class="rel-track">
                      <div class="rel-fill" :style="{ width: getRelPercent(char.id, 'comfort') + '%', background: char.color + '99' }"></div>
                    </div>
                    <span class="rel-value">{{ getRelValue(char.id, 'comfort') }}</span>
                  </div>
                </div>
                <div class="rel-stage-badge" :style="{ borderColor: char.color }">
                  {{ getRelStage(char.id) }}
                </div>
              </div>

              <div class="char-section" v-if="getMemories(char.id).length > 0">
                <h4 class="section-title">共同回忆</h4>
                <div class="memory-timeline">
                  <div v-for="mem in getMemories(char.id)" :key="mem.id" class="memory-entry">
                    <span class="memory-emotion-dot" :class="'emotion-' + (mem.emotion || 'warm')"></span>
                    <div class="memory-content">
                      <span class="memory-text">{{ mem.text }}</span>
                      <span class="memory-meta">
                        {{ mem.relStageAtTime || '' }}
                        <span v-if="mem.context"> · {{ mem.context }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="char-section" v-else>
                <h4 class="section-title">共同回忆</h4>
                <p class="empty-hint">尚未建立共同回忆</p>
              </div>

              <div class="char-section" v-if="getImpressionKeywords(char.id).length > 0">
                <h4 class="section-title">她对你的印象</h4>
                <div class="impression-tags">
                  <span v-for="kw in getImpressionKeywords(char.id)" :key="kw"
                        class="impression-tag" :style="{ borderColor: char.color + '44' }">
                    {{ kw }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="selectedCg" class="preview-overlay" @click="selectedCg = null">
        <div class="preview-card">
          <img class="preview-image" :src="selectedCg.image" :alt="selectedCg.title" decoding="async" />
          <div class="preview-meta">
            <span class="preview-route">{{ selectedCg.route }}</span>
            <span class="preview-title">{{ selectedCg.title }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { inject, onUnmounted, ref } from 'vue'
import { cgList } from '../data/cgCatalog.js'
import { characterList } from '../data/characters.js'
import { getCharacterSprite } from '../data/characterSprites.js'
import { getRelationshipStage } from '../data/relationshipRules.js'
import { assetPath } from '../utils/assetPath.js'

defineEmits(['back'])

const engine = inject('engine')
const audio = inject('audio')

const tab = ref('cg')
const charList = characterList
const currentPlaying = ref(null)
const selectedCg = ref(null)
const expandedChar = ref(null)
const titleHero = assetPath('assets/ui/title-hero.webp')

const bgmList = [
  { id: 'title', title: '启程的旋律', scene: '标题画面' },
  { id: 'daily', title: '学园的日常', scene: '日常/上课' },
  { id: 'peaceful', title: '静谧时光', scene: '图书馆/计算机教室' },
  { id: 'romantic', title: '心跳的频率', scene: '恋爱/心动场景' },
  { id: 'tension', title: '代码的节奏', scene: '编程赛/紧张场景' },
  { id: 'mystery', title: '夜的密语', scene: '夜间/Murasame' },
  { id: 'festival', title: '祭典之夜', scene: '文化祭' },
  { id: 'sad', title: '别离的旋律', scene: '悲伤/分别' },
  { id: 'battle', title: '最后的竞赛', scene: '全国赛' },
  { id: 'ending', title: '终章', scene: '结局' },
  { id: 'morning_fresh', title: '朝露的光', scene: '校门/早晨' },
  { id: 'evening_calm', title: '夕暮之时', scene: '傍晚/放学' },
]

function isUnlocked(id) {
  return engine.unlockedCGs.has(id)
}

function isBgmUnlocked(id) {
  return engine.unlockedBGM.has(id) || engine.unlockedBGM.size === 0
}

function getPortrait(id) {
  return getCharacterSprite(id, 'normal') || ''
}

function openCg(cg) {
  if (!isUnlocked(cg.id)) return
  selectedCg.value = cg
}

function toggleCharExpand(id) {
  expandedChar.value = expandedChar.value === id ? null : id
}

function getRelValue(charId, dim) {
  return engine.relationship[charId]?.[dim] || 0
}

function getRelPercent(charId, dim) {
  return Math.min(getRelValue(charId, dim), 100)
}

function getRelStage(charId) {
  const rel = engine.relationship[charId] || { affection: 0, trust: 0, comfort: 0 }
  return getRelationshipStage(rel)
}

function getMemories(charId) {
  const mems = engine.memories[charId] || []
  return mems.slice().reverse()
}

function getImpressionKeywords(charId) {
  const mems = engine.memories[charId] || []
  if (mems.length === 0) return []

  const wordCounts = {}
  for (const mem of mems) {
    const text = typeof mem === 'string' ? mem : (mem.text || '')
    const words = text.replace(/[，。！？、…\s]+/g, ' ').split(' ').filter(w => w.length >= 2 && w.length <= 6)
    for (const w of words) {
      wordCounts[w] = (wordCounts[w] || 0) + 1
    }
  }

  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word)
}

function toggleBgm(bgm) {
  if (!isBgmUnlocked(bgm.id)) return
  if (currentPlaying.value === bgm.id) {
    audio.stopBgm(500)
    currentPlaying.value = null
    return
  }
  audio.playBgm(bgm.id, 500)
  currentPlaying.value = bgm.id
}

onUnmounted(() => {
  if (currentPlaying.value) {
    audio.stopBgm(500)
  }
})
</script>

<style scoped>
.gallery-screen {
  position: relative;
  width: 100%;
  min-height: 100%;
  overflow-y: auto;
  background: linear-gradient(180deg, #f5ede4, #efe3d5);
}

.gallery-hero {
  position: absolute;
  inset: 0 0 auto 0;
  height: 360px;
  overflow: hidden;
}

.gallery-hero-image,
.gallery-hero-overlay {
  position: absolute;
  inset: 0;
}

.gallery-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-hero-overlay {
  background: linear-gradient(180deg, rgba(255, 246, 236, 0.1), rgba(245, 237, 228, 0.92));
}

.gallery-shell {
  position: relative;
  z-index: 1;
  padding: 32px 24px 24px;
}

.gallery-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
  padding: 26px;
  border-radius: 30px;
  border: 1px solid rgba(219, 182, 123, 0.38);
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.92), rgba(255, 244, 234, 0.88));
  box-shadow: 0 26px 66px rgba(49, 30, 12, 0.16);
}

.panel-kicker {
  display: block;
  margin-bottom: 8px;
  color: var(--vn-gold);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.gallery-header h2 {
  font-family: var(--vn-font-title);
  font-size: 34px;
  color: var(--vn-text);
}

.gallery-tabs {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(224, 200, 162, 0.5);
}

.gallery-tabs button,
.back-btn {
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13px;
}

.gallery-tabs button {
  color: var(--vn-text-dim);
}

.gallery-tabs button.active {
  color: #fff;
  background: linear-gradient(135deg, rgba(224, 145, 171, 0.92), rgba(198, 154, 78, 0.92));
}

.back-btn {
  border: 1px solid rgba(216, 177, 110, 0.22);
  background: rgba(255, 255, 255, 0.7);
  color: var(--vn-text);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.cg-card,
.char-card,
.music-card {
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(229, 205, 170, 0.44);
  background: rgba(255, 254, 252, 0.78);
  box-shadow: 0 16px 36px rgba(69, 45, 24, 0.12);
}

.cg-card {
  padding: 0;
  text-align: left;
}

.cg-card.locked {
  opacity: 0.68;
}

.cg-preview {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.cg-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cg-locked-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(53, 37, 25, 0.72), rgba(20, 14, 10, 0.78));
  color: rgba(255, 242, 232, 0.82);
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.cg-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px 18px;
}

.cg-title {
  color: var(--vn-text);
  font-size: 15px;
  font-weight: 600;
}

.cg-route {
  color: var(--vn-text-dim);
  font-size: 12px;
}

.music-gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.music-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
}

.music-card.playing {
  border-color: rgba(224, 145, 171, 0.34);
  background: rgba(255, 245, 247, 0.84);
}

.music-card.locked {
  opacity: 0.56;
}

.music-play-btn {
  min-width: 74px;
  padding: 12px 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(224, 145, 171, 0.92), rgba(198, 154, 78, 0.92));
  color: #fff;
  font-size: 12px;
}

.music-play-btn:disabled {
  background: rgba(149, 128, 112, 0.26);
}

.music-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.music-title {
  color: var(--vn-text);
  font-size: 15px;
  font-weight: 600;
}

.music-scene {
  color: var(--vn-text-dim);
  font-size: 12px;
}

.music-visualizer {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 26px;
}

.viz-bar {
  width: 4px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(224, 145, 171, 1), rgba(198, 154, 78, 1));
  animation: viz-bounce 0.8s ease-in-out infinite alternate;
}

@keyframes viz-bounce {
  0% { height: 6px; }
  100% { height: 22px; }
}

.char-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.char-card {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 18px;
  padding: 22px;
}

.char-portrait {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  border: 1px solid;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.88), rgba(255, 238, 228, 0.68)),
    linear-gradient(180deg, rgba(255, 245, 236, 0.88), rgba(255, 252, 248, 0.92));
  overflow: hidden;
}

.char-portrait-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.char-detail h3 {
  font-family: var(--vn-font-title);
  font-size: 28px;
}

.char-role,
.char-origin,
.char-desc,
.catchphrase {
  color: var(--vn-text-dim);
  line-height: 1.8;
}

.char-role {
  margin-top: 8px;
}

.char-origin {
  margin-top: 4px;
}

.char-desc {
  margin-top: 12px;
  font-size: 14px;
}

.char-catchphrases {
  margin-top: 16px;
}

.catchphrase {
  font-size: 13px;
}

.char-card {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.char-card:hover {
  box-shadow: 0 20px 44px rgba(69, 45, 24, 0.18);
}

.char-card.expanded {
  grid-template-columns: 1fr;
}

.char-expanded-info {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(219, 182, 123, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.char-section { }

.section-title {
  font-size: 13px;
  color: var(--vn-gold);
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}

.rel-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rel-bar-row {
  display: grid;
  grid-template-columns: 36px 1fr 32px;
  align-items: center;
  gap: 10px;
}

.rel-label {
  font-size: 12px;
  color: var(--vn-text-dim);
}

.rel-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(219, 182, 123, 0.15);
  overflow: hidden;
}

.rel-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.rel-value {
  font-size: 12px;
  color: var(--vn-text-dim);
  text-align: right;
}

.rel-stage-badge {
  display: inline-block;
  margin-top: 10px;
  padding: 4px 14px;
  border-radius: 12px;
  border: 1px solid;
  font-size: 12px;
  color: var(--vn-text);
  background: rgba(255, 255, 255, 0.6);
}

.memory-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.memory-entry {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.memory-emotion-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.emotion-warm { background: #F4C2D0; }
.emotion-funny { background: #FFB74D; }
.emotion-bittersweet { background: #7BA7C9; }
.emotion-tense { background: #DC3545; }
.emotion-romantic { background: #c4b5fd; }

.memory-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.memory-text {
  font-size: 14px;
  color: var(--vn-text);
  line-height: 1.6;
}

.memory-meta {
  font-size: 11px;
  color: var(--vn-text-dim);
}

.empty-hint {
  font-size: 13px;
  color: var(--vn-text-dim);
  font-style: italic;
}

.impression-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.impression-tag {
  padding: 3px 10px;
  border-radius: 10px;
  border: 1px solid;
  font-size: 12px;
  color: var(--vn-text);
  background: rgba(255, 255, 255, 0.5);
}

.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(26, 17, 12, 0.78);
  backdrop-filter: blur(12px);
}

.preview-card {
  position: relative;
  width: min(90vw, 1120px);
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 30px 90px rgba(33, 20, 11, 0.36);
}

.preview-image {
  width: 100%;
  display: block;
}

.preview-meta {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 250, 245, 0.32), rgba(38, 23, 16, 0.42));
  backdrop-filter: blur(10px);
  color: #fff7f0;
}

.preview-route {
  color: rgba(255, 227, 190, 0.9);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.preview-title {
  font-family: var(--vn-font-title);
  font-size: clamp(24px, 3vw, 34px);
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
  .gallery-shell {
    padding: 14px 12px 18px;
  }

  .gallery-header {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 18px 16px;
  }

  .gallery-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .char-card {
    grid-template-columns: 1fr;
  }

  .music-card {
    grid-template-columns: 1fr;
  }
}
</style>
