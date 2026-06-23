<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, inBrowser } from 'vitepress'

const route = useRoute()
const lastUpdated = ref('')

onMounted(() => {
  if (!inBrowser) return
  // VitePress 内置的 lastUpdated 信息
  const el = document.querySelector('.VPFooter .message')
  if (el) {
    const timeEl = document.querySelector('.vp-doc time')
    if (timeEl) {
      lastUpdated.value = timeEl.textContent || ''
    }
  }
})
</script>

<template>
  <div class="last-updated" v-if="lastUpdated">
    最后更新: {{ lastUpdated }}
  </div>
</template>

<style scoped>
.last-updated {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-align: right;
  padding: 1rem 0;
}
</style>
