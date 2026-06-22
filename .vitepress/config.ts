import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Xiaozhou's Blog",
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
  ],

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      description: '工单系统 · 前端工程化 · Vue 生态 · 个人技术博客',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '归档', link: '/blog' },
          { text: '关于', link: '/about' },
        ],
        footer: {
          message: 'Built with VitePress · 遨游星河',
          copyright: '© 2026 Xiaozhou',
        },
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: "Xiaozhou's Blog",
      description: 'Workflow Systems · Frontend Engineering · Vue Ecosystem · Personal Tech Blog',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Archive', link: '/en/blog' },
          { text: 'About', link: '/en/about' },
        ],
        footer: {
          message: 'Built with VitePress · Explore the Galaxy',
          copyright: '© 2026 Xiaozhou',
        },
      }
    }
  },

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhou0928' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '返回',
            noResultsText: '无法找到相关结果',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
  },
})
