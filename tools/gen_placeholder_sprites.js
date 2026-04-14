import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'assets', 'characters')

const characters = {
  nene: {
    name: 'Nene', color: '#F4C2D0', hairColor: '#f0b0c8', accent: '#e891ab',
    expressions: ['normal', 'smile', 'gentle_smile', 'blush', 'confused', 'surprised', 'sad', 'thinking']
  },
  yoshino: {
    name: 'Yoshino', color: '#c4b5fd', hairColor: '#a78bfa', accent: '#8b5cf6',
    expressions: ['normal', 'cold', 'slight_smile', 'blush', 'tsundere_pout', 'angry', 'glasses_adjust', 'rare_gentle']
  },
  ayase: {
    name: 'Ayase', color: '#FF8C42', hairColor: '#ff9f5c', accent: '#f97316',
    expressions: ['normal', 'grin', 'competitive', 'blush', 'pout', 'fired_up', 'surprised', 'soft_smile']
  },
  kanna: {
    name: 'Kanna', color: '#7BA7C9', hairColor: '#93c5e8', accent: '#5b9cc4',
    expressions: ['normal', 'slight_smile', 'absorbed', 'blush', 'surprised', 'contemplative', 'warm_smile', 'teary']
  },
  murasame: {
    name: 'Murasame', color: '#DC3545', hairColor: '#e04858', accent: '#b91c28',
    expressions: ['normal', 'smirk', 'impressed', 'blush', 'cold', 'genuine_smile', 'vulnerable', 'fierce']
  }
}

const expressionEmojis = {
  normal: '•‿•', smile: '◠‿◠', gentle_smile: '◡‿◡', blush: '⁄⁄◠‿◠⁄⁄',
  confused: '•﹏•', surprised: '⊙▽⊙', sad: '•︵•', thinking: '•‸•',
  cold: '—‸—', slight_smile: '—‿—', tsundere_pout: '•3•', angry: '•`Д´•',
  glasses_adjust: '■‿■', rare_gentle: '◡‿◡',
  grin: '≧▽≦', competitive: '•ω•', pout: '•3•', fired_up: '✧◡✧', soft_smile: '◠‿◠',
  absorbed: '•_•', contemplative: '•‥•', warm_smile: '◡‿◡', teary: '•̥﹏•̥',
  smirk: '¬‿¬', impressed: '•̀‿•́', genuine_smile: '◠‿◠', vulnerable: '•﹏•', fierce: '•`▽´•'
}

function generateSVG(charId, charData, expression) {
  const emo = expressionEmojis[expression] || '•‿•'
  const blush = expression === 'blush' ? `
    <circle cx="115" cy="305" r="18" fill="${charData.color}" opacity="0.6"/>
    <circle cx="185" cy="305" r="18" fill="${charData.color}" opacity="0.6"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="700" viewBox="0 0 400 700">
  <defs>
    <linearGradient id="bg_${charId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${charData.color}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${charData.accent}" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="hair_${charId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${charData.hairColor}"/>
      <stop offset="100%" stop-color="${charData.accent}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="700" fill="url(#bg_${charId})" rx="20"/>
  <ellipse cx="200" cy="250" rx="80" ry="95" fill="url(#hair_${charId})" opacity="0.9"/>
  <ellipse cx="200" cy="260" rx="55" ry="65" fill="#fde8d0"/>
  <text x="200" y="272" text-anchor="middle" font-size="32" fill="${charData.accent}">${emo}</text>${blush}
  <rect x="130" y="380" width="140" height="240" rx="30" fill="${charData.color}" opacity="0.7"/>
  <rect x="145" y="395" width="110" height="60" rx="12" fill="#fff" opacity="0.4"/>
  <text x="200" y="620" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="${charData.accent}">${charData.name}</text>
  <text x="200" y="650" text-anchor="middle" font-family="sans-serif" font-size="14" fill="${charData.accent}" opacity="0.7">${expression}</text>
</svg>`
}

for (const [charId, charData] of Object.entries(characters)) {
  const charDir = join(outDir, charId)
  if (!existsSync(charDir)) mkdirSync(charDir, { recursive: true })

  for (const expression of charData.expressions) {
    const svg = generateSVG(charId, charData, expression)
    const svgPath = join(charDir, `${expression}.svg`)
    writeFileSync(svgPath, svg)
  }
  console.log(`Generated ${charData.expressions.length} sprites for ${charId}`)
}

console.log('Done! Placeholder sprites generated as SVG.')
console.log('Note: Update characterSprites.js to use .svg instead of .webp')
