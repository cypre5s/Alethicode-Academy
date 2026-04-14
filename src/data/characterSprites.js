import { assetPath } from '../utils/assetPath.js'

const basePath = assetPath('assets/characters')

const EXT = '.webp'

function spriteMap(charId, expressions) {
  const map = {}
  for (const expr of expressions) {
    map[expr] = `${basePath}/${charId}/${expr}${EXT}`
  }
  return map
}

export const characterSpriteMap = {
  nene: spriteMap('nene', ['normal', 'smile', 'gentle_smile', 'blush', 'confused', 'surprised', 'sad', 'thinking']),
  yoshino: spriteMap('yoshino', ['normal', 'cold', 'slight_smile', 'blush', 'tsundere_pout', 'angry', 'glasses_adjust', 'rare_gentle']),
  ayase: spriteMap('ayase', ['normal', 'grin', 'competitive', 'blush', 'pout', 'fired_up', 'surprised', 'soft_smile']),
  kanna: spriteMap('kanna', ['normal', 'slight_smile', 'absorbed', 'blush', 'surprised', 'contemplative', 'warm_smile', 'teary']),
  murasame: spriteMap('murasame', ['normal', 'smirk', 'impressed', 'blush', 'cold', 'genuine_smile', 'vulnerable', 'fierce']),
}

export function getCharacterSprite(characterId, expression = 'normal') {
  const spriteGroup = characterSpriteMap[characterId]
  if (!spriteGroup) return null
  return spriteGroup[expression] || spriteGroup.normal || null
}

export const live2dModelPaths = {
  nene: `${basePath.replace('characters', 'live2d')}/nene/nene.model3.json`,
  yoshino: `${basePath.replace('characters', 'live2d')}/yoshino/yoshino.model3.json`,
  ayase: `${basePath.replace('characters', 'live2d')}/ayase/ayase.model3.json`,
  kanna: `${basePath.replace('characters', 'live2d')}/kanna/kanna.model3.json`,
  murasame: `${basePath.replace('characters', 'live2d')}/murasame/murasame.model3.json`,
}

export function getLive2DModelPath(characterId) {
  return live2dModelPaths[characterId] || null
}
