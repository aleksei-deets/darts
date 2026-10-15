<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { useRemoteStore } from '@/stores/remoteStore'
import { useI18n } from '@/composables/useI18n'
import { normalizeTransportKind } from '@/services/remote'

const route = useRoute()
const remote = useRemoteStore()
const { t } = useI18n()

const scoreInput = shallowRef<number | null>(null)

const roomFromLink = computed(() =>
  typeof route.query.room === 'string' ? route.query.room : ''
)

const hasRoom = computed(() => Boolean(roomFromLink.value || remote.roomId))

const transportLabel = computed(() =>
  remote.transportKind === 'firebase'
    ? t('remote_transport_firebase')
    : t('remote_transport_peerjs')
)

const statusLabel = computed(() => {
  switch (remote.status) {
    case 'connecting':
      return t('remote_status_connecting')
    case 'connected':
      return `${t('remote_status_connected')} · ${transportLabel.value}`
    case 'error':
      return t('remote_status_error')
    default:
      return t('remote_status_idle')
  }
})

const statusClass = computed(() => {
  switch (remote.status) {
    case 'connected':
      return 'bg-success'
    case 'error':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
})

function connect(): void {
  if (!hasRoom.value) return

  const transportParam =
    typeof route.query.transport === 'string'
      ? normalizeTransportKind(route.query.transport)
      : undefined

  void remote.joinSession({
    roomId: roomFromLink.value || undefined,
    transport: transportParam
  })
}

function sendTypedScore(): void {
  const value = scoreInput.value
  if (value === null || !Number.isFinite(value)) return
  void remote.sendScore(value)
  scoreInput.value = null
}

onMounted(connect)
onUnmounted(() => remote.teardown())
</script>

<template>
  <div class="remote-screen">
    <div class="text-center mb-4">
      <h5 class="text-muted">{{ t('remote_title') }}</h5>
      <div class="display-1 fw-bold my-3">{{ remote.lastSentScore ?? 0 }}</div>
      <div class="badge" :class="statusClass">{{ statusLabel }}</div>
    </div>

    <div v-if="!hasRoom" class="alert alert-warning text-center">
      {{ t('remote_no_room') }}
    </div>

    <template v-else>
      <div v-if="remote.status === 'error'" class="text-center mb-4">
        <p class="small text-danger">{{ remote.errorMessage }}</p>
        <button class="btn btn-outline-secondary" @click="connect">
          {{ t('remote_btn_retry') }}
        </button>
      </div>

      <fieldset :disabled="!remote.isConnected">
        <div class="mb-4">
          <label class="form-label text-muted small" for="remoteScore">
            {{ t('remote_label_sum') }}
          </label>
          <input
            id="remoteScore"
            v-model.number="scoreInput"
            type="number"
            inputmode="numeric"
            class="form-control form-control-lg text-center mb-3 remote-input"
            placeholder="0"
            @keyup.enter="sendTypedScore"
          />
          <button class="btn btn-primary btn-lg w-100 py-3 mb-2" @click="sendTypedScore">
            {{ t('remote_btn_send') }}
          </button>
          <button class="btn btn-outline-warning w-100" @click="remote.sendUndo()">
            {{ t('remote_btn_undo') }}
          </button>
        </div>

        <div class="row g-2">
          <div class="col-6">
            <button class="btn btn-light w-100 py-3" @click="remote.sendScore(25)">
              {{ t('remote_btn_bull_25') }}
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-light w-100 py-3" @click="remote.sendScore(50)">
              {{ t('remote_btn_bull_50') }}
            </button>
          </div>
          <div class="col-12">
            <button class="btn btn-light w-100 py-2" @click="remote.sendScore(0)">
              {{ t('remote_btn_miss') }}
            </button>
          </div>
        </div>
      </fieldset>
    </template>
  </div>
</template>

<style scoped>
.remote-screen {
  min-height: 100vh;
  padding: 1.5rem;
  background: #fff;
}

.remote-input {
  font-size: 2.5rem;
}
</style>
