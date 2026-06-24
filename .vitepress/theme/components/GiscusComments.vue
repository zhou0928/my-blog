<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useData, inBrowser } from 'vitepress'

const { isDark, lang } = useData()

function loadGiscus() {
  if (!inBrowser) return
  const existing = document.getElementById('giscus-script')
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.id = 'giscus-script'
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'zhou0928/my-blog')
  script.setAttribute('data-repo-id', 'R_kgDOS-D9UQ')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOS-D9Uc4C_xBn')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', lang.value === 'en-US' ? 'en' : 'zh-CN')
  script.crossOrigin = 'anonymous'
  script.async = true
  document.getElementById('giscus-container')?.appendChild(script)
}

watch(isDark, () => {
  if (!inBrowser) return
  const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: isDark.value ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  }
})

onMounted(() => {
  loadGiscus()
})
</script>

<template>
  <div class="giscus-wrapper">
    <div class="giscus-divider">
      <span>💬 评论区</span>
    </div>
    <div id="giscus-container" class="giscus-container">
      <div class="giscus-placeholder">
        <p>评论系统加载中...</p>
        <p class="giscus-hint">需要在 Giscus 配置你的 GitHub 仓库信息</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 3rem;
  padding-top: 2rem;
}

.giscus-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.giscus-divider::before,
.giscus-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--vp-c-border);
}

.giscus-divider span {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.giscus-container {
  border-radius: 12px;
  overflow: hidden;
}

.giscus-placeholder {
  padding: 2rem;
  text-align: center;
  border: 1px dashed var(--vp-c-border);
  border-radius: 12px;
  color: var(--vp-c-text-3);
}

.giscus-hint {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  opacity: 0.6;
}
</style>
