import type { DartThrow, Player, TurnRecord } from '../domain/types'
import { DEFAULT_GAME_RULES } from '../constants/rules'

const STORAGE_KEY = 'dartsGameState'
const SCHEMA_VERSION = 2

export interface GameStateSnapshot {
  players: Player[]
  currentPlayerIndex: number
  currentTurnThrows: DartThrow[]
  currentPlace: number
  someoneWonInThisRound: boolean
  roundNumber: number
  isGameOver: boolean
  isGameStarted: boolean
  history: TurnRecord[]
  playToLast: boolean
  startScore: number
  endWithDouble: boolean
  dartsPerTurn: number
}

interface StoredGameStateV2 extends GameStateSnapshot {
  version: typeof SCHEMA_VERSION
}

interface StoredGameStateV1
  extends Omit<
    GameStateSnapshot,
    'history' | 'dartsPerTurn' | 'playToLast' | 'startScore' | 'endWithDouble'
  > {
  history?: Array<Omit<TurnRecord, 'throws'> & { throws: string[] }>
  playToLast?: boolean
  startScore?: number
  endWithDouble?: boolean
  maxThrowsPerLeg?: number
}

const LEGACY_THROW_PATTERN = /^(?:([DT])|(\d+)x)?(-?\d+(?:\.\d+)?)$/

function parseLegacyThrow(label: string): DartThrow {
  const match = LEGACY_THROW_PATTERN.exec(label)
  if (!match) return { zone: Number(label) || 0, multiplier: 1 }

  const [, prefix, factor, zone] = match
  const multiplier =
    prefix === 'D' ? 2 : prefix === 'T' ? 3 : factor ? Number(factor) : 1
  return { zone: Number(zone), multiplier }
}

function migrateFromV1(legacy: StoredGameStateV1): GameStateSnapshot {
  const { history, maxThrowsPerLeg, ...rest } = legacy
  return {
    ...rest,
    history: (history ?? []).map((turn) => ({
      ...turn,
      throws: turn.throws.map(parseLegacyThrow),
    })),
    playToLast: legacy.playToLast ?? DEFAULT_GAME_RULES.playToLast,
    startScore: legacy.startScore ?? DEFAULT_GAME_RULES.startScore,
    endWithDouble: legacy.endWithDouble ?? false,
    dartsPerTurn: maxThrowsPerLeg ?? DEFAULT_GAME_RULES.dartsPerTurn,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function loadGameState(): GameStateSnapshot | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || !Array.isArray(parsed.players)) return null

    if (parsed.version === SCHEMA_VERSION) {
      const { version, ...state } = parsed as unknown as StoredGameStateV2
      return state
    }
    return migrateFromV1(parsed as unknown as StoredGameStateV1)
  } catch {
    return null
  }
}

export function saveGameState(state: GameStateSnapshot): void {
  const stored: StoredGameStateV2 = { version: SCHEMA_VERSION, ...state }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

export function clearGameState(): void {
  localStorage.removeItem(STORAGE_KEY)
}
