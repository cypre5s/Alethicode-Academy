const _cache = {}

const _loaders = {
  prologue: () => import('./prologue.js'),
  chapter1: () => import('./chapter1.js'),
  chapter2: () => import('./chapter2.js'),
  chapter3: () => import('./chapter3.js'),
  chapter4: () => import('./chapter4.js'),
  chapter5: () => import('./chapter5.js'),
  route_nene: () => import('./routes/nene.js'),
  route_yoshino: () => import('./routes/yoshino.js'),
  route_ayase: () => import('./routes/ayase.js'),
  route_kanna: () => import('./routes/kanna.js'),
  route_murasame: () => import('./routes/murasame.js'),
}

const _chapterModuleMap = {
  prologue: { module: 'prologue', key: 'prologue' },

  chapter1: { module: 'chapter1', key: 'chapter1' },
  ch1_classroom: { module: 'chapter1', key: 'ch1_classroom' },
  ch1_computer: { module: 'chapter1', key: 'ch1_computer' },
  ch1_rooftop: { module: 'chapter1', key: 'ch1_rooftop' },
  ch1_library: { module: 'chapter1', key: 'ch1_library' },
  ch1_afternoon: { module: 'chapter1', key: 'ch1_afternoon' },
  ch1_noon_yoshino: { module: 'chapter1', key: 'ch1_noon_yoshino' },
  ch1_noon_ayase: { module: 'chapter1', key: 'ch1_noon_ayase' },
  ch1_noon_kanna: { module: 'chapter1', key: 'ch1_noon_kanna' },
  ch1_noon_nene: { module: 'chapter1', key: 'ch1_noon_nene' },
  ch1_evening: { module: 'chapter1', key: 'ch1_evening' },
  ch1_eve_yoshino: { module: 'chapter1', key: 'ch1_eve_yoshino' },
  ch1_eve_ayase: { module: 'chapter1', key: 'ch1_eve_ayase' },
  ch1_eve_kanna: { module: 'chapter1', key: 'ch1_eve_kanna' },
  ch1_eve_nene: { module: 'chapter1', key: 'ch1_eve_nene' },
  ch1_night: { module: 'chapter1', key: 'ch1_night' },
  ch1_knock_murasame: { module: 'chapter1', key: 'ch1_knock_murasame' },
  ch1_night_leave: { module: 'chapter1', key: 'ch1_night_leave' },
  ch1_night_end: { module: 'chapter1', key: 'ch1_night_end' },

  chapter2: { module: 'chapter2', key: 'chapter2' },
  ch2_classroom: { module: 'chapter2', key: 'ch2_classroom' },
  ch2_computer: { module: 'chapter2', key: 'ch2_computer' },
  ch2_rooftop: { module: 'chapter2', key: 'ch2_rooftop' },
  ch2_library: { module: 'chapter2', key: 'ch2_library' },
  ch2_afternoon: { module: 'chapter2', key: 'ch2_afternoon' },
  ch2_noon_yoshino: { module: 'chapter2', key: 'ch2_noon_yoshino' },
  ch2_noon_ayase: { module: 'chapter2', key: 'ch2_noon_ayase' },
  ch2_noon_kanna: { module: 'chapter2', key: 'ch2_noon_kanna' },
  ch2_noon_nene: { module: 'chapter2', key: 'ch2_noon_nene' },
  ch2_evening: { module: 'chapter2', key: 'ch2_evening' },
  ch2_competition: { module: 'chapter2', key: 'ch2_competition' },
  ch2_night: { module: 'chapter2', key: 'ch2_night' },
  ch2_eve_yoshino: { module: 'chapter2', key: 'ch2_eve_yoshino' },
  ch2_eve_ayase: { module: 'chapter2', key: 'ch2_eve_ayase' },
  ch2_eve_kanna: { module: 'chapter2', key: 'ch2_eve_kanna' },
  ch2_eve_nene: { module: 'chapter2', key: 'ch2_eve_nene' },

  chapter3: { module: 'chapter3', key: 'chapter3' },
  ch3_classroom: { module: 'chapter3', key: 'ch3_classroom' },
  ch3_computer: { module: 'chapter3', key: 'ch3_computer' },
  ch3_rooftop: { module: 'chapter3', key: 'ch3_rooftop' },
  ch3_library: { module: 'chapter3', key: 'ch3_library' },
  ch3_afternoon: { module: 'chapter3', key: 'ch3_afternoon' },
  ch3_noon_yoshino: { module: 'chapter3', key: 'ch3_noon_yoshino' },
  ch3_noon_ayase: { module: 'chapter3', key: 'ch3_noon_ayase' },
  ch3_noon_kanna: { module: 'chapter3', key: 'ch3_noon_kanna' },
  ch3_noon_nene: { module: 'chapter3', key: 'ch3_noon_nene' },
  ch3_evening: { module: 'chapter3', key: 'ch3_evening' },
  ch3_eve_yoshino: { module: 'chapter3', key: 'ch3_eve_yoshino' },
  ch3_eve_ayase: { module: 'chapter3', key: 'ch3_eve_ayase' },
  ch3_eve_kanna: { module: 'chapter3', key: 'ch3_eve_kanna' },
  ch3_eve_nene: { module: 'chapter3', key: 'ch3_eve_nene' },
  ch3_festival: { module: 'chapter3', key: 'ch3_festival' },
  ch3_murasame_encounter: { module: 'chapter3', key: 'ch3_murasame_encounter' },
  ch3_firework: { module: 'chapter3', key: 'ch3_firework' },
  ch3_firework_nene: { module: 'chapter3', key: 'ch3_firework_nene' },
  ch3_firework_yoshino: { module: 'chapter3', key: 'ch3_firework_yoshino' },
  ch3_firework_ayase: { module: 'chapter3', key: 'ch3_firework_ayase' },
  ch3_firework_kanna: { module: 'chapter3', key: 'ch3_firework_kanna' },

  chapter4: { module: 'chapter4', key: 'chapter4' },
  ch4_classroom: { module: 'chapter4', key: 'ch4_classroom' },
  ch4_computer: { module: 'chapter4', key: 'ch4_computer' },
  ch4_rooftop: { module: 'chapter4', key: 'ch4_rooftop' },
  ch4_library: { module: 'chapter4', key: 'ch4_library' },
  ch4_afternoon: { module: 'chapter4', key: 'ch4_afternoon' },
  ch4_noon_yoshino: { module: 'chapter4', key: 'ch4_noon_yoshino' },
  ch4_noon_ayase: { module: 'chapter4', key: 'ch4_noon_ayase' },
  ch4_noon_kanna: { module: 'chapter4', key: 'ch4_noon_kanna' },
  ch4_noon_nene: { module: 'chapter4', key: 'ch4_noon_nene' },
  ch4_evening: { module: 'chapter4', key: 'ch4_evening' },
  ch4_eve_yoshino: { module: 'chapter4', key: 'ch4_eve_yoshino' },
  ch4_eve_ayase: { module: 'chapter4', key: 'ch4_eve_ayase' },
  ch4_eve_kanna: { module: 'chapter4', key: 'ch4_eve_kanna' },
  ch4_eve_nene: { module: 'chapter4', key: 'ch4_eve_nene' },
  ch4_night: { module: 'chapter4', key: 'ch4_night' },

  chapter5: { module: 'chapter5', key: 'chapter5' },
  ch5_classroom: { module: 'chapter5', key: 'ch5_classroom' },
  ch5_computer: { module: 'chapter5', key: 'ch5_computer' },
  ch5_rooftop: { module: 'chapter5', key: 'ch5_rooftop' },
  ch5_library: { module: 'chapter5', key: 'ch5_library' },
  ch5_afternoon: { module: 'chapter5', key: 'ch5_afternoon' },

  route_nene: { module: 'route_nene', key: 'routeNene' },
  route_yoshino: { module: 'route_yoshino', key: 'routeYoshino' },
  route_ayase: { module: 'route_ayase', key: 'routeAyase' },
  route_kanna: { module: 'route_kanna', key: 'routeKanna' },
  route_murasame: { module: 'route_murasame', key: 'routeMurasame' },

  nene_diary_read: { module: 'route_nene', key: 'nene_diary_read' },
  nene_diary_skip: { module: 'route_nene', key: 'nene_diary_skip' },
  nene_anomaly_start: { module: 'route_nene', key: 'nene_anomaly_start' },
  nene_good_path: { module: 'route_nene', key: 'routeNeneGood' },
  nene_normal_path: { module: 'route_nene', key: 'routeNeneNormal' },
  yoshino_good_path: { module: 'route_yoshino', key: 'routeYoshinoGood' },
  yoshino_normal_path: { module: 'route_yoshino', key: 'routeYoshinoNormal' },
  ayase_good_path: { module: 'route_ayase', key: 'routeAyaseGood' },
  ayase_normal_path: { module: 'route_ayase', key: 'routeAyaseNormal' },
  kanna_good_path: { module: 'route_kanna', key: 'routeKannaGood' },
  kanna_normal_path: { module: 'route_kanna', key: 'routeKannaNormal' },
  murasame_good_path: { module: 'route_murasame', key: 'routeMurasameGood' },
  murasame_normal_path: { module: 'route_murasame', key: 'routeMurasameNormal' },
  murasame_true_path: { module: 'route_murasame', key: 'routeMurasameTrue' },
}

export async function loadScript(chapterId) {
  if (_cache[chapterId]) return _cache[chapterId]

  const mapping = _chapterModuleMap[chapterId]
  if (!mapping) {
    console.warn(`[loadScript] no mapping for "${chapterId}"`)
    return null
  }

  const loader = _loaders[mapping.module]
  if (!loader) {
    console.warn(`[loadScript] no loader for module "${mapping.module}"`)
    return null
  }

  try {
    const mod = await loader()
    for (const [cid, m] of Object.entries(_chapterModuleMap)) {
      if (m.module === mapping.module && mod[m.key]) {
        _cache[cid] = mod[m.key]
      }
    }
  } catch (err) {
    console.error(`[loadScript] failed to load module "${mapping.module}":`, err)
    return null
  }

  return _cache[chapterId] || null
}

export async function preloadModule(moduleName) {
  const loader = _loaders[moduleName]
  if (!loader) return
  try {
    const mod = await loader()
    for (const [cid, m] of Object.entries(_chapterModuleMap)) {
      if (m.module === moduleName && mod[m.key]) {
        _cache[cid] = mod[m.key]
      }
    }
  } catch (err) {
    console.warn(`[preloadModule] failed to preload "${moduleName}":`, err)
  }
}

export function getLoadedScript(chapterId) {
  return _cache[chapterId] || null
}

export function isScriptAvailable(chapterId) {
  return chapterId in _chapterModuleMap
}

// Backward compat: synchronous scriptIndex proxy that returns cached scripts
export const scriptIndex = new Proxy({}, {
  get(_, key) {
    if (key === '__v_isReactive' || key === '__v_isRef' || typeof key === 'symbol') return undefined
    return _cache[key] || undefined
  },
  has(_, key) {
    return key in _chapterModuleMap
  },
  ownKeys() {
    return Object.keys(_chapterModuleMap)
  },
  getOwnPropertyDescriptor(_, key) {
    if (key in _chapterModuleMap) {
      return { configurable: true, enumerable: true, value: _cache[key] }
    }
    return undefined
  }
})
