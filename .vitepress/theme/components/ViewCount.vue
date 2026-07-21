<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { inBrowser } from 'vitepress'

const views = ref<number | null>(null)

// TODO: 注册 Umami Cloud (https://umami.is) 后填入 Website ID
const UMAMI_WEBSITE_ID = '38552e62-796d-44dd-ba7b-9685dd57c1dd'
const UMAMI_API_URL = 'https://analytics.umami.is'

async function fetchUmamiViews(): Promise<number | null> {
  if (!UMAMI_WEBSITE_ID) return null
  try {
    const start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    const res = await fetch(
      `${UMAMI_API_URL}/api/websites/${UMAMI_WEBSITE_ID}/pageviews?start_at=${start}&end_at=${new Date().toISOString()}&url=${window.location.pathname}`
    )
    const data = await res.json()
    return data?.pageviews?.[0]?.y ?? data?.pageviews ?? null
  } catch {
    return null
  }
}

onMounted(async () => {
  if (!inBrowser) return

  // 优先尝试 Umami API
  const umamiViews = await fetchUmamiViews()
  if (umamiViews !== null) {
    views.value = umamiViews
    return
  }

  // 降级到 localStorage 计数
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
