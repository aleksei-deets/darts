import type { RemoteTransport, RemoteTransportKind } from '../types'
import { createPeerjsTransport } from './peerjsTransport'
import { createFirebaseTransport } from './firebaseTransport'
import { isFirebaseAvailable } from './config'

export function createRemoteTransport(kind: RemoteTransportKind): RemoteTransport {
  if (kind === 'firebase') {
    if (!isFirebaseAvailable) {
      throw new Error('VITE_FIREBASE_DATABASE_URL is not configured')
    }
    return createFirebaseTransport()
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
