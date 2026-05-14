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

  <div v-else class="landing-page min-h-screen" :class="isDark ? 'is-dark bg-neutral-950 text-white' : 'is-light bg-neutral-50 text-neutral-950'">
    <header class="sticky top-0 z-40 border-b backdrop-blur-xl" :class="isDark ? 'border-white/10 bg-neutral-950/92' : 'border-neutral-200 bg-neutral-50/92'">
      <nav class="mx-auto flex h-16 max-w-[1780px] items-center justify-between px-5 sm:px-8">
        <router-link to="/home" class="flex min-w-0 items-center gap-3" aria-label="AI API Studio">
          <span class="brand-mark" aria-hidden="true">
            <span></span>
          </span>
          <span class="truncate text-[18px] font-bold tracking-tight sm:text-[20px]" :class="isDark ? 'text-white' : 'text-neutral-950'">
            {{ siteName }}
          </span>
        </router-link>

        <div class="hidden items-center gap-8 text-[14px] font-medium lg:flex" :class="isDark ? 'text-neutral-300' : 'text-neutral-600'">
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
            class="hidden h-9 items-center gap-2.5 rounded-md border px-3 text-xs font-medium md:inline-flex"
            :class="isDark ? 'border-white/15 bg-white/5 text-neutral-300' : 'border-neutral-300 bg-white/70 text-neutral-500'"
            type="button"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            全部服务正常
          </button>
          <button
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border transition"
            :class="isDark ? 'border-white/15 bg-white/5 text-neutral-300 hover:text-white' : 'border-neutral-300 bg-white/70 text-neutral-500 hover:text-neutral-900'"
            type="button"
            :aria-label="isDark ? '切换亮色模式' : '切换暗色模式'"
            @click="toggleTheme"
          >
            <Icon :name="isDark ? 'sun' : 'moon'" size="sm" :stroke-width="2" />
          </button>
          <router-link
            v-if="isAuthenticated"
            :to="dashboardPath"
            class="hidden h-9 items-center rounded-md px-3 text-[14px] font-medium transition sm:inline-flex"
            :class="isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'"
          >
            控制台
          </router-link>
          <router-link
            v-else
            to="/login"
            class="hidden h-9 items-center rounded-md px-3 text-[14px] font-medium transition sm:inline-flex"
            :class="isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'"
          >
            登录
          </router-link>
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-[14px] font-medium shadow-md transition"
            :class="isDark ? 'bg-white text-neutral-950 shadow-white/10 hover:bg-neutral-200' : 'bg-neutral-950 text-white shadow-neutral-950/20 hover:bg-neutral-800'"
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
          <div class="mb-6 inline-flex max-w-full items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium" :class="isDark ? 'border-white/20 bg-white/5 text-neutral-300' : 'border-neutral-300 bg-white text-neutral-600'">
            <span class="flex h-4 w-4 items-center justify-center rounded" :class="isDark ? 'bg-white text-neutral-950' : 'bg-neutral-950 text-white'">
              <Icon name="shield" size="xs" :stroke-width="2.2" />
            </span>
            <span class="truncate">专为出海业务打造的全球路由中转平台</span>
          </div>

          <h1 class="max-w-[580px] text-[clamp(32px,3.6vw,52px)] font-extrabold leading-[1.15] tracking-tight" :class="isDark ? 'text-white' : 'text-neutral-950'">
            面向出海业务的
            <span class="block">{{ siteName }}</span>
          </h1>

          <p class="mt-5 max-w-[540px] text-[15px] leading-7 sm:text-[16px]" :class="isDark ? 'text-neutral-400' : 'text-neutral-500'">
            面向出海业务的全球路由中转平台，低延迟转发，Token 安全隔离，智能路由与故障自动切换，全链路状态监控，助力业务稳定出海。
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <router-link
              :to="isAuthenticated ? dashboardPath : '/login'"
              class="inline-flex h-12 items-center justify-center gap-3 rounded-md px-7 text-[15px] font-semibold shadow-lg transition hover:-translate-y-0.5"
              :class="isDark ? 'bg-white text-neutral-950 shadow-white/10 hover:bg-neutral-200' : 'bg-neutral-950 text-white shadow-neutral-950/20 hover:bg-neutral-800'"
            >
              开始接入
              <Icon name="arrowRight" size="sm" :stroke-width="2.4" />
            </router-link>
            <a
              :href="docHref"
              :target="docUrl ? '_blank' : undefined"
              :rel="docUrl ? 'noopener noreferrer' : undefined"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-md border px-7 text-[15px] font-semibold shadow-sm transition hover:-translate-y-0.5"
              :class="isDark ? 'border-white/20 bg-transparent text-white hover:bg-white/10' : 'border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100'"
            >
              <Icon name="document" size="sm" :stroke-width="2" />
              查看文档
            </a>
          </div>

          <div class="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium" :class="isDark ? 'text-neutral-400' : 'text-neutral-500'">
            <span v-for="item in proofItems" :key="item" class="inline-flex items-center gap-1.5">
              <Icon name="checkCircle" size="xs" :class="isDark ? 'text-white' : 'text-neutral-950'" :stroke-width="2" />
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

      <section id="features" class="border-y" :class="isDark ? 'border-white/10 bg-neutral-900/60' : 'border-neutral-200 bg-white/72'">
        <div class="mx-auto grid max-w-[1780px] px-5 sm:px-8 md:grid-cols-2 xl:grid-cols-4" :class="isDark ? 'divide-y divide-white/10 md:divide-x md:divide-y-0' : 'divide-y divide-neutral-200 md:divide-x md:divide-y-0'">
          <article v-for="feature in features" :key="feature.title" class="feature-item py-7 md:px-8">
            <div class="feature-icon">
              <Icon :name="feature.icon" size="lg" :stroke-width="1.85" />
            </div>
            <div>
              <h2 class="text-[16px] font-bold" :class="isDark ? 'text-white' : 'text-neutral-950'">{{ feature.title }}</h2>
              <p class="mt-2 max-w-[380px] text-[13px] leading-6" :class="isDark ? 'text-neutral-400' : 'text-neutral-500'">
                {{ feature.description }}
              </p>
              <a href="#support" class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold" :class="isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'">
                了解更多
                <Icon name="arrowRight" size="xs" :stroke-width="2.4" />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="trust" class="px-5 py-6 sm:px-8" :class="isDark ? 'bg-neutral-950' : 'bg-neutral-100'">
        <div class="mx-auto max-w-[1260px] text-center">
          <h2 class="text-lg font-bold tracking-tight" :class="isDark ? 'text-white' : 'text-neutral-950'">被开发者信任的基础设施</h2>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div v-for="item in trustItems" :key="item" class="trust-pill">
              <Icon name="check" size="sm" :stroke-width="2.4" />
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="support" class="px-5 py-8 sm:px-8" :class="isDark ? 'bg-neutral-950' : 'bg-white'">
        <div class="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-5 rounded-md border px-5 py-6 md:flex-row md:items-center" :class="isDark ? 'border-white/15 bg-white/5' : 'border-neutral-200 bg-neutral-50'">
          <div>
            <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-neutral-950'">用一条稳定 API 管住多模型、多账号、多地区流量</h2>
            <p class="mt-1.5 text-sm leading-6" :class="isDark ? 'text-neutral-400' : 'text-neutral-500'">
              适合需要海外模型接入、账号池治理、费用控制和高可用转发的团队先行用户测试。
            </p>
          </div>
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md px-5 text-sm font-semibold transition"
            :class="isDark ? 'bg-white text-neutral-950 hover:bg-neutral-200' : 'bg-neutral-950 text-white hover:bg-neutral-800'"
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

const siteName = computed(() => appStore.cachedPublicSettings?.site_name || appStore.siteName || 'AI API Studio')
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
/* ===== Dark theme ===== */
.landing-page.is-dark {
  background:
    linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(23, 23, 23, 0.95) 48%, rgba(10, 10, 10, 1) 100%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: auto, 72px 72px, 72px 72px;
}

/* ===== Light theme ===== */
.landing-page.is-light {
  background:
    linear-gradient(180deg, rgba(250, 250, 250, 1) 0%, rgba(245, 245, 245, 0.95) 48%, rgba(250, 250, 250, 1) 100%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(0deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  background-size: auto, 72px 72px, 72px 72px;
}

.nav-link {
  position: relative;
  transition: color 160ms ease;
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
    opacity 160ms ease,
    transform 160ms ease;
}

.is-dark .nav-link::after { background: #fff; }
.is-light .nav-link::after { background: #0a0a0a; }

.is-dark .nav-link:hover { color: #fff; }
.is-light .nav-link:hover { color: #0a0a0a; }

.nav-link:hover::after {
  opacity: 1;
  transform: scaleX(1);
}

.brand-mark {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  clip-path: polygon(50% 0, 92% 25%, 92% 75%, 50% 100%, 8% 75%, 8% 25%);
}

.is-dark .brand-mark { background: #fff; }
.is-dark .brand-mark span { border-color: #0a0a0a; }
.is-light .brand-mark { background: #0a0a0a; }
.is-light .brand-mark span { border-color: #fafafa; }

.brand-mark span {
  width: 18px;
  height: 14px;
  border-width: 5px;
  border-style: solid;
  transform: rotate(45deg) skew(-10deg, -10deg);
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
}

.is-dark .feature-icon { color: #fff; }
.is-light .feature-icon { color: #0a0a0a; }

.trust-pill {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
}

.is-dark .trust-pill {
  color: #d4d4d4;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.is-dark .trust-pill svg { color: #fff; }

.is-light .trust-pill {
  color: #525252;
  background: #fff;
  border: 1px solid #d4d4d4;
}

.is-light .trust-pill svg { color: #0a0a0a; }

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
  .earth-panel {
    min-height: 650px;
  }

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
