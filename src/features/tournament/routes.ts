import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/router/routeNames'

export const tournamentRoutes: RouteRecordRaw[] = [
  {
    path: 'tournament',
    name: RouteName.Tournament,
    component: () => import('./pages/TournamentPage.vue'),
  },
]
