<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useI18n } from '@/composables/useI18n'
import ThrowBadges from './ThrowBadges.vue'
import DartboardCircle from './DartboardCircle.vue'
import DartboardClassic from './DartboardClassic.vue'
import GameControls from './GameControls.vue'

const game = useGameStore()
const settings = useSettingsStore()
const { t } = useI18n()

const remainingDisplay = computed(() => {
  if (!game.currentPlayer || game.currentTurnThrows.length === 0) return null
  const remaining = game.currentRemaining
  if (remaining < 0) return { text: '➜ BUST', className: 'remaining-bust' }
  return { text: `➜ ${remaining}`, className: 'remaining-normal' }
})

function handleCircleScore(baseValue: number, zoneMultiplier: number): void {
  game.addScore(baseValue, zoneMultiplier)
}

function handleClassicScore(baseValue: number): void {
  game.addScore(baseValue)
}
</script>

<template>
  <div class="card shadow-sm border-0 mb-3">
    <div class="card-body text-center">
      <!-- Round display -->
      <div class="d-flex justify-content-between mb-2 text-muted">
        <span>
          {{ t('label_round') }}
          <span class="fw-bold">{{ game.roundNumber }}</span>
        </span>
      </div>

      <!-- Current player info -->
      <h2 v-if="game.currentPlayer" class="text-success fw-bold player-name">
        {{ game.currentPlayer.name }}
      </h2>

      <div class="d-flex justify-content-center align-items-baseline mb-3">
        <h1 class="display-1 fw-bold mb-0 player-score">
          {{ game.currentPlayer?.score ?? 0 }}
        </h1>
        <span
          v-if="remainingDisplay"
          class="fs-3 ms-2 fw-bold"
          :class="remainingDisplay.className"
        >
          {{ remainingDisplay.text }}
        </span>
      </div>

      <!-- Throw badges -->
      <ThrowBadges />

      <!-- Dartboard views -->
      <DartboardCircle
        v-show="settings.boardView === 'circle'"
        @score="handleCircleScore"
      />
      <DartboardClassic
        v-show="settings.boardView === 'classic'"
        @score="handleClassicScore"
      />

      <!-- Controls -->
      <GameControls />
    </div>
  </div>
</template>

<style scoped>
.player-name {
  margin-bottom: 0.25rem;
}

.player-score {
  line-height: 1;
}

.remaining-normal {
  color: #6c757d;
}

.remaining-bust {
  color: #dc3545;
}
</style>
