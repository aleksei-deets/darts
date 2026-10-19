import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/router/routeNames'
import MainMenuPage from './pages/MainMenuPage.vue'

export const menuRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: RouteName.Menu,
    component: MainMenuPage,
  },
]
