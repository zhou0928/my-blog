<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter, useData } from 'vitepress'
import { data as postsZh } from '../../posts.data.js'
import { data as postsEn } from '../../posts-en.data.js'

const router = useRouter()
const { localeIndex } = useData()

const isEn = computed(() => localeIndex.value === 'en')

// 按当前 locale 选择对应文章数据源
const posts = computed(() => (isEn.value ? postsEn : postsZh))

const activeTag = ref<string | null>(null)
const searchQuery = ref('')

let observer: IntersectionObserver | null = null

const allTags = computed(() => {
  const set = new Set<string>()
  posts.value.forEach((p) => p.tags?.forEach((t) => set.add(t)))
  return Array.from(set).sort()
})

const filteredPosts = computed(() => {
  let result = posts.value
  if (activeTag.value) {
    result = result.filter((p) => p.tags?.includes(activeTag.value!))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
    )
  }
  return result
})

function goToPost(url: string) {
  router.go(url)
}

// 观察新的 post-item 元素
function observePostItems() {
  nextTick(() => {
    const items = document.querySelectorAll('.post-item')
    items.forEach((el) => {
      // 立即检查是否在视口内
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed')
      } else if (observer) {
        observer.observe(el)
      }
    })
  })
}

// 监听过滤结果变化，重新观察
watch([activeTag, searchQuery, posts], () => {
  observePostItems()
})

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.05, rootMargin: '50px 0px' }
  )

  // 立即显示页面顶部元素
  document
    .querySelectorAll('.archive-page > .page-title, .archive-page > .search-box, .archive-page > .tag-filter')
    .forEach((el) => {
      el.classList.add('revealed')
    })

  // 初始观察文章列表
  observePostItems()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div class="archive-page">
    <h1 class="page-title">
      <span class="title-icon">📚</span>
      <span class="title-text">{{ isEn ? 'All Posts' : '全部文章' }}</span>
      <span class="title-count">{{ filteredPosts.length }}</span>
    </h1>

    <!-- 搜索框 -->
    <div class="search-box scroll-reveal">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="isEn ? 'Search posts...' : '搜索文章...'"
        class="search-input"
      />
    </div>

    <!-- 标签过滤器 -->
    <div class="tag-filter scroll-reveal" v-if="allTags.length > 0">
      <button
        class="tag-chip"
        :class="{ 'tag-active': activeTag === null }"
        @click="activeTag = null"
      >{{ isEn ? 'All' : '全部' }}</button>
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
        v-for="(post, index) in filteredPosts"
        :key="post.url"
        class="post-item fade-in-item"
        :style="{ animationDelay: (index * 0.1) + 's' }"
        @click="goToPost(post.url)"
      >
        <div class="post-item-indicator" />
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
      <div class="empty-icon">🔍</div>
      <p>{{ isEn ? 'No matching posts found' : '没有找到匹配的文章' }}</p>
    </div>
  </div>
</template>

<style scoped>
.archive-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 6rem 1.5rem 8rem;
  min-height: 90vh;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--vp-c-border);
}

.title-icon {
  font-size: 2.5rem;
}

.title-text {
  background: linear-gradient(135deg, var(--blog-gradient-from), var(--blog-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-count {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: 24px;
  background: var(--vp-c-brand-soft);
  color: var(--blog-accent);
  border: 1px solid var(--blog-tag-border);
}

/* --- 搜索框 --- */
.search-box {
  position: relative;
  margin-bottom: 2rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-input:focus {
  border-color: var(--blog-accent);
  box-shadow: 0 0 0 3px var(--blog-accent-soft);
}

/* --- 标签过滤器 --- */
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.tag-chip {
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.tag-chip:hover {
  border-color: var(--blog-accent);
  color: var(--blog-accent);
  background: var(--blog-accent-soft);
  transform: translateY(-1px);
}

.tag-active {
  border-color: var(--blog-accent) !important;
  background: var(--blog-accent-soft) !important;
  color: var(--blog-accent) !important;
}

/* --- 文章列表项 --- */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fade-in-item {
  animation: fadeInItem 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInItem {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.25rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid transparent;
  overflow: hidden;
}

.post-item-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--blog-accent), var(--blog-accent-2));
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 0 2px 2px 0;
}

.post-item:hover {
  background: var(--blog-card-bg);
  border-color: var(--blog-card-border);
  transform: translateX(6px);
}

.post-item:hover .post-item-indicator {
  opacity: 1;
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
  transition: color 0.3s;
}

.post-item:hover .post-item-title {
  color: var(--blog-accent);
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
  color: var(--blog-accent-2);
  transition: color 0.2s;
}

.post-item:hover .post-item-tag {
  filter: brightness(1.15);
}

.post-item-arrow {
  color: var(--vp-c-text-3);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s;
  flex-shrink: 0;
  padding-top: 0.15rem;
}

.post-item:hover .post-item-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--blog-accent);
}

/* --- 空状态 --- */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 640px) {
  .page-title { font-size: 1.8rem; }
  .post-item { flex-direction: column; gap: 0.3rem; }
  .post-item-date { min-width: auto; }
  .post-item-arrow { display: none; }
  .post-item-indicator { display: none; }
}
</style>
