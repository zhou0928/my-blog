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
        date: frontmatter.date || '',
        tags: frontmatter.tags || [],
        excerpt: excerpt?.trim() || frontmatter.description || '',
        cover: frontmatter.cover || undefined,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})
