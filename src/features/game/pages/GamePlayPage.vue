<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/shared/stores/settingsStore'
import { RouteName } from '@/shared/router/routeNames'
import { useGameStore } from '../stores/gameStore'
import GameBoard from '../components/GameBoard.vue'
import GameHeader from '../components/GameHeader.vue'
import PlayerScoreboard from '../components/PlayerScoreboard.vue'
import GameOverPanel from '../components/GameOverPanel.vue'
import ThrowHistory from '../components/ThrowHistory.vue'
import BustModal from '../components/BustModal.vue'
import WinModal from '../components/WinModal.vue'

const game = useGameStore()
const settings = useSettingsStore()
const router = useRouter()

watch(
  () => game.isGameStarted,
  (started) => {
    if (!started) void router.replace({ name: RouteName.GameSetup })
  },
)
</script>

<template>
  <div class="row g-4">
    <div class="col-lg-7">
      <GameBoard />
    </div>

    <div class="col-lg-5">
      <GameHeader v-if="settings.boardView === 'circle'" />
      <PlayerScoreboard />
      <GameOverPanel v-if="game.isGameOver" />
      <ThrowHistory />
    </div>
  </div>

  <!-- Модалки (телепортируются в body) -->
  <BustModal />
  <WinModal />
</template>
