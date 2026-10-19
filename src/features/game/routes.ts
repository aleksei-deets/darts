import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/router/routeNames'
import { useGameStore } from './stores/gameStore'

export const gameRoutes: RouteRecordRaw[] = [
  {
    path: 'game',
    component: () => import('./layouts/GameLayout.vue'),
    children: [
      {
        path: '',
        name: RouteName.GamePlay,
        component: () => import('./pages/GamePlayPage.vue'),
        beforeEnter: () => {
          if (!useGameStore().isGameStarted) return { name: RouteName.GameSetup }
        },
      },
      {
        path: 'new',
        name: RouteName.GameSetup,
        component: () => import('./pages/GameSetupPage.vue'),
        beforeEnter: () => {
          if (useGameStore().isGameStarted) return { name: RouteName.GamePlay }
        },
      },
    ],
  },
]
