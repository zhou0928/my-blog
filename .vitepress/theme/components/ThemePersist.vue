<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useData, inBrowser } from 'vitepress'

const { isDark } = useData()

function persistTheme(dark: boolean) {
  if (!inBrowser) return
  localStorage.setItem('theme-preference', dark ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme-preference')
  if (saved) {
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }
})

watch(isDark, (dark) => {
  persistTheme(dark)
})
</script>

<template>
  <div />
</template>
