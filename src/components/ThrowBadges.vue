<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { MAX_THROWS_PER_TURN } from '@/constants/dartboard'

const game = useGameStore()

const badges = computed(() =>
  Array.from({ length: MAX_THROWS_PER_TURN }, (_, i) => ({
    index: i,
    value: game.currentTurnThrows[i],
    hasValue: game.currentTurnThrows[i] !== undefined
  }))
)
</script>

<template>
  <div class="throw-badges-row">
    <div
      v-for="badge in badges"
      :key="badge.index"
      class="throw-badge"
      :class="{ 'throw-active': badge.hasValue }"
    >
      {{ badge.hasValue ? badge.value : '-' }}
    </div>
  </div>
</template>

<style scoped>
.throw-badges-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.throw-badge {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-weight: 900;
  border: 3px solid #dee2e6;
  transition: all 0.3s ease;
}

.throw-active {
  background: #198754;
  color: white;
  border-color: #146c43;
  transform: translateY(-3px);
}
</style>
