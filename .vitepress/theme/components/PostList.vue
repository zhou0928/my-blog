<script setup lang="ts">
import { ref, computed } from 'vue'
import { data as posts } from '../../posts.data.js'
import { useRouter } from 'vitepress'

const router = useRouter()
const activeTag = ref<string | null>(null)

const allTags = computed(() => {
  const set = new Set<string>()
  posts.forEach(p => p.tags?.forEach(t => set.add(t)))
  return Array.from(set).sort()
})

const filteredPosts = computed(() => {
  if (!activeTag.value) return posts
  return posts.filter(p => p.tags?.includes(activeTag.value!))
})

function goToPost(url: string) {
  router.go(url)
}
</script>

<template>
  <div class="archive-page">
    <h1>📚 全部文章</h1>

    <!-- 标签过滤器 -->
    <div class="tag-filter" v-if="allTags.length > 0">
      <button
        class="tag-chip"
        :class="{ 'tag-active': activeTag === null }"
        @click="activeTag = null"
      >全部</button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-chip"
        :class="{ 'tag-active': activeTag === tag }"
        @click="activeTag = tag"
      ># {{ tag }}</button>
    </div>

    <!-- 文章列表 -->
    <div class="post-list" v-if="filteredPosts.length > 0">
      <article
        v-for="post in filteredPosts"
        :key="post.url"
        class="post-item"
        @click="goToPost(post.url)"
      >
        <time class="post-item-date">{{ post.date }}</time>
        <div class="post-item-content">
          <h2 class="post-item-title">{{ post.title }}</h2>
          <p class="post-item-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
          <div class="post-item-tags" v-if="post.tags?.length">
            <span v-for="tag in post.tags" :key="tag" class="post-item-tag">#{{ tag }}</span>
          </div>
        </div>
        <div class="post-item-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <p>暂无文章</p>
    </div>
  </div>
</template>

<style scoped>
.archive-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.archive-page h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #e2e8f0, #00e5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* --- 标签过滤器 --- */
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(56, 189, 248, 0.08);
}

.tag-chip {
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(56, 189, 248, 0.12);
  background: rgba(56, 189, 248, 0.04);
  color: var(--vp-c-text-2);
}

.tag-chip:hover {
  border-color: rgba(0, 229, 255, 0.3);
  color: #00e5ff;
  background: rgba(0, 229, 255, 0.06);
}

.tag-active {
  border-color: rgba(0, 229, 255, 0.4) !important;
  background: rgba(0, 229, 255, 0.1) !important;
  color: #00e5ff !important;
}

/* --- 文章列表项 --- */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.post-item {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.25rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid transparent;
}

.post-item:hover {
  background: rgba(16, 24, 48, 0.5);
  border-color: rgba(56, 189, 248, 0.08);
  transform: translateX(4px);
}

.post-item-date {
  min-width: 85px;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  padding-top: 0.15rem;
  flex-shrink: 0;
}

.post-item-content {
  flex: 1;
  min-width: 0;
}

.post-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.3rem;
  line-height: 1.4;
  transition: color 0.2s;
}

.post-item:hover .post-item-title {
  color: #00e5ff;
}

.post-item-excerpt {
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.post-item-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-item-tag {
  font-size: 0.78rem;
  color: #a855f7;
}

.post-item-arrow {
  color: var(--vp-c-text-3);
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.25s;
  flex-shrink: 0;
  padding-top: 0.15rem;
}

.post-item:hover .post-item-arrow {
  opacity: 1;
  transform: translateX(0);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .archive-page h1 { font-size: 1.8rem; }
  .post-item { flex-direction: column; gap: 0.3rem; }
  .post-item-date { min-width: auto; }
  .post-item-arrow { display: none; }
}
</style>
