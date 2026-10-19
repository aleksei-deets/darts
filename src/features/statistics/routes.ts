import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/router/routeNames'

export const statisticsRoutes: RouteRecordRaw[] = [
  {
    path: 'statistics',
    name: RouteName.Statistics,
    component: () => import('./pages/StatisticsPage.vue'),
  },
]
