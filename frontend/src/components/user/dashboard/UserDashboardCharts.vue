<template>
  <section class="dashboard-analytics">
    <div class="analytics-toolbar">
      <div class="toolbar-group">
        <span class="toolbar-label">{{ t('dashboard.timeRange') }}</span>
        <DateRangePicker
          :start-date="startDate"
          :end-date="endDate"
          @update:startDate="$emit('update:startDate', $event)"
          @update:endDate="$emit('update:endDate', $event)"
          @change="$emit('dateRangeChange', $event)"
        />
        <button @click="$emit('refresh')" :disabled="loading" class="toolbar-button">
          <Icon name="refresh" size="sm" />
          {{ t('common.refresh') }}
        </button>
      </div>
      <div class="toolbar-group toolbar-group-right">
        <span class="toolbar-label">{{ t('dashboard.granularity') }}</span>
        <div class="w-28">
          <Select
            :model-value="granularity"
            :options="[{ value: 'day', label: t('dashboard.day') }, { value: 'hour', label: t('dashboard.hour') }]"
            @update:model-value="$emit('update:granularity', $event)"
            @change="$emit('granularityChange')"
          />
        </div>
      </div>
    </div>

    <div class="analytics-grid">
      <article class="chart-panel chart-panel-models">
        <div
          v-if="loading"
          class="panel-loading"
        >
          <LoadingSpinner size="md" />
        </div>
        <h3 class="panel-title">{{ t('dashboard.modelDistribution') }}</h3>
        <div class="model-content">
          <div class="model-chart">
            <Doughnut v-if="modelData" :data="modelData" :options="doughnutOptions" />
            <div v-else class="empty-chart">{{ t('dashboard.noDataAvailable') }}</div>
          </div>
          <div class="model-table-wrap">
            <table class="model-table">
              <thead>
                <tr>
                  <th>{{ t('dashboard.model') }}</th>
                  <th class="text-right">{{ t('dashboard.requests') }}</th>
                  <th class="text-right">{{ t('dashboard.tokens') }}</th>
                  <th class="text-right">{{ t('dashboard.actual') }}</th>
                  <th class="text-right">{{ t('dashboard.standard') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="model in models" :key="model.model">
                  <td class="model-name" :title="model.model">{{ model.model }}</td>
                  <td class="text-right">{{ formatNumber(model.requests) }}</td>
                  <td class="text-right">{{ formatTokens(model.total_tokens) }}</td>
                  <td class="text-right model-cost">${{ formatCost(model.actual_cost) }}</td>
                  <td class="text-right model-muted">${{ formatCost(model.cost) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <TokenUsageTrend :trend-data="trend" :loading="loading" compact />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import Select from '@/components/common/Select.vue'
import Icon from '@/components/icons/Icon.vue'
import { Doughnut } from 'vue-chartjs'
import TokenUsageTrend from '@/components/charts/TokenUsageTrend.vue'
import type { TrendDataPoint, ModelStat } from '@/types'
import { formatCostFixed as formatCost, formatNumberLocaleString as formatNumber, formatTokensK as formatTokens } from '@/utils/format'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{
  loading: boolean
  startDate: string
  endDate: string
  granularity: string
  trend: TrendDataPoint[]
  models: ModelStat[]
}>()

defineEmits(['update:startDate', 'update:endDate', 'update:granularity', 'dateRangeChange', 'granularityChange', 'refresh'])
const { t } = useI18n()

const modelData = computed(() => !props.models?.length ? null : {
  labels: props.models.map((m: ModelStat) => m.model),
  datasets: [{
    data: props.models.map((m: ModelStat) => m.total_tokens),
    backgroundColor: ['#3e55e9', '#10b981', '#f59e0b', '#ef4444', '#7c3aed', '#db2777', '#0891b2', '#65a30d'],
    borderWidth: 0,
    hoverOffset: 4
  }]
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '66%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.label}: ${formatTokens(context.parsed)} tokens`
      }
    }
  }
}
</script>

<style scoped>
.dashboard-analytics {
  border-top: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.analytics-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 78px;
  padding: 14px 0;
  border-bottom: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.toolbar-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.toolbar-group-right {
  justify-content: flex-end;
}

.toolbar-label {
  color: var(--user-text-muted, #5f6678);
  font-size: 13px;
  font-weight: 650;
}

.toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  color: var(--user-text-strong, #15172b);
  font-size: 13px;
  font-weight: 650;
  background: var(--user-control-bg, rgba(255, 255, 255, 0.72));
  border: 1px solid var(--user-control-border, #d6d9e4);
  border-radius: 6px;
  transition: background var(--user-motion-fast, 160ms ease), color var(--user-motion-fast, 160ms ease);
}

.toolbar-button:hover:not(:disabled) {
  background: var(--user-control-hover, #eef2ff);
}

.toolbar-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.analytics-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0;
}

.chart-panel {
  position: relative;
  min-height: 316px;
  padding: 24px 26px 26px 0;
}

.chart-panel-models {
  padding-right: 34px;
  border-right: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.panel-loading {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--user-page-bg-end, #fff) 72%, transparent);
  backdrop-filter: blur(4px);
}

.panel-title {
  margin-bottom: 18px;
  color: var(--user-text-strong, #15172b);
  font-size: 15px;
  font-weight: 720;
}

.model-content {
  display: grid;
  grid-template-columns: minmax(160px, 220px) minmax(0, 1fr);
  align-items: center;
  gap: 24px;
}

.model-chart {
  height: 220px;
}

.empty-chart {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--user-text-soft, #737b8f);
  font-size: 13px;
}

.model-table-wrap {
  max-height: 220px;
  overflow: auto;
}

.model-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--user-text-body, #596074);
  font-size: 12px;
}

.model-table th {
  padding: 0 0 10px;
  color: var(--user-text-soft, #737b8f);
  font-weight: 650;
}

.model-table td {
  padding: 10px 0;
  border-top: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.model-name {
  max-width: 140px;
  overflow: hidden;
  color: var(--user-text-strong, #15172b);
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-cost {
  color: #059669;
  font-weight: 650;
}

.model-muted {
  color: var(--user-text-soft, #737b8f);
}

@media (max-width: 1279px) {
  .model-content {
    grid-template-columns: 1fr;
  }

  .model-chart {
    height: 180px;
  }
}

@media (max-width: 1023px) {
  .analytics-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .toolbar-group-right {
    justify-content: flex-start;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .chart-panel,
  .chart-panel-models {
    padding-right: 0;
    border-right: 0;
  }

  .chart-panel + :deep(.token-trend-panel) {
    border-top: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
  }
}

@media (max-width: 639px) {
  .analytics-toolbar {
    padding: 16px 0;
  }

  .toolbar-group {
    width: 100%;
  }

  .chart-panel {
    min-height: auto;
    padding: 20px 0;
  }
}
</style>
