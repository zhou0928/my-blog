import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Xiaozhou's Blog",
  description: '工单系统 · 前端工程化 · Vue 生态 · 个人技术博客',
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    }],
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#00e5ff' }],
    ['meta', { name: 'application-name', content: "Xiaozhou's Blog" }],
  ],

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: false,

    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/blog' },
      { text: '关于', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhou0928' },
    ],

    footer: {
      message: 'Built with VitePress · 遨游星河',
      copyright: '© 2026 Xiaozhou',
    },

    search: {
      provider: 'local',
    },
  },
})
