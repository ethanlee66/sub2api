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

  <div v-else class="landing-page min-h-screen">
    <header class="home-header sticky top-0 z-40 border-b">
      <nav class="home-nav-shell">
        <router-link to="/home" class="home-brand" :aria-label="landingBrandName">
          <span class="brand-mark" aria-hidden="true">
            <img src="/logo.png" alt="" />
          </span>
          <span class="home-brand-name">{{ landingBrandName }}</span>
        </router-link>

        <div class="home-nav-links">
          <a href="#models" class="nav-link">产品</a>
          <a href="#pricing" class="nav-link">定价</a>
          <a
            :href="docHref"
            :target="docUrl ? '_blank' : undefined"
            :rel="docUrl ? 'noopener noreferrer' : undefined"
            class="nav-link"
          >
            文档
          </a>
          <a href="#status" class="nav-link">状态</a>
          <a href="#faq" class="nav-link">帮助中心</a>
        </div>

        <div class="home-header-actions">
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="home-login-button"
          >
            {{ isAuthenticated ? '控制台' : '登录' }}
          </router-link>
          <a
            :href="docHref"
            :target="docUrl ? '_blank' : undefined"
            :rel="docUrl ? 'noopener noreferrer' : undefined"
            class="home-doc-button"
          >
            查看文档
          </a>
        </div>
      </nav>
    </header>

    <main>
      <section class="hero-section">
        <div class="hero-grid">
          <div class="hero-copy">
            <div class="home-eyebrow">
              <Icon name="shield" size="xs" :stroke-width="2.2" />
              <span>{{ landingBrandName }} 数字港口</span>
            </div>

            <h1 class="home-title">
              <RotatingText
                :texts="heroTitleWords"
                main-class-name="hero-rotating-text"
                split-level-class-name="hero-rotating-segment"
                :rotation-interval="2400"
                :stagger-duration="22"
                split-by="words"
              />
              <span>AI API 中转账本</span>
            </h1>

            <p class="home-body">
              一条 Key 接入 Claude、Codex、DeepSeek、<span class="mobile-soft-break"></span>Gemini 和生图接口；花了多少、为什么扣费，一眼能查。
            </p>

            <div class="hero-actions">
              <router-link
                :to="isAuthenticated ? dashboardPath : '/login'"
                class="home-button home-button-primary"
              >
                开始接入
              </router-link>
              <a
                :href="docHref"
                :target="docUrl ? '_blank' : undefined"
                :rel="docUrl ? 'noopener noreferrer' : undefined"
                class="home-button home-button-secondary"
              >
                查看文档
              </a>
            </div>

            <div class="home-trust-chips" aria-label="trust signals">
              <span v-for="item in trustChips" :key="item.label" class="trust-chip">
                <Icon :name="item.icon" size="sm" :stroke-width="2" />
                {{ item.label }}
              </span>
            </div>
          </div>

          <div class="hero-visual" aria-label="SwatowAPI 数字港口">
            <img :src="heroHarborImage" alt="SwatowAPI 数字港口控制塔" />
            <div class="hero-provider-strip" aria-label="支持的模型与工具">
              <span v-for="provider in heroProviders" :key="provider">{{ provider }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="ledger" class="landing-section ledger-section">
        <div class="section-shell section-grid">
          <div class="section-copy">
            <p class="section-kicker">透明调用账本</p>
            <h2 class="section-title">每一笔调用都看得清</h2>
            <p class="section-lead">
              模型、Token、费用、耗时和状态放在同一条记录里，查问题不用猜。
            </p>
            <div class="ledger-summary">
              <div v-for="metric in ledgerMetrics" :key="metric.label" class="metric-tile">
                <span>{{ metric.label }}</span>
                <strong>{{ metric.value }}</strong>
              </div>
            </div>
          </div>

          <div class="ledger-panel" aria-label="调用账本示例">
            <div class="ledger-toolbar">
              <span>调用账本</span>
              <span>近 24 小时</span>
            </div>
            <div class="ledger-table" role="table">
              <div class="ledger-row ledger-head" role="row">
                <span>时间</span>
                <span>模型</span>
                <span>Token</span>
                <span>费用</span>
                <span>状态</span>
              </div>
              <div v-for="row in ledgerRows" :key="row.trace" class="ledger-row" role="row">
                <span>{{ row.time }}</span>
                <span>
                  <strong>{{ row.model }}</strong>
                  <small>{{ row.channel }}</small>
                </span>
                <span>{{ row.tokens }}</span>
                <span>{{ row.cost }}</span>
                <span class="status-ok">{{ row.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="models" class="landing-section models-section">
        <div class="section-shell">
          <div class="section-heading-row">
            <div>
              <p class="section-kicker">可接入工具</p>
              <h2 class="section-title">先确认你的工具能不能直连</h2>
            </div>
            <p class="section-lead">
              常用 CLI、SDK 和 curl 都有示例。先看能不能接，再决定是否充值。
            </p>
          </div>

          <div class="model-matrix">
            <article v-for="group in modelGroups" :key="group.title" class="matrix-group">
              <div class="matrix-title">
                <Icon :name="group.icon" size="sm" :stroke-width="2" />
                <h3>{{ group.title }}</h3>
              </div>
              <div class="matrix-tags">
                <span v-for="item in group.items" :key="item">{{ item }}</span>
              </div>
              <p>{{ group.note }}</p>
            </article>
          </div>

          <div class="model-checkline" aria-label="接入前核对项">
            <span v-for="item in modelCheckItems" :key="item">
              <Icon name="checkCircle" size="xs" :stroke-width="2" />
              {{ item }}
            </span>
          </div>
        </div>
      </section>

      <section id="pricing" class="landing-section pricing-section">
        <div class="section-shell pricing-grid">
          <div class="pricing-visual">
            <img :src="ledgerHarborImage" alt="SwatowAPI 透明账本港口" />
          </div>

          <div class="section-copy">
            <p class="section-kicker">扣费说明</p>
            <h2 class="section-title">充值前，先知道钱花在哪</h2>
            <p class="section-lead">
              价格会随模型调整。这里先讲清扣费、失败请求和余额核对。
            </p>
          </div>

          <div class="billing-rules billing-rules-overlay">
            <div v-for="rule in billingRules" :key="rule.title" class="billing-rule">
              <Icon :name="rule.icon" size="sm" :stroke-width="2" />
              <div>
                <h3>{{ rule.title }}</h3>
                <p>{{ rule.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="integration" class="landing-section integration-section">
        <div class="section-shell integration-grid">
          <div class="section-copy">
            <p class="section-kicker">快速接入</p>
            <h2 class="section-title">复制配置，先跑通一次</h2>
            <p class="section-lead">
              用最短示例验证 Key、模型和地址，再去控制台看记录。
            </p>
          </div>

          <div class="code-console">
            <div class="integration-tabs" role="tablist" aria-label="接入示例">
              <button
                v-for="tab in integrationTabs"
                :key="tab.id"
                type="button"
                role="tab"
                :aria-selected="activeIntegration === tab.id"
                :class="{ active: activeIntegration === tab.id }"
                @click="activeIntegration = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>

            <div class="code-toolbar">
              <span>{{ activeIntegrationSnippet.title }}</span>
              <button type="button" @click="copyIntegrationSnippet">
                <Icon name="copy" size="sm" :stroke-width="2" />
                {{ copiedSnippet ? '已复制' : '复制' }}
              </button>
            </div>
            <pre><code>{{ activeIntegrationSnippet.code }}</code></pre>
          </div>
        </div>
      </section>

      <section id="status" class="landing-section status-section">
        <div class="section-shell status-grid">
          <div class="section-copy status-copy">
            <p class="section-kicker">状态与边界</p>
            <h2 class="section-title">异常时，知道卡在哪里</h2>
            <p class="section-lead">
              路由、排队和异常记录放在一起。上游变化，也能看到状态。
            </p>
          </div>

          <div class="security-card">
            <img :src="securityBoundaryImage" alt="SwatowAPI 安全边界港口" />
            <div class="status-list status-list-overlay">
              <div v-for="item in statusRows" :key="item.name" class="status-row">
                <span class="status-dot" :class="item.level"></span>
                <span>{{ item.name }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" class="landing-section faq-section">
        <div class="section-shell faq-grid">
          <div class="section-copy">
            <p class="section-kicker">常见问题</p>
            <h2 class="section-title">充值前常问的问题</h2>
            <p class="section-lead">
              到账、扣费、工具支持和异常处理，先给明确答案。
            </p>
            <router-link
              :to="isAuthenticated ? dashboardPath : '/login'"
              class="home-button home-button-primary faq-cta"
            >
              进入控制台
            </router-link>
          </div>

          <div class="faq-list">
            <details v-for="item in faqItems" :key="item.question" class="faq-item">
              <summary>{{ item.question }}</summary>
              <p>{{ item.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <footer class="landing-footer">
        <div class="footer-shell">
          <div class="footer-brand">
            <span class="brand-mark" aria-hidden="true">
              <img src="/logo.png" alt="" />
            </span>
            <div>
              <strong>{{ landingBrandName }}</strong>
              <p>扣费清楚、记录可查的 AI API 入口</p>
            </div>
          </div>

          <div class="footer-links" aria-label="页脚导航">
            <a href="#models">模型与工具</a>
            <a href="#pricing">计费规则</a>
            <a href="#integration">接入文档</a>
            <a href="#status">状态边界</a>
            <a href="#faq">支持入口</a>
          </div>

          <p class="footer-note">
            © {{ currentYear }} {{ landingBrandName }}. 网关负责接入、记录和计费；模型能力以实际渠道状态为准。
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore, useAppStore } from '@/stores'
import { normalizeDisplaySiteName } from '@/stores/app'
import Icon from '@/components/icons/Icon.vue'
import RotatingText from '@/components/home/RotatingText.vue'
import heroHarborImage from '@/assets/landing/swatowapi-hero-harbor-v2.png'
import ledgerHarborImage from '@/assets/landing/swatowapi-ledger-harbor-v2.png'
import securityBoundaryImage from '@/assets/landing/swatowapi-security-boundary-v2.png'

const authStore = useAuthStore()
const appStore = useAppStore()

const siteName = computed(() => normalizeDisplaySiteName(appStore.siteName))
const landingBrandName = computed(() => (siteName.value === 'MyToken' ? 'SwatowAPI' : siteName.value))
const docUrl = computed(() => appStore.cachedPublicSettings?.doc_url || appStore.docUrl || '')
const docHref = computed(() => docUrl.value || '#integration')
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')

const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const dashboardPath = computed(() => (isAdmin.value ? '/admin/dashboard' : '/dashboard'))
const currentYear = new Date().getFullYear()

const heroTitleWords = ['可核验的', '可追溯的', '透明计费的'] as const

const trustChips = [
  { label: '透明计费', icon: 'document' },
  { label: '实时状态', icon: 'chart' },
  { label: 'Token 隔离', icon: 'shield' },
  { label: '异常可追溯', icon: 'search' }
] as const

const heroProviders = ['Claude Code', 'Codex', 'DeepSeek', 'Gemini Flash', 'Image-2'] as const

const ledgerMetrics = [
  { label: 'Token 合计', value: '190.3K' },
  { label: '平均延迟', value: '890ms' },
  { label: '可追溯字段', value: '9 项' }
] as const

const ledgerRows = [
  {
    time: '14:08:12',
    model: 'Claude Sonnet',
    channel: 'route-cn-02',
    tokens: '18.4K',
    cost: '¥0.42',
    status: '已核验',
    trace: 'req_7hx9'
  },
  {
    time: '14:06:40',
    model: 'Codex',
    channel: 'route-sg-01',
    tokens: '8.2K',
    cost: '¥0.19',
    status: '已核验',
    trace: 'req_5mn2'
  },
  {
    time: '14:04:03',
    model: 'Gemini Flash',
    channel: 'route-jp-03',
    tokens: '22.7K',
    cost: '¥0.31',
    status: '已核验',
    trace: 'req_2qa4'
  },
  {
    time: '14:01:27',
    model: 'Image-2',
    channel: 'image-pool',
    tokens: '1 张',
    cost: '¥0.68',
    status: '已核验',
    trace: 'req_8vp1'
  }
] as const

const modelGroups = [
  {
    title: '开发工具',
    icon: 'terminal',
    items: ['Claude Code', 'Codex', 'Gemini CLI', 'curl/API'],
    note: '按示例改地址和 Key。'
  },
  {
    title: '模型入口',
    icon: 'cpu',
    items: ['Claude', 'DeepSeek', 'Gemini', 'OpenAI-compatible'],
    note: '可用情况看渠道状态。'
  },
  {
    title: '协议兼容',
    icon: 'sync',
    items: ['OpenAI SDK', 'Anthropic 兼容', 'Responses 接口', 'Chat 接口'],
    note: '尽量少改现有代码。'
  },
  {
    title: '图像生成',
    icon: 'sparkles',
    items: ['image-2', 'Gemini Flash 生图', '异步记录', '费用对账'],
    note: '生图费用单独记录。'
  }
] as const

const modelCheckItems = ['能替换地址', 'Key 单独隔离', '模型名可核对', '调用记录可查'] as const

const billingRules = [
  {
    icon: 'calculator',
    title: '按实际用量扣费',
    description: 'Token 和生图分开记录。'
  },
  {
    icon: 'xCircle',
    title: '失败请求有原因',
    description: '上游、限流、参数错误分开看。'
  },
  {
    icon: 'sync',
    title: '余额变化可核对',
    description: '充值、扣费、退款都有流水。'
  },
  {
    icon: 'creditCard',
    title: '支付异常可追踪',
    description: '订单号可用于人工处理。'
  }
] as const

const integrationTabs = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    title: 'Claude Code 环境变量',
    code: `export ANTHROPIC_BASE_URL="https://api.example.com"
export ANTHROPIC_AUTH_TOKEN="sk_live_your_key"
claude "用当前项目跑一次类型检查"`
  },
  {
    id: 'codex',
    label: 'Codex',
    title: 'Codex OpenAI-compatible',
    code: `export OPENAI_BASE_URL="https://api.example.com/v1"
export OPENAI_API_KEY="sk_live_your_key"
codex "summarize this repository"`
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    title: 'DeepSeek Chat Completions',
    code: `curl https://api.example.com/v1/chat/completions \\
  -H "Authorization: Bearer sk_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"ping"}]}'`
  },
  {
    id: 'gemini',
    label: 'Gemini',
    title: 'Gemini-compatible 调用',
    code: `curl https://api.example.com/v1/chat/completions \\
  -H "Authorization: Bearer sk_live_your_key" \\
  -d '{"model":"gemini-flash","messages":[{"role":"user","content":"hello"}]}'`
  },
  {
    id: 'image',
    label: '生图 API',
    title: '生图请求示例',
    code: `curl https://api.example.com/v1/images/generations \\
  -H "Authorization: Bearer sk_live_your_key" \\
  -d '{"model":"image-2","prompt":"blue-white digital harbor"}'`
  }
] as const

const activeIntegration = ref<(typeof integrationTabs)[number]['id']>('claude-code')
const copiedSnippet = ref(false)
const activeIntegrationSnippet = computed(() => {
  return integrationTabs.find((tab) => tab.id === activeIntegration.value) || integrationTabs[0]
})

async function copyIntegrationSnippet() {
  try {
    await navigator.clipboard.writeText(activeIntegrationSnippet.value.code)
    copiedSnippet.value = true
    window.setTimeout(() => {
      copiedSnippet.value = false
    }, 1400)
  } catch {
    copiedSnippet.value = false
  }
}

const statusRows = [
  { name: 'Claude 路由', value: '正常 · 842ms', level: 'ok' },
  { name: 'Gemini Flash', value: '正常 · 760ms', level: 'ok' },
  { name: '生图队列', value: '排队 · 2 个任务', level: 'warn' },
  { name: '异常记录', value: '24h 可查', level: 'ok' }
] as const

const faqItems = [
  {
    question: '充值没到账怎么办？',
    answer: '先看订单状态。支付成功但余额未更新，带订单号联系支持处理。'
  },
  {
    question: '失败请求会扣费吗？',
    answer: '看上游是否产生实际用量。失败原因和扣费依据会保留在记录里。'
  },
  {
    question: '能接哪些工具？',
    answer: '常见 CLI、OpenAI SDK、Anthropic 兼容调用和 curl/API 都可以按示例配置。'
  },
  {
    question: '这是不是官方服务？',
    answer: '这是 API 网关服务。具体模型能力、官方策略和可用性以对应上游为准。'
  }
] as const

onMounted(() => {
  authStore.checkAuth()

  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>

<style scoped>
.landing-page {
  --home-primary: #3e55e9;
  --home-primary-hover: #2f43c9;
  --home-primary-strong: #2438b8;
  --home-primary-soft: #f3f5ff;
  --home-primary-border: #c8d1ff;
  --home-trust: #0ea5a4;
  --home-warning: #f59e0b;
  --home-info: #38bdf8;
  --home-ink: #111827;
  --home-ink-700: #374151;
  --home-ink-500: #6b7280;
  --home-ink-400: #9ca3af;
  --home-line: #dde4ff;
  --home-line-soft: #e6eaf8;
  --home-page: #f5f7ff;
  --home-page-alt: #f8fafc;
  --home-surface: #ffffff;
  --home-radius: 6px;
  --home-radius-lg: 8px;
  --home-shadow: 0 18px 48px rgba(62, 85, 233, 0.12);
  --home-content-width: 1440px;
  --home-hero-width: 1680px;
  --home-visual-section-height: 580px;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--home-ink);
  background:
    linear-gradient(180deg, rgba(245, 247, 255, 0.96) 0%, #ffffff 39%, #f8fafc 100%),
    radial-gradient(circle at 77% 10%, rgba(62, 85, 233, 0.1), transparent 38%);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Microsoft YaHei", sans-serif;
  letter-spacing: 0;
}

.home-header {
  background: rgba(255, 255, 255, 0.92);
  border-color: var(--home-line-soft);
  backdrop-filter: blur(18px);
}

.home-nav-shell {
  display: flex;
  height: 72px;
  max-width: var(--home-hero-width);
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: 0 28px;
  margin: 0 auto;
}

.home-brand {
  display: inline-flex;
  min-width: 0;
  flex: 0 1 auto;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  color: var(--home-primary);
  background: #ffffff;
  border-radius: var(--home-radius);
}

.brand-mark img {
  width: 100%;
  height: 100%;
  border-radius: var(--home-radius);
  object-fit: contain;
}

.home-brand-name {
  overflow: hidden;
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
  color: #06091f;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-nav-links {
  display: flex;
  align-items: center;
  gap: 46px;
  margin-left: 36px;
  font-size: 15px;
  font-weight: 700;
  color: #080b1f;
}

.nav-link {
  position: relative;
  transition: color 160ms cubic-bezier(0.2, 0, 0, 1);
}

.nav-link:hover {
  color: var(--home-primary);
}

.nav-link::after {
  position: absolute;
  right: 0;
  bottom: -10px;
  left: 0;
  height: 2px;
  content: '';
  background: var(--home-primary);
  opacity: 0;
  transform: scaleX(0.7);
  transition:
    opacity 160ms cubic-bezier(0.2, 0, 0, 1),
    transform 160ms cubic-bezier(0.2, 0, 0, 1);
}

.nav-link:hover::after {
  opacity: 1;
  transform: scaleX(1);
}

.home-header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
}

.home-login-button,
.home-doc-button,
.home-button {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  border-radius: var(--home-radius);
  transition:
    background-color 160ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms cubic-bezier(0.2, 0, 0, 1),
    color 160ms cubic-bezier(0.2, 0, 0, 1),
    transform 160ms cubic-bezier(0.2, 0, 0, 1);
}

.home-login-button,
.home-button-secondary {
  color: var(--home-primary-strong);
  background: #ffffff;
  border: 1px solid var(--home-primary-border);
}

.home-login-button:hover,
.home-button-secondary:hover {
  background: var(--home-primary-soft);
  border-color: #9fb0ff;
}

.home-doc-button,
.home-button-primary {
  color: #ffffff;
  background: var(--home-primary);
  border: 1px solid var(--home-primary);
}

.home-doc-button:hover,
.home-button-primary:hover {
  background: var(--home-primary-hover);
  border-color: var(--home-primary-hover);
}

.home-button:hover {
  transform: translateY(-1px);
}

.hero-section {
  position: relative;
  display: flex;
  min-height: min(760px, calc(100svh - 72px));
  align-items: stretch;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(242, 247, 255, 0.9) 38%, rgba(216, 235, 255, 0.9) 100%);
}

.hero-section::before {
  position: absolute;
  inset: 0 0 auto 0;
  height: 100%;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.76) 32%, rgba(255, 255, 255, 0) 64%),
    linear-gradient(180deg, rgba(232, 243, 255, 0.7) 0%, rgba(232, 243, 255, 0) 18%);
  z-index: 1;
}

.hero-section::after {
  position: absolute;
  inset: auto 0 0;
  height: 72px;
  pointer-events: none;
  content: '';
  background: linear-gradient(180deg, rgba(245, 248, 255, 0) 0%, #ffffff 100%);
}

.hero-grid {
  display: grid;
  position: relative;
  width: 100%;
  max-width: var(--home-hero-width);
  grid-template-columns: minmax(560px, 0.46fr) minmax(620px, 0.54fr);
  gap: 24px;
  align-items: center;
  padding: 10px 28px 46px;
  margin: 0 auto;
}

.hero-copy {
  position: relative;
  z-index: 3;
  max-width: 610px;
  padding-left: 32px;
}

.home-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  margin-bottom: 24px;
  font-size: 12px;
  font-weight: 700;
  color: var(--home-primary-strong);
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid var(--home-primary-border);
  border-radius: var(--home-radius);
}

.home-title {
  display: flex;
  max-width: none;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: 0.16em;
  font-size: clamp(42px, 3.45vw, 58px);
  font-weight: 900;
  line-height: 1.04;
  color: #050816;
  white-space: nowrap;
  text-align: left;
}

.home-title span {
  display: inline-block;
  color: var(--home-primary);
  flex: 0 0 auto;
}

.home-title :deep(.hero-rotating-text) {
  flex: 0 0 4.2em;
  justify-items: start;
  color: #050816;
  perspective: 900px;
}

.home-title :deep(.hero-rotating-segment) {
  transform-origin: 50% 100%;
}

.home-body {
  max-width: 560px;
  margin-top: 24px;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.58;
  color: var(--home-ink-700);
  overflow-wrap: anywhere;
}

.mobile-soft-break {
  display: none;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 40px;
}

.hero-actions .home-button {
  min-width: 210px;
  height: 62px;
  font-size: 20px;
}

.home-trust-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
}

.trust-chip {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 700;
  color: #1f2a44;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--home-line);
  border-radius: var(--home-radius);
  box-shadow: 0 10px 26px rgba(35, 56, 118, 0.06);
}

.trust-chip svg {
  color: var(--home-primary);
}

.hero-visual {
  position: absolute;
  inset: 0 0 -34px 33%;
  z-index: 1;
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: flex-end;
  pointer-events: none;
}

.hero-visual img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  margin-left: auto;
  object-fit: cover;
  object-position: right top;
  filter: drop-shadow(0 24px 42px rgba(62, 85, 233, 0.08));
  -webkit-mask-image:
    linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.12) 10%, #000000 28%, #000000 100%),
    linear-gradient(180deg, #000000 0%, #000000 91%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.12) 10%, #000000 28%, #000000 100%),
    linear-gradient(180deg, #000000 0%, #000000 91%, transparent 100%);
  mask-composite: intersect;
}

.hero-provider-strip {
  position: absolute;
  right: clamp(28px, 3vw, 54px);
  bottom: 82px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  max-width: min(560px, 42vw);
}

.hero-provider-strip span {
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;
  background: rgba(12, 66, 153, 0.86);
  border: 1px solid rgba(173, 206, 255, 0.7);
  border-radius: var(--home-radius);
  box-shadow: 0 10px 22px rgba(14, 83, 176, 0.18);
}

.landing-section {
  padding: 88px 28px;
}

.section-shell {
  max-width: var(--home-content-width);
  margin: 0 auto;
}

.section-grid,
.pricing-grid,
.integration-grid,
.status-grid,
.faq-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: 40px;
  align-items: center;
}

.section-copy {
  min-width: 0;
}

.section-kicker {
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 800;
  color: var(--home-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.section-title {
  max-width: 560px;
  font-size: 34px;
  font-weight: 900;
  line-height: 1.18;
  color: var(--home-ink);
}

.section-lead {
  max-width: 600px;
  margin-top: 18px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  color: var(--home-ink-500);
}

.section-heading-row {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.82fr);
  gap: 40px;
  align-items: end;
  margin-bottom: 32px;
}

.section-heading-row .section-lead {
  margin-top: 0;
}

.ledger-section,
.pricing-section,
.status-section {
  background: #ffffff;
}

.pricing-section,
.status-section {
  padding-top: 0;
  padding-bottom: 0;
}

.models-section,
.integration-section,
.faq-section {
  background: var(--home-page-alt);
  border-top: 1px solid var(--home-line-soft);
  border-bottom: 1px solid var(--home-line-soft);
}

.models-section {
  background:
    linear-gradient(180deg, #f7faff 0%, #f3f7ff 100%);
}

.ledger-summary {
  display: grid;
  max-width: 560px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 28px;
}

.metric-tile {
  padding: 16px;
  background: var(--home-primary-soft);
  border: 1px solid var(--home-primary-border);
  border-radius: var(--home-radius-lg);
}

.metric-tile span,
.metric-tile strong {
  display: block;
}

.metric-tile span {
  font-size: 12px;
  font-weight: 700;
  color: var(--home-ink-500);
}

.metric-tile strong {
  margin-top: 8px;
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  color: var(--home-primary-strong);
}

.ledger-panel,
.code-console,
.faq-list {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--home-line);
  border-radius: var(--home-radius-lg);
  box-shadow: var(--home-shadow);
}

.ledger-toolbar,
.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 800;
  color: var(--home-ink);
  border-bottom: 1px solid var(--home-line-soft);
}

.ledger-toolbar span:last-child {
  color: var(--home-ink-500);
}

.ledger-table {
  padding: 6px 0;
  overflow-x: auto;
}

.ledger-row {
  display: grid;
  min-width: 610px;
  grid-template-columns: 0.9fr 1.5fr 0.8fr 0.8fr 0.8fr;
  gap: 14px;
  align-items: center;
  padding: 14px 18px;
  font-size: 13px;
  color: var(--home-ink-700);
  border-bottom: 1px solid var(--home-line-soft);
  font-variant-numeric: tabular-nums;
}

.ledger-row:last-child {
  border-bottom: 0;
}

.ledger-head {
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 12px;
  font-weight: 800;
  color: var(--home-ink-400);
  background: #fbfcff;
}

.ledger-row strong,
.ledger-row small {
  display: block;
}

.ledger-row strong {
  color: var(--home-ink);
}

.ledger-row small {
  margin-top: 3px;
  color: var(--home-ink-400);
}

.status-ok {
  font-weight: 800;
  color: var(--home-trust);
}

.model-matrix {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.matrix-group {
  position: relative;
  min-height: 190px;
  padding: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--home-line);
  border-radius: var(--home-radius-lg);
  transition:
    border-color 160ms cubic-bezier(0.2, 0, 0, 1),
    transform 160ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 160ms cubic-bezier(0.2, 0, 0, 1);
}

.matrix-group::after {
  position: absolute;
  inset: auto 18px 16px auto;
  width: 34px;
  height: 34px;
  pointer-events: none;
  content: '';
  background: radial-gradient(circle, rgba(62, 85, 233, 0.14), transparent 68%);
}

.matrix-group:hover {
  border-color: var(--home-primary-border);
  box-shadow: 0 18px 44px rgba(31, 52, 112, 0.08);
  transform: translateY(-2px);
}

.matrix-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  color: var(--home-primary);
}

.matrix-title h3 {
  font-size: 17px;
  font-weight: 900;
  color: var(--home-ink);
}

.matrix-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.matrix-tags span {
  padding: 7px 9px;
  font-size: 12px;
  font-weight: 800;
  color: #26324d;
  background: #f8fbff;
  border: 1px solid var(--home-line-soft);
  border-radius: var(--home-radius);
  overflow-wrap: anywhere;
}

.matrix-group p {
  margin-top: 18px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--home-ink-500);
}

.model-checkline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 16px;
  margin-top: 14px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid var(--home-line);
  border-radius: var(--home-radius-lg);
}

.model-checkline span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 800;
  color: #26324d;
  background: #ffffff;
  border: 1px solid var(--home-line-soft);
  border-radius: var(--home-radius);
}

.model-checkline svg {
  color: var(--home-trust);
}

.pricing-grid {
  position: relative;
  grid-template-columns: minmax(0, 1fr) minmax(500px, 0.44fr);
  min-height: var(--home-visual-section-height);
  align-items: stretch;
}

.pricing-visual {
  grid-column: 1 / -1;
  grid-row: 1;
  position: relative;
  overflow: hidden;
  height: var(--home-visual-section-height);
  min-height: var(--home-visual-section-height);
  background:
    linear-gradient(90deg, rgba(234, 244, 255, 0.9), rgba(255, 255, 255, 0.2) 62%, rgba(255, 255, 255, 0.78)),
    #eef6ff;
  border-radius: 0;
}

.pricing-visual img {
  display: block;
  width: min(1180px, 82%);
  max-width: none;
  height: 100%;
  min-height: 0;
  margin-left: -28px;
  object-fit: cover;
  object-position: left center;
  filter: drop-shadow(0 20px 38px rgba(62, 85, 233, 0.08));
  -webkit-mask-image:
    linear-gradient(90deg, #000000 0%, #000000 68%, rgba(0, 0, 0, 0.42) 84%, transparent 100%),
    linear-gradient(180deg, transparent 0%, #000000 7%, #000000 93%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(90deg, #000000 0%, #000000 68%, rgba(0, 0, 0, 0.42) 84%, transparent 100%),
    linear-gradient(180deg, transparent 0%, #000000 7%, #000000 93%, transparent 100%);
  mask-composite: intersect;
}

.pricing-grid .section-copy {
  grid-column: 2;
  grid-row: 1;
  align-self: start;
  position: relative;
  z-index: 2;
  max-width: 500px;
  padding: 24px 26px;
  margin-top: 44px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(221, 228, 255, 0.88);
  border-radius: var(--home-radius-lg);
  box-shadow: 0 20px 46px rgba(35, 56, 118, 0.08);
  backdrop-filter: blur(14px);
}

.billing-rules {
  display: grid;
  gap: 8px;
  margin-top: 22px;
}

.billing-rules-overlay {
  grid-column: 2;
  grid-row: 1;
  align-self: start;
  position: relative;
  z-index: 3;
  max-width: 500px;
  margin-top: 244px;
  margin-bottom: 0;
}

.billing-rule {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 62px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid var(--home-line);
  border-radius: var(--home-radius);
}

.billing-rule svg {
  color: var(--home-primary);
}

.billing-rule h3 {
  font-size: 14px;
  font-weight: 900;
  color: var(--home-ink);
}

.billing-rule p {
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.45;
  color: var(--home-ink-500);
}

.integration-grid {
  grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
}

.code-console {
  overflow: hidden;
  background: #071125;
  border-color: #172554;
  box-shadow: 0 26px 60px rgba(7, 17, 37, 0.18);
}

.integration-tabs {
  display: flex;
  gap: 6px;
  padding: 10px;
  overflow-x: auto;
  background: #0d1730;
  border-bottom: 1px solid #203158;
}

.integration-tabs button {
  flex: 0 0 auto;
  min-height: 34px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 800;
  color: #9fb0d8;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--home-radius);
}

.integration-tabs button.active {
  color: #ffffff;
  background: #1e40af;
  border-color: #4f7cff;
}

.code-toolbar {
  color: #dbe7ff;
  background: #071125;
  border-bottom-color: #203158;
}

.code-toolbar button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 10px;
  color: #c7d7ff;
  border: 1px solid #2f4f91;
  border-radius: var(--home-radius);
}

.code-console pre {
  min-height: 250px;
  padding: 22px;
  overflow-x: auto;
  font-family:
    "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #dbeafe;
  white-space: pre;
}

.status-grid {
  position: relative;
  grid-template-columns: 1fr;
  min-height: var(--home-visual-section-height);
  align-items: stretch;
}

.status-copy {
  position: absolute;
  top: clamp(58px, 6vw, 86px);
  left: clamp(44px, 6vw, 88px);
  z-index: 3;
  width: min(430px, 36%);
  max-width: none;
  padding: 24px 26px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(221, 228, 255, 0.82);
  border-radius: var(--home-radius-lg);
  box-shadow: 0 20px 46px rgba(35, 56, 118, 0.08);
  backdrop-filter: blur(14px);
}

.status-list {
  display: grid;
  gap: 10px;
  max-width: 560px;
  margin-top: 28px;
}

.status-list-overlay {
  position: absolute;
  bottom: clamp(28px, 3vw, 44px);
  left: clamp(44px, 6vw, 88px);
  z-index: 3;
  width: min(470px, 40%);
  max-width: none;
  margin-top: 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(221, 228, 255, 0.86);
  border-radius: var(--home-radius-lg);
  box-shadow: 0 22px 52px rgba(35, 56, 118, 0.1);
  backdrop-filter: blur(14px);
}

.status-row {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  min-height: 48px;
  padding: 0 14px;
  font-size: 14px;
  color: var(--home-ink-700);
  background: #ffffff;
  border: 1px solid var(--home-line);
  border-radius: var(--home-radius);
}

.status-row strong {
  font-size: 13px;
  color: var(--home-ink);
  font-variant-numeric: tabular-nums;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.status-dot.ok {
  background: var(--home-trust);
  box-shadow: 0 0 0 4px rgba(14, 165, 164, 0.12);
}

.status-dot.warn {
  background: var(--home-warning);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.12);
}

.security-card {
  grid-column: 1;
  grid-row: 1;
  position: relative;
  overflow: hidden;
  height: var(--home-visual-section-height);
  min-height: var(--home-visual-section-height);
  background:
    linear-gradient(90deg, rgba(238, 247, 255, 0.84) 0%, rgba(238, 247, 255, 0.58) 34%, rgba(255, 255, 255, 0.1) 62%, rgba(255, 255, 255, 0.48) 100%),
    #f0f7ff;
}

.security-card img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-width: none;
  object-fit: cover;
  object-position: right center;
  filter: drop-shadow(0 20px 36px rgba(62, 85, 233, 0.08));
  -webkit-mask-image:
    linear-gradient(90deg, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0.62) 16%, #000000 38%, #000000 100%),
    linear-gradient(180deg, transparent 0%, #000000 7%, #000000 94%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(90deg, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0.62) 16%, #000000 38%, #000000 100%),
    linear-gradient(180deg, transparent 0%, #000000 7%, #000000 94%, transparent 100%);
  mask-composite: intersect;
}

.faq-grid {
  grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
}

.faq-cta {
  width: max-content;
  margin-top: 28px;
}

.faq-list {
  overflow: hidden;
}

.faq-item {
  padding: 20px 22px;
  border-bottom: 1px solid var(--home-line-soft);
}

.faq-item:last-child {
  border-bottom: 0;
}

.faq-item summary {
  cursor: pointer;
  list-style: none;
  font-size: 16px;
  font-weight: 900;
  color: var(--home-ink);
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item p {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--home-ink-500);
}

.landing-footer {
  padding: 36px 28px 40px;
  color: #dbe7ff;
  background: #071125;
}

.footer-shell {
  display: grid;
  max-width: var(--home-content-width);
  grid-template-columns: minmax(260px, 1fr) auto;
  gap: 24px;
  align-items: center;
  margin: 0 auto;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-brand .brand-mark {
  border-radius: 10px;
  background: #ffffff;
}

.footer-brand strong {
  display: block;
  font-size: 18px;
  color: #ffffff;
}

.footer-brand p,
.footer-note {
  margin-top: 5px;
  font-size: 13px;
  line-height: 1.65;
  color: #9fb0d8;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-end;
}

.footer-links a {
  font-size: 13px;
  font-weight: 800;
  color: #dbe7ff;
  transition: color 160ms cubic-bezier(0.2, 0, 0, 1);
}

.footer-links a:hover {
  color: #ffffff;
}

.footer-note {
  grid-column: 1 / -1;
  max-width: 880px;
  padding-top: 18px;
  margin-top: 4px;
  border-top: 1px solid rgba(159, 176, 216, 0.18);
}

@media (max-width: 1180px) {
  .home-nav-links {
    display: none;
  }

  .hero-grid,
  .section-grid,
  .integration-grid,
  .faq-grid,
  .section-heading-row {
    grid-template-columns: 1fr;
  }

  .pricing-grid,
  .status-grid {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .pricing-grid .section-copy,
  .billing-rules-overlay {
    grid-column: 1;
    grid-row: auto;
    max-width: none;
  }

  .pricing-grid .section-copy {
    padding: 0;
    margin-top: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
    backdrop-filter: none;
  }

  .pricing-visual {
    grid-column: 1;
    grid-row: auto;
    height: 360px;
    min-height: 360px;
  }

  .pricing-visual img {
    width: 100%;
    min-height: 360px;
    margin-left: 0;
  }

  .billing-rules-overlay {
    margin-top: 0;
    margin-bottom: 0;
  }

  .security-card {
    height: 420px;
    margin-left: 0;
  }

  .status-copy {
    position: relative;
    top: auto;
    left: auto;
    width: auto;
    max-width: none;
    padding: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
    backdrop-filter: none;
  }

  .status-list-overlay {
    position: relative;
    left: auto;
    right: auto;
    bottom: auto;
    width: auto;
    margin: -94px 18px 0 auto;
  }

  .hero-section {
    min-height: 0;
  }

  .hero-copy {
    max-width: 760px;
    padding-left: 0;
  }

  .hero-visual {
    inset: 0 -10% -24px 28%;
    opacity: 0.9;
  }

  .hero-visual img {
    width: 100%;
    max-width: none;
    margin: 0;
  }

  .model-matrix {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-title {
    flex-wrap: wrap;
    white-space: normal;
  }
}

@media (max-width: 760px) {
  .home-nav-shell {
    height: 64px;
    gap: 10px;
    padding: 0 16px;
  }

  .home-brand {
    flex: 1 1 auto;
  }

  .home-brand-name {
    font-size: 21px;
  }

  .brand-mark {
    width: 30px;
    height: 30px;
  }

  .home-header-actions {
    flex: 0 0 auto;
    gap: 8px;
  }

  .home-login-button,
  .home-doc-button {
    display: none;
  }

  .hero-grid {
    padding: 34px 18px 300px;
  }

  .home-eyebrow {
    margin-bottom: 18px;
  }

  .home-title {
    font-size: 38px;
  }

  .home-title :deep(.hero-rotating-text) {
    flex-basis: 4.2em;
  }

  .home-body {
    max-width: 100%;
    margin-top: 18px;
    font-size: 17px;
    line-height: 1.7;
    word-break: normal;
  }

  .mobile-soft-break {
    display: block;
  }

  .hero-actions {
    gap: 12px;
    margin-top: 28px;
  }

  .hero-actions .home-button {
    width: 100%;
    min-width: 0;
    height: 52px;
    font-size: 17px;
  }

  .home-trust-chips {
    gap: 10px;
    margin-top: 24px;
  }

  .trust-chip {
    min-height: 42px;
    font-size: 13px;
  }

  .hero-provider-strip {
    right: 18px;
    bottom: 24px;
    left: 18px;
    justify-content: flex-start;
    max-width: none;
  }

  .hero-visual {
    inset: auto -24% 0 0;
    height: 360px;
  }

  .landing-section {
    padding: 56px 18px;
  }

  .section-title {
    font-size: 28px;
  }

  .section-lead {
    font-size: 15px;
  }

  .ledger-summary,
  .model-matrix {
    grid-template-columns: 1fr;
  }

  .security-card {
    height: auto;
    min-height: 0;
  }

  .security-card img {
    width: 100%;
    height: auto;
    min-height: 340px;
    max-width: none;
    margin-right: 0;
    margin-left: 0;
  }

  .status-list-overlay {
    width: auto;
    margin: -76px 14px 0;
  }

  .matrix-group {
    min-height: 0;
  }

  .status-row {
    grid-template-columns: 12px minmax(0, 1fr);
  }

  .status-row strong {
    grid-column: 2;
  }

  .footer-shell {
    grid-template-columns: 1fr;
  }

  .footer-links {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
