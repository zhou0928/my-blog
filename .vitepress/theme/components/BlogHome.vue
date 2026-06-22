<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useData } from 'vitepress'
import { data as posts } from '../../posts.data.js'

const router = useRouter()
const { isDark } = useData()
const latestPosts = posts.slice(0, 6)

// 打字机效果
const typedText = ref('')
const phrases = ['工单系统', 'Vue 生态', '前端工程化', '代码之美']
const phraseIndex = ref(0)
const charIndex = ref(0)
const isDeleting = ref(false)

// 数字滚动
const commitCount = ref(0)
const repoCount = ref(0)
const targetCommits = 4700
const targetRepos = 24

// 粒子 canvas
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particleResizeHandler: (() => void) | null = null

// 鼠标追踪
const cursorGlow = ref({ x: 0, y: 0, visible: false })

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    typedText.value = phrases[0]
    commitCount.value = targetCommits
    repoCount.value = targetRepos
  } else {
    typeEffect()
    if (isDark.value) initParticles()
    initScrollReveal()
    initCursorGlow()
    initCardTilt()
    setTimeout(() => {
      animateCounter(commitCount, targetCommits, 2000)
      animateCounter(repoCount, targetRepos, 1500)
    }, 800)
  }
})

watch(isDark, (dark) => {
  if (dark) {
    initParticles()
  } else {
    destroyParticles()
  }
})

onUnmounted(() => {
  destroyParticles()
})

function destroyParticles() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (particleResizeHandler) {
    window.removeEventListener('resize', particleResizeHandler)
    particleResizeHandler = null
  }
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

// 数字滚动动画
function animateCounter(target: any, end: number, duration: number) {
  const startTime = Date.now()
  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    target.value = Math.floor(end * eased)
    if (progress < 1) requestAnimationFrame(update)
  }
  update()
}

// 打字机效果
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

// 粒子系统
function initParticles() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  particleResizeHandler = resize
  window.addEventListener('resize', resize)

  interface Particle {
    x: number; y: number; vx: number; vy: number; size: number; opacity: number
  }

  const particles: Particle[] = []
  const count = Math.min(60, Math.floor(window.innerWidth / 20))

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    })
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 229, 255, ${p.opacity})`
      ctx.fill()
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x
        const dy = p.y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / 150)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    })
    animationId = requestAnimationFrame(draw)
  }
  draw()
}

// 滚动触发动画
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale')
  
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('revealed')
    }
  })
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  
  elements.forEach((el) => observer.observe(el))
}

// 鼠标追踪光效
function initCursorGlow() {
  document.addEventListener('mousemove', (e) => {
    if (isDark.value) cursorGlow.value = { x: e.clientX, y: e.clientY, visible: true }
  })
  document.addEventListener('mouseleave', () => { cursorGlow.value.visible = false })
}

// 3D 卡片倾斜
function initCardTilt() {
  document.querySelectorAll('.post-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 25
      const rotateY = (centerX - x) / 25
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
      el.style.setProperty('--mouse-x', `${x}px`)
      el.style.setProperty('--mouse-y', `${y}px`)
    })
    card.addEventListener('mouseleave', (e) => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'
    })
  })
}

function goToPost(url: string) {
  router.go(url)
}
</script>

<template>
  <!-- 粒子背景 -->
  <canvas ref="canvasRef" id="particles-canvas" />

  <!-- 鼠标追踪光效 -->
  <div v-if="isDark" class="cursor-glow" :style="{ left: cursorGlow.x + 'px', top: cursorGlow.y + 'px', opacity: cursorGlow.visible ? 1 : 0 }" />

  <!-- ====== 英雄区 ====== -->
  <section class="hero-section">
    <div class="hero-glow hero-glow-1" />
    <div class="hero-glow hero-glow-2" />

    <div class="hero-content">
      <p class="hero-greeting">你好，我是</p>
      <h1 class="hero-name">
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
        工单流程系统前端开发者 · 热爱技术与分享
      </p>

      <!-- 数字统计 -->
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-number">{{ commitCount.toLocaleString() }}+</span>
          <span class="stat-label">Commits</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-number">{{ repoCount }}+</span>
          <span class="stat-label">Projects</span>
        </div>
      </div>

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

    <!-- 滚动提示 -->
    <div class="scroll-indicator">
      <div class="scroll-mouse">
        <div class="scroll-wheel" />
      </div>
    </div>
  </section>

  <!-- ====== 最新文章 ====== -->
  <section class="latest-posts" v-if="latestPosts.length > 0">
    <div class="section-header scroll-reveal">
      <h2 class="section-title">最新文章</h2>
      <div class="section-line" />
    </div>

    <div class="posts-grid">
      <article
        v-for="(post, index) in latestPosts"
        :key="post.url"
        class="post-card scroll-reveal"
        :style="{ transitionDelay: (index * 0.1) + 's' }"
        @click="goToPost(post.url)"
      >
        <!-- 渐变背景装饰 -->
        <div class="post-card-bg" :style="{ background: getCardGradient(index) }" />
        <div class="post-card-content">
          <div class="post-meta">
            <time class="post-date">{{ post.date }}</time>
            <span v-if="post.tags?.length" class="post-tags">
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="post-tag">{{ tag }}</span>
            </span>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-footer">
            <span class="read-more">
              阅读全文
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </article>
    </div>

    <div class="section-footer scroll-reveal">
      <a href="/blog" class="view-all-link">
        查看全部文章
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </section>

  <!-- ====== 技术栈 ====== -->
  <section class="tech-stack scroll-reveal">
    <div class="section-header">
      <h2 class="section-title">技术栈</h2>
      <div class="section-line" />
    </div>
    <div class="tech-grid">
      <div class="tech-item" v-for="(tech, i) in ['Vue 3', 'TypeScript', 'Vite', 'Node.js', 'Git', 'CSS']" :key="tech" :style="{ transitionDelay: (i * 0.08) + 's' }">
        <div class="tech-icon">{{ tech.charAt(0) }}</div>
        <span class="tech-name">{{ tech }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
// 卡片渐变色
const gradients = [
  'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
  'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
  'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
  'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
  'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.08) 100%)',
  'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
]

export default {
  methods: {
    getCardGradient(index: number) {
      return gradients[index % gradients.length]
    }
  }
}
</script>

<style scoped>
/* ========== Hero Section ========== */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 6rem 1.5rem 4rem;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  pointer-events: none;
}

.hero-glow-1 {
  width: 600px; height: 600px;
  background: #00e5ff;
  top: -200px; right: -100px;
  animation: glowFloat 12s ease-in-out infinite alternate;
}

.hero-glow-2 {
  width: 500px; height: 500px;
  background: #a855f7;
  bottom: -150px; left: -100px;
  animation: glowFloat 15s ease-in-out infinite alternate-reverse;
}

@keyframes glowFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, -40px) scale(1.1); }
}

.hero-content {
  position: relative;
  text-align: center;
  max-width: 680px;
  z-index: 1;
}

.hero-greeting {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
}

.hero-name {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.name-gradient {
  background: linear-gradient(135deg, #e2e8f0 0%, #00e5ff 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-tagline {
  font-size: 1.4rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  font-weight: 400;
}

.typed-wrapper {
  display: inline-block;
  min-width: 120px;
  text-align: left;
}

.typed-text {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.cursor {
  display: inline-block;
  color: var(--vp-c-brand-1);
  font-weight: 300;
  animation: blink 1s step-end infinite;
}

.cursor-hidden { opacity: 0; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-desc {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* ========== 数字统计 ========== */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--vp-c-border);
}

/* ========== 按钮 ========== */
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
  padding: 0.875rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.hero-btn-primary {
  background: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 4px 14px rgba(0, 229, 255, 0.25);
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 229, 255, 0.35);
}

.hero-btn-secondary {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.hero-btn-secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

/* ========== 滚动提示 ========== */
.scroll-indicator {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  animation: float 2.5s ease-in-out infinite;
}

.scroll-mouse {
  width: 26px; height: 40px;
  border: 2px solid var(--vp-c-border);
  border-radius: 13px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.scroll-wheel {
  width: 4px; height: 8px;
  background: var(--vp-c-brand-1);
  border-radius: 2px;
  animation: scrollDown 1.8s ease-in-out infinite;
}

@keyframes scrollDown {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(12px); }
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

/* ========== 文章卡片 ========== */
.latest-posts {
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  white-space: nowrap;
  color: var(--vp-c-text-1);
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--vp-c-border), transparent);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.post-card {
  position: relative;
  border-radius: 16px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.post-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.dark .post-card {
  background: rgba(16, 24, 48, 0.6);
  border-color: rgba(56, 189, 248, 0.08);
}

.dark .post-card:hover {
  border-color: rgba(0, 229, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.post-card-bg {
  height: 120px;
  opacity: 0.8;
}

.dark .post-card-bg {
  opacity: 1;
}

.post-card-content {
  padding: 1.25rem 1.5rem 1.5rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
}

.post-date {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-weight: 500;
}

.post-tags {
  display: flex;
  gap: 0.4rem;
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
  line-height: 1.5;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}

.post-card:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-excerpt {
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
}

.post-footer {
  display: flex;
  align-items: center;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s;
}

.post-card:hover .read-more {
  opacity: 1;
  transform: translateX(0);
}

.section-footer {
  text-align: center;
  margin-top: 3rem;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s;
}

.view-all-link:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-2px);
}

/* ========== 技术栈 ========== */
.tech-stack {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem 6rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  transition: all 0.3s;
  cursor: default;
}

.tech-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.dark .tech-item {
  background: rgba(16, 24, 48, 0.5);
}

.tech-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--vp-c-brand-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  transition: all 0.3s;
}

.tech-item:hover .tech-icon {
  transform: scale(1.1) rotate(3deg);
}

.tech-name {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* ========== 响应式 ========== */
@media (max-width: 900px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .tech-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-name { font-size: 3.5rem; }
  .hero-tagline { font-size: 1.15rem; }
  .hero-section { min-height: 85vh; padding-top: 5rem; }
  .stat-number { font-size: 1.5rem; }
  .scroll-indicator { display: none; }
}

@media (max-width: 640px) {
  .hero-name { font-size: 2.8rem; }
  .posts-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
  .hero-stats { gap: 1.5rem; }
}

@media (max-width: 480px) {
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
