import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { BGM_ASSET_MAP, SFX_ASSET_MAP } from '../src/engine/audioCatalog.js'

const ROOT = process.cwd()

function assetToFilePath(assetPath) {
  return path.join(ROOT, 'public', assetPath.replace(/^\//, ''))
}

function expectMp3FileExists(label, assetPath) {
  const filePath = assetToFilePath(assetPath)
  assert.equal(path.extname(filePath), '.mp3', `${label} 必须为 mp3: ${assetPath}`)
  assert.ok(fs.existsSync(filePath), `${label} 文件不存在: ${filePath}`)
}

test('BGM 资源映射全部落盘', () => {
  Object.entries(BGM_ASSET_MAP).forEach(([id, assetPath]) => {
    expectMp3FileExists(`BGM(${id})`, assetPath)
  })
})

test('SE 资源映射全部落盘', () => {
  Object.entries(SFX_ASSET_MAP).forEach(([id, assetPath]) => {
    expectMp3FileExists(`SE(${id})`, assetPath)
  })
})
