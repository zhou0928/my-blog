<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
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

// 鼠标追踪
const cursorGlow = ref({ x: 0, y: 0, visible: false })

// 页面加载进度
const loadProgress = ref(0)

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    typedText.value = phrases[0]
    commitCount.value = targetCommits
    repoCount.value = targetRepos
  } else {
    // 加载进度条
    simulateLoadProgress()
    typeEffect()
    if (isDark.value) initParticles()
    initScrollReveal()
    initCursorGlow()
    initCardTilt()
    // 数字滚动
    setTimeout(() => {
      animateCounter(commitCount, targetCommits, 2000)
      animateCounter(repoCount, targetRepos, 1500)
    }, 800)
  }
})

// 监听暗色模式变化
watch(isDark, (dark) => {
  if (dark) {
    initParticles()
  } else {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    const canvas = canvasRef.value
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})

// 模拟加载进度
function simulateLoadProgress() {
  loadProgress.value = 0
  const interval = setInterval(() => {
    if (loadProgress.value < 100) {
      loadProgress.value += Math.random() * 15
      if (loadProgress.value > 100) loadProgress.value = 100
    } else {
      clearInterval(interval)
    }
  }, 100)
}

// 数字滚动动画
function animateCounter(target: any, end: number, duration: number) {
  const start = 0
  const startTime = Date.now()
  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    target.value = Math.floor(start + (end - start) * eased)
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
  window.addEventListener('resize', resize)

  interface Particle {
    x: number; y: number; vx: number; vy: number; size: number; opacity: number
  }

  const particles: Particle[] = []
  const count = Math.min(80, Math.floor(window.innerWidth / 15))

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
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
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 120)})`
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
  
  // 先检查已经在视口中的元素
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('revealed')
    }
  })
  
  // 创建 IntersectionObserver 监听后续滚动
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.05, rootMargin: '50px 0px' }
  )
  
  elements.forEach((el) => observer.observe(el))
  
  // 备用：滚动事件监听
  const checkReveal = () => {
    elements.forEach((el) => {
      if (!el.classList.contains('revealed')) {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('revealed')
        }
      }
    })
  }
  
  window.addEventListener('scroll', checkReveal, { passive: true })
  // 延迟再检查一次
  setTimeout(checkReveal, 500)
  setTimeout(checkReveal, 1000)
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
      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`
      el.style.setProperty('--mouse-x', `${x}px`)
      el.style.setProperty('--mouse-y', `${y}px`)
    })
    card.addEventListener('mouseleave', (e) => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
    })
  })
}

// 涟漪点击效果
function createRipple(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const ripple = document.createElement('span')
  ripple.classList.add('ripple')
  const rect = el.getBoundingClientRect()
  ripple.style.left = `${e.clientX - rect.left}px`
  ripple.style.top = `${e.clientY - rect.top}px`
  el.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
}

function goToPost(url: string) {
  router.go(url)
}
</script>

<template>
  <!-- 加载进度条 -->
  <div class="loading-bar" :style="{ width: loadProgress + '%' }" v-if="loadProgress < 100" />

  <!-- 粒子背景 -->
  <canvas ref="canvasRef" id="particles-canvas" />

  <!-- 鼠标追踪光效 -->
  <div v-if="isDark" class="cursor-glow" :style="{ left: cursorGlow.x + 'px', top: cursorGlow.y + 'px', opacity: cursorGlow.visible ? 1 : 0 }" />

  <!-- ====== 英雄区 ====== -->
  <section class="hero-section">
    <div class="hero-glow hero-glow-1" />
    <div class="hero-glow hero-glow-2" />
    <div class="hero-glow hero-glow-3" />

    <div class="hero-content">
      <p class="hero-greeting fade-in-up">你好，我是</p>
      <h1 class="hero-name neon-text">
        <span class="name-gradient">Xiaozhou</span>
      </h1>
      <p class="hero-tagline fade-in-up" style="animation-delay: 0.2s">
        专注于
        <span class="typed-wrapper">
          <span class="typed-text neon-flicker">{{ typedText }}</span>
          <span class="cursor" :class="{ 'cursor-hidden': !typedText }">|</span>
        </span>
      </p>
      <p class="hero-desc fade-in-up" style="animation-delay: 0.4s">
        工单流程系统前端开发者 · 热爱技术与分享
      </p>

      <!-- 数字统计 -->
      <div class="hero-stats fade-in-up" style="animation-delay: 0.5s">
        <div class="stat-item">
          <span class="stat-number">{{ commitCount.toLocaleString() }}+</span>
          <span class="stat-label">Git Commits</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-number">{{ repoCount }}+</span>
          <span class="stat-label">项目仓库</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-number">3</span>
          <span class="stat-label">Git 身份</span>
        </div>
      </div>

      <div class="hero-actions fade-in-up" style="animation-delay: 0.6s">
        <a href="/blog" class="hero-btn hero-btn-primary magnetic-btn ripple-effect" @click="createRipple">
          浏览文章
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="/about" class="hero-btn hero-btn-secondary magnetic-btn">
          关于我
        </a>
      </div>

      <!-- 社交图标 -->
      <div class="hero-social fade-in-up" style="animation-delay: 0.8s">
        <a href="https://github.com/zhou0928" target="_blank" class="social-icon social-bounce">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
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
        class="post-card scroll-reveal-scale"
        :class="'delay-' + (index + 1)"
        @click="goToPost(post.url)"
      >
        <div class="post-card-glow" />
        <div class="post-card-border" />
        <div class="post-card-body">
          <div class="post-meta">
            <time class="post-date">{{ post.date }}</time>
            <span v-if="post.tags?.length" class="post-tags">
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="post-tag">{{ tag }}</span>
            </span>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-read-more">
            <span>阅读全文</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </article>
    </div>

    <div class="section-footer scroll-reveal">
      <a href="/blog" class="view-all-link magnetic-btn ripple-effect" @click="createRipple">
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
      <div class="tech-item" v-for="(tech, i) in ['Vue 3', 'TypeScript', 'Vite', 'Node.js', 'Git', 'CSS']" :key="tech" :class="'delay-' + (i + 1)">
        <div class="tech-icon tech-icon-spin">{{ tech.charAt(0) }}</div>
        <span>{{ tech }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ========== 加载进度条 ========== */
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #00e5ff, #a855f7, #00e5ff);
  background-size: 200% 100%;
  animation: loadingGradient 1s linear infinite;
  z-index: 9999;
  transition: width 0.3s ease;
}

@keyframes loadingGradient {
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

/* ========== Hero Section ========== */
.hero-section {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 6rem 1.5rem 4rem;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
}

.hero-glow-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #00e5ff 0%, transparent 70%);
  top: -200px; right: -100px;
  animation: glowFloat 8s ease-in-out infinite alternate;
}

.hero-glow-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #a855f7 0%, transparent 70%);
  bottom: -150px; left: -100px;
  animation: glowFloat 10s ease-in-out infinite alternate-reverse;
}

.hero-glow-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #00e5ff 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes glowFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -30px) scale(1.1); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.08; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.2); }
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
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.2rem;
}

.name-gradient {
  background: linear-gradient(135deg, #e2e8f0 0%, #00e5ff 40%, #a855f7 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
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
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
}

.cursor-hidden { opacity: 0; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-desc {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1.5rem;
}

/* ========== 数字统计 ========== */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.25rem 2rem;
  border-radius: 16px;
  background: rgba(16, 24, 48, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 189, 248, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  font-family: var(--vp-font-family-mono);
  background: linear-gradient(135deg, #00e5ff, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, rgba(0, 229, 255, 0.3), transparent);
}

/* ========== 社交图标 ========== */
.hero-social {
  margin-top: 1.5rem;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(56, 189, 248, 0.2);
  background: rgba(56, 189, 248, 0.05);
  color: var(--vp-c-text-2);
  transition: all 0.3s;
  text-decoration: none;
}

.social-icon:hover {
  border-color: rgba(0, 229, 255, 0.5);
  color: #00e5ff;
  background: rgba(0, 229, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.15);
}

.social-bounce:hover {
  animation: socialBounce 0.5s ease;
}

@keyframes socialBounce {
  0%, 100% { transform: translateY(-3px); }
  50% { transform: translateY(-8px) scale(1.1); }
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
  box-shadow: 0 0 40px rgba(0, 229, 255, 0.2), 0 0 80px rgba(0, 229, 255, 0.1);
  transform: translateY(-3px) scale(1.02);
}

.hero-btn-secondary {
  background: rgba(56, 189, 248, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: var(--vp-c-text-1);
}

.hero-btn-secondary:hover {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(56, 189, 248, 0.1);
  transform: translateY(-3px);
}

/* ========== 滚动提示 ========== */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: float 2s ease-in-out infinite;
}

.scroll-mouse {
  width: 24px; height: 38px;
  border: 2px solid rgba(0, 229, 255, 0.3);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.scroll-wheel {
  width: 4px; height: 8px;
  background: #00e5ff;
  border-radius: 2px;
  animation: scrollDown 1.5s ease-in-out infinite;
}

@keyframes scrollDown {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(12px); }
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}

/* ========== 文章卡片 ========== */
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
  height: 2.2rem;
  line-height: 2.2rem;
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
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-style: preserve-3d;
}

.post-card:hover {
  border-color: rgba(0, 229, 255, 0.25);
  box-shadow: 0 0 40px rgba(0, 229, 255, 0.08), 0 20px 60px rgba(0, 0, 0, 0.3);
}

.post-card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 229, 255, 0.08), transparent);
  transition: opacity 0.3s;
}

.post-card:hover .post-card-glow { opacity: 1; }

.post-card-border {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(168, 85, 247, 0.2));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1px;
}

.post-card:hover .post-card-border { opacity: 1; }

.post-card-body {
  padding: 1.5rem;
  position: relative;
  z-index: 1;
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
  font-family: var(--vp-font-family-mono);
}

.post-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }

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
  transition: color 0.3s;
}

.post-card:hover .post-title { color: #00e5ff; }

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

.post-read-more {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #00e5ff;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s;
}

.post-card:hover .post-read-more { opacity: 1; transform: translateY(0); }

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
  position: relative;
  overflow: hidden;
}

.view-all-link:hover {
  background: rgba(0, 229, 255, 0.06);
  border-color: rgba(0, 229, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
}

/* ========== 技术栈 ========== */
.tech-stack {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(56, 189, 248, 0.08);
  background: rgba(16, 24, 48, 0.4);
  transition: all 0.3s;
  cursor: default;
}

.tech-item:hover {
  border-color: rgba(0, 229, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.06);
}

.tech-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(168, 85, 247, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #00e5ff;
  transition: all 0.3s;
}

.tech-item:hover .tech-icon {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
}

.tech-item span {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .hero-name { font-size: 3rem; }
  .hero-tagline { font-size: 1.2rem; }
  .hero-section { min-height: 80vh; padding-top: 5rem; }
  .posts-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
  .scroll-indicator { display: none; }
  .hero-stats { gap: 1rem; padding: 1rem 1.5rem; }
  .stat-number { font-size: 1.25rem; }
}

@media (max-width: 480px) {
  .hero-name { font-size: 2.4rem; }
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-stats { flex-direction: column; gap: 0.75rem; }
  .stat-divider { width: 40px; height: 1px; }
}
</style>
