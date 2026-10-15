import type { RemoteTransportKind } from '@/types/remote'

export function generateRoomId(): string {
  const suffix = Math.random().toString(36).slice(2, 6)
  return `darts-${Date.now()}-${suffix}`
}

/**
 * Ссылка, зашитая в QR-код.
 * Собирается вручную, а не через роутер,
 * чтобы сервисный слой не зависел от таблицы маршрутов.
 * Соответствует hash-history маршруту `/remote`.
 */
export function buildRemoteUrl(roomId: string, transport: RemoteTransportKind): string {
  const query = new URLSearchParams({ room: roomId, transport })
  const { origin } = window.location
  return `${origin}${import.meta.env.BASE_URL}#/remote?${query.toString()}`
}
