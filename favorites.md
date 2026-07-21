---
layout: page
title: 代码收藏
description: 我收藏的代码片段
---

<script setup>
import { ref, onMounted } from 'vue'

const favorites = ref([])

onMounted(() => {
  try {
    favorites.value = JSON.parse(localStorage.getItem('blog_code_favorites') || '[]')
  } catch {
    favorites.value = []
  }
})

function removeFavorite(id) {
  favorites.value = favorites.value.filter(f => f.id !== id)
  localStorage.setItem('blog_code_favorites', JSON.stringify(favorites.value))
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('zh-CN')
}
</script>

<div class="favorites-page">

# ⭐ 代码收藏

<p v-if="favorites.length === 0" class="empty-tip">还没有收藏的代码片段。在文章的代码块上点击 ☆ 即可收藏。</p>

<div v-else class="favorites-list">
  <div v-for="fav in favorites" :key="fav.id" class="favorite-item">
    <div class="fav-header">
      <span class="fav-lang">{{ fav.language || 'code' }}</span>
      <a :href="fav.page" class="fav-page">{{ fav.pageTitle }}</a>
      <span class="fav-date">{{ formatDate(fav.addedAt) }}</span>
      <button class="fav-remove" @click="removeFavorite(fav.id)">×</button>
    </div>
    <pre class="fav-code"><code>{{ fav.code }}</code></pre>
  </div>
</div>

</div>

<style>
.favorites-page {
  max-width: 800px;
  margin: 0 auto;
}

.empty-tip {
  color: var(--vp-c-text-3);
  text-align: center;
  padding: 3rem 0;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.favorite-item {
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  overflow: hidden;
}

.fav-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.fav-lang {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.fav-page {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.fav-page:hover {
  color: var(--vp-c-brand-1);
}

.fav-date {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.fav-remove {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0 0.3rem;
  line-height: 1;
}

.fav-remove:hover {
  color: #ef4444;
}

.fav-code {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.85rem;
}
</style>
