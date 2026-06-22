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
let particleResizeHandler: (() => void) | null = null

// 鼠标位置
const mouseX = ref(0)
const mouseY = ref(0)

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
    initCardTilt()
    setTimeout(() => {
      animateCounter(commitCount, targetCommits, 2000)
      animateCounter(repoCount, targetRepos, 1500)
    }, 800)
    
    // 鼠标追踪
    document.addEventListener('mousemove', handleMouseMove)
  }
})

watch(isDark, (dark) => {
  if (dark) initParticles()
  else destroyParticles()
})

onUnmounted(() => {
  destroyParticles()
  document.removeEventListener('mousemove', handleMouseMove)
})

function handleMouseMove(e: MouseEvent) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

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
    x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number
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
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * 60 + 170, // 170-230 = cyan to blue
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

      // 发光粒子
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.opacity})`)
      gradient.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`)
      
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // 连线
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x
        const dy = p.y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `hsla(${(p.hue + particles[j].hue) / 2}, 80%, 60%, ${0.15 * (1 - dist / 120)})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }
    })

    // 鼠标光晕
    if (isDark.value) {
      const mouseGradient = ctx.createRadialGradient(mouseX.value, mouseY.value, 0, mouseX.value, mouseY.value, 150)
      mouseGradient.addColorStop(0, 'rgba(0, 229, 255, 0.08)')
      mouseGradient.addColorStop(1, 'rgba(0, 229, 255, 0)')
      ctx.beginPath()
      ctx.arc(mouseX.value, mouseY.value, 150, 0, Math.PI * 2)
      ctx.fillStyle = mouseGradient
      ctx.fill()
    }

    animationId = requestAnimationFrame(draw)
  }
  draw()
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal')
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('revealed')
    }
  })
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed')
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  elements.forEach((el) => observer.observe(el))
}

function initCardTilt() {
  document.querySelectorAll('.post-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 30
      const rotateY = (centerX - x) / 30
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
      el.style.setProperty('--mouse-x', `${x}px`)
      el.style.setProperty('--mouse-y', `${y}px`)
    })
    card.addEventListener('mouseleave', (e) => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = ''
    })
  })
}

function goToPost(url: string) {
  router.go(url)
}
</script>

<template>
  <canvas ref="canvasRef" id="particles-canvas" />

  <!-- ====== Hero ====== -->
  <section class="hero">
    <!-- 动态光晕 -->
    <div class="hero-orb hero-orb-1" />
    <div class="hero-orb hero-orb-2" />
    <div class="hero-orb hero-orb-3" />
    
    <!-- 网格背景 -->
    <div class="hero-grid" />

    <div class="hero-content">
      <div class="hero-badge">前端工程师</div>
      
      <h1 class="hero-title">
        <span class="hero-name">Xiaozhou</span>
      </h1>
      
      <p class="hero-subtitle">
        专注于
        <span class="typed-text">{{ typedText }}</span>
        <span class="cursor">|</span>
      </p>
      
      <p class="hero-desc">
        工单流程系统 · 4,700+ Git 提交 · 热爱技术与分享
      </p>

      <div class="hero-stats">
        <div class="stat">
          <span class="stat-num">{{ commitCount.toLocaleString() }}+</span>
          <span class="stat-label">Commits</span>
        </div>
        <div class="stat-dot" />
        <div class="stat">
          <span class="stat-num">{{ repoCount }}+</span>
          <span class="stat-label">Projects</span>
        </div>
        <div class="stat-dot" />
        <div class="stat">
          <span class="stat-num">3</span>
          <span class="stat-label">Years</span>
        </div>
      </div>

      <div class="hero-actions">
        <a href="/blog" class="btn btn-primary">
          <span>浏览文章</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="/about" class="btn btn-ghost">关于我</a>
      </div>

      <div class="hero-social">
        <a href="https://github.com/zhou0928" target="_blank" class="social-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </div>
    </div>

    <div class="scroll-hint">
      <div class="scroll-line" />
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
            <span v-if="post.tags?.length" class="card-tag">{{ post.tags[0] }}</span>
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
        <span>查看全部</span>
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
      <div v-for="(tech, i) in ['Vue 3', 'TypeScript', 'Vite', 'Node.js', 'Git', 'CSS']" :key="tech" class="tech-card" :style="{ transitionDelay: (i * 0.06) + 's' }">
        <div class="tech-icon">{{ tech.charAt(0) }}</div>
        <span>{{ tech }}</span>
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
  padding: 6rem 1.5rem 4rem;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  pointer-events: none;
}

.hero-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #00e5ff 0%, transparent 70%);
  top: -150px; right: -50px;
  animation: orbFloat 10s ease-in-out infinite alternate;
}

.hero-orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #a855f7 0%, transparent 70%);
  bottom: -100px; left: -50px;
  animation: orbFloat 12s ease-in-out infinite alternate-reverse;
}

.hero-orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation: orbPulse 6s ease-in-out infinite;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -30px) scale(1.1); }
}

@keyframes orbPulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.2); }
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(168, 85, 247, 0.15));
  border: 1px solid rgba(0, 229, 255, 0.2);
  color: var(--vp-c-brand-1);
  margin-bottom: 2rem;
  animation: fadeInDown 0.8s ease forwards;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-title {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.8s ease 0.1s both;
}

.hero-name {
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  background: linear-gradient(135deg, #ffffff 0%, #00e5ff 50%, #a855f7 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

.dark .hero-name {
  background: linear-gradient(135deg, #e2e8f0 0%, #00e5ff 50%, #a855f7 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.typed-text {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.cursor {
  color: var(--vp-c-brand-1);
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-desc {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.8s ease 0.3s both;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.8s ease 0.4s both;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-num {
  font-size: 2.25rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--vp-c-border);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.8s ease 0.5s both;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary {
  background: linear-gradient(135deg, #00e5ff, #0ea5e9);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 229, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 229, 255, 0.4);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.btn-ghost:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.hero-social {
  animation: fadeInUp 0.8s ease 0.6s both;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  transition: all 0.3s;
}

.social-link:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-3px);
}

.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, var(--vp-c-brand-1), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.2); }
}

/* ==================== Section ==================== */
.section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.section-tag {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  white-space: nowrap;
  color: var(--vp-c-text-1);
}

.section-line {
  flex: 1;
  height: 1px;
  background: var(--vp-c-border);
}

/* ==================== Cards ==================== */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
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
  box-shadow: 0 20px 40px rgba(0, 229, 255, 0.1);
}

.card-shine {
  position: absolute;
  inset: 0;
  background: radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 229, 255, 0.1), transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.post-card:hover .card-shine {
  opacity: 1;
}

.card-content {
  padding: 1.5rem;
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

.card-tag {
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.card-title {
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

.post-card:hover .card-title {
  color: var(--vp-c-brand-1);
}

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

.post-card:hover .card-link {
  opacity: 1;
  transform: translateX(0);
}

.section-more {
  text-align: center;
  margin-top: 3rem;
}

.more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  transition: all 0.3s;
}

.more-link:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-2px);
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
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
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

.tech-card:hover .tech-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
}

.tech-card span {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* ==================== Responsive ==================== */
@media (max-width: 900px) {
  .posts-grid { grid-template-columns: repeat(2, 1fr); }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .hero-name { font-size: 4rem; }
  .hero-subtitle { font-size: 1.2rem; }
  .stat-num { font-size: 1.75rem; }
  .scroll-hint { display: none; }
}

@media (max-width: 640px) {
  .hero-name { font-size: 3rem; }
  .posts-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 480px) {
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
