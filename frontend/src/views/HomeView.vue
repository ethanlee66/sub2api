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

  <div v-else class="landing-page min-h-screen bg-[#f7faff] text-slate-950">
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f7faff]/92 backdrop-blur-xl">
      <nav class="mx-auto flex h-20 max-w-[1780px] items-center justify-between px-5 sm:px-8">
        <router-link to="/home" class="flex min-w-0 items-center gap-3" aria-label="AI API Studio">
          <span class="brand-mark" aria-hidden="true">
            <span></span>
          </span>
          <span class="truncate text-[22px] font-extrabold tracking-normal text-slate-950 sm:text-[26px]">
            {{ siteName }}
          </span>
        </router-link>

        <div class="hidden items-center gap-12 text-[16px] font-semibold text-slate-900 lg:flex">
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
            class="hidden h-10 items-center gap-3 rounded-lg border border-slate-200 bg-white/70 px-4 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/40 md:inline-flex"
            type="button"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
            全部服务正常
          </button>
          <router-link
            v-if="isAuthenticated"
            :to="dashboardPath"
            class="hidden h-10 items-center rounded-lg px-4 text-[16px] font-semibold text-slate-900 transition hover:text-blue-700 sm:inline-flex"
          >
            控制台
          </router-link>
          <router-link
            v-else
            to="/login"
            class="hidden h-10 items-center rounded-lg px-4 text-[16px] font-semibold text-slate-900 transition hover:text-blue-700 sm:inline-flex"
          >
            登录
          </router-link>
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="inline-flex h-12 items-center gap-2 rounded-lg bg-blue-700 px-5 text-[16px] font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
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
          <div class="mb-8 inline-flex max-w-full items-center gap-2 rounded-lg border border-blue-600/60 bg-white px-3.5 py-2 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-100">
            <span class="flex h-5 w-5 items-center justify-center rounded-md bg-blue-700 text-white">
              <Icon name="shield" size="xs" :stroke-width="2.2" />
            </span>
            <span class="truncate">专为出海业务打造的全球路由中转平台</span>
          </div>

          <h1 class="max-w-[620px] text-[clamp(42px,4.8vw,70px)] font-black leading-[1.1] tracking-normal text-slate-950">
            面向出海业务的
            <span class="block">{{ siteName }}</span>
          </h1>

          <p class="mt-8 max-w-[620px] text-[18px] leading-9 text-slate-700 sm:text-[21px]">
            面向出海业务的全球路由中转平台，低延迟转发，Token 安全隔离，智能路由与故障自动切换，全链路状态监控，助力业务稳定出海。
          </p>

          <div class="mt-10 flex flex-col gap-4 sm:flex-row">
            <router-link
              :to="isAuthenticated ? dashboardPath : '/login'"
              class="inline-flex h-16 items-center justify-center gap-4 rounded-lg bg-blue-700 px-9 text-[20px] font-bold text-white shadow-xl shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              开始接入
              <Icon name="arrowRight" size="md" :stroke-width="2.4" />
            </router-link>
            <a
              :href="docHref"
              :target="docUrl ? '_blank' : undefined"
              :rel="docUrl ? 'noopener noreferrer' : undefined"
              class="inline-flex h-16 items-center justify-center gap-3 rounded-lg border border-blue-600 bg-white px-9 text-[20px] font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Icon name="document" size="md" :stroke-width="2" />
              查看文档
            </a>
          </div>

          <div class="mt-11 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-slate-600">
            <span v-for="item in proofItems" :key="item" class="inline-flex items-center gap-2">
              <Icon name="checkCircle" size="sm" class="text-blue-700" :stroke-width="2" />
              {{ item }}
            </span>
          </div>
        </div>

        <div id="status" class="status-stage min-w-0">
          <div class="earth-panel">
            <GlobeScene />

            <div class="metrics-panel">
              <div class="mb-5 flex items-center justify-between">
                <h2 class="text-[17px] font-bold text-white">路由实时状态</h2>
                <span class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
                  <span class="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]"></span>
                  运行中
                </span>
              </div>

              <div class="grid grid-cols-3 gap-4 border-b border-white/10 pb-5">
                <div v-for="metric in metrics" :key="metric.label">
                  <div class="text-xs text-slate-300">{{ metric.label }}</div>
                  <div class="mt-1 text-[18px] font-bold text-white">{{ metric.value }}</div>
                  <div class="text-xs font-semibold text-emerald-300">{{ metric.delta }}</div>
                </div>
              </div>

              <div class="pt-4">
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-bold text-white">路由流量趋势（每分钟）</span>
                  <span class="flex items-center gap-3 text-xs text-slate-300">
                    <span class="inline-flex items-center gap-1"><span class="h-0.5 w-5 bg-blue-400"></span>请求量</span>
                    <span class="inline-flex items-center gap-1"><span class="h-0.5 w-5 bg-emerald-400"></span>成功率</span>
                  </span>
                </div>
                <svg class="h-[98px] w-full" viewBox="0 0 260 98" role="img" aria-label="路由流量趋势图">
                  <g class="chart-grid">
                    <path d="M0 18H260M0 50H260M0 82H260" />
                  </g>
                  <path class="traffic-line" d="M3 57L22 31L43 62L63 34L84 48L105 22L126 54L147 29L168 45L189 20L210 43L231 24L257 27" />
                  <path class="success-line" d="M3 76L22 62L43 70L63 53L84 64L105 45L126 58L147 43L168 54L189 39L210 48L231 31L257 35" />
                </svg>
              </div>
            </div>

            <div class="events-panel">
              <div class="mb-5 flex items-center justify-between">
                <h3 class="text-[15px] font-bold text-white">路由事件</h3>
                <a href="#features" class="text-sm font-semibold text-blue-300">查看全部</a>
              </div>
              <div class="space-y-3">
                <div v-for="event in routeEvents" :key="event.time + event.target" class="flex items-center gap-3 text-sm">
                  <span class="h-2.5 w-2.5 rounded-full" :class="event.warn ? 'bg-amber-400' : 'bg-emerald-400'"></span>
                  <span class="w-11 text-slate-200">{{ event.time }}</span>
                  <span class="min-w-0 flex-1 truncate text-slate-100">{{ event.target }}</span>
                  <span
                    class="rounded px-2 py-0.5 text-xs font-bold"
                    :class="event.warn ? 'bg-amber-400/20 text-amber-200' : 'bg-emerald-400/20 text-emerald-200'"
                  >
                    {{ event.warn ? '切换' : '正常' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="timeline">
              <span>18:00:00</span>
              <div class="timeline-track">
                <span></span>
              </div>
              <span>18:00</span>
              <span class="ml-auto inline-flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                LIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="border-y border-slate-200/80 bg-white/72">
        <div class="mx-auto grid max-w-[1780px] divide-y divide-slate-200 px-5 sm:px-8 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
          <article v-for="feature in features" :key="feature.title" class="feature-item py-9 md:px-10">
            <div class="feature-icon">
              <Icon :name="feature.icon" size="xl" :stroke-width="1.85" />
            </div>
            <div>
              <h2 class="text-[22px] font-extrabold text-slate-950">{{ feature.title }}</h2>
              <p class="mt-3 max-w-[380px] text-[14px] leading-7 text-slate-600">
                {{ feature.description }}
              </p>
              <a href="#support" class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                了解更多
                <Icon name="arrowRight" size="xs" :stroke-width="2.4" />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="trust" class="bg-[#f8fbff] px-5 py-6 sm:px-8">
        <div class="mx-auto max-w-[1260px] text-center">
          <h2 class="text-2xl font-extrabold tracking-normal text-slate-950">被开发者信任的基础设施</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div v-for="item in trustItems" :key="item" class="trust-pill">
              <Icon name="check" size="sm" :stroke-width="2.4" />
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="support" class="bg-white px-5 py-10 sm:px-8">
        <div class="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-6 rounded-lg border border-slate-200 bg-slate-50 px-6 py-7 md:flex-row md:items-center">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-950">用一条稳定 API 管住多模型、多账号、多地区流量</h2>
            <p class="mt-2 text-base leading-7 text-slate-600">
              适合需要海外模型接入、账号池治理、费用控制和高可用转发的团队先行用户测试。
            </p>
          </div>
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-slate-950 px-6 text-base font-bold text-white transition hover:bg-blue-800"
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
import { computed, onMounted } from 'vue'
import { useAuthStore, useAppStore } from '@/stores'
import Icon from '@/components/icons/Icon.vue'
import GlobeScene from '@/components/home/GlobeScene.vue'

const authStore = useAuthStore()
const appStore = useAppStore()

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

const metrics = [
  { label: '平均延迟', value: '68 ms', delta: '↓ 12%' },
  { label: '成功率', value: '99.98%', delta: '↑ 0.03%' },
  { label: '请求量 / 分钟', value: '128,456', delta: '↑ 8.6%' }
] as const

type RouteEvent = {
  time: string
  target: string
  warn?: boolean
}

const routeEvents: readonly RouteEvent[] = [
  { time: '18:00', target: '汕头 → 新加坡 路由正常' },
  { time: '18:00', target: '汕头 → 日本 路由正常' },
  { time: '17:59', target: '汕头 → 美国 路由切换', warn: true },
  { time: '17:59', target: '汕头 → 韩国 路由正常' },
  { time: '17:58', target: '汕头 → 马来西亚 路由正常' }
] as const

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
  authStore.checkAuth()

  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>

<style scoped>
.landing-page {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, rgba(247, 250, 255, 0.95) 48%, rgba(255, 255, 255, 1) 100%),
    linear-gradient(90deg, rgba(29, 78, 216, 0.05) 1px, transparent 1px),
    linear-gradient(0deg, rgba(29, 78, 216, 0.05) 1px, transparent 1px);
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
  background: #1d4ed8;
  opacity: 0;
  transform: scaleX(0.72);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.nav-link:hover {
  color: #1d4ed8;
}

.nav-link:hover::after {
  opacity: 1;
  transform: scaleX(1);
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  background: #1557d8;
  clip-path: polygon(50% 0, 92% 25%, 92% 75%, 50% 100%, 8% 75%, 8% 25%);
}

.brand-mark span {
  width: 22px;
  height: 17px;
  border: 6px solid #fff;
  transform: rotate(45deg) skew(-10deg, -10deg);
}

.hero-copy {
  padding-block: clamp(20px, 4vw, 68px);
}

.status-stage {
  perspective: 1400px;
}

.earth-panel {
  position: relative;
  min-height: clamp(500px, 39.3vw, 640px);
  overflow: hidden;
  color: white;
  background: #020817;
  border: 1px solid rgba(2, 8, 23, 0.18);
  border-radius: 10px;
  box-shadow:
    0 24px 58px rgba(15, 23, 42, 0.22),
    0 1px 0 rgba(255, 255, 255, 0.18) inset;
  transform: translateZ(0);
}

.metrics-panel,
.events-panel {
  position: absolute;
  z-index: 3;
  overflow: hidden;
  background: rgba(4, 15, 31, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 10px;
  box-shadow: 0 18px 48px rgba(2, 8, 23, 0.32);
  backdrop-filter: blur(12px);
}

.metrics-panel {
  top: 18px;
  left: 18px;
  width: min(330px, calc(100% - 36px));
  padding: 18px;
}

.events-panel {
  right: 20px;
  bottom: 104px;
  width: 330px;
  padding: 17px;
}

.chart-grid path {
  stroke: rgba(148, 163, 184, 0.18);
  stroke-width: 1;
}

.traffic-line,
.success-line {
  fill: none;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 2.6;
}

.traffic-line {
  stroke: #38bdf8;
}

.success-line {
  stroke: #4ade80;
}

.timeline {
  position: absolute;
  right: 18px;
  bottom: 16px;
  left: 18px;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 44px;
  padding: 0 14px;
  font-size: 14px;
  color: #dbeafe;
  background: rgba(4, 15, 31, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
}

.timeline-track {
  position: relative;
  flex: 1;
  height: 4px;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.42);
}

.timeline-track span {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 68%;
  width: 18%;
  background: #60a5fa;
}

.feature-item {
  display: flex;
  gap: 28px;
  min-height: 202px;
}

.feature-icon {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-start;
  justify-content: center;
  width: 76px;
  color: #1557d8;
}

.trust-pill {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 14px;
  color: #334155;
  background: #fff;
  border: 1px solid #dbe7ff;
  border-radius: 8px;
}

.trust-pill svg {
  color: #1d4ed8;
}

@media (max-width: 1240px) {
  .events-panel {
    right: 16px;
    bottom: 96px;
    width: 302px;
  }
}

@media (max-width: 1023px) {
  .earth-panel {
    min-height: 610px;
  }
}

@media (max-width: 760px) {
  .earth-panel {
    min-height: 540px;
  }

  .metrics-panel {
    top: 12px;
    left: 12px;
    padding: 14px;
  }

  .events-panel {
    right: 12px;
    bottom: 82px;
    left: 12px;
    width: auto;
    padding: 14px;
  }

  .timeline {
    right: 12px;
    bottom: 12px;
    left: 12px;
    gap: 8px;
    font-size: 12px;
  }

  .feature-item {
    min-height: 0;
    padding-inline: 0;
  }

  .feature-icon {
    width: 52px;
  }
}

@media (max-width: 560px) {
  .earth-panel {
    min-height: 650px;
  }

  .metrics-panel {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
  }
}
</style>
