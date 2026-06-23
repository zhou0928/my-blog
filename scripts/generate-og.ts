import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://000902.icu'

// 生成 SVG 格式的 OG 图片（简洁可靠）
function generateOGSvg(title: string, tag: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#080c18"/>
      <stop offset="50%" style="stop-color:#0a1025"/>
      <stop offset="100%" style="stop-color:#0c1220"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00e5ff"/>
      <stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="1" fill="url(#accent)" opacity="0.3"/>
  <rect x="60" y="570" width="1080" height="1" fill="url(#accent)" opacity="0.3"/>
  <circle cx="1100" cy="100" r="200" fill="#00e5ff" opacity="0.05"/>
  <circle cx="100" cy="530" r="150" fill="#a855f7" opacity="0.05"/>
  <text x="80" y="180" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="600" fill="#00e5ff" letter-spacing="0.15em" text-transform="uppercase">XIAOZHOU'S BLOG</text>
  <text x="80" y="280" font-family="Inter, system-ui, sans-serif" font-size="${title.length > 30 ? 40 : 52}" font-weight="800" fill="#e2e8f0">
    ${title.length > 35 ? title.substring(0, 35) + '...' : title}
  </text>
  ${title.length > 35 ? `<text x="80" y="340" font-family="Inter, system-ui, sans-serif" font-size="40" font-weight="800" fill="#e2e8f0">${title.substring(35, 70)}</text>` : ''}
  <text x="80" y="${title.length > 35 ? 420 : 380}" font-family="Inter, system-ui, sans-serif" font-size="18" fill="#64748b">${tag}</text>
  <text x="80" y="540" font-family="Inter, system-ui, sans-serif" font-size="16" fill="#475569">000902.icu</text>
</svg>`
}

try {
  console.log('[og] Generating OG images...')

  // 生成站点默认 OG 图
  const defaultSvg = generateOGSvg("Xiaozhou's Blog", '工单系统 · 前端工程化 · Vue 生态')
  writeFileSync(resolve(__dirname, '..', 'public', 'og-default.svg'), defaultSvg)
  console.log('[og] Generated og-default.svg')

  // 为每篇文章生成 OG 图
  const postsDir = resolve(__dirname, '..', 'posts')
  const files = readdirSync(postsDir).filter(f => f.endsWith('.md'))

  for (const file of files) {
    const content = readFileSync(resolve(postsDir, file), 'utf-8')
    const blocks = content.split(/^---$/m)
    if (blocks.length < 3) continue

    const fm = blocks[1]
    const title = fm.match(/title:\s*(.+)/)?.[1]?.trim().replace(/^["']|["']$/g, '') || ''
    const tags = fm.match(/tags:\s*\[(.+?)\]/)?.[1]?.split(',').map(t => t.trim().replace(/^["']|["']$/g, '')).join(' · ') || ''

    if (!title) continue

    const slug = file.replace(/\.md$/, '')
    const svg = generateOGSvg(title, tags)
    writeFileSync(resolve(__dirname, '..', 'public', `og-${slug}.svg`), svg)
  }

  console.log(`[og] Generated ${files.length + 1} OG images`)
} catch (err) {
  console.error('[og] Error:', err)
  process.exit(1)
}
