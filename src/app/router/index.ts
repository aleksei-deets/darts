import { createRouter, createWebHashHistory } from 'vue-router'
import { RouteName } from '@/shared/router/routeNames'
import { menuRoutes } from '@/features/menu/routes'
import { gameRoutes } from '@/features/game/routes'
import { tournamentRoutes } from '@/features/tournament/routes'
import { statisticsRoutes } from '@/features/statistics/routes'
import { remoteRoutes } from '@/features/remote/routes'
import AppLayout from '../layouts/AppLayout.vue'

/**
 * Hash history:
 * приложение отдаётся с GitHub Pages без SPA fallback,
 * поэтому path-based ссылка `/remote` дала бы 404 при прямом открытии QR-кода.
 */
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        ...menuRoutes,
        ...gameRoutes,
        ...tournamentRoutes,
        ...statisticsRoutes,
      ],
    },
    ...remoteRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: RouteName.Menu },
    },
  ],
})
