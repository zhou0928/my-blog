import { defineConfig } from 'vitepress'

const SITE_URL = 'https://000902.icu'

export default defineConfig({
  title: "Xiazhou's Blog",
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  outDir: 'dist',

  sitemap: {
    hostname: SITE_URL,
  },

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
    }],
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: "Xiazhou's Blog RSS", href: '/feed.xml' }],
    ['meta', { name: 'theme-color', content: '#00e5ff' }],
    ['meta', { name: 'application-name', content: "Xiazhou's Blog" }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    // Google Search Console 验证 — 替换 YOUR_VERIFICATION_CODE
    // ['meta', { name: 'google-site-verification', content: 'YOUR_VERIFICATION_CODE' }],
    // Accessibility
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: "Xiazhou's Blog" }],
    ['meta', { property: 'og:description', content: '工单系统 · 前端工程化 · Vue 生态 · 个人技术博客' }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/og-default.svg` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:site_name', content: "Xiazhou's Blog" }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: "Xiazhou's Blog" }],
    ['meta', { name: 'twitter:description', content: '工单系统 · 前端工程化 · Vue 生态 · 个人技术博客' }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}/og-default.svg` }],
    // Google Analytics
    // ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }],
    // ['script', {}, `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-XXXXXXXXXX');`],
    // JSON-LD Blog Schema
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: "Xiazhou's Blog",
      url: SITE_URL,
      description: '工单系统 · 前端工程化 · Vue 生态 · 个人技术博客',
      author: {
        '@type': 'Person',
        name: 'Xiazhou',
        url: 'https://github.com/zhou0928',
      },
    })],
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
          { text: '项目', link: '/projects' },
          { text: '关于', link: '/about' },
          { text: 'RSS', link: '/feed.xml' },
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
        footer: {
          message: 'Built with VitePress · 遨游星河',
          copyright: '© 2026 Xiaozhou',
        },
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: "Xiazhou's Blog",
      description: 'Workflow Systems · Frontend Engineering · Vue Ecosystem · Personal Tech Blog',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Archive', link: '/en/blog' },
          { text: 'About', link: '/en/about' },
        ],
        search: {
          provider: 'local',
        },
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

    outline: {
      level: [2, 3],
      label: '目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },

  // 构建优化
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
})
