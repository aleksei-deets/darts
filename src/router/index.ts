import { createRouter, createWebHashHistory } from 'vue-router'
import GameView from '@/views/GameView.vue'

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
      name: 'game',
      component: GameView
    },
    {
      path: '/remote',
      name: 'remote',
      component: () => import('@/views/RemoteView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'game' }
    }
  ]
})
