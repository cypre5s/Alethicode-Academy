import { createApp } from 'vue'
import App from './App.vue'
import './styles/game.css'
import { initialize as initMobilePerf } from './engine/MobilePerformance.js'
import { initialize as initMemSched } from './engine/MemoryScheduler.js'
import { start as startAdaptiveQuality } from './engine/AdaptiveQuality.js'

initMobilePerf()
initMemSched()
startAdaptiveQuality()

createApp(App).mount('#app')

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
