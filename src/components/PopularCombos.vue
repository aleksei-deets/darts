<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { useI18n } from '@/composables/useI18n'
import { POPULAR_COMBOS } from '@/constants/dartboard'

const game = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div>
    <div class="text-muted mt-3 mb-1">{{ t('label_popular_combos') }}</div>
    <div class="d-flex flex-wrap justify-content-center">
      <button
        v-for="combo in POPULAR_COMBOS"
        :key="combo.label"
        class="btn btn-outline-dark combo-btn"
        :disabled="game.isProcessingTurn"
        @click="game.addPopularCombo(combo.throws)"
      >
        {{ combo.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.combo-btn {
  min-width: 140px;
  height: 55px;
  margin: 3px;
  font-weight: 700;
  border-radius: 10px;
}

@media (max-width: 576px) {
  .combo-btn {
    min-width: 130px;
  }
}
</style>
