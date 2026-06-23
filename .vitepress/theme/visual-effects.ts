/**
 * 炫酷视觉特效模块
 * - 3D 倾斜卡片（事件委托）
 * - 磁性按钮（事件委托）
 * - 噪点纹理覆盖
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

  // ========== 3D 倾斜卡片（事件委托，不逐个绑定） ==========
  let activeCard: HTMLElement | null = null

  const onCardMove = (e: MouseEvent) => {
    if (!activeCard) return
    const rect = activeCard.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (y - 0.5) * 6
    const tiltY = (x - 0.5) * -6
    activeCard.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-3px)`
    activeCard.style.transition = 'transform 0.1s ease'

    const shine = activeCard.querySelector('.card-shine') as HTMLElement
    if (shine) {
      shine.style.setProperty('--mouse-x', `${x * 100}%`)
      shine.style.setProperty('--mouse-y', `${y * 100}%`)
      shine.style.opacity = '1'
    }
  }

  const onCardEnter = (e: MouseEvent) => {
    const card = (e.target as HTMLElement)?.closest('.post-card, .project-card, .tech-card, .stat-card') as HTMLElement
    if (!card) return
    activeCard = card
    document.addEventListener('mousemove', onCardMove, { passive: true })
  }

  const onCardLeave = (e: MouseEvent) => {
    const card = (e.target as HTMLElement)?.closest('.post-card, .project-card, .tech-card, .stat-card') as HTMLElement
    if (!card || card !== activeCard) return
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    const shine = card.querySelector('.card-shine') as HTMLElement
    if (shine) shine.style.opacity = '0'
    activeCard = null
    document.removeEventListener('mousemove', onCardMove)
  }

  document.addEventListener('mouseover', onCardEnter)
  document.addEventListener('mouseout', onCardLeave)
  cleanups.push(() => {
    document.removeEventListener('mouseover', onCardEnter)
    document.removeEventListener('mouseout', onCardLeave)
    document.removeEventListener('mousemove', onCardMove)
  })

  // ========== 磁性按钮（事件委托） ==========
  let activeBtn: HTMLElement | null = null

  const onBtnMove = (e: MouseEvent) => {
    if (!activeBtn) return
    const rect = activeBtn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    activeBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    activeBtn.style.transition = 'transform 0.2s ease'
  }

  const onBtnEnter = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement)?.closest('.btn, .error-btn, .subscribe-btn') as HTMLElement
    if (!btn) return
    activeBtn = btn
    document.addEventListener('mousemove', onBtnMove, { passive: true })
  }

  const onBtnLeave = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement)?.closest('.btn, .error-btn, .subscribe-btn') as HTMLElement
    if (!btn || btn !== activeBtn) return
    btn.style.transform = 'translate(0, 0)'
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    activeBtn = null
    document.removeEventListener('mousemove', onBtnMove)
  }

  document.addEventListener('mouseover', onBtnEnter)
  document.addEventListener('mouseout', onBtnLeave)
  cleanups.push(() => {
    document.removeEventListener('mouseover', onBtnEnter)
    document.removeEventListener('mouseout', onBtnLeave)
    document.removeEventListener('mousemove', onBtnMove)
  })
}

export function destroyVisualEffects(): void {
  while (cleanups.length > 0) {
    cleanups.pop()!()
  }
}
