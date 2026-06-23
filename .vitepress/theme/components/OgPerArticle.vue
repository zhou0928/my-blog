<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, inBrowser } from 'vitepress'

const SITE_URL = 'https://000902.icu'

function updateHead() {
  if (!inBrowser) return

  const path = window.location.pathname

  // 文章页使用独立 OG 图
  const match = path.match(/\/posts\/([^/]+)/)
  const ogImage = match
    ? `${SITE_URL}/og-${match[1]}.svg`
    : `${SITE_URL}/og-default.svg`

  // 更新 og:image
  setMeta('property', 'og:image', ogImage)
  setMeta('name', 'twitter:image', ogImage)

  // 更新 og:url
  setMeta('property', 'og:url', SITE_URL + path)

  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = SITE_URL + path
}

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

onMounted(updateHead)
watch(() => window.location.pathname, updateHead)
</script>

<template>
  <div />
</template>
