<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { inBrowser } from 'vitepress'

const views = ref<number | null>(null)

onMounted(() => {
  if (!inBrowser) return

  // Umami 统计 — 替换 UMAMI_WEBSITE_ID 为你的 Umami Website ID
  // 方式1: Umami Cloud API (需要 Umami Cloud 或自建)
  // const UMAMI_WEBSITE_ID = 'your-website-id'
  // fetch(`https://analytics.umami.is/api/website/${UMAMI_WEBSITE_ID}/pageviews`)
  //   .then(r => r.json())
  //   .then(data => { views.value = data?.pageviews || 0 })
  //   .catch(() => {})

  // 方式2: 简单计数器 (localStorage 模拟)
  const key = 'blog_views_' + window.location.pathname
  const count = parseInt(localStorage.getItem(key) || '0') + 1
  localStorage.setItem(key, count.toString())
  views.value = count
})
</script>

<template>
  <span class="view-count" v-if="views !== null">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    {{ views.toLocaleString() }}
  </span>
</template>

<style scoped>
.view-count {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}
</style>
