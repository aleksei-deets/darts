<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
  icon: string
  title: string
  description: string
  primary?: boolean
}>()
</script>

<template>
  <RouterLink
    :to="to"
    class="menu-tile card shadow-sm text-decoration-none"
    :class="{ 'menu-tile--primary': primary }"
  >
    <div class="card-body d-flex align-items-center gap-3">
      <span class="menu-tile-icon" aria-hidden="true">{{ icon }}</span>
      <span class="d-flex flex-column text-start">
        <span class="menu-tile-title">{{ title }}</span>
        <span class="menu-tile-description">{{ description }}</span>
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.menu-tile {
  border: 1px solid #dee2e6;
  color: #212529;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.menu-tile:hover,
.menu-tile:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.12) !important;
}

.menu-tile--primary {
  border-color: #cdebd9;
  background: linear-gradient(180deg, #f2fbf5 0%, #eaf8f0 100%);
  color: #146c43;
}

.menu-tile-icon {
  font-size: 2rem;
  line-height: 1;
}

.menu-tile-title {
  font-size: 1.25rem;
  font-weight: 800;
}

.menu-tile-description {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>
