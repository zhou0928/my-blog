/**
 * 炫酷视觉特效模块
 * - 3D 倾斜卡片
 * - 磁性按钮
 * - 噪点纹理覆盖
 * - 文字扰乱效果
 */

type CleanupFn = () => void
const cleanups: CleanupFn[] = []

export function initVisualEffects(): void {
  destroyVisualEffects()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // ========== 噪点纹理覆盖 ==========
  const noise = document.createElement('div')
  noise.className = 'noise-overlay'
  document.body.appendChild(noise)
  cleanups.push(() => noise.remove())

  // ========== 3D 倾斜卡片 ==========
  const cards = document.querySelectorAll('.post-card, .project-card, .tech-card, .stat-card')
  const tiltHandlers = new Map<Element, (e: MouseEvent) => void>()
  const leaveHandlers = new Map<Element, () => void>()

  cards.forEach((card) => {
    if (!(card instanceof HTMLElement)) return

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const tiltX = (y - 0.5) * 8
      const tiltY = (x - 0.5) * -8
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`
      card.style.transition = 'transform 0.1s ease'

      // 光泽跟随
      const shine = card.querySelector('.card-shine') as HTMLElement
      if (shine) {
        shine.style.setProperty('--mouse-x', `${x * 100}%`)
        shine.style.setProperty('--mouse-y', `${y * 100}%`)
        shine.style.opacity = '1'
      }
    }

    const onLeave = () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      const shine = card.querySelector('.card-shine') as HTMLElement
      if (shine) shine.style.opacity = '0'
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    tiltHandlers.set(card, onMove)
    leaveHandlers.set(card, onLeave)
  })

  cleanups.push(() => {
    cards.forEach((card) => {
      const onMove = tiltHandlers.get(card)
      const onLeave = leaveHandlers.get(card)
      if (onMove) card.removeEventListener('mousemove', onMove)
      if (onLeave) card.removeEventListener('mouseleave', onLeave)
    })
    tiltHandlers.clear()
    leaveHandlers.clear()
  })

  // ========== 磁性按钮 ==========
  const buttons = document.querySelectorAll('.btn, .error-btn, .subscribe-btn')
  const magneticCleanups: (() => void)[] = []

  buttons.forEach((btn) => {
    if (!(btn instanceof HTMLElement)) return

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
      btn.style.transition = 'transform 0.2s ease'
    }

    const onLeave = () => {
      btn.style.transform = 'translate(0, 0)'
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    }

    btn.addEventListener('mousemove', onMove)
    btn.addEventListener('mouseleave', onLeave)
    magneticCleanups.push(() => {
      btn.removeEventListener('mousemove', onMove)
      btn.removeEventListener('mouseleave', onLeave)
    })
  })

  cleanups.push(() => magneticCleanups.forEach((fn) => fn()))
}

export function destroyVisualEffects(): void {
  while (cleanups.length > 0) {
    cleanups.pop()!()
  }
}
