<script setup lang="ts">
import { onMounted } from 'vue'
import { inBrowser } from 'vitepress'

onMounted(() => {
  if (!inBrowser) return

  // Sentry 配置 — 替换 DSN 为你的项目 DSN
  // 去 https://sentry.io 注册免费项目获取 DSN
  const SENTRY_DSN = '' // 'https://xxx@sentry.io/xxx'

  if (!SENTRY_DSN) return

  // 动态加载 Sentry SDK
  const script = document.createElement('script')
  script.src = 'https://browser.sentry-cdn.com/7.120.0/bundle.min.js'
  script.crossOrigin = 'anonymous'
  script.onload = () => {
    (window as any).Sentry?.init({
      dsn: SENTRY_DSN,
      integrations: [
        new (window as any).Sentry.BrowserTracing(),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
    })
  }
  document.head.appendChild(script)
})
</script>

<template>
  <div />
</template>
