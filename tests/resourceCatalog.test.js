import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { GAME_CONFIG } from '../src/data/gameConfig.js'
import { cgCatalog } from '../src/data/cgCatalog.js'
import { backgroundCatalog, locations } from '../src/data/locations.js'

const ROOT = process.cwd()
const EXPECTED_SCENES = [
  'school_gate',
  'hallway',
  'classroom',
  'computer_room',
  'library',
  'rooftop',
  'cafeteria',
  'school_yard',
  'festival',
  'player_room',
]
const EXPECTED_TIMES = ['day', 'evening', 'night']
const ALLOWED_EFFECT_PRESETS = new Set([
  'spring_day',
  'golden_hour',
  'blue_night',
  'lab_night_glow',
  'festival_lantern',
  'fireworks_bloom',
  'black',
])

function assetToFilePath(assetPath) {
  return path.join(ROOT, 'public', assetPath.replace(/^\//, ''))
}

function walkFiles(dirPath) {
  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) return walkFiles(fullPath)
    return [fullPath]
  })
}

test('背景目录与 catalog 一致（10 场景 x 3 时段 = 30）', () => {
  assert.deepEqual(Object.keys(locations), EXPECTED_SCENES)

  let variantCount = 0
  EXPECTED_SCENES.forEach((sceneId) => {
    const scene = locations[sceneId]
    assert.deepEqual(Object.keys(scene.variants), EXPECTED_TIMES)

    EXPECTED_TIMES.forEach((timeId) => {
      const variant = scene.variants[timeId]
      variantCount += 1
      assert.equal(variant.id, `${sceneId}_${timeId}`)
      assert.ok(ALLOWED_EFFECT_PRESETS.has(variant.effectPreset), `非法背景特效预设: ${variant.effectPreset}`)

      const imageFile = assetToFilePath(variant.image)
      const thumbFile = assetToFilePath(variant.thumbnail)
      assert.equal(path.extname(imageFile), '.webp')
      assert.ok(fs.existsSync(imageFile), `背景主图缺失: ${imageFile}`)
      assert.ok(fs.existsSync(thumbFile), `背景缩略图缺失: ${thumbFile}`)

      assert.ok(backgroundCatalog[variant.id], `backgroundCatalog 缺少: ${variant.id}`)
    })
  })

  assert.equal(variantCount, 30)

  const catalogWithImage = Object.values(backgroundCatalog).filter((entry) => entry.image)
  assert.equal(catalogWithImage.length, 30)
})

test('CG catalog 与 GAME_CONFIG.CG_LIST/磁盘文件一致（18 张）', () => {
  const catalogIds = Object.keys(cgCatalog)
  assert.deepEqual(catalogIds, GAME_CONFIG.CG_LIST)
  assert.equal(catalogIds.length, 18)

  catalogIds.forEach((cgId) => {
    const entry = cgCatalog[cgId]
    assert.ok(ALLOWED_EFFECT_PRESETS.has(entry.effectPreset), `非法 CG 特效预设: ${entry.effectPreset}`)

    const imageFile = assetToFilePath(entry.image)
    const thumbFile = assetToFilePath(entry.thumbnail)
    assert.equal(path.extname(imageFile), '.webp')
    assert.ok(fs.existsSync(imageFile), `CG 主图缺失: ${imageFile}`)
    assert.ok(fs.existsSync(thumbFile), `CG 缩略图缺失: ${thumbFile}`)
  })
})

test('背景与 CG 目录不允许出现 svg 占位资源', () => {
  const bgDir = path.join(ROOT, 'public', 'assets', 'backgrounds')
  const cgDir = path.join(ROOT, 'public', 'assets', 'cg')
  const badFiles = [...walkFiles(bgDir), ...walkFiles(cgDir)].filter((filePath) => filePath.endsWith('.svg'))
  assert.deepEqual(badFiles, [])
})

test('脚本中不再使用旧背景命名', () => {
  const scriptsDir = path.join(ROOT, 'src', 'scripts')
  const legacyPatterns = [
    'school_gate_morning',
    'sunset_classroom',
    'night_computer_room',
  ]

  const offenders = walkFiles(scriptsDir).flatMap((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8')
    return legacyPatterns
      .filter((pattern) => source.includes(pattern))
      .map((pattern) => `${path.relative(ROOT, filePath)} -> ${pattern}`)
  })

  assert.deepEqual(offenders, [])
})
