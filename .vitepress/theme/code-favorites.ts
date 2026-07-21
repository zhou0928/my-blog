import { inBrowser } from 'vitepress'

const STORAGE_KEY = 'blog_code_favorites'

export interface CodeFavorite {
  id: string
  code: string
  language: string
  page: string
  pageTitle: string
  addedAt: number
}

function generateId(code: string, page: string): string {
  let hash = 0
  const str = code + page
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return 'cf_' + Math.abs(hash).toString(36)
}

export function getFavorites(): CodeFavorite[] {
  if (!inBrowser) return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function isFavorited(code: string, page: string): boolean {
  const id = generateId(code, page)
  return getFavorites().some(f => f.id === id)
}

export function toggleFavorite(code: string, language: string, page: string, pageTitle: string): boolean {
  const id = generateId(code, page)
  const favorites = getFavorites()
  const idx = favorites.findIndex(f => f.id === id)

  if (idx >= 0) {
    favorites.splice(idx, 1)
  } else {
    favorites.push({ id, code, language, page, pageTitle, addedAt: Date.now() })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  return idx < 0
}

export function initCodeFavoriteButtons() {
  if (!inBrowser) return

  document.querySelectorAll('.vp-doc pre').forEach((pre) => {
    if ((pre as HTMLElement).dataset.favInit) return
    ;(pre as HTMLElement).dataset.favInit = '1'

    const code = pre.querySelector('code')?.textContent || ''
    if (!code.trim()) return

    const lang = (pre.querySelector('code')?.className.match(/language-(\w+)/) || [, ''])[1]
    const page = window.location.pathname

    const btn = document.createElement('button')
    btn.className = 'code-fav-btn'
    btn.title = '收藏代码片段'

    function updateIcon() {
      const fav = isFavorited(code, page)
      btn.innerHTML = fav
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
      btn.classList.toggle('active', fav)
    }

    btn.addEventListener('click', () => {
      toggleFavorite(code, lang, page, document.title)
      updateIcon()
    })

    updateIcon()
    ;(pre as HTMLElement).style.position = 'relative'
    ;(pre as HTMLElement).appendChild(btn)
  })
}
