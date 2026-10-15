import type { RemoteTransport, RemoteTransportKind } from '@/types/remote'
import { createPeerjsTransport } from './peerjsTransport'
import { createFirebaseTransport } from './firebaseTransport'
import { FIREBASE_DATABASE_URL, isFirebaseAvailable } from './config'

export function createRemoteTransport(kind: RemoteTransportKind): RemoteTransport {
  if (kind === 'firebase') {
    if (!isFirebaseAvailable) {
      throw new Error('VITE_FIREBASE_DATABASE_URL is not configured')
    }
    return createFirebaseTransport(FIREBASE_DATABASE_URL)
  }
  return createPeerjsTransport()
}

export {
  AVAILABLE_TRANSPORT_KINDS,
  DEFAULT_TRANSPORT_KIND,
  isFirebaseAvailable,
  normalizeTransportKind
} from './config'
export { buildRemoteUrl, generateRoomId } from './room'
