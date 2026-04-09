import { assetPath } from '../utils/assetPath.js'

const BACKGROUND_BASE = assetPath('assets/backgrounds')

function bgPath(sceneId, timeId) {
  return `${BACKGROUND_BASE}/${sceneId}/${timeId}.webp`
}

function buildVariants(sceneId, effectPresets) {
  return {
    day: {
      id: `${sceneId}_day`,
      time: 'day',
      image: bgPath(sceneId, 'day'),
      thumbnail: bgPath(sceneId, 'day'),
      effectPreset: effectPresets.day,
    },
    evening: {
      id: `${sceneId}_evening`,
      time: 'evening',
      image: bgPath(sceneId, 'evening'),
      thumbnail: bgPath(sceneId, 'evening'),
      effectPreset: effectPresets.evening,
    },
    night: {
      id: `${sceneId}_night`,
      time: 'night',
      image: bgPath(sceneId, 'night'),
      thumbnail: bgPath(sceneId, 'night'),
      effectPreset: effectPresets.night,
    },
  }
}

export const locations = {
  school_gate: {
    id: 'school_gate',
    name: '校门前',
    description: '樱风拂过的学园入口',
    effectPreset: 'spring_day',
    meetCharacter: null,
    variants: buildVariants('school_gate', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'blue_night',
    }),
  },
  hallway: {
    id: 'hallway',
    name: '教学楼走廊',
    description: '午后光影斜落的长廊',
    effectPreset: 'spring_day',
    meetCharacter: null,
    variants: buildVariants('hallway', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'blue_night',
    }),
  },
  classroom: {
    id: 'classroom',
    name: '教室',
    description: '明亮却藏着心事的教室',
    effectPreset: 'spring_day',
    meetCharacter: 'yoshino',
    variants: buildVariants('classroom', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'blue_night',
    }),
  },
  computer_room: {
    id: 'computer_room',
    name: '计算机教室',
    description: '屏幕荧光与代码声交织的房间',
    effectPreset: 'spring_day',
    meetCharacter: 'nene',
    variants: buildVariants('computer_room', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'lab_night_glow',
    }),
  },
  library: {
    id: 'library',
    name: '图书馆',
    description: '书页与阳光都很安静',
    effectPreset: 'spring_day',
    meetCharacter: 'kanna',
    variants: buildVariants('library', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'blue_night',
    }),
  },
  rooftop: {
    id: 'rooftop',
    name: '天台',
    description: '风会把心跳声也带走的高处',
    effectPreset: 'spring_day',
    meetCharacter: 'ayase',
    variants: buildVariants('rooftop', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'fireworks_bloom',
    }),
  },
  cafeteria: {
    id: 'cafeteria',
    name: '食堂',
    description: '带着暖香与闲聊声的午间角落',
    effectPreset: 'spring_day',
    meetCharacter: null,
    variants: buildVariants('cafeteria', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'blue_night',
    }),
  },
  school_yard: {
    id: 'school_yard',
    name: '校园庭院',
    description: '樱花与青草味都很近的中庭',
    effectPreset: 'spring_day',
    meetCharacter: null,
    variants: buildVariants('school_yard', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'blue_night',
    }),
  },
  festival: {
    id: 'festival',
    name: '文化祭会场',
    description: '彩旗、灯火与喧闹都在这里汇合',
    effectPreset: 'festival_lantern',
    meetCharacter: null,
    variants: buildVariants('festival', {
      day: 'spring_day',
      evening: 'festival_lantern',
      night: 'festival_lantern',
    }),
  },
  player_room: {
    id: 'player_room',
    name: '自己的房间',
    description: '夜深后最适合整理心情与代码的地方',
    effectPreset: 'spring_day',
    meetCharacter: null,
    variants: buildVariants('player_room', {
      day: 'spring_day',
      evening: 'golden_hour',
      night: 'blue_night',
    }),
  },
}

export const backgroundCatalog = Object.values(locations).reduce((catalog, location) => {
  Object.values(location.variants).forEach((variant) => {
    catalog[variant.id] = {
      ...variant,
      sceneId: location.id,
      name: `${location.name} · ${timeLabel(variant.time)}`,
      description: location.description,
      meetCharacter: location.meetCharacter,
    }
  })
  return catalog
}, {
  black: { id: 'black', sceneId: 'black', time: 'night', image: null, thumbnail: null, effectPreset: 'black', name: '黑场', description: '' },
})

export function timeLabel(timeId) {
  if (timeId === 'day') return '白天'
  if (timeId === 'evening') return '傍晚'
  return '夜晚'
}

export function normalizeTimeId(input) {
  if (input === 'evening' || input === 'night' || input === 'day') return input
  if (input === 'morning' || input === 'noon') return 'day'
  return 'day'
}

export function sceneIdFromBackgroundId(input) {
  return String(input || '').replace(/_(day|evening|night)$/, '')
}

export function resolveBackgroundId(locationId, timeId = 'day') {
  if (backgroundCatalog[locationId]) return locationId
  const location = locations[sceneIdFromBackgroundId(locationId)]
  if (!location) return locationId
  return location.variants[normalizeTimeId(timeId)].id
}

export function getBackgroundEntry(backgroundId) {
  if (!backgroundId) return backgroundCatalog.black
  if (backgroundCatalog[backgroundId]) return backgroundCatalog[backgroundId]
  return backgroundCatalog[resolveBackgroundId(backgroundId)]
}

export function getLocationCard(locationId, timeId = 'day') {
  const location = locations[sceneIdFromBackgroundId(locationId)]
  if (!location) return null
  const variant = location.variants[normalizeTimeId(timeId)]
  return {
    ...location,
    thumbnail: variant.thumbnail,
    image: variant.image,
    backgroundId: variant.id,
    effectPreset: variant.effectPreset,
  }
}
