/** Игрок идентифицируется по имени без учёта регистра и лишних пробелов. */
export function playerKey(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}
