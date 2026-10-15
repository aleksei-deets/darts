<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useRemoteStore } from '@/stores/remoteStore'
import { useI18n } from '@/composables/useI18n'
import { useQrCode } from '@/composables/useQrCode'
import type { RemoteTransportKind } from '@/types/remote'

const remote = useRemoteStore()
const { t } = useI18n()

const isOpen = shallowRef(false)

// Рендерим код только когда карточка открыта — так же откладывается загрузка `qrcode`.
const { dataUrl: qrDataUrl } = useQrCode(() => (isOpen.value ? remote.remoteUrl : ''))

const transportKind = computed<RemoteTransportKind>({
  get: () => remote.transportKind,
  set: value => {
    void remote.setTransportKind(value)
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

function transportLabel(kind: RemoteTransportKind): string {
  return kind === 'firebase'
    ? t('remote_transport_firebase')
    : t('remote_transport_peerjs')
}

function onRegenerateRoom(): void {
  if (!confirm(t('remote_confirm_new_id'))) return
  void remote.regenerateRoom()
}
</script>

<template>
  <div class="remote-panel">
    <div v-if="isOpen" class="card shadow mb-2 remote-card">
      <div class="card-body p-2 text-center">
        <img
          v-if="qrDataUrl"
          :src="qrDataUrl"
          :alt="remote.remoteUrl"
          class="remote-qr"
        />
        <div v-else class="remote-qr-placeholder" />

        <div class="mt-1">
          <span class="badge" :class="statusClass">
            {{ transportLabel(remote.transportKind) }}
          </span>
        </div>

        <hr class="my-2" />

        <button
          class="btn btn-sm btn-outline-danger w-100 remote-small-btn"
          @click="onRegenerateRoom"
        >
          {{ t('remote_new_id') }}
        </button>

        <select
          v-if="remote.availableTransports.length > 1"
          v-model="transportKind"
          class="form-select form-select-sm mt-2"
        >
          <option v-for="kind in remote.availableTransports" :key="kind" :value="kind">
            {{ transportLabel(kind) }}
          </option>
        </select>
      </div>
    </div>

    <button
      class="btn btn-dark shadow-lg rounded-circle p-3"
      :title="t('remote_toggle')"
      :aria-label="t('remote_toggle')"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      📱
    </button>
  </div>
</template>

<style scoped>
.remote-panel {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 1050;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.remote-card {
  width: 160px;
}

.remote-qr,
.remote-qr-placeholder {
  width: 140px;
  height: 140px;
  margin: 0 auto;
  display: block;
}

.remote-qr-placeholder {
  background: #f1f3f5;
  border-radius: 6px;
}

.remote-small-btn {
  font-size: 10px;
}
</style>
