let canvas = null
let ctx = null
let particles = []
let config = { type: 'sakura', count: 40, width: 1280, height: 720 }
let running = false

const PARTICLE_CONFIGS = {
  sakura: {
    color: 'rgba(255, 183, 197, 0.7)',
    sizeRange: [6, 14],
    speedRange: [0.3, 1.2],
    driftRange: [-0.5, 0.5],
    rotationSpeed: 0.02,
    shape: 'petal',
  },
  rain: {
    color: 'rgba(174, 194, 224, 0.4)',
    sizeRange: [1, 2],
    speedRange: [4, 8],
    driftRange: [-0.3, 0.1],
    rotationSpeed: 0,
    shape: 'line',
    lengthRange: [15, 30],
  },
  snow: {
    color: 'rgba(255, 255, 255, 0.7)',
    sizeRange: [2, 6],
    speedRange: [0.3, 1.0],
    driftRange: [-0.8, 0.8],
    rotationSpeed: 0.01,
    shape: 'circle',
  },
  fireflies: {
    color: 'rgba(200, 255, 100, 0.8)',
    sizeRange: [2, 5],
    speedRange: [0.1, 0.5],
    driftRange: [-1, 1],
    rotationSpeed: 0,
    shape: 'glow',
    pulseSpeed: 0.03,
  },
  stars: {
    color: 'rgba(255, 255, 255, 0.8)',
    sizeRange: [1, 3],
    speedRange: [0, 0],
    driftRange: [0, 0],
    rotationSpeed: 0,
    shape: 'dot',
    twinkleSpeed: 0.02,
  },
}

function rand(min, max) { return Math.random() * (max - min) + min }

function createParticle(cfg, full = false) {
  const pc = PARTICLE_CONFIGS[cfg.type] || PARTICLE_CONFIGS.sakura
  return {
    x: rand(0, cfg.width),
    y: full ? rand(0, cfg.height) : rand(-20, -5),
    size: rand(pc.sizeRange[0], pc.sizeRange[1]),
    speed: rand(pc.speedRange[0], pc.speedRange[1]),
    drift: rand(pc.driftRange[0], pc.driftRange[1]),
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: pc.rotationSpeed * (Math.random() > 0.5 ? 1 : -1),
    opacity: rand(0.4, 1.0),
    phase: rand(0, Math.PI * 2),
    length: pc.lengthRange ? rand(pc.lengthRange[0], pc.lengthRange[1]) : 0,
  }
}

function initParticles() {
  particles = []
  for (let i = 0; i < config.count; i++) {
    particles.push(createParticle(config, true))
  }
}

function update(time) {
  const pc = PARTICLE_CONFIGS[config.type] || PARTICLE_CONFIGS.sakura

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    p.y += p.speed
    p.x += p.drift + Math.sin(time * 0.001 + p.phase) * 0.3
    p.rotation += p.rotationSpeed

    if (pc.pulseSpeed) {
      p.opacity = 0.3 + Math.sin(time * pc.pulseSpeed + p.phase) * 0.5
    }
    if (pc.twinkleSpeed) {
      p.opacity = 0.2 + Math.sin(time * pc.twinkleSpeed + p.phase) * 0.6
    }

    if (p.y > config.height + 20 || p.x < -20 || p.x > config.width + 20) {
      Object.assign(p, createParticle(config, false))
    }
  }
}

function draw(time) {
  if (!ctx) return
  const pc = PARTICLE_CONFIGS[config.type] || PARTICLE_CONFIGS.sakura

  ctx.clearRect(0, 0, config.width, config.height)

  for (const p of particles) {
    ctx.globalAlpha = p.opacity
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation)

    switch (pc.shape) {
      case 'petal':
        ctx.fillStyle = pc.color
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'line':
        ctx.strokeStyle = pc.color
        ctx.lineWidth = p.size
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, p.length)
        ctx.stroke()
        break
      case 'circle':
        ctx.fillStyle = pc.color
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'glow':
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3)
        grad.addColorStop(0, pc.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'dot':
        ctx.fillStyle = pc.color
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fill()
        break
    }

    ctx.restore()
  }
  ctx.globalAlpha = 1
}

function loop(time) {
  if (!running) return
  update(time)
  draw(time)
  requestAnimationFrame(loop)
}

self.onmessage = function(e) {
  const { type, data } = e.data

  switch (type) {
    case 'init':
      canvas = data.canvas
      ctx = canvas.getContext('2d')
      config = { ...config, ...data.config }
      canvas.width = config.width
      canvas.height = config.height
      initParticles()
      break

    case 'start':
      running = true
      requestAnimationFrame(loop)
      break

    case 'stop':
      running = false
      if (ctx) ctx.clearRect(0, 0, config.width, config.height)
      break

    case 'resize':
      config.width = data.width
      config.height = data.height
      if (canvas) {
        canvas.width = data.width
        canvas.height = data.height
      }
      break

    case 'changeType':
      config.type = data.type
      config.count = data.count || config.count
      initParticles()
      break
  }
}
