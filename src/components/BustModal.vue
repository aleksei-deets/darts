<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { useI18n } from '@/composables/useI18n'

const game = useGameStore()
const { t } = useI18n()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="game.bustModalVisible" class="modal-overlay">
        <div class="modal-panel modal-panel--bust">
          <h2 class="mb-0">{{ t('modal_bust') }}</h2>
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
  padding: 2rem 3rem;
  text-align: center;
}

.modal-panel--bust {
  background: #dc3545;
  color: #fff;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
