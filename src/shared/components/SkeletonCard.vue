<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    lines?: number
  }>(),
  { lines: 3 },
)

const LINE_WIDTHS = ['col-12', 'col-9', 'col-11', 'col-7', 'col-10'] as const

const lineClasses = computed(() =>
  Array.from({ length: props.lines }, (_, i) => LINE_WIDTHS[i % LINE_WIDTHS.length]),
)
</script>

<template>
  <section class="card shadow-sm border-0 h-100" aria-busy="true">
    <div class="card-header bg-white fw-bold">{{ title }}</div>
    <div class="card-body placeholder-glow" aria-hidden="true">
      <span
        v-for="(widthClass, index) in lineClasses"
        :key="index"
        class="placeholder d-block rounded mb-2"
        :class="widthClass"
      />
    </div>
  </section>
</template>
