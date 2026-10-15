import type { Database, Unsubscribe } from 'firebase/database'
import type {
  RemoteMessage,
  RemoteTransport,
  RemoteTransportHooks
} from '@/types/remote'
import { isRemoteMessage } from '@/types/remote'

/** Именованное приложение, чтобы не пересечься с дефолтным Firebase app. */
const APP_NAME = 'darts-remote'

const sessionPath = (roomId: string) => `sessions/${roomId}`

/**
 * Облачный relay-транспорт:
 * телефон пишет последний бросок в `sessions/<roomId>`, а десктоп подписан на этот узел.
 * Полезно, когда мобильные или корпоративные сети блокируют WebRTC hole punching для PeerJS.
 *
 * `firebase` подключается лениво, чтобы не попадать в начальный чанк.
 */
export function createFirebaseTransport(databaseUrl: string): RemoteTransport {
  let database: Database | null = null
  let unsubscribe: Unsubscribe | null = null
  let roomPath = ''

  function reset(): void {
    unsubscribe?.()
    unsubscribe = null
    roomPath = ''
  }

  async function getDatabaseHandle(): Promise<Database> {
    if (database) return database

    const [{ initializeApp, getApp, getApps }, { getDatabase }] = await Promise.all([
      import('firebase/app'),
      import('firebase/database')
    ])

    const app = getApps().some(existing => existing.name === APP_NAME)
      ? getApp(APP_NAME)
      : initializeApp({ databaseURL: databaseUrl }, APP_NAME)

    database = getDatabase(app)
    return database
  }

  return {
    kind: 'firebase',

    async listen(roomId, hooks: RemoteTransportHooks) {
      reset()
      const db = await getDatabaseHandle()
      const { ref, onValue } = await import('firebase/database')

      roomPath = sessionPath(roomId)

      // Узел хранит последнее сообщение постоянно, поэтому всё, что было записано до подписки, игнорируем,
      // иначе повторится старый бросок.
      let lastSeenTs = Date.now()

      unsubscribe = onValue(ref(db, roomPath), snapshot => {
        const payload: unknown = snapshot.val()
        if (typeof payload !== 'object' || payload === null) return

        const { ts } = payload as { ts?: unknown }
        if (typeof ts !== 'number' || ts <= lastSeenTs) return

        lastSeenTs = ts
        if (isRemoteMessage(payload)) hooks.onMessage?.(payload)
      })
    },

    async join(roomId) {
      reset()
      await getDatabaseHandle()
      roomPath = sessionPath(roomId)
    },

    async send(message: RemoteMessage) {
      if (!roomPath) {
        throw new Error('Firebase transport has no active room')
      }
      const db = await getDatabaseHandle()
      const { ref, set } = await import('firebase/database')
      await set(ref(db, roomPath), { ...message, ts: Date.now() })
    },

    destroy: reset
  }
}
