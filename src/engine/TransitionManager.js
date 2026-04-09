import { ref } from 'vue'

export const TRANSITIONS = {
  fade: { cssClass: 'tr-fade', defaultDuration: 800 },
  slide_left: { cssClass: 'tr-slide-left', defaultDuration: 600 },
  slide_right: { cssClass: 'tr-slide-right', defaultDuration: 600 },
  dissolve: { cssClass: 'tr-dissolve', defaultDuration: 1000 },
  flash: { cssClass: 'tr-flash', defaultDuration: 300 },
  shake: { cssClass: 'tr-shake', defaultDuration: 500 },
  none: { cssClass: '', defaultDuration: 0 },
}

export function useTransitionManager() {
  const activeTransition = ref(null)
  const isTransitioning = ref(false)

  async function transition(type, duration, options = {}) {
    const spec = TRANSITIONS[type] || TRANSITIONS.fade
    const dur = duration || spec.defaultDuration
    if (dur <= 0) return

    isTransitioning.value = true
    activeTransition.value = {
      type,
      cssClass: spec.cssClass,
      duration: dur,
      ...options
    }

    await new Promise(r => setTimeout(r, dur))

    activeTransition.value = null
    isTransitioning.value = false
  }

  function flashScreen(color = '#fff', duration = 300) {
    return transition('flash', duration, { color })
  }

  function shakeScreen(intensity = 5, duration = 500) {
    return transition('shake', duration, { intensity })
  }

  return {
    activeTransition,
    isTransitioning,
    transition,
    flashScreen,
    shakeScreen,
    TRANSITIONS
  }
}
