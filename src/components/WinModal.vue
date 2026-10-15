<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { useI18n } from '@/composables/useI18n'

const game = useGameStore()
const { t } = useI18n()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="game.winModalData" class="modal-overlay">
        <div class="modal-panel modal-panel--win">
          <h2>{{ t('modal_win') }}</h2>
          <h1 class="display-3 fw-bold">{{ game.winModalData.name }}</h1>
          <p class="fs-4 mb-0">
            {{ t('msg_win_place', { place: game.winModalData.place }) }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-panel {
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  padding: 3rem;
  text-align: center;
}

.modal-panel--win {
  background: #198754;
  color: #fff;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
