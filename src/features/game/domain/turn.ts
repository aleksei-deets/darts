import type { DartThrow } from './types'
import { turnScore } from './throws'

export type TurnOutcome = 'scored' | 'checkout' | 'bust'

/** Промахи после дабла не отменяют закрытие удвоением. */
function lastScoringThrow(throws: readonly DartThrow[]): DartThrow | undefined {
  return throws.filter((dart) => dart.zone !== 0).at(-1)
}

export function evaluateTurn(
  score: number,
  throws: readonly DartThrow[],
  endWithDouble: boolean,
): TurnOutcome {
  const remaining = score - turnScore(throws)
  const minRemaining = endWithDouble ? 1 : 0

  if (remaining > minRemaining) return 'scored'

  if (
    remaining === 0 &&
    (!endWithDouble || lastScoringThrow(throws)?.multiplier === 2)
  ) {
    return 'checkout'
  }

  return 'bust'
}
