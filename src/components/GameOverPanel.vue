<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { useI18n } from '@/composables/useI18n'

const game = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div class="p-4 bg-white shadow rounded text-center mb-3">
    <h3 class="text-success mb-3">{{ t('msg_game_over') }}</h3>
    <button class="btn btn-primary btn-lg me-2" @click="game.rematch()">
      {{ t('btn_rematch') }}
    </button>
    <button class="btn btn-outline-primary btn-lg" @click="game.newGame()">
      {{ t('btn_new_game_big') }}
    </button>
  </div>
</template>
