export interface ScoreRange {
  min: number
  max: number
  avg: number
}

export interface PlayerMatchStatistics {
  name: string
  turnScore: ScoreRange
  roundsToFinish: number | null
}

export interface MatchStatistics {
  matchId: string
  players: PlayerMatchStatistics[]
  turnScore: ScoreRange
  roundsToFinish: ScoreRange | null
}

export interface PlayerRecord {
  name: string
  value: number
  matchId: string
  playedAt: string
}

export interface OverallStatistics {
  gamesPlayed: number
  topWinner: { name: string; wins: number } | null
  highestTurn: PlayerRecord | null
  fastestCheckout: PlayerRecord | null
  highestCheckout: PlayerRecord | null
}

/** Рейтинг регулярной игры: партии `casual`, сыгранные после завершения последнего турнира. */
export interface RatingEntry {
  name: string
  points: number
}
