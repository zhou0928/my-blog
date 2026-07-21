---
layout: page
title: 留言板
description: 在这里留下你的足迹
---

<script setup>
import GuestbookGiscus from './.vitepress/theme/components/GuestbookGiscus.vue'
</script>

<div class="guestbook-page">

<div class="guestbook-header">

# 💬 留言板

欢迎在这里留下你的想法、建议或只是打个招呼 :)

</div>

<GuestbookGiscus />

</div>

<style>
.guestbook-page {
  max-width: 800px;
  margin: 0 auto;
}

.guestbook-header {
  text-align: center;
  margin-bottom: 2rem;
}

.guestbook-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
</style>
