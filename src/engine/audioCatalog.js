import { assetPath } from '../utils/assetPath.js'

const audioPath = (subPath) => assetPath(`assets/audio/${subPath}`)

export const BGM_ASSET_MAP = {
  title: audioPath('bgm/bgm_01_title.mp3'),
  daily: audioPath('bgm/bgm_02_daily.mp3'),
  peaceful: audioPath('bgm/bgm_03_peaceful.mp3'),
  tension: audioPath('bgm/bgm_05_tension.mp3'),
  romantic: audioPath('bgm/bgm_06_romantic.mp3'),
  sad: audioPath('bgm/bgm_07_sad.mp3'),
  mystery: audioPath('bgm/bgm_08_mystery.mp3'),
  festival: audioPath('bgm/bgm_09_festival.mp3'),
  ending: audioPath('bgm/bgm_10_ending.mp3'),
  battle: audioPath('bgm/battle.mp3'),
  morning_fresh: audioPath('bgm/morning_fresh.mp3'),
  evening_calm: audioPath('bgm/evening_calm.mp3'),
}

export const SFX_ASSET_MAP = {
  bell: audioPath('se/bell.mp3'),
  click: audioPath('se/click.mp3'),
  correct: audioPath('se/correct.mp3'),
  door: audioPath('se/door.mp3'),
  door_creak: audioPath('se/door_creak.mp3'),
  firework: audioPath('se/firework.mp3'),
  heartbeat: audioPath('se/heartbeat.mp3'),
  keyboard_fast: audioPath('se/keyboard_fast.mp3'),
  level_up: audioPath('se/level_up.mp3'),
  page_turn: audioPath('se/page_turn.mp3'),
  save: audioPath('se/save.mp3'),
  select: audioPath('se/select.mp3'),
  surprise: audioPath('se/surprise.mp3'),
  transition: audioPath('se/transition.mp3'),
  typing: audioPath('se/typing.mp3'),
  wind: audioPath('se/wind.mp3'),
  wrong: audioPath('se/wrong.mp3'),
}

export const REQUIRED_BGM_IDS = Object.keys(BGM_ASSET_MAP)
export const REQUIRED_SFX_IDS = Object.keys(SFX_ASSET_MAP)

export function getAudioAssetPath(kind, id) {
  if (kind === 'bgm') return BGM_ASSET_MAP[id] || null
  if (kind === 'sfx') return SFX_ASSET_MAP[id] || null
  return null
}
