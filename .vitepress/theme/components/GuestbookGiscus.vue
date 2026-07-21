<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useData, inBrowser } from 'vitepress'

const { isDark, lang } = useData()

function loadGiscus() {
  if (!inBrowser) return
  const existing = document.getElementById('giscus-guestbook-script')
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.id = 'giscus-guestbook-script'
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'zhou0928/my-blog')
  script.setAttribute('data-repo-id', 'R_kgDOS-D9UQ')
  // TODO: 在 GitHub 仓库创建 Guestbook Discussion 分类后，替换以下两个值
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOS-D9Uc4C_xBn')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', isDark.value ? 'transparent_dark' : 'noborder_light')
  script.setAttribute('data-lang', lang.value === 'en-US' ? 'en' : 'zh-CN')
  script.crossOrigin = 'anonymous'
  script.async = true
  document.getElementById('guestbook-giscus-container')?.appendChild(script)
}

watch(isDark, () => {
  if (!inBrowser) return
  const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: isDark.value ? 'transparent_dark' : 'noborder_light' } } },
      'https://giscus.app'
    )
  }
})

onMounted(() => {
  loadGiscus()
})
</script>

<template>
  <div class="guestbook-giscus-wrapper">
    <div id="guestbook-giscus-container" class="guestbook-giscus-container" />
  </div>
</template>

<style scoped>
.guestbook-giscus-wrapper {
  margin-top: 2rem;
}

.guestbook-giscus-container {
  border-radius: 12px;
  overflow: hidden;
}
</style>
