<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '@/shared/stores/settingsStore'
import { useI18n } from '@/shared/i18n/useI18n'
import { RouteName } from '@/shared/router/routeNames'

const settings = useSettingsStore()
const route = useRoute()
const { t } = useI18n()

const emit = defineEmits<{
  toggleHelp: []
}>()

const isMenuPage = computed(() => route.name === RouteName.Menu)
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <div class="d-flex align-items-center gap-2">
      <!-- Возврат в главное меню -->
      <RouterLink
        v-if="!isMenuPage"
        :to="{ name: RouteName.Menu }"
        class="btn btn-sm btn-outline-dark"
      >
        {{ t('nav_menu') }}
      </RouterLink>

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
