<template>
  <canvas
    v-show="hasContent"
    ref="canvasRef"
    class="canvas-overlay"
    :width="canvasWidth"
    :height="canvasHeight"
  />
</template>

<script setup>
import { ref, inject, watch, onMounted, onUnmounted, nextTick } from 'vue'

const canvasRef = ref(null)
const hasContent = ref(false)
const canvasWidth = ref(800)
const canvasHeight = ref(600)

const engine = inject('engine')
const particles = ref([])
let animFrameId = null

function resizeCanvas() {
  const el = canvasRef.value?.parentElement
  if (!el) return
  canvasWidth.value = el.clientWidth
  canvasHeight.value = el.clientHeight
}

function processCommands(commands) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  for (const cmd of commands) {
    switch (cmd.op) {
      case 'clear':
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        hasContent.value = false
        break
      case 'set_alpha':
        ctx.globalAlpha = cmd.alpha
        break
      case 'circle':
        ctx.beginPath()
        ctx.arc(cmd.x, cmd.y, cmd.r, 0, Math.PI * 2)
        if (cmd.fill) { ctx.fillStyle = cmd.color; ctx.fill() }
        else { ctx.strokeStyle = cmd.color; ctx.stroke() }
        hasContent.value = true
        break
      case 'rect':
        if (cmd.fill) { ctx.fillStyle = cmd.color; ctx.fillRect(cmd.x, cmd.y, cmd.w, cmd.h) }
        else { ctx.strokeStyle = cmd.color; ctx.strokeRect(cmd.x, cmd.y, cmd.w, cmd.h) }
        hasContent.value = true
        break
      case 'line':
        ctx.beginPath()
        ctx.moveTo(cmd.x1, cmd.y1)
        ctx.lineTo(cmd.x2, cmd.y2)
        ctx.strokeStyle = cmd.color
        ctx.lineWidth = cmd.width || 2
        ctx.stroke()
        hasContent.value = true
        break
      case 'text':
        ctx.fillStyle = cmd.color
        ctx.font = `${cmd.size || 16}px ${cmd.font || '"Noto Sans SC", sans-serif'}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(cmd.content, cmd.x, cmd.y)
        hasContent.value = true
        break
      case 'polygon':
        if (cmd.points?.length >= 2) {
          ctx.beginPath()
          ctx.moveTo(cmd.points[0][0], cmd.points[0][1])
          for (let i = 1; i < cmd.points.length; i++) {
            ctx.lineTo(cmd.points[i][0], cmd.points[i][1])
          }
          ctx.closePath()
          if (cmd.fill) { ctx.fillStyle = cmd.color; ctx.fill() }
          else { ctx.strokeStyle = cmd.color; ctx.stroke() }
          hasContent.value = true
        }
        break
      case 'arc':
        ctx.beginPath()
        ctx.arc(cmd.x, cmd.y, cmd.r, cmd.start || 0, cmd.end || Math.PI * 2)
        ctx.strokeStyle = cmd.color
        ctx.lineWidth = cmd.width || 2
        ctx.stroke()
        hasContent.value = true
        break
      case 'bezier':
        ctx.beginPath()
        ctx.moveTo(cmd.x1, cmd.y1)
        ctx.bezierCurveTo(cmd.cp1x, cmd.cp1y, cmd.cp2x, cmd.cp2y, cmd.x2, cmd.y2)
        ctx.strokeStyle = cmd.color
        ctx.lineWidth = cmd.width || 2
        ctx.stroke()
        hasContent.value = true
        break
      case 'gradient_rect': {
        const grad = ctx.createLinearGradient(cmd.x, cmd.y, cmd.x + cmd.w, cmd.y + cmd.h)
        const colors = cmd.colors || []
        colors.forEach((c, i) => grad.addColorStop(i / Math.max(colors.length - 1, 1), c))
        ctx.fillStyle = grad
        ctx.fillRect(cmd.x, cmd.y, cmd.w, cmd.h)
        hasContent.value = true
        break
      }
      case 'particles':
        spawnParticles(cmd)
        hasContent.value = true
        break
    }
  }
  ctx.globalAlpha = 1.0
}

function spawnParticles(cmd) {
  const count = Math.min(cmd.count || 20, 100)
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = (cmd.speed || 100) * (0.5 + Math.random() * 0.5)
    particles.value.push({
      x: cmd.x + (Math.random() - 0.5) * (cmd.spread || 50),
      y: cmd.y + (Math.random() - 0.5) * (cmd.spread || 50),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30,
      color: cmd.color || '#FFD700',
      life: cmd.lifetime || 2.0,
      maxLife: cmd.lifetime || 2.0,
      size: 2 + Math.random() * 4,
    })
  }
  if (!animFrameId) startParticleLoop()
}

function startParticleLoop() {
  let lastTime = performance.now()
  function loop(now) {
    const dt = (now - lastTime) / 1000
    lastTime = now
    updateParticles(dt)
    renderParticles()
    if (particles.value.length > 0) {
      animFrameId = requestAnimationFrame(loop)
    } else {
      animFrameId = null
      if (!hasContent.value) {
        const canvas = canvasRef.value
        if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }
  animFrameId = requestAnimationFrame(loop)
}

function updateParticles(dt) {
  for (const p of particles.value) {
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.vy += 40 * dt
    p.life -= dt
  }
  particles.value = particles.value.filter(p => p.life > 0)
}

function renderParticles() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  for (const p of particles.value) {
    const alpha = Math.max(0, p.life / p.maxLife)
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1.0
}

watch(() => engine?.worldVM?.pendingCanvasCommands?.value?.length, () => {
  if (!engine?.worldVM) return
  const cmds = engine.worldVM.consumeCanvasCommands()
  if (cmds.length) processCommands(cmds)
})

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (animFrameId) cancelAnimationFrame(animFrameId)
})
</script>

<style scoped>
.canvas-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 25;
}
</style>
