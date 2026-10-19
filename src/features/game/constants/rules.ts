import type { GameRules } from '../domain/types'

export const DEFAULT_GAME_RULES: Readonly<GameRules> = {
  startScore: 301,
  dartsPerTurn: 3,
  playToLast: true,
  endWithDouble: true,
}

export const DEFAULT_PLAYER_NAMES = 'Игрок 1, Игрок 2'

export const BUST_MODAL_DURATION_MS = 200
export const WIN_MODAL_DURATION_MS = 300
export const AUTO_FINISH_DELAY_MS = 400
