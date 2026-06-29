<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter, useData } from 'vitepress'
import { data as postsZh } from '../../posts.data.js'
import { data as postsEn } from '../../posts-en.data.js'

const router = useRouter()
const { localeIndex } = useData()

const isEn = computed(() => localeIndex.value === 'en')
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
      (p) => p.title.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q)
    )
  }
  return result
})

const groupedPosts = computed(() => {
  const groups: Record<string, typeof filteredPosts.value> = {}
  for (const post of filteredPosts.value) {
    const year = new Date(post.date).getFullYear().toString()
    if (!groups[year]) groups[year] = []
    groups[year].push(post)
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
})

const postStats = computed(() => ({
  total: posts.value.length,
  tags: allTags.value.length,
  thisMonth: posts.value.filter(p => {
    const d = new Date(p.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
}))

function goToPost(url: string) {
  router.go(url)
}

function observePostItems() {
  nextTick(() => {
    document.querySelectorAll('.post-card').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed')
      } else if (observer) {
        observer.observe(el)
      }
    })
  })
}

watch([activeTag, searchQuery, posts], () => observePostItems())

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed')
      })
    },
    { threshold: 0.05, rootMargin: '50px 0px' }
  )
  observePostItems()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div class="archive-layout">
    <!-- 左侧标签导航 -->
    <aside class="tag-sidebar">
      <nav class="tag-nav">
        <a
          class="tag-nav-item"
          :class="{ active: activeTag === null }"
          @click.prevent="activeTag = null"
        >
          <span class="tag-nav-text">全部</span>
          <span class="tag-nav-count">{{ posts.length }}</span>
        </a>
        <a
          v-for="tag in allTags"
          :key="tag"
          class="tag-nav-item"
          :class="{ active: activeTag === tag }"
          @click.prevent="activeTag = tag"
        >
          <span class="tag-nav-text">{{ tag }}</span>
          <span class="tag-nav-count">{{ posts.filter(p => p.tags?.includes(tag)).length }}</span>
        </a>
      </nav>
    </aside>

    <!-- 中间内容区 -->
    <main class="content-main">
      <!-- 搜索框 -->
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章..."
          class="search-input"
        />
      </div>

      <!-- 文章列表 -->
      <div class="post-list-container">
        <template v-if="filteredPosts.length > 0">
          <article
            v-for="(post, index) in filteredPosts"
            :key="post.url"
            class="post-item"
            @click="goToPost(post.url)"
          >
            <div class="post-meta">
              <time class="post-date">{{ post.date }}</time>
              <span v-if="post.readTime" class="post-readtime">{{ post.readTime }} 分钟</span>
            </div>
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
            <div class="post-tags" v-if="post.tags?.length">
              <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
            </div>
          </article>
        </template>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <p class="empty-text">没有找到匹配的文章</p>
          <button class="empty-btn" @click="searchQuery = ''; activeTag = null">清除筛选</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ==================== Layout ==================== */
.archive-layout {
  display: flex;
  max-width: 1140px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  gap: 2rem;
}

/* ==================== Left Sidebar ==================== */
.tag-sidebar {
  width: 160px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  height: fit-content;
}

.tag-nav {
  display: flex;
  flex-direction: column;
}

.tag-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.tag-nav-item:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.tag-nav-item.active {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.tag-nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  width: 3px;
  height: 1.5rem;
  background: var(--vp-c-brand-1);
  border-radius: 0 2px 2px 0;
}

.tag-nav-text {
  flex: 1;
}

.tag-nav-count {
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
}

/* ==================== Content Main ==================== */
.content-main {
  flex: 1;
  min-width: 0;
}

/* ==================== Search ==================== */
.search-box {
  position: relative;
  margin-bottom: 1.5rem;
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
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
}

/* ==================== Post List ==================== */
.post-list-container {
  display: flex;
  flex-direction: column;
}

.post-item {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--vp-c-border);
  cursor: pointer;
  transition: background 0.2s;
}

.post-item:hover {
  background: var(--vp-c-bg-soft);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.post-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.post-readtime {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  line-height: 1.6;
  transition: color 0.2s;
}

.post-item:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-excerpt {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.post-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.post-tag {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
}

/* ==================== Empty ==================== */
.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-text {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
}

.empty-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .archive-layout {
    flex-direction: column;
    padding: 1rem;
  }
  .tag-sidebar {
    width: 100%;
    position: static;
  }
  .tag-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .tag-nav-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
