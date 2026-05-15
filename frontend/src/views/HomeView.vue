<template>
  <div v-if="homeContent" class="min-h-screen">
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      allowfullscreen
    ></iframe>
    <div v-else v-html="homeContent"></div>
  </div>

  <div v-else class="landing-page min-h-screen" :class="isDark ? 'is-dark' : 'is-light'">
    <header class="home-header sticky top-0 z-40 border-b backdrop-blur-xl">
      <nav class="mx-auto flex h-16 max-w-[1780px] items-center justify-between px-5 sm:px-8">
        <router-link to="/home" class="flex min-w-0 items-center gap-3" aria-label="AI API Studio">
          <span class="brand-mark" aria-hidden="true">
            <img src="/logo.png" alt="" class="h-full w-full object-contain" />
          </span>
          <span class="home-brand-name truncate font-bold tracking-tight">
            {{ siteName }}
          </span>
        </router-link>

        <div class="home-nav hidden items-center gap-8 font-medium lg:flex">
          <a href="#features" class="nav-link">产品</a>
          <a href="#trust" class="nav-link">价格</a>
          <a
            :href="docHref"
            :target="docUrl ? '_blank' : undefined"
            :rel="docUrl ? 'noopener noreferrer' : undefined"
            class="nav-link"
          >
            文档
          </a>
          <a href="#status" class="nav-link">状态</a>
          <a href="#support" class="nav-link">帮助中心</a>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
          <button
            class="home-status-badge hidden h-9 items-center gap-2.5 rounded-md border px-3 font-medium md:inline-flex"
            type="button"
          >
            <span class="home-status-dot h-2 w-2 rounded-full"></span>
            全部服务正常
          </button>
          <button
            class="home-icon-button inline-flex h-9 w-9 items-center justify-center rounded-md border transition"
            type="button"
            :aria-label="isDark ? '切换亮色模式' : '切换暗色模式'"
            @click="toggleTheme"
          >
            <Icon :name="isDark ? 'sun' : 'moon'" size="sm" :stroke-width="2" />
          </button>
          <router-link
            v-if="isAuthenticated"
            :to="dashboardPath"
            class="home-header-link hidden h-9 items-center rounded-md px-3 font-medium transition sm:inline-flex"
          >
            控制台
          </router-link>
          <router-link
            v-else
            to="/login"
            class="home-header-link hidden h-9 items-center rounded-md px-3 font-medium transition sm:inline-flex"
          >
            登录
          </router-link>
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="home-button home-button-primary inline-flex h-10 items-center gap-1.5 rounded-md px-4 font-medium shadow-md transition"
          >
            开始接入
            <Icon name="arrowRight" size="sm" :stroke-width="2.2" />
          </router-link>
        </div>
      </nav>
    </header>

    <main>
      <section class="mx-auto grid max-w-[1780px] gap-10 px-5 pb-7 pt-5 sm:px-8 lg:grid-cols-[0.92fr_1.58fr] lg:items-start lg:gap-12 lg:pb-8 lg:pt-5">
        <div class="hero-copy">
          <div class="home-eyebrow mb-6 inline-flex max-w-full items-center gap-2 rounded-md border px-3 py-1.5 font-medium">
            <span class="home-eyebrow-icon flex h-4 w-4 items-center justify-center rounded">
              <Icon name="shield" size="xs" :stroke-width="2.2" />
            </span>
            <span class="truncate">专为出海业务打造的全球路由中转平台</span>
          </div>

          <h1 class="home-title max-w-[580px] font-extrabold tracking-tight">
            面向出海业务的
            <span class="block">{{ siteName }}</span>
          </h1>

          <p class="home-body mt-5 max-w-[540px]">
            面向出海业务的全球路由中转平台，低延迟转发，Token 安全隔离，智能路由与故障自动切换，全链路状态监控，助力业务稳定出海。
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <router-link
              :to="isAuthenticated ? dashboardPath : '/login'"
              class="home-button home-button-primary home-button-lg inline-flex h-12 items-center justify-center gap-3 rounded-md px-7 font-semibold shadow-lg transition hover:-translate-y-0.5"
            >
              开始接入
              <Icon name="arrowRight" size="sm" :stroke-width="2.4" />
            </router-link>
            <a
              :href="docHref"
              :target="docUrl ? '_blank' : undefined"
              :rel="docUrl ? 'noopener noreferrer' : undefined"
              class="home-button home-button-secondary home-button-lg inline-flex h-12 items-center justify-center gap-2 rounded-md border px-7 font-semibold shadow-sm transition hover:-translate-y-0.5"
            >
              <Icon name="document" size="sm" :stroke-width="2" />
              查看文档
            </a>
          </div>

          <div class="home-proof-list mt-8 flex flex-wrap gap-x-4 gap-y-2 font-medium">
            <span v-for="item in proofItems" :key="item" class="inline-flex items-center gap-1.5">
              <Icon name="checkCircle" size="xs" class="home-check-icon" :stroke-width="2" />
              {{ item }}
            </span>
          </div>
        </div>

        <div id="status" class="status-stage min-w-0">
          <div class="globe-container">
            <GlobeScene :dark="isDark" />
          </div>
        </div>
      </section>

      <section id="features" class="home-feature-section border-y">
        <div class="home-feature-grid mx-auto grid max-w-[1780px] px-5 sm:px-8 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="feature in features" :key="feature.title" class="feature-item py-7 md:px-8">
            <div class="feature-icon">
              <Icon :name="feature.icon" size="lg" :stroke-width="1.85" />
            </div>
            <div>
              <h2 class="home-feature-title font-bold">{{ feature.title }}</h2>
              <p class="home-feature-copy mt-2 max-w-[380px]">
                {{ feature.description }}
              </p>
              <a href="#support" class="home-feature-link mt-4 inline-flex items-center gap-1.5 font-semibold">
                了解更多
                <Icon name="arrowRight" size="xs" :stroke-width="2.4" />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="trust" class="home-trust-section px-5 py-6 sm:px-8">
        <div class="mx-auto max-w-[1260px] text-center">
          <h2 class="home-section-title font-bold tracking-tight">被开发者信任的基础设施</h2>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div v-for="item in trustItems" :key="item" class="trust-pill">
              <Icon name="check" size="sm" :stroke-width="2.4" />
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="support" class="home-support-section px-5 py-8 sm:px-8">
        <div class="home-support-card mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-5 rounded-md border px-5 py-6 md:flex-row md:items-center">
          <div>
            <h2 class="home-section-title font-bold">用一条稳定 API 管住多模型、多账号、多地区流量</h2>
            <p class="home-support-copy mt-1.5">
              适合需要海外模型接入、账号池治理、费用控制和高可用转发的团队先行用户测试。
            </p>
          </div>
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="home-button home-button-primary home-button-compact inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md px-5 font-semibold transition"
          >
            进入控制台
            <Icon name="arrowRight" size="sm" :stroke-width="2.2" />
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore, useAppStore } from '@/stores'
import { normalizeDisplaySiteName } from '@/stores/app'
import Icon from '@/components/icons/Icon.vue'
import GlobeScene from '@/components/home/GlobeScene.vue'

const authStore = useAuthStore()
const appStore = useAppStore()

// Theme
const isDark = ref(true)

function initTheme() {
  const saved = localStorage.getItem('landing-theme')
  if (saved === 'light') {
    isDark.value = false
  } else if (saved === 'dark') {
    isDark.value = true
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('landing-theme', isDark.value ? 'dark' : 'light')
}

const siteName = computed(() => normalizeDisplaySiteName(appStore.siteName))
const docUrl = computed(() => appStore.cachedPublicSettings?.doc_url || appStore.docUrl || '')
const docHref = computed(() => docUrl.value || '#features')
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')

const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const dashboardPath = computed(() => (isAdmin.value ? '/admin/dashboard' : '/dashboard'))

const proofItems = ['全球路由加速', 'Token 安全隔离', '99.99% 可用性保障', '实时状态监控'] as const

const features = [
  {
    icon: 'globe',
    title: '全球智能路由',
    description: '覆盖全球优质节点，智能选择最优路径，自动避开拥塞与故障，保障出海业务低延迟、高可用。'
  },
  {
    icon: 'bolt',
    title: '低延迟转发',
    description: '全球骨干网络加速，协议优化与连接复用，显著降低延迟，提升模型调用体验。'
  },
  {
    icon: 'lock',
    title: 'Token 安全隔离',
    description: '多租户隔离，最小权限访问与加密存储，从源头保护 Token 安全，防止泄露与滥用。'
  },
  {
    icon: 'chart',
    title: '实时状态监控',
    description: '全链路状态、延迟、成功率与流量实时监控，异常告警与自动切换，保障业务稳定。'
  }
] as const

const trustItems = ['企业级安全合规', '多活容灾架构', '99.99% 可用性保障', '分线路故障切换', '完善的审计日志'] as const

onMounted(() => {
  initTheme()
  authStore.checkAuth()

  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>

<style scoped>
/*
 * /home page design spec
 * Theme color: #3E55E9. Keep page-only typography, color, radius,
 * shadow, and interaction tokens here before adding one-off styles below.
 */
.landing-page {
  --home-brand: #3e55e9;
  --home-brand-hover: #2f43c9;
  --home-brand-strong: #2438b8;
  --home-brand-mid: #667dff;
  --home-brand-label: #8ea0ff;
  --home-brand-label-hover: #aab7ff;
  --home-brand-ink: #e9ecff;
  --home-brand-soft: #f3f5ff;
  --home-brand-border: #c8d1ff;
  --home-brand-divider: #dde4ff;
  --home-cyan: #38bdf8;
  --home-radius-control: 6px;
  --home-type-brand: 18px;
  --home-type-brand-wide: 20px;
  --home-type-nav: 14px;
  --home-type-eyebrow: 12px;
  --home-type-hero: clamp(32px, 3.6vw, 52px);
  --home-leading-hero: 1.15;
  --home-type-body: 15px;
  --home-type-body-wide: 16px;
  --home-leading-body: 28px;
  --home-type-button: 14px;
  --home-type-button-lg: 15px;
  --home-type-section-title: 18px;
  --home-type-feature-title: 16px;
  --home-type-caption: 13px;
  --home-type-micro: 12px;
  --home-motion-fast: 160ms ease;
  --home-motion-standard: 180ms ease;
  min-height: 100vh;
  color: var(--home-text-strong);
  background:
    linear-gradient(180deg, var(--home-page-bg-start) 0%, var(--home-page-bg-mid) 48%, var(--home-page-bg-end) 100%),
    linear-gradient(126deg, var(--home-page-glow-brand) 0%, transparent 36%, var(--home-page-glow-cyan) 78%, transparent 100%);
  background-size: auto, auto;
}

.landing-page.is-dark {
  --home-page-bg-start: rgba(2, 6, 23, 1);
  --home-page-bg-mid: rgba(12, 18, 54, 0.98);
  --home-page-bg-end: rgba(2, 6, 23, 1);
  --home-page-glow-brand: rgba(62, 85, 233, 0.2);
  --home-page-glow-cyan: rgba(14, 165, 233, 0.1);
  --home-text-strong: #f8faff;
  --home-text-body: #aeb6d2;
  --home-text-muted: #c6ccdc;
  --home-text-soft: #9099b5;
  --home-header-bg: rgba(2, 6, 23, 0.92);
  --home-header-border: rgba(142, 160, 255, 0.2);
  --home-control-bg: rgba(255, 255, 255, 0.05);
  --home-control-border: rgba(255, 255, 255, 0.15);
  --home-control-text: #c6ccdc;
  --home-control-hover: #f8faff;
  --home-accent: var(--home-brand-label);
  --home-accent-hover: var(--home-brand-ink);
  --home-accent-contrast: #0f172a;
  --home-accent-text: var(--home-brand-ink);
  --home-accent-surface: rgba(62, 85, 233, 0.1);
  --home-accent-surface-hover: rgba(62, 85, 233, 0.2);
  --home-accent-border: rgba(142, 160, 255, 0.25);
  --home-button-primary-bg: var(--home-brand-label);
  --home-button-primary-text: #0f172a;
  --home-button-primary-hover: var(--home-brand-label-hover);
  --home-button-primary-shadow: 0 12px 28px rgba(62, 85, 233, 0.35);
  --home-button-secondary-bg: rgba(62, 85, 233, 0.1);
  --home-button-secondary-border: rgba(142, 160, 255, 0.3);
  --home-button-secondary-text: var(--home-brand-soft);
  --home-button-secondary-hover: rgba(62, 85, 233, 0.2);
  --home-feature-bg: rgba(15, 23, 42, 0.7);
  --home-feature-border: rgba(142, 160, 255, 0.15);
  --home-trust-bg: #020617;
  --home-support-bg: #020617;
  --home-support-card-bg: rgba(62, 85, 233, 0.1);
  --home-pill-text: var(--home-brand-ink);
  --home-pill-bg: rgba(62, 85, 233, 0.1);
  --home-pill-border: rgba(142, 160, 255, 0.24);
  --home-brand-mark-bg: linear-gradient(135deg, var(--home-brand-label) 0%, var(--home-brand) 100%);
  --home-brand-mark-shadow: 0 0 24px rgba(62, 85, 233, 0.38);
  --home-brand-mark-cutout: #10133f;
  --home-status-dot-shadow: 0 0 12px rgba(62, 85, 233, 0.75);
  --home-globe-glow:
    radial-gradient(circle at 36% 28%, rgba(62, 85, 233, 0.22), transparent 44%),
    radial-gradient(circle at 74% 54%, rgba(14, 165, 233, 0.12), transparent 50%);
  --home-globe-glow-opacity: 0.62;
}

.landing-page.is-light {
  --home-page-bg-start: rgba(243, 245, 255, 1);
  --home-page-bg-mid: rgba(248, 250, 252, 0.96);
  --home-page-bg-end: rgba(255, 255, 255, 1);
  --home-page-glow-brand: rgba(62, 85, 233, 0.11);
  --home-page-glow-cyan: rgba(56, 189, 248, 0.07);
  --home-text-strong: #15172b;
  --home-text-body: #596074;
  --home-text-muted: #5f6678;
  --home-text-soft: #737b8f;
  --home-header-bg: rgba(243, 245, 255, 0.9);
  --home-header-border: rgba(62, 85, 233, 0.2);
  --home-control-bg: rgba(255, 255, 255, 0.7);
  --home-control-border: #d6d9e4;
  --home-control-text: #6b7280;
  --home-control-hover: #15172b;
  --home-accent: var(--home-brand);
  --home-accent-hover: var(--home-brand-strong);
  --home-accent-contrast: #f8faff;
  --home-accent-text: var(--home-brand-strong);
  --home-accent-surface: rgba(255, 255, 255, 0.8);
  --home-accent-surface-hover: var(--home-brand-soft);
  --home-accent-border: var(--home-brand-border);
  --home-button-primary-bg: var(--home-brand);
  --home-button-primary-text: #f8faff;
  --home-button-primary-hover: var(--home-brand-hover);
  --home-button-primary-shadow: 0 12px 28px rgba(62, 85, 233, 0.25);
  --home-button-secondary-bg: #ffffff;
  --home-button-secondary-border: var(--home-brand-border);
  --home-button-secondary-text: var(--home-brand-strong);
  --home-button-secondary-hover: var(--home-brand-soft);
  --home-feature-bg: rgba(255, 255, 255, 0.8);
  --home-feature-border: var(--home-brand-divider);
  --home-trust-bg: rgba(243, 245, 255, 0.7);
  --home-support-bg: #ffffff;
  --home-support-card-bg: rgba(243, 245, 255, 0.75);
  --home-pill-text: var(--home-brand-strong);
  --home-pill-bg: rgba(255, 255, 255, 0.86);
  --home-pill-border: rgba(200, 209, 255, 0.95);
  --home-brand-mark-bg: linear-gradient(135deg, var(--home-brand-mid) 0%, var(--home-brand) 100%);
  --home-brand-mark-shadow: 0 8px 20px rgba(62, 85, 233, 0.24);
  --home-brand-mark-cutout: var(--home-brand-soft);
  --home-status-dot-shadow: 0 0 12px rgba(62, 85, 233, 0.75);
  --home-globe-glow:
    radial-gradient(circle at 38% 30%, rgba(62, 85, 233, 0.11), transparent 42%),
    radial-gradient(circle at 72% 52%, rgba(56, 189, 248, 0.07), transparent 48%);
  --home-globe-glow-opacity: 0.74;
}

.home-header {
  background: var(--home-header-bg);
  border-color: var(--home-header-border);
}

.home-brand-name {
  font-size: var(--home-type-brand);
  color: var(--home-text-strong);
}

.home-nav,
.home-header-link {
  font-size: var(--home-type-nav);
  color: var(--home-text-muted);
}

.home-header-link:hover,
.nav-link:hover {
  color: var(--home-control-hover);
}

.home-status-badge {
  font-size: var(--home-type-eyebrow);
  color: var(--home-accent-text);
  background: var(--home-accent-surface);
  border-color: var(--home-accent-border);
}

.home-status-dot {
  background: var(--home-accent);
  box-shadow: var(--home-status-dot-shadow);
}

.home-icon-button {
  color: var(--home-control-text);
  background: var(--home-control-bg);
  border-color: var(--home-control-border);
  border-radius: var(--home-radius-control);
}

.home-icon-button:hover {
  color: var(--home-control-hover);
}

.home-eyebrow {
  font-size: var(--home-type-eyebrow);
  color: var(--home-text-muted);
  background: var(--home-control-bg);
  border-color: var(--home-control-border);
  border-radius: var(--home-radius-control);
}

.home-eyebrow-icon {
  color: var(--home-accent-contrast);
  background: var(--home-accent);
  border-radius: calc(var(--home-radius-control) - 2px);
}

.home-title {
  font-size: var(--home-type-hero);
  line-height: var(--home-leading-hero);
  color: var(--home-text-strong);
}

.home-body {
  font-size: var(--home-type-body);
  line-height: var(--home-leading-body);
  color: var(--home-text-body);
}

.home-button {
  font-size: var(--home-type-button);
  line-height: 1;
  border-radius: var(--home-radius-control);
}

.home-button-lg {
  font-size: var(--home-type-button-lg);
}

.home-button-primary {
  color: var(--home-button-primary-text);
  background: var(--home-button-primary-bg);
  box-shadow: var(--home-button-primary-shadow);
}

.home-button-primary:hover {
  background: var(--home-button-primary-hover);
}

.home-button-secondary {
  color: var(--home-button-secondary-text);
  background: var(--home-button-secondary-bg);
  border-color: var(--home-button-secondary-border);
}

.home-button-secondary:hover {
  background: var(--home-button-secondary-hover);
}

.home-proof-list {
  font-size: var(--home-type-eyebrow);
  color: var(--home-text-soft);
}

.home-check-icon {
  color: var(--home-accent);
}

.home-feature-section {
  background: var(--home-feature-bg);
  border-color: var(--home-feature-border);
}

.home-feature-grid > .feature-item + .feature-item {
  border-top: 1px solid var(--home-feature-border);
}

.home-feature-grid > .feature-item {
  border-left: 0;
}

.home-feature-title {
  font-size: var(--home-type-feature-title);
  color: var(--home-text-strong);
}

.home-feature-copy {
  font-size: var(--home-type-caption);
  line-height: 24px;
  color: var(--home-text-body);
}

.home-feature-link {
  font-size: var(--home-type-eyebrow);
  color: var(--home-accent);
}

.home-feature-link:hover {
  color: var(--home-accent-hover);
}

.home-trust-section {
  background: var(--home-trust-bg);
}

.home-section-title {
  font-size: var(--home-type-section-title);
  color: var(--home-text-strong);
}

.home-support-section {
  background: var(--home-support-bg);
}

.home-support-card {
  background: var(--home-support-card-bg);
  border-color: var(--home-accent-border);
  border-radius: var(--home-radius-control);
}

.home-support-copy {
  font-size: var(--home-type-nav);
  line-height: 24px;
  color: var(--home-text-body);
}

.nav-link {
  position: relative;
  transition: color var(--home-motion-fast);
}

.nav-link::after {
  position: absolute;
  right: 0;
  bottom: -8px;
  left: 0;
  height: 2px;
  content: '';
  opacity: 0;
  transform: scaleX(0.72);
  transition:
    opacity var(--home-motion-fast),
    transform var(--home-motion-fast);
}

.nav-link::after { background: var(--home-accent); }

.nav-link:hover::after {
  opacity: 1;
  transform: scaleX(1);
}

.brand-mark {
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: var(--home-radius-control);
  box-shadow: var(--home-brand-mark-shadow);
}

.hero-copy {
  padding-block: clamp(20px, 4vw, 68px);
}

.status-stage {
  perspective: 1400px;
}

.globe-container {
  position: relative;
  min-height: clamp(400px, 36vw, 580px);
  overflow: hidden;
  transform: translateZ(0);
}

.globe-container::before {
  position: absolute;
  inset: -18% -12% -14%;
  content: '';
  background: var(--home-globe-glow);
  filter: blur(42px);
  opacity: var(--home-globe-glow-opacity);
  -webkit-mask-image: radial-gradient(circle at center, #000 0%, #000 42%, transparent 74%);
  mask-image: radial-gradient(circle at center, #000 0%, #000 42%, transparent 74%);
  pointer-events: none;
}

.feature-item {
  display: flex;
  gap: 20px;
  min-height: 160px;
}

.feature-icon {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-start;
  justify-content: center;
  width: 56px;
  padding-top: 2px;
}

.feature-icon { color: var(--home-accent); }

.trust-pill {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: var(--home-type-caption);
  color: var(--home-pill-text);
  background: var(--home-pill-bg);
  border: 1px solid var(--home-pill-border);
  border-radius: var(--home-radius-control);
}

.trust-pill svg {
  color: var(--home-accent);
}

@media (min-width: 640px) {
  .home-brand-name {
    font-size: var(--home-type-brand-wide);
  }

  .home-body {
    font-size: var(--home-type-body-wide);
  }
}

@media (min-width: 768px) {
  .home-feature-grid > .feature-item:nth-child(n) {
    border-top: 0;
    border-left: 0;
  }

  .home-feature-grid > .feature-item:nth-child(even) {
    border-left: 1px solid var(--home-feature-border);
  }

  .home-feature-grid > .feature-item:nth-child(n + 3) {
    border-top: 1px solid var(--home-feature-border);
  }
}

@media (min-width: 1280px) {
  .home-feature-grid > .feature-item:nth-child(n) {
    border-top: 0;
  }

  .home-feature-grid > .feature-item + .feature-item {
    border-left: 1px solid var(--home-feature-border);
  }
}

@media (max-width: 760px) {
  .globe-container {
    min-height: 360px;
  }

  .feature-item {
    min-height: 0;
    padding-inline: 0;
  }

  .feature-icon {
    width: 40px;
  }
}

@media (max-width: 560px) {
  .globe-container {
    min-height: 300px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
  }
}
</style>
