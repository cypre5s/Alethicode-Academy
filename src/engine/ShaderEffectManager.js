import { ref, reactive } from 'vue'

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const SHADERS = {
  bokeh: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;
    uniform vec3 u_tint;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main() {
      vec2 uv = v_uv;
      float aspect = u_resolution.x / u_resolution.y;
      vec3 col = vec3(0.0);
      for (int i = 0; i < 20; i++) {
        float fi = float(i);
        vec2 center = vec2(
          hash(vec2(fi, 0.0)) * aspect,
          hash(vec2(0.0, fi))
        );
        center += vec2(sin(u_time * 0.3 + fi), cos(u_time * 0.2 + fi * 1.3)) * 0.05;
        float size = hash(vec2(fi, fi)) * 0.08 + 0.02;
        float dist = length((uv - vec2(0.5)) * vec2(aspect, 1.0) - (center - vec2(aspect * 0.5, 0.5)));
        float circle = smoothstep(size, size * 0.3, dist);
        float alpha = circle * (0.3 + 0.2 * sin(u_time + fi));
        col += u_tint * alpha * u_intensity;
      }
      gl_FragColor = vec4(col, length(col) * 0.6);
    }
  `,

  codeRain: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;

    float hash(float n) { return fract(sin(n) * 43758.5453); }

    void main() {
      vec2 uv = v_uv;
      float col = 0.0;
      for (int i = 0; i < 30; i++) {
        float fi = float(i);
        float x = hash(fi * 7.3) * 1.0;
        float speed = hash(fi * 3.1) * 2.0 + 1.0;
        float y = fract(u_time * speed * 0.1 + hash(fi));
        float brightness = smoothstep(0.0, 0.3, y) * smoothstep(1.0, 0.7, y);
        float dist = abs(uv.x - x) * u_resolution.x;
        float glow = exp(-dist * dist * 0.5) * brightness;
        float charFlicker = step(0.5, hash(floor(y * 20.0) + fi));
        col += glow * charFlicker * 0.15;
      }
      col *= u_intensity;
      gl_FragColor = vec4(0.1 * col, 0.9 * col, 0.4 * col, col * 0.5);
    }
  `,

  starfield: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main() {
      vec2 uv = v_uv;
      float stars = 0.0;
      for (float layer = 1.0; layer <= 4.0; layer++) {
        vec2 gridUV = uv * (10.0 + layer * 8.0);
        vec2 id = floor(gridUV);
        vec2 f = fract(gridUV) - 0.5;
        float h = hash(id + layer * 100.0);
        if (h > 0.92) {
          float size = (h - 0.92) * 12.5;
          float twinkle = sin(u_time * (1.0 + h * 3.0) + h * 100.0) * 0.5 + 0.5;
          float d = length(f);
          float star = smoothstep(size * 0.15, 0.0, d) * twinkle;
          stars += star * (1.0 / layer);
        }
      }
      float nebula = hash(floor(uv * 3.0)) * 0.03;
      vec3 col = vec3(0.9, 0.95, 1.0) * stars + vec3(0.2, 0.1, 0.3) * nebula;
      gl_FragColor = vec4(col * u_intensity, stars * u_intensity * 0.8);
    }
  `,

  warmGlow: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;

    void main() {
      vec2 uv = v_uv;
      float vignette = 1.0 - length((uv - 0.5) * 1.4);
      vignette = smoothstep(0.0, 0.8, vignette);
      float pulse = sin(u_time * 0.5) * 0.1 + 0.9;
      vec3 warmColor = vec3(1.0, 0.85, 0.65) * vignette * u_intensity * pulse * 0.15;
      gl_FragColor = vec4(warmColor, warmColor.r * 0.3);
    }
  `,

  raindrops: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main() {
      vec2 uv = v_uv;
      float rain = 0.0;
      for (int i = 0; i < 40; i++) {
        float fi = float(i);
        float x = hash(vec2(fi, 0.0));
        float speed = hash(vec2(fi, 1.0)) * 3.0 + 2.0;
        float len = hash(vec2(fi, 2.0)) * 0.03 + 0.02;
        float y = fract(u_time * speed * 0.15 + hash(vec2(fi, 3.0)));
        float dx = abs(uv.x - x);
        float dy = uv.y - (1.0 - y);
        if (dx < 0.002 && dy > 0.0 && dy < len) {
          rain += (1.0 - dy / len) * 0.4;
        }
      }
      rain *= u_intensity;
      vec3 col = vec3(0.6, 0.7, 0.85) * rain;
      gl_FragColor = vec4(col, rain * 0.5);
    }
  `,

  aurora: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;

    void main() {
      vec2 uv = v_uv;
      float y = uv.y;
      float wave1 = sin(uv.x * 4.0 + u_time * 0.4) * 0.08;
      float wave2 = sin(uv.x * 7.0 - u_time * 0.3 + 1.5) * 0.05;
      float wave3 = sin(uv.x * 11.0 + u_time * 0.6 + 3.0) * 0.03;
      float band = smoothstep(0.55 + wave1 + wave2, 0.65 + wave1 + wave2, y)
                  * smoothstep(0.85 + wave3, 0.75 + wave3, y);
      float band2 = smoothstep(0.45 + wave2, 0.55 + wave2, y)
                   * smoothstep(0.7 + wave1, 0.6 + wave1, y) * 0.5;
      vec3 green = vec3(0.1, 0.9, 0.4) * band;
      vec3 purple = vec3(0.5, 0.2, 0.8) * band2;
      vec3 blue = vec3(0.1, 0.4, 0.9) * band * 0.3;
      float shimmer = sin(uv.x * 20.0 + u_time * 2.0) * 0.5 + 0.5;
      vec3 col = (green + purple + blue) * (0.8 + shimmer * 0.2);
      float alpha = (band + band2) * u_intensity;
      gl_FragColor = vec4(col * u_intensity, alpha * 0.6);
    }
  `,

  fireflies: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main() {
      vec2 uv = v_uv;
      float aspect = u_resolution.x / u_resolution.y;
      vec3 col = vec3(0.0);
      for (int i = 0; i < 25; i++) {
        float fi = float(i);
        vec2 pos = vec2(hash(vec2(fi, 0.0)), hash(vec2(0.0, fi)));
        pos.x += sin(u_time * 0.3 + fi * 1.7) * 0.1;
        pos.y += cos(u_time * 0.25 + fi * 2.3) * 0.08;
        float blink = sin(u_time * (1.0 + hash(vec2(fi, fi)) * 2.0) + fi * 3.14) * 0.5 + 0.5;
        blink = blink * blink;
        float dist = length((uv - pos) * vec2(aspect, 1.0));
        float glow = exp(-dist * dist * 800.0) * blink;
        float halo = exp(-dist * dist * 100.0) * blink * 0.3;
        col += vec3(0.95, 0.9, 0.3) * glow + vec3(0.4, 0.6, 0.1) * halo;
      }
      col *= u_intensity;
      gl_FragColor = vec4(col, length(col) * 0.7);
    }
  `,

  sakuraFall: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;

    float hash(float n) { return fract(sin(n) * 43758.5453); }

    void main() {
      vec2 uv = v_uv;
      vec3 col = vec3(0.0);
      for (int i = 0; i < 30; i++) {
        float fi = float(i);
        float x = hash(fi * 7.3);
        float fallSpeed = hash(fi * 3.1) * 0.5 + 0.3;
        float sway = sin(u_time * (0.5 + hash(fi * 11.0) * 0.5) + fi) * 0.06;
        float y = fract(u_time * fallSpeed * 0.08 + hash(fi * 5.7));
        vec2 petalPos = vec2(x + sway, 1.0 - y);
        float dist = length(uv - petalPos);
        float size = 0.008 + hash(fi * 2.0) * 0.006;
        float petal = smoothstep(size, size * 0.2, dist);
        float spin = sin(u_time * 1.5 + fi * 2.0) * 0.5 + 0.5;
        vec3 petalColor = mix(vec3(1.0, 0.75, 0.8), vec3(1.0, 0.85, 0.9), spin);
        col += petalColor * petal * (0.5 + spin * 0.5);
      }
      col *= u_intensity;
      gl_FragColor = vec4(col, length(col) * 0.8);
    }
  `,

  digitalRain: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_intensity;

    float hash(float n) { return fract(sin(n) * 43758.5453); }

    void main() {
      vec2 uv = v_uv;
      float col = 0.0;
      for (int i = 0; i < 50; i++) {
        float fi = float(i);
        float x = hash(fi * 7.3);
        float speed = hash(fi * 3.1) * 3.0 + 1.5;
        float y = fract(u_time * speed * 0.06 + hash(fi));
        float brightness = smoothstep(0.0, 0.15, y) * smoothstep(1.0, 0.6, y);
        float dist = abs(uv.x - x) * u_resolution.x;
        float trail = exp(-dist * dist * 2.0) * brightness;
        float charFlicker = step(0.3, hash(floor(y * 30.0) + fi));
        float headGlow = smoothstep(0.05, 0.0, abs(uv.y - (1.0 - y))) * 2.0;
        col += (trail * charFlicker * 0.12 + trail * headGlow * 0.05);
      }
      col *= u_intensity;
      vec3 green = vec3(0.05, 0.95, 0.3) * col;
      gl_FragColor = vec4(green, col * 0.6);
    }
  `,
}

function detectGPUTier() {
  try {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    if (isMobile) {
      const mem = navigator.deviceMemory || 3
      if (mem <= 3) return 'low'
      return 'medium'
    }
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return 'none'
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ''
    if (/Intel|Mesa|SwiftShader|llvmpipe/i.test(renderer)) return 'low'
    if (/NVIDIA|AMD|Radeon|GeForce|RTX|GTX/i.test(renderer)) return 'high'
    return 'medium'
  } catch { return 'none' }
}

function getQualitySetting() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('alethicode_graphics_quality') || 'medium'
  }
  return 'medium'
}

export function useShaderEffects() {
  const gpuTier = detectGPUTier()
  const qualitySetting = ref(getQualitySetting())
  const isAvailable = ref(gpuTier !== 'none' && qualitySetting.value !== 'low')
  const activeEffects = reactive({})
  const stats = reactive({ fps: 0, drawCalls: 0 })

  if (typeof window !== 'undefined') {
    window.addEventListener('quality-change', (e) => {
      qualitySetting.value = e.detail?.quality || 'medium'
      if (qualitySetting.value === 'low') {
        Object.keys(activeEffects).forEach(k => disableEffect(k))
        isAvailable.value = false
      } else if (gpuTier !== 'none') {
        isAvailable.value = true
      }
    })
  }

  let _canvas = null
  let _gl = null
  let _programs = {}
  let _quadBuffer = null
  let _rafId = null
  let _lastTime = 0
  let _frameCount = 0
  let _fpsTimer = 0

  function initialize(canvas) {
    if (!canvas || !isAvailable.value) return false
    _canvas = canvas
    _gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false })
      || canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!_gl) { isAvailable.value = false; return false }

    const gl = _gl
    _quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, _quadBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    return true
  }

  function _compileShader(name, fragSource) {
    if (_programs[name]) return _programs[name]
    const gl = _gl
    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, VERTEX_SHADER)
    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, fragSource)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.warn(`[Shader] ${name} compile failed:`, gl.getShaderInfoLog(fs))
      return null
    }

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    const locs = {
      a_position: gl.getAttribLocation(program, 'a_position'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_intensity: gl.getUniformLocation(program, 'u_intensity'),
      u_tint: gl.getUniformLocation(program, 'u_tint'),
    }

    _programs[name] = { program, locs }
    return _programs[name]
  }

  function enableEffect(name, options = {}) {
    if (!isAvailable.value || !SHADERS[name]) return
    activeEffects[name] = {
      intensity: options.intensity ?? 1.0,
      tint: options.tint || [1.0, 0.85, 0.65],
      startTime: performance.now(),
      fadeIn: options.fadeIn ?? 1000,
      fadeOut: options.fadeOut ?? 1000,
      duration: options.duration ?? Infinity,
      fading: false,
    }
    if (!_rafId) _startRenderLoop()
  }

  function disableEffect(name) {
    if (activeEffects[name]) {
      activeEffects[name].fading = true
      activeEffects[name]._fadeStart = performance.now()
      setTimeout(() => {
        delete activeEffects[name]
        if (Object.keys(activeEffects).length === 0) _stopRenderLoop()
      }, activeEffects[name].fadeOut || 1000)
    }
  }

  function _startRenderLoop() {
    if (_rafId) return
    _lastTime = performance.now()
    function loop(now) {
      _rafId = requestAnimationFrame(loop)
      _render(now)
      _frameCount++
      if (now - _fpsTimer > 1000) {
        stats.fps = _frameCount
        _frameCount = 0
        _fpsTimer = now
      }
    }
    _rafId = requestAnimationFrame(loop)
  }

  function _stopRenderLoop() {
    if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null }
  }

  function _render(now) {
    const gl = _gl
    if (!gl || !_canvas) return

    _canvas.width = _canvas.clientWidth * (window.devicePixelRatio > 1.5 ? 1.5 : window.devicePixelRatio || 1)
    _canvas.height = _canvas.clientHeight * (window.devicePixelRatio > 1.5 ? 1.5 : window.devicePixelRatio || 1)

    gl.viewport(0, 0, _canvas.width, _canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let draws = 0
    for (const [name, effect] of Object.entries(activeEffects)) {
      const shader = SHADERS[name]
      if (!shader) continue

      const prog = _compileShader(name, shader)
      if (!prog) continue

      let intensity = effect.intensity
      const elapsed = now - effect.startTime
      if (elapsed < effect.fadeIn) intensity *= elapsed / effect.fadeIn
      if (effect.fading) {
        const fadeElapsed = now - (effect._fadeStart || now)
        intensity *= Math.max(0, 1 - fadeElapsed / effect.fadeOut)
      }
      if (effect.duration !== Infinity && elapsed > effect.duration) {
        disableEffect(name)
        continue
      }

      gl.useProgram(prog.program)
      gl.bindBuffer(gl.ARRAY_BUFFER, _quadBuffer)
      gl.enableVertexAttribArray(prog.locs.a_position)
      gl.vertexAttribPointer(prog.locs.a_position, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1f(prog.locs.u_time, now * 0.001)
      gl.uniform2f(prog.locs.u_resolution, _canvas.width, _canvas.height)
      gl.uniform1f(prog.locs.u_intensity, intensity)
      if (prog.locs.u_tint) gl.uniform3fv(prog.locs.u_tint, effect.tint)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      draws++
    }
    stats.drawCalls = draws
  }

  function dispose() {
    _stopRenderLoop()
    if (_gl) {
      Object.values(_programs).forEach(p => _gl.deleteProgram(p.program))
      if (_quadBuffer) _gl.deleteBuffer(_quadBuffer)
    }
    _gl = null
    _canvas = null
    _programs = {}
  }

  return {
    gpuTier,
    isAvailable,
    activeEffects,
    stats,
    initialize,
    enableEffect,
    disableEffect,
    dispose,
  }
}
