<script setup lang="ts">
import { shallowRef } from 'vue'
import { useI18n } from '@/shared/i18n/useI18n'
import type { GameSetupConfig } from '../domain/types'
import { DEFAULT_GAME_RULES, DEFAULT_PLAYER_NAMES } from '../constants/rules'

const emit = defineEmits<{
  submit: [config: GameSetupConfig]
}>()

const { t } = useI18n()

const playerNames = shallowRef(DEFAULT_PLAYER_NAMES)
const startScore = shallowRef(DEFAULT_GAME_RULES.startScore)
const dartsPerTurn = shallowRef(DEFAULT_GAME_RULES.dartsPerTurn)

const playToLast = shallowRef(DEFAULT_GAME_RULES.playToLast)
const endWithDouble = shallowRef(DEFAULT_GAME_RULES.endWithDouble)

function onStartGame(): void {
  const trimmed = playerNames.value.trim()
  if (!trimmed) return

  const names = trimmed
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)
  if (names.length === 0) return

  emit('submit', {
    playerNames: names,
    startScore: startScore.value,
    dartsPerTurn: dartsPerTurn.value,
    playToLast: playToLast.value,
    endWithDouble: endWithDouble.value,
  })
}
</script>

<template>
  <div class="card shadow-sm mx-auto mb-4" style="max-width: 500px">
    <div class="card-body text-center">
      <h4 class="mb-3">{{ t('setup_title') }}</h4>
      <div>
        <label class="form-check-label" for="playToLast">
          {{ t('placeholder_names') }}
        </label>
        <input
          v-model="playerNames"
          type="text"
          class="form-control mb-2"
          :placeholder="t('placeholder_names')"
        />
      </div>
      <div>
        <label class="form-check-label" for="playToLast">
          {{ t('label_play_to_score') }}
        </label>
        <input
          v-model.number="startScore"
          type="number"
          class="form-control mb-3"
          min="1"
        />
      </div>
      <div>
        <label class="form-check-label" for="playToLast">
          {{ t('label_throw_per_leg') }}
        </label>
        <input
          v-model.number="dartsPerTurn"
          type="number"
          class="form-control mb-3"
          min="1"
          max="10"
          default="3"
        />
      </div>
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

      <div class="form-check mb-3 text-start">
        <input
          v-model="endWithDouble"
          class="form-check-input"
          type="checkbox"
          id="endWithDouble"
        />
        <label class="form-check-label" for="endWithDouble">
          {{ t('label_end_with_double') }}
        </label>
      </div>

      <button class="btn btn-primary w-100" @click="onStartGame">
        {{ t('btn_start') }}
      </button>
    </div>
  </div>
</template>
