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
import Breadcrumb from './components/Breadcrumb.vue'
import KeyboardShortcuts from './components/KeyboardShortcuts.vue'
import EmailSubscribe from './components/EmailSubscribe.vue'
import ViewCount from './components/ViewCount.vue'
import Projects from './components/Projects.vue'
import ScrollRestore from './components/ScrollRestore.vue'
import SeoHead from './components/SeoHead.vue'
import TranslationLink from './components/TranslationLink.vue'
import LastUpdated from './components/LastUpdated.vue'
import { initCursorEffects, destroyCursorEffects } from './cursor-effects'
import { initVisualEffects, destroyVisualEffects } from './visual-effects'
import { initMediumZoom } from './medium-zoom'
import './styles/custom.css'

function registerSW() {
  if (inBrowser && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
}

export default {
  extends: DefaultTheme,
  Layout() {
    if (inBrowser) {
      onMounted(() => {
        initCursorEffects()
        initVisualEffects()
        initMediumZoom()
        registerSW()
      })
      onBeforeUnmount(() => {
        destroyCursorEffects()
        destroyVisualEffects()
      })
    }
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(BlogHome),
      'not-found': () => h(NotFound),
      'layout-top': () => h('div', null, [h(KeyboardShortcuts), h(ScrollRestore), h(SeoHead)]),
      'doc-before': () => h('div', null, [
        h(Breadcrumb),
        h(ArticleMeta),
        h(TranslationLink),
      ]),
      'doc-after': () => h('div', null, [
        h(LastUpdated),
        // h(EmailSubscribe),
        h(RelatedPosts),
        h(GiscusComments),
      ]),
    })
  },
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('GitStats', GitStats)
    app.component('BackToTop', BackToTop)
    app.component('Projects', Projects)
    app.component('ViewCount', ViewCount)
    app.component('KeyboardShortcuts', KeyboardShortcuts)
    app.component('ScrollRestore', ScrollRestore)
    app.component('SeoHead', SeoHead)
  },
}
