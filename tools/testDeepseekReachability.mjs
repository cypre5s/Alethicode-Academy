import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const rootDir = process.cwd()
const envPath = path.join(rootDir, '.env.local')

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const source = fs.readFileSync(filePath, 'utf8')
  const vars = {}
  source.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const idx = trimmed.indexOf('=')
    if (idx <= 0) return
    const key = trimmed.slice(0, idx).trim()
    const rawValue = trimmed.slice(idx + 1).trim()
    vars[key] = rawValue.replace(/^['"]|['"]$/g, '')
  })
  return vars
}

async function main() {
  const envVars = readEnvFile(envPath)
  const apiKey = (process.env.VITE_DEEPSEEK_API_KEY || envVars.VITE_DEEPSEEK_API_KEY || '').trim()
  const baseUrl = (process.env.VITE_DEEPSEEK_BASE_URL || envVars.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '')
  const model = process.env.VITE_DEEPSEEK_MODEL || envVars.VITE_DEEPSEEK_MODEL || 'deepseek-chat'

  if (!apiKey) {
    throw new Error('未找到 VITE_DEEPSEEK_API_KEY，请在当前目录 .env.local 中配置后重试。')
  }

  const payloadBody = JSON.stringify({
    model,
    max_tokens: 40,
    temperature: 0,
    messages: [
      { role: 'system', content: 'You are a health-check assistant.' },
      { role: 'user', content: 'Reply with exactly: OK' }
    ]
  })

  const curlResult = spawnSync('curl', [
    '-sS',
    '-X', 'POST',
    `${baseUrl}/chat/completions`,
    '-H', 'Content-Type: application/json',
    '-H', `Authorization: Bearer ${apiKey}`,
    '-d', payloadBody
  ], { encoding: 'utf8' })

  if (curlResult.error) {
    throw new Error(`curl 执行失败: ${curlResult.error.message}`)
  }

  if (curlResult.status !== 0) {
    throw new Error(`curl 返回非 0 状态码: ${curlResult.status}, stderr: ${curlResult.stderr}`)
  }

  const bodyText = curlResult.stdout.trim()

  let payload = null
  try {
    payload = JSON.parse(bodyText)
  } catch {
    throw new Error(`DeepSeek 响应不是 JSON: ${bodyText}`)
  }

  if (payload.error) {
    throw new Error(`DeepSeek API 错误: ${JSON.stringify(payload.error)}`)
  }

  const content = payload.choices?.[0]?.message?.content?.trim() || ''
  if (!content) {
    throw new Error(`DeepSeek 响应缺少内容: ${bodyText}`)
  }

  console.log('DeepSeek reachable:', {
    baseUrl,
    model,
    responsePreview: content.slice(0, 80)
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
