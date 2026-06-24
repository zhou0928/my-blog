<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vitepress'
import { data as posts } from '../../posts.data.js'

const router = useRouter()
const route = useRoute()
const latestPosts = posts.slice(0, 6)

const isEnglish = computed(() => route.path.startsWith('/en'))

const t = computed(() => isEnglish.value ? en : zh)

const zh = {
  greeting: '你好，我是',
  name: 'Xiaozhou',
  subtitle: ['专注于 ', '前端工程化', ' 和 ', '系统构建'],
  readBlog: '浏览文章',
  aboutMe: '关于我',
  scroll: '向下滚动',
  sectionLatest: '最新文章',
  minRead: '分钟阅读',
  viewAll: '查看全部文章',
  skills: '技术栈',
  ctaTitle: '开始阅读',
  ctaDesc: '探索前端工程化、Vue 生态与系统构建相关文章',
  browseAll: '浏览全部',
  articles: '篇文章',
  topics: '个主题',
}

const en = {
  greeting: "Hello, I'm",
  name: 'Xiaozhou',
  subtitle: ['Writing about ', 'frontend engineering', ' and ', 'building systems'],
  readBlog: 'Read the Blog',
  aboutMe: 'About Me',
  scroll: 'Scroll',
  sectionLatest: 'Latest',
  minRead: 'min read',
  viewAll: 'View all articles',
  skills: 'Skills',
  ctaTitle: 'Start Reading',
  ctaDesc: 'Explore articles on frontend engineering, Vue ecosystem, and building production systems',
  browseAll: 'Browse all',
  articles: 'Articles',
  topics: 'Topics',
}

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReduced) initScrollReveal()
})

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed')
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el))
}

function goToPost(url: string) {
  router.go(url)
}
</script>

<template>
  <!-- ====== Hero ====== -->
  <section class="hero">
    <div class="hero-content">
      <div class="hero-accent-bar" />

      <p class="hero-greeting">{{ t.greeting }}</p>

      <h1 class="hero-title">
        <span class="hero-name">{{ t.name }}</span>
      </h1>

      <p class="hero-subtitle">
        {{ t.subtitle[0] }}<em>{{ t.subtitle[1] }}</em>{{ t.subtitle[2] }}<em>{{ t.subtitle[3] }}</em>
      </p>

      <div class="hero-actions">
        <a :href="isEnglish ? '/en/blog' : '/blog'" class="btn btn-primary">
          <span>{{ t.readBlog }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a :href="isEnglish ? '/en/about' : '/about'" class="btn btn-ghost">{{ t.aboutMe }}</a>
      </div>
    </div>

    <div class="hero-scroll-hint">
      <span>{{ t.scroll }}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
    </div>
  </section>

  <!-- ====== 文章 ====== -->
  <section class="section" v-if="latestPosts.length > 0">
    <div class="section-header scroll-reveal">
      <div class="section-title-row">
        <h2 class="section-title">{{ t.sectionLatest }}</h2>
        <div class="section-line" />
      </div>
    </div>

    <div class="posts-grid">
      <article
        v-for="(post, index) in latestPosts"
        :key="post.url"
        class="post-card scroll-reveal"
        :style="{ transitionDelay: (index * 0.08) + 's' }"
        @click="goToPost(post.url)"
      >
        <div class="card-content">
          <div class="card-meta">
            <time>{{ post.date }}</time>
            <span v-if="post.readTime" class="card-readtime">{{ post.readTime }} {{ t.minRead }}</span>
          </div>
          <h3 class="card-title">{{ post.title }}</h3>
          <p class="card-desc">{{ post.excerpt }}</p>
          <div class="card-tags" v-if="post.tags?.length">
            <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="card-tag">{{ tag }}</span>
          </div>
        </div>
      </article>
    </div>

    <div class="section-more scroll-reveal">
      <a :href="isEnglish ? '/en/blog' : '/blog'" class="more-link">
        <span>{{ t.viewAll }}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </section>

  <!-- ====== 技术栈 ====== -->
  <section class="section tech-section scroll-reveal">
    <div class="section-header">
      <div class="section-title-row">
        <h2 class="section-title">{{ t.skills }}</h2>
        <div class="section-line" />
      </div>
    </div>
    <div class="tech-grid">
      <div v-for="tech in ['Vue 3', 'TypeScript', 'Vite', 'Node.js', 'Git', 'CSS']" :key="tech" class="tech-card">
        <span class="tech-letter">{{ tech.charAt(0) }}</span>
        <span class="tech-name">{{ tech }}</span>
      </div>
    </div>
  </section>

  <!-- ====== CTA ====== -->
  <section class="section cta-section scroll-reveal">
    <div class="cta-card">
      <div class="cta-content">
        <div class="cta-accent-bar" />
        <h2 class="cta-title">{{ t.ctaTitle }}</h2>
        <p class="cta-desc">{{ t.ctaDesc }}</p>
        <a :href="isEnglish ? '/en/blog' : '/blog'" class="btn btn-primary">
          <span>{{ t.browseAll }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="cta-visual">
        <div class="cta-stats">
          <div class="cta-stat">
            <span class="cta-stat-num">{{ posts.length }}</span>
            <span class="cta-stat-label">{{ t.articles }}</span>
          </div>
          <div class="cta-stat">
            <span class="cta-stat-num">{{ [...new Set(posts.flatMap(p => p.tags || []))].length }}</span>
            <span class="cta-stat-label">{{ t.topics }}</span>
          </div>
          <div class="cta-stat">
            <span class="cta-stat-num">{{ posts.reduce((s, p) => s + (p.readTime ? parseInt(p.readTime) : 0), 0) }}</span>
            <span class="cta-stat-label">{{ t.minRead }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ==================== Hero ==================== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 5rem 1.5rem 4rem;
}

.hero-content {
  position: relative;
  text-align: left;
  z-index: 1;
  max-width: 640px;
  animation: heroEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes heroEnter {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-accent-bar {
  width: 48px;
  height: 3px;
  background: var(--vp-c-brand-1);
  border-radius: 2px;
  margin-bottom: 1.5rem;
}

.hero-greeting {
  font-size: 1.1rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.02em;
}

.hero-title {
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-name {
  font-size: 4.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-heading);
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2.5rem;
  line-height: 1.7;
  max-width: 480px;
}
.hero-subtitle em {
  font-style: normal;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.hero-scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation: scrollBounce 2s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

/* ==================== Buttons ==================== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: white !important;
  box-shadow: 0 2px 8px rgba(184, 134, 11, 0.2);
}
.btn-primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2) !important;
}
.btn-ghost:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
}

/* ==================== Section ==================== */
.section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
}

.section-header {
  margin-bottom: 2.5rem;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  white-space: nowrap;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-heading);
}

.section-line {
  flex: 1;
  height: 1px;
  background: var(--vp-c-border);
}

/* ==================== Post Cards ==================== */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.post-card {
  position: relative;
  border-radius: var(--c-radius-md);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(184, 134, 11, 0.06);
}

.dark .post-card:hover {
  box-shadow: 0 12px 32px rgba(212, 148, 58, 0.08);
}

.card-content {
  padding: 1.5rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.card-readtime {
  font-size: 0.72rem;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}

.post-card:hover .card-title { color: var(--vp-c-brand-1); }

.card-desc {
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
}

.card-tags {
  display: flex;
  gap: 0.3rem;
}

.card-tag {
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.section-more {
  text-align: center;
  margin-top: 2.5rem;
}

.more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  transition: all 0.3s;
}

.more-link:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}

/* ==================== Tech ==================== */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.tech-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1.25rem 1rem;
  border-radius: var(--c-radius-md);
  background: var(--vp-c-bg-soft);
  transition: all 0.3s;
}

.tech-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184, 134, 11, 0.06);
}

.dark .tech-card:hover {
  box-shadow: 0 6px 20px rgba(212, 148, 58, 0.08);
}

.tech-letter {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-heading);
  transition: all 0.3s;
}

.tech-card:hover .tech-letter {
  transform: scale(1.05);
}

.tech-name {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* ==================== CTA ==================== */
.cta-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 3rem;
  border-radius: var(--c-radius-xl);
  background: var(--vp-c-bg-soft);
  align-items: center;
}

.cta-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cta-accent-bar {
  width: 40px;
  height: 3px;
  background: var(--vp-c-brand-1);
  border-radius: 2px;
}

.cta-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-heading);
}

.cta-desc {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  line-height: 1.65;
}

.cta-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cta-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  text-align: center;
}

.cta-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cta-stat-num {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  line-height: 1;
}

.cta-stat-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
}

/* ==================== Responsive ==================== */
@media (max-width: 900px) {
  .posts-grid { grid-template-columns: repeat(2, 1fr); }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
  .cta-card { grid-template-columns: 1fr; gap: 2rem; }
  .cta-stats { justify-content: center; }
}

@media (max-width: 768px) {
  .hero-name { font-size: 3.2rem; }
  .hero-subtitle { font-size: 1.05rem; }
  .hero-content { text-align: center; }
  .hero-actions { justify-content: center; }
}

@media (max-width: 640px) {
  .hero-name { font-size: 2.6rem; }
  .posts-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
  .cta-card { padding: 2rem 1.5rem; }
}

@media (max-width: 480px) {
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
