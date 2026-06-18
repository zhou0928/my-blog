# 🚀 Xiaozhou Blog

暗色科幻风技术博客，基于 [VitePress](https://vitepress.dev/) 构建，托管于 GitHub Pages。

## Tech Stack

- **框架**: VitePress 1.6 + Vue 3.5
- **主题**: 自定义暗色科幻风（网格背景、玻璃拟态、霓虹渐变）
- **部署**: GitHub Actions → GitHub Pages
- **域名**: [000902.icu](https://000902.icu)

## 快速开始

```bash
npm install
npm run dev    # 本地开发
npm run build  # 构建
npm run preview # 预览构建产物
```

## 写文章

在 `posts/` 目录下新建 `.md` 文件，头部添加 frontmatter：

```markdown
---
title: 文章标题
date: 2026-06-20
tags: [Vue, 工单系统]
description: 一句话描述，会显示在卡片和 SEO 中
---
```

## 目录结构

```
blog/
├── .vitepress/
│   ├── config.ts               # 站点配置
│   ├── posts.data.ts            # 文章数据加载器
│   └── theme/
│       ├── index.ts             # 主题入口
│       ├── styles/custom.css    # 暗色科幻风样式
│       └── components/
│           ├── BlogHome.vue     # 首页英雄区
│           └── PostList.vue     # 归档 + 标签过滤
├── posts/                       # 文章目录
├── public/
│   ├── CNAME                    # 自定义域名
│   └── favicon.svg              # 站点图标
└── .github/workflows/deploy.yml # CI/CD
```

## 部署

推送到 `main` 分支自动触发 GitHub Actions 构建并部署到 Pages。

自定义域名已在 `public/CNAME` 中配置为 `000902.icu`，需在 DNS 管理中添加：

```
@  A      → 185.199.108.153
@  A      → 185.199.109.153
@  A      → 185.199.110.153
@  A      → 185.199.111.153
www CNAME → zhou0928.github.io
```

然后在仓库 Settings → Pages → Custom domain 填入 `000902.icu`。
