<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { inBrowser, useData } from 'vitepress'

const { lang } = useData()
const isRead = ref(false)

function toggleRead() {
  if (!inBrowser) return
  const key = 'blog_read_' + window.location.pathname
  isRead.value = !isRead.value
  localStorage.setItem(key, isRead.value ? '1' : '0')
}

onMounted(() => {
  if (!inBrowser) return
  const key = 'blog_read_' + window.location.pathname
  isRead.value = localStorage.getItem(key) === '1'
})
</script>

<template>
  <button class="read-mark-btn" :class="{ read: isRead }" @click="toggleRead" :title="isRead ? (lang === 'zh-CN' ? '标记为未读' : 'Mark as unread') : (lang === 'zh-CN' ? '标记为已读' : 'Mark as read')">
    <svg v-if="isRead" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
    <span>{{ isRead ? (lang === 'zh-CN' ? '已读' : 'Read') : (lang === 'zh-CN' ? '标记已读' : 'Mark read') }}</span>
  </button>
</template>

<style scoped>
.read-mark-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.read-mark-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.read-mark-btn.read {
  color: #22c55e;
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
}
</style>
