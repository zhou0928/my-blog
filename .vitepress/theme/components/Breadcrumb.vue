<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { site } = useData()

const crumbs = computed(() => {
  const path = route.path.replace(/\.html$/, '').replace(/\/$/, '')
  const parts = path.split('/').filter(Boolean)
  const items: { label: string; link: string }[] = []

  let link = ''
  for (const part of parts) {
    link += '/' + part
    const label = part === 'posts' ? '文章'
      : part === 'en' ? 'English'
      : part === 'about' ? '关于'
      : part === 'blog' ? '归档'
      : part === 'projects' ? '项目'
      : decodeURIComponent(part).replace(/-/g, ' ')
    items.push({ label, link })
  }
  return items
})
</script>

<template>
  <nav class="breadcrumb" v-if="crumbs.length > 1">
    <a href="/" class="crumb-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    </a>
    <template v-for="(crumb, i) in crumbs" :key="crumb.link">
      <span class="crumb-sep">/</span>
      <a
        v-if="i < crumbs.length - 1"
        :href="crumb.link"
        class="crumb-link"
      >{{ crumb.label }}</a>
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

.crumb-current {
  color: var(--vp-c-text-2);
  font-weight: 500;
}
</style>
