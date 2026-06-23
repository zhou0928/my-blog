<script setup lang="ts">
import { useData } from 'vitepress'

const { site, lang } = useData()

function goHome() {
  window.location.href = lang.value === 'en' ? '/en/' : '/'
}
</script>

<template>
  <div class="not-found">
    <div class="not-found-bg" />
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">{{ lang === 'zh-CN' ? '页面走丢了' : 'Page Not Found' }}</h1>
      <p class="error-desc">{{ lang === 'zh-CN' ? '你要找的页面似乎去了太空深处...' : 'The page you are looking for has drifted into deep space...' }}</p>
      <button class="error-btn" @click="goHome">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
        {{ lang === 'zh-CN' ? '回到首页' : 'Back to Home' }}
      </button>
    </div>
    <div class="not-found-stars">
      <span v-for="i in 20" :key="i" class="star" :style="{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', animationDelay: Math.random() * 3 + 's' }" />
    </div>
  </div>
</template>

<style scoped>
.not-found {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.not-found-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.04) 0%, rgba(212, 148, 58, 0.02) 100%);
}

.not-found-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.error-code {
  font-size: 10rem;
  font-weight: 900;
  font-family: var(--vp-font-family-mono);
  line-height: 1;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--vp-c-text-3) 0%, var(--vp-c-brand-1) 50%, var(--vp-c-text-3) 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
  opacity: 0.3;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}

.error-desc {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  background: var(--vp-c-brand-1);
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.error-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(184, 134, 11, 0.3);
}

.not-found-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  opacity: 0;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.6; }
}

@media (max-width: 640px) {
  .error-code { font-size: 6rem; }
  .error-title { font-size: 1.5rem; }
}
</style>
