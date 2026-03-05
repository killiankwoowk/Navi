/**
 * Parses .lrc formatted text into sorted timeline entries.
 */
export function parseLrc(lrcText: string) {
  const lines = lrcText.split(/\r?\n/)
  const entries: { time: number; text: string }[] = []
  const timeTag = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g
  for (const line of lines) {
    let match
    const tags = []
    timeTag.lastIndex = 0
    while ((match = timeTag.exec(line)) !== null) {
      const min = Number(match[1])
      const sec = Number(match[2])
      const ms = match[3] ? Number(match[3].padEnd(3, '0')) : 0
      tags.push(min * 60 * 1000 + sec * 1000 + ms)
    }
    const text = line.replace(timeTag, '').trim()
    for (const t of tags) {
      entries.push({ time: t, text })
    }
  }
  entries.sort((a, b) => a.time - b.time)
  return entries
}
