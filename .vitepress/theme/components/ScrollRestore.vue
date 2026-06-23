<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, inBrowser } from 'vitepress'

const route = useRoute()
const savedPosition = ref(0)

const storageKey = computed(() => 'scroll_pos_' + route.path)

function savePosition() {
  if (!inBrowser) return
  localStorage.setItem(storageKey.value, window.scrollY.toString())
}

function restorePosition() {
  if (!inBrowser) return
  const saved = localStorage.getItem(storageKey.value)
  if (saved) {
    requestAnimationFrame(() => {
      window.scrollTo(0, parseInt(saved))
    })
  }
}

let scrollTimer: ReturnType<typeof setTimeout> | null = null

function handleScroll() {
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(savePosition, 200)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  restorePosition()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimer) clearTimeout(scrollTimer)
})

watch(() => route.path, () => {
  restorePosition()
})
</script>

<template>
  <div />
</template>
