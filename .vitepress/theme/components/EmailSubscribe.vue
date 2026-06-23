<script setup lang="ts">
</script>

<template>
  <div class="email-subscribe">
    <div class="subscribe-icon">📬</div>
    <h3 class="subscribe-title">订阅更新</h3>
    <p class="subscribe-desc">获取最新文章推送，不错过任何干货</p>
    <form class="subscribe-form" action="https://buttondown.com/api/emails/embed-subscribe" method="post" target="_blank">
      <input type="hidden" name="embed" value="1" />
      <!-- 替换为你的 Buttondown email -->
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        class="subscribe-input"
        required
      />
      <button type="submit" class="subscribe-btn">订阅</button>
    </form>
    <p class="subscribe-note">不会发送垃圾邮件，随时可退订</p>
  </div>
</template>

<style scoped>
.email-subscribe {
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--vp-c-border);
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.04) 0%, rgba(212, 148, 58, 0.02) 100%);
  text-align: center;
  margin-top: 2rem;
}

.dark .email-subscribe {
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.06) 0%, rgba(212, 148, 58, 0.04) 100%);
}

.subscribe-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.subscribe-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.subscribe-desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1.25rem;
}

.subscribe-form {
  display: flex;
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.subscribe-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.subscribe-input::placeholder {
  color: var(--vp-c-text-3);
}

.subscribe-input:focus {
  border-color: var(--vp-c-brand-1);
}

.subscribe-btn {
  padding: 0.7rem 1.25rem;
  border-radius: 8px;
  border: none;
  background: var(--vp-c-brand-1);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.subscribe-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.subscribe-note {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 0.75rem;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .subscribe-form { flex-direction: column; }
}
</style>
