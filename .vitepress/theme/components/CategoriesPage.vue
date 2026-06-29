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

const categories = computed(() =>
  Object.entries(tagCounts.value)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
)
</script>

<template>
  <div class="categories-page">
    <h1>分类</h1>
    <div class="category-list">
      <a
        v-for="cat in categories"
        :key="cat.name"
        :href="'/tags?tag=' + cat.name"
        class="category-item"
      >
        <span class="category-name">{{ cat.name }}</span>
        <span class="category-count">{{ cat.count }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.categories-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.categories-page h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #303133;
  margin-bottom: 2rem;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border: 1px solid #e4e6e8;
  border-radius: 8px;
  text-decoration: none;
  color: #303133;
  transition: all 0.3s;
}

.category-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.category-name {
  font-weight: 500;
}

.category-count {
  font-size: 0.85rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: #f5f7fa;
  color: #909399;
}
</style>
