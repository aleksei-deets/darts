export type RemoteTransportKind = 'peerjs' | 'firebase'

export type RemoteRole = 'host' | 'client'

export type RemoteStatus = 'idle' | 'connecting' | 'connected' | 'error'

export type RemoteMessage =
  | { type: 'score'; value: number }
  | { type: 'action'; value: 'undo' }

export interface RemoteTransportHooks {
  onMessage?: (message: RemoteMessage) => void
  onDisconnect?: () => void
}

export interface RemoteTransport {
  readonly kind: RemoteTransportKind
  /** Сторона десктопа:
   * занять комнату и принимать броски с телефона. */
  listen(roomId: string, hooks: RemoteTransportHooks): Promise<void>
  /** Сторона телефона:
   * подключиться к существующей комнате, чтобы send() доходил до десктопа. */
  join(roomId: string, hooks?: RemoteTransportHooks): Promise<void>
  send(message: RemoteMessage): Promise<void>
  destroy(): void
}

/**
 * Полезная нагрузка приходит от недоверенного сетевого пира,
 * поэтому каждое поле проверяется до попадания в состояние игры.
 */
export function isRemoteMessage(raw: unknown): raw is RemoteMessage {
  if (typeof raw !== 'object' || raw === null) return false
  const candidate = raw as Record<string, unknown>

  if (candidate.type === 'score') {
    return typeof candidate.value === 'number' && Number.isFinite(candidate.value)
  }
  if (candidate.type === 'action') {
    return candidate.value === 'undo'
  }
  return false
}
