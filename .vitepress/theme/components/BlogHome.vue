<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vitepress'
import { data as posts } from '../../posts.data.js'

const router = useRouter()
const route = useRoute()
const latestPosts = posts.slice(0, 6)

const isEnglish = computed(() => route.path.startsWith('/en'))

const t = computed(() => isEnglish.value ? en : zh)

const typedText = ref('')
const typeIndex = ref(0)
const phrases = ['专注于前端工程化', 'Vue 生态探索者', '系统构建实践者']

const zh = {
  greeting: '你好，我是',
  name: 'Xiaozhou',
  readBlog: '浏览文章',
  aboutMe: '关于我',
  scroll: 'SCROLL',
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
  readBlog: 'Read the Blog',
  aboutMe: 'About Me',
  scroll: 'SCROLL',
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

function typeWriter() {
  const currentPhrase = phrases[typeIndex.value]
  if (typedText.value.length < currentPhrase.length) {
    typedText.value += currentPhrase.charAt(typedText.value.length)
    setTimeout(typeWriter, 80)
  } else {
    setTimeout(() => {
      typedText.value = ''
      typeIndex.value = (typeIndex.value + 1) % phrases.length
      typeWriter()
    }, 2000)
  }
}

onMounted(() => {
  typeWriter()
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
    <div class="hero-bg" />
    <div class="hero-content">
      <p class="hero-greeting">{{ t.greeting }}</p>

      <h1 class="hero-title">
        <span class="hero-name">{{ t.name }}</span>
      </h1>

      <div class="hero-subtitle">
        <span class="typed-text">{{ typedText }}</span>
        <span class="typed-cursor">|</span>
      </div>

      <div class="hero-actions">
        <a :href="isEnglish ? '/en/blog' : '/blog'" class="btn btn-primary">
          <span>{{ t.readBlog }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a :href="isEnglish ? '/en/about' : '/about'" class="btn btn-ghost">{{ t.aboutMe }}</a>
      </div>

      <div class="hero-social">
        <a href="https://github.com/zhou0928" target="_blank" class="social-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </div>
    </div>

    <div class="hero-scroll-hint">
      <span>{{ t.scroll }}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
    </div>
  </section>

  <!-- ====== 内容区 ====== -->
  <div class="page-body">
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
  </div>
</template>

<style scoped>
/* ==================== Hero ==================== */
.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 1.5rem;
  margin-top: -64px;
  padding-top: 64px;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  z-index: 0;
}

.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.4) 0%, transparent 50%);
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
  max-width: 800px;
  animation: heroEnter 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes heroEnter {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-greeting {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero-title {
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.hero-name {
  font-size: 5.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  font-family: var(--vp-font-family-heading);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 3rem;
  min-height: 1.5em;
  font-weight: 300;
}

.typed-cursor {
  animation: blink 1s infinite;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 100;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.hero-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.hero-scroll-hint {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  animation: scrollBounce 2s ease-in-out infinite;
}

.hero-scroll-hint svg {
  width: 20px;
  height: 20px;
}

@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
  50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
}

/* ==================== Buttons ==================== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary {
  background: #fff;
  color: #1a1a2e !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff !important;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* ==================== Page Body ==================== */
.page-body {
  position: relative;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
  padding-top: 2rem;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
  max-width: 640px;
  animation: heroEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes heroEnter {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-greeting {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
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
  color: #fff;
  font-family: var(--vp-font-family-heading);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  min-height: 1.5em;
}

.typed-cursor {
  animation: blink 1s infinite;
  color: rgba(255, 255, 255, 0.8);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.hero-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transition: all 0.3s;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
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
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

/* ==================== Page Body ==================== */
.page-body {
  position: relative;
  background: linear-gradient(180deg, #f5f7fa 0%, #fff 100%);
  min-height: 100vh;
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
  background: #fff;
  color: #667eea !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff !important;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.6);
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
