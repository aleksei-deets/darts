<script setup lang="ts">
import { shallowRef } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useI18n } from '@/composables/useI18n'

const game = useGameStore()
const { t } = useI18n()

const playerNames = shallowRef('Игрок 1, Игрок 2')
const startScore = shallowRef(301)
const playToLast = shallowRef(true)

function onStartGame(): void {
  const trimmed = playerNames.value.trim()
  if (!trimmed) return

  const names = trimmed.split(',').map(n => n.trim()).filter(Boolean)
  if (names.length === 0) return

  game.startGame({
    playerNames: names,
    startScore: startScore.value,
    playToLast: playToLast.value
  })
}
</script>

<template>
  <div class="card shadow-sm mx-auto mb-4" style="max-width: 500px">
    <div class="card-body text-center">
      <h4 class="mb-3">{{ t('setup_title') }}</h4>

      <input
        v-model="playerNames"
        type="text"
        class="form-control mb-2"
        :placeholder="t('placeholder_names')"
      />

      <input
        v-model.number="startScore"
        type="number"
        class="form-control mb-3"
        min="1"
      />

      <div class="form-check mb-3 text-start">
        <input
          v-model="playToLast"
          class="form-check-input"
          type="checkbox"
          id="playToLast"
        />
        <label class="form-check-label" for="playToLast">
          {{ t('label_play_to_last') }}
        </label>
      </div>

      <button class="btn btn-primary w-100" @click="onStartGame">
        {{ t('btn_start') }}
      </button>
    </div>
  </div>
</template>
