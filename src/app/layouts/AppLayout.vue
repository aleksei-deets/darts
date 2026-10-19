<script setup lang="ts">
import { shallowRef } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import HelpSidebar from '@/features/game/components/HelpSidebar.vue'

const helpVisible = shallowRef(false)
</script>

<template>
  <div class="container py-2">
    <AppHeader @toggle-help="helpVisible = !helpVisible" />

    <RouterView />

    <HelpSidebar v-model:visible="helpVisible" />
  </div>
</template>
