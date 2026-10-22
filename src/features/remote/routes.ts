import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/router/routeNames'

/** Путь `/remote` зашит в QR-ссылку (см. `buildRemoteUrl`), поэтому он должен оставаться стабильным. */
export const remoteRoutes: RouteRecordRaw[] = [
  {
    path: '/remote',
    name: RouteName.Remote,
    component: () => import('./pages/RemotePage.vue'),
  },
]
