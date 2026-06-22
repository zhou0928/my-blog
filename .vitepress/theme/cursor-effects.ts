/**
 * 鼠标特效模块
 * 包含：纸飞机光标、拖尾粒子、点击爆炸
 * 支持 init / destroy 配对，避免内存泄漏
 */

type CleanupFn = () => void

const cleanups: CleanupFn[] = []

export function initCursorEffects(): void {
  destroyCursorEffects() // 幂等：先清理再初始化

  // 检查是否支持 pointer events（排除触摸设备）
  if (!window.matchMedia('(pointer: fine)').matches) return

  // 检查是否开启减少动画
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const isDark = document.documentElement.classList.contains('dark')

  // ========== 纸飞机光标 ==========
  const paperPlane = document.createElement('div')
  paperPlane.className = 'cursor-paper-plane'
  paperPlane.innerHTML = `
    <svg viewBox="0 0 24 24" fill="${isDark ? '#00e5ff' : '#0891b2'}">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  `
  document.body.appendChild(paperPlane)

  let mouseX = 0
  let mouseY = 0
  let planeX = 0
  let planeY = 0

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  document.addEventListener('mousemove', handleMouseMove)
  cleanups.push(() => document.removeEventListener('mousemove', handleMouseMove))

  // 纸飞机平滑跟随
  let planeRaf: number
  function animatePlane() {
    const dx = mouseX - planeX
    const dy = mouseY - planeY
    planeX += dx * 0.15
    planeY += dy * 0.15

    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45

    paperPlane.style.left = `${planeX}px`
    paperPlane.style.top = `${planeY}px`
    paperPlane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`

    planeRaf = requestAnimationFrame(animatePlane)
  }
  animatePlane()
  cleanups.push(() => cancelAnimationFrame(planeRaf))
  cleanups.push(() => paperPlane.remove())

  // ========== 拖尾粒子 ==========
  let lastTrailTime = 0
  const trailColors = isDark
    ? ['rgba(0, 229, 255, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(99, 102, 241, 0.6)']
    : ['rgba(8, 145, 178, 0.5)', 'rgba(124, 58, 237, 0.5)', 'rgba(59, 130, 246, 0.5)']

  const handleTrailMove = (e: MouseEvent) => {
    const now = Date.now()
    if (now - lastTrailTime < 50) return // 节流 50ms
    lastTrailTime = now

    const trail = document.createElement('div')
    trail.className = 'cursor-trail'
    trail.style.left = `${e.clientX}px`
    trail.style.top = `${e.clientY}px`
    trail.style.background = trailColors[Math.floor(Math.random() * trailColors.length)]
    document.body.appendChild(trail)

    setTimeout(() => trail.remove(), 600)
  }
  document.addEventListener('mousemove', handleTrailMove)
  cleanups.push(() => document.removeEventListener('mousemove', handleTrailMove))

  // ========== 点击爆炸效果 ==========
  const burstColors = isDark
    ? ['#00e5ff', '#a855f7', '#6366f1', '#22d3ee', '#c084fc']
    : ['#0891b2', '#7c3aed', '#4f46e5', '#06b6d4', '#a78bfa']

  const handleClick = (e: MouseEvent) => {
    const burst = document.createElement('div')
    burst.className = 'cursor-burst'
    burst.style.left = `${e.clientX}px`
    burst.style.top = `${e.clientY}px`

    // 生成 8 个粒子
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div')
      particle.className = 'cursor-burst-particle'
      const angle = (i / 8) * Math.PI * 2
      const distance = 30 + Math.random() * 30
      const tx = Math.cos(angle) * distance
      const ty = Math.sin(angle) * distance
      particle.style.setProperty('--tx', `${tx}px`)
      particle.style.setProperty('--ty', `${ty}px`)
      particle.style.background = burstColors[Math.floor(Math.random() * burstColors.length)]
      burst.appendChild(particle)
    }

    document.body.appendChild(burst)
    setTimeout(() => burst.remove(), 600)
  }
  document.addEventListener('click', handleClick)
  cleanups.push(() => document.removeEventListener('click', handleClick))

  // ========== 鼠标悬停链接/按钮效果 ==========
  const interactiveElements = document.querySelectorAll('a, button, .post-card, .tech-item')
  const enterHandlers = new Map<Element, () => void>()
  const leaveHandlers = new Map<Element, () => void>()

  interactiveElements.forEach((el) => {
    const onEnter = () => {
      paperPlane.style.transform = 'translate(-50%, -50%) scale(1.3)'
    }
    const onLeave = () => {
      paperPlane.style.transform = 'translate(-50%, -50%) scale(1)'
    }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    enterHandlers.set(el, onEnter)
    leaveHandlers.set(el, onLeave)
  })

  cleanups.push(() => {
    interactiveElements.forEach((el) => {
      const onEnter = enterHandlers.get(el)
      const onLeave = leaveHandlers.get(el)
      if (onEnter) el.removeEventListener('mouseenter', onEnter)
      if (onLeave) el.removeEventListener('mouseleave', onLeave)
    })
    enterHandlers.clear()
    leaveHandlers.clear()
  })
}

export function destroyCursorEffects(): void {
  while (cleanups.length > 0) {
    cleanups.pop()!()
  }
}
