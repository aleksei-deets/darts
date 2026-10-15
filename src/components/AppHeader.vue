<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'
import { useI18n } from '@/composables/useI18n'

const settings = useSettingsStore()
const { t } = useI18n()

const emit = defineEmits<{
  toggleHelp: []
}>()
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <!-- Переключатель языка -->
    <div class="btn-group btn-group-sm">
      <button
        class="btn btn-outline-secondary"
        :class="{ active: settings.language === 'ru' }"
        @click="settings.setLanguage('ru')"
      >
        RU
      </button>
      <button
        class="btn btn-outline-secondary"
        :class="{ active: settings.language === 'en' }"
        @click="settings.setLanguage('en')"
      >
        EN
      </button>
    </div>

    <!-- Переключатель вида доски -->
    <div class="btn-group btn-group-sm" role="group">
      <input
        type="radio"
        class="btn-check"
        name="boardView"
        id="viewCircle"
        :checked="settings.boardView === 'circle'"
        @change="settings.setBoardView('circle')"
      />
      <label class="btn btn-outline-primary" for="viewCircle">
        🎯 {{ t('view_circle') }}
      </label>

      <input
        type="radio"
        class="btn-check"
        name="boardView"
        id="viewClassic"
        :checked="settings.boardView === 'classic'"
        @change="settings.setBoardView('classic')"
      />
      <label class="btn btn-outline-primary" for="viewClassic">
        🔢 {{ t('view_classic') }}
      </label>
    </div>

    <!-- Кнопка справки -->
    <button
      class="btn btn-sm btn-outline-info"
      @click="emit('toggleHelp')"
    >
      {{ t('nav_help') }}
    </button>
  </div>
</template>
