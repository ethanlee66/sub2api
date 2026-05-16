<template>
  <span
    class="rotating-text"
    :class="mainClassName"
    :style="animationStyle"
    aria-live="polite"
  >
    <span :key="activeText" class="rotating-text-item" :class="elementLevelClassName">
      <span
        v-for="(segment, index) in activeSegments"
        :key="`${activeText}-${segment}-${index}`"
        class="rotating-text-segment"
        :class="splitLevelClassName"
        :style="{ animationDelay: `${index * staggerDuration}ms` }"
      >
        {{ segment }}
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    texts: readonly string[]
    rotationInterval?: number
    staggerDuration?: number
    transitionDuration?: number
    splitBy?: 'characters' | 'words'
    mainClassName?: string
    splitLevelClassName?: string
    elementLevelClassName?: string
  }>(),
  {
    rotationInterval: 2600,
    staggerDuration: 28,
    transitionDuration: 420,
    splitBy: 'characters',
    mainClassName: '',
    splitLevelClassName: '',
    elementLevelClassName: ''
  }
)

const activeIndex = ref(0)
let intervalId: number | undefined

const activeText = computed(() => props.texts[activeIndex.value] || '')
const animationStyle = computed(() => ({
  '--rotating-text-duration': `${props.transitionDuration}ms`
}))

const activeSegments = computed(() => {
  if (props.splitBy === 'words') {
    return activeText.value.split(/(\s+)/).filter(Boolean)
  }

  return Array.from(activeText.value)
})

onMounted(() => {
  if (props.texts.length <= 1) return

  intervalId = window.setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.texts.length
  }, props.rotationInterval)
})

onBeforeUnmount(() => {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId)
  }
})
</script>

<style scoped>
.rotating-text {
  display: inline-grid;
  contain: content;
}

.rotating-text-item {
  display: inline-flex;
  white-space: nowrap;
}

.rotating-text-segment {
  display: inline-block;
  animation: rotating-text-rise var(--rotating-text-duration, 420ms) cubic-bezier(0.2, 0, 0, 1) both;
}

@keyframes rotating-text-rise {
  from {
    opacity: 0.62;
    transform: translateY(0.22em) rotateX(-36deg);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rotating-text-segment {
    animation: none;
  }
}
</style>
