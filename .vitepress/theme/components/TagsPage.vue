<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../posts.data.ts'

const tagCounts = computed(() => {
  const counts: Record<string, number> = {}
  posts.forEach((p: any) => {
    (p.tags || []).forEach((tag: string) => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return counts
})

const tags = computed(() =>
  Object.entries(tagCounts.value)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
)

const maxCount = computed(() => Math.max(...tags.value.map(t => t.count)))

const colors = [
  { bg: '#ecf5ff', text: '#409eff', border: '#b3d8ff' },
  { bg: '#f0f9eb', text: '#67c23a', border: '#c2e7b0' },
  { bg: '#fdf6ec', text: '#e6a23c', border: '#f5dab1' },
  { bg: '#fef0f0', text: '#f56c6c', border: '#fbc4c4' },
  { bg: '#f4f4f5', text: '#909399', border: '#d3d4d6' },
  { bg: '#e1f3d8', text: '#7ec23a', border: '#b3e19d' },
  { bg: '#ecf5ff', text: '#1e80ff', border: '#a0cfff' },
  { bg: '#fef0f0', text: '#ff4d4f', border: '#ffaaa5' },
]

function getTagStyle(index: number) {
  const color = colors[index % colors.length]
  return {
    background: color.bg,
    color: color.text,
    borderColor: color.border,
  }
}

function getFontSize(count: number) {
  return 0.85 + (count / maxCount.value) * 0.5
}
</script>

<template>
  <div class="tags-page">
    <h1>标签</h1>
    <div class="tag-cloud">
      <a
        v-for="(tag, index) in tags"
        :key="tag.name"
        :href="'/blog?tag=' + tag.name"
        class="tag-item"
        :style="{ ...getTagStyle(index), fontSize: getFontSize(tag.count) + 'rem' }"
      >
        {{ tag.name }}
        <span class="tag-count" :style="{ background: 'rgba(0,0,0,0.06)' }">{{ tag.count }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.tags-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.tags-page h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #303133;
  margin-bottom: 2rem;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid;
  text-decoration: none;
  transition: all 0.3s;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tag-count {
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}
</style>
