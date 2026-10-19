import { onMounted, onUnmounted } from 'vue'
import { useRemoteStore } from '../stores/remoteStore'

/** Держит комнату пульта открытой, пока смонтирован вызывающий компонент. */
export function useRemoteHost(): void {
  const remote = useRemoteStore()

  onMounted(() => {
    // Сразу занимаем комнату, чтобы QR-код можно было сканировать без лишних шагов.
    void remote.hostSession()
  })

  onUnmounted(() => {
    remote.teardown()
  })
}
