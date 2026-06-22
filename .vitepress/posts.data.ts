import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: string
  tags: string[]
  excerpt: string
  cover?: string
  readTime: number
  wordCount: number
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

function countWords(text: string): number {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean).length
  return chinese + english
}

export default createContentLoader('posts/*.md', {
  includeSrc: true,
  render: false,
  excerpt: 'cursor',
  transform(raw): Post[] {
    return raw
      .filter(({ frontmatter }) => frontmatter?.title && !frontmatter?.draft)
      .map(({ url, frontmatter, excerpt, src }) => {
        const wordCount = countWords(src || '')
        return {
          title: frontmatter.title || '',
          url,
          date: formatDate(frontmatter.date || '1970-01-01'),
          tags: frontmatter.tags || [],
          excerpt: excerpt?.trim() || frontmatter.description || '',
          cover: frontmatter.cover || undefined,
          readTime: Math.max(1, Math.ceil(wordCount / 300)),
          wordCount,
        }
      })
      .filter((p) => !Number.isNaN(new Date(p.date).getTime()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})
