import { ref, reactive } from 'vue'

const PARTICLE_COMPUTE_SHADER = `
struct Particle {
  pos: vec2f,
  vel: vec2f,
  life: f32,
  maxLife: f32,
  size: f32,
  rotation: f32,
  color: vec4f,
  type_id: f32,
  seed: f32,
  _pad: vec2f,
};

struct SimParams {
  deltaTime: f32,
  time: f32,
  gravity: vec2f,
  wind: vec2f,
  attractorPos: vec2f,
  attractorStrength: f32,
  turbulence: f32,
  particleCount: u32,
  bounds: vec4f,
};

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform> params: SimParams;

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2f(1.0, 0.0)), u.x),
    mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), u.x),
    u.y
  );
}

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let idx = gid.x;
  if (idx >= params.particleCount) { return; }

  var p = particles[idx];
  let dt = params.deltaTime;

  p.life -= dt;
  if (p.life <= 0.0) {
    p.life = p.maxLife;
    p.pos = vec2f(
      hash(vec2f(f32(idx), params.time)) * params.bounds.z,
      hash(vec2f(params.time, f32(idx))) * params.bounds.w * -0.1
    );
    p.vel = vec2f(
      (hash(vec2f(f32(idx) * 1.3, params.time * 0.7)) - 0.5) * 50.0,
      hash(vec2f(params.time * 1.1, f32(idx) * 0.9)) * 30.0 + 20.0
    );
  }

  let toAttractor = params.attractorPos - p.pos;
  let dist = max(length(toAttractor), 1.0);
  let attractForce = normalize(toAttractor) * params.attractorStrength / (dist * 0.1);

  let noiseVal = noise(p.pos * 0.005 + params.time * 0.3);
  let turbForce = vec2f(
    cos(noiseVal * 6.283) * params.turbulence,
    sin(noiseVal * 6.283) * params.turbulence
  );

  p.vel += (params.gravity + params.wind + attractForce + turbForce) * dt;

  p.vel *= (1.0 - 0.02 * dt);

  p.pos += p.vel * dt;
  p.rotation += length(p.vel) * 0.01 * dt;

  let lifeRatio = p.life / p.maxLife;
  p.color.a = smoothstep(0.0, 0.1, lifeRatio) * smoothstep(1.0, 0.8, lifeRatio);
  p.size = mix(0.5, 1.5, lifeRatio) * (1.0 + sin(params.time * 3.0 + p.seed * 6.283) * 0.1);

  if (p.pos.y > params.bounds.w) {
    p.pos.y = 0.0;
    p.vel.y *= -0.3;
  }
  if (p.pos.x < 0.0 || p.pos.x > params.bounds.z) {
    p.vel.x *= -0.5;
    p.pos.x = clamp(p.pos.x, 0.0, params.bounds.z);
  }

  particles[idx] = p;
}
`

const PARTICLE_VERTEX_SHADER = `
struct Particle {
  pos: vec2f,
  vel: vec2f,
  life: f32,
  maxLife: f32,
  size: f32,
  rotation: f32,
  color: vec4f,
  type_id: f32,
  seed: f32,
  _pad: vec2f,
};

struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
  @location(1) color: vec4f,
  @location(2) life_ratio: f32,
};

struct Uniforms {
  viewportSize: vec2f,
  baseSize: f32,
  _pad: f32,
};

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

const QUAD_VERTS = array<vec2f, 6>(
  vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
  vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
);

@vertex
fn vs_main(@builtin(vertex_index) vid: u32, @builtin(instance_index) iid: u32) -> VSOut {
  let p = particles[iid];
  var out: VSOut;

  if (p.life <= 0.0) {
    out.pos = vec4f(0.0, 0.0, -2.0, 1.0);
    return out;
  }

  let corner = QUAD_VERTS[vid];
  let size = p.size * uniforms.baseSize;

  let c = cos(p.rotation);
  let s = sin(p.rotation);
  let rotated = vec2f(corner.x * c - corner.y * s, corner.x * s + corner.y * c) * size;

  let screenPos = (p.pos + rotated) / uniforms.viewportSize * 2.0 - 1.0;
  out.pos = vec4f(screenPos.x, -screenPos.y, 0.0, 1.0);
  out.uv = corner * 0.5 + 0.5;
  out.color = p.color;
  out.life_ratio = p.life / p.maxLife;

  return out;
}
`

const PARTICLE_FRAGMENT_SHADER = `
struct FSIn {
  @location(0) uv: vec2f,
  @location(1) color: vec4f,
  @location(2) life_ratio: f32,
};

@fragment
fn fs_main(in: FSIn) -> @location(0) vec4f {
  let dist = length(in.uv - vec2f(0.5));
  let alpha = smoothstep(0.5, 0.2, dist) * in.color.a;
  let glow = exp(-dist * dist * 8.0) * 0.5;
  let finalColor = in.color.rgb + glow;
  return vec4f(finalColor, alpha);
}
`

const PARTICLE_PRESETS = {
  sakura: {
    count: 10000,
    gravity: [0, 15],
    wind: [8, 0],
    turbulence: 30,
    baseSize: 5,
    maxLife: 8,
    color: [1.0, 0.85, 0.9, 0.8],
    attractorStrength: 0,
  },
  fireflies: {
    count: 3000,
    gravity: [0, -3],
    wind: [1, 0],
    turbulence: 50,
    baseSize: 3,
    maxLife: 6,
    color: [0.9, 1.0, 0.5, 0.9],
    attractorStrength: 0,
  },
  codeRain: {
    count: 8000,
    gravity: [0, 80],
    wind: [0, 0],
    turbulence: 5,
    baseSize: 2,
    maxLife: 3,
    color: [0.2, 1.0, 0.4, 0.7],
    attractorStrength: 0,
  },
  fireworks: {
    count: 5000,
    gravity: [0, 40],
    wind: [0, 0],
    turbulence: 10,
    baseSize: 4,
    maxLife: 2,
    color: [1.0, 0.8, 0.3, 1.0],
    attractorStrength: 0,
  },
  heartbeat: {
    count: 4000,
    gravity: [0, -5],
    wind: [0, 0],
    turbulence: 20,
    baseSize: 3,
    maxLife: 3,
    color: [1.0, 0.4, 0.5, 0.9],
    attractorStrength: 50,
  },
  dataVortex: {
    count: 6000,
    gravity: [0, 0],
    wind: [0, 0],
    turbulence: 40,
    baseSize: 2,
    maxLife: 4,
    color: [0.4, 0.7, 1.0, 0.8],
    attractorStrength: 80,
  },
  snow: {
    count: 5000,
    gravity: [0, 20],
    wind: [5, 0],
    turbulence: 15,
    baseSize: 3,
    maxLife: 10,
    color: [0.95, 0.95, 1.0, 0.9],
    attractorStrength: 0,
  },
  embers: {
    count: 3000,
    gravity: [0, -30],
    wind: [3, 0],
    turbulence: 25,
    baseSize: 2,
    maxLife: 4,
    color: [1.0, 0.5, 0.1, 0.9],
    attractorStrength: 0,
  },
}

const isSupported = ref(false)
const isActive = ref(false)
const currentPreset = ref(null)
const particleCount = ref(0)

let _device = null
let _context = null
let _canvas = null
let _computePipeline = null
let _renderPipeline = null
let _particleBuffer = null
let _simParamsBuffer = null
let _renderUniformBuffer = null
let _computeBindGroup = null
let _renderBindGroup = null
let _animFrameId = null
let _startTime = 0

export function useWebGPUParticles() {

  async function initialize(canvas) {
    if (!navigator.gpu) {
      isSupported.value = false
      return false
    }

    try {
      const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' })
      if (!adapter) { isSupported.value = false; return false }

      _device = await adapter.requestDevice({
        requiredLimits: {
          maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
          maxComputeWorkgroupsPerDimension: 65535,
        },
      })

      _canvas = canvas
      _context = canvas.getContext('webgpu')
      const format = navigator.gpu.getPreferredCanvasFormat()
      _context.configure({ device: _device, format, alphaMode: 'premultiplied' })

      _computePipeline = _device.createComputePipeline({
        layout: 'auto',
        compute: { module: _device.createShaderModule({ code: PARTICLE_COMPUTE_SHADER }), entryPoint: 'main' },
      })

      _renderPipeline = _device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: _device.createShaderModule({ code: PARTICLE_VERTEX_SHADER }), entryPoint: 'vs_main' },
        fragment: {
          module: _device.createShaderModule({ code: PARTICLE_FRAGMENT_SHADER }),
          entryPoint: 'fs_main',
          targets: [{
            format,
            blend: {
              color: { srcFactor: 'src-alpha', dstFactor: 'one', operation: 'add' },
              alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
            },
          }],
        },
        primitive: { topology: 'triangle-list' },
      })

      isSupported.value = true
      return true
    } catch {
      isSupported.value = false
      return false
    }
  }

  function startEffect(presetName, options = {}) {
    const preset = PARTICLE_PRESETS[presetName]
    if (!preset || !_device || !_canvas) return false

    stopEffect()

    const count = options.count || preset.count
    particleCount.value = count
    currentPreset.value = presetName

    const PARTICLE_STRIDE = 64
    const particleData = new Float32Array(count * (PARTICLE_STRIDE / 4))
    const w = _canvas.width
    const h = _canvas.height

    for (let i = 0; i < count; i++) {
      const offset = i * (PARTICLE_STRIDE / 4)
      particleData[offset + 0] = Math.random() * w
      particleData[offset + 1] = Math.random() * h
      particleData[offset + 2] = (Math.random() - 0.5) * 20
      particleData[offset + 3] = (Math.random() - 0.5) * 20
      particleData[offset + 4] = Math.random() * preset.maxLife
      particleData[offset + 5] = preset.maxLife
      particleData[offset + 6] = 1.0
      particleData[offset + 7] = Math.random() * Math.PI * 2
      const c = options.color || preset.color
      particleData[offset + 8] = c[0]
      particleData[offset + 9] = c[1]
      particleData[offset + 10] = c[2]
      particleData[offset + 11] = c[3]
      particleData[offset + 12] = 0
      particleData[offset + 13] = Math.random()
      particleData[offset + 14] = 0
      particleData[offset + 15] = 0
    }

    _particleBuffer = _device.createBuffer({
      size: particleData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    })
    _device.queue.writeBuffer(_particleBuffer, 0, particleData)

    _simParamsBuffer = _device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    _renderUniformBuffer = _device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    _computeBindGroup = _device.createBindGroup({
      layout: _computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: _particleBuffer } },
        { binding: 1, resource: { buffer: _simParamsBuffer } },
      ],
    })

    _renderBindGroup = _device.createBindGroup({
      layout: _renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: _particleBuffer } },
        { binding: 1, resource: { buffer: _renderUniformBuffer } },
      ],
    })

    _startTime = performance.now()
    isActive.value = true

    const gravity = options.gravity || preset.gravity
    const wind = options.wind || preset.wind
    const turbulence = options.turbulence ?? preset.turbulence
    const baseSize = options.baseSize ?? preset.baseSize
    const attractorStrength = options.attractorStrength ?? preset.attractorStrength
    const attractorPos = options.attractorPos || [w / 2, h / 2]

    let lastTime = _startTime

    function frame() {
      if (!isActive.value || !_device) return

      const now = performance.now()
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      const elapsed = (now - _startTime) / 1000

      const simParams = new Float32Array([
        dt, elapsed,
        gravity[0], gravity[1],
        wind[0], wind[1],
        attractorPos[0], attractorPos[1],
        attractorStrength, turbulence,
        count, 0,
        0, 0, w, h,
      ])
      _device.queue.writeBuffer(_simParamsBuffer, 0, simParams)

      const renderUniforms = new Float32Array([w, h, baseSize, 0])
      _device.queue.writeBuffer(_renderUniformBuffer, 0, renderUniforms)

      const commandEncoder = _device.createCommandEncoder()

      const computePass = commandEncoder.beginComputePass()
      computePass.setPipeline(_computePipeline)
      computePass.setBindGroup(0, _computeBindGroup)
      computePass.dispatchWorkgroups(Math.ceil(count / 256))
      computePass.end()

      const textureView = _context.getCurrentTexture().createView()
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        }],
      })
      renderPass.setPipeline(_renderPipeline)
      renderPass.setBindGroup(0, _renderBindGroup)
      renderPass.draw(6, count, 0, 0)
      renderPass.end()

      _device.queue.submit([commandEncoder.finish()])
      _animFrameId = requestAnimationFrame(frame)
    }

    _animFrameId = requestAnimationFrame(frame)
    return true
  }

  function stopEffect() {
    isActive.value = false
    currentPreset.value = null
    particleCount.value = 0
    if (_animFrameId) {
      cancelAnimationFrame(_animFrameId)
      _animFrameId = null
    }
    if (_particleBuffer) { _particleBuffer.destroy(); _particleBuffer = null }
    if (_simParamsBuffer) { _simParamsBuffer.destroy(); _simParamsBuffer = null }
    if (_renderUniformBuffer) { _renderUniformBuffer.destroy(); _renderUniformBuffer = null }
  }

  let _attractorX = 0, _attractorY = 0
  function setAttractorPosition(x, y) {
    _attractorX = x
    _attractorY = y
  }

  const _fpsHistory = []
  let _lastAdaptTime = 0
  const adaptiveQuality = ref(1.0)

  function _adaptPerformance(dt) {
    const fps = 1 / Math.max(dt, 0.001)
    _fpsHistory.push(fps)
    if (_fpsHistory.length > 60) _fpsHistory.shift()

    const now = performance.now()
    if (now - _lastAdaptTime < 2000) return
    _lastAdaptTime = now

    const avgFps = _fpsHistory.reduce((a, b) => a + b, 0) / _fpsHistory.length
    if (avgFps < 30 && adaptiveQuality.value > 0.3) {
      adaptiveQuality.value = Math.max(0.3, adaptiveQuality.value - 0.1)
    } else if (avgFps > 55 && adaptiveQuality.value < 1.0) {
      adaptiveQuality.value = Math.min(1.0, adaptiveQuality.value + 0.05)
    }
  }

  function burstAt(x, y, count, presetName, colorOverride) {
    if (!isActive.value || !_device || !_particleBuffer) return
    const preset = PARTICLE_PRESETS[presetName] || PARTICLE_PRESETS.fireworks
    const burstCount = Math.min(count || 200, 500)
    const burstData = new Float32Array(burstCount * 16)

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 30 + Math.random() * 80
      const offset = i * 16
      burstData[offset + 0] = x + (Math.random() - 0.5) * 10
      burstData[offset + 1] = y + (Math.random() - 0.5) * 10
      burstData[offset + 2] = Math.cos(angle) * speed
      burstData[offset + 3] = Math.sin(angle) * speed - 20
      burstData[offset + 4] = 0.5 + Math.random() * 1.5
      burstData[offset + 5] = 2.0
      burstData[offset + 6] = 1.0 + Math.random()
      burstData[offset + 7] = Math.random() * Math.PI * 2
      const c = colorOverride || preset.color
      burstData[offset + 8] = c[0] * (0.8 + Math.random() * 0.4)
      burstData[offset + 9] = c[1] * (0.8 + Math.random() * 0.4)
      burstData[offset + 10] = c[2] * (0.8 + Math.random() * 0.4)
      burstData[offset + 11] = c[3]
      burstData[offset + 12] = 0
      burstData[offset + 13] = Math.random()
      burstData[offset + 14] = 0
      burstData[offset + 15] = 0
    }

    _device.queue.writeBuffer(_particleBuffer, 0, burstData)
  }

  function layerEffect(layers) {
    if (!_device || !_canvas) return
    for (const layer of layers) {
      startEffect(layer.preset, {
        ...layer.options,
        count: Math.floor((layer.options?.count || PARTICLE_PRESETS[layer.preset]?.count || 1000) * adaptiveQuality.value),
      })
    }
  }

  function destroy() {
    stopEffect()
    _device = null
    _context = null
    _canvas = null
    _fpsHistory.length = 0
  }

  return {
    isSupported, isActive, currentPreset, particleCount, adaptiveQuality,
    initialize, startEffect, stopEffect, setAttractorPosition, burstAt, layerEffect, destroy,
    PRESETS: PARTICLE_PRESETS,
  }
}
