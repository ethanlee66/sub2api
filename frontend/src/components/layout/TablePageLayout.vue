<template>
  <div class="table-page-layout" :class="{ 'mobile-mode': isMobile }">
    <!-- 固定区域：操作按钮 -->
    <div v-if="$slots.actions" class="layout-section-fixed">
      <slot name="actions" />
    </div>

    <!-- 固定区域：搜索和过滤器 -->
    <div v-if="$slots.filters" class="layout-section-fixed">
      <slot name="filters" />
    </div>

    <!-- 滚动区域：表格 -->
    <div class="layout-section-scrollable">
      <div class="table-scroll-container">
        <slot name="table" />
      </div>
    </div>

    <!-- 固定区域：分页器 -->
    <div v-if="$slots.pagination" class="layout-section-fixed">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* 桌面端：Flexbox 布局 */
.table-page-layout {
  display: flex;
  flex-direction: column;
  gap: 22px;
  height: calc(100vh - 64px - 3rem);
}

.layout-section-fixed {
  flex-shrink: 0;
}

.layout-section-scrollable {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

/* 表格滚动容器 - 增强版表体滚动方案 */
.table-scroll-container {
  display: flex;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  background: var(--user-panel-bg, rgb(255 255 255 / 0.82));
  border-block: 1px solid var(--user-panel-border-soft, rgb(229 231 235));
}

.table-scroll-container :deep(.table-wrapper) {
  @apply flex-1 overflow-x-auto overflow-y-auto;
  /* 确保横向滚动条显示在最底部 */
  scrollbar-gutter: stable;
}

.table-scroll-container :deep(table) {
  @apply w-full;
  min-width: max-content; /* 关键：确保表格宽度根据内容撑开，从而触发横向滚动 */
  display: table; /* 使用标准 table 布局以支持 sticky 列 */
}

.table-scroll-container :deep(thead) {
  background: var(--user-panel-bg-muted, rgb(249 250 251 / 0.82));
  backdrop-filter: blur(10px);
}

.table-scroll-container :deep(tbody) {
  /* 保持默认 table-row-group 显示，不使用 block */
}

.table-scroll-container :deep(th) {
  padding: 14px 18px;
  color: var(--user-text-muted, rgb(75 85 99));
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  border-bottom: 1px solid var(--user-panel-border-soft, rgb(229 231 235));
}

.table-scroll-container :deep(td) {
  padding: 15px 18px;
  color: var(--user-text-body, rgb(55 65 81));
  font-size: 13px;
  border-bottom: 1px solid var(--user-panel-border-soft, rgb(243 244 246));
}

/* 移动端：恢复正常滚动 */
.table-page-layout.mobile-mode .table-scroll-container {
  height: auto;
  overflow: visible;
  background: transparent;
  border: 0;
}

.table-page-layout.mobile-mode .layout-section-scrollable {
  min-height: fit-content;
  flex: none;
}

.table-page-layout.mobile-mode .table-scroll-container :deep(.table-wrapper) {
  overflow: visible;
}

.table-page-layout.mobile-mode .table-scroll-container :deep(table) {
  display: table;
  min-width: 100%;
  flex: none;
}
</style>
