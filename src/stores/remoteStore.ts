import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'
import type {
  RemoteMessage,
  RemoteRole,
  RemoteStatus,
  RemoteTransport,
  RemoteTransportKind
} from '@/types/remote'
import {
  AVAILABLE_TRANSPORT_KINDS,
  buildRemoteUrl,
  createRemoteTransport,
  generateRoomId,
  isFirebaseAvailable,
  normalizeTransportKind
} from '@/services/remote'
import { useGameStore } from './gameStore'

// Ключи совпадают с прежней сборкой, чтобы существующие сессии не сбрасывались.
const STORAGE_KEY_ROOM = 'darts_session_id'
const STORAGE_KEY_TRANSPORT = 'darts_transport'

export const useRemoteStore = defineStore('remote', () => {
  const transportKind = shallowRef<RemoteTransportKind>(
    normalizeTransportKind(localStorage.getItem(STORAGE_KEY_TRANSPORT))
  )
  const roomId = shallowRef(localStorage.getItem(STORAGE_KEY_ROOM) ?? '')
  const status = shallowRef<RemoteStatus>('idle')
  const role = shallowRef<RemoteRole | null>(null)
  const errorMessage = shallowRef('')
  const lastSentScore = shallowRef<number | null>(null)

  // Транспорт — обычный объект с таймерами и сокетами внутри,
  // поэтому его намеренно не кладём в реактивный граф.
  let transport: RemoteTransport | null = null
  // Защита от того, что медленный connect() завершится после более нового.
  let connectionToken = 0

  const remoteUrl = computed(() =>
    roomId.value ? buildRemoteUrl(roomId.value, transportKind.value) : ''
  )

  const isConnected = computed(() => status.value === 'connected')

  function persistRoom(): void {
    localStorage.setItem(STORAGE_KEY_ROOM, roomId.value)
  }

  function applyIncoming(message: RemoteMessage): void {
    const game = useGameStore()
    if (message.type === 'score') {
      // Телефон уже присылает итоговое значение одного броска,
      // поэтому десктопный множитель сверху применять нельзя.
      game.addScore(message.value, 1)
      return
    }
    game.undoLastThrow()
  }

  function teardown(): void {
    connectionToken++
    transport?.destroy()
    transport = null
    status.value = 'idle'
    role.value = null
  }

  async function connect(nextRole: RemoteRole): Promise<void> {
    teardown()

    if (!roomId.value) roomId.value = generateRoomId()
    persistRoom()

    const token = ++connectionToken
    status.value = 'connecting'
    errorMessage.value = ''
    role.value = nextRole

    try {
      const instance = createRemoteTransport(transportKind.value)
      transport = instance

      if (nextRole === 'host') {
        await instance.listen(roomId.value, { onMessage: applyIncoming })
      } else {
        await instance.join(roomId.value, {
          onDisconnect: () => {
            if (token === connectionToken) status.value = 'idle'
          }
        })
      }

      if (token !== connectionToken) {
        instance.destroy()
        return
      }
      status.value = 'connected'
    } catch (error) {
      if (token !== connectionToken) return
      transport?.destroy()
      transport = null
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : String(error)
    }
  }

  /** Десктоп: занять комнату и принимать броски с телефона. */
  function hostSession(): Promise<void> {
    return connect('host')
  }

  /** Телефон: подключиться к комнате из QR-ссылки. */
  function joinSession(options: {
    roomId?: string
    transport?: RemoteTransportKind
  }): Promise<void> {
    if (options.transport) {
      transportKind.value = normalizeTransportKind(options.transport)
      localStorage.setItem(STORAGE_KEY_TRANSPORT, transportKind.value)
    }
    if (options.roomId) {
      roomId.value = options.roomId
      persistRoom()
    }
    return connect('client')
  }

  async function setTransportKind(kind: RemoteTransportKind): Promise<void> {
    const next = normalizeTransportKind(kind)
    if (next === transportKind.value) return

    transportKind.value = next
    localStorage.setItem(STORAGE_KEY_TRANSPORT, next)

    const currentRole = role.value
    if (currentRole) await connect(currentRole)
  }

  /** Сбрасывает прежний QR-код; телефоны со старой ссылкой больше не могут достучатся. */
  async function regenerateRoom(): Promise<void> {
    roomId.value = generateRoomId()
    persistRoom()
    await connect(role.value ?? 'host')
  }

  async function send(message: RemoteMessage): Promise<void> {
    if (!transport) return
    try {
      await transport.send(message)
    } catch (error) {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : String(error)
    }
  }

  async function sendScore(value: number): Promise<void> {
    if (!Number.isFinite(value)) return
    await send({ type: 'score', value })
    lastSentScore.value = value
  }

  function sendUndo(): Promise<void> {
    return send({ type: 'action', value: 'undo' })
  }

  return {
    transportKind,
    roomId,
    status,
    role,
    errorMessage,
    lastSentScore,

    remoteUrl,
    isConnected,
    availableTransports: AVAILABLE_TRANSPORT_KINDS,
    isFirebaseAvailable,

    hostSession,
    joinSession,
    setTransportKind,
    regenerateRoom,
    sendScore,
    sendUndo,
    teardown
  }
})
