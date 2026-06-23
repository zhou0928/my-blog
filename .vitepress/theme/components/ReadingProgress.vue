<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import { inBrowser } from 'vitepress'

const route = useRoute()
const progress = ref(0)
const isArticle = computed(() => route.path.includes('/posts/'))

function updateProgress() {
  if (!inBrowser) return
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})

watch(() => route.path, () => { progress.value = 0 })
</script>

<template>
  <div class="reading-progress" v-if="isArticle">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: progress + '%' }" />
    </div>
    <span class="progress-text" v-if="progress > 5">{{ Math.round(progress) }}%</span>
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9997;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-track {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--vp-c-bg-elv);
  border: 2px solid var(--vp-c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .progress-track {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.progress-fill {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    var(--vp-c-brand-1) calc(var(--progress, 0) * 1%),
    transparent calc(var(--progress, 0) * 1%)
  );
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
  transition: width 0.1s ease-out;
}

.progress-fill {
  width: calc(v-bind(progress) * 1%);
}

.progress-text {
  position: absolute;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
}
</style>
