<script setup lang="ts">
import { shallowRef, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import AppHeader from './components/AppHeader.vue'
import GameSetup from './components/GameSetup.vue'
import GameBoard from './components/GameBoard.vue'
import PlayerScoreboard from './components/PlayerScoreboard.vue'
import GameOverPanel from './components/GameOverPanel.vue'
import ThrowHistory from './components/ThrowHistory.vue'
import BustModal from './components/BustModal.vue'
import WinModal from './components/WinModal.vue'
import HelpSidebar from './components/HelpSidebar.vue'

const game = useGameStore()
const helpVisible = shallowRef(false)

onMounted(() => {
  game.loadPersistedState()
})
</script>

<template>
  <div class="container py-4">
    <AppHeader @toggle-help="helpVisible = !helpVisible" />

    <!-- Setup screen -->
    <GameSetup v-if="!game.isGameStarted" />

    <!-- Game screen -->
    <div v-else class="row g-4">
      <div class="col-lg-7">
        <GameBoard />
      </div>

      <div class="col-lg-5">
        <PlayerScoreboard />
        <GameOverPanel v-if="game.isGameOver" />
        <ThrowHistory />
      </div>
    </div>

    <!-- Modals (teleported to body) -->
    <BustModal />
    <WinModal />
    <HelpSidebar v-model:visible="helpVisible" />
  </div>
</template>
