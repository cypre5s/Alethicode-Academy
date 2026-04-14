import { ref, reactive } from 'vue'

const FULLSCREEN_QUAD_VERT = `
struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VSOut {
  var out: VSOut;
  let x = f32((vid & 1u) << 1u) - 1.0;
  let y = f32((vid & 2u)) - 1.0;
  out.pos = vec4f(x, y, 0.0, 1.0);
  out.uv = vec2f((x + 1.0) * 0.5, (1.0 - y) * 0.5);
  return out;
}
`

const BLOOM_EXTRACT_FRAG = `
@group(0) @binding(0) var srcTex: texture_2d<f32>;
@group(0) @binding(1) var srcSampler: sampler;

struct Params { threshold: f32, intensity: f32, _pad: vec2f };
@group(0) @binding(2) var<uniform> params: Params;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let color = textureSample(srcTex, srcSampler, uv);
  let luminance = dot(color.rgb, vec3f(0.2126, 0.7152, 0.0722));
  let bloom = max(vec3f(0.0), color.rgb * (luminance - params.threshold) / max(luminance, 0.001));
  return vec4f(bloom * params.intensity, 1.0);
}
`

const GAUSSIAN_BLUR_FRAG = `
@group(0) @binding(0) var srcTex: texture_2d<f32>;
@group(0) @binding(1) var srcSampler: sampler;

struct BlurParams { direction: vec2f, texelSize: vec2f };
@group(0) @binding(2) var<uniform> blurParams: BlurParams;

const KERNEL = array<f32, 5>(0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  var result = textureSample(srcTex, srcSampler, uv) * KERNEL[0];
  for (var i = 1; i < 5; i++) {
    let offset = blurParams.direction * blurParams.texelSize * f32(i);
    result += textureSample(srcTex, srcSampler, uv + offset) * KERNEL[i];
    result += textureSample(srcTex, srcSampler, uv - offset) * KERNEL[i];
  }
  return result;
}
`

const DOF_FRAG = `
@group(0) @binding(0) var sceneTex: texture_2d<f32>;
@group(0) @binding(1) var blurTex: texture_2d<f32>;
@group(0) @binding(2) var srcSampler: sampler;

struct DOFParams { focusPoint: vec2f, focusRange: f32, blurStrength: f32 };
@group(0) @binding(3) var<uniform> dofParams: DOFParams;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let sharp = textureSample(sceneTex, srcSampler, uv);
  let blurred = textureSample(blurTex, srcSampler, uv);
  let dist = distance(uv, dofParams.focusPoint);
  let blurFactor = smoothstep(dofParams.focusRange * 0.5, dofParams.focusRange, dist) * dofParams.blurStrength;
  return mix(sharp, blurred, clamp(blurFactor, 0.0, 1.0));
}
`

const GOD_RAYS_FRAG = `
@group(0) @binding(0) var srcTex: texture_2d<f32>;
@group(0) @binding(1) var srcSampler: sampler;

struct RayParams {
  lightPos: vec2f,
  decay: f32,
  density: f32,
  weight: f32,
  exposure: f32,
  numSamples: f32,
  _pad: f32,
};
@group(0) @binding(2) var<uniform> rayParams: RayParams;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let deltaUV = (uv - rayParams.lightPos) * (1.0 / rayParams.numSamples) * rayParams.density;
  var sampleUV = uv;
  var illumination = 0.0;
  var decayFactor = 1.0;
  var color = vec3f(0.0);

  for (var i = 0; i < 64; i++) {
    if (f32(i) >= rayParams.numSamples) { break; }
    sampleUV -= deltaUV;
    let sampleColor = textureSample(srcTex, srcSampler, sampleUV);
    let lum = dot(sampleColor.rgb, vec3f(0.299, 0.587, 0.114));
    color += sampleColor.rgb * decayFactor * rayParams.weight;
    illumination += lum * decayFactor * rayParams.weight;
    decayFactor *= rayParams.decay;
  }

  return vec4f(color * rayParams.exposure, 1.0);
}
`

const COLOR_GRADING_FRAG = `
@group(0) @binding(0) var srcTex: texture_2d<f32>;
@group(0) @binding(1) var srcSampler: sampler;

struct GradeParams {
  tint: vec3f,
  saturation: f32,
  contrast: f32,
  brightness: f32,
  vignetteStrength: f32,
  filmGrain: f32,
  time: f32,
  _pad: vec3f,
};
@group(0) @binding(2) var<uniform> gradeParams: GradeParams;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  var color = textureSample(srcTex, srcSampler, uv).rgb;

  color = mix(color, color * gradeParams.tint, 0.3);

  color = (color - 0.5) * gradeParams.contrast + 0.5 + gradeParams.brightness;

  let gray = dot(color, vec3f(0.2126, 0.7152, 0.0722));
  color = mix(vec3f(gray), color, gradeParams.saturation);

  let vignette = 1.0 - dot(uv - 0.5, uv - 0.5) * gradeParams.vignetteStrength;
  color *= clamp(vignette, 0.0, 1.0);

  if (gradeParams.filmGrain > 0.0) {
    let grain = (hash21(uv * 1000.0 + gradeParams.time) - 0.5) * gradeParams.filmGrain;
    color += grain;
  }

  return vec4f(clamp(color, vec3f(0.0), vec3f(1.0)), 1.0);
}
`

const SCREEN_CRACK_FRAG = `
@group(0) @binding(0) var srcTex: texture_2d<f32>;
@group(0) @binding(1) var srcSampler: sampler;

struct CrackParams {
  intensity: f32,
  time: f32,
  crackCenter: vec2f,
  numCracks: f32,
  distortion: f32,
  _pad: vec2f,
};
@group(0) @binding(2) var<uniform> crackParams: CrackParams;

fn hash(p: vec2f) -> f32 { return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453); }

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let toCenter = uv - crackParams.crackCenter;
  let dist = length(toCenter);
  let angle = atan2(toCenter.y, toCenter.x);

  var crackMask = 0.0;
  for (var i = 0; i < 12; i++) {
    if (f32(i) >= crackParams.numCracks) { break; }
    let crackAngle = hash(vec2f(f32(i), 0.0)) * 6.283;
    let angleDiff = abs(angle - crackAngle);
    let nearCrack = smoothstep(0.05, 0.0, min(angleDiff, 6.283 - angleDiff));
    crackMask += nearCrack * smoothstep(0.5, 0.0, dist) * crackParams.intensity;
  }

  let distortedUV = uv + toCenter * crackMask * crackParams.distortion * 0.1;

  var color = textureSample(srcTex, srcSampler, distortedUV);

  let r = textureSample(srcTex, srcSampler, distortedUV + vec2f(0.002, 0.0) * crackMask);
  let b = textureSample(srcTex, srcSampler, distortedUV - vec2f(0.002, 0.0) * crackMask);
  color.r = mix(color.r, r.r, crackMask * 0.5);
  color.b = mix(color.b, b.b, crackMask * 0.5);

  let crackLine = step(0.8, crackMask);
  color = mix(color, vec4f(0.0, 0.0, 0.0, 1.0), crackLine * 0.7);

  let glowColor = vec4f(0.3, 0.8, 1.0, 1.0);
  color = mix(color, glowColor, crackLine * 0.3 * (0.5 + 0.5 * sin(crackParams.time * 5.0)));

  return color;
}
`

const MOOD_PRESETS = {
  romantic: { tint: [1.1, 0.95, 1.0], saturation: 1.1, contrast: 1.0, brightness: 0.02, vignetteStrength: 1.5, filmGrain: 0.0 },
  tension: { tint: [1.0, 0.9, 0.8], saturation: 0.85, contrast: 1.15, brightness: -0.02, vignetteStrength: 2.5, filmGrain: 0.02 },
  mystery: { tint: [0.85, 0.9, 1.1], saturation: 0.8, contrast: 1.1, brightness: -0.05, vignetteStrength: 3.0, filmGrain: 0.03 },
  sad: { tint: [0.9, 0.9, 1.0], saturation: 0.6, contrast: 0.95, brightness: -0.03, vignetteStrength: 2.0, filmGrain: 0.01 },
  peaceful: { tint: [1.0, 1.05, 1.0], saturation: 1.05, contrast: 0.95, brightness: 0.03, vignetteStrength: 0.8, filmGrain: 0.0 },
  festival: { tint: [1.1, 1.0, 0.9], saturation: 1.2, contrast: 1.05, brightness: 0.05, vignetteStrength: 1.0, filmGrain: 0.0 },
  battle: { tint: [1.1, 0.85, 0.85], saturation: 1.1, contrast: 1.2, brightness: 0.0, vignetteStrength: 2.5, filmGrain: 0.02 },
  ending: { tint: [1.0, 0.95, 1.1], saturation: 0.9, contrast: 1.0, brightness: 0.0, vignetteStrength: 2.0, filmGrain: 0.04 },
  memory: { tint: [1.1, 1.0, 0.85], saturation: 0.5, contrast: 0.9, brightness: 0.0, vignetteStrength: 3.0, filmGrain: 0.06 },
}

const effectsEnabled = reactive({
  bloom: false,
  dof: false,
  godRays: false,
  colorGrading: true,
  screenCrack: false,
})

const effectParams = reactive({
  bloom: { threshold: 0.7, intensity: 0.4 },
  dof: { focusX: 0.5, focusY: 0.5, range: 0.3, strength: 0.6 },
  godRays: { lightX: 0.5, lightY: 0.2, decay: 0.96, density: 0.5, weight: 0.3, exposure: 0.5, samples: 48 },
  colorGrading: { ...MOOD_PRESETS.peaceful },
  screenCrack: { intensity: 0, center: [0.5, 0.5], numCracks: 8, distortion: 1.0 },
})

export function useWebGPUPostFX() {

  function setMood(mood) {
    const preset = MOOD_PRESETS[mood]
    if (preset) {
      Object.assign(effectParams.colorGrading, preset)
    }
  }

  function enableBloom(enable = true) { effectsEnabled.bloom = enable }
  function enableDOF(enable = true) { effectsEnabled.dof = enable }
  function enableGodRays(enable = true) { effectsEnabled.godRays = enable }
  function enableColorGrading(enable = true) { effectsEnabled.colorGrading = enable }

  function triggerScreenCrack(intensity = 1.0, centerX = 0.5, centerY = 0.5) {
    effectsEnabled.screenCrack = true
    effectParams.screenCrack.intensity = intensity
    effectParams.screenCrack.center = [centerX, centerY]
  }

  function clearScreenCrack() {
    effectsEnabled.screenCrack = false
    effectParams.screenCrack.intensity = 0
  }

  function setDOFFocus(x, y) {
    effectParams.dof.focusX = x
    effectParams.dof.focusY = y
  }

  function setGodRaysSource(x, y) {
    effectParams.godRays.lightX = x
    effectParams.godRays.lightY = y
  }

  function getShaderSources() {
    return {
      fullscreenVert: FULLSCREEN_QUAD_VERT,
      bloomExtract: BLOOM_EXTRACT_FRAG,
      gaussianBlur: GAUSSIAN_BLUR_FRAG,
      dof: DOF_FRAG,
      godRays: GOD_RAYS_FRAG,
      colorGrading: COLOR_GRADING_FRAG,
      screenCrack: SCREEN_CRACK_FRAG,
    }
  }

  function getCSSFilters() {
    const filters = []
    const cg = effectParams.colorGrading

    if (effectsEnabled.colorGrading) {
      if (cg.saturation !== 1.0) filters.push(`saturate(${cg.saturation})`)
      if (cg.contrast !== 1.0) filters.push(`contrast(${cg.contrast})`)
      if (cg.brightness !== 0) filters.push(`brightness(${1 + cg.brightness})`)
    }

    return filters.length > 0 ? filters.join(' ') : 'none'
  }

  function getVignetteCSS() {
    if (!effectsEnabled.colorGrading) return 'none'
    const strength = effectParams.colorGrading.vignetteStrength || 0
    if (strength <= 0) return 'none'
    const alpha = Math.min(0.6, strength * 0.15)
    return `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${alpha}) 100%)`
  }

  const chromaticAberration = reactive({ enabled: false, intensity: 0, angle: 0 })

  function triggerChromaticAberration(intensity = 1.0, duration = 3000) {
    chromaticAberration.enabled = true
    chromaticAberration.intensity = intensity
    chromaticAberration.angle = Math.random() * Math.PI * 2

    let startTime = performance.now()
    function animate() {
      const elapsed = performance.now() - startTime
      const progress = elapsed / duration
      if (progress >= 1) {
        chromaticAberration.enabled = false
        chromaticAberration.intensity = 0
        return
      }
      chromaticAberration.intensity = intensity * (1 - progress) * (0.8 + 0.2 * Math.sin(elapsed * 0.01))
      chromaticAberration.angle += 0.02
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }

  const screenShake = reactive({ active: false, intensity: 0, x: 0, y: 0 })

  function triggerScreenShake(intensity = 5, duration = 500) {
    screenShake.active = true
    screenShake.intensity = intensity
    const startTime = performance.now()

    function shake() {
      const elapsed = performance.now() - startTime
      if (elapsed >= duration) {
        screenShake.active = false
        screenShake.x = 0
        screenShake.y = 0
        return
      }
      const decay = 1 - elapsed / duration
      screenShake.x = (Math.random() - 0.5) * intensity * decay * 2
      screenShake.y = (Math.random() - 0.5) * intensity * decay * 2
      requestAnimationFrame(shake)
    }
    requestAnimationFrame(shake)
  }

  function lerpMood(targetMood, durationMs = 2000) {
    const target = MOOD_PRESETS[targetMood]
    if (!target) return

    const start = { ...effectParams.colorGrading }
    const startTime = performance.now()
    const keys = ['saturation', 'contrast', 'brightness', 'vignetteStrength', 'filmGrain']

    function animate() {
      const elapsed = performance.now() - startTime
      const t = Math.min(1, elapsed / durationMs)
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

      for (const key of keys) {
        if (start[key] !== undefined && target[key] !== undefined) {
          effectParams.colorGrading[key] = start[key] + (target[key] - start[key]) * ease
        }
      }

      if (target.tint && start.tint) {
        effectParams.colorGrading.tint = start.tint.map((v, i) => v + (target.tint[i] - v) * ease)
      }

      if (t < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }

  function getTransformCSS() {
    const parts = []
    if (screenShake.active) {
      parts.push(`translate(${screenShake.x}px, ${screenShake.y}px)`)
    }
    return parts.length > 0 ? parts.join(' ') : 'none'
  }

  return {
    effectsEnabled,
    effectParams,
    chromaticAberration,
    screenShake,
    MOOD_PRESETS,
    setMood, lerpMood,
    enableBloom, enableDOF, enableGodRays, enableColorGrading,
    triggerScreenCrack, clearScreenCrack,
    triggerChromaticAberration,
    triggerScreenShake,
    setDOFFocus, setGodRaysSource,
    getShaderSources,
    getCSSFilters,
    getVignetteCSS,
    getTransformCSS,
  }
}
