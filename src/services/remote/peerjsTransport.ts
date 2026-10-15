import type { DataConnection, Peer } from 'peerjs'
import type { RemoteMessage, RemoteTransport } from '@/types/remote'
import { isRemoteMessage } from '@/types/remote'

/**
 * Browser-to-browser transport. Десктоп занимает `roomId` как свой peer id,
 * и телефон может позвонить ему без серверного реестра сессий.
 *
 * `peerjs` подключается лениво, чтобы не попадать в начальный чанк.
 */
export function createPeerjsTransport(): RemoteTransport {
  let peer: Peer | null = null
  let connection: DataConnection | null = null

  function reset(): void {
    connection?.close()
    connection = null
    peer?.destroy()
    peer = null
  }

  async function createPeer(id?: string): Promise<Peer> {
    const { default: PeerConstructor } = await import('peerjs')
    return id ? new PeerConstructor(id) : new PeerConstructor()
  }

  return {
    kind: 'peerjs',

    async listen(roomId, hooks) {
      reset()
      const instance = await createPeer(roomId)
      peer = instance

      instance.on('connection', conn => {
        conn.on('data', raw => {
          if (isRemoteMessage(raw)) hooks.onMessage?.(raw)
        })
      })

      await new Promise<void>((resolve, reject) => {
        instance.once('open', () => resolve())
        instance.once('error', error => reject(error))
      })
    },

    async join(roomId, hooks) {
      reset()
      const instance = await createPeer()
      peer = instance

      await new Promise<void>((resolve, reject) => {
        instance.once('error', error => reject(error))
        instance.once('open', () => {
          const conn = instance.connect(roomId)
          connection = conn
          conn.once('open', () => resolve())
          conn.once('error', error => reject(error))
          conn.once('close', () => hooks?.onDisconnect?.())
        })
      })
    },

    async send(message: RemoteMessage) {
      if (!connection?.open) {
        throw new Error('PeerJS connection is not open')
      }
      connection.send(message)
    },

    destroy: reset
  }
}
