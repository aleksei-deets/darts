<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useI18n } from '@/composables/useI18n'
import type { Player } from '@/types/game'

const game = useGameStore()
const { t } = useI18n()

const AWARD_CONFIG = [
  { icon: '🥇', cssClass: 'bg-gold' },
  { icon: '🥈', cssClass: 'bg-silver' },
  { icon: '🥉', cssClass: 'bg-bronze' }
] as const

interface PlayerRow {
  player: Player
  index: number
  isActive: boolean
  awardIcon: string
  awardClass: string
  statusText: string
  statusClass: string
  rowClass: string
}

const rows = computed<PlayerRow[]>(() =>
  game.players.map((player, index) => {
    let statusText: string
    let statusClass: string
    let rowClass = ''

    if (player.isFinished) {
      statusText = t('status_finished')
      statusClass = 'bg-secondary text-white'
      rowClass = 'finished-p'
    } else if (index === game.currentPlayerIndex) {
      statusText = t('status_playing')
      statusClass = 'bg-success text-white'
      rowClass = 'active-p'
    } else {
      statusText = t('status_waiting')
      statusClass = 'bg-light text-dark'
    }

    const placeIndex = player.place ? player.place - 1 : -1
    const award = placeIndex >= 0 && placeIndex < AWARD_CONFIG.length
      ? AWARD_CONFIG[placeIndex]!
      : null

    return {
      player,
      index,
      isActive: index === game.currentPlayerIndex && !player.isFinished,
      awardIcon: player.place ? (award?.icon ?? '🏅') : '',
      awardClass: player.place ? (award?.cssClass ?? 'bg-medal') : '',
      statusText,
      statusClass,
      rowClass
    }
  })
)
</script>

<template>
  <div class="card shadow-sm border-0 mb-3">
    <table class="table mb-0 align-middle">
      <thead class="table-dark">
        <tr>
          <th>{{ t('th_place') }}</th>
          <th>{{ t('th_player') }}</th>
          <th>{{ t('th_score') }}</th>
          <th>{{ t('th_status') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.index"
          :class="row.rowClass"
        >
          <td>
            <div
              v-if="row.player.place"
              class="award-badge"
              :class="row.awardClass"
            >
              {{ row.awardIcon }} {{ row.player.place }}
            </div>
            <span v-else class="text-muted">—</span>
          </td>
          <td class="fw-bold">{{ row.player.name }}</td>
          <td class="fs-5">{{ row.player.score }}</td>
          <td>
            <span class="status-badge" :class="row.statusClass">
              {{ row.statusText }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.active-p {
  background-color: #f0fff4 !important;
  border-left: 8px solid #198754;
}

.finished-p {
  background-color: #f8f9fa !important;
  color: #adb5bd;
}

.award-badge {
  padding: 0.4em 0.7em;
  border-radius: 50rem;
  display: inline-flex;
  align-items: center;
  min-width: 70px;
  gap: 5px;
}

.bg-gold {
  background-color: #fff9e6;
  color: #856404;
  border: 1px solid #ffeeba;
}

.bg-silver {
  background-color: #f8f9fa;
  color: #383d41;
  border: 1px solid #e2e3e5;
}

.bg-bronze {
  background-color: #fff5f0;
  color: #721c24;
  border: 1px solid #f8d7da;
}

.bg-medal {
  background-color: #f1f3f5;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.status-badge {
  padding: 0.4em 0.8em;
  border-radius: 20px;
  font-size: 0.7rem;
  text-transform: uppercase;
}
</style>
