import { ref, reactive, computed } from 'vue'

const WEATHER_TYPES = {
  clear: { name: '晴天', cssFilter: 'none', bgTint: [1, 1, 1], particleEffect: null, ambientSound: null },
  cloudy: { name: '多云', cssFilter: 'brightness(0.92) contrast(0.95)', bgTint: [0.9, 0.9, 0.95], particleEffect: null, ambientSound: null },
  rain: { name: '雨天', cssFilter: 'brightness(0.82) saturate(0.85) contrast(1.05)', bgTint: [0.8, 0.82, 0.9], particleEffect: 'rain', ambientSound: 'rain_loop' },
  heavyRain: { name: '暴雨', cssFilter: 'brightness(0.7) saturate(0.7) contrast(1.1)', bgTint: [0.7, 0.72, 0.85], particleEffect: 'heavyRain', ambientSound: 'heavy_rain_loop' },
  snow: { name: '雪天', cssFilter: 'brightness(1.05) saturate(0.8)', bgTint: [0.95, 0.95, 1.0], particleEffect: 'snow', ambientSound: 'wind_soft' },
  fog: { name: '雾天', cssFilter: 'brightness(0.9) contrast(0.85) saturate(0.7)', bgTint: [0.9, 0.9, 0.92], particleEffect: 'fog', ambientSound: null },
  sunset: { name: '夕阳', cssFilter: 'sepia(0.15) brightness(1.05) saturate(1.15)', bgTint: [1.1, 0.95, 0.85], particleEffect: null, ambientSound: null },
  night_clear: { name: '晴夜', cssFilter: 'brightness(0.75) saturate(0.6) hue-rotate(10deg)', bgTint: [0.7, 0.7, 0.85], particleEffect: 'fireflies', ambientSound: 'cricket_loop' },
  storm: { name: '雷雨', cssFilter: 'brightness(0.6) contrast(1.2) saturate(0.5)', bgTint: [0.6, 0.6, 0.75], particleEffect: 'heavyRain', ambientSound: 'thunder_loop' },
  cherry_blossom: { name: '樱花飞舞', cssFilter: 'brightness(1.02) saturate(1.1)', bgTint: [1.0, 0.98, 1.0], particleEffect: 'sakura', ambientSound: 'wind_soft' },
}

const SEASON_WEATHER_WEIGHTS = {
  spring: { clear: 0.3, cloudy: 0.15, rain: 0.15, cherry_blossom: 0.3, fog: 0.1 },
  summer: { clear: 0.4, cloudy: 0.1, rain: 0.1, heavyRain: 0.1, storm: 0.05, sunset: 0.25 },
  autumn: { clear: 0.3, cloudy: 0.25, rain: 0.2, fog: 0.15, sunset: 0.1 },
  winter: { clear: 0.2, cloudy: 0.2, snow: 0.35, fog: 0.1, rain: 0.15 },
}

const EMOTION_WEATHER_OVERRIDES = {
  romantic: ['sunset', 'cherry_blossom', 'clear'],
  tension: ['storm', 'heavyRain', 'cloudy'],
  mystery: ['fog', 'night_clear', 'cloudy'],
  sad: ['rain', 'cloudy', 'fog'],
  peaceful: ['clear', 'cherry_blossom', 'sunset'],
  festival: ['clear', 'sunset'],
  battle: ['storm', 'cloudy'],
  ending: ['clear', 'sunset', 'cherry_blossom'],
}

const currentWeather = ref('clear')
const weatherIntensity = ref(1.0)
const isTransitioning = ref(false)

const weatherConfig = reactive({
  enabled: true,
  dynamicMode: true,
  season: 'spring',
  transitionDuration: 3000,
})

let _transitionTimer = null

function _weightedRandom(weights) {
  const entries = Object.entries(weights)
  const total = entries.reduce((s, [, w]) => s + w, 0)
  let roll = Math.random() * total
  for (const [key, weight] of entries) {
    roll -= weight
    if (roll <= 0) return key
  }
  return entries[0][0]
}

export function useWeatherSystem() {

  function setWeather(weatherType, transitionMs) {
    if (!WEATHER_TYPES[weatherType]) return
    if (weatherType === currentWeather.value) return

    const duration = transitionMs ?? weatherConfig.transitionDuration
    if (duration <= 0) {
      currentWeather.value = weatherType
      return
    }

    isTransitioning.value = true
    weatherIntensity.value = 0

    if (_transitionTimer) clearInterval(_transitionTimer)
    const startTime = performance.now()

    _transitionTimer = setInterval(() => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / duration)

      if (progress < 0.5) {
        weatherIntensity.value = 1 - progress * 2
      } else {
        if (progress >= 0.5 && currentWeather.value !== weatherType) {
          currentWeather.value = weatherType
        }
        weatherIntensity.value = (progress - 0.5) * 2
      }

      if (progress >= 1) {
        clearInterval(_transitionTimer)
        _transitionTimer = null
        isTransitioning.value = false
        weatherIntensity.value = 1
      }
    }, 16)
  }

  function setWeatherForEmotion(emotion) {
    if (!weatherConfig.dynamicMode) return
    const candidates = EMOTION_WEATHER_OVERRIDES[emotion]
    if (candidates && candidates.length > 0) {
      const weather = candidates[Math.floor(Math.random() * candidates.length)]
      setWeather(weather)
    }
  }

  function randomizeWeather() {
    const weights = SEASON_WEATHER_WEIGHTS[weatherConfig.season] || SEASON_WEATHER_WEIGHTS.spring
    const weather = _weightedRandom(weights)
    setWeather(weather)
  }

  function setSeason(season) {
    if (['spring', 'summer', 'autumn', 'winter'].includes(season)) {
      weatherConfig.season = season
    }
  }

  const currentWeatherData = computed(() => {
    const data = WEATHER_TYPES[currentWeather.value] || WEATHER_TYPES.clear
    return {
      ...data,
      type: currentWeather.value,
      intensity: weatherIntensity.value,
    }
  })

  function getCSSFilter() {
    const data = WEATHER_TYPES[currentWeather.value]
    if (!data || data.cssFilter === 'none') return 'none'
    return data.cssFilter
  }

  function getParticlePreset() {
    const data = WEATHER_TYPES[currentWeather.value]
    return data?.particleEffect || null
  }

  return {
    currentWeather,
    weatherIntensity,
    isTransitioning,
    weatherConfig,
    currentWeatherData,
    setWeather,
    setWeatherForEmotion,
    randomizeWeather,
    setSeason,
    getCSSFilter,
    getParticlePreset,
    WEATHER_TYPES,
  }
}
