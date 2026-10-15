import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import type { Player, HistoryEntry, GameSetupConfig } from '@/types/game'
import {
  MAX_THROWS_PER_TURN,
  BUST_MODAL_DURATION_MS,
  WIN_MODAL_DURATION_MS,
  AUTO_FINISH_DELAY_MS
} from '@/constants/dartboard'

const STORAGE_KEY = 'dartsGameState'

interface PersistedState {
  players: Player[]
  currentPlayerIndex: number
  currentTurnThrows: number[]
  currentPlace: number
  someoneWonInThisRound: boolean
  roundNumber: number
  isGameOver: boolean
  isGameStarted: boolean
  history: HistoryEntry[]
  playToLast: boolean
  startScore: number
}

export const useGameStore = defineStore('game', () => {
  // ─── Основное состояние
  const players = ref<Player[]>([])
  const currentPlayerIndex = shallowRef(0)
  const currentTurnThrows = ref<number[]>([])
  const currentPlace = shallowRef(1)
  const someoneWonInThisRound = shallowRef(false)
  const roundNumber = shallowRef(1)
  const isGameOver = shallowRef(false)
  const isGameStarted = shallowRef(false)
  const history = ref<HistoryEntry[]>([])
  const playToLast = shallowRef(true)
  const startScore = shallowRef(301)

  // ─── Множитель (только для классической доски)
  const multiplier = shallowRef(1)

  // ─── Состояние модальных окон
  const bustModalVisible = shallowRef(false)
  const winModalData = shallowRef<{ name: string; place: number } | null>(null)

  // Блокирует набор очков во время анимаций модалок или автозавершения хода
  const isProcessingTurn = shallowRef(false)

  // ─── Вычисляемые свойства
  const currentPlayer = computed<Player | null>(() =>
    isGameStarted.value ? (players.value[currentPlayerIndex.value] ?? null) : null
  )

  const activePlayers = computed(() =>
    players.value.filter(p => !p.isFinished)
  )

  const currentTurnSum = computed(() =>
    currentTurnThrows.value.reduce((a, b) => a + b, 0)
  )

  const currentRemaining = computed(() => {
    if (!currentPlayer.value) return 0
    return currentPlayer.value.score - currentTurnSum.value
  })

  // ─── Действия

  function startGame(config: GameSetupConfig): void {
    players.value = config.playerNames.map(name => ({
      name,
      score: config.startScore,
      isFinished: false,
      place: null
    }))
    startScore.value = config.startScore
    playToLast.value = config.playToLast
    currentPlayerIndex.value = 0
    currentPlace.value = 1
    roundNumber.value = 1
    someoneWonInThisRound.value = false
    currentTurnThrows.value = []
    multiplier.value = 1
    isGameOver.value = false
    isGameStarted.value = true
    isProcessingTurn.value = false
    history.value = []
    bustModalVisible.value = false
    winModalData.value = null
    persistState()
  }

  function setMultiplier(m: number): void {
    multiplier.value = multiplier.value === m ? 1 : m
  }

  function resolveScore(baseValue: number, zoneMultiplier?: number): number {
    const effective = zoneMultiplier ?? multiplier.value
    if (baseValue === 0) return 0
    if (baseValue === 25) return effective === 2 ? 50 : 25
    if (baseValue === 50) return 50
    return baseValue * effective
  }

  function addScore(baseValue: number, zoneMultiplier?: number): void {
    if (currentTurnThrows.value.length >= MAX_THROWS_PER_TURN) return
    if (isGameOver.value || isProcessingTurn.value) return
    if (!currentPlayer.value || currentPlayer.value.isFinished) return

    const finalScore = resolveScore(baseValue, zoneMultiplier)
    currentTurnThrows.value.push(finalScore)
    multiplier.value = 1

    if (currentTurnThrows.value.length === MAX_THROWS_PER_TURN) {
      isProcessingTurn.value = true
      setTimeout(() => finishTurn(), AUTO_FINISH_DELAY_MS)
    }

    persistState()
  }

  function addPopularCombo(combo: readonly number[]): void {
    if (combo.length !== MAX_THROWS_PER_TURN) return
    if (isGameOver.value || isProcessingTurn.value) return
    if (!currentPlayer.value || currentPlayer.value.isFinished) return

    if (currentTurnThrows.value.length > 0) resetTurn()
    // Пресеты — это готовые значения бросков, множитель к ним не применяется.
    combo.forEach(value => addScore(value, 1))
  }

  function finishTurn(): void {
    const player = currentPlayer.value
    if (!player) return

    const sum = currentTurnSum.value
    const prevScore = player.score

    if (player.score - sum >= 0) {
      player.score -= sum

      history.value.unshift({
        round: roundNumber.value,
        playerName: player.name,
        throws: [...currentTurnThrows.value],
        sum,
        remaining: player.score
      })

      if (player.score === 0) {
        player.isFinished = true
        player.place = currentPlace.value
        someoneWonInThisRound.value = true

        winModalData.value = { name: player.name, place: player.place }
        currentTurnThrows.value = []
        persistState()

        setTimeout(() => {
          winModalData.value = null
          isProcessingTurn.value = false
          advanceToNextPlayer()
        }, WIN_MODAL_DURATION_MS)
        return
      }

      currentTurnThrows.value = []
      isProcessingTurn.value = false
      advanceToNextPlayer()
    } else {
      history.value.unshift({
        round: roundNumber.value,
        playerName: player.name,
        throws: [...currentTurnThrows.value],
        sum: 'BUST',
        remaining: prevScore
      })

      bustModalVisible.value = true
      persistState()

      setTimeout(() => {
        bustModalVisible.value = false
        currentTurnThrows.value = []
        isProcessingTurn.value = false
        advanceToNextPlayer()
      }, BUST_MODAL_DURATION_MS)
    }
  }

  function advanceToNextPlayer(): void {
    const oldIdx = currentPlayerIndex.value
    const nextIdx = (oldIdx + 1) % players.value.length

    if (nextIdx <= oldIdx) {
      if (someoneWonInThisRound.value) {
        currentPlace.value++
        someoneWonInThisRound.value = false
      }
      roundNumber.value++

      const active = activePlayers.value
      if (!playToLast.value && active.length === 1) {
        active[0]!.isFinished = true
        active[0]!.place = currentPlace.value
        endGame()
        return
      }
    }

    currentPlayerIndex.value = nextIdx

    if (activePlayers.value.length === 0) {
      endGame()
      return
    }

    if (players.value[currentPlayerIndex.value]?.isFinished) {
      advanceToNextPlayer()
      return
    }

    persistState()
  }

  function endGame(): void {
    isGameOver.value = true
    persistState()
  }

  function undoLastThrow(): void {
    if (isProcessingTurn.value) return
    currentTurnThrows.value.pop()
    persistState()
  }

  function resetTurn(): void {
    if (isProcessingTurn.value) return
    currentTurnThrows.value = []
    multiplier.value = 1
    persistState()
  }

  function rematch(): void {
    if (players.value.length === 0) return
    startGame({
      playerNames: players.value.map(p => p.name),
      startScore: startScore.value,
      playToLast: playToLast.value
    })
  }

  function newGame(): void {
    localStorage.removeItem(STORAGE_KEY)
    players.value = []
    currentPlayerIndex.value = 0
    multiplier.value = 1
    currentTurnThrows.value = []
    currentPlace.value = 1
    someoneWonInThisRound.value = false
    roundNumber.value = 1
    isGameOver.value = false
    isGameStarted.value = false
    isProcessingTurn.value = false
    history.value = []
    bustModalVisible.value = false
    winModalData.value = null
  }

  // ─── Сохранение состояния

  function persistState(): void {
    const state: PersistedState = {
      players: players.value,
      currentPlayerIndex: currentPlayerIndex.value,
      currentTurnThrows: currentTurnThrows.value,
      currentPlace: currentPlace.value,
      someoneWonInThisRound: someoneWonInThisRound.value,
      roundNumber: roundNumber.value,
      isGameOver: isGameOver.value,
      isGameStarted: isGameStarted.value,
      history: history.value,
      playToLast: playToLast.value,
      startScore: startScore.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  function loadPersistedState(): boolean {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false

    try {
      const state: PersistedState = JSON.parse(raw)
      players.value = state.players
      currentPlayerIndex.value = state.currentPlayerIndex
      currentTurnThrows.value = state.currentTurnThrows
      currentPlace.value = state.currentPlace
      someoneWonInThisRound.value = state.someoneWonInThisRound
      roundNumber.value = state.roundNumber
      isGameOver.value = state.isGameOver
      isGameStarted.value = state.isGameStarted
      history.value = state.history ?? []
      playToLast.value = state.playToLast ?? true
      startScore.value = state.startScore ?? 301
      multiplier.value = 1
      isProcessingTurn.value = false

      // Перезагрузка при открытой модалке победы сбрасывает таймер перехода,
      // поэтому ход остался бы на уже финишировавшем игроке и addScore() отклонял бы все броски.
      // Повторяем этот переход.
      if (
        isGameStarted.value &&
        !isGameOver.value &&
        players.value.length > 0 &&
        currentPlayer.value?.isFinished
      ) {
        advanceToNextPlayer()
      }

      return true
    } catch {
      return false
    }
  }

  return {
    players,
    currentPlayerIndex,
    currentTurnThrows,
    currentPlace,
    roundNumber,
    isGameOver,
    isGameStarted,
    history,
    playToLast,
    startScore,
    multiplier,
    bustModalVisible,
    winModalData,
    isProcessingTurn,

    currentPlayer,
    activePlayers,
    currentTurnSum,
    currentRemaining,

    startGame,
    setMultiplier,
    addScore,
    addPopularCombo,
    undoLastThrow,
    resetTurn,
    rematch,
    newGame,
    loadPersistedState
  }
})
