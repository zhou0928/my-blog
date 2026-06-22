import { createContentLoader, type SiteConfig } from 'vitepress'

interface Post {
  title: string
  url: string
  date: string
  tags: string[]
  excerpt: string
  cover?: string
}

declare const data: Post[]

export { data }

// 格式化日期为 YYYY-MM-DD
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default createContentLoader('posts/*.md', {
  includeSrc: false,
  render: false,
  excerpt: 'cursor',
  transform(raw): Post[] {
    return raw
      .filter(({ frontmatter }) => frontmatter?.title)
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title || '',
        url,
        date: formatDate(frontmatter.date || ''),
        tags: frontmatter.tags || [],
        excerpt: excerpt?.trim() || frontmatter.description || '',
        cover: frontmatter.cover || undefined,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})
