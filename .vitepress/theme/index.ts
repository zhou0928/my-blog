import { h, onMounted, onBeforeUnmount } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import BlogHome from './components/BlogHome.vue'
import PostList from './components/PostList.vue'
import GitStats from './components/GitStats.vue'
import BackToTop from './components/BackToTop.vue'
import NotFound from './components/NotFound.vue'
import ArticleMeta from './components/ArticleMeta.vue'
import GiscusComments from './components/GiscusComments.vue'
import RelatedPosts from './components/RelatedPosts.vue'
import { initCursorEffects, destroyCursorEffects } from './cursor-effects'
import { initMediumZoom } from './medium-zoom'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    if (inBrowser) {
      onMounted(() => {
        initCursorEffects()
        initMediumZoom()
      })
      onBeforeUnmount(() => destroyCursorEffects())
    }
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(BlogHome),
      'not-found': () => h(NotFound),
      'doc-before': () => h(ArticleMeta),
      'doc-after': () => h('div', null, [h(RelatedPosts), h(GiscusComments)]),
    })
  },
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('GitStats', GitStats)
    app.component('BackToTop', BackToTop)
  },
}
