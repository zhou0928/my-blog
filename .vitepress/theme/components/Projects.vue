<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { localeIndex } = useData()
const isEn = ref(localeIndex.value === 'en')

const projects = ref([
  {
    name: 'oneLineCar 工单系统',
    desc: '工单全流程管理平台核心开发，前车查找、离线重连、Excel 百万级导出',
    tags: ['Vue 3', 'TypeScript', 'WebSocket', 'IndexedDB'],
    icon: '🚗',
    link: '',
  },
  {
    name: '管局 OA 系统',
    desc: '4 个子仓库，2,000+ commits 的 OA 全流程系统',
    tags: ['Vue 2', 'Element UI', 'Node.js'],
    icon: '🏢',
    link: '',
  },
  {
    name: '总部智慧楼宇',
    desc: 'IoT 告警、视频监控、GIS 大屏可视化',
    tags: ['Vue 3', 'ECharts', 'WebSocket', 'GIS'],
    icon: '🏗️',
    link: '',
  },
  {
    name: '小b三平台',
    desc: '零售端/运营端/供应商端三端分离架构',
    tags: ['Vue 3', 'Pinia', '微前端'],
    icon: '🛒',
    link: '',
  },
  {
    name: '个人博客',
    desc: '暗色科幻风 VitePress 博客，自定义主题、粒子动效、双语支持',
    tags: ['VitePress', 'Vue 3', 'CSS'],
    icon: '🚀',
    link: 'https://000902.icu',
  },
])
</script>

<template>
  <div class="projects-page">
    <div class="projects-hero">
      <div class="hero-bg" />
      <div class="hero-content">
        <span class="hero-tag">{{ isEn ? 'Projects' : '项目' }}</span>
        <h1 class="hero-title">{{ isEn ? 'My Projects' : '我的项目' }}</h1>
        <p class="hero-subtitle">{{ isEn ? 'Things I have built and contributed to' : '参与开发和技术实践的项目' }}</p>
      </div>
    </div>

    <div class="projects-grid">
      <div
        v-for="project in projects"
        :key="project.name"
        class="project-card"
        :class="{ 'has-link': project.link }"
        @click="project.link && window.open(project.link, '_blank')"
      >
        <div class="project-icon">{{ project.icon }}</div>
        <div class="project-body">
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-desc">{{ project.desc }}</p>
          <div class="project-tags">
            <span v-for="tag in project.tags" :key="tag" class="project-tag">{{ tag }}</span>
          </div>
        </div>
        <div class="project-arrow" v-if="project.link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem 6rem;
}

.projects-hero {
  position: relative;
  padding: 6rem 0 3rem;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 229, 255, 0.06) 0%, transparent 100%);
  border-radius: 20px;
}

.dark .hero-bg {
  background: linear-gradient(180deg, rgba(0, 229, 255, 0.1) 0%, transparent 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-tag {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 1.25rem;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-3);
  font-weight: 400;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.project-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card.has-link {
  cursor: pointer;
}

.project-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(6px);
  box-shadow: 0 4px 20px rgba(0, 229, 255, 0.08);
}

.project-icon {
  font-size: 2rem;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.project-body {
  flex: 1;
  min-width: 0;
}

.project-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.3rem;
}

.project-card:hover .project-name {
  color: var(--vp-c-brand-1);
}

.project-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.project-tag {
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.project-arrow {
  color: var(--vp-c-text-3);
  opacity: 0;
  transform: translate(-4px, 4px);
  transition: all 0.3s;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.project-card:hover .project-arrow {
  opacity: 1;
  transform: translate(0, 0);
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .hero-title { font-size: 2rem; }
  .project-card { flex-direction: column; gap: 0.75rem; }
  .project-icon { width: 42px; height: 42px; font-size: 1.5rem; }
}
</style>
