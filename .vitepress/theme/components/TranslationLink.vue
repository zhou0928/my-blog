<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const translationLink = computed(() => {
  const path = route.path
  if (path.startsWith('/en/')) {
    const zhPath = path.replace('/en/', '/')
    return { path: zhPath, label: '中文版', flag: '🇨🇳' }
  } else if (!path.startsWith('/en/') && path !== '/') {
    const enPath = '/en' + path
    return { path: enPath, label: 'English', flag: '🇬🇧' }
  }
  return null
})
</script>

<template>
  <a
    v-if="translationLink"
    :href="translationLink.path"
    class="translation-link"
  >
    <span class="flag">{{ translationLink.flag }}</span>
    <span>{{ translationLink.label }}</span>
  </a>
</template>

<style scoped>
.translation-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  margin-left: 0.75rem;
}

.translation-link:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.flag {
  font-size: 0.9rem;
}
</style>
