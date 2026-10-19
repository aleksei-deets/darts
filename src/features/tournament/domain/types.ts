export type TournamentStatus = 'draft' | 'active' | 'finished'

export interface BracketSlot {
  id: string
  round: number
  participants: string[]
  matchId: string | null
  winner: string | null
}

export interface Tournament {
  id: string
  name: string
  createdAt: string
  status: TournamentStatus
  /** Порядок участников задаёт посев в сетке. */
  participants: string[]
  bracket: BracketSlot[]
  winner: string | null
  finishedAt: string | null
}

/** Действующий чемпион: назначен вручную или победитель последнего турнира — побеждает более позднее событие. */
export interface Champion {
  name: string
  since: string
  source: 'manual' | 'tournament'
}
