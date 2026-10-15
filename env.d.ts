/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL Realtime Database для облачного удалённого транспорта.
   * Если пусто, Firebase-транспорт скрыт и остаётся только P2P.
   */
  readonly VITE_FIREBASE_DATABASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
