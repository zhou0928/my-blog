<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useData, inBrowser } from 'vitepress'
import ViewCount from './ViewCount.vue'
import ReadMark from './ReadMark.vue'

const route = useRoute()
const { page, lang } = useData()

const copied = ref(false)
const wordCount = ref(0)
const readTime = ref(0)
const liked = ref(false)
const likeCount = ref(0)
const likeAnimating = ref(false)

function countWords(text: string): number {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean).length
  return chinese + english
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function shareToTwitter() {
  const title = page.value?.title || document.title
  const url = window.location.href
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
}

function toggleLike() {
  if (!inBrowser) return
  const key = 'blog_likes_' + window.location.pathname
  if (liked.value) {
    likeCount.value = Math.max(0, likeCount.value - 1)
    liked.value = false
  } else {
    likeCount.value += 1
    liked.value = true
    likeAnimating.value = true
    setTimeout(() => { likeAnimating.value = false }, 600)
  }
  localStorage.setItem(key, likeCount.value.toString())
}

onMounted(() => {
  const content = document.querySelector('.vp-doc')?.textContent || ''
  wordCount.value = countWords(content)
  readTime.value = Math.max(1, Math.ceil(wordCount.value / 300))

  if (inBrowser) {
    const key = 'blog_likes_' + window.location.pathname
    likeCount.value = parseInt(localStorage.getItem(key) || '0')
  }
})
</script>

<template>
  <div class="article-meta-bar">
    <div class="meta-stats">
      <span class="meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        {{ readTime }} {{ lang === 'zh-CN' ? '分钟阅读' : 'min read' }}
      </span>
      <span class="meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        {{ wordCount.toLocaleString() }} {{ lang === 'zh-CN' ? '字' : 'words' }}
      </span>
      <ViewCount />
    </div>
    <div class="meta-actions">
      <button class="share-btn like-btn" :class="{ liked, animating: likeAnimating }" @click="toggleLike">
        <svg width="16" height="16" viewBox="0 0 24 24" :fill="liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        {{ likeCount > 0 ? likeCount : '' }}
      </button>
      <ReadMark />
      <button class="share-btn" @click="copyLink" :title="lang === 'zh-CN' ? '复制链接' : 'Copy link'">
        <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        {{ copied ? '✓' : '' }}
      </button>
      <button class="share-btn" @click="shareToTwitter" title="Twitter">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.article-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  margin: 1.5rem 0;
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}

.meta-stats {
  display: flex;
  gap: 1.25rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.meta-actions {
  display: flex;
  gap: 0.5rem;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.share-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.like-btn.liked {
  color: #ef4444;
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.like-btn.animating svg {
  animation: like-bounce 0.6s ease;
}

@keyframes like-bounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.4); }
  50% { transform: scale(0.9); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@media (max-width: 640px) {
  .article-meta-bar { flex-direction: column; gap: 0.75rem; }
  .meta-stats { justify-content: center; }
  .meta-actions { justify-content: center; }
}
</style>
