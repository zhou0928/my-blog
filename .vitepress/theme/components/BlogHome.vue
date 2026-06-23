<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import { data as posts } from '../../posts.data.js'

const router = useRouter()
const latestPosts = posts.slice(0, 6)

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
    <div class="hero-orb hero-orb-1" />
    <div class="hero-orb hero-orb-2" />
    <div class="hero-grid" />

    <div class="hero-content">
      <div class="hero-badge">Frontend Engineer</div>

      <h1 class="hero-title">
        <span class="hero-name">Xiaozhou</span>
      </h1>

      <p class="hero-subtitle">
        专注于<em>前端工程化</em>与<em>工单系统</em>
      </p>

      <div class="hero-actions">
        <a href="/blog" class="btn btn-primary">
          <span>浏览文章</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="/about" class="btn btn-ghost">关于我</a>
      </div>
    </div>

    <div class="hero-scroll-hint">
      <span>Scroll</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
    </div>
  </section>

  <!-- ====== 文章 ====== -->
  <section class="section" v-if="latestPosts.length > 0">
    <div class="section-header scroll-reveal">
      <span class="section-tag">Latest</span>
      <h2 class="section-title">最新文章</h2>
      <div class="section-line" />
    </div>

    <div class="posts-grid">
      <article
        v-for="(post, index) in latestPosts"
        :key="post.url"
        class="post-card scroll-reveal"
        :style="{ transitionDelay: (index * 0.08) + 's' }"
        @click="goToPost(post.url)"
      >
        <div class="card-shine" />
        <div class="card-content">
          <div class="card-meta">
            <time>{{ post.date }}</time>
            <span v-if="post.readTime" class="card-readtime">{{ post.readTime }} min</span>
            <span v-if="post.tags?.length" class="card-tags">
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="card-tag">{{ tag }}</span>
            </span>
          </div>
          <h3 class="card-title">{{ post.title }}</h3>
          <p class="card-desc">{{ post.excerpt }}</p>
          <div class="card-footer">
            <span class="card-link">阅读全文 →</span>
          </div>
        </div>
      </article>
    </div>

    <div class="section-more scroll-reveal">
      <a href="/blog" class="more-link">
        <span>查看全部文章</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </section>

  <!-- ====== 技术栈 ====== -->
  <section class="section tech-section scroll-reveal">
    <div class="section-header">
      <span class="section-tag">Skills</span>
      <h2 class="section-title">技术栈</h2>
      <div class="section-line" />
    </div>
    <div class="tech-grid">
      <div v-for="tech in ['Vue 3', 'TypeScript', 'Vite', 'Node.js', 'Git', 'CSS']" :key="tech" class="tech-card" :style="{ transitionDelay: (0.06 * $index) + 's' }">
        <div class="tech-icon">{{ tech.charAt(0) }}</div>
        <span>{{ tech }}</span>
      </div>
    </div>
  </section>

  <!-- ====== CTA ====== -->
  <section class="section cta-section scroll-reveal">
    <div class="cta-card">
      <div class="cta-content">
        <h2 class="cta-title">开始阅读</h2>
        <p class="cta-desc">探索关于前端工程化、Vue 生态和工单系统的深度文章</p>
        <a href="/blog" class="btn btn-primary">
          <span>浏览全部</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="cta-visual">
        <div class="cta-stats">
          <div class="cta-stat">
            <span class="cta-stat-num">{{ posts.length }}</span>
            <span class="cta-stat-label">文章</span>
          </div>
          <div class="cta-stat">
            <span class="cta-stat-num">{{ [...new Set(posts.flatMap(p => p.tags || []))].length }}</span>
            <span class="cta-stat-label">标签</span>
          </div>
          <div class="cta-stat">
            <span class="cta-stat-num">{{ posts.reduce((s, p) => s + (p.readTime ? parseInt(p.readTime) : 0), 0) }}</span>
            <span class="cta-stat-label">分钟阅读</span>
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

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  pointer-events: none;
}

.hero-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, var(--vp-c-brand-1) 0%, transparent 70%);
  top: -200px; right: -100px;
  animation: orbFloat 12s ease-in-out infinite alternate;
}

.hero-orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #a855f7 0%, transparent 70%);
  bottom: -150px; left: -100px;
  animation: orbFloat 15s ease-in-out infinite alternate-reverse;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -30px) scale(1.1); }
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(8, 145, 178, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(8, 145, 178, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
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

.hero-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-brand-1);
  margin-bottom: 1.5rem;
}

.hero-title {
  margin-bottom: 0.75rem;
  line-height: 1.1;
}

.hero-name {
  font-size: 5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--vp-c-text-1), var(--vp-c-brand-1), #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
  line-height: 1.6;
}
.hero-subtitle em {
  font-style: normal;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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
  padding: 0.8rem 1.6rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: white !important;
  box-shadow: 0 4px 16px rgba(8, 145, 178, 0.25);
}
.btn-primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(8, 145, 178, 0.35);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1) !important;
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
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.section-tag {
  padding: 0.25rem 0.7rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  white-space: nowrap;
  color: var(--vp-c-text-1);
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
  gap: 1.25rem;
}

.post-card {
  position: relative;
  border-radius: var(--c-radius-md);
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.post-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 16px 40px rgba(8, 145, 178, 0.06);
  transform: translateY(-4px);
}

.card-shine {
  position: absolute;
  inset: 0;
  background: radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--vp-c-brand-soft), transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.post-card:hover .card-shine { opacity: 1; }

.card-content {
  padding: 1.25rem 1.5rem 1.5rem;
  position: relative;
  z-index: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.card-readtime {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
}

.card-tags {
  display: inline-flex;
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
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
}

.card-footer {
  display: flex;
}

.card-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s;
}

.post-card:hover .card-link { opacity: 1; transform: translateX(0); }

.section-more {
  text-align: center;
  margin-top: 2.5rem;
}

.more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
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
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  transition: all 0.3s;
}

.tech-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(8, 145, 178, 0.05);
}

.tech-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--vp-c-brand-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  transition: all 0.3s;
}

.tech-card:hover .tech-icon {
  transform: scale(1.08);
  box-shadow: 0 0 20px rgba(8, 145, 178, 0.15);
}

.tech-card span {
  font-size: 0.85rem;
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
  border: 1px solid var(--vp-c-border);
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, rgba(168, 85, 247, 0.04) 100%);
  align-items: center;
}

.cta-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cta-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.cta-desc {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
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
  font-weight: 800;
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
  .hero-name { font-size: 3.5rem; }
  .hero-subtitle { font-size: 1.1rem; }
}

@media (max-width: 640px) {
  .hero-name { font-size: 2.8rem; }
  .posts-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
  .cta-card { padding: 2rem 1.5rem; }
}

@media (max-width: 480px) {
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
