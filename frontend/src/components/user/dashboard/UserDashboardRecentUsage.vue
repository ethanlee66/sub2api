<template>
  <section class="recent-usage-panel">
    <div class="section-heading">
      <h2>{{ t('dashboard.recentUsage') }}</h2>
      <span>{{ t('dashboard.last7Days') }}</span>
    </div>
    <div v-if="loading" class="recent-loading">
      <LoadingSpinner size="lg" />
    </div>
    <div v-else-if="data.length === 0" class="recent-empty">
      <EmptyState :title="t('dashboard.noUsageRecords')" :description="t('dashboard.startUsingApi')" />
    </div>
    <div v-else class="recent-list">
      <div v-for="log in data" :key="log.id" class="usage-row">
        <div class="usage-main">
          <div class="usage-icon" aria-hidden="true">
            <Icon name="beaker" size="sm" />
          </div>
          <div class="min-w-0">
            <p class="usage-model">{{ log.model }}</p>
            <p class="usage-date">{{ formatDateTime(log.created_at) }}</p>
          </div>
        </div>
        <div class="usage-cost">
          <p>
            <span class="usage-cost-actual" :title="t('dashboard.actual')">${{ formatCost(log.actual_cost) }}</span>
            <span class="usage-cost-standard" :title="t('dashboard.standard')"> / ${{ formatCost(log.total_cost) }}</span>
          </p>
          <p>{{ (log.input_tokens + log.output_tokens).toLocaleString() }} tokens</p>
        </div>
      </div>

      <router-link to="/usage" class="view-all-link">
        {{ t('dashboard.viewAllUsage') }}
        <Icon name="arrowRight" size="sm" />
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Icon from '@/components/icons/Icon.vue'
import { formatDateTime } from '@/utils/format'
import type { UsageLog } from '@/types'

defineProps<{
  data: UsageLog[]
  loading: boolean
}>()

const { t } = useI18n()
const formatCost = (c: number) => c.toFixed(4)
</script>

<style scoped>
.recent-usage-panel {
  min-width: 0;
  padding: 26px 34px 0 0;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-heading h2 {
  color: var(--user-text-strong, #15172b);
  font-size: 16px;
  font-weight: 720;
}

.section-heading span {
  color: var(--user-text-soft, #737b8f);
  font-size: 12px;
  font-weight: 650;
}

.recent-loading,
.recent-empty {
  display: flex;
  min-height: 220px;
  align-items: center;
  justify-content: center;
}

.recent-list {
  border-top: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.usage-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 76px;
  padding: 14px 0;
  border-bottom: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.usage-main {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

.usage-icon {
  display: flex;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: var(--user-sidebar-active-text, #2438b8);
  background: var(--user-sidebar-active-bg, rgba(62, 85, 233, 0.1));
  border-radius: 6px;
}

.usage-model {
  overflow: hidden;
  color: var(--user-text-strong, #15172b);
  font-size: 14px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.usage-date {
  margin-top: 4px;
  color: var(--user-text-soft, #737b8f);
  font-size: 12px;
}

.usage-cost {
  flex-shrink: 0;
  color: var(--user-text-soft, #737b8f);
  text-align: right;
  font-size: 12px;
}

.usage-cost p:first-child {
  font-size: 14px;
  font-weight: 650;
}

.usage-cost-actual {
  color: #059669;
}

.usage-cost-standard {
  color: var(--user-text-soft, #737b8f);
  font-weight: 500;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--user-sidebar-active-text, #2438b8);
  font-size: 13px;
  font-weight: 700;
  transition: color var(--user-motion-fast, 160ms ease);
}

.view-all-link:hover {
  color: var(--user-brand-hover, #2f43c9);
}

@media (max-width: 1023px) {
  .recent-usage-panel {
    padding-right: 0;
  }
}

@media (max-width: 639px) {
  .recent-usage-panel {
    padding-top: 22px;
  }

  .usage-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .usage-cost {
    width: 100%;
    padding-left: 46px;
    text-align: left;
  }
}
</style>
