import { assetPath } from '../utils/assetPath.js'

const basePath = assetPath('assets/characters')

export const characterSpriteMap = {
  nene: {
    normal: `${basePath}/nene/normal.webp`,
    smile: `${basePath}/nene/smile.webp`,
    gentle_smile: `${basePath}/nene/gentle_smile.webp`,
    blush: `${basePath}/nene/blush.webp`,
    confused: `${basePath}/nene/confused.webp`,
    surprised: `${basePath}/nene/surprised.webp`,
    sad: `${basePath}/nene/sad.webp`,
    thinking: `${basePath}/nene/thinking.webp`,
  },
  yoshino: {
    normal: `${basePath}/yoshino/normal.webp`,
    cold: `${basePath}/yoshino/cold.webp`,
    slight_smile: `${basePath}/yoshino/slight_smile.webp`,
    blush: `${basePath}/yoshino/blush.webp`,
    tsundere_pout: `${basePath}/yoshino/tsundere_pout.webp`,
    angry: `${basePath}/yoshino/angry.webp`,
    glasses_adjust: `${basePath}/yoshino/glasses_adjust.webp`,
    rare_gentle: `${basePath}/yoshino/rare_gentle.webp`,
  },
  ayase: {
    normal: `${basePath}/ayase/normal.webp`,
    grin: `${basePath}/ayase/grin.webp`,
    competitive: `${basePath}/ayase/competitive.webp`,
    blush: `${basePath}/ayase/blush.webp`,
    pout: `${basePath}/ayase/pout.webp`,
    fired_up: `${basePath}/ayase/fired_up.webp`,
    surprised: `${basePath}/ayase/surprised.webp`,
    soft_smile: `${basePath}/ayase/soft_smile.webp`,
  },
  kanna: {
    normal: `${basePath}/kanna/normal.webp`,
    slight_smile: `${basePath}/kanna/slight_smile.webp`,
    absorbed: `${basePath}/kanna/absorbed.webp`,
    blush: `${basePath}/kanna/blush.webp`,
    surprised: `${basePath}/kanna/surprised.webp`,
    contemplative: `${basePath}/kanna/contemplative.webp`,
    warm_smile: `${basePath}/kanna/warm_smile.webp`,
    teary: `${basePath}/kanna/teary.webp`,
  },
  murasame: {
    normal: `${basePath}/murasame/normal.webp`,
    smirk: `${basePath}/murasame/smirk.webp`,
    impressed: `${basePath}/murasame/impressed.webp`,
    blush: `${basePath}/murasame/blush.webp`,
    cold: `${basePath}/murasame/cold.webp`,
    genuine_smile: `${basePath}/murasame/genuine_smile.webp`,
    vulnerable: `${basePath}/murasame/vulnerable.webp`,
    fierce: `${basePath}/murasame/fierce.webp`,
  },
}

export function getCharacterSprite(characterId, expression = 'normal') {
  const spriteGroup = characterSpriteMap[characterId]
  if (!spriteGroup) return null
  return spriteGroup[expression] || spriteGroup.normal || null
}
