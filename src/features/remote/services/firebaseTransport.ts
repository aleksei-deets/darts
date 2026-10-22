import type { Unsubscribe } from 'firebase/database'
import type {
  RemoteMessage,
  RemoteTransport,
  RemoteTransportHooks
} from '../types'
import { isRemoteMessage } from '../types'
import { getFirebaseDatabase } from '@/shared/firebase/database'

const sessionPath = (roomId: string) => `sessions/${roomId}`

/**
 * Облачный relay-транспорт:
 * телефон пишет последний бросок в `sessions/<roomId>`, а десктоп подписан на этот узел.
 * Полезно, когда мобильные или корпоративные сети блокируют WebRTC hole punching для PeerJS.
 *
 * `firebase` подключается лениво, чтобы не попадать в начальный чанк.
 */
export function createFirebaseTransport(): RemoteTransport {
  let unsubscribe: Unsubscribe | null = null
  let roomPath = ''

  function reset(): void {
    unsubscribe?.()
    unsubscribe = null
    roomPath = ''
  }

  return {
    kind: 'firebase',

    async listen(roomId, hooks: RemoteTransportHooks) {
      reset()
      const db = await getFirebaseDatabase()
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
      await getFirebaseDatabase()
      roomPath = sessionPath(roomId)
    },

    async send(message: RemoteMessage) {
      if (!roomPath) {
        throw new Error('Firebase transport has no active room')
      }
      const db = await getFirebaseDatabase()
      const { ref, set } = await import('firebase/database')
      await set(ref(db, roomPath), { ...message, ts: Date.now() })
    },

    destroy: reset
  }
}
