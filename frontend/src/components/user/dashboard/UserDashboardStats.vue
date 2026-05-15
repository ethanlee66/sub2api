<template>
  <section class="dashboard-metrics" aria-label="Dashboard metrics">
    <article
      v-for="metric in visibleMetrics"
      :key="metric.key"
      class="metric-item"
      :class="`metric-${metric.tone}`"
    >
      <div class="metric-icon" aria-hidden="true">
        <Icon :name="metric.icon" size="md" :stroke-width="2" />
      </div>
      <div class="min-w-0">
        <p class="metric-label">{{ metric.label }}</p>
        <p class="metric-value">
          <template v-if="metric.parts">
            <span :class="metric.primaryClass">{{ metric.parts.primary }}</span>
            <span class="metric-value-muted">{{ metric.parts.secondary }}</span>
          </template>
          <template v-else>
            {{ metric.value }}
          </template>
        </p>
        <p class="metric-meta">
          <template v-if="metric.metaParts">
            <span>{{ metric.metaParts.label }}</span>
            <span :class="metric.metaParts.primaryClass">{{ metric.metaParts.primary }}</span>
            <span>{{ metric.metaParts.secondary }}</span>
          </template>
          <template v-else>
            {{ metric.meta }}
          </template>
        </p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'
import type { UserDashboardStats as UserStatsType } from '@/api/usage'

type MetricTone = 'money' | 'keys' | 'traffic' | 'cost' | 'token' | 'total' | 'speed' | 'time'
type IconName = InstanceType<typeof Icon>['$props']['name']

const props = defineProps<{
  stats: UserStatsType
  balance: number
  isSimple: boolean
}>()

const { t } = useI18n()

const formatBalance = (b: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(b)

const formatNumber = (n: number) => n.toLocaleString()
const formatCost = (c: number) => c.toFixed(4)
const formatTokens = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}
const formatDuration = (ms: number) =>
  ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms.toFixed(0)}ms`

const visibleMetrics = computed(() => {
  const allMetrics: Array<{
    key: string
    tone: MetricTone
    icon: IconName
    label: string
    value?: string | number
    meta?: string
    parts?: { primary: string; secondary: string }
    metaParts?: { label: string; primary: string; secondary: string; primaryClass: string }
    primaryClass?: string
    hidden?: boolean
  }> = [
    {
      key: 'balance',
      tone: 'money',
      icon: 'creditCard',
      label: t('dashboard.balance'),
      value: `$${formatBalance(props.balance)}`,
      meta: t('common.available'),
      hidden: props.isSimple
    },
    {
      key: 'apiKeys',
      tone: 'keys',
      icon: 'key',
      label: t('dashboard.apiKeys'),
      value: props.stats?.total_api_keys || 0,
      meta: `${props.stats?.active_api_keys || 0} ${t('common.active')}`
    },
    {
      key: 'todayRequests',
      tone: 'traffic',
      icon: 'chart',
      label: t('dashboard.todayRequests'),
      value: props.stats?.today_requests || 0,
      meta: `${t('common.total')}: ${formatNumber(props.stats?.total_requests || 0)}`
    },
    {
      key: 'todayCost',
      tone: 'cost',
      icon: 'dollar',
      label: t('dashboard.todayCost'),
      parts: {
        primary: `$${formatCost(props.stats?.today_actual_cost || 0)}`,
        secondary: ` / $${formatCost(props.stats?.today_cost || 0)}`
      },
      metaParts: {
        label: `${t('common.total')}: `,
        primary: `$${formatCost(props.stats?.total_actual_cost || 0)}`,
        secondary: ` / $${formatCost(props.stats?.total_cost || 0)}`,
        primaryClass: 'metric-accent-cost'
      },
      primaryClass: 'metric-accent-cost'
    },
    {
      key: 'todayTokens',
      tone: 'token',
      icon: 'cube',
      label: t('dashboard.todayTokens'),
      value: formatTokens(props.stats?.today_tokens || 0),
      meta: `${t('dashboard.input')}: ${formatTokens(props.stats?.today_input_tokens || 0)} / ${t('dashboard.output')}: ${formatTokens(props.stats?.today_output_tokens || 0)}`
    },
    {
      key: 'totalTokens',
      tone: 'total',
      icon: 'database',
      label: t('dashboard.totalTokens'),
      value: formatTokens(props.stats?.total_tokens || 0),
      meta: `${t('dashboard.input')}: ${formatTokens(props.stats?.total_input_tokens || 0)} / ${t('dashboard.output')}: ${formatTokens(props.stats?.total_output_tokens || 0)}`
    },
    {
      key: 'performance',
      tone: 'speed',
      icon: 'bolt',
      label: t('dashboard.performance'),
      value: `${formatTokens(props.stats?.rpm || 0)} RPM`,
      meta: `${formatTokens(props.stats?.tpm || 0)} TPM`
    },
    {
      key: 'avgResponse',
      tone: 'time',
      icon: 'clock',
      label: t('dashboard.avgResponse'),
      value: formatDuration(props.stats?.average_duration_ms || 0),
      meta: t('dashboard.averageTime')
    }
  ]

  return allMetrics.filter((metric) => !metric.hidden)
})
</script>

<style scoped>
.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
  border-bottom: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.metric-item {
  position: relative;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  min-height: 104px;
  padding: 18px 22px;
}

.metric-item::after {
  content: '';
  position: absolute;
  top: 20px;
  right: 0;
  bottom: 20px;
  width: 1px;
  background: var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.metric-item:nth-child(4n)::after,
.metric-item:last-child::after {
  display: none;
}

.metric-icon {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  color: var(--metric-color);
  background: color-mix(in srgb, var(--metric-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--metric-color) 18%, transparent);
  border-radius: 6px;
}

.metric-money {
  --metric-color: #059669;
}

.metric-keys {
  --metric-color: #2563eb;
}

.metric-traffic {
  --metric-color: #0d9488;
}

.metric-cost {
  --metric-color: #7c3aed;
}

.metric-token {
  --metric-color: #d97706;
}

.metric-total {
  --metric-color: #4f46e5;
}

.metric-speed {
  --metric-color: #6d28d9;
}

.metric-time {
  --metric-color: #e11d48;
}

.metric-label {
  color: var(--user-text-soft, #737b8f);
  font-size: 12px;
  font-weight: 600;
}

.metric-value {
  margin-top: 4px;
  color: var(--user-text-strong, #15172b);
  font-size: 24px;
  font-weight: 720;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.metric-value-muted {
  color: var(--user-text-soft, #737b8f);
  font-size: 14px;
  font-weight: 500;
}

.metric-meta {
  margin-top: 6px;
  color: var(--user-text-muted, #5f6678);
  font-size: 12px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.metric-accent-cost {
  color: var(--metric-color);
}

@media (max-width: 1279px) {
  .dashboard-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .metric-item:nth-child(4n)::after {
    display: block;
  }

  .metric-item:nth-child(2n)::after,
  .metric-item:last-child::after {
    display: none;
  }
}

@media (max-width: 639px) {
  .dashboard-metrics {
    grid-template-columns: 1fr;
  }

  .metric-item {
    min-height: 92px;
    padding: 16px 4px;
  }

  .metric-item::after {
    top: auto;
    right: 0;
    bottom: 0;
    left: 50px;
    width: auto;
    height: 1px;
    display: block;
  }

  .metric-item:nth-child(2n)::after {
    display: block;
  }

  .metric-item:last-child::after {
    display: none;
  }
}
</style>
