import type { RemoteTransportKind } from '../types'
import { isFirebaseAvailable } from '@/shared/firebase/config'

export { isFirebaseAvailable }

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
