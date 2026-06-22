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
  <div class="archive-page">
    <!-- Hero 区域 -->
    <div class="archive-hero">
      <div class="hero-bg" />
      <div class="hero-content">
        <span class="hero-tag">{{ isEn ? 'Archive' : '归档' }}</span>
        <h1 class="hero-title">{{ isEn ? 'All Posts' : '全部文章' }}</h1>
        <p class="hero-subtitle">{{ isEn ? 'Thoughts, tutorials and discoveries' : '思考、教程与发现' }}</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-num">{{ postStats.total }}</span>
        <span class="stat-label">{{ isEn ? 'Posts' : '篇文章' }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ postStats.tags }}</span>
        <span class="stat-label">{{ isEn ? 'Tags' : '个标签' }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ postStats.thisMonth }}</span>
        <span class="stat-label">{{ isEn ? 'This Month' : '本月' }}</span>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="isEn ? 'Search posts...' : '搜索文章...'"
        class="search-input"
      />
      <span v-if="searchQuery" class="search-count">{{ filteredPosts.length }} {{ isEn ? 'results' : '篇' }}</span>
    </div>

    <!-- 标签过滤器 -->
    <div class="tag-filter" v-if="allTags.length > 0">
      <button
        class="tag-chip"
        :class="{ 'tag-active': activeTag === null }"
        @click="activeTag = null"
      >
        <span class="tag-icon">📋</span>
        {{ isEn ? 'All' : '全部' }}
        <span class="tag-count">{{ posts.length }}</span>
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-chip"
        :class="{ 'tag-active': activeTag === tag }"
        @click="activeTag = tag"
      >
        # {{ tag }}
        <span class="tag-count">{{ posts.filter(p => p.tags?.includes(tag)).length }}</span>
      </button>
    </div>

    <!-- 文章列表 -->
    <template v-if="filteredPosts.length > 0">
      <div v-for="([year, yearPosts], gi) in groupedPosts" :key="year" class="year-group">
        <h2 class="year-heading">
          <span class="year-label">{{ year }}</span>
          <span class="year-count">{{ yearPosts.length }} {{ isEn ? 'posts' : '篇' }}</span>
        </h2>
        <div class="posts-list">
          <article
            v-for="(post, index) in yearPosts"
            :key="post.url"
            class="post-card"
            :style="{ animationDelay: ((gi * 0.1) + (index * 0.06)) + 's' }"
            @click="goToPost(post.url)"
          >
            <div class="post-index">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="post-body">
              <div class="post-meta">
                <time class="post-date">{{ post.date }}</time>
                <span v-if="post.readTime" class="post-readtime">{{ post.readTime }} {{ isEn ? 'min' : '分钟' }}</span>
                <span v-if="post.tags?.length" class="post-tags">
                  <span v-for="tag in post.tags" :key="tag" class="post-tag"># {{ tag }}</span>
                </span>
              </div>
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
            </div>
            <div class="post-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </article>
        </div>
      </div>
    </template>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <p class="empty-text">{{ isEn ? 'No matching posts found' : '没有找到匹配的文章' }}</p>
      <button class="empty-btn" @click="searchQuery = ''; activeTag = null">{{ isEn ? 'Clear filters' : '清除筛选' }}</button>
    </div>
  </div>
</template>

<style scoped>
.archive-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem 6rem;
}

/* ==================== Hero ==================== */
.archive-hero {
  position: relative;
  padding: 5rem 0 3rem;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border-radius: 20px;
}

.dark .hero-bg {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-tag {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, var(--vp-c-text-1), var(--vp-c-brand-1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-3);
}

/* ==================== Stats ==================== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.stat-num {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
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
  padding: 0.875rem 5rem 0.875rem 3rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.search-count {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* ==================== Tags ==================== */
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.tag-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.tag-active {
  border-color: var(--vp-c-brand-1) !important;
  background: var(--vp-c-brand-soft) !important;
  color: var(--vp-c-brand-1) !important;
}

.tag-icon {
  font-size: 0.9rem;
}

.tag-count {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
}

/* ==================== Year Groups ==================== */
.year-group {
  margin-bottom: 2rem;
}

.year-heading {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.year-label {
  font-size: 1.75rem;
  font-weight: 800;
  font-family: var(--vp-font-family-mono);
  background: linear-gradient(135deg, var(--vp-c-text-1), var(--vp-c-brand-1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.year-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* ==================== Post Cards ==================== */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.post-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
  transform: translateX(6px);
  box-shadow: 0 4px 20px rgba(0, 229, 255, 0.08);
}

.post-index {
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  opacity: 0.5;
  min-width: 28px;
}

.post-card:hover .post-index {
  color: var(--vp-c-brand-1);
  opacity: 1;
}

.post-body {
  flex: 1;
  min-width: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
  flex-wrap: wrap;
}

.post-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.post-readtime {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
}

.post-tags {
  display: inline-flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.post-tag {
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.3rem;
  line-height: 1.4;
  transition: color 0.3s;
}

.post-card:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-excerpt {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-arrow {
  color: var(--vp-c-text-3);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s;
  flex-shrink: 0;
}

.post-card:hover .post-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--vp-c-brand-1);
}

/* ==================== Empty ==================== */
.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-text {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1.5rem;
}

.empty-btn {
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.empty-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* ==================== Responsive ==================== */
@media (max-width: 640px) {
  .hero-title { font-size: 2rem; }
  .stats-row { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  .stat-card { padding: 0.75rem 0.5rem; }
  .stat-num { font-size: 1.25rem; }
  .post-card { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .post-index { display: none; }
  .post-arrow { display: none; }
}
</style>
