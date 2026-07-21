<script setup lang="ts">
import { ref } from 'vue'
import { useData, inBrowser } from 'vitepress'

const { lang } = useData()
const expanded = ref(false)
</script>

<template>
  <div class="donate-wrapper">
    <button class="donate-toggle" @click="expanded = !expanded">
      <span class="donate-icon">☕</span>
      <span>{{ lang === 'zh-CN' ? '请作者喝杯咖啡' : 'Buy me a coffee' }}</span>
      <svg :class="{ rotated: expanded }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <transition name="expand">
      <div v-if="expanded" class="donate-panel">
        <div class="donate-qr-grid">
          <div class="donate-qr-item">
            <div class="qr-placeholder wechat">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M8 12h.01M12 12h.01M16 12h.01"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="8" r="1" fill="currentColor"/></svg>
              <span class="qr-label">微信支付</span>
              <span class="qr-hint">替换为微信收款码</span>
            </div>
          </div>
          <div class="donate-qr-item">
            <div class="qr-placeholder alipay">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M8 12h.01M12 12h.01M16 12h.01"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="8" r="1" fill="currentColor"/></svg>
              <span class="qr-label">支付宝</span>
              <span class="qr-hint">替换为支付宝收款码</span>
            </div>
          </div>
        </div>
        <p class="donate-tip">{{ lang === 'zh-CN' ? '感谢您的支持！' : 'Thanks for your support!' }}</p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.donate-wrapper {
  margin: 1.5rem 0;
}

.donate-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  border: 1px solid var(--vp-c-brand-1);
  background: transparent;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s;
}

.donate-toggle:hover {
  background: var(--vp-c-brand-soft);
}

.donate-icon {
  font-size: 1.1rem;
}

.donate-toggle svg {
  transition: transform 0.3s;
}

.donate-toggle svg.rotated {
  transform: rotate(180deg);
}

.donate-panel {
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.donate-qr-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.donate-qr-item {
  flex: 0 0 auto;
}

.qr-placeholder {
  width: 160px;
  height: 180px;
  border-radius: 10px;
  border: 2px dashed var(--vp-c-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--vp-c-text-3);
  transition: border-color 0.3s;
}

.qr-placeholder:hover {
  border-color: var(--vp-c-brand-1);
}

.qr-placeholder.wechat:hover {
  border-color: #07c160;
}

.qr-placeholder.alipay:hover {
  border-color: #1677ff;
}

.qr-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.qr-hint {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

.donate-tip {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

/* expand transition */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 400px;
}

@media (max-width: 640px) {
  .donate-qr-grid {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
</style>
