import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import type { Language, BoardView } from '@/types/game'

const STORAGE_KEY_LANG = 'dartsLang'
const STORAGE_KEY_BOARD_VIEW = 'dartsBoardView'

export const useSettingsStore = defineStore('settings', () => {
  const language = shallowRef<Language>(
    (localStorage.getItem(STORAGE_KEY_LANG) as Language | null) ?? 'ru'
  )

  const boardView = shallowRef<BoardView>(
    (localStorage.getItem(STORAGE_KEY_BOARD_VIEW) as BoardView | null) ?? 'classic'
  )

  function setLanguage(lang: Language): void {
    language.value = lang
    localStorage.setItem(STORAGE_KEY_LANG, lang)
  }

  function setBoardView(view: BoardView): void {
    boardView.value = view
    localStorage.setItem(STORAGE_KEY_BOARD_VIEW, view)
  }

  return {
    language,
    boardView,
    setLanguage,
    setBoardView
  }
})
