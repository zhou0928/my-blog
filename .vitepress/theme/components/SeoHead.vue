<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

function addCanonical() {
  if (typeof document === 'undefined') return
  const url = 'https://000902.icu' + route.path
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
}

function addArticleSchema() {
  if (typeof document === 'undefined') return
  const title = document.querySelector('.vp-doc h1')?.textContent?.trim()
  if (!title) return

  const description = document.querySelector('.vp-doc p')?.textContent?.trim() || title
  const url = 'https://000902.icu' + route.path

  const existing = document.querySelector('script[data-article-schema]')
  if (existing) existing.remove()

  const schema = document.createElement('script')
  schema.type = 'application/ld+json'
  schema.setAttribute('data-article-schema', '1')
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    author: {
      '@type': 'Person',
      name: 'Xiazhou',
      url: 'https://github.com/zhou0928',
    },
    publisher: {
      '@type': 'Organization',
      name: "Xiazhou's Blog",
      url: 'https://000902.icu',
    },
    datePublished: new Date().toISOString(),
  })
  document.head.appendChild(schema)
}

onMounted(() => {
  nextTick(() => {
    addCanonical()
    addArticleSchema()
  })
})

watch(() => route.path, () => {
  nextTick(() => {
    addCanonical()
    addArticleSchema()
  })
})
</script>

<template>
  <div />
</template>
