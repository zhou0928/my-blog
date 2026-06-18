import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BlogHome from './components/BlogHome.vue'
import PostList from './components/PostList.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(BlogHome),
    })
  },
  enhanceApp({ app }) {
    app.component('PostList', PostList)
  },
}
