<template>
  <section class="quick-actions-panel">
    <div class="section-heading">
      <h2>{{ t('dashboard.quickActions') }}</h2>
    </div>
    <div class="action-list">
      <button
        v-for="action in actions"
        :key="action.to"
        @click="router.push(action.to)"
        class="action-row"
      >
        <span class="action-icon" :class="`action-${action.tone}`" aria-hidden="true">
          <Icon :name="action.icon" size="sm" />
        </span>
        <span class="action-copy">
          <span class="action-title">{{ action.title }}</span>
          <span class="action-description">{{ action.description }}</span>
        </span>
        <Icon name="chevronRight" size="sm" class="action-arrow" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'

const router = useRouter()
const { t } = useI18n()
type IconName = InstanceType<typeof Icon>['$props']['name']

const actions = computed<Array<{
  to: string
  tone: 'primary' | 'success' | 'warning'
  icon: IconName
  title: string
  description: string
}>>(() => [
  {
    to: '/keys',
    tone: 'primary',
    icon: 'key',
    title: t('dashboard.createApiKey'),
    description: t('dashboard.generateNewKey')
  },
  {
    to: '/usage',
    tone: 'success',
    icon: 'chart',
    title: t('dashboard.viewUsage'),
    description: t('dashboard.checkDetailedLogs')
  },
  {
    to: '/redeem',
    tone: 'warning',
    icon: 'gift',
    title: t('dashboard.redeemCode'),
    description: t('dashboard.addBalanceWithCode')
  }
])
</script>

<style scoped>
.quick-actions-panel {
  min-width: 0;
  padding: 26px 0 0 34px;
  border-left: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.section-heading {
  margin-bottom: 18px;
}

.section-heading h2 {
  color: var(--user-text-strong, #15172b);
  font-size: 16px;
  font-weight: 720;
}

.action-list {
  border-top: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
}

.action-row {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 76px;
  padding: 14px 0;
  text-align: left;
  border-bottom: 1px solid var(--user-panel-border-soft, rgba(200, 209, 255, 0.52));
  transition: color var(--user-motion-fast, 160ms ease);
}

.action-row:hover .action-title,
.action-row:hover .action-arrow {
  color: var(--user-sidebar-active-text, #2438b8);
}

.action-icon {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.action-primary {
  color: var(--user-sidebar-active-text, #2438b8);
  background: var(--user-sidebar-active-bg, rgba(62, 85, 233, 0.1));
}

.action-success {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
}

.action-warning {
  color: #d97706;
  background: rgba(217, 119, 6, 0.12);
}

.action-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.action-title {
  color: var(--user-text-strong, #15172b);
  font-size: 14px;
  font-weight: 650;
  transition: color var(--user-motion-fast, 160ms ease);
}

.action-description {
  overflow: hidden;
  color: var(--user-text-soft, #737b8f);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-arrow {
  color: var(--user-text-soft, #737b8f);
  transition: color var(--user-motion-fast, 160ms ease);
}

@media (max-width: 1023px) {
  .quick-actions-panel {
    margin-top: 26px;
    padding-left: 0;
    border-left: 0;
  }
}
</style>
