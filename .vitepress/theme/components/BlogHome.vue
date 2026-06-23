<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useData } from 'vitepress'
import { data as posts } from '../../posts.data.js'

const router = useRouter()
const { isDark } = useData()
const latestPosts = posts.slice(0, 6)

// 终端打字效果
const terminalLines = ref([
  { type: 'comment', text: '// 关于我' },
  { type: 'code', text: 'const xiaozhou = {' },
  { type: 'code', text: '  role: "前端工程师",' },
  { type: 'code', text: '  focus: "工单流程系统",' },
  { type: 'code', text: '  commits: 4700,' },
  { type: 'code', text: '  passion: "用代码解决实际问题"' },
  { type: 'code', text: '}' },
])
const currentLine = ref(0)
const currentChar = ref(0)
const showCursor = ref(true)

// 粒子
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReduced) {
    typeTerminal()
    initParticles()
    initScrollReveal()
  }
  setInterval(() => { showCursor.value = !showCursor.value }, 500)
})

watch(isDark, (dark) => {
  if (dark) initParticles()
  else destroyParticles()
})

function typeTerminal() {
  if (currentLine.value >= terminalLines.value.length) {
    setTimeout(() => { currentLine.value = 0; currentChar.value = 0; typeTerminal() }, 3000)
    return
  }
  
  const line = terminalLines.value[currentLine.value]
  if (currentChar.value < line.text.length) {
    currentChar.value++
    setTimeout(typeTerminal, 30 + Math.random() * 50)
  } else {
    setTimeout(() => {
      currentLine.value++
      currentChar.value = 0
      typeTerminal()
    }, 150)
  }
}

function destroyParticles() {
  if (animationId) { cancelAnimationFrame(animationId); animationId = null }
  const canvas = canvasRef.value
  if (canvas) { const ctx = canvas.getContext('2d'); if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height) }
}

function initParticles() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  interface Particle {
    x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number
  }

  const particles: Particle[] = []
  const count = Math.min(100, Math.floor(window.innerWidth / 12))

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 60 + 170,
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
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.opacity})`)
      gradient.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`)
      
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // 连线
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x
        const dy = p.y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `hsla(${(p.hue + particles[j].hue) / 2}, 80%, 60%, ${0.2 * (1 - dist / 100)})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }
    })

    animationId = requestAnimationFrame(draw)
  }
  draw()
}

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
const accents = [
  'linear-gradient(135deg, #00e5ff, #0ea5e9)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #22c55e, #3b82f6)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #a855f7)',
]

function getAccent(index: number) {
  return accents[index % accents.length]
}
</script>

<template>
  <canvas ref="canvasRef" id="particles-canvas" />

  <!-- ====== Hero ====== -->
  <section class="hero">
    <div class="hero-orb hero-orb-1" />
    <div class="hero-orb hero-orb-2" />
    <div class="hero-grid" />

    <div class="hero-content">
      <div class="hero-badge neon-pulse">Frontend Engineer</div>
      
      <h1 class="hero-title">
        <span class="hero-name glitch-text" data-text="Xiaozhou">Xiaozhou</span>
      </h1>
      
      <p class="hero-subtitle">
        专注于
        <span class="typed-text">工单流程系统</span>
      </p>

      <!-- 终端卡片 -->
      <div class="terminal-card scanline">
        <div class="terminal-header">
          <span class="terminal-dot terminal-dot-red" />
          <span class="terminal-dot terminal-dot-yellow" />
          <span class="terminal-dot terminal-dot-green" />
          <span class="terminal-title">xiaozhou.ts</span>
        </div>
        <div class="terminal-body">
          <div v-for="(line, i) in terminalLines" :key="i" class="terminal-line">
            <span class="line-number">{{ i + 1 }}</span>
            <span :class="['line-content', `line-${line.type}`]">
              {{ i < currentLine ? line.text : (i === currentLine ? line.text.substring(0, currentChar) : '') }}
            </span>
            <span v-if="i === currentLine" class="terminal-cursor" :class="{ 'cursor-hidden': !showCursor }">|</span>
          </div>
        </div>
      </div>

      <div class="hero-actions">
        <a href="/blog" class="btn btn-primary ripple-effect">
          <span>浏览文章</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="/about" class="btn btn-ghost">关于我</a>
      </div>
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
        <div class="card-accent" :style="{ background: getAccent(index) }" />
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
      <div v-for="(tech, i) in ['Vue 3', 'TypeScript', 'Vite', 'Node.js', 'Git', 'CSS']" :key="tech" class="tech-card" :style="{ transitionDelay: (i * 0.06) + 's' }">
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
        <div class="cta-code">
          <div class="code-line"><span class="code-kw">const</span> <span class="code-var">blog</span> = <span class="code-str">"Xiaozhou's Blog"</span></div>
          <div class="code-line"><span class="code-kw">const</span> <span class="code-var">posts</span> = <span class="code-num">{{ posts.length }}</span></div>
          <div class="code-line"><span class="code-kw">export</span> <span class="code-kw">default</span> {{ '{' }} blog, posts {{ '}' }}</div>
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
  filter: blur(100px);
  opacity: 0.5;
  pointer-events: none;
}

.hero-orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #00e5ff 0%, transparent 70%);
  top: -200px; right: -100px;
  animation: orbFloat 12s ease-in-out infinite alternate;
}

.hero-orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #a855f7 0%, transparent 70%);
  bottom: -150px; left: -100px;
  animation: orbFloat 15s ease-in-out infinite alternate-reverse;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, -40px) scale(1.15); }
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
  max-width: 700px;
}

.hero-badge {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.2);
  color: #00e5ff;
  margin-bottom: 2rem;
  animation: fadeInDown 0.8s ease forwards;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-title {
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease 0.1s both;
}

.hero-name {
  font-size: 5.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  display: inline-block;
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
  display: inline-block;
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
  font-size: 1.3rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.typed-text {
  color: #00e5ff;
  font-weight: 600;
}

/* ==================== Terminal ==================== */
.terminal-card {
  max-width: 500px;
  margin: 0 auto 2.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 229, 255, 0.15);
  background: rgba(8, 12, 24, 0.9);
  backdrop-filter: blur(20px);
  text-align: left;
  animation: fadeInUp 0.8s ease 0.3s both;
}

.dark .terminal-card {
  border-color: rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 40px rgba(0, 229, 255, 0.08);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal-dot-red { background: #ff5f57; }
.terminal-dot-yellow { background: #febc2e; }
.terminal-dot-green { background: #28c840; }

.terminal-title {
  margin-left: auto;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--vp-font-family-mono);
}

.terminal-body {
  padding: 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.8;
}

.terminal-line {
  display: flex;
  gap: 12px;
}

.line-number {
  color: rgba(255, 255, 255, 0.2);
  min-width: 20px;
  user-select: none;
}

.line-content {
  color: #e2e8f0;
}

.line-comment { color: #64748b; }
.line-kw { color: #c084fc; }
.line-str { color: #34d399; }
.line-num { color: #f59e0b; }

.terminal-cursor {
  color: #00e5ff;
  animation: blink 0.8s step-end infinite;
}

.cursor-hidden { opacity: 0; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ==================== Actions ==================== */
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  animation: fadeInUp 0.8s ease 0.4s both;
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
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 229, 255, 0.4);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.btn-ghost:hover {
  border-color: #00e5ff;
  color: #00e5ff;
}

/* ==================== Section ==================== */
.section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.section-tag {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(0, 229, 255, 0.1);
  color: #00e5ff;
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
  border-color: rgba(0, 229, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 229, 255, 0.08);
  transform: translateY(-6px);
}

.card-shine {
  position: absolute;
  inset: 0;
  background: radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 229, 255, 0.12), transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.post-card:hover .card-shine { opacity: 1; }

.card-accent {
  height: 4px;
  opacity: 0.8;
}

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
  background: rgba(0, 229, 255, 0.1);
  color: #00e5ff;
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

.post-card:hover .card-title { color: #00e5ff; }

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

.card-footer { display: flex; }

.card-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: #00e5ff;
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
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.2);
  text-decoration: none;
  transition: all 0.3s;
}

.more-link:hover {
  background: rgba(0, 229, 255, 0.08);
  border-color: rgba(0, 229, 255, 0.4);
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
  border-color: rgba(0, 229, 255, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 229, 255, 0.06);
}

.tech-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(0, 229, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #00e5ff;
  transition: all 0.3s;
}

.tech-card:hover .tech-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.25);
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
  border-radius: 20px;
  border: 1px solid var(--vp-c-border);
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%);
}

.dark .cta-card {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.06) 0%, rgba(168, 85, 247, 0.06) 100%);
}

.cta-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.cta-title {
  font-size: 2rem;
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

.cta-code {
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(8, 12, 24, 0.9);
  border: 1px solid rgba(0, 229, 255, 0.15);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 2;
}

.code-line {
  display: flex;
  gap: 8px;
}

.code-kw { color: #c084fc; }
.code-var { color: #e2e8f0; }
.code-str { color: #34d399; }
.code-num { color: #f59e0b; }

/* ==================== Responsive ==================== */
@media (max-width: 900px) {
  .posts-grid { grid-template-columns: repeat(2, 1fr); }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
  .cta-card { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .hero-name { font-size: 3.5rem; }
  .hero-subtitle { font-size: 1.1rem; }
  .terminal-card { margin-left: 0; margin-right: 0; }
}

@media (max-width: 640px) {
  .hero-name { font-size: 2.8rem; }
  .posts-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 480px) {
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
