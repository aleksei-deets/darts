export const FIREBASE_DATABASE_URL = (
  import.meta.env.VITE_FIREBASE_DATABASE_URL ?? ''
).trim()

/** Без URL базы данных облачные функции (Cloud-транспорт, архив) недоступны. */
export const isFirebaseAvailable = FIREBASE_DATABASE_URL.length > 0
