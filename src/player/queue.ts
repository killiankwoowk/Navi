import type { QueueItem, RepeatMode, Song } from '@/api/types'

const createQueueId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const makeQueueItems = (tracks: Song[]): QueueItem[] =>
  tracks.map((track) => ({
    queueId: createQueueId(),
    track,
  }))

export const reorderQueueItems = (queue: QueueItem[], fromIndex: number, toIndex: number): QueueItem[] => {
  const clone = [...queue]
  const [removed] = clone.splice(fromIndex, 1)
  clone.splice(toIndex, 0, removed)
  return clone
}

export const buildShuffleOrder = (length: number, currentIndex: number): number[] => {
  const rest = Array.from({ length }, (_, index) => index).filter((index) => index !== currentIndex)
  for (let i = rest.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[rest[i], rest[j]] = [rest[j], rest[i]]
  }
  return [currentIndex, ...rest]
}

export const resolveNextIndex = (
  currentIndex: number,
  length: number,
  repeat: RepeatMode,
  shuffle: boolean,
  shuffleOrder: number[],
): number => {
  if (length === 0) return -1
  if (repeat === 'one') return currentIndex

  if (shuffle && shuffleOrder.length === length) {
    const shufflePos = shuffleOrder.indexOf(currentIndex)
    const nextPos = shufflePos + 1
    if (nextPos < shuffleOrder.length) return shuffleOrder[nextPos]
    return repeat === 'all' ? shuffleOrder[0] : -1
  }

  const next = currentIndex + 1
  if (next < length) return next
  return repeat === 'all' ? 0 : -1
}

export const resolvePreviousIndex = (
  currentIndex: number,
  length: number,
  repeat: RepeatMode,
  shuffle: boolean,
  shuffleOrder: number[],
): number => {
  if (length === 0) return -1

  if (shuffle && shuffleOrder.length === length) {
    const shufflePos = shuffleOrder.indexOf(currentIndex)
    const prevPos = shufflePos - 1
    if (prevPos >= 0) return shuffleOrder[prevPos]
    return repeat === 'all' ? shuffleOrder[shuffleOrder.length - 1] : currentIndex
  }

  const prev = currentIndex - 1
  if (prev >= 0) return prev
  return repeat === 'all' ? length - 1 : currentIndex
}
