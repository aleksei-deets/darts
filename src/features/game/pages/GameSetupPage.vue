<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouteName } from '@/shared/router/routeNames'
import { useGameStore } from '../stores/gameStore'
import type { GameSetupConfig } from '../domain/types'
import GameSetupForm from '../components/GameSetupForm.vue'

const game = useGameStore()
const router = useRouter()

function onSubmit(config: GameSetupConfig): void {
  game.startGame(config)
  void router.replace({ name: RouteName.GamePlay })
}
</script>

<template>
  <GameSetupForm @submit="onSubmit" />
</template>
