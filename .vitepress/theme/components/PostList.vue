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
    <!-- 中间内容区 -->
    <main class="content-main">
      <!-- 文章列表 -->
      <div class="post-list-container">
        <template v-if="filteredPosts.length > 0">
          <article
            v-for="(post, index) in filteredPosts"
            :key="post.url"
            class="post-card"
            :class="{ 'post-card--right': index % 2 === 1 }"
            @click="goToPost(post.url)"
          >
            <div class="post-cover" v-if="post.cover">
              <img :src="post.cover" :alt="post.title" />
            </div>
            <div class="post-info">
              <h2 class="post-title">{{ post.title }}</h2>
              <div class="post-meta">
                <time class="post-date">{{ post.date }}</time>
                <span class="post-separator">|</span>
                <span v-if="post.tags?.length" class="post-categories">{{ post.tags[0] }}</span>
              </div>
              <p class="post-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
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

    <!-- 右侧边栏 -->
    <aside class="aside-content">
      <!-- 作者信息 -->
      <div class="card-widget card-info">
        <div class="avatar-img">
          <img src="/favicon.svg" alt="avatar" />
        </div>
        <div class="author-info-name">Xiaozhou</div>
        <div class="author-info-description">前端开发 · Vue 生态</div>
        <div class="site-data">
          <div class="data-item">
            <div class="headline">文章</div>
            <div class="length-num">{{ posts.length }}</div>
          </div>
          <div class="data-item">
            <div class="headline">标签</div>
            <div class="length-num">{{ allTags.length }}</div>
          </div>
        </div>
      </div>

      <!-- 标签云 -->
      <div class="card-widget card-tags">
        <div class="item-headline">
          <span>标签</span>
        </div>
        <div class="card-tag-cloud">
          <a
            v-for="tag in allTags"
            :key="tag"
            class="tag-item"
            :class="{ active: activeTag === tag }"
            @click.prevent="activeTag = activeTag === tag ? null : tag"
          >
            {{ tag }}
            <span class="tag-count">{{ posts.filter(p => p.tags?.includes(tag)).length }}</span>
          </a>
        </div>
      </div>

      <!-- 最新文章 -->
      <div class="card-widget card-recent">
        <div class="item-headline">
          <span>最新文章</span>
        </div>
        <div class="aside-list">
          <div
            v-for="post in posts.slice(0, 5)"
            :key="post.url"
            class="aside-list-item"
            @click="goToPost(post.url)"
          >
            <div class="content">
              <a class="title">{{ post.title }}</a>
              <time>{{ post.date }}</time>
            </div>
          </div>
        </div>
      </div>
    </aside>
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

/* ==================== Content Main ==================== */
.content-main {
  flex: 1;
  min-width: 0;
}

/* ==================== Post List ==================== */
.post-list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e4e6e8;
  cursor: pointer;
  transition: all 0.3s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.post-card--right {
  flex-direction: row-reverse;
}

.post-cover {
  width: 200px;
  flex-shrink: 0;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  flex: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  transition: color 0.2s;
}

.post-card:hover .post-title {
  color: #409eff;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #909399;
}

.post-separator {
  color: #dcdfe6;
}

.post-excerpt {
  font-size: 0.85rem;
  color: #909399;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ==================== Aside ==================== */
.aside-content {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-widget {
  background: #fff;
  border: 1px solid #e4e6e8;
  border-radius: 8px;
  padding: 1.25rem;
}

/* Card Info */
.card-info {
  text-align: center;
}

.avatar-img img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info-name {
  font-size: 1rem;
  font-weight: 600;
  color: #303133;
  margin: 0.75rem 0 0.25rem;
}

.author-info-description {
  font-size: 0.8rem;
  color: #909399;
  margin-bottom: 1rem;
}

.site-data {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 0.75rem 0;
  border-top: 1px solid #e4e6e8;
  border-bottom: 1px solid #e4e6e8;
}

.data-item {
  text-align: center;
}

.data-item .headline {
  font-size: 0.75rem;
  color: #909399;
}

.data-item .length-num {
  font-size: 1.25rem;
  font-weight: 700;
  color: #303133;
}

/* Card Tags */
.item-headline {
  font-size: 0.9rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e4e6e8;
}

.card-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #606266;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.tag-item:hover {
  color: #409eff;
  background: #ecf5ff;
}

.tag-item.active {
  color: #fff;
  background: #409eff;
}

.tag-count {
  font-size: 0.7rem;
  color: #909399;
}

.tag-item.active .tag-count {
  color: rgba(255, 255, 255, 0.8);
}

/* Card Recent */
.aside-list {
  display: flex;
  flex-direction: column;
}

.aside-list-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f2f3f5;
  cursor: pointer;
}

.aside-list-item:last-child {
  border-bottom: none;
}

.aside-list-item .title {
  font-size: 0.85rem;
  color: #303133;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}

.aside-list-item:hover .title {
  color: #409eff;
}

.aside-list-item time {
  font-size: 0.75rem;
  color: #909399;
}

/* ==================== Empty ==================== */
.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-text {
  font-size: 0.9rem;
  color: #909399;
  margin-bottom: 1rem;
}

.empty-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #606266;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

/* ==================== Responsive ==================== */
@media (max-width: 992px) {
  .archive-layout {
    flex-direction: column;
  }
  .aside-content {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .card-widget {
    flex: 1;
    min-width: 280px;
  }
}

@media (max-width: 640px) {
  .post-card {
    flex-direction: column !important;
  }
  .post-cover {
    width: 100%;
    height: 160px;
  }
}
</style>
