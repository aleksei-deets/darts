<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { POPULAR_CHECKOUTS } from '@/constants/dartboard'

const visible = defineModel<boolean>('visible', { required: true })
const { t } = useI18n()

function close(): void {
  visible.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sidebar">
      <div v-if="visible" class="sidebar-backdrop" @click.self="close">
        <div class="sidebar-panel">
          <!-- Заголовок -->
          <div class="sidebar-header">
            <h5 class="mb-0">{{ t('help_title') }}</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Close"
              @click="close"
            />
          </div>

          <!-- Содержимое -->
          <div class="sidebar-body">
            <div class="mb-4">
              <h6 class="help-heading">{{ t('help_h1') }}</h6>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="small text-muted" v-html="t('help_p1')" />
            </div>
            <div class="mb-4">
              <h6 class="help-heading">{{ t('help_h2') }}</h6>
              <p class="small text-muted">{{ t('help_p2') }}</p>
            </div>
            <div class="mb-4">
              <h6 class="help-heading">{{ t('help_h3') }}</h6>
              <p class="small text-muted">{{ t('help_p3') }}</p>
            </div>
            <div class="mb-4">
              <h6 class="help-heading">{{ t('help_h4') }}</h6>
              <p class="small text-muted">{{ t('help_p4') }}</p>
            </div>
            <div class="mb-4">
              <h6 class="help-heading">{{ t('help_h5') }}</h6>
              <p class="small text-muted">{{ t('help_p5') }}</p>
            </div>

            <hr />
            <div class="alert alert-light border small">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="t('help_tip')" />
            </div>

            <hr />
            <h6 class="mb-3">{{ t('help_checkouts_title') }}</h6>
            <div class="table-responsive">
              <table class="table table-sm table-striped border checkouts-table">
                <thead class="table-light">
                  <tr>
                    <th>{{ t('th_checkout_left') }}</th>
                    <th>{{ t('th_checkout_comb') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in POPULAR_CHECKOUTS" :key="row.remaining">
                    <td>{{ row.remaining }}</td>
                    <td>
                      {{ row.combination }}
                      <template v-if="row.remaining === 170">
                        ({{ t('checkout_max') }})
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
              <small class="text-muted">{{ t('help_checkouts_legend') }}</small>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1045;
  background: rgba(0, 0, 0, 0.4);
}

.sidebar-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 360px;
  max-width: 90vw;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: #0dcaf0;
  color: #fff;
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
}

.help-heading {
  color: #0aa2c0;
  border-left: 3px solid #0aa2c0;
  padding-left: 8px;
}

.checkouts-table {
  font-size: 0.8rem;
}

@media (min-width: 576px) {
  .sidebar-panel {
    width: 400px;
  }
}

/* Анимация выезда */
.sidebar-enter-active {
  transition: opacity 0.3s ease;
}

.sidebar-leave-active {
  transition: opacity 0.25s ease;
}

.sidebar-enter-active .sidebar-panel {
  transition: transform 0.3s ease;
}

.sidebar-leave-active .sidebar-panel {
  transition: transform 0.25s ease;
}

.sidebar-enter-from {
  opacity: 0;
}

.sidebar-enter-from .sidebar-panel {
  transform: translateX(100%);
}

.sidebar-leave-to {
  opacity: 0;
}

.sidebar-leave-to .sidebar-panel {
  transform: translateX(100%);
}
</style>
