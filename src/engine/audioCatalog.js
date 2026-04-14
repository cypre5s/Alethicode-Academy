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
  nostalgia: audioPath('bgm/bgm_11_nostalgia.mp3'),
  gentle_rain: audioPath('bgm/bgm_12_gentle_rain.mp3'),
  determination: audioPath('bgm/bgm_13_determination.mp3'),
  playful: audioPath('bgm/bgm_14_playful.mp3'),
  study: audioPath('bgm/bgm_15_study.mp3'),
  confession: audioPath('bgm/bgm_16_confession.mp3'),
  comedy: audioPath('bgm/bgm_17_comedy.mp3'),
  heartache: audioPath('bgm/bgm_18_heartache.mp3'),
  victory: audioPath('bgm/bgm_19_victory.mp3'),
  night_walk: audioPath('bgm/bgm_20_night_walk.mp3'),
  spring_breeze: audioPath('bgm/bgm_21_spring_breeze.mp3'),
  summer_sun: audioPath('bgm/bgm_22_summer_sun.mp3'),
  autumn_leaves: audioPath('bgm/bgm_23_autumn_leaves.mp3'),
  winter_cold: audioPath('bgm/bgm_24_winter_cold.mp3'),
  club_activity: audioPath('bgm/bgm_25_club_activity.mp3'),
  warmth: audioPath('bgm/bgm_26_warmth.mp3'),
  anxiety: audioPath('bgm/bgm_27_anxiety.mp3'),
  hope: audioPath('bgm/bgm_28_hope.mp3'),
  together: audioPath('bgm/bgm_29_together.mp3'),
  starry_night: audioPath('bgm/bgm_30_starry_night.mp3'),
  daily_b: audioPath('bgm/bgm_31_daily_b.mp3'),
  peaceful_b: audioPath('bgm/bgm_32_peaceful_b.mp3'),
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
