<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import stats from '../../github-stats.json'

const { localeIndex } = useData()
const isEn = ref(localeIndex.value === 'en')

const t = isEn.value
  ? {
      commits: 'Commits',
      repos: 'Repositories',
      identities: 'Git Identities',
    }
  : {
      commits: 'Commits',
      repos: '项目仓库',
      identities: 'Git 身份',
    }

// 数字滚动
const commitCount = ref(0)
const repoCount = ref(0)
const targetCommits = stats.commits || 4700
const targetRepos = stats.repos || 24

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    commitCount.value = targetCommits
    repoCount.value = targetRepos
  } else {
    animateCounter(commitCount, targetCommits, 2000)
    animateCounter(repoCount, targetRepos, 1500)
  }
})

function animateCounter(target: { value: number }, end: number, duration: number) {
  const startTime = Date.now()
  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    target.value = Math.floor(end * eased)
    if (progress < 1) requestAnimationFrame(update)
  }
  update()
}
</script>

<template>
  <div class="git-stats">
    <div class="stat-item">
      <span class="stat-number">{{ commitCount.toLocaleString() }}+</span>
      <span class="stat-label">{{ t.commits }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">{{ repoCount }}+</span>
      <span class="stat-label">{{ t.repos }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">3</span>
      <span class="stat-label">{{ t.identities }}</span>
    </div>
  </div>
</template>

<style scoped>
.git-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--blog-card-border);
  background: var(--blog-card-bg);
  transition: border-color 0.3s;
}

.stat-item:hover {
  border-color: var(--blog-card-border-hover);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--vp-font-family-mono);
  background: linear-gradient(135deg, var(--blog-accent), var(--blog-accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .git-stats { grid-template-columns: 1fr; }
}
</style>
