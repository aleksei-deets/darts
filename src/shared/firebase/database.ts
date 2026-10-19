import type { Database } from 'firebase/database'
import { FIREBASE_DATABASE_URL, isFirebaseAvailable } from './config'

/** Именованное приложение, чтобы не пересечься с дефолтным Firebase app. */
const APP_NAME = 'darts'

let databasePromise: Promise<Database> | null = null

async function initDatabase(): Promise<Database> {
  const [{ initializeApp, getApp, getApps }, { getDatabase }] = await Promise.all([
    import('firebase/app'),
    import('firebase/database'),
  ])

  const app = getApps().some((existing) => existing.name === APP_NAME)
    ? getApp(APP_NAME)
    : initializeApp({ databaseURL: FIREBASE_DATABASE_URL }, APP_NAME)

  return getDatabase(app)
}

/**
 * Единая точка доступа к Realtime Database для всех фич.
 * `firebase` подключается лениво, чтобы не попадать в начальный чанк.
 */
export function getFirebaseDatabase(): Promise<Database> {
  if (!isFirebaseAvailable) {
    return Promise.reject(new Error('VITE_FIREBASE_DATABASE_URL is not configured'))
  }

  databasePromise ??= initDatabase().catch((error: unknown) => {
    databasePromise = null
    throw error
  })
  return databasePromise
}
