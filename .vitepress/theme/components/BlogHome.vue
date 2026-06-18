<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import { data as posts } from '../../posts.data.js'

const router = useRouter()
const latestPosts = posts.slice(0, 6)

// 打字机效果
const typedText = ref('')
const phrases = ['工单系统', 'Vue 生态', '前端工程化', '代码之美']
const phraseIndex = ref(0)
const charIndex = ref(0)
const isDeleting = ref(false)

onMounted(() => {
  // 只在不支持 prefers-reduced-motion 或用户没开启时运行打字效果
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    typedText.value = phrases[0]
    return
  }
  typeEffect()
})

function typeEffect() {
  const currentPhrase = phrases[phraseIndex.value]
  const speed = isDeleting.value ? 40 : 80

  if (!isDeleting.value && charIndex.value < currentPhrase.length) {
    typedText.value = currentPhrase.substring(0, charIndex.value + 1)
    charIndex.value++
    setTimeout(typeEffect, speed)
  } else if (isDeleting.value && charIndex.value > 0) {
    typedText.value = currentPhrase.substring(0, charIndex.value - 1)
    charIndex.value--
    setTimeout(typeEffect, speed / 2)
  } else if (!isDeleting.value) {
    setTimeout(() => { isDeleting.value = true; typeEffect() }, 2000)
  } else {
    isDeleting.value = false
    phraseIndex.value = (phraseIndex.value + 1) % phrases.length
    setTimeout(typeEffect, 500)
  }
}

function goToPost(url: string) {
  router.go(url)
}
</script>

<template>
  <!-- ====== 英雄区 ====== -->
  <section class="hero-section">
    <!-- 装饰性光晕 -->
    <div class="hero-glow hero-glow-1" />
    <div class="hero-glow hero-glow-2" />

    <div class="hero-content">
      <p class="hero-greeting">👋 你好，我是</p>
      <h1 class="hero-name neon-text">
        <span class="name-gradient">Xiaozhou</span>
      </h1>
      <p class="hero-tagline">
        专注于
        <span class="typed-wrapper">
          <span class="typed-text">{{ typedText }}</span>
          <span class="cursor" :class="{ 'cursor-hidden': !typedText }">|</span>
        </span>
      </p>
      <p class="hero-desc">
        工单流程系统前端开发者 · 4,700+ Git提交 · 热爱技术与分享
      </p>
      <div class="hero-actions">
        <a href="/blog" class="hero-btn hero-btn-primary">
          浏览文章
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="/about" class="hero-btn hero-btn-secondary">
          关于我
        </a>
      </div>
    </div>
  </section>

  <!-- ====== 最新文章 ====== -->
  <section class="latest-posts" v-if="latestPosts.length > 0">
    <div class="section-header">
      <h2 class="section-title">最新文章</h2>
      <div class="section-line" />
    </div>

    <div class="posts-grid">
      <article
        v-for="post in latestPosts"
        :key="post.url"
        class="post-card"
        @click="goToPost(post.url)"
      >
        <div class="post-card-glow" />
        <div class="post-card-body">
          <div class="post-meta">
            <time class="post-date">{{ post.date }}</time>
            <span v-if="post.tags?.length" class="post-tags">
              <span
                v-for="tag in post.tags.slice(0, 2)"
                :key="tag"
                class="post-tag"
              >{{ tag }}</span>
            </span>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
        </div>
      </article>
    </div>

    <div class="section-footer">
      <a href="/blog" class="view-all-link">
        查看全部文章
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
/* ========== Hero Section ========== */
.hero-section {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 6rem 1.5rem 4rem;
}

/* 光晕装饰 */
.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
}

.hero-glow-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #00e5ff 0%, transparent 70%);
  top: -200px;
  right: -100px;
  animation: glowFloat 8s ease-in-out infinite alternate;
}

.hero-glow-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #a855f7 0%, transparent 70%);
  bottom: -150px;
  left: -100px;
  animation: glowFloat 10s ease-in-out infinite alternate-reverse;
}

@keyframes glowFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -30px) scale(1.1); }
}

.hero-content {
  position: relative;
  text-align: center;
  max-width: 700px;
  z-index: 1;
}

.hero-greeting {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.hero-name {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.2rem;
}

.name-gradient {
  background: linear-gradient(135deg, #e2e8f0 0%, #00e5ff 40%, #a855f7 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-tagline {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.8rem;
}

.typed-wrapper {
  display: inline-block;
  min-width: 120px;
  text-align: left;
}

.typed-text {
  color: #00e5ff;
  font-weight: 600;
}

.cursor {
  display: inline-block;
  color: #00e5ff;
  font-weight: 300;
  animation: blink 0.8s step-end infinite;
}

.cursor-hidden {
  opacity: 0;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-desc {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.hero-btn-primary {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(168, 85, 247, 0.15));
  border: 1px solid rgba(0, 229, 255, 0.3);
  color: #00e5ff;
}

.hero-btn-primary:hover {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.25), rgba(168, 85, 247, 0.25));
  border-color: rgba(0, 229, 255, 0.6);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.15);
  transform: translateY(-2px);
}

.hero-btn-secondary {
  background: rgba(56, 189, 248, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: var(--vp-c-text-1);
}

.hero-btn-secondary:hover {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(56, 189, 248, 0.1);
  transform: translateY(-2px);
}

/* ========== Latest Posts Section ========== */
.latest-posts {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  white-space: nowrap;
  background: linear-gradient(135deg, #e2e8f0, #00e5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.3), transparent);
}

/* ===== Post Cards ===== */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.post-card {
  position: relative;
  border-radius: 16px;
  border: 1px solid rgba(56, 189, 248, 0.08);
  background: rgba(16, 24, 48, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-card:hover {
  border-color: rgba(0, 229, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 0 40px rgba(0, 229, 255, 0.06);
}

.post-card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 229, 255, 0.06), transparent);
  transition: opacity 0.3s;
}

.post-card:hover .post-card-glow {
  opacity: 1;
}

.post-card-body {
  padding: 1.5rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.82rem;
}

.post-date {
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.post-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.post-tag {
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(0, 229, 255, 0.08);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.12);
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-excerpt {
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.section-footer {
  text-align: center;
  margin-top: 2.5rem;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #00e5ff;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
  border: 1px solid rgba(0, 229, 255, 0.15);
}

.view-all-link:hover {
  background: rgba(0, 229, 255, 0.06);
  border-color: rgba(0, 229, 255, 0.3);
  transform: translateY(-1px);
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .hero-name { font-size: 2.8rem; }
  .hero-tagline { font-size: 1.2rem; }
  .hero-section { min-height: 70vh; padding-top: 5rem; }
  .posts-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .hero-name { font-size: 2.2rem; }
}
</style>
