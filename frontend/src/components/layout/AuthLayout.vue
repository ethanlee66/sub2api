<template>
  <div class="auth-shell relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8">
    <div class="relative z-10 flex w-full max-w-[440px] flex-col">
      <div class="mb-7 text-center">
        <router-link to="/home" class="auth-brand mx-auto inline-flex max-w-full items-center gap-3 text-left">
          <span class="auth-logo inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
            <img src="/logo.png" :alt="siteName" class="h-full w-full object-contain" />
          </span>
          <span class="min-w-0">
            <span class="auth-name block truncate text-xl font-semibold">
              {{ siteName }}
            </span>
            <span class="auth-subtitle mt-1 block truncate text-sm">
              {{ siteSubtitle }}
            </span>
          </span>
        </router-link>
      </div>

      <div class="auth-panel px-6 py-7 sm:px-8">
        <slot />
      </div>

      <div class="auth-footer mt-5 text-center text-sm">
        <slot name="footer" />
      </div>

      <div class="auth-copyright mt-7 text-center text-xs">
        &copy; {{ currentYear }} {{ siteName }}. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const siteName = computed(() => appStore.siteName || 'MyToken')
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || 'Subscription to API Conversion Platform')

const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  appStore.fetchPublicSettings()
})
</script>

<style scoped>
.auth-shell {
  --auth-brand: #3e55e9;
  --auth-brand-hover: #2f43c9;
  --auth-brand-strong: #2438b8;
  --auth-brand-label: #8ea0ff;
  --auth-brand-border: #c8d1ff;
  --auth-radius-control: 6px;
  --auth-radius-panel: 8px;
  --auth-page-bg-start: rgba(243, 245, 255, 1);
  --auth-page-bg-mid: rgba(248, 250, 252, 0.96);
  --auth-page-bg-end: rgba(255, 255, 255, 1);
  --auth-page-glow-brand: rgba(62, 85, 233, 0.11);
  --auth-page-glow-cyan: rgba(56, 189, 248, 0.07);
  --auth-text-strong: #15172b;
  --auth-text-body: #596074;
  --auth-text-muted: #5f6678;
  --auth-text-soft: #737b8f;
  --auth-control-bg: rgba(255, 255, 255, 0.9);
  --auth-control-border: #d6d9e4;
  --auth-control-hover: #eef2ff;
  --auth-panel-bg: rgba(255, 255, 255, 0.78);
  --auth-panel-border: rgba(200, 209, 255, 0.84);
  --auth-panel-border-soft: rgba(200, 209, 255, 0.52);
  --auth-panel-shadow: 0 1px 0 rgba(62, 85, 233, 0.06);
  --auth-button-primary-bg: var(--auth-brand);
  --auth-button-primary-text: #f8faff;
  --auth-button-primary-hover: var(--auth-brand-hover);
  --auth-button-primary-shadow: 0 10px 24px rgba(62, 85, 233, 0.22);
  color: var(--auth-text-strong);
  background:
    linear-gradient(180deg, var(--auth-page-bg-start) 0%, var(--auth-page-bg-mid) 48%, var(--auth-page-bg-end) 100%),
    linear-gradient(126deg, var(--auth-page-glow-brand) 0%, transparent 36%, var(--auth-page-glow-cyan) 78%, transparent 100%);
}

:global(.dark) .auth-shell {
  --auth-page-bg-start: rgba(2, 6, 23, 1);
  --auth-page-bg-mid: rgba(12, 18, 54, 0.98);
  --auth-page-bg-end: rgba(2, 6, 23, 1);
  --auth-page-glow-brand: rgba(62, 85, 233, 0.2);
  --auth-page-glow-cyan: rgba(14, 165, 233, 0.1);
  --auth-text-strong: #f8faff;
  --auth-text-body: #aeb6d2;
  --auth-text-muted: #c6ccdc;
  --auth-text-soft: #9099b5;
  --auth-control-bg: rgba(15, 23, 42, 0.74);
  --auth-control-border: rgba(255, 255, 255, 0.15);
  --auth-control-hover: rgba(62, 85, 233, 0.16);
  --auth-panel-bg: rgba(15, 23, 42, 0.62);
  --auth-panel-border: rgba(142, 160, 255, 0.18);
  --auth-panel-border-soft: rgba(142, 160, 255, 0.12);
  --auth-panel-shadow: 0 1px 0 rgba(142, 160, 255, 0.08);
  --auth-button-primary-bg: var(--auth-brand-label);
  --auth-button-primary-text: #0f172a;
  --auth-button-primary-hover: #aab7ff;
  --auth-button-primary-shadow: 0 10px 24px rgba(62, 85, 233, 0.3);
}

.auth-brand {
  color: var(--auth-text-strong);
  text-decoration: none;
}

.auth-brand:hover .auth-name {
  color: var(--auth-brand-strong);
}

:global(.dark) .auth-brand:hover .auth-name {
  color: var(--auth-brand-label);
}

.auth-logo {
  border: 1px solid var(--auth-panel-border-soft);
  border-radius: var(--auth-radius-control);
  background: var(--auth-control-bg);
  box-shadow: 0 8px 20px rgba(62, 85, 233, 0.16);
}

.auth-name {
  color: var(--auth-text-strong);
  letter-spacing: 0;
  transition: color 160ms ease;
}

.auth-subtitle,
.auth-footer,
.auth-copyright {
  color: var(--auth-text-soft);
}

.auth-panel {
  border: 1px solid var(--auth-panel-border);
  border-radius: var(--auth-radius-panel);
  background: var(--auth-panel-bg);
  box-shadow: var(--auth-panel-shadow);
  backdrop-filter: blur(16px);
}

.auth-panel :deep(h1),
.auth-panel :deep(h2),
.auth-panel :deep(h3) {
  color: var(--auth-text-strong);
  letter-spacing: 0;
}

.auth-panel :deep(p),
.auth-panel :deep(.input-label),
.auth-footer :deep(p) {
  color: var(--auth-text-muted);
}

.auth-panel :deep(.input) {
  color: var(--auth-text-strong);
  border-color: var(--auth-control-border);
  border-radius: var(--auth-radius-control);
  background: var(--auth-control-bg);
  box-shadow: var(--auth-panel-shadow);
}

.auth-panel :deep(.input:focus) {
  border-color: var(--auth-brand);
  box-shadow: 0 0 0 3px rgba(62, 85, 233, 0.14);
}

.auth-panel :deep(.btn) {
  border-radius: var(--auth-radius-control);
}

.auth-panel :deep(.btn-primary) {
  color: var(--auth-button-primary-text);
  background: var(--auth-button-primary-bg);
  background-image: none;
  box-shadow: var(--auth-button-primary-shadow);
}

.auth-panel :deep(.btn-primary:hover:not(:disabled)) {
  color: var(--auth-button-primary-text);
  background: var(--auth-button-primary-hover);
  box-shadow: var(--auth-button-primary-shadow);
}

.auth-panel :deep(a),
.auth-footer :deep(a) {
  color: var(--auth-brand-strong);
}

.auth-panel :deep(a:hover),
.auth-footer :deep(a:hover) {
  color: var(--auth-brand-hover);
}

:global(.dark) .auth-panel :deep(a),
:global(.dark) .auth-footer :deep(a) {
  color: var(--auth-brand-label);
}

:global(.dark) .auth-panel :deep(a:hover),
:global(.dark) .auth-footer :deep(a:hover) {
  color: #aab7ff;
}
</style>
