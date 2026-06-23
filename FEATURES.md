# 功能清单

Xiaozhou's Blog 全部已实现功能一览。

---

## 🎨 主题与视觉

| 功能 | 文件 | 说明 |
|------|------|------|
| 暗色科幻主题 | `custom.css` | 深空蓝黑底色 + 网格纹理 + 霓虹渐变 |
| 粒子连线背景 | `BlogHome.vue` | Canvas 实现，粒子自动连线 |
| 鼠标光标特效 | `cursor-effects.ts` | 纸飞机跟随 + 拖尾粒子 + 点击爆炸 |
| 3D 倾斜卡片 | `visual-effects.ts` | 鼠标移动时卡片透视旋转 + 光泽追踪 |
| Glitch 赛博朋克文字 | `custom.css` | 首页标题随机抖动 + 色差 |
| 噪点纹理覆盖 | `visual-effects.ts` | 全局胶片质感噪点层 |
| 磁性按钮 | `visual-effects.ts` | 按钮跟随鼠标微幅移动 |
| 霓虹脉冲呼吸灯 | `custom.css` | Badge 发光动画 |
| 扫描线 CRT | `custom.css` | 终端卡片 CRT 扫描线效果 |
| 波纹点击效果 | `custom.css` | CTA 按钮点击涟漪扩散 |
| 动态渐变边框 | `custom.css` | 边框颜色旋转动画 |
| 悬浮发光增强 | `custom.css` | 卡片多层霓虹阴影 |
| 暗亮模式切换 | VitePress 内置 | 导航栏切换按钮 |
| 滚动进度条 | `BackToTop.vue` | 顶部渐变进度条，文章页加粗+发光 |
| 回到顶部按钮 | `BackToTop.vue` | 滚动 300px 后出现 |
| 终端打字机动画 | `BlogHome.vue` | 首页代码卡片逐字打出 |
| 滚动揭示动画 | `custom.css` | 元素进入视口时淡入上移 |

## 📝 文章功能

| 功能 | 文件 | 说明 |
|------|------|------|
| TOC 侧边栏目录 | `config.ts` | 自动提取 h2/h3，滚动高亮跟随 |
| 上一篇/下一篇 | `config.ts` | 文章底部导航 |
| 阅读进度条 | `BackToTop.vue` | 文章页 4px 霓虹发光进度条 |
| 字数统计 | `posts.data.ts` | 中英文混合字数计算 |
| 阅读时间估算 | `posts.data.ts` | 中文 300 字/分钟，英文 200 词/分钟 |
| 文章标签过滤 | `PostList.vue` | 按 tag 筛选文章 |
| 按年份分组归档 | `PostList.vue` | 归档页按年展示 |
| 文章搜索 | VitePress 内置 | 本地全文搜索 |
| 文章草稿模式 | `posts.data.ts` | frontmatter `draft: true` 自动隐藏 |
| 文章系列 | `posts.data.ts` | frontmatter `series` 字段分组 |
| 脚注/注释 | `custom.css` | `[^1]` 脚注引用样式美化 |
| 图片 caption | `custom.css` | `<figcaption>` 说明文字样式 |
| 图片点击放大 | `medium-zoom.ts` | medium-zoom 库集成 |
| 图片 lazy loading | `custom.css` | 淡入 + 缩放动画 |

## 🔗 分享与互动

| 功能 | 文件 | 说明 |
|------|------|------|
| 复制链接 | `ArticleMeta.vue` | 一键复制当前文章 URL |
| Twitter 分享 | `ArticleMeta.vue` | 分享到 Twitter |
| Giscus 评论 | `GiscusComments.vue` | 基于 GitHub Discussions，暗亮同步 |
| 相关文章推荐 | `RelatedPosts.vue` | 基于 tag 匹配，底部推荐 3 篇 |
| 邮件订阅 | `EmailSubscribe.vue` | Buttondown 集成 |
| 阅读量统计 | `ViewCount.vue` | localStorage 计数，可替换 Umami |
| 中英文翻译链接 | 已移除 | ~~文章页 🇨🇳/🇬🇧 互链~~ |
| 文章最后更新时间 | `LastUpdated.vue` | 显示 VitePress lastUpdated |

## 🧭 导航与交互

| 功能 | 文件 | 说明 |
|------|------|------|
| 面包屑导航 | `Breadcrumb.vue` | 文章页顶部路径 |
| 键盘快捷键 | `KeyboardShortcuts.vue` | `/` 搜索、`j/k` 标题跳转、`?` 帮助弹窗 |
| 阅读位置恢复 | `ScrollRestore.vue` | localStorage 记住滚动位置 |
| 项目/作品集页 | `Projects.vue` + `projects.md` | 独立项目展示页 |
| 首页最新文章 | `BlogHome.vue` | 首页展示 6 篇最新文章 |
| 首页技术栈展示 | `BlogHome.vue` | 技能卡片网格 |
| 首页 CTA 区域 | `BlogHome.vue` | 引导浏览全部文章 |

## 🔍 SEO

| 功能 | 文件 | 说明 |
|------|------|------|
| Sitemap | `config.ts` | 自动生成 sitemap.xml |
| robots.txt | `public/robots.txt` | 搜索引擎爬虫指引 |
| Open Graph | `config.ts` | OG 标签（title/description/image） |
| Twitter Card | `config.ts` | Twitter 大图卡片 |
| OG 分享图生成 | `scripts/generate-og.ts` | 每篇文章独立 1200x630 SVG 图 |
| Canonical URL | `SeoHead.vue` | 每页动态注入 canonical 标签 |
| Blog JSON-LD | `config.ts` | 站点级结构化数据 |
| Article JSON-LD | `SeoHead.vue` | 文章级结构化数据 |
| Google Analytics | `config.ts` | GA4 占位（取消注释即用） |

## 📡 RSS & 订阅

| 功能 | 文件 | 说明 |
|------|------|------|
| RSS Feed | `public/feed.xml` | 自动生成 RSS 2.0 |
| RSS 导航链接 | `config.ts` | 导航栏 RSS 入口 |
| RSS `<link>` | `config.ts` | `<head>` 中 RSS 自动发现 |

## 🌐 双语支持

| 功能 | 文件 | 说明 |
|------|------|------|
| 中文站 | `index.md` | 主站中文 |
| 英文站 | `en/` | 英文镜像 |
| 语言切换 | VitePress 内置 | 导航栏语言切换 |
| 独立搜索 | `config.ts` | 中英文独立搜索索引 |
| 独立归档 | `posts-en.data.ts` | 英文文章独立加载器 |

## ⚡ 性能优化

| 功能 | 文件 | 说明 |
|------|------|------|
| Service Worker | `public/sw.js` | 离线缓存，HTML 网络优先 |
| 字体 font-display swap | Google Fonts URL | 避免 FOIT 字体闪烁 |
| 中文字体回退 | `custom.css` | PingFang SC / Microsoft YaHei |
| 图片 lazy loading | `custom.css` | 淡入动画 |
| prefers-reduced-motion | `custom.css` | 尊重系统减少动画设置 |
| 打印样式 | `custom.css` | 隐藏导航/页脚/粒子 |
| 滚动条美化 | `custom.css` | 6px 细滚动条 |

## 🛠️ 工程化

| 功能 | 文件 | 说明 |
|------|------|------|
| GitHub Actions 部署 | `deploy.yml` | push 到 main 自动部署 |
| PR 预览部署 | `preview.yml` | PR 自动部署预览环境 |
| GitHub Stats 拉取 | `fetch-github-stats.ts` | CI 自动获取 commit/repo 数 |
| RSS 自动生成 | `generate-rss.ts` | CI 自动构建 RSS |
| OG 图自动生成 | `generate-og.ts` | CI 自动为每篇文章生成分享图 |
| 本地命令 | `package.json` | `npm run rss/stats/og` |

## 🎯 404 页面

| 功能 | 文件 | 说明 |
|------|------|------|
| 太空主题 404 | `NotFound.vue` | 星空闪烁 + 404 渐变 + 返回首页 |

## 📊 关于页

| 功能 | 文件 | 说明 |
|------|------|------|
| 个人介绍 | `about.md` | 头像 + 角色 + 简介 |
| 技术栈标签 | `about.md` | 技能 tag 展示 |
| 项目经验卡片 | `about.md` | 4 个项目经历 |
| Git 贡献统计 | `GitStats.vue` | Commits/Repos 数字滚动 |
| 联系方式 | `about.md` | GitHub + 个人网站 |

---

## 📦 依赖

| 包名 | 用途 |
|------|------|
| `vitepress` ^1.6.3 | 静态站点生成 |
| `vue` ^3.5.13 | UI 框架 |
| `medium-zoom` | 图片点击放大 |

## 📁 项目结构

```
blog/
├── .github/workflows/
│   ├── deploy.yml          # 主站部署
│   └── preview.yml         # PR 预览
├── .vitepress/
│   ├── config.ts           # 站点配置
│   ├── posts.data.ts       # 中文文章数据
│   ├── posts-en.data.ts    # 英文文章数据
│   └── theme/
│       ├── index.ts        # 主题入口
│       ├── custom.css      # 全局样式
│       ├── cursor-effects.ts   # 光标特效
│       ├── medium-zoom.ts      # 图片放大
│       ├── visual-effects.ts   # 炫酷视觉特效
│       └── components/
│           ├── BlogHome.vue        # 首页
│           ├── PostList.vue        # 归档页
│           ├── GitStats.vue        # Git 统计
│           ├── BackToTop.vue       # 回到顶部+进度条
│           ├── NotFound.vue        # 404 页面
│           ├── ArticleMeta.vue     # 文章元信息+分享
│           ├── GiscusComments.vue  # 评论系统
│           ├── RelatedPosts.vue    # 相关推荐
│           ├── Breadcrumb.vue      # 面包屑
│           ├── KeyboardShortcuts.vue # 键盘快捷键
│           ├── EmailSubscribe.vue  # 邮件订阅
│           ├── ViewCount.vue       # 阅读量
│           ├── Projects.vue        # 项目页
│           ├── ScrollRestore.vue   # 阅读位置恢复
│           ├── SeoHead.vue         # SEO注入
│           └── LastUpdated.vue     # 更新时间
├── posts/                  # 中文文章
├── en/                     # 英文文章
├── public/
│   ├── CNAME               # 自定义域名
│   ├── sw.js               # Service Worker
│   ├── robots.txt          # 爬虫指引
│   ├── feed.xml            # RSS (构建生成)
│   └── og-*.svg            # OG 分享图 (构建生成)
└── scripts/
    ├── fetch-github-stats.ts   # GitHub 统计
    ├── generate-rss.ts         # RSS 生成
    └── generate-og.ts          # OG 图生成
```
