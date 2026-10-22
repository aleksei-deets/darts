import type { DartThrow } from './types'

const OUTER_BULL = 25
const BULLSEYE = 50

/** 50 всегда означает «яблочко» как D25, потому что иначе им нельзя было бы закрыться при закрытии удвоением. */
export function createThrow(value: number, multiplier: number): DartThrow {
  return value === BULLSEYE
    ? { zone: OUTER_BULL, multiplier: 2 }
    : { zone: value, multiplier }
}

export function throwScore(dart: DartThrow): number {
  return dart.zone * dart.multiplier
}

export function turnScore(throws: readonly DartThrow[]): number {
  return throws.reduce((sum, dart) => sum + throwScore(dart), 0)
}

export function formatThrow(dart: DartThrow): string {
  if (dart.multiplier === 2) return `D${dart.zone}`
  if (dart.multiplier === 3) return `T${dart.zone}`
  return `${dart.zone}`
}
