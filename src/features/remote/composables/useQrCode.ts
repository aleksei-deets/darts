import { shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'

/**
 * Рендерит `source` в data URL QR-кода.
 * Пакет `qrcode` подключается лениво.
 */
export function useQrCode(source: MaybeRefOrGetter<string>, size = 140) {
  const dataUrl = shallowRef('')
  const error = shallowRef('')

  // Отбрасывает результат рендера, который уже устарел относительно нового source.
  let renderToken = 0

  watch(
    () => toValue(source),
    async value => {
      const token = ++renderToken
      error.value = ''

      if (!value) {
        dataUrl.value = ''
        return
      }

      try {
        const { toDataURL } = await import('qrcode')
        const result = await toDataURL(value, { width: size, margin: 1 })
        if (token === renderToken) dataUrl.value = result
      } catch (cause) {
        if (token !== renderToken) return
        dataUrl.value = ''
        error.value = cause instanceof Error ? cause.message : String(cause)
      }
    },
    { immediate: true }
  )

  return { dataUrl, error }
}
