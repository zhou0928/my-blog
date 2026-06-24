<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { theme, page } = useData()

/**
 * 从 nav 配置构建路径段 → 标签的映射表
 * 自动跟随 config.ts 中的 nav 配置变化，无需手动同步
 */
const navLabelMap = computed(() => {
  const map: Record<string, string> = {}
  const nav = theme.value.nav ?? []

  function walk(items: { text: string; link?: string; items?: any[] }[]) {
    for (const item of items) {
      if (item.link) {
        const segments = item.link
          .replace(/\.html$/, '')
          .replace(/\/$/, '')
          .split('/')
          .filter(Boolean)
        const lastSeg = segments[segments.length - 1]
        if (lastSeg) map[lastSeg] = item.text
      }
      if (item.items) walk(item.items)
    }
  }

  walk(nav)
  return map
})

const crumbs = computed(() => {
  const path = route.path.replace(/\.html$/, '').replace(/\/$/, '')
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return []

  const isEnglish = parts[0] === 'en'
  const items: { label: string; link: string; isLink: boolean }[] = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const link = '/' + parts.slice(0, i + 1).join('/')

    // 优先级：nav 配置 > 特殊映射 > 页面标题(末级) > URL 解码
    let label: string
    let isLink = true  // 默认可点击

    if (navLabelMap.value[part]) {
      label = navLabelMap.value[part]
    } else if (part === 'en') {
      label = 'English'
    } else if (part === 'posts') {
      // posts 没有对应的页面，仅作标签展示，不可点击
      label = isEnglish ? 'Posts' : '文章'
      isLink = false
    } else if (i === parts.length - 1 && page.value?.title) {
      label = page.value.title
    } else {
      label = decodeURIComponent(part).replace(/-/g, ' ')
    }

    items.push({ label, link, isLink })
  }

  return items
})
</script>

<template>
  <nav class="breadcrumb" v-if="crumbs.length > 0">
    <a href="/" class="crumb-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    </a>
    <template v-for="(crumb, i) in crumbs" :key="crumb.link">
      <span class="crumb-sep">/</span>
      <a
        v-if="i < crumbs.length - 1 && crumb.isLink"
        :href="crumb.link"
        class="crumb-link"
      >{{ crumb.label }}</a>
      <span
        v-else-if="i < crumbs.length - 1"
        class="crumb-label"
      >{{ crumb.label }}</span>
      <span v-else class="crumb-current">{{ crumb.label }}</span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 0;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.crumb-link {
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
}

.crumb-link:hover {
  color: var(--vp-c-brand-1);
}

.crumb-sep {
  opacity: 0.4;
}

.crumb-label {
  color: var(--vp-c-text-3);
}

.crumb-current {
  color: var(--vp-c-text-2);
  font-weight: 500;
}
</style>
