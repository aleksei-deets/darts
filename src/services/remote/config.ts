import type { RemoteTransportKind } from '@/types/remote'

export const FIREBASE_DATABASE_URL = (
  import.meta.env.VITE_FIREBASE_DATABASE_URL ?? ''
).trim()

/** Без URL базы данных опция Cloud не показывается вообще. */
export const isFirebaseAvailable = FIREBASE_DATABASE_URL.length > 0

export const DEFAULT_TRANSPORT_KIND: RemoteTransportKind = 'peerjs'

export const AVAILABLE_TRANSPORT_KINDS: RemoteTransportKind[] = isFirebaseAvailable
  ? ['peerjs', 'firebase']
  : ['peerjs']

export function isTransportKind(value: unknown): value is RemoteTransportKind {
  return value === 'peerjs' || value === 'firebase'
}

export function normalizeTransportKind(value: unknown): RemoteTransportKind {
  if (!isTransportKind(value)) return DEFAULT_TRANSPORT_KIND
  return AVAILABLE_TRANSPORT_KINDS.includes(value) ? value : DEFAULT_TRANSPORT_KIND
}
