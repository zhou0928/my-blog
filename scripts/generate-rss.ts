import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://000902.icu'
const SITE_TITLE = "Xiaozhou's Blog"
const SITE_DESC = '工单系统 · 前端工程化 · Vue 生态 · 个人技术博客'

interface Post {
  title: string
  date: string
  tags: string[]
  description: string
  url: string
}

function generateRSS(posts: Post[]): string {
  const items = posts.map(post => `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${post.url}</link>
    <guid isPermaLink="false">${post.url}</guid>
    <description><![CDATA[${post.description || post.title}]]></description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    ${post.tags.map(t => `<category>${t}</category>`).join('\n    ')}
  </item>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

try {
  console.log('[rss] Generating feed.xml...')

  const postsDir = resolve(__dirname, '..', 'posts')
  const files = readdirSync(postsDir).filter(f => f.endsWith('.md'))

  const posts: Post[] = []
  for (const file of files) {
    const content = readFileSync(resolve(postsDir, file), 'utf-8')
    const blocks = content.split(/^---$/m)
    if (blocks.length < 3) continue

    const fm = blocks[1]
    const title = fm.match(/title:\s*(.+)/)?.[1]?.trim().replace(/^["']|["']$/g, '') || ''
    const date = fm.match(/date:\s*(\S+)/)?.[1]?.trim() || ''
    const tags = fm.match(/tags:\s*\[(.+?)\]/)?.[1]?.split(',').map(t => t.trim().replace(/^["']|["']$/g, '')) || []
    const description = fm.match(/description:\s*(.+)/)?.[1]?.trim().replace(/^["']|["']$/g, '') || ''

    if (!title || !date) continue

    const slug = file.replace(/\.md$/, '')
    posts.push({ title, date, tags, description, url: `${SITE_URL}/posts/${slug}` })
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const rss = generateRSS(posts)
  const outPath = resolve(__dirname, '..', 'public', 'feed.xml')
  writeFileSync(outPath, rss)
  console.log(`[rss] Written ${posts.length} posts to ${outPath}`)
} catch (err) {
  console.error('[rss] Error:', err)
  process.exit(1)
}
