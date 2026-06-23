/**
 * 精简鼠标效果模块
 * 仅保留平滑跟随光点和链接悬停放大的效果
 */

type CleanupFn = () => void
const cleanups: CleanupFn[] = []

export function initCursorEffects(): void {
  destroyCursorEffects()

  if (!window.matchMedia('(pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // ========== 平滑跟随光点 ==========
  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  Object.assign(dot.style, {
    position: 'fixed',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--vp-c-brand-1)',
    pointerEvents: 'none',
    zIndex: '99999',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s',
    opacity: '0.8',
  })
  document.body.appendChild(dot)

  let mouseX = 0, mouseY = 0
  let dotX = 0, dotY = 0

  const onMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  document.addEventListener('mousemove', onMove)
  cleanups.push(() => document.removeEventListener('mousemove', onMove))

  function animate() {
    dotX += (mouseX - dotX) * 0.2
    dotY += (mouseY - dotY) * 0.2
    dot.style.left = `${dotX}px`
    dot.style.top = `${dotY}px`
    raf = requestAnimationFrame(animate)
  }
  let raf = requestAnimationFrame(animate)
  cleanups.push(() => cancelAnimationFrame(raf))
  cleanups.push(() => dot.remove())

  // ========== 悬停链接/按钮放大 ==========
  dot.style.transition = 'width 0.2s, height 0.2s, opacity 0.2s'

  const onHover = (e: MouseEvent) => {
    if ((e.target as HTMLElement)?.closest('a, button, .post-card, .tech-card')) {
      dot.style.width = '16px'
      dot.style.height = '16px'
      dot.style.opacity = '1'
    }
  }
  const onUnhover = (e: MouseEvent) => {
    if ((e.target as HTMLElement)?.closest('a, button, .post-card, .tech-card')) {
      dot.style.width = '8px'
      dot.style.height = '8px'
      dot.style.opacity = '0.8'
    }
  }
  document.addEventListener('mouseover', onHover)
  document.addEventListener('mouseout', onUnhover)
  cleanups.push(() => {
    document.removeEventListener('mouseover', onHover)
    document.removeEventListener('mouseout', onUnhover)
  })
}

export function destroyCursorEffects(): void {
  while (cleanups.length > 0) cleanups.pop()!()
}
