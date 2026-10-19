export const RouteName = {
  Menu: 'menu',
  GameSetup: 'game-setup',
  GamePlay: 'game-play',
  Tournament: 'tournament',
  Statistics: 'statistics',
  Remote: 'remote',
} as const

export type RouteName = (typeof RouteName)[keyof typeof RouteName]
