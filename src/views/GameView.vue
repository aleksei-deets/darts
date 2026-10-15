<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useRemoteStore } from '@/stores/remoteStore'
import AppHeader from '@/components/AppHeader.vue'
import GameSetup from '@/components/GameSetup.vue'
import GameBoard from '@/components/GameBoard.vue'
import PlayerScoreboard from '@/components/PlayerScoreboard.vue'
import GameOverPanel from '@/components/GameOverPanel.vue'
import ThrowHistory from '@/components/ThrowHistory.vue'
import BustModal from '@/components/BustModal.vue'
import WinModal from '@/components/WinModal.vue'
import HelpSidebar from '@/components/HelpSidebar.vue'
import RemoteControlPanel from '@/components/RemoteControlPanel.vue'

const game = useGameStore()
const remote = useRemoteStore()
const helpVisible = shallowRef(false)

onMounted(() => {
  game.loadPersistedState()
  // Сразу занимаем комнату, чтобы QR-код можно было сканировать без лишних шагов.
  void remote.hostSession()
})

onUnmounted(() => {
  remote.teardown()
})
</script>

<template>
  <div class="container py-4">
    <AppHeader @toggle-help="helpVisible = !helpVisible" />

    <!-- Экран настройки -->
    <GameSetup v-if="!game.isGameStarted" />

    <!-- Игровой экран -->
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

    <!-- Модалки (телепортируются в body) -->
    <BustModal />
    <WinModal />
    <HelpSidebar v-model:visible="helpVisible" />

    <RemoteControlPanel />
  </div>
</template>
