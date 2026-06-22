<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { inBrowser } from 'vitepress'

const showHelp = ref(false)

function handleKeydown(e: KeyboardEvent) {
  if (!inBrowser) return
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  if (e.key === '/') {
    e.preventDefault()
    const searchBtn = document.querySelector('.VPNavBarSearch .VPSearch .VPSearchButton') as HTMLElement
    searchBtn?.click()
  }

  if (e.key === 'j') {
    e.preventDefault()
    scrollArticle(1)
  }

  if (e.key === 'k') {
    e.preventDefault()
    scrollArticle(-1)
  }

  if (e.key === '?') {
    e.preventDefault()
    showHelp.value = !showHelp.value
  }

  if (e.key === 'Escape') {
    showHelp.value = false
  }
}

function scrollArticle(direction: number) {
  const articles = document.querySelectorAll('.vp-doc h2, .vp-doc h3')
  const scrollTop = window.scrollY + 100

  for (let i = 0; i < articles.length; i++) {
    const el = articles[i]
    if (el instanceof HTMLElement) {
      const top = el.offsetTop
      if (direction > 0 && top > scrollTop) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (direction < 0 && top < scrollTop && i > 0) {
        (articles[i - 1] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showHelp" class="shortcut-overlay" @click="showHelp = false">
        <div class="shortcut-modal" @click.stop>
          <h3>键盘快捷键</h3>
          <div class="shortcut-list">
            <div class="shortcut-item">
              <kbd>/</kbd>
              <span>搜索</span>
            </div>
            <div class="shortcut-item">
              <kbd>j</kbd>
              <span>下一个标题</span>
            </div>
            <div class="shortcut-item">
              <kbd>k</kbd>
              <span>上一个标题</span>
            </div>
            <div class="shortcut-item">
              <kbd>?</kbd>
              <span>显示/隐藏快捷键</span>
            </div>
          </div>
          <button class="shortcut-close" @click="showHelp = false">关闭</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.shortcut-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shortcut-modal {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 2rem;
  min-width: 300px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.shortcut-modal h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 1.25rem;
  text-align: center;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-border);
}

.shortcut-item:last-child {
  border-bottom: none;
}

.shortcut-item kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 0 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.shortcut-item span {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.shortcut-close {
  display: block;
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.shortcut-close:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
