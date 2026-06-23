/**
 * fetch-juejin-hot.ts
 *
 * 从掘金拉取前端相关热门文章，生成博客文章草稿。
 *
 * 用法：
 *   node --experimental-strip-types scripts/fetch-juejin-hot.ts
 *
 * 依赖：Node.js 18+（内置 fetch）
 */

import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = resolve(__dirname, '..', 'posts')

// 掘金前端分类 ID：6809637767543259144
const FRONTEND_CATEGORY = '6809637767543259144'

interface JuejinPost {
  article_id: string
  title: string
  brief_content: string
  author_user_info: { user_name: string }
  tags: { tag_name: string }[]
  ctime: string
  view_count: number
  digg_count: number
  comment_count: number
}

async function fetchHotPosts(): Promise<JuejinPost[]> {
  // 尝试多个 API 端点
  const endpoints = [
    // 推荐 feed
    {
      url: 'https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed',
      body: { id_type: 2, sort_type: 3, cursor: '0', limit: 30 },
    },
    // 分类 feed
    {
      url: 'https://api.juejin.cn/content_api/v1/article/category_brief_list',
      body: { cursor: '0', limit: 30, sort_type: 2, cate_id: FRONTEND_CATEGORY },
    },
  ]

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Referer': 'https://juejin.cn/',
          'Origin': 'https://juejin.cn',
        },
        body: JSON.stringify(endpoint.body),
      })

      if (!res.ok) continue

      const data = await res.json()
      const posts = data.data || []

      if (posts.length > 0) {
        return posts.map((item: any) => {
          // 处理 recommend_all_feed 格式: item_info.article_info
          const info = item.item_info?.article_info || item.article_info || item
          const author = item.item_info?.author_user_info || item.author_user_info || { user_name: 'unknown' }
          return {
            article_id: info.article_id || '',
            title: info.title || '',
            brief_content: info.brief_content || '',
            author_user_info: { user_name: author.user_name || 'unknown' },
            tags: (info.tag_ids || []).map((id: number) => ({ tag_name: String(id) })),
            ctime: info.ctime || '',
            view_count: parseInt(info.view_count) || 0,
            digg_count: parseInt(info.digg_count) || 0,
            comment_count: parseInt(info.comment_count) || 0,
          }
        })
      }
    } catch {
      continue
    }
  }

  return []
}

function isFrontendRelated(post: JuejinPost): boolean {
  const keywords = [
    '前端', 'vue', 'react', 'angular', 'javascript', 'typescript',
    'css', 'html', 'webpack', 'vite', 'node', 'next', 'nuxt',
    'sass', 'tailwind', 'flutter', '小程序', 'webpack', 'esbuild',
    'bun', 'deno', '浏览器', 'dom', '性能优化', '工程化',
  ]

  const tags = (post.tags || []).map(t => t.tag_name || '').join(' ')
  const text = `${post.title} ${post.brief_content || ''} ${tags}`.toLowerCase()
  return keywords.some(kw => text.includes(kw))
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60)
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function generateMarkdown(post: JuejinPost): string {
  const today = formatDate(new Date())
  const tags = post.tags.slice(0, 3).map(t => t.tag_name)
  const slug = generateSlug(post.title)

  return `---
title: "${post.title.replace(/"/g, '\\"')}"
date: ${today}
tags: [${tags.join(', ')}]
description: "${post.brief_content.replace(/"/g, '\\"').substring(0, 120)}"
source: juejin
source_url: "https://juejin.cn/post/${post.article_id}"
author: "${post.author_user_info.user_name}"
draft: true
---

# ${post.title}

> 本文转载自掘金，作者：${post.author_user_info.user_name}。原文链接：[点击查看](https://juejin.cn/post/${post.article_id})

${post.brief_content}

---

*本文为自动转载草稿，请编辑后发布。*
`
}

try {
  console.log('[juejin] 正在拉取掘金前端热门文章...')

  const posts = await fetchHotPosts()
  console.log(`[juejin] 获取到 ${posts.length} 篇文章`)

  // 调试：打印前 3 篇文章信息
  posts.slice(0, 3).forEach((p, i) => {
    console.log(`[juejin] 文章${i + 1}: ${p.title} | 标签: ${(p.tags || []).map(t => t.tag_name).join(', ')}`)
  })

  // 过滤前端相关
  const frontendPosts = posts.filter(isFrontendRelated)
  console.log(`[juejin] 前端相关文章: ${frontendPosts.length} 篇`)

  if (frontendPosts.length === 0) {
    console.log('[juejin] 没有找到前端相关文章，跳过')
    process.exit(0)
  }

  // 选择阅读量最高的
  const selected = frontendPosts.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))[0]
  console.log(`[juejin] 选择文章: ${selected.title} (阅读 ${selected.view_count})`)

  // 检查是否已存在
  const slug = generateSlug(selected.title)
  const outPath = resolve(POSTS_DIR, `${slug}.md`)

  if (existsSync(outPath)) {
    console.log(`[juejin] 文章已存在: ${slug}.md，跳过`)
    process.exit(0)
  }

  // 生成 markdown
  const markdown = generateMarkdown(selected)
  writeFileSync(outPath, markdown)
  console.log(`[juejin] 已生成: posts/${slug}.md`)

  // 输出 JSON 供 CI 使用
  const result = {
    title: selected.title,
    slug,
    file: `posts/${slug}.md`,
    views: selected.view_count,
    author: selected.author_user_info.user_name,
  }
  console.log(`[juejin] 结果: ${JSON.stringify(result)}`)

} catch (err) {
  console.error('[juejin] 错误:', err)
  process.exit(1)
}
