<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { throwScore } from '../domain/throws'

const game = useGameStore()

function badgeColorByMultiplier(multiplier?: number) {
  if (!multiplier || multiplier < 2) return undefined
  if (multiplier == 2) return 'green'
  return 'red'
}

const badges = computed(() =>
  Array.from({ length: game.dartsPerTurn }, (_, i) => {
    const dart = game.currentTurnThrows[i]
    return {
      index: i,
      value: dart ? throwScore(dart) : undefined,
      hasValue: dart !== undefined,
      color: badgeColorByMultiplier(dart?.multiplier),
    }
  }),
)
</script>

<template>
  <div class="throw-badges-row">
    <div
      v-for="badge in badges"
      :key="badge.index"
      class="throw-badge"
      :class="{ 'throw-active': badge.hasValue }"
      :style="{ background: badge.color }"
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
  background: #19875456;
  color: white;
  border-color: #146c4359;
  transform: translateY(-3px);
}
</style>
