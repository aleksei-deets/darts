import type { MatchRecord } from './types'

export interface MatchRepository {
  list(): Promise<MatchRecord[]>
  save(record: MatchRecord): Promise<void>
  remove(id: string): Promise<void>
}
