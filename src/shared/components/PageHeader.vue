<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="mb-3">
    <h4 class="mb-1">{{ title }}</h4>
    <p v-if="subtitle" class="text-muted small mb-0">{{ subtitle }}</p>
  </header>
</template>
