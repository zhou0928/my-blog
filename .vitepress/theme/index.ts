import { h, onMounted, onBeforeUnmount } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import BlogHome from './components/BlogHome.vue'
import PostList from './components/PostList.vue'
import GitStats from './components/GitStats.vue'
import BackToTop from './components/BackToTop.vue'
import { initCursorEffects, destroyCursorEffects } from './cursor-effects'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    if (inBrowser) {
      onMounted(() => initCursorEffects())
      onBeforeUnmount(() => destroyCursorEffects())
    }
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(BlogHome),
      // 404 页面：VitePress 在找不到页面时渲染 not-found slot
      'not-found': () => h(BackToTop),
    })
  },
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('GitStats', GitStats)
    app.component('BackToTop', BackToTop)
  },
}
