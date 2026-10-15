<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { CLASSIC_BOARD_VALUES } from '@/constants/dartboard'
import PopularCombos from './PopularCombos.vue'

const game = useGameStore()

const emit = defineEmits<{
  score: [baseValue: number]
}>()

const isMultX2 = computed(() => game.multiplier === 2)
const isMultX3 = computed(() => game.multiplier === 3)

function onMultiplierClick(m: number): void {
  game.setMultiplier(m)
}

function onValueClick(value: number): void {
  emit('score', value)
}
</script>

<template>
  <div class="dartboard-classic">
    <!-- Управление множителем -->
    <div class="mb-3">
      <button
        class="btn multiplier-btn"
        :class="isMultX2 ? 'btn-danger' : 'btn-outline-danger'"
        @click="onMultiplierClick(2)"
      >
        X2
      </button>
      <button
        class="btn multiplier-btn"
        :class="isMultX3 ? 'btn-danger' : 'btn-outline-danger'"
        @click="onMultiplierClick(3)"
      >
        X3
      </button>
      <button
        class="btn btn-secondary multiplier-btn"
        @click="onValueClick(0)"
      >
        0
      </button>
    </div>

    <!-- Сетка чисел -->
    <div class="d-flex flex-wrap justify-content-center">
      <button
        v-for="value in CLASSIC_BOARD_VALUES"
        :key="value"
        class="btn btn-outline-dark dart-btn"
        @click="onValueClick(value)"
      >
        {{ value }}
      </button>
      <button class="btn btn-dark dart-btn" @click="onValueClick(25)">25</button>
      <button class="btn btn-dark dart-btn" @click="onValueClick(50)">50</button>
    </div>

    <PopularCombos />
  </div>
</template>

<style scoped>
.dart-btn {
  width: 55px;
  height: 55px;
  margin: 3px;
  font-weight: bold;
  border-radius: 10px;
}

.multiplier-btn {
  width: 80px;
  height: 55px;
  margin: 3px;
  font-weight: 800;
  border-radius: 10px;
}
</style>
