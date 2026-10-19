import type { GameRules, TurnRecord } from '@/features/game/domain/types'

export type MatchMode = 'casual' | 'tournament'

/** 
 * `live` — партия сыграна в приложении и содержит ходы;
 * `manual` — внесены только места.
 */
export type MatchSource = 'live' | 'manual'

export interface MatchParticipant {
  name: string
  place: number | null
}

/** Неизменяемый снимок завершённой партии — единый источник данных для статистики, рейтинга и турниров. */
export interface MatchRecord {
  id: string
  mode: MatchMode
  source: MatchSource
  /** Дата проведения в ISO 8601; при ручном вводе указывается пользователем. */
  playedAt: string
  rules: GameRules | null
  participants: MatchParticipant[]
  turns: TurnRecord[]
  tournamentId: string | null
}
