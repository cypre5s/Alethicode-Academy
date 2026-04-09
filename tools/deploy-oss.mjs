/**
 * 阿里云 OSS 部署脚本
 * 将 Vite 构建产物上传到阿里云香港 OSS Bucket（静态网站托管）
 *
 * 用法：npm run deploy:oss
 * 配置：在项目根目录创建 .env.deploy 文件（参考 .env.deploy.example）
 */

import { execSync } from 'child_process'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname, relative } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.wasm': 'application/wasm',
}

function loadEnv() {
  const envPath = join(ROOT, '.env.deploy')
  let content
  try {
    content = readFileSync(envPath, 'utf-8')
  } catch {
    console.error('❌ 找不到 .env.deploy 文件')
    console.error('   请复制 .env.deploy.example 为 .env.deploy 并填入你的 OSS 配置')
    process.exit(1)
  }

  const env = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    env[key] = val
  }

  const required = ['OSS_REGION', 'OSS_ACCESS_KEY_ID', 'OSS_ACCESS_KEY_SECRET', 'OSS_BUCKET']
  for (const key of required) {
    if (!env[key]) {
      console.error(`❌ .env.deploy 缺少必填项: ${key}`)
      process.exit(1)
    }
  }
  return env
}

function collectFiles(dir, base = dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...collectFiles(full, base))
    } else {
      files.push({
        localPath: full,
        ossKey: relative(base, full).replace(/\\/g, '/'),
      })
    }
  }
  return files
}

function getCacheControl(ossKey) {
  if (ossKey === 'index.html') {
    return 'no-cache, no-store, must-revalidate'
  }
  if (ossKey.startsWith('assets/')) {
    return 'public, max-age=31536000, immutable'
  }
  return 'public, max-age=86400'
}

function getContentType(filePath) {
  const ext = extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

async function deploy() {
  const env = loadEnv()

  console.log('📦 构建项目...')
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' })

  const require = createRequire(import.meta.url)
  let OSS
  try {
    OSS = require('ali-oss')
  } catch {
    console.log('📥 安装 ali-oss 依赖...')
    execSync('npm install ali-oss --no-save', { cwd: ROOT, stdio: 'inherit' })
    OSS = require('ali-oss')
  }

  const client = new OSS({
    region: env.OSS_REGION,
    accessKeyId: env.OSS_ACCESS_KEY_ID,
    accessKeySecret: env.OSS_ACCESS_KEY_SECRET,
    bucket: env.OSS_BUCKET,
    secure: true,
    timeout: 120000,
  })

  const files = collectFiles(DIST)
  console.log(`\n🚀 上传 ${files.length} 个文件到 OSS (${env.OSS_BUCKET})...\n`)

  let uploaded = 0
  let failed = 0

  for (const file of files) {
    const contentType = getContentType(file.localPath)
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': getCacheControl(file.ossKey),
      'Content-Disposition': 'inline',
    }
    if (contentType.startsWith('text/') || contentType.includes('javascript') || contentType.includes('json')) {
      headers['x-oss-forbid-overwrite'] = 'false'
    }

    let success = false
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await client.put(file.ossKey, file.localPath, { headers })
        uploaded++
        process.stdout.write(`  ✅ [${uploaded}/${files.length}] ${file.ossKey}\n`)
        success = true
        break
      } catch (err) {
        if (attempt < 3) {
          const delay = attempt * 2000
          process.stdout.write(`  ⏳ ${file.ossKey} 重试 ${attempt}/3 (${delay / 1000}s后)...\n`)
          await new Promise((r) => setTimeout(r, delay))
        } else {
          failed++
          console.error(`  ❌ ${file.ossKey}: ${err.message}`)
        }
      }
    }
  }

  console.log(`\n📊 上传完成: ${uploaded} 成功, ${failed} 失败`)

  const endpoint = env.OSS_CUSTOM_DOMAIN || `${env.OSS_BUCKET}.${env.OSS_REGION}.aliyuncs.com`
  console.log(`\n🌐 访问地址: https://${endpoint}`)
  console.log('   (如绑定了自定义域名，请使用你的域名访问)\n')
}

deploy().catch((err) => {
  console.error('❌ 部署失败:', err.message)
  process.exit(1)
})
