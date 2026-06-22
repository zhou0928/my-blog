<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, useData } from 'vitepress'
import { data as postsZh } from '../../posts.data.js'
import { data as postsEn } from '../../posts-en.data.js'

const route = useRoute()
const router = useRouter()
const { localeIndex } = useData()

const isEn = computed(() => localeIndex.value === 'en')
const allPosts = computed(() => (isEn.value ? postsEn : postsZh))

const relatedPosts = computed(() => {
  const currentUrl = route.path
  const current = allPosts.value.find((p) => currentUrl.includes(p.url))
  if (!current?.tags?.length) return []

  const scored = allPosts.value
    .filter((p) => p.url !== current.url)
    .map((p) => ({
      ...p,
      score: p.tags?.filter((t) => current.tags.includes(t)).length || 0,
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return scored
})

function goToPost(url: string) {
  router.go(url)
}
</script>

<template>
  <div class="related-posts" v-if="relatedPosts.length > 0">
    <div class="related-divider">
      <span>📚 相关文章</span>
    </div>
    <div class="related-grid">
      <article
        v-for="post in relatedPosts"
        :key="post.url"
        class="related-card"
        @click="goToPost(post.url)"
      >
        <div class="related-meta">
          <time>{{ post.date }}</time>
          <span v-for="tag in post.tags?.slice(0, 2)" :key="tag" class="related-tag">#{{ tag }}</span>
        </div>
        <h3 class="related-title">{{ post.title }}</h3>
        <p class="related-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.related-posts {
  margin-top: 3rem;
  padding-top: 2rem;
}

.related-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.related-divider::before,
.related-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--vp-c-border);
}

.related-divider span {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.related-card {
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.related-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 229, 255, 0.08);
}

.related-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.related-tag {
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.related-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.4rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}

.related-card:hover .related-title {
  color: var(--vp-c-brand-1);
}

.related-excerpt {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .related-grid { grid-template-columns: 1fr; }
}
</style>
