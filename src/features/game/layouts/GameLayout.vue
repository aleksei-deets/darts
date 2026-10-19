<script setup lang="ts">
import RemoteControlPanel from '@/features/remote/components/RemoteControlPanel.vue'
import { useRemoteHost } from '@/features/remote/composables/useRemoteHost'

useRemoteHost()
</script>

<template>
  <RouterView />
  <RemoteControlPanel />
</template>
