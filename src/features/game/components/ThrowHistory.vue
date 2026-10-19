<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { useI18n } from '@/shared/i18n/useI18n'
import { throwScore } from '../domain/throws'

const game = useGameStore()
const { t } = useI18n()
</script>

<template>
  <div class="card shadow-sm border-0">
    <div class="card-header bg-white fw-bold">
      {{ t('header_history') }}
    </div>
    <div class="card-body p-0 history-scroll">
      <table class="table table-sm mb-0">
        <thead class="table-light">
          <tr>
            <th>{{ t('th_round') }}</th>
            <th>{{ t('th_player') }}</th>
            <th>{{ t('th_throws') }}</th>
            <th>{{ t('th_sum') }}</th>
            <th>{{ t('th_remaining') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in game.history" :key="index">
            <td>{{ entry.round }}</td>
            <td>{{ entry.playerName }}</td>
            <td class="text-muted">
              <template v-for="(dart, dartIndex) in entry.throws" :key="dartIndex">
                <span v-if="dartIndex > 0">, </span>
                <span
                  :class="{
                    double: dart.multiplier === 2,
                    triple: dart.multiplier === 3,
                  }"
                >
                  {{ throwScore(dart) }}
                </span>
              </template>
            </td>
            <td
              class="fw-bold"
              :class="entry.sum === 'BUST' ? 'text-danger' : 'text-primary'"
            >
              {{ entry.sum }}
            </td>
            <td class="fw-bold">{{ entry.remaining }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.history-scroll {
  max-height: 400px;
  overflow-y: auto;
  font-size: 0.85rem;
}

.table-sm td {
  padding: 4px 8px;
}

.double {
  color: green;
}

.triple {
  color: red;
}
</style>
